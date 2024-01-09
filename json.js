// wx27602f810c4ff00d
const path = require('path');
module.exports = [
  {
    match: (f, t, ctx) =>
      f.match(/\.json$/) &&
      !f.endsWith(`${path.sep}app.json`) &&
      !f.endsWith(`${path.sep}sitemap.json`) &&
      !f.endsWith(`${path.sep}project.private.config.json`) &&
      !f.endsWith(`${path.sep}project.project.json`) &&
      !f.endsWith(`${path.sep}package-lock.json`) &&
      !f.endsWith(`${path.sep}package.json`), // match 可以是函数、正则、字符
    parse(c, ctx) {
      let bb = c.getStr();
      let obj = {};
      try {
        obj = JSON.parse(bb);
      } catch (error) {
        console.log(`非法json`, c.from);
        // console.log(error);
        return;
      }
      // 禁用默认共享，使用apply-shared方案。https://opendocs.alipay.com/mini/framework/component-template?pathHash=5dcb7a97#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F%E9%9A%94%E7%A6%BB
      if (undefined === obj.styleIsolation) {
        obj.styleIsolation = "apply-shared";
      }
      if (obj.usingComponents) {
        for (let originalComponentName in obj.usingComponents) {
          /**
           * 替换插件
           */
          let vv = obj.usingComponents[originalComponentName];
          if (~vv.indexOf("wx27602f810c4ff00d") || ~vv.indexOf("wx513725758120fb69")) {
            obj.usingComponents[originalComponentName] = vv.replace(
              /wx27602f810c4ff00d|wx513725758120fb69/g,
              "SPARPlugin"
            );
          }
          if (~vv.indexOf("custom-tab-bar")) {
            delete obj.usingComponents[originalComponentName];
            //  = vv.replace("custom-tab-bar", "customize-tab-bar");
          }
          /**
           * 收集大写组件
           */
          let standardComponentName = originalComponentName.toLowerCase();
          if (originalComponentName !== standardComponentName) {
            standardComponentName = originalComponentName
              .split("")
              .map((char) => (char.match(/[A-Z]/) ? `-${char.toLowerCase()}` : char))
              .join("")
              .replace(/^\-/, "");
            let ppath = c.from.replace(".json", ".wxml");
            if (!ctx.store.has(ppath)) ctx.store.set(ppath, new Map());
            let cfMap = ctx.store.get(ppath);
            let v = cfMap.get("$replaceTag") || {};
            v[originalComponentName] = standardComponentName;
            if (!cfMap.has("$replaceTag")) cfMap.set("$replaceTag", v);
            obj.usingComponents[standardComponentName] = obj.usingComponents[originalComponentName];
            delete obj.usingComponents[originalComponentName];
          }
        }
        // 最近在装修，打算再过个两个月就搬
      }
      // "usingComponents": {
      //   "clsclient": "plugin://wx27602f810c4ff00d/spar-clsvkclient",
      //   "playcanvas": "plugin://wx27602f810c4ff00d/spar-playcanvas"
      // },
      c.serialize = () => JSON.stringify(obj);
    }
  }
];
