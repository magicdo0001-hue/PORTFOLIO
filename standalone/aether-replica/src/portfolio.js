export const locale = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'zh';
export const casePath = `${locale === 'en' ? '/en' : ''}/work/sangre`;
export const caseHref = `${casePath}#story`;

export function installPortfolioNavigation() {
  const embedded = window.parent !== window;
  let visible = true;
  const send = type => window.parent.postMessage({ type }, location.origin);
  const applyVisibility = () => {
    const gl = window.__AetherRuntime?.gl;
    if (gl && document.documentElement.classList.contains('sangre-ready') && !document.documentElement.classList.contains('sangre-static')) gl.isLoaded = visible;
  };
  const click = event => {
    const link = event.target.closest?.('a[data-portfolio]');
    if (!link || !embedded || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    send(link.dataset.portfolio === 'home' ? 'sangre:home' : 'sangre:story');
  };
  const key = event => {
    if (embedded && event.key === 'Escape' && !document.documentElement.classList.contains('has-menu-open') && !document.querySelector('.modal-w.is-open')) send('sangre:escape');
  };
  const visibility = event => {
    if (event.origin !== location.origin || event.source !== window.parent || event.data?.type !== 'sangre:visibility') return;
    visible = event.data.visible === true;
    applyVisibility();
  };
  const ready = new MutationObserver(() => {
    if (document.documentElement.classList.contains('sangre-static') || document.documentElement.classList.contains('sangre-ready')) {
      if (embedded) send('sangre:ready');
      applyVisibility();
      ready.disconnect();
    }
  });
  document.addEventListener('click', click, true);
  window.addEventListener('keydown', key, true);
  window.addEventListener('message', visibility);
  ready.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

export function portfolioMarkup(markup) {
  const template = document.createElement('template');
  template.innerHTML = markup;
  template.content.querySelectorAll('.modal-w,.ae__btn-w').forEach(element => element.remove());
  template.content.querySelectorAll('a[href="/preorder"]').forEach(element => element.remove());
  template.content.querySelectorAll('a[href="/specs"]').forEach(link => {
    link.href = caseHref;
    link.target = '_parent';
    link.dataset.portfolio = 'story';
    link.setAttribute('data-taxi-ignore', '');
    if (link.classList.contains('indicator-w')) {
      link.title = locale === 'en' ? 'Read SANGRE case study' : '阅读 SANGRE 项目案例';
      return;
    }
    link.textContent = locale === 'en' ? 'Case study' : '项目案例';
  });
  template.content.querySelectorAll('.nav__logo-w').forEach(link => {
    link.href = locale === 'en' ? '/en' : '/';
    link.target = '_top';
    link.dataset.portfolio = 'home';
    link.setAttribute('data-taxi-ignore', '');
    link.setAttribute('aria-label', locale === 'en' ? 'SANGRE, return to portfolio' : 'SANGRE，返回作品集');
  });
  template.content.querySelectorAll('.nav__link[data-anchor="0"]').forEach(link => {
    link.href = '#';
    link.setAttribute('data-taxi-ignore', '');
  });
  return template.innerHTML;
}
