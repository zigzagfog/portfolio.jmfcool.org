(async function () {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  const moon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const sun = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';

  const sync = () => {
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark' ? moon : sun;
  };

  sync();

  toggle?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    sync();
  });

  const sections = await fetch('./data.json').then((r) => r.json());
  const rootEl = document.getElementById('sectionsRoot');

  const chip = (text) => `<span class="chip">${text}</span>`;
  const safeLinks = (links = []) =>
    links
      .map(
        (link) =>
          `<a class="link" href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label}</a>`
      )
      .join('');

  rootEl.innerHTML = sections
    .map(
      (section) => `
        <section class="section" id="${section.slug}">
          <div class="section-head">
            <h2 class="section-title">${section.name}</h2>
            <span class="section-count">${section.entries.length} items</span>
          </div>
          <div class="cards">
            ${section.entries
              .map(
                (entry) => `
                  <article class="card">
                    <div class="card-top">
                      <h3 class="card-title">${entry.title}</h3>
                      <span class="card-date">${entry.date || 'Undated'}</span>
                    </div>
                    <div class="card-row">${(entry.tech || []).map(chip).join('')}</div>
                    <div class="card-row">${(entry.tags || []).map(chip).join('')}</div>
                    <div class="card-links">
                      ${entry.url ? `<a class="link" href="${entry.url}" target="_blank" rel="noopener noreferrer">Open project</a>` : ''}
                      ${safeLinks(entry.links)}
                    </div>
                  </article>
                `
              )
              .join('')}
          </div>
        </section>
      `
    )
    .join('');
})();
