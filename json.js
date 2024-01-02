const { resolveMiniProgramRelationTargetDir, resolveRelationTargetDir } = require("./config");

// wx27602f810c4ff00d
module.exports = [
  {
    match: (f, t, ctx) =>
      f.match(/\.json$/) &&
      !f.endsWith("/app.json") &&
      !f.endsWith("/sitemap.json") &&
      !f.endsWith("/project.private.config.json") &&
      !f.endsWith("/project.project.json") &&
      !f.endsWith("/package-lock.json") &&
      !f.endsWith("/package.json"), // match 可以是函数、正则、字符
    parse(c, ctx, state) {
      let bb = c.getStr();
      let obj = {};
      try {
        obj = JSON.parse(bb);
      } catch (error) {
        console.log(`非法json`, c.from);
        console.log(error);
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
          if (~vv.indexOf("xxxxxxxxxxxxxxxxxx")) {
            obj.usingComponents[originalComponentName] = vv.replace(/xxxxxxxxxxxxxxxxxx/g, "<TODO:插件名称>");
          }
          if (~vv.indexOf("custom-tab-bar")) {
            delete obj.usingComponents[originalComponentName];
            //  = vv.replace("custom-tab-bar", "customize-tab-bar");
          }
          /**
           * 相对路径修复
           */
          if (!vv.startsWith("./") && !vv.startsWith("/") && !~vv.indexOf(":")) {
            let topLevelFolderName = vv.split("/")[0];
            // 如果是npm包
            if (ctx.config.dependencies[topLevelFolderName]) {
              obj.usingComponents[originalComponentName] =
                resolveMiniProgramRelationTargetDir(c.to, ctx.config.targetDir) + "/" + vv;
              if (ctx.config.verbose)
                console.log(`[json]替换miniprogram_npm依赖`, `${vv} -> ${obj.usingComponents[originalComponentName]}`);
            }
            if (topLevelFolderName === "weui-miniprogram") {
              obj.usingComponents[originalComponentName] =
                resolveRelationTargetDir(c.to, ctx.config.targetDir + "/" + "packageExtend/components") +
                "/" +
                vv.replace("weui-miniprogram/", "");
              if (ctx.config.verbose)
                console.log(`[json]替换weui-miniprogram依赖`, `${vv} -> ${obj.usingComponents[originalComponentName]}`);
            } else {
              obj.usingComponents[originalComponentName] = "./" + vv;
              if (ctx.config.verbose)
                console.log(`[json]替换相对路径依赖`, `${vv} -> ${obj.usingComponents[originalComponentName]}`);
            }
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
      }
      c.serialize = () => JSON.stringify(obj);
    },
  },
];
