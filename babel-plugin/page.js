const {
  resolveMiniProgramRelationDir,
} = require("../util");
const generate = require("@babel/generator").default;

module.exports = function ({ types: _t }) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        let v = path.get("source").node.value;
        // 替代一些npm依赖 -- 微信demo特定
        if (~v.indexOf("./XrFrame")) {
          console.log("⚠️  删除", generate(path.node).code);
          path.remove();
          path = null;
        }
        if (~v.indexOf("./threejs-miniprogram")) {
          let { to } = state.opts.c;
          let relativePath = resolveMiniProgramRelationDir(to, state.opts.ctx.config);
          path.get("source").node.value = relativePath + "/" + "threejs-miniprogram";
        }
        if (path && path.get("source").node.value.charAt(0) !== ".") {
          path.get("source").node.value = "./" + path.get("source").node.value;
        }
      },
    },
  };
};
