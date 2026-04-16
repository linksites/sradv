const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const year = document.querySelector('#current-year');
const body = document.body;
const header = document.querySelector('.header');

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

  window.addEventListener('resize', () => {
    syncHeaderHeight();
    if (window.innerWidth > 860) {
      closeMenu();
    }
  });
}
