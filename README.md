# convert

这是一套基于命令行工具`wx-convert`，来实现代码跨端的模板框架。内部主要通过语法树解析源代码实现到目标代码的转换。框架内置了大部分通用的转换规则，并提供的灵活的方式来应对定制转换需求。

## 适用场景

- [x] 微信小程序转微信插件（TODO:模板待整理）
- [x] 微信插件转支付宝插件
- [x] 微信小程序转支付宝小程序（本模板）

## 使用

### 安装依赖

```bash
npm install
```

### 安装 cli

```bash
npm i -g wx-convert
# 局部安装
npm i wx-convert
```

### 配置入口文件

配置好 convert.config.js 文件，参考[convert.config.js](https://github.com/wyyxdgm/convert-miniprogram-to-aliminiprogram-template/blob/master/convert.config.js)

```bash
wx-convert aplugin
wx-convert aplugin -w # 监听模式，用于开发。已知问题:新建文件需重启，修改语法树相关需重启
wx-convert aplugin -v # 详细日志
```

## 参考文档

[wx-convert 使用文档](https://github.com/wyyxdgm/wx-convert#readme)
[convert-miniprogram 使用文档](https://github.com/wyyxdgm/convert-miniprogram-to-aliminiprogram-template#readme)

## 兼容性说明

### API

| 接口                                                  | 适配原理                                                                              | 说明                                                                                                                                                |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| this.animate(selector, keyframes, duration, callback) | 利用 my.createAnimation 实现动画数据，并更新到页面对应节点                            | keyframes 中的属性，需要是[my.ceateAnimation](https://opendocs.alipay.com/mini/api/ui-animation)中支持的属性。selector 不能是变量，必须是具体字符串 |
| wx.onLocationChange                                   | 在调用 my.startLocationUpdate 时通过 setInterval 每秒调用一次 my.getLocation 获取一次 | [my.getLocation](https://opendocs.alipay.com/mini/api/mkxuqd)                                                                                       |

## 文件说明

```
├── index.js --入口文件，由convert.config.js配置
├── ajs.js --转换ts/js
├── json.js --转换json
├── wxml.js --转换wxml
├── wxs.js --转换wxs
├── app.json.js --转换app.json
├── project.json.js --转换project.config.json
├── config.js --工具函数
├── babel-plugin
│   ├── babel-enhances.js
│   ├── babel-replace-wx.js
│   └── page.js
├── config
│   └── wxml-attr.js
├── template --将直接同步到支付宝根目录，由convert.config.js配置
│   ├── $my.js --将代替所有w，在支付宝小程序中运行
│   ├── BaseEvent.js
│   ├── components --适配的支付宝组件
│   │   └── opendata
│   │       ├── opendata.axml
│   │       ├── opendata.js
│   │       ├── opendata.json
│   │       └── opendata.less
│   ├── enhance.js --支付宝js适配，Component/Page/Behavior适配等
│   ├── log.js
│   └── tsconfig.json
├── unsupport
│   ├── page-animate.js
│   └── page-animate.md
└── wxss.js --转换wxss
```
