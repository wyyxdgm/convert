module.exports = {
  // match 可以是函数、正则、字符
  match: (f) => f.endsWith("project.config.json"),
  parse(c, ctx) {
    // c.getStr 获取当前内容
    // c.setStr 设置内容
    // c.xxx 挂属性
    // c.serialize = ()=> 'bbb'; // 重写最终写入目标文件的内容，默认为c.getStr(),也就是原文件读取到的内容
    obj = require(c.from);
    // "项目配置文件，详见文档：https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html",
    // 微信：https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html
    // 转
    // 支付宝：https://opendocs.alipay.com/mini/03dbc3
    let newObj = {
      appid: '2021004105687121',
      enableAppxNg: true,
      format: 2,
      miniprogramRoot: obj.miniprogramRoot,
      pluginRoot: obj.pluginRoot,
      compileType: obj.compileType,
      compileOptions: {
        component2: true,
        typescript: true,
        less: true,
        globalObjectMode: "enable",
      },
      uploadExclude: obj.packOptions.ignore.map((item) => {
        return item.value;
      }),
      assetsInclude: "",
      developOptions: {
        hotReload: true,
      },
      pluginResolution: "",
      scripts: "",
    };
    c.setStr(JSON.stringify(newObj));
  }
};
