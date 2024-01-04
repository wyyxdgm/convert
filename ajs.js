const path = require("path");
const enhances = new Map([
  ["Page", "$Page"],
  ["Behavior", "Behavior"],
  ["Component", "$Component"],
  ["ComponentPage","$ComponentPage"],
]);
module.exports = [
  {
    // match 可以是函数、正则、字符
    match: (f) => {
      return /\.(j|t)s$/.test(f) && f.lastIndexOf("engine.js") < 0&& f.lastIndexOf("enhance.js") < 0;
    },
    parse(c, ctx) {
      c.transform = ctx.$.core.transformFileSync(c.from, {
        sourceType: "module",
        presets: [
          [
            "@babel/preset-env",
            {
              modules: false,
              targets: {
                chrome: "60"
              }
            }
          ],
          ["@babel/preset-typescript", { onlyRemoveTypeImports: true }],
        ],
        plugins: [
          "@babel/plugin-transform-block-scoping",
          // "@babel/plugin-transform-reserved-words",
          // "@babel/plugin-proposal-optional-chaining",
          [path.join(__dirname, "./babel-plugin/babel-replace-wx.js"), { c, ctx }],
          [path.join(__dirname, "./babel-plugin/babel-enhances.js"), { c, ctx, enhances }],
          [path.join(__dirname, "./babel-plugin/page.js"), { c, ctx, enhances }],
          // ...(parseOption?.plugins?.[f] || []),
          // [
          //   "./build/convert/babel-plugin/babel-plugin-relation.ts",
          //   {
          //     images: _images,
          //     module,
          //     insertImports: _insertImports,
          //     relations,
          //     wxAdapter: { api: wxAdapter.api, _wxImportAst, _wx: wxAdapter._wx, ignoreWxAdapter }
          //   }
          // ],
          // ["./build/convert/babel-plugin/babel-plugin-app-variable.ts", {}],
          // ["./build/convert/babel-plugin/babel-plugin-methods.ts", {}]
        ],
      });
      c.serialize = () => c.transform.code.replace(/微信/g, '支付宝');
    }
  }
];
