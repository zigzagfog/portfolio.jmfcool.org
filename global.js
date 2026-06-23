async function loadProjects() {
  const container = document.getElementById('projects');

  try {
    container.textContent = 'Loading...';

    const response = await fetch('./data.json');

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    renderProjects(data, container);
  } catch (error) {
    container.textContent = 'Failed to load data.';
    console.error(error);
  }
}

function renderProjects(projects, container) {
  container.innerHTML = '';

  projects.forEach((project) => {
    const article = document.createElement('article');
    const title = document.createElement('h2');
    const desc = document.createElement('p');

    title.textContent = project.title;
    desc.textContent = project.description;

    article.append(title, desc);
    container.appendChild(article);
  });
}

loadProjects();      (section) => `
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
