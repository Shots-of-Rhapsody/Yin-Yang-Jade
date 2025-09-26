// assets/js/story.js
const titleEl = document.getElementById('story-title');
const metaEl = document.getElementById('story-meta');
const contentEl = document.getElementById('story-content');


(async function render() {
try {
const slug = new URLSearchParams(location.search).get('slug');
const res = await fetch('./data/stories.json', { cache: 'no-store' });
const list = await res.json();
const story = list.find((s) => s.slug === slug) || list[0];
if (!story) throw new Error('No stories found.');


// Populate title/meta and <title>
document.title = `${story.title} — Stories`;
titleEl.textContent = story.title;
metaEl.textContent = formatDate(story.date);


// Fetch and render Markdown
const mdRes = await fetch(story.file, { cache: 'no-store' });
const md = await mdRes.text();
const html = window.marked ? window.marked.parse(md) : mdToHtmlFallback(md);
contentEl.innerHTML = html;
} catch (err) {
contentEl.innerHTML = `<p>Could not load this story. ${escapeHtml(err.message)}</p>`;
}
})();


function formatDate(iso) {
try {
const dt = new Date(iso);
return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
} catch {
return '';
}
}


function escapeHtml(str = '') {
const p = document.createElement('p');
p.textContent = String(str);
return p.innerHTML;
}


// Simple fallback if CDN is blocked: paragraphs + <br>
function mdToHtmlFallback(md) {
const safe = escapeHtml(md);
return safe
.split(/\n\s*\n/g)
.map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
.join('\n');
}