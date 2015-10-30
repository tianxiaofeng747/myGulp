## 生产环境
- `dist/**/*.*`
- `vendor/**/*.*`
- `index.html`

## 必要工具
- **npm**
	- 用于安装工具包，安装nodejs后即可使用
- **bower**
	- 用于管理所需的第三方插件
- **gulp**
	- 用于文件的压缩，打包，以及版本控制

## 配置文件
- **json**
	- `bower.json`:（`bower init`／手动创建）存放第三方插件列表以及版本号
	- `manifest.json`:（`gulp-rev` 自动创建）存放`dist`/`vendor`中部分必要文件版本号，版本号由hash生成
	- `package.json`:（`npm init`／手动创建）存放建模工具包gulp及相关插件
- **js**
	- `gulpfile.js`: 建模配置文件，实现文件压缩，打包，版本控制等操作
		- 从`bower_components`目录中抽取必要文件，重新打包及生成压缩文件，发布至`vendor`目录
		- 将`src`目录下的文件全部编译（sass），压缩，打包，发布至`dist`目录
		- 用`gulp-rev`获得部分必要文件的hash至并重新生成路径并保存至`manifest.json`中
		- 用`gulp-rev-replace`将`manifest.json`中的版本号替换到实际调用路径（*.html及*.js中的内容）