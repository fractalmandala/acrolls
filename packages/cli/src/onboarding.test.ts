import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
	buildOnboardingPlan,
	renderCompletedOnboardingStep,
	renderOnboardingPlan,
	renderOnboardingStep
} from './onboarding.js';

const exampleRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../examples/kit-consumer');

describe('Acrolls onboarding plan', () => {
	it('derives host-aware checkpoints and exact docs paths', async () => {
		const plan = await buildOnboardingPlan({
			root: exampleRoot,
			docsDir: 'src/content',
			baseHref: '/handbook',
			mode: 'foundation',
			style: 'css'
		});

		expect(plan.host.kind).toBe('sveltekit');
		expect(plan.host.hasDocs).toBe(true);
		expect(plan.baseHref).toBe('/handbook');
		expect(plan.steps.find((step) => step.id === 'routes')?.file).toContain('src/routes/handbook/');
		expect(plan.steps.find((step) => step.id === 'routes')?.code).toContain(
			"from '../../lib/docs/DocumentPage.svelte'"
		);
		expect(plan.steps.find((step) => step.id === 'docs-layout')?.code).toContain(
			"from '../../lib/docs/source'"
		);
		expect(renderOnboardingPlan(plan)).not.toContain("from '$lib/");
		expect(plan.steps.find((step) => step.id === 'preprocessor')?.file).toBe('vite.config.ts');
		expect(plan.steps.map((step) => step.id)).toEqual([
			'install',
			'preprocessor',
			'styles',
			'content',
			'source',
			'docs-layout',
			'document-page',
			'routes',
			'preflight',
			'local-check',
			'deploy'
		]);

		const source = plan.steps.find((step) => step.id === 'source');
		expect(source?.code).toContain("import.meta.glob('../../content/**/*.md'");
		expect(source?.code).toContain("const contentPrefix = '../../content/';");
		expect(source?.code).not.toContain('folders:');
		const preprocessor = plan.steps.find((step) => step.id === 'preprocessor');
		expect(preprocessor?.code).toContain("extensions: ['.svelte', '.md', '.svx']");
		expect(preprocessor?.code).toContain("extensions: ['.md', '.svx']");
		expect(preprocessor?.verify).toContain('vitePreprocess()');
		expect(plan.steps.find((step) => step.id === 'preprocessor')?.completed).toBe(true);
		expect(plan.steps.find((step) => step.id === 'routes')?.completed).toBe(false);

		const completePlan = await buildOnboardingPlan({
			root: exampleRoot,
			docsDir: 'src/content',
			baseHref: '/docs',
			mode: 'default',
			style: 'css'
		});
		expect(completePlan.steps.find((step) => step.id === 'source')?.completed).toBe(true);
		expect(completePlan.steps.find((step) => step.id === 'docs-layout')?.completed).toBe(true);
		expect(completePlan.steps.find((step) => step.id === 'document-page')?.completed).toBe(true);
		expect(completePlan.steps.find((step) => step.id === 'routes')?.completed).toBe(true);
	});

	it('renders cautions and deployment checks for a terminal walkthrough', async () => {
		const plan = await buildOnboardingPlan({
			root: exampleRoot,
			docsDir: 'src/content',
			baseHref: '/docs',
			mode: 'default',
			style: 'css'
		});
		const output = renderOnboardingPlan(plan);

		expect(output).toContain('WATCH OUT:');
		expect(output).toContain('pnpm add acrolls@latest');
		expect(output).toContain('pnpm exec acrolls validate');
		expect(output).toContain('Install the public acrolls package only.');
		expect(output).not.toContain('file:');
		expect(output).not.toContain('@acrolls/');
		expect(output).toContain('pnpm build');
		expect(output).toContain('sveltekit({');
		expect(output).toContain('After deployment, check /docs');
	});

	it('renders one checkpoint at a time for interactive mode', async () => {
		const plan = await buildOnboardingPlan({
			root: exampleRoot,
			docsDir: 'src/content',
			baseHref: '/docs',
			mode: 'default',
			style: 'css'
		});
		const step = plan.steps[1]!;
		const output = renderOnboardingStep(plan, 1, step);

		expect(output).toContain('Step 2 of 11');
		expect(output).toContain(step.title);
		expect(output).not.toContain('Step 3 of 11');
		expect(renderOnboardingPlan(plan)).toContain('[done] Install the host dependencies');
		const completed = plan.steps[3]!;
		expect(renderCompletedOnboardingStep(plan, 3, completed)).toContain('Step 4 of 11');
		expect(renderCompletedOnboardingStep(plan, 3, completed)).toContain('Already complete — continuing.');
	});

	it('preserves a root base href and clean root route paths', async () => {
		const plan = await buildOnboardingPlan({
			root: exampleRoot,
			docsDir: 'src/content',
			baseHref: '/',
			mode: 'default',
			style: 'css'
		});

		expect(plan.baseHref).toBe('/');
		expect(plan.steps.find((step) => step.id === 'routes')?.file).toBe(
			'src/routes/+page.svelte, src/routes/[...slug]/+page.ts, src/routes/[...slug]/+page.svelte'
		);
		expect(plan.steps.find((step) => step.id === 'deploy')?.verify).toContain('check /, /<nested-slug>');
	});
});
