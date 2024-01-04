const { resolveRelationDir } = require('../util');
module.exports = function ({ types: _t }) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        // 处理引用"DataStorage"
        let v = path.get("source").node.value
        // .value;
        if (v.charAt(0) !== '.') {
          path.get("source").node.value = './' + path.get("source").node.value
        }
      },
      CallExpression(path, state) { },
      Identifier(path, state) {
        if ("wx" === path.node.name) {
          path.node.name = "$my";
          state.hasMy = true;
          // console.log(`my`); // 217个
        }
      },
      // StringLiteral(path, state) {
      //   if (!state.opts?.images) return;
      //   let imageSrc = (path.node as any).value;
      //   if (state.opts.images[imageSrc]) return;
      //   if (imageSrc && imageSrc.indexOf('http') < 0 && imageSrc.indexOf('/images') >= 0) {
      //     // console.log(`imageSrc`, imageSrc);
      //     state.opts.images[imageSrc] = 1
      //   }
      // },
      Program: {
        exit(path, state) {
          // 这里可以嵌入切片

          if (state.hasMy) {
            if (!state.hasMyDone) {
              let { to } = state.opts.c;
              let { template } = state.opts.ctx.$.core;
              let relativePath = resolveRelationDir(to, state.opts.ctx.config);
              relativePath += "/$my";
              const buildRequire = template(`import %%importName%% from %%source%%;`);
              const ast = buildRequire({
                importName: _t.identifier("$my"),
                source: _t.stringLiteral(relativePath)
              });
              if (!ast) return;
              try {
                path.unshiftContainer("body", ast);
              } catch (error) {
                debugger;
              }
              state.hasMyDone = true;
            }
          }
        }
      }
    }
  };
}
