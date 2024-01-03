const { resolveRelationDir } = require("../util");
module.exports = function ({ types: t }) {
  return {
    visitor: {
      Identifier(path, state) {
        const enhanceKey = state.opts.enhances?.get(path.node.name);
        if (enhanceKey) {
          if (path.node.name === "Component" && state.opts.ctx.store.get(state.opts.c.from)?.get("pageDeclaration")) {
            enhanceKey = state.opts.enhances?.get("ComponentPage");
          }
          if (!enhanceKey) return;
          path.node.name = enhanceKey;
          if (!state.enhances) state.enhances = {};
          if (state.enhances[enhanceKey]) return;
          state.enhances[enhanceKey] = 1;
        }
      },
      Program: {
        exit(path, state) {
          const enhanceKeys = state.enhances && Object.keys(state.enhances);
          if (!enhanceKeys) return;
          let { to } = state.opts.c;
          let { template } = state.opts.ctx.$.core;
          let relativePath = resolveRelationDir(to, state);
          relativePath += "/enhance";
          if (enhanceKeys.find((k) => path.scope.hasBinding(k))) return;
          let sps = enhanceKeys.map((k) => t.importSpecifier(t.identifier(k), t.identifier(k)));
          let ast = t.importDeclaration(sps, t.stringLiteral(relativePath));
          path.unshiftContainer("body", ast);
        }
      }
    }
  };
};
