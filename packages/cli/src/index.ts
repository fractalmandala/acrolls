#!/usr/bin/env node
import { mkdir } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { compile } from 'mdsvex';
import { createAcrollsMdsvexOptions, renderAcrollsArticleHtml } from '@acrolls/mdsvex';
import { parseArgs, exists } from './util.js';
import { cmdIntegrate, detectHost } from './integrate.js';
import { cmdStudio } from './studio.js';

const VERSION = '0.1.1';

function help() {
  console.log(`acrolls ${VERSION}

Usage:
  acrolls                        Show project state
  acrolls init [--content-dir <path>] [--dry-run] [--yes]
  acrolls integrate [--dry-run] [--mode foundation|default] [--yes]
  acrolls validate <file.md|file.svx> [--strict]
  acrolls studio <file.md|file.svx> [--port <n>] [--no-open] [--mode foundation|default]
  acrolls --help
  acrolls --version
`);
}

async function cmdInit(args: ReturnType<typeof parseArgs>) {
  const dry = Boolean(args.flags['dry-run']);
  const contentDir = String(args.flags['content-dir'] ?? 'content/blog');
  const root = process.cwd();
  const abs = resolve(root, contentDir);

  if (dry) {
    console.log(`[dry-run] would create ${relative(root, abs) || contentDir}`);
    return 0;
  }
  await mkdir(abs, { recursive: true });
  console.log(`Created content launchpad: ${relative(root, abs) || contentDir}`);
  console.log('No article generated — write a .md or .svx file when ready.');
  return 0;
}

async function cmdValidate(args: ReturnType<typeof parseArgs>) {
  const file = args._[1];
  if (!file) {
    console.error('Usage: acrolls validate <file.md|file.svx> [--strict]');
    return 2;
  }
  const abs = resolve(process.cwd(), file);
  if (!(await exists(abs))) {
    console.error(`File not found: ${file}`);
    return 1;
  }
  const strict = Boolean(args.flags.strict);
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(abs, 'utf8');
  try {
    const result = await compile(source, {
      filename: abs,
      ...createAcrollsMdsvexOptions({ strict, extensions: ['.svx', '.md'] })
    } as never);
    if (!result || !result.code) {
      console.error('Validation failed: empty mdsvex compile result');
      return 1;
    }
    // Also exercise HTML pipeline (Studio parity)
    await renderAcrollsArticleHtml(source, { strict });
    console.log(`OK ${file} (mdsvex ${result.code.length} chars + html pipeline)`);
    return 0;
  } catch (err) {
    console.error(`FAIL ${file}`);
    console.error(err instanceof Error ? err.message : err);
    return 1;
  }
}

async function cmdStatus() {
  const host = await detectHost(process.cwd());
  console.log(`acrolls ${VERSION}`);
  console.log(`cwd: ${process.cwd()}`);
  console.log(`host: ${host.kind}`);
  if ('hasKit' in host) {
    console.log(`sveltekit: ${host.hasKit}`);
    console.log(`mdsvex: ${host.hasMdsvex}`);
    console.log(`acrolls deps: ${host.hasAcrolls}`);
    console.log(`svelte config: ${host.svelteConfig ?? 'none'}`);
    console.log(`layout: ${host.layout ?? 'none'}`);
  }
  console.log('Run `acrolls --help` for commands.');
  return 0;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.flags.help || args.flags.h) {
    help();
    process.exit(0);
  }
  if (args.flags.version || args.flags.v) {
    console.log(VERSION);
    process.exit(0);
  }

  const cmd = args._[0];
  let code = 0;
  try {
    if (!cmd) code = await cmdStatus();
    else if (cmd === 'init') code = await cmdInit(args);
    else if (cmd === 'integrate') code = await cmdIntegrate(args);
    else if (cmd === 'validate') code = await cmdValidate(args);
    else if (cmd === 'studio') code = await cmdStudio(args);
    else {
      console.error(`Unknown command: ${cmd}`);
      help();
      code = 2;
    }
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    code = 1;
  }
  process.exit(code);
}

main();
