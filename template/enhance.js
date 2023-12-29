import $my from "./$my";
const transformRules = [
  [
    "properties",
    "props",
    function (properties, rootConfig) {
      // console.log(`properties----------`, properties, rootConfig);
      if (!properties) return;
      let props = {};
      for (let key in properties) {
        let value = properties[key];
        if ("object" === typeof value) {
          if (value.hasOwnProperty("value")) props[key] = value.value;
          else if (value.type) {
            switch (value.type) {
              case Number:
                props[key] = 0;
              case String:
                props[key] = "";
              case Boolean:
                props[key] = false;
              case Array:
                props[key] = [];
              case Object:
                props[key] = {};
              default:
                props[key] = null;
            }
          } else {
            props[key] = null;
          }
        }
      }
      rootConfig.props = props;
      delete rootConfig.properties;
      return props;
    },
  ],
  ["data", "data"],
  [
    "observers",
    "observers",
    function (observers, rootConfig) {
      if (!observers || !Object.keys(observers).length) return;
      if (!rootConfig.options) {
        rootConfig.options = {
          observers: true,
        };
      } else {
        rootConfig.options.observers = true;
      }
    },
  ],
  ["methods", "methods"],
  ["behaviors", "mixins"],
  ["created", "onInit"],
  ["attached", "didUnmount"],
  ["ready", "ready"],
  ["moved", "moved"],
  ["detached", "detached"],
  ["relations", "relations"],
  [
    "lifetimes",
    "lifetimes",
    function (lifetimes, rootConfig) {
      if (!lifetimes || !Object.keys(lifetimes).length) return;
      if (!rootConfig.options) {
        rootConfig.options = {
          lifetimes: true,
        };
      } else {
        rootConfig.options.lifetimes = true;
      }
    },
  ],
  // "definitionFilter"
];
function triggerKeyToMethodName(k) {
  return "on" + k.charAt(0).toUpperCase() + k.slice(1);
}

