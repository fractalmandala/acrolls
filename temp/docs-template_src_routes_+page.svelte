<script>
  import Header from '$lib/components/Header.svelte';
  import SidebarNav from '$lib/components/SidebarNav.svelte';
  import SidebarTOC from '$lib/components/SidebarTOC.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import DocTable from '$lib/components/DocTable.svelte';
  import Steps from '$lib/components/Steps.svelte';
  import ImageFigure from '$lib/components/ImageFigure.svelte';
  import FooterNav from '$lib/components/FooterNav.svelte';

  const navSections = [
    {
      label: 'Getting Started',
      children: [
        { label: 'Introduction', href: '#introduction', active: true, icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
        { label: 'Installation', href: '#', icon: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>' },
        { label: 'Configuration', href: '#', icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>' },
      ],
    },
    {
      label: 'Core Concepts',
      children: [
        { label: 'Architecture', href: '#', icon: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>' },
        {
          label: 'Styling',
          href: '#',
          icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>',
          children: [
            { label: 'Tokens', href: '#' },
            { label: 'Utilities', href: '#' },
            { label: 'Responsive', href: '#' },
          ],
        },
      ],
    },
    {
      label: 'API Reference',
      children: [
        { label: 'Components', href: '#', icon: '<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>' },
        { label: 'Hooks', href: '#', icon: '<path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>' },
        { label: 'CLI', href: '#', icon: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },
      ],
    },
    {
      label: 'Guides',
      children: [
        { label: 'Tutorials', href: '#', icon: '<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>' },
        { label: 'FAQ', href: '#', icon: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
        { label: 'Changelog', href: '#', icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>' },
      ],
    },
  ];

  const tocEntries = [
    { id: 'introduction', label: 'Introduction', level: 2 },
    { id: 'what-is-this', label: 'What is this framework?', level: 2 },
    { id: 'quick-start', label: 'Quick Start', level: 2 },
    { id: 'configuration', label: 'Configuration', level: 2 },
    { id: 'config-options', label: 'Configuration Options', level: 3 },
    { id: 'components', label: 'Using Components', level: 2 },
    { id: 'styling', label: 'Styling', level: 2 },
    { id: 'warnings', label: 'Important Notices', level: 2 },
  ];

  const quickStartSteps = [
    { title: 'Install the CLI', body: 'Use your preferred package manager to install the global CLI tool.' },
    { title: 'Scaffold your project', body: 'Run <code>init</code> to generate a new project with TypeScript, linting, and testing configured.' },
    { title: 'Start the dev server', body: 'Launch the development server with hot reload at <code>localhost:3000</code>.' },
  ];

  const configColumns = [
    { label: 'Option', key: 'option' },
    { label: 'Type', key: 'type' },
    { label: 'Default', key: 'default' },
    { label: 'Description', key: 'description' },
  ];

  const configRows = [
    { option: '<code>srcDir</code>', type: '<code>string</code>', default: "<code>'./src'</code>", description: 'Source directory containing your application code' },
    { option: '<code>output.format</code>', type: "<code>'esm' | 'cjs'</code>", default: "<code>'esm'</code>", description: 'Output module format for the build' },
    { option: '<code>output.target</code>', type: '<code>string</code>', default: "<code>'es2022'</code>", description: 'ECMAScript target version' },
    { option: '<code>output.minify</code>', type: '<code>boolean</code>', default: '<code>true</code>', description: 'Enable minification in production builds' },
    { option: '<code>plugins</code>', type: '<code>Plugin[]</code>', default: '<code>[]</code>', description: 'Array of plugins to extend the build pipeline' },
    { option: '<code>server.port</code>', type: '<code>number</code>', default: '<code>3000</code>', description: 'Development server port' },
  ];
</script>

<svelte:head>
  <title>Introduction — Docs</title>
</svelte:head>

<Header title="Docs" version="v3.2.1" />
<SidebarNav sections={navSections} />

<div class="layout">
  <main class="content-area">
    <article class="content">

      <!-- Page header -->
      <div>
        <Badge label="v3.2" />
        <h1 class="doc-display" id="introduction">Introduction</h1>
        <p class="doc-lead">A comprehensive framework for building type-safe, scalable applications with an emphasis on developer experience and production reliability.</p>
      </div>

      <!-- What is this framework? -->
      <h2 class="doc-h2" id="what-is-this">What is this framework?</h2>
      <p class="doc-p">This framework provides a complete toolkit for modern web development. It combines <a href="#" class="doc-link">type-safe APIs</a>, composable primitives, and an opinionated build system to help teams ship production applications faster.</p>
      <p class="doc-p">The core philosophy is simple: sensible defaults with escape hatches. You get a productive experience out of the box, and full control when you need it.</p>

      <Callout variant="note">
        <p>This guide assumes familiarity with TypeScript and modern JavaScript. If you're new, start with the <a href="#" class="doc-link">beginner tutorial</a>.</p>
      </Callout>

      <!-- Quick Start -->
      <h2 class="doc-h2" id="quick-start">Quick Start</h2>
      <p class="doc-p">Get up and running in under two minutes. The CLI scaffolds a complete project with sensible defaults.</p>

      <Steps steps={quickStartSteps} />

      <CodeBlock language="bash" code={`# Install the CLI globally
npm install -g @framework/cli

# Scaffold a new project
framework init my-project --template typescript

# Start developing
cd my-project
npm run dev`} />

      <!-- Configuration -->
      <h2 class="doc-h2" id="configuration">Configuration</h2>
      <p class="doc-p">The framework is configured through a single <code>framework.config.ts</code> file at the root of your project. All options have sensible defaults.</p>

      <CodeBlock language="typescript" code={`import { defineConfig } from '@framework/core';

export default defineConfig({
  srcDir: './src',
  output: {
    format: 'esm',
    target: 'es2022',
    minify: true,
  },
  plugins: [
    typescript(),
    cssModules(),
  ],
  server: {
    port: 3000,
    strictPort: true,
  },
});`} />

      <h3 class="doc-h3" id="config-options">Configuration Options</h3>
      <p class="doc-p">The following table lists all available configuration options with their defaults.</p>

      <DocTable columns={configColumns} rows={configRows} />

      <!-- Using Components -->
      <h2 class="doc-h2" id="components">Using Components</h2>
      <p class="doc-p">Components are the building blocks of your application. Each component is a self-contained module with its own template, logic, and styles.</p>

      <CodeBlock language="typescript" code={`import { component, html, css } from '@framework/core';

export const Button = component({
  props: {
    variant: { type: String, default: 'primary' },
    disabled: { type: Boolean, default: false },
  },

  render(props) {
    return html\`
      <button
        class=\${props.variant}
        disabled=\${props.disabled}
      >
        <slot />
      </button>
    \`;
  },
});`} />

      <h3 class="doc-h3" id="component-props">Props Reference</h3>
      <ul class="doc-list doc-list-check">
        <li><strong>type</strong> — The data type for the prop. Used for TypeScript inference and runtime validation.</li>
        <li><strong>default</strong> — Fallback value when the prop is not provided by the parent.</li>
        <li><strong>required</strong> — Set to <code>true</code> to enforce the prop is always provided.</li>
        <li><strong>validator</strong> — Optional custom validation function for complex constraints.</li>
      </ul>

      <!-- Styling -->
      <h2 class="doc-h2" id="styling">Styling</h2>
      <p class="doc-p">The framework includes a zero-runtime CSS-in-JS solution. Styles are extracted at build time, so there's no runtime overhead.</p>

      <blockquote class="doc-blockquote">
        <p>"Good design is as little design as possible. Less, but better — because it concentrates on the essential aspects."</p>
        <p>— Dieter Rams</p>
      </blockquote>

      <Callout variant="tip">
        <p>Use the <code>css</code> tagged template to define scoped styles. The compiler automatically hashes class names to avoid collisions.</p>
      </Callout>

      <CodeBlock language="css" code={`/* Scoped component styles */
.button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.15s ease;
  cursor: pointer;
}

.primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}`} />

      <!-- Important Notices -->
      <h2 class="doc-h2" id="warnings">Important Notices</h2>

      <Callout variant="warn">
        <p>Breaking changes are introduced in minor versions during the <code>0.x</code> phase. Pin your dependency version and review the changelog before upgrading.</p>
      </Callout>

      <Callout variant="danger">
        <p>Never expose your <code>SECRET_KEY</code> in client-side code. Always use environment variables and server-side routes for sensitive operations.</p>
      </Callout>

      <!-- Image example -->
      <ImageFigure
        alt="Architecture diagram placeholder"
        caption="Figure 1 — High-level architecture showing the relationship between core modules"
      />

      <!-- Ordered list -->
      <h3 class="doc-h3" id="deployment-steps">Deployment Checklist</h3>
      <ol class="doc-list doc-list-ordered">
        <li>Run the full test suite with <code>npm test</code> to verify all modules pass.</li>
        <li>Build the production bundle with <code>npm run build</code>.</li>
        <li>Review the bundle size report for unexpected regressions.</li>
        <li>Deploy to staging and run the integration test suite.</li>
        <li>After staging verification, promote to production with the deployment CLI.</li>
      </ol>

      <hr class="doc-hr" />

      <!-- Footer navigation -->
      <FooterNav
        prev={{ href: '#', label: 'Previous', title: 'Overview' }}
        next={{ href: '#', label: 'Next', title: 'Installation' }}
      />

    </article>
  </main>

  <SidebarTOC entries={tocEntries} />
</div>
