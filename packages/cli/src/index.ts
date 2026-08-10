#!/usr/bin/env node
import { mkdir, readFile, writeFile, access, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join, resolve, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { compile } from 'mdsvex';
import { createAcrollsMdsvexOptions } from '@acrolls/mdsvex';

const VERSION = '0.1.0';

type Args = {
  _: string[];
  flags: Record<string, string | boolean>;
};

function parseArgs(argv: string[]): Args {
  const out: Args = { _: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === '--') continue;
    if (a.startsWith('--')) {
      const body = a.slice(2);
      if (body.includes('=')) {
        const [k, v] = body.split('=');
        out.flags[k!] = v ?? true;
      } else {
        const next = argv[i + 1];
        if (next && !next.startsWith('-')) {
          out.flags[body] = next;
          i++;
        } else {
          out.flags[body] = true;
        }
      }
    } else if (a.startsWith('-') && a.length === 2) {
      out.flags[a.slice(1)] = true;
    } else {
      out._.push(a);
    }
  }
  return out;
}

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

async function exists(path: string) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function cmdInit(args: Args) {
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

async function detectHost(root: string) {
  const pkgPath = join(root, 'package.json');
  if (!(await exists(pkgPath))) {
    return { kind: 'unknown' as const, pkg: null as null | Record<string, unknown> };
  }
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8')) as Record<string, unknown>;
  const deps = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    ...(pkg.devDependencies as Record<string, string> | undefined)
  };
  const hasKit = Boolean(deps['@sveltejs/kit']);
  const hasMdsvex = Boolean(deps['mdsvex']);
  const hasSvelte = Boolean(deps['svelte']);
  return {
    kind: hasKit ? ('sveltekit' as const) : hasSvelte ? ('svelte' as const) : ('node' as const),
    pkg,
    deps,
    hasKit,
    hasMdsvex,
    hasSvelte,
    svelteConfig: (await exists(join(root, 'svelte.config.js')))
      ? 'svelte.config.js'
      : (await exists(join(root, 'svelte.config.ts')))
        ? 'svelte.config.ts'
        : null
  };
}

async function cmdIntegrate(args: Args) {
  const dry = Boolean(args.flags['dry-run']);
  const mode = String(args.flags.mode ?? 'default');
  if (!['foundation', 'default'].includes(mode)) {
    console.error('Invalid --mode. Use foundation or default.');
    return 2;
  }
  const root = process.cwd();
  const host = await detectHost(root);

  const plan = [
    'Install: @acrolls/svelte @acrolls/styles @acrolls/mdsvex @acrolls/sveltekit',
    'Install dev: @acrolls/cli mdsvex (if missing)',
    host.svelteConfig
      ? `Wire mdsvex(createAcrollsSvelteKitMdsvexOptions()) in ${host.svelteConfig}`
      : 'Create svelte.config.js with mdsvex + Acrolls options',
    `Import @acrolls/styles/${mode}.css in src/routes/+layout.svelte (or root layout)`,
    'Add extensions .svx, .md to svelte.config'
  ];

  console.log(`Host: ${host.kind}`);
  console.log(`Mode: ${mode}`);
  console.log('Plan:');
  plan.forEach((p, i) => console.log(`  ${i + 1}. ${p}`));

  if (dry) {
    console.log('\n[dry-run] no files changed');
    return 0;
  }

  if (!args.flags.yes) {
    console.log('\nApply is interactive in v0 only with --yes (non-interactive apply).');
    console.log('Re-run with --yes to write a minimal svelte.config.js fragment guide, or apply manually.');
    console.log('Recommended packages:\n  pnpm add @acrolls/svelte @acrolls/styles @acrolls/mdsvex @acrolls/sveltekit\n  pnpm add -D @acrolls/cli mdsvex');
    return 0;
  }

  const guide = join(root, 'ACROLLS.integrate.md');
  await writeFile(
    guide,
    `# Acrolls integrate plan\n\nMode: **${mode}**\n\n## Packages\n\n\`\`\`bash\npnpm add @acrolls/svelte @acrolls/styles @acrolls/mdsvex @acrolls/sveltekit\npnpm add -D @acrolls/cli mdsvex\n\`\`\`\n\n## svelte.config.js\n\n\`\`\`js\nimport { vitePreprocess } from '@sveltejs/vite-plugin-svelte';\nimport { mdsvex } from 'mdsvex';\nimport adapter from '@sveltejs/adapter-auto';\nimport { createAcrollsSvelteKitMdsvexOptions } from '@acrolls/sveltekit';\n\n/** @type {import('@sveltejs/kit').Config} */\nconst config = {\n  extensions: ['.svelte', '.svx', '.md'],\n  preprocess: [vitePreprocess(), mdsvex(createAcrollsSvelteKitMdsvexOptions())],\n  kit: { adapter: adapter() }\n};\nexport default config;\n\`\`\`\n\n## Layout\n\n\`\`\`js\nimport '@acrolls/styles/${mode}.css';\n\`\`\`\n`,
    'utf8'
  );
  console.log(`Wrote ${relative(root, guide)}`);
  return 0;
}

