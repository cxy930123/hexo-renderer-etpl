/**
 * @file ETPL renderer plugin for Hexo
 * @author cxy930123
 */

let etpl = require('etpl');
let etpl_theme = new etpl.Engine();

/* global hexo */

// add register 'fn'
[etpl, etpl_theme].forEach(
    engine => engine.addFilter('fn', (fn, ...args) =>
        typeof fn == "function" ? fn(...args) : fn
    )
);

// config etpl
let etpl_config = hexo.config.etpl_config || {};
etpl.config(etpl_config);

// config etpl_theme
let etpl_theme_config = hexo.etplConfig || {};
etpl_theme.config(etpl_theme_config);

let commands = hexo.etplCommands || {};
let filters = hexo.etplFilters || {};
for (let name in commands) {
    etpl_theme.addCommand(name, commands[name]);
}
for (let name in filters) {
    etpl_theme.addFilter(name, filters[name]);
}

hexo.extend.renderer.register('etpl', 'html', function (data, locals) {
    let engine = (data.path.includes('themes/') || !data.path) ? etpl_theme : etpl;
    let renderer = engine.compile(data.text);
    return renderer(locals);
}, true);