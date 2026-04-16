const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const year = document.querySelector('#current-year');
const body = document.body;
const header = document.querySelector('.header');
const toggleText = toggle?.querySelector('.menu-toggle-text');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileMenuBreakpoint = 860;

if (year) {
  year.textContent = new Date().getFullYear();
}

if (toggle && menu) {
  const backdrop = document.createElement('button');
  backdrop.className = 'menu-backdrop';
  backdrop.type = 'button';
  backdrop.hidden = true;
  backdrop.setAttribute('aria-label', 'Fechar menu');
  body.append(backdrop);
  toggle.setAttribute('aria-haspopup', 'true');

  const getMenuLinks = () =>
    [...menu.querySelectorAll('a')].filter((link) => !link.hasAttribute('hidden'));

  const syncMenuAccessibility = () => {
    const isMobile = window.innerWidth <= mobileMenuBreakpoint;
    const isOpen = menu.classList.contains('open');

    menu.setAttribute('aria-hidden', isMobile && !isOpen ? 'true' : 'false');
  };

  const syncHeaderHeight = () => {
    const headerHeight = header?.offsetHeight ?? 88;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
  };

  const syncHeaderState = () => {
    if (!header) {
      return;
    }

    header.classList.toggle('header-scrolled', window.scrollY > 18);
  };

  const closeMenu = ({ returnFocus = true } = {}) => {
    menu.classList.remove('open');
    body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    if (toggleText) {
      toggleText.textContent = 'Menu';
    }
    backdrop.hidden = true;
    syncMenuAccessibility();

    if (returnFocus && window.innerWidth <= mobileMenuBreakpoint) {
      toggle.focus();
    }
  };

  const openMenu = () => {
    syncHeaderHeight();
    menu.classList.add('open');
    body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
    if (toggleText) {
      toggleText.textContent = 'Fechar';
    }
    backdrop.hidden = false;
    syncMenuAccessibility();

    if (window.innerWidth <= mobileMenuBreakpoint) {
      getMenuLinks()[0]?.focus();
    }
  };

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  });

  getMenuLinks().forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu({ returnFocus: false });
    });
  });

  backdrop.addEventListener('click', closeMenu);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
      return;
    }

    if (event.key !== 'Tab' || !menu.classList.contains('open') || window.innerWidth > mobileMenuBreakpoint) {
      return;
    }

    const links = getMenuLinks();
    if (!links.length) {
      return;
    }

    const firstLink = links[0];
    const lastLink = links[links.length - 1];

    if (event.shiftKey && document.activeElement === firstLink) {
      event.preventDefault();
      toggle.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === toggle) {
      event.preventDefault();
      firstLink.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastLink) {
      event.preventDefault();
      toggle.focus();
    }
  });

  syncHeaderHeight();
  syncHeaderState();
  syncMenuAccessibility();

  window.addEventListener('scroll', syncHeaderState, { passive: true });

  window.addEventListener('resize', () => {
    syncHeaderHeight();
    syncHeaderState();
    if (window.innerWidth > mobileMenuBreakpoint) {
      closeMenu();
      return;
    }

    syncMenuAccessibility();
  });
}

if (!reducedMotion.matches) {
  const revealSelectors = [
    '.hero-copy > *',
    '.hero-visual > *',
    '.trust-item',
    '.feature-card',
    '.service-card',
    '.spotlight-copy > *',
    '.spotlight-panel > *',
    '.local-card',
    '.step-card',
    '.faq-card',
    '.cta-copy > *',
    '.contact-card > *',
    '.page-hero > *',
    '.content-block',
    '.bullet-card',
    '.info-panel',
    '.related-pages a',
    '.footer-grid > *'
  ];

  const revealTargets = [...document.querySelectorAll(revealSelectors.join(', '))];

  revealTargets.forEach((element, index) => {
    element.setAttribute('data-reveal', '');
    element.style.setProperty('--reveal-delay', `${(index % 6) * 55}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  revealTargets.forEach((element) => {
    revealObserver.observe(element);
  });
}
