const { relative, join, dirname } = require("path");

module.exports.resolveRelationDir = function (to, state) {
  let relativePath = join(relative(dirname(to), state.opts.ctx.config.targetDir));
  return relativePath;
};

/**
 * 获取npm包的绝对路径
 * @param {*} config 配置
 * @param {*} packageName 包名
 * @returns
 */
module.exports.resolveNpmPath = function (config, packageName) {
  let npmPackagePath = join(config.fromDir, config.miniprogramRoot, "miniprogram_npm", packageName);
  return npmPackagePath;
};

module.exports.resolveMiniProgramRelationDir = function (to, state) {
  let relativePath = join(
    relative(dirname(to), join(state.opts.ctx.config.targetDir, config.miniprogramRoot, "miniprogram_npm"))
  );
  return relativePath;
};

module.exports.resolveMiniProgramRelationTargetDir = function (to, config) {
  let relativePath = join(relative(dirname(to), join(config.targetDir, config.miniprogramRoot, "miniprogram_npm")));

  return relativePath;
};

module.exports.resolveRelationTargetDir = function (to, config, dir) {
  let relativePath = join(relative(dirname(to), join(config.targetDir, config.miniprogramRoot, dir)));

  return relativePath;
};
module.exports.resolveNpmLibRelationDir = function (to, state) {
  let relativePath = join(
    relative(dirname(to), join(state.opts.ctx.config.targetDir, config.miniprogramRoot, "npm_lib"))
  );
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
