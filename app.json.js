function replaceProp(obj, f, t) {
  if (obj.hasOwnProperty(f)) obj[t] = obj[f];
  delete obj[f];
}
module.exports = {
  // match 可以是函数、正则、字符
  match: (f) => f.endsWith("/app.json"),
  parse(c, ctx) {
    // 组织新的app.json结构
    obj = require(c.from);
    // console.log(`obj`, obj);
    obj["window"] = {
      v8WorkerPlugins: "gcanvas_runtime,expar",
      v8Worker: 1,
      transparentTitle: "always",
      titlePenetrate: "YES", // 允许点击穿透后，才能触发导航栏上的 onTap 事件
      defaultTitle: "", // 将导航栏默认的 title 置空
      titleBarColor: "#000000",
    };
    if (obj.tabBar) {
      replaceProp(obj.tabBar, "custom", "customize");
      replaceProp(obj.tabBar, "list", "items");
      replaceProp(obj.tabBar, "color", "textColor");
      obj.tabBar.items.map((i) => {
        replaceProp(i, "text", "name");
        replaceProp(i, "iconPath", "icon");
        replaceProp(i, "selectedIconPath", "activeIcon");
      });
    }
    if (obj["subpackages"]) {
      obj["subPackages"] = obj["subpackages"];
      delete obj["subpackages"];

      /**
       * ignore packagePlugin
       */
      let delIndex = obj["subPackages"].findIndex((i) => i["root"] === "packagePlugin");
      if (~delIndex) obj["subPackages"].splice(delIndex, 1);
      /**
       * ignore packageEngine
       */
      let packageEngineIndex = obj["subPackages"].findIndex((i) => i["root"] === "packageEngine");
      if (~packageEngineIndex) obj["subPackages"].splice(packageEngineIndex, 1);
    }
    // 手动改改
    // delete obj["plugins"]["plugin1"]; // = { provider: "2021003177669072", version: "0.0.2" };
    // delete obj["plugins"]["plugin2"];
    // delete obj["sitemapLocation"];
    // // delete obj["subPackages"][0]["plugins"]["SPMallNavigation"];
    // obj["plugins"]["plugin2"] = {
    //   version: "*", // 0.0.6
    //   provider: "202100317766xxxx",
    // };
    // obj["plugins"]["plugin1"] = {
    //   version: "*", // 0.0.6
    //   provider: "2021003177669072",
    // };
    if (!obj["usingComponents"]) {
      obj["usingComponents"] = {};
    }
    // 适配open-data,声明全局组件
    Object.assign(obj["usingComponents"], {
      "open-data": "/components/opendata/opendata",
    });
    let pages = getPages(obj);
    pages.forEach((p) => {
      let ppath = p + ".js";
      if (!ctx.store.has(ppath)) ctx.store.set(ppath, new Map());
      ctx.store.get(ppath).set("pageDeclaration", true);
    });
    //         let cfMap = ctx.store.get(ppath);
    //         let v = cfMap.get("$replaceTag") || {};
    c.setStr(JSON.stringify(obj, null, "  "));
  },
};

function getPages(appConfig) {
  let pages = [];
  // todo 解析app.json中的page绝对路径
  return pages;
}
