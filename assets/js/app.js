// assets/js/app.js
const PAGE_SIZE = 6; // stories per batch
let stories = [];
let cursor = 0;


const gridEl = document.getElementById('story-grid');
const loadMoreBtn = document.getElementById('load-more');
const template = document.getElementById('story-card-template');


init();


async function init() {
try {
const res = await fetch('./data/stories.json', { cache: 'no-store' });
const data = await res.json();
// Sort newest first
stories = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));


renderBatch();
toggleLoadMore();
loadMoreBtn.addEventListener('click', renderBatch);
} catch (err) {
gridEl.innerHTML = `<li role="status">Couldn\'t load stories. ${escapeHtml(err.message)}</li>`;
loadMoreBtn.style.display = 'none';
}
}


function renderBatch() {
const slice = stories.slice(cursor, cursor + PAGE_SIZE);
slice.forEach(renderCard);
cursor += slice.length;
toggleLoadMore();
}


function renderCard(story) {
const node = template.content.cloneNode(true);
const li = node.querySelector('li');
const link = node.querySelector('a');
const img = node.querySelector('img');
const h3 = node.querySelector('h3');
const excerpt = node.querySelector('.excerpt');
const meta = node.querySelector('.meta');
const tagsEl = node.querySelector('.tags');


link.href = `./story.html?slug=${encodeURIComponent(story.slug)}`;
h3.textContent = story.title;
excerpt.textContent = story.excerpt || '';
meta.textContent = formatDate(story.date);


if (story.cover) {
img.src = story.cover;
img.alt = story.title;
} else {
// Remove figure entirely if no cover set
node.querySelector('.media')?.remove();
}


if (Array.isArray(story.tags) && story.tags.length) {
story.tags.forEach((t) => {
const span = document.createElement('span');
span.className = 'tag';
span.textContent = t;
tagsEl.appendChild(span);
});
} else {
tagsEl.remove();
}


}