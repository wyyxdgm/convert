const { existsSync } = require("fs-extra");
const {
  resolveRelationDir,
  resolveNpmLibRelationDir,
  unsupportDir,
  getAnimationKeyFromSelector,
  getStore,
  resolveMiniProgramRelationDir,
  existsNpmPath,
} = require("../util");
// --统计this.animate到unsupportDir--
// const fs = require("fs");
// const path = require("path");
// if (!fs.existsSync(unsupportDir)) fs.mkdirSync(unsupportDir, { recursive: true });
// const filePath = path.join(unsupportDir, "page-animate.js");
const generate = require("@babel/generator").default;
// fs.writeFileSync(filePath, "");

module.exports = function ({ types: _t }) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        let v = path.get("source").node.value;

        if (state.opts.ctx.config.dependencies[v]) {
          let { to } = state.opts.c;
          let relativePath = resolveMiniProgramRelationDir(to, state.opts.ctx.config);
          path.get("source").node.value = relativePath + "/" + v;
        }
        // .value;
        if (v.charAt(0) !== ".") {
          path.get("source").node.value = "./" + path.get("source").node.value;
        }
        if (~v.indexOf("typings")) {
          console.log("⚠️  删除", generate(path.node).code);
          path.remove();
        }
        if (~v.indexOf("recommend-routes-detail")) {
          console.log("⚠️  删除", generate(path.node).code);
          path.remove();
        }
        // 替代一些npm依赖 -- 微信demo特定

        if (~v.indexOf("./XrFrame")) {
          console.log("⚠️  删除", generate(path.node).code);
          path.remove();
        }
        if (~v.indexOf("./threejs-miniprogram")) {
          let { to } = state.opts.c;
          let relativePath = resolveMiniProgramRelationDir(to, state.opts.ctx.config);
          path.get("source").node.value = relativePath + "/" + "threejs-miniprogram";
        }
      },
      MemberExpression(path) {
        const { object, property } = path.node;
        if (_t.isIdentifier(property, { name: "selectComponent" })) {
          path.get("property").replaceWith(_t.identifier("$selectComponent"));
        }
        if (_t.isIdentifier(property, { name: "selectAllComponents" })) {
          path.get("property").replaceWith(_t.identifier("$selectAllComponents"));
        }
        // 微信的target.dataset -> 支付宝的target.targetDataset
        if (object.property && object.property.name === "target" && property.name === "dataset") {
          // 修改 property 的 name 为 "targetDataset"
          property.name = "targetDataset";
        }
      },
      CallExpression(path, state) {
        const { node } = path;
        let { c, ctx } = state.opts;
        // console.log(`node.callee`, node.callee);
        // if (
        //   _t.isMemberExpression(node.callee) &&
        //   _t.isIdentifier(node.callee.property, { name: "animate" })
        // )
        // console.log(`node.callee.object.name-------------`, node.callee?.object, c.from);
        // 处理animate
        if (
          _t.isMemberExpression(node.callee) &&
          _t.isIdentifier(node.callee.object, { name: "this" }) &&
          _t.isIdentifier(node.callee.property, { name: "animate" })
        ) {
          // --统计this.animate到unsupportDir--
          // let code = generate(node).code + ";\n";
          // fs.writeFileSync(filePath, code, { flag: "a" });
          if (path.node.arguments[0].type === "StringLiteral") {
            let selector = node.arguments[0].value;
            let animationKey = getAnimationKeyFromSelector(selector);
            let matchRes = null;
            let key = null;
            if ((matchRes = selector.match(/^#(\S+)$/))) {
              // id
              key = matchRes[1];
              let store = getStore(ctx, c.from.replace(/\.(j|t)s/, ".wxml"), "animateKey", Array);
              store.push({ id: key, animationKey });
            } else if ((matchRes = selector.match(/^\.(\S+)$/))) {
              // class
              key = matchRes[1];
              let store = getStore(ctx, c.from.replace(/\.(j|t)s/, ".wxml"), "animateKey", Array);
              store.push({ class: key, animationKey });
            } else {
              console.warn("[this.animate]无法解析selector适配", generate(node).code);
            }
          } else {
            console.warn("[this.animate]不支持非字符形式的selector适配", generate(node).code);
          }
        }

        if (path.node.callee.name == "require") {
          const args = path.node.arguments;
          let v = args[0].value;
          if (v) {
            if (state.opts.ctx.config.dependencies[v]) {
              if (!existsNpmPath(state.opts.ctx.config, v)) {
                console.warn(`[require]npm依赖声明但未安装 ${v}`);
              }
              let { to } = state.opts.c;
              let relativePath = resolveMiniProgramRelationDir(to, state.opts.ctx.config);
              args[0].value = relativePath + "/" + v;
            } else if (!~v.indexOf(".")) {
              if (
                // 小程序目录内
                state.opts.ctx.config.miniprogramRoot &&
                ~state.opts.c.from.indexOf(state.opts.ctx.config.miniprogramRoot)
              ) {
                console.warn(`[require]npm依赖未声明 ${v}`);
              }
            } else {
              // 相对路径
            }
          }
        }
      },
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
                source: _t.stringLiteral(relativePath),
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
        },
      },
    },
  };
};
