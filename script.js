const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const year = document.querySelector('#current-year');
const body = document.body;
const header = document.querySelector('.header');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

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

  const closeMenu = () => {
    menu.classList.remove('open');
    body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    backdrop.hidden = true;
  };

  const openMenu = () => {
    syncHeaderHeight();
    menu.classList.add('open');
    body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
    backdrop.hidden = false;
  };

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  backdrop.addEventListener('click', closeMenu);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  syncHeaderHeight();
  syncHeaderState();

  window.addEventListener('scroll', syncHeaderState, { passive: true });

  window.addEventListener('resize', () => {
    syncHeaderHeight();
    syncHeaderState();
    if (window.innerWidth > 860) {
      closeMenu();
    }
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
