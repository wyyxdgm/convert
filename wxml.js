const xmlAttr = require("./config/wxml-attr");
const { appendClass, appendAttr, getStore, replaceChildArray, appendChildArray } = require("./util");
const fs = require("fs");
const path = require("path");
/**
 * 通过解析wxml代码，读取通过include依赖引入的相对路径文件内容,并用对应内容替换掉include标签
 * 如果对应文件内部也包括include标签，需要递归读取处理
 * 把处理完成的结果文件内容缓存到map中，并在获取文件内容时优先从通过wxmlPath获取
 * @param {*} wxmlCode wxml代码
 * @param {*} wxmlPath 当前wxml文件路径
 */
let unincludeContent = new Map();
function getNoIncludeWxml(rootDir, wxmlCode, wxmlPath) {
  if (unincludeContent.has(wxmlPath)) return unincludeContent.get(wxmlPath);
  // 匹配include的正则，src='path'可能是单引号
  const reg = /<include\s+src=['"]([^'"]+)['"]\s*\/?>/g;
  // 处理 <include src="../../../../templates/playCanvaesVideo/playCanvaesVideo.axml" />
  const importReg = /<import\s+src=['"]([^'"]+)['"]\s*\/?>/g;
  let match = null;
  while ((match = reg.exec(wxmlCode))) {
    let includePath = match[1];
    // 如果是相对路径，则需要拼接当前wxml文件路径
    if (includePath.startsWith("./") || includePath.startsWith("../")) {
      includePath = path.resolve(path.dirname(wxmlPath), includePath);
    } else {
      // 如果是绝对路径，则拼接rootDir
      includePath = path.join(rootDir, includePath);
    }
    if (!includePath.endsWith(".wxml")) includePath += ".wxml";
    let includeContent = fs.readFileSync(includePath, "utf-8");
    if (includeContent) {
      // 递归处理include进来的wxml
      includeContent = getNoIncludeWxml(rootDir, includeContent, includePath);
      // 缓存
      unincludeContent.set(wxmlPath, wxmlCode.replace(match[0], includeContent));
      // 替换include标签
      // 修正import引用路径
      if (importReg.test(includeContent)) {
        includeContent = includeContent.replace(importReg, (match) => {
          const src = match.match(/src=['"]([^'"]+)['"]/)[1];
          let filePath = src;
          if (src.startsWith("./") || src.startsWith("../")) {
            filePath = path.resolve(path.dirname(includePath), src);
          } else {
            filePath = path.join(rootDir, src);
          }
          let str = match.replace(src, path.relative(path.dirname(wxmlPath), filePath));
          return str;
        });
      }
      wxmlCode = wxmlCode.replace(match[0], includeContent);
    }
  }
  return wxmlCode;
}

/**
 * wxml测试代码段
 */
// 当前wxml文件路径 "/path/to/scan.wxml"
// ```wxml
// <include src='../../templates/template.wxml' />

// <wxs src="/components/navigation-status/navigation-status.wxs" module="nav_status_calc"></wxs>
// <include src="../components/scan/basic/scan-basic.wxml"/>
// ```;

