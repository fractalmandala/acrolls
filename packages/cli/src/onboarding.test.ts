import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildOnboardingPlan, renderOnboardingPlan } from './onboarding.js';

const exampleRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../examples/kit-consumer');

describe('Acrolls onboarding plan', () => {
	it('derives host-aware checkpoints and exact docs paths', async () => {
		const plan = await buildOnboardingPlan({
			root: exampleRoot,
			docsDir: 'src/content',
			baseHref: '/handbook',
			mode: 'foundation'
		});

		expect(plan.host.kind).toBe('sveltekit');
		expect(plan.host.hasDocs).toBe(true);
		expect(plan.baseHref).toBe('/handbook');
		expect(plan.steps.find((step) => step.id === 'routes')?.file).toContain('src/routes/handbook/');
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
		expect(plan.steps.find((step) => step.id === 'preprocessor')?.completed).toBe(true);
		expect(plan.steps.find((step) => step.id === 'routes')?.completed).toBe(false);
	});

	it('renders cautions and deployment checks for a terminal walkthrough', async () => {
		const plan = await buildOnboardingPlan({
			root: exampleRoot,
			docsDir: 'src/content',
			baseHref: '/docs',
			mode: 'default'
		});
		const output = renderOnboardingPlan(plan);

		expect(output).toContain('WATCH OUT:');
		expect(output).toContain('do not install @acrolls/sveltekit through file:');
		expect(output).toContain('pnpm build');
		expect(output).toContain('After deployment, check /docs');
	});
});
