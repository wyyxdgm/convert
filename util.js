const { relative, join, dirname } = require("path");

module.exports.resolveRelationDir = function (to, config) {
  let relativePath = join(relative(dirname(to), join(config.targetDir, config.miniprogramRoot)));
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
  let relativePath = join(relative(dirname(to), config.targetMiniprogramNpmPath));

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
function replaceNode(list, oldNode, newNode) {
  if (oldNode.prev) {
    oldNode.prev.next = newNode; // 把老节点的上一个节点的next设置为新节点
    newNode.prev = oldNode.prev; // 把新节点的prev设置为老节点的上一个节点
  } else {
    // 如果老节点没有上一个节点，那么它就是头节点
    list.head = newNode; // 把新节点设置为头节点
  }

  if (oldNode.next) {
    oldNode.next.prev = newNode; // 把老节点的下一个节点的prev设置为新节点
    newNode.next = oldNode.next; // 把新节点的next设置为老节点的下一个节点
  } else {
    // 如果老节点没有下一个节点，那么它就是尾节点
    list.tail = newNode; // 把新节点设置为尾节点
  }

  // 清除老节点的链接
  oldNode.prev = null;
  oldNode.next = null;
}
module.exports.replaceNode = replaceNode; // 导出替换节点的函数，供wxml.js使用
// 定义一个替换节点的函数：
module.exports.replaceChild = function (parent, oldNode, newNode) {
  replaceNode(parent.children, oldNode, newNode);
};

module.exports.replaceChildArray = function (parent, oldNode, newNode) {
  let index = parent.childNodes.indexOf(oldNode);
  if (~index) parent.childNodes.splice(index, 1, newNode);
  else throw Error("[replaceChildArray] oldNode not in parent.childNodes");
  return newNode;
};
function appendChildArray(parent, node) {
  if (!parent.childNodes) parent.childNodes = [];
  parent.childNodes.push(node);
}
module.exports.appendChildArray = appendChildArray;