module.exports = {
  // match 可以是函数、正则、字符
  match: "project.config.json",
  parse(c, ctx) {
    // c.getStr 设置内容
    // c.setStr 获取当前内容
    // c.xxx 挂属性
    // c.serialize = ()=> 'bbb'; // 重写最终写入目标文件的内容，默认为c.getStr(),也就是原文件读取到的内容
    obj = require(c.from);
    // console.log(`obj`, obj);
    // 目前内容
    //   {
    //     "miniprogramRoot": "miniprogram/",
    //     "pluginRoot": "plugin/",
    //     "compileType": "plugin",
    //     "setting": {
    //         "urlCheck": false,
    //         "es6": true,
    //         "enhance": true,
    //         "postcss": true,
    //         "preloadBackgroundData": false,
    //         "minified": true,
    //         "newFeature": true,
    //         "coverView": true,
    //         "nodeModules": false,
    //         "autoAudits": false,
    //         "showShadowRootInWxmlPanel": true,
    //         "scopeDataCheck": false,
    //         "uglifyFileName": false,
    //         "checkInvalidKey": true,
    //         "checkSiteMap": true,
    //         "uploadWithSourceMap": true,
    //         "compileHotReLoad": false,
    //         "lazyloadPlaceholderEnable": false,
    //         "useMultiFrameRuntime": false,
    //         "useApiHook": false,
    //         "useApiHostProcess": false,
    //         "babelSetting": {
    //             "ignore": [],
    //             "disablePlugins": [],
    //             "outputPath": ""
    //         },
    //         "useIsolateContext": false,
    //         "userConfirmedBundleSwitch": false,
    //         "packNpmManually": false,
    //         "packNpmRelationList": [],
    //         "minifyWXSS": true,
    //         "disableUseStrict": false,
    //         "minifyWXML": true,
    //         "showES6CompileOption": false,
    //         "useCompilerPlugins": false,
    //         "ignoreUploadUnusedFiles": true
    //     },
    //     "appid": "wx27602f810c4ff00d",
    //     "projectname": "SPMinaARPlugin",
    //     "simulatorType": "wechat",
    //     "simulatorPluginLibVersion": {},
    //     "libVersion": "2.24.4",
    //     "srcMiniprogramRoot": "miniprogram/",
    //     "packOptions": {
    //         "ignore": [],
    //         "include": []
    //     },
    //     "editorSetting": {
    //         "tabIndent": "insertSpaces",
    //         "tabSize": 4
    //     },
    //     "description": "项目配置文件，详见文档：https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html",
    //     "condition": {}
    // }
    // 微信：https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html
    // 转
    // 支付宝：https://opendocs.alipay.com/mini/03dbc3
    let newObj = {
      enableAppxNg: true,
      format:2,
      // miniprogramRoot: "miniprogram",
      pluginRoot: obj.pluginRoot,
      compileType: obj.compileType,
      compileOptions: {
        component2: true,
        typescript: true,
        less: true
      },
      uploadExclude:obj.packOptions.ignore.map(item => {
        return item.value
      }),
      assetsInclude:"",
      "developOptions": {
        "hotReload": true
      },
      pluginResolution:"",
      scripts:""
    };
    c.setStr(JSON.stringify(newObj));
  }
};