const RootEventsMap = new Map([
  ["attached", "onLoad"],
  ["ready", "onReady"],
  ["detached", "onUnload"],
]);
function getAnimationKeyFromSelector(selector) {
  return selector.replace(/#|\.|\~/g, "").replace(/\-/g, "_") + "__animation";
}
function Adapter(type, c, typeStr, k, k2, k3) {
  let o_ = c[k];
  c[k] = function () {
    console.log(
      `[${this.route || this.is}] before ${typeStr} ${k}`,
      "data--",
      this.data,
      "props--",
      this.props,
      "mixins--",
      c.mixins,
      "opt",
      c
    );

    // triggerEvent
    this.triggerEvent = function (key, data) {
      const k = triggerKeyToMethodName(key);
      // console.log(`triggerEvent`, k, data);
      if (this.props[k]) {
        // console.log(this.props[k].toString());
        this.props[k]({ detail: data, target: { targetDataset: {} }, currentTarget: { dataset: {} } });
      }
    };
    // https://developers.weixin.qq.com/miniprogram/dev/framework/view/animation.html#%E5%85%B3%E9%94%AE%E5%B8%A7%E5%8A%A8%E7%94%BB
    this.clearAnimation = function (selector, options, callback) {
      // console.warn(`page.clearAnimation`, selector);
      this.setData(
        {
          [getAnimationKeyFromSelector(selector)]: null,
        },
        () => {
          callback && callback.apply(this);
          console.log(`this.clearAnimation:手动回调成功`);
        }
      );

      // this.props[triggerKeyToMethodName(key)] && this.props[triggerKeyToMethodName(key)]({ detail: data });
    };
    this.animate = function (selector, keyframes, duration, callback) {
      // console.log(`page.animate`, selector);
      const animation = my.createAnimation();

      let prevOffset = 0; // 上一个关键帧的偏移值

      keyframes.forEach(function (keyframe, index) {
        const offset = keyframe.offset || 0; // 当前关键帧的偏移值
        const currentDuration = (offset - prevOffset) * duration; // 当前关键帧的实际持续时间

        // 处理每个关键帧的属性
        for (let prop in keyframe) {
          if (prop === "offset" || prop === "timeFunction" || prop === "transformOrigin") {
            continue;
          }

          if (typeof animation[prop] === "function") {
            animation[prop](keyframe[prop]);
          } else {
            console.warn(`支付宝小程序不支持属性(${prop})`);
          }
        }

        // 添加当前关键帧的动画
        animation.step({
          duration: currentDuration,
          timeFunction: keyframe.timeFunction || "linear",
          transformOrigin: keyframe.transformOrigin || "50% 50% 0",
        });

        prevOffset = offset;
      });

      // 导出动画并设置数据
      const animationData = animation.export();
      this.setData({
        [getAnimationKeyFromSelector(selector)]: animationData,
      });

      // 使用 setTimeout 来检测动画是否完成
      setTimeout(function () {
        if (typeof callback === "function") {
          callback();
        }
      }, duration);
      setTimeout(() => {
        callback && callback.apply(this);
        console.log(`this.animate:过${duration}ms,手动回调成功`);
      }, duration);
      // this.props[triggerKeyToMethodName(key)] && this.props[triggerKeyToMethodName(key)]({ detail: data });
    };

    o_ && o_.apply(this, arguments);
  };
  if (typeStr == "Page") {
    // 手动改component为page的类型
    if (c.methods) {
      for (let k in c.methods) {
        c[k] = c.methods[k];
      }
      delete c.methods;
    }
    if (c.lifetimes) {
      for (let lifetime of ["attached", "ready", "moved", "detached"]) {
        let lifetimeFn = c.lifetimes[lifetime];
        if (lifetimeFn) {
          let pageLifeKey = RootEventsMap.get(lifetime);
          let pageLifeFunc = c[pageLifeKey];
          c[pageLifeKey] = function () {
            lifetimeFn && lifetimeFn.apply(this, arguments);
            pageLifeFunc && pageLifeFunc.apply(this, arguments);
          };
          console.log(`映射Page lifetimes ${lifetime} -> ${pageLifeKey}`);
        }
      }
    }
    if (c.pageLifetimes && Object.keys(c.pageLifetimes).length) {
      // show: // 页面被展示
      // hide: // 页面被隐藏
      // resize: // 页面尺寸变化
      for (let key in c.pageLifetimes) {
        // show hide resize
        let pFn = c.pageLifetimes[key];
        let fnK = triggerKeyToMethodName(key);
        let _fn = c[fnK];
        c[fnK] = function () {
          pFn && pFn.apply(this, arguments);
          _fn && _fn.apply(this, arguments);
        };
      }
    }
    // page中的behaviors
    if (c.behaviors) {
      for (let bh of c.behaviors) {
        if (bh.c) {
          if (bh.c.lifetimes && bh.c.lifetimes.attached) {
            // console.log('00000000000-------------------c.behaviors3');
            let _onLoad = c.onLoad;
            let attached = bh.c.lifetimes.attached;
            c.onLoad = async function () {
              this.$_onLoadP = (async () => {
                attached && (await attached.apply(this, arguments));
                _onLoad && (await _onLoad.apply(this, arguments));
              })();
            };
          }
          if (bh.c.methods && bh.c.methods.onLoad) {
            // console.log('00000000000-------------------c.behaviors3');
            let _onLoad = c.onLoad;
            let onLoad = bh.c.methods.onLoad;
            c.onLoad = async function () {
              this.$_onLoadP2 = (async () => {
                _onLoad && (await _onLoad.apply(this, arguments));
                onLoad && (await onLoad.apply(this, arguments));
              })();
            };
          }
          let _onShow = c.onShow;
          c.onShow = async function () {
            if (this.$_onLoadP) await this.$_onLoadP;
            if (this.$_onLoadP2) await this.$_onLoadP2;
            _onShow && _onShow.apply(this, arguments);
          };
        }
      }
    }
    let _onShow = c.onShow;
    c.onShow = function () {
      $my.fireAppRoute(this.route || this.is);
      _onShow && _onShow.apply(this);
    };
  }
  if (typeStr == "Behavior") {
    for (let lifetime of ["attached", "ready", "moved", "detached"]) {
      let fn = c[lifetime];
      if (fn) {
        if (!c.lifetimes) c.lifetimes = {};
        c.lifetimes[lifetime] = fn;
        // 补充 options - lifetimes
        if (!c.options) c.options = {};
        if (!c.options.lifetimes)
          c.options.options = {
            lifetimes: true,
          };
        // 在Page中Behavior的lifetimes将无效，考虑在page中的实现
        // 应对 Behavior用于Page的情况，只有 rootEvents 有效，对应page.events，而且onLoad无效
        // if (!c.rootEvents) c.rootEvents = {};
        // c.rootEvents[RootEventsMap.get(lifetime)] = fn;
        // console.log(`编译Behavior ${lifetime} -> rootEvents.${RootEventsMap.get(lifetime)}`);
      }
    }
    if (c.behaviors) {
      // 兼容behavior中的 behaviors层层调用
      let attacheds = [];
      for (let bh of c.behaviors) {
        if (bh.c) {
          if (bh.c.lifetimes && bh.c.lifetimes.attached) {
            // console.log('00000000000-------------------c.behaviors3');
            if (!c.lifetimes) c.lifetimes = {};
            let _attached = c.lifetimes.attached;
            let attached = bh.c.lifetimes.attached;
            attacheds.push(attached);
          }
          if (bh.c.methods && bh.c.methods.onLoad) {
            // console.log('00000000000-------------------c.behaviors3');
            if (!c.methods) c.methods = {};
            let _onLoad = c.methods.onLoad;
            let onLoad = bh.c.methods.onLoad;
            c.methods.onLoad = async function () {
              if (this.$_attached) await this.$_attached;
              console.log(`[${this.route || this.is}] methods.onLoad`, this.data);
              this.$_attached2 = (async () => {
                _onLoad && (await _onLoad.apply(this, arguments));
                onLoad && (await onLoad.apply(this, arguments));
              })();
            };

            let _onReady = c.methods.onReady;
            c.methods.onReady = async function () {
              console.log(`[${this.route || this.is}] methods.onReady`, this.data);
              if (this.$_attached2) await this.$_attached2;
              else if (this.$_attached) await this.$_attached;
              _onReady && _onReady.apply(this, arguments);
            };
          }
          let _onShow = c.onShow;
          c.onShow = async function () {
            console.log(`[${this.route || this.is}] onShow`, this.data);
            if (this.$_attached2) await this.$_attached2;
            else if (this.$_attached) await this.$_attached;
            _onShow && _onShow.apply(this, arguments);
          };
          let _onReady = c.onReady;
          c.onReady = async function () {
            console.log(`[${this.route || this.is}] onReady`, this.data);
            if (this.$_attached2) await this.$_attached2;
            else if (this.$_attached) await this.$_attached;
            _onReady && _onReady.apply(this, arguments);
          };
        }
      }
      let _attached = c.lifetimes.attached;
      c.lifetimes.attached = async function (options = {}, level = 1, k = "") {
        console.log(`[${this.route || this.is}] lifetimes.attached`, k);
        this.$_attached = (async () => {
          if (attacheds.length)
            await Promise.all(
              attacheds.map((at, index) =>
                at.apply(this, [options, level + 1, `${" ".repeat((level - 1) * 3)}->${level}#${index + 1}`])
              )
            );
          _attached && _attached.apply(this, arguments);
        })();
      };
    }
  }
  // pageLifetimes
  if (typeStr == "Component") {
    // attached	Function	否	组件生命周期函数 - 在组件实例进入页面节点树时执行
    // ready	Function	否	组件生命周期函数 - 在组件布局完成后执行
    // moved	Function	否	组件生命周期函数 - 在组件实例被移动到节点树另一个位置时执行
    // detached
    for (let lifetime of ["attached", "ready", "moved", "detached"]) {
      let fn = c[lifetime];
      if (fn) {
        if (!c.lifetimes) c.lifetimes = {};
        c.lifetimes[lifetime] = fn;
        // 补充 options - lifetimes
        if (!c.options) c.options = {};
        if (!c.options.lifetimes)
          c.options.options = {
            lifetimes: true,
          };

        // if (!c.rootEvents) c.rootEvents = {};
        // c.rootEvents[lifetime] = fn;
      }
    }
    if (c.lifetimes) {
      let attached = c.lifetimes.attached;
      c.lifetimes.attached = function () {
        // console.log('[lifetimes.attached]同步数据props->properties,data---------------')
        if (!this.properties) this.properties = {};
        let d = {};
        for (let k in this.props) {
          if (this.props[k] != this.properties[k]) {
            this.properties[k] = this.props[k];
          }
          if (this.props[k] != d[k]) {
            d[k] = this.props[k];
          }
        }
        if (Object.keys(d).length) {
          this.setData(d);
          // console.log('[lifetimes.attached]同步props->data', d, this.props);
        }
        attached && attached.apply(this);
      };
    }
    if (c.pageLifetimes && Object.keys(c.pageLifetimes).length) {
      if (!c.rootEvents) c.rootEvents = {};
      // show: // 页面被展示
      // hide: // 页面被隐藏
      // resize: // 页面尺寸变化
      for (let key in c.pageLifetimes) {
        // show hide resize
        let pFn = c.pageLifetimes[key];
        let fnK = triggerKeyToMethodName(key);
        let _fn = c.rootEvents[fnK];
        // if (_fn) {
        //   console.warn(`c.pageLifetimes[${key}] 即将被覆盖`)
        // }
        c.rootEvents[fnK] = function () {
          pFn && pFn.apply(this, arguments);
          _fn && _fn.apply(this, arguments);
        };
      }
    }
  }

  // this.props -> this.data
  c["deriveDataFromProps"] = function (nextProps) {
    // if (!this.data) this.data = {};
    // Object.assign(this.data, nextProps);
    let obj = {};
    if (!this.properties) this.properties = {};
    for (let key in nextProps) {
      const element = nextProps[key];
      if (element != this.properties[key]) obj[key] = element;
    }
    if (Object.keys(obj).length) {
      this.setData(obj);
      // console.log('deriveDataFromProps---------------',nextProps);
      Object.assign(this.properties, obj);
    }
  };

  // 卸载、回收
  const o2_ = c[k2];
  c[k2] = function () {
    console.log(`[${this.route || this.is}] ${typeStr} ${k2}`);
    // call original function
    o2_ && o2_.apply(this, arguments);
    // console.log(`[${this.route || this.is}] after ${typeStr} ${k2}`);
  };

  // console.log(`register ${typeStr} ${k}---`);

  for (let [fk, tk, fn] of transformRules) {
    if (fn) {
      if (!(fk === "properties" && typeStr == "Page")) fn(c[fk], c);
    } else if (tk && fk && tk !== fk && c[fk]) {
      c[tk] = c[fk];
      delete c[fk];
    }
  }
  // console.log(typeStr, c.mixins);
  if (c.mixins) {
    c.mixins = c.mixins.map((mixinGroup) => mixinGroup.i);
  }
  if (typeStr === "Behavior") {
    return { i: type(c), c };
  } else {
    return type(c);
  }
}

export function Behavior(config) {
  // wx https://developers.weixin.qq.com/miniprogram/dev/reference/api/Behavior.html
  return Adapter(Mixin, config, "Behavior", "didMount", "didUnmount");
}

export function $Page(config) {
  return Adapter(Page, config, "Page", "onLoad", "onUnload");
}
export function $Component(config) {
  return Adapter(Component, config, "Component", "created", "didUnmount", "attached");
}
