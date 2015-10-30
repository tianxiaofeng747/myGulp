<a name="1.0.0-beta.7"></a>
# 1.0.0-beta.7 (2015-10-27)

### 新增
- `font-awesome` 字体图标

### 修改
- 采用`angular-ui-grid`的自带导出功能替换原导出功能
- 更换部分图标，用`font-awesome`的图标代替

<a name="1.0.0-beta.6"></a>
# 1.0.0-beta.6 (2015-10-24)

### 新增
- `angular-ui-grid` 表格插件
- `loadModules` 模块加载，异步加载第三方插件时使用
- 统计模块加入筛选及导出功能

### 修改
- 为避免全局变量名冲突，去除`constant`(`api`,`Menu`,`States`)，`value`(`User`,`Project`)的变量定义方式，直接赋值到`EMAPP`的扩展属性上
- 统计模块列表修改，采用`angular-ui-grid`来展现表格，并优化页面效果
- 用户退出时记录上一次路由地址
- `Project.current`默认指定返回数据的第一条

<a name="1.0.0-beta.5"></a>
# 1.0.0-beta.5 (2015-10-22)

### 新增
- `sweetalert` 提示插件，替换原来的`tips`

### 修改
- 调整css调用图片路径为绝对地址，便于`rev-replace`替换
- `project.html`中加入`ui-view`的`name`值，便于路由调用；退出链接采用`ui-sref`来解析
- 调整登录模块代码，采用本地写入`cookie`的方式记录认证
- http拦截器中加入未登录判断
- 调整路由配置，避免出现加载顺序的不同导致找不到对象的BUG，路由加载采用动态调用的方式
- `index.html`中更换第三方插件的调用
- `gulpfile.js`中对文件的编译及打包方式做调整，文件hash值采用尾参数加载，不在更改原文件名；并加入使用`q`插件

### 移除
- `_app.js`中移除`tips`函数及相关自定义样式
- `messenger`第三方插件
- `signinPanel.jpg`无用图片

<a name="1.0.0-beta.4"></a>
# 1.0.0-beta.4 (2015-10-17)

### 优化
- 调整全局样式，更换遮罩样式
- 调整模版，更改数据绑定
- 拆分`login`及`project`模块，单独调用
- 部分变量名称大小写调整
- 取消老式全局变量定义及使用方式，用angularjs设置公共对象，便于各模块注入调用
```javascript
//存储已登录用户信息
EMAPP.value('User', {});
//存储用户所拥有项目信息
EMAPP.register.value('Project', []);
```
- 调整模块中对公告对象的调用
- 调整路由配置，便于`$state.go('name')`的使用
- 扩展`EMAPP.register`动态注入方法
```javascript
provider: $provide.provider,
constant: $provide.constant,
value: $provide.value
```
- 加入admin跳转链接
- 移除无用文件

<a name="1.0.0-beta.3"></a>
# 1.0.0-beta.3 (2015-10-15)

### 优化
- 将favicon.png移至public目录下
- 文档统一移至docs目录下
- 调整gulpfile.js部分代码
```javascript
-    return rev(replace(gulp.src(distPath + 'js/app.min.js', { base: './public' }), './public/'), './public/')
+    return rev(replace(gulp.src(distPath + 'js/app.min.js', { base: './public/dist/' }), './public/dist/'), './public/dist/')
```

<a name="1.0.0-beta.2"></a>
# 1.0.0-beta.2 (2015-10-13)

### 新增功能
- 将$templateCache公开外部使用
```javascript
EMAPP.templateCache = $templateCache;
```
- 提供动态注入方法
```javascript
EMAPP.register = {
    controller: $controllerProvider.register,
    directive: $compileProvider.directive,
    filter: $filterProvider.register,
    factory: $provide.factory,
    service: $provide.service
};
```

### 改进细节
- 将ngRoute换成ui.router，支持多view
- 将部分view打包封装至$templateCache中，在对应的controller中调用

<a name="1.0.0-beta.1"></a>
# 1.0.0-beta.1 (2015-10-09)

### 新增
- 添加网站icon图标![favicon.png](public/favicon.png)

### 改进
- 新增3个插件
```
"eonasdan-bootstrap-datetimepicker": "~4.17.37",
"messenger": "~1.4.2",
"slimScroll": "~1.3.6"
```
- 将messenger插件应用到tips函数中，通过第三方插件实现提示功能
- 调整代码 `app.api.js`, `app.config.js`

<a name="1.0.0"></a>
# 1.0.0 start (2015-10-05)

- 从git.oschina.net中移植web部分代码文件至该库
