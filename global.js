(async function () {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  const moon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const sun = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';

  function syncThemeIcon() {
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark' ? moon : sun;
  }

  syncThemeIcon();

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      syncThemeIcon();
    });
  }

  const rootEl = document.getElementById('sectionsRoot');

  function chip(text) {
    return `<span class="chip">${text}</span>`;
  }

  function safeLinks(links = []) {
    return links
      .map(
        (link) =>
          `<a class="link" href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label}</a>`
      )
      .join('');
  }

  try {
    const response = await fetch('./data.json');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} loading data.json`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON but got: ${text.slice(0, 120)}`);
    }

    const sections = await response.json();

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
  } catch (error) {
    console.error(error);
    if (rootEl) {
      rootEl.innerHTML = `
        <section class="section">
          <div class="section-head">
            <h2 class="section-title">Portfolio unavailable</h2>
          </div>
          <div class="card">
            <p class="intro-copy">Could not load <code>data.json</code>. Check that the file exists in the same folder as <code>index.html</code> and returns JSON.</p>
          </div>
        </section>
      `;
    }
  }
})();