module.exports = [
  {
    match: /\.wxml$/, // match 可以是函数、正则、字符
    parse(c, ctx) {
      const { wxml } = ctx.$;
      // 替换所有include标签
      let newWxml = getNoIncludeWxml(ctx.config.fromDir, c.getStr(), c.from);
      if (newWxml) c.setStr(newWxml);
      if (c.getStr() != newWxml) debugger;
      if (~newWxml.indexOf("<include")) debugger;
      const parsed = wxml.parse(c.getStr());
      // 解析依赖关系
      wxml.traverse(parsed, function visitor(node, parent) {
        if (node.tagName == "wxs") {
          //标签名更改
          node.tagName = "import-sjs";
          if (node.attributes.src) {
            node.attributes.from = node.attributes.src.replace(".wxs", ".sjs");
            delete node.attributes.src;
          } else {
            if (node.childNodes?.[0]?.textContent) {
              let code = node.childNodes[0].textContent;
              node.childNodes = [];
              node.attributes.from = `./${c._to.name}.sjs`; // 约定：一个axml只能引入一个wxs，会生成到同路径下，替换后缀
              node.selfClosing = true;
              code = code.replace(/module\.exports\s?\=/g, "export default");
              ctx.setStr(c.to.replace(".axml", ".sjs"), code);
            }
          }
        }
        if (node.tagName === "import") {
          node.attributes.src = node.attributes.src.replace(".wxml", ".axml");
        }
        if (node.tagName == "map") {
          if (node.attributes["bindupdated"]) {
            node.attributes["onInitComplete"] = node.attributes["bindupdated"];
            delete node.attributes["bindupdated"];
          }
          if (node.attributes["bind:updated"]) {
            node.attributes["onInitComplete"] = node.attributes["bind:updated"];
            delete node.attributes["bind:updated"];
          }
          if (!node.attributes["optimize"]) {
            node.attributes["optimize"] = true;
          }
        }
        if (node.tagName == "camera") {
          // <camera --- <camera id="camera"
          //标签名更改
          if (!node.attributes.id) node.attributes.id = "camera";
        }
        if (node.tagName == "input") {
          // 支付宝小程序input不支持Tap事件
          let onFocus = node.attributes["bindtap"] || node.attributes["bind:tap"] || node.attributes["bindfocus"];
          if (onFocus) node.attributes.onFocus = onFocus;
          delete node.attributes["bindtap"];
        }
        const type = node.type;
        if (type === wxml.NODE_TYPES.ELEMENT) {
          // 精确匹配
          batchReplace(node.attributes, xmlAttr);
          // 模糊匹配
          for (attrKey in node.attributes) {
            filterAttr(attrKey, node);
          }
        }
        /**
         * icon
         * icon 遇到onTap创建并挪到父节点view
         * icon size="?rpx"，换成?/2
         */
        if (node.tagName === "icon") {
          // 查找并处理 "onTap" 属性
          if (node.attributes["onTap"]) {
            // 创建一个新的 "view" 节点，将 "icon" 节点移动到此新节点下
            let viewNode = wxml.parse("<view></view>")[0];
            replaceChildArray(parent, node, viewNode); // childNodes
            viewNode.attributes.onTap = node.attributes["onTap"];
            delete node.attributes["onTap"];
            if (node.attributes["a:if"]) {
              viewNode.attributes["a:if"] = node.attributes["a:if"];
              delete node.attributes["a:if"];
            }
            appendChildArray(viewNode, node);
          }

          //  查找并处理 "size" 属性
          let size = node.attributes["size"];
          if (size && size.endsWith("rpx")) {
            // 将 "size" 的值除以 2
            let newSizeValue = parseInt(size) / 2;
            node.attributes["size"] = `${newSizeValue}`;
          }
        }
      });
      c.parsed = parsed;
      c.serialize = () => wxml.serialize(c.parsed).replace(/微信/g, "支付宝");
    }
  },
  {
    name: "适配标签样式/替换tag",
    match: /\.wxml$/, // match 可以是函数、正则、字符
    parse(c, ctx) {
      // console.log(`c.from`, c.from);
      if (ctx.store.has(c.from)) {
        let cstore = ctx.store.get(c.from);
        let $replaceTag = cstore.get("$replaceTag");
        let $appendClass = cstore.get("$appendClass");
        let animateKeyStore = getStore(ctx, c.from, "animateKey", false);
        // console.log(`c.from-----`, c.from, types, ctx.store);
        const { wxml } = ctx.$;
        wxml.traverse(c.parsed || wxml.parse(c.getStr()), function visitor(node, parent) {
          /**
           * appendClass
           */
          if ($appendClass && $appendClass[node.tagName]) {
            let className = $appendClass[node.tagName];
            //标签名更改
            // console.log("node.attributes.class", node.attributes.class);
            appendClass(node, className);
          }
          /**
           * replaceTag
           */
          if ($replaceTag && $replaceTag[node.tagName]) {
            node.tagName = $replaceTag[node.tagName];
          }

          if (animateKeyStore && animateKeyStore.length) {
            animateKeyStore.forEach((item) => {
              let needAppend = false;
              if (item.id && item.id == node.id) {
                if (item.id == node.id) needAppend = true;
              } else if (item.class && node.attributes && node.attributes.class) {
                let regex = new RegExp(`\\b${item.class}\\b`);
                let hasClassName = regex.test(node.attributes.class);
                if (hasClassName) needAppend = true;
              }
              if (!item.animationKey) {
                debugger;
              }
              if (needAppend) appendAttr(node, "animation", `{{${item.animationKey}}}`);
            });
          }
        });
      }
    }
  }
];

/**
 * @param {节点属性组成的对象} obj
 * @param {[oldKey,newkey,newValue | undefined]} AttrArray
 */
function batchReplace(obj, AttrArray) {
  for (attr of AttrArray) {
    replace(obj, ...attr);
  }
}

function replace(obj, oldkey, newkey, newValue) {
  if (newValue) {
    // 键值均更新
    obj[oldkey] && ((obj[newkey] = newValue), delete obj[oldkey]);
  } else {
    // 值不变，键更新
    obj[oldkey] && ((obj[newkey] = obj[oldkey]), delete obj[oldkey]);
  }
}

function filterAttr(key, node) {
  if (key.startsWith("wx:")) {
    node.attributes[key.replace("wx:", "a:")] = node.attributes[key]; // todo优化包括其他属性情况，一次处理
    delete node.attributes[key];
  }
  if (key.startsWith("bind")) {
    // 自定义组件事件转换（原生事件是精确转换，在先，以确保在此转换的都是自定义事件）; bind->on,首字母变大写（未转换的形如：bind:loadProgress）
    let temp = key.replace(":", "").slice(4);
    node.attributes["on" + temp[0].toUpperCase() + temp.slice(1)] = node.attributes[key];
    delete node.attributes[key];
  }
  if (key.startsWith("model:")) {
    // model:key="value"适配，目前支付宝看着不支持，所以先去掉
    let temp = key.replace("model:", "");
    node.attributes[temp] = node.attributes[key];
    delete node.attributes[key];
  }
}
