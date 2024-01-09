# easy-convert

这是一套基于命令行工具`easy-convert`，来实现代码跨端的模板框架。内部主要通过语法树解析源代码实现到目标代码的转换。框架内置了大部分通用的转换规则，并提供的灵活的方式来应对定制转换需求。

## 适用场景

- 微信小程序转微信插件
- 微信插件转支付宝插件
- 微信小程序转支付宝小程序

## 命令行

```bash
npm i -g easy-convert-cli --registry=http://registry.local.easyar/
```

配置好 convert.config.js 文件，参考[convert.config.js](../convert.config.js)

```bash
easy-convert aplugin
easy-convert aplugin -w # 监听模式，用于开发。已知问题:新建文件需重启，修改语法树相关需重启
easy-convert aplugin -v # 详细日志
```

## 参考文档

[easy-convert-cli 使用文档](http://registry.local.easyar/-/web/detail/easy-convert-cli)

## 兼容性说明

### API

| 接口                                                  | 适配原理                                                                       | 说明                                                                                                                                                |
| ----------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| this.animate(selector, keyframes, duration, callback) | 利用 my.createAnimation 实现动画数据，并更新到页面对应节点                     | keyframes 中的属性，需要是[my.ceateAnimation](https://opendocs.alipay.com/mini/api/ui-animation)中支持的属性。selector 不能是变量，必须是具体字符串 |
| wx.onLocationChange                                   | 在调用my.startLocationUpdate 时通过 setInterval 每秒调用一次 my.getLocation 获取一次 | [my.getLocation](https://opendocs.alipay.com/mini/api/mkxuqd) |