async function cmdValidate(args: Args) {
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
  const source = await readFile(abs, 'utf8');
  const ext = extname(abs);
  try {
    const result = await compile(source, {
      filename: abs,
      ...createAcrollsMdsvexOptions({ strict, extensions: ['.svx', '.md'] })
    } as never);
    if (!result || !result.code) {
      console.error('Validation failed: empty compile result');
      return 1;
    }
    console.log(`OK ${file} (${result.code.length} chars compiled)`);
    return 0;
  } catch (err) {
    console.error(`FAIL ${file}`);
    console.error(err instanceof Error ? err.message : err);
    return 1;
  }
}

async function cmdStudio(args: Args) {
  const file = args._[1];
  if (!file) {
    console.error('Usage: acrolls studio <file.md|file.svx> [--port 4317] [--no-open]');
    return 2;
  }
  const abs = resolve(process.cwd(), file);
  if (!(await exists(abs))) {
    console.error(`File not found: ${file}`);
    return 1;
  }
  const mode = String(args.flags.mode ?? 'default');
  let port = Number(args.flags.port ?? 4317);
  if (!Number.isFinite(port) || port <= 0) port = 4317;

  const stylesPkg = await resolvePackageDir('@acrolls/styles');

  async function renderPage(): Promise<string> {
    const source = await readFile(abs, 'utf8');
    let compiled = '';
    let error = '';
    try {
      const result = await compile(source, {
        filename: abs,
        ...createAcrollsMdsvexOptions({ extensions: ['.svx', '.md'] })
      } as never);
      compiled = result?.code ?? '';
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }

    // Studio v0: show source + compile diagnostics + HTML-ish preview of code string
    // (full Svelte component execution needs kit; v0 is source-authoritative preview shell)
    const cssHref =
      mode === 'foundation'
        ? fileURLToPath(new URL('../../styles/foundation.css', import.meta.url))
        : fileURLToPath(new URL('../../styles/default.css', import.meta.url));

    // Prefer resolved package path
    let css = '';
    try {
      const cssPath = join(
        stylesPkg ?? dirname(cssHref),
        mode === 'foundation' ? 'foundation.css' : 'default.css'
      );
      css = await readFile(cssPath, 'utf8');
    } catch {
      css = '/* styles unavailable */';
    }

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Acrolls Studio — ${escapeHtml(relative(process.cwd(), abs))}</title>
<style>
${css}
:root { color-scheme: light dark; font-family: system-ui, sans-serif; }
body { margin: 0; display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }
header { grid-column: 1 / -1; padding: 0.75rem 1rem; border-bottom: 1px solid #8883; display:flex; justify-content:space-between; gap:1rem; align-items:center; }
main { display:contents; }
.pane { padding: 1rem; overflow: auto; max-height: calc(100vh - 3rem); }
.pane + .pane { border-left: 1px solid #8883; }
textarea { width: 100%; min-height: 70vh; font-family: ui-monospace, monospace; font-size: 13px; line-height: 1.5; padding: 0.75rem; border: 1px solid #8884; border-radius: 8px; background: transparent; color: inherit; }
pre.compile { white-space: pre-wrap; font-size: 12px; opacity: 0.85; }
.error { color: #b91c1c; white-space: pre-wrap; }
.hint { color: #666; font-size: 0.9em; }
button { cursor: pointer; }
@media (max-width: 900px) { body { grid-template-columns: 1fr; } .pane + .pane { border-left: 0; border-top: 1px solid #8883; } }
</style>
</head>
<body>
<header>
  <div>
    <strong>Acrolls Studio</strong>
    <span class="hint"> — ${escapeHtml(relative(process.cwd(), abs))} (source is truth)</span>
  </div>
  <div class="hint">v0: edit in your editor · refresh to recompile · Save is atomic write via POST /save</div>
</header>
<main>
  <section class="pane">
    <h2>Source</h2>
    <form method="POST" action="/save">
      <textarea name="source" id="source">${escapeHtml(source)}</textarea>
      <p><button type="submit">Save (⌘/Ctrl+S)</button> <span class="hint">writes ${escapeHtml(abs)}</span></p>
    </form>
  </section>
  <section class="pane">
    <h2>Compile preview</h2>
    ${error ? `<p class="error">${escapeHtml(error)}</p>` : `<p class="hint">Compiled OK · full interactive Publication renders in the kit-consumer example; Studio v0 shows compile output.</p>`}
    <article class="acrolls">
      <pre class="compile">${escapeHtml(compiled.slice(0, 12000))}${compiled.length > 12000 ? '\n/* …truncated */' : ''}</pre>
    </article>
  </section>
</main>
<script>
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    e.preventDefault();
    document.querySelector('form')?.requestSubmit();
  }
});
</script>
</body>
</html>`;
  }

  const server = createServer(async (req, res) => {
    try {
      if (req.method === 'POST' && req.url === '/save') {
        const chunks: Buffer[] = [];
        for await (const c of req) chunks.push(c as Buffer);
        const body = Buffer.concat(chunks).toString('utf8');
        const params = new URLSearchParams(body);
        const source = params.get('source');
        if (source == null) {
          res.writeHead(400);
          res.end('missing source');
          return;
        }
        // atomic-ish write
        const tmp = abs + '.acrolls-tmp';
        await writeFile(tmp, source, 'utf8');
        const { rename } = await import('node:fs/promises');
        await rename(tmp, abs);
        res.writeHead(302, { Location: '/' });
        res.end();
        return;
      }
      const html = await renderPage();
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(err instanceof Error ? err.message : String(err));
    }
  });

  await new Promise<void>((resolveListen, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolveListen());
  });

  const url = `http://127.0.0.1:${port}`;
  console.log(`Acrolls Studio bound to ${url}`);
  console.log(`Editing ${abs}`);
  console.log('Stop with Ctrl+C');

  if (!args.flags['no-open']) {
    const opener =
      process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    spawn(opener, [url], { stdio: 'ignore', detached: true }).unref();
  }

  await new Promise(() => {
    /* run until killed */
  });
  return 0;
}

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

async function resolvePackageDir(name: string): Promise<string | null> {
  try {
    const { createRequire } = await import('node:module');
    const require = createRequire(import.meta.url);
    const pkgJson = require.resolve(`${name}/package.json`);
    return dirname(pkgJson);
  } catch {
    // monorepo sibling
    const here = dirname(fileURLToPath(import.meta.url));
    const sibling = resolve(here, `../../${name.replace('@acrolls/', '')}`);
    if (await exists(sibling)) return sibling;
    return null;
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
    console.log(`svelte config: ${host.svelteConfig ?? 'none'}`);
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
