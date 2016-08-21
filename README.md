# hexo-renderer-etpl

为[Hexo](https://hexo.io/zh-cn/)开发的etpl渲染插件。（[ETPL](https://ecomfe.github.io/etpl/)是一个强复用、灵活、高性能的JavaScript模板引擎。）

## 安装

使用如下命令进行安装：

``` bash
$ npm install cxy930123/hexo-renderer-etpl --save
```

## 配置

对于文章和页面的渲染，以及主题中模板文件的渲染，此插件用了两个不同的渲染引擎实例。因此，博客使用者和主题开发者可以在不同的位置对插件进行配置。

### 渲染文章和页面

对于文章和页面的渲染，博客使用者可以在`_config.yml`文件中配置引擎的参数。

```yaml
etpl_config:
  variableOpen: <%
  variableClose: %>
```

想了解更多的配置参数请看[这里](https://github.com/ecomfe/etpl/blob/master/doc/config.md#config)。

**注意：**　`_config.yml`文件中的这些配置只在渲染文章和页面时生效。

### 渲染主题文件夹中的文件

对于主题文件夹中文件的渲染，主题开发者可以在主题的脚本文件中进行配置。

```javascript
let config = {
  variableOpen: '<%',
  variableClose: '%>'
};

let commands = {
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

let filters = {
  'fn': (fn, ...args) => typeof fn == "function" ? fn(...args) : fn
};

hexo.theme.config.etpl_renderer = {
  config: config,
  commands: commands,
  filters: filters
};
```

有三个属性可以用于配置：

* `config` - `Object`类型，配置引擎参数，更多参数请看[这里](https://github.com/ecomfe/etpl/blob/master/doc/config.md#config)。
* `commands` - `Object`类型，用于添加自定义标签。其中键名为命令标签名称，值为命令对象。关于命令的详细信息请看[这里](https://github.com/ecomfe/etpl/blob/master/doc/api.md#addcommand)。
* `filters` - `Object`类型，用于添加过滤器。其中键名为过滤器名称，值为过滤函数。关于过滤器的更多信息请看[这里](https://github.com/ecomfe/etpl/blob/master/doc/api.md#addfilter)。

这三个属性是在`hexo.theme.config.etpl_renderer`上的。实际上，直接在主题文件夹的`_config.yml`文件中也可以配置引擎参数。只是由于无法在`_config.yml`文件中定义函数，因此无法配置其余两项。

**注意：** 这些主题脚本中的配置只对渲染`themes`文件夹中的模板有效。

## 提示

### 使用辅助函数

你可以向下面这样使用辅助函数。

```js
<!-- var: header = ${partial}('header') -->
${header|raw}
```