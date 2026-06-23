async function initPortfolio() {
  const root = document.getElementById('sectionsRoot');

  try {
    root.textContent = 'Loading...';

    const response = await fetch('./data.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const sections = await response.json();
    root.innerHTML = '';

    sections.forEach((section) => {
      const sectionEl = document.createElement('section');
      sectionEl.className = 'section';
      sectionEl.id = section.slug;

      const heading = document.createElement('h2');
      heading.textContent = section.name;

      const count = document.createElement('p');
      count.textContent = `${section.entries.length} items`;

      const cards = document.createElement('div');
      cards.className = 'cards';

      section.entries.forEach((entry) => {
        const card = document.createElement('article');
        card.className = 'card';

        const title = document.createElement('h3');
        title.textContent = entry.title;

        const date = document.createElement('p');
        date.textContent = entry.date || 'Undated';

        card.append(title, date);
        cards.appendChild(card);
      });

      sectionEl.append(heading, count, cards);
      root.appendChild(sectionEl);
    });
  } catch (error) {
    root.textContent = 'Could not load portfolio data.';
    console.error(error);
  }
}

initPortfolio();
