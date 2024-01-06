const path = require('path');
module.exports = [{
    match: /\.wxs$/,// match 可以是函数、正则、字符
    parse(c, ctx) {
      let bb = c.getStr();
      c.transform = ctx.$.core.transformFileSync(c.from, {
        sourceType: "module",
        presets: [
          [
            "@babel/preset-env",
            {
              modules: false,
              targets: {
                chrome: "60",
              },
            },
          ],
          ["@babel/preset-typescript", { onlyRemoveTypeImports: true }],
        ],
        plugins: [[path.join(__dirname, "./babel-plugin/babel-wxs.js")]],
      });
      c.serialize = () =>
        c.transform.code
          .replace(/module\.exports\s?\=/g, "export default")
          .replace(/module\.exports\.([^\s=]+)/g, "export const $1");
    }
}];