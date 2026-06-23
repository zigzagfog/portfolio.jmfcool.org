document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initPortfolio().catch((error) => {
    console.error('Portfolio initialization failed:', error);
  });
});

function initThemeToggle() {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');

  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

  const icons = {
    moon: `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `,
    sun: `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="5"></circle>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
      </svg>
    `,
  };

  function syncTheme() {
    root.setAttribute('data-theme', theme);

    if (!toggle) return;

    toggle.innerHTML = theme === 'dark' ? icons.moon : icons.sun;
    toggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }

  syncTheme();

  toggle?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    syncTheme();
  });
}

async function initPortfolio() {
  const sectionsRoot = document.getElementById('sectionsRoot');
  const heroPreview = document.getElementById('heroPreview');
  const filterPills = document.getElementById('filterPills');

  if (!sectionsRoot) {
    throw new Error('#sectionsRoot was not found in the DOM');
  }

  sectionsRoot.textContent = 'Loading portfolio…';

  const sections = await fetchSections('./data.json');

  sectionsRoot.innerHTML = '';

  renderHeroPreview(sections, heroPreview);
  renderFilterPills(sections, filterPills);
  renderSections(sections, sectionsRoot);
}

async function fetchSections(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Expected data.json to contain an array of sections');
  }

  return data;
}

function renderHeroPreview(sections, container) {
  if (!container) return;

  container.innerHTML = '';

  sections.slice(0, 3).forEach((section) => {
    const card = document.createElement('article');
    card.className = 'preview-card';

    const strong = document.createElement('strong');
    strong.textContent = section.name ?? 'Untitled section';

    const text = document.createElement('span');
    const count = Array.isArray(section.entries) ? section.entries.length : 0;
    text.textContent = `${count} projects in the original archive structure`;

    card.append(strong, text);
    container.appendChild(card);
  });
}

function renderFilterPills(sections, container) {
  if (!container) return;

  container.innerHTML = '';

  sections.forEach((section, index) => {
    const link = document.createElement('a');
    link.className = `filter-pill${index === 0 ? ' is-active' : ''}`;
    link.href = `#${section.slug}`;
    link.textContent = section.name ?? 'Untitled section';
    container.appendChild(link);
  });
}

function renderSections(sections, root) {
  const fragment = document.createDocumentFragment();

  sections.forEach((section) => {
    fragment.appendChild(createSection(section));
  });

  root.appendChild(fragment);
}

function createSection(section) {
  const sectionEl = document.createElement('section');
  sectionEl.className = 'portfolio-section section';
  sectionEl.id = section.slug ?? '';

  const head = document.createElement('div');
  head.className = 'portfolio-section__head';

  const headCopy = document.createElement('div');

  const label = document.createElement('span');
  label.className = 'section-label';
  label.textContent = section.name ?? 'Untitled section';

  const title = document.createElement('h2');
  title.className = 'section-title section-title--sm';
  title.textContent = section.name ?? 'Untitled section';

  const copy = document.createElement('p');
  copy.className = 'section-copy';
  copy.textContent =
    'Rendered directly from the original portfolio archive with title, time, technologies, and tags intact.';

  headCopy.append(label, title, copy);

  const count = document.createElement('span');
  count.className = 'portfolio-count';
  count.textContent = `${Array.isArray(section.entries) ? section.entries.length : 0} items`;

  head.append(headCopy, count);

  const grid = document.createElement('div');
  grid.className = 'cards-grid';

  (section.entries ?? []).forEach((entry) => {
    grid.appendChild(
      createProjectCard({
        ...entry,
        category: section.name ?? 'Untitled section',
        slug: section.slug ?? '',
      })
    );
  });

  sectionEl.append(head, grid);
  return sectionEl;
}

function createProjectCard(project) {
  const card = document.createElement('article');
  card.className = 'project-card';

  const top = document.createElement('div');
  top.className = 'project-card__top';

  const headingWrap = document.createElement('div');

  const category = document.createElement('div');
  category.className = 'section-label';
  category.textContent = project.category ?? 'Archive';

  const title = document.createElement('h3');
  title.className = 'project-card__title';
  title.textContent = project.title ?? 'Untitled project';

  headingWrap.append(category, title);

  const year = document.createElement('span');
  year.className = 'year';
  year.textContent = project.year || project.date || 'Archive';

  top.append(headingWrap, year);

  const desc = document.createElement('p');
  desc.className = 'project-card__desc';
  desc.textContent = fallbackDescription(project.category);

  const stack = document.createElement('div');
  stack.className = 'project-card__stack';
  (project.tech ?? []).slice(0, 5).forEach((item) => {
    stack.appendChild(createPill(item));
  });

  const tags = document.createElement('div');
  tags.className = 'project-card__tags';
  (project.tags ?? []).slice(0, 4).forEach((item) => {
    tags.appendChild(createPill(item, true));
  });

  const actions = document.createElement('div');
  actions.className = 'project-card__actions';

  if (project.url) {
    actions.appendChild(createAction('Open project', project.url, true));
  }

  (project.links ?? []).slice(0, 2).forEach((link) => {
    if (link?.href && link?.label) {
      actions.appendChild(createAction(link.label, link.href, false));
    }
  });

  card.append(top, desc, stack, tags, actions);
  return card;
}

function createPill(text, accent = false) {
  const pill = document.createElement('span');
  pill.className = `pill${accent ? ' pill--accent' : ''}`;
  pill.textContent = text;
  return pill;
}

function createAction(label, href, primary = false) {
  const link = document.createElement('a');
  link.className = `btn ${primary ? 'btn--primary' : 'btn--ghost'}`;
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = label;
  return link;
}

function fallbackDescription(category) {
  return `${category || 'Archive'} project card preserving the original title, year, technology list, and portfolio tags from the archive.`;
}
