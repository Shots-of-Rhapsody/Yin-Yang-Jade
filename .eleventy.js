module.exports = function (cfg) {
cfg.addPassthroughCopy({ 'assets': 'assets' });
cfg.addPassthroughCopy({ 'data': 'data' });
cfg.addCollection('stories', (api) =>
api.getFilteredByGlob('stories/**/*.md').sort((a, b) => b.date - a.date)
);
return {
dir: { input: '.', includes: '_includes', data: '_data', output: '_site' },
markdownTemplateEngine: 'njk',
htmlTemplateEngine: 'njk'
};
};