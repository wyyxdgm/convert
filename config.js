const { relative, join, dirname } = require("path");
module.exports.resolveRelationDir = function (to, state) {
  let relativePath = join(relative(dirname(to), state.opts.ctx.config.targetDir));

  // let pluginP = join(state.opts.ctx.config.targetDir, "plugin");
  // let miniprogramP = join(state.opts.ctx.config.targetDir, "miniprogram");
  // let relativePath = null;
  // if (to.indexOf(pluginP) > -1) {
  //   relativePath = join(relative(dirname(to), pluginP));
  // } else {
  //   relativePath = join(relative(dirname(to), miniprogramP));
  // }
  return relativePath;
};

module.exports.resolveMiniProgramRelationDir = function (to, state) {
  let relativePath = join(relative(dirname(to), join(state.opts.ctx.config.targetDir, "miniprogram_npm")));

  // let pluginP = join(state.opts.ctx.config.targetDir, "plugin");
  // let miniprogramP = join(state.opts.ctx.config.targetDir, "miniprogram");
  // let relativePath = null;
  // if (to.indexOf(pluginP) > -1) {
  //   relativePath = join(relative(dirname(to), pluginP));
  // } else {
  //   relativePath = join(relative(dirname(to), miniprogramP));
  // }
  return relativePath;
};
module.exports.resolveNpmLibRelationDir = function (to, state) {
  let relativePath = join(relative(dirname(to), join(state.opts.ctx.config.targetDir, "npm_lib")));
  return relativePath;
};

module.exports.unsupportDir = join(__dirname, "./unsupport");

// 将 animate(selector)中的`selector`选择器转化为页面更新动画的属性，具体页面更新 animation="{{返回值}}"
module.exports.getAnimationKeyFromSelector = function (selector) {
  return selector.replace(/#|\.|\~/g, "").replace(/\-/g, "_") + "__animation";
};
/**
 * 获取页面对应store
 * @param {*} ctx ctx
 * @param {*} storePath 需要处理的页面路径
 * @param {*} storeKey 二级key
 * @param {*} ins false或者类型，默认Map
 * @returns 页面store
 */
module.exports.getStore = function (ctx, storePath, storeKey, ins = Map) {
  if (!ctx) throw Error("[getStore] no ctx");
  if (!ctx.store.has(storePath)) ctx.store.set(storePath, new Map());
  let cfMap = ctx.store.get(storePath);
  if (!cfMap.has(storeKey) && ins !== false) cfMap.set(storeKey, new ins());
  return cfMap.get(storeKey);
};

module.exports.appendClass = function (node, className) {
  if (node.attributes.class) node.attributes.class += ` ${className}`;
  else node.attributes.class = className;
};

module.exports.appendAttr = function (node, attr, value) {
  if (node.attributes[attr] && !~node.attributes[attr].indexOf(value)) node.attributes[attr] += ` ${value}`;
  else node.attributes[attr] = value;
};

module.exports.noExt = (str) => str.substring(0, str.lastIndexOf("."));
