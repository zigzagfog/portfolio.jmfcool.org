(async function () {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  const moon =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const sun =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';

  const syncTheme = () => {
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark' ? moon : sun;
    toggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  };

  syncTheme();

  toggle?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    syncTheme();
  });

  // Load archive data
  const res = await fetch('./data.json');
  const sections = await res.json();

  // Stats
  document.getElementById('stat-categories').textContent = String(sections.length);
  document.getElementById('stat-projects').textContent = String(
    sections.reduce((sum, section) => sum + section.entries.length, 0)
  );

  const allEntries = sections.flatMap((section) =>
    section.entries.map((entry) => ({ ...entry, category: section.name, slug: section.slug }))
  );

  // Hero preview: first three categories from archive
  const heroPreview = document.getElementById('heroPreview');
  sections.slice(0, 3).forEach((section) => {
    heroPreview.insertAdjacentHTML(
      'beforeend',
      `
      <article class="preview-card">
        <strong>${section.name}</strong>
        <span>${section.entries.length} projects in the original archive structure</span>
      </article>
    `
    );
  });

  const createPill = (text, accent = false) =>
    `<span class="pill ${accent ? 'pill--accent' : ''}">${text}</span>`;

  const createAction = (label, href, primary = false) =>
    `<a href="${href}" class="btn ${primary ? 'btn--primary' : 'btn--ghost'}" target="_blank" rel="noopener noreferrer">${label}</a>`;

  const fallbackDescription = (category) =>
    `${category} project card preserving the original title, year, technology list, and portfolio tags from the archive.`;

  const createCard = (project) => `
    <article class="project-card">
      <div class="project-card__top">
        <div>
          <div class="section-label">${project.category}</div>
          <h3 class="project-card__title">${project.title}</h3>
        </div>
        <span class="year">${project.year || 'Archive'}</span>
      </div>
      <p class="project-card__desc">${fallbackDescription(project.category)}</p>
      <div class="project-card__stack">
        ${(project.tech || [])
          .slice(0, 5)
          .map((item) => createPill(item))
          .join('')}
      </div>
      <div class="project-card__tags">
        ${(project.tags || [])
          .slice(0, 4)
          .map((item) => createPill(item, true))
          .join('')}
      </div>
      <div class="project-card__actions">
        ${
          project.url
            ? createAction('Open project', project.url, true)
            : ''
        }
        ${(project.links || [])
          .slice(0, 2)
          .map((link) => createAction(link.label, link.href))
          .join('')}
      </div>
    </article>
  `;

  // Filter pills
  const filterPills = document.getElementById('filterPills');
  filterPills.innerHTML = sections
    .map(
      (section, index) =>
        `<a class="filter-pill ${index === 0 ? 'is-active' : ''}" href="#${section.slug}">${section.name}</a>`
    )
    .join('');

  // Sections
  const rootSections = document.getElementById('sectionsRoot');
  rootSections.innerHTML = sections
    .map(
      (section) => `
    <section class="portfolio-section" id="${section.slug}">
      <div class="portfolio-section__head">
        <div>
          <span class="section-label">${section.name}</span>
          <h3 class="section-title section-title--sm">${section.name}</h3>
          <p class="section-copy">
            Rendered directly from the original portfolio archive with title, time, technologies, and tags intact.
          </p>
        </div>
        <span class="portfolio-count">${section.entries.length} items</span>
      </div>
      <div class="cards-grid">
        ${section.entries
          .map((entry) => createCard({ ...entry, category: section.name, slug: section.slug }))
          .join('')}
      </div>
    </section>
  `
    )
    .join('');
})();
