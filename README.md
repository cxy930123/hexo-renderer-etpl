# hexo-renderer-etpl

[Hexo](https://hexo.io/) plugin. Add support for [ETPL].

为[Hexo](https://hexo.io/zh-cn/)开发的etpl渲染插件。（[ETPL]是一个强复用、灵活、高性能的JavaScript模板引擎。）


## 安装(Installation)


``` bash
$ npm install cxy930123/hexo-renderer-etpl --save
```

## 使用辅助函数(Use Helpers)

一般情况下，我们没有办法在[ETPL]中使用辅助函数。

We cannot use Helpers in [ETPL] by default.

```js
${partial('header')|raw} // 这样是没用的 (Useless)
```

因此，插件中定义了一个过滤器`fn`，用来执行辅助函数。实际上，你可以通过`fn`来执行任何函数。

So, I add a filter `fn` in the plugin to make Helps work. Actually, you can execute any funciton by using `fn`.

```js
${*partial|fn('header')}
```

请注意，为了提高效率，**辅助函数前必须加`*`号**，才能让`fn`正常工作。另外，由于替换了默认的`html`过滤器，不用再加`raw`过滤器就可以输出原始内容。

For efficiency, **there must be a `*` before the helper** to make the `fn` work. Besides, the default `html` filter is replaced by this filter, so you needn't add a `raw` filter to print raw content.

## 配置(Configuration)

### 渲染文章和页面(Render posts and pages)

你可以在`_config.yml`文件中配置引擎的参数。

You can config this plugin in `_config.yml` to set etpl config.

```yaml
etpl_config:
  variableOpen: <%
  variableClose: %>
```

想了解更多的配置参数请看[这里](https://github.com/ecomfe/etpl/blob/master/doc/config.md#config)。

For more infomation about etpl config see [here](https://github.com/ecomfe/etpl/blob/master/doc/config.md#config).

**注意：**　这些配置只在渲染文章和页面时生效。

**Notice:** It only takes effect when rendering posts and pages.

### 渲染主题中的文件(Render `*.etpl` file in theme)

你可以在主题的脚本文件中进行配置。

You can config this plugin within a Hexo theme script.

```javascript
hexo.etplConfig = {
  variableOpen: '<%',
  variableClose: '%>'
};

hexo.etplCommands = {
  'dump': {
    init: function () {
      var match = this.value.match(/^\s*([a-z0-9_]+)\s*$/i);
      if (!match) {
        throw new Error('Invalid ' + this.type + ' syntax: ' + this.value);
      }

      this.name = match[1];
      this.cloneProps = ['name'];
    },

    open: function (context) {
      context.stack.top().addChild(this);
    },

    getRendererBody: function () {
      var util = etpl.util;
      var options = this.engine.options;
      return util.stringFormat(
        'console.log({0});',
        util.compileVariable(options.variableOpen + this.name + options.variableClose, this.engine)
      );
    }
  }
};

hexo.etplFilters = {
  'markdown': function ( source, useExtra ) {
    // ......
  }
};
```

有三个`hexo`的属性可以用于配置(Three properties of `hexo` are used)：

* `hexo.etplConfig` - `Object`类型，配置引擎参数，详见[这里](https://github.com/ecomfe/etpl/blob/master/doc/config.md#config)。An `Object` as ETPL Config, see [here](https://github.com/ecomfe/etpl/blob/master/doc/config.md#config).
* `hexo.etplCommands` - `Object`类型，用于添加自定义标签。其中键名为命令标签名称，值为命令对象。更多信息请看[这里](https://github.com/ecomfe/etpl/blob/master/doc/api.md#addcommand)。An `Object` used to add commands. Object key is command name, and object value is a command object. For more information, see [here](https://github.com/ecomfe/etpl/blob/master/doc/api.md#addcommand).
* `hexo.etplFilters` - `Object`类型，用于添加过滤器。其中键名为过滤器名称，值为过滤函数。你甚至可以在此处重写`fn`过滤器。更多信息请看[这里](https://github.com/ecomfe/etpl/blob/master/doc/api.md#addfilter)。An `Object` used to add filters. Object key is filter name, and object value is filter function. You can even override filter `fn` through it. For more information, see [here](https://github.com/ecomfe/etpl/blob/master/doc/api.md#addfilter).

**注意：** 这些主题脚本中的配置只对渲染`themes`文件夹中的模板有效。

**Notice:** The configuration in theme script file only takes effect when rendering files in `themes` folder.

[ETPL]: https://ecomfe.github.io/etpl/
