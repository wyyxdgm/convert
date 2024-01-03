const types = {
  "cover-image": 1,
  image: 1,
  button: 1,
  picker: 1,
};
module.exports = [
  {
    name: "适配标签样式",
    match: /\.(wxss|less)$/, // match 可以是函数、正则、字符
    parse(c, ctx) {
      // TOOD 不支持标签选择器，需要把标签选择器替换掉，+替换规则："标签名" -> "._标签名"
      // 同步 替换wxml
      // 1. `<标签名 class="xxxx"` 替换为 `<标签名 class="xxxx ._标签名"`
      // 2. `<标签名` 替换为 `<标签名 class="._标签名"`
      // ctx.store
      const { csstree } = ctx.$;

      let css = c.getStr();
      c.ast = csstree.parse(css);
      csstree.walk(c.ast, function (node) {
        if (node.type === "AtrulePrelude") {
          if (node.children) {
            node.children.cur = node.children.head;
            do {
              let c = node.children.cur.data;
              if (c.type === "String") {
                if (~c.value.indexOf(".wxss")) c.value = c.value.replace(".wxss", ".acss");
                break; // 只替换第一个字符串，如果有多个字符串，就不替换了。
              }
            } while ((node.children.cur = node.children.cur.next));
          }
        }
        if (node.type == "Raw" && node.value.match(/^\s*\/\//)) {
          let i = node.value.indexOf("\n");
          node.value = i > -1 ? "\n" + node.value.substr(i) : " ";
        }
        if (node.type === "TypeSelector") {
          if (node.name in types) {
            let className = `_xxx_${node.name}`;
            // console.log(`node.name`, node.name, c.from);
            let ppath = c.from.replace(".wxss", ".wxml");
            if (!ctx.store.has(ppath)) ctx.store.set(ppath, new Map());
            let pstore = ctx.store.get(ppath);
            let v = pstore.get("$appendClass") || {};
            v[node.name] = className;
            node.name = `.${className}`;
            if (!pstore.has("$appendClass")) pstore.set("$appendClass", v);
          }
        }
      });
      c.serialize = () =>
        csstree
          .generate(c.ast)
          .replace(/(\.acss";?)/g, "$1;\n")
          .replace(/\}/g, "}\n");
    },
  },
];
