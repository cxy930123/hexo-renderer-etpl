/**
 * @file ETPL renderer plugin for Hexo
 * @author cxy930123
 */

let etpl = require('etpl');
let etpl_theme = new etpl.Engine();

/* global hexo */

// config etpl
let etpl_config = hexo.config.etpl_config || {};
etpl.config(etpl_config);

// config etpl_theme
let {config = {}, commands = {}, filters = {}} = hexo.theme.config.etpl_renderer || {};
etpl_theme.config(config);
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