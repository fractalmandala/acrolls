<script>
  import { onMount } from 'svelte';
  import '$lib/styles/tokens.css';
  import '$lib/styles/base.css';
  import '$lib/styles/components.css';

  onMount(() => {
    const root = document.documentElement;

    function getPreferredTheme() {
      const stored = localStorage.getItem('theme');
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function setTheme(theme) {
      root.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }

    setTheme(getPreferredTheme());

    window.toggleTheme = function () {
      const current = root.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    };

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });

    // Mobile nav
    const sidebarNav = document.querySelector('.sidebar-nav');
    const overlay = document.querySelector('.sidebar-overlay');

    window.toggleMobileNav = function () {
      sidebarNav?.classList.toggle('open');
      overlay?.classList.toggle('open');
      document.body.style.overflow = sidebarNav?.classList.contains('open') ? 'hidden' : '';
    };

    window.closeMobileNav = function () {
      sidebarNav?.classList.remove('open');
      overlay?.classList.remove('open');
      document.body.style.overflow = '';
    };

    window.addEventListener('resize', () => {
      if (window.innerWidth > 767) window.closeMobileNav?.();
    });

    // Cmd+K search shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.header-search-input')?.focus();
      }
    });
  });
</script>

<slot />
