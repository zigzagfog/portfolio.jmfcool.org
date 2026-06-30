(async function () {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const heroPreview = document.getElementById('heroPreview');
  const filterPills = document.getElementById('filterPills');
  const sectionsRoot = document.getElementById('sectionsRoot');
  const statProjects = document.getElementById('stat-projects');
  const statCategories = document.getElementById('stat-categories');

  let theme = 'dark';
  root.setAttribute('data-theme', theme);

  const moon =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const sun =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';

  const slugify = (text) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const syncTheme = () => {
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark' ? moon : sun;
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  };

  syncTheme();

  toggle?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    syncTheme();
  });

  const createPill = (text, accent = false) =>
    `<span class="pill ${accent ? 'pill--accent' : ''}">${text}</span>`;

  const createCard = (item, category) => `
    <article class="project-card">
      <div class="project-card__top">
        <div>
          <div class="section-label">${category}</div>
          <h3 class="project-card__title">${item.title}</h3>
        </div>
        <span class="year">${item.time || 'Archive'}</span>
      </div>
      <p class="project-card__desc">
        ${item.title} project card preserving the original title, time, technologies, and tags from the archive.
      </p>
      <div class="project-card__stack">
        ${(item.technologies || []).slice(0, 5).map((tech) => createPill(tech)).join('')}
      </div>
      <div class="project-card__tags">
        ${(item.tags || []).slice(0, 4).map((tag) => createPill(tag, true)).join('')}
      </div>
    </article>
  `;

  const res = await fetch('./data.json');
  const data = await res.json();
  const sections = data.categories || [];

  statCategories.textContent = String(sections.length);
  statProjects.textContent = String(sections.reduce((sum, section) => sum + (section.items || []).length, 0));

  heroPreview.innerHTML = '';
  sections.slice(0, 3).forEach((section) => {
    heroPreview.insertAdjacentHTML(
      'beforeend',
      `
      <article class="preview-card">
        <strong>${section.name}</strong>
        <span>${(section.items || []).length} projects in the original archive structure</span>
      </article>
    `
    );
  });

  filterPills.innerHTML = sections
    .map(
      (section, index) =>
        `<a class="filter-pill ${index === 0 ? 'is-active' : ''}" href="#${slugify(section.name)}">${section.name}</a>`
    )
    .join('');

  sectionsRoot.innerHTML = sections
    .map((section) => {
      const id = slugify(section.name);
      return `
        <section class="portfolio-section" id="${id}">
          <div class="portfolio-section__head">
            <div>
              <span class="section-label">${section.name}</span>
              <h3 class="section-title section-title--sm">${section.name}</h3>
              <p class="section-copy">
                Rendered directly from the original portfolio archive with title, time, technologies, and tags intact.
              </p>
            </div>
            <span class="portfolio-count">${(section.items || []).length} items</span>
          </div>
          <div class="cards-grid">
            ${(section.items || []).map((item) => createCard(item, section.name)).join('')}
          </div>
        </section>
      `;
    })
    .join('');
})();
