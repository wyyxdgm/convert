import $my from "../$my";
/* 
* version: 0.8.12
* buildTime: 2023/12/23 19:30:02
*/
(function (v, T) {
  typeof exports == "object" && typeof module < "u" ? T(exports) : typeof define == "function" && define.amd ? define(["exports"], T) : (v = typeof globalThis < "u" ? globalThis : v || self, T(v["tiny-runtime"] = {}));
})(this, function (v) {
  "use strict";

  var T = (r => (r.Annotation = "Annotation", r.GLTF = "gltf", r.TinyAPP = "TinyAPP", r.Empty = "empty", r.TestTemplate = "testTemplate", r))(T || {}),
    w = (r => (r.auto = "auto", r.distance = "distance", r.manual = "manual", r.area = "area", r))(w || {});
  class E {
    constructor() {
      this.init = (t, e, s) => {
        this.pc = t, this.app = e, this.loadScriptFromString = s;
      }, this.loadTinyApp = (t, e, s) => {
        let i = t.slice(0, t.lastIndexOf("/")),
          n = i.slice(0, i.lastIndexOf("/"));
        return new Promise((o, h) => {
          console.log("loadConfig", t), n.startsWith("https://sightp-tour-tiny-app.sightp.com") || console.warn("\u672A\u4F7F\u7528 tinyapp \u57DF\u540D"), console.log("baseUrl", n), new Promise((l, u) => {
            typeof $my < "u" && !$my.isMy ? $my.request({
              url: t,
              method: "GET",
              responseType: "text",
              dataType: "json",
              success: d => {
                const y = d.data;
                l(y);
              },
              fail: d => {
                console.error(d), u(d);
              }
            }) : this.pc.http.get(t, {
              cache: !0
            }, (d, y) => {
              d ? u(d) : l(y);
            });
          }).then(l => {
            s(.1);
            const u = d => {
              s(.1 + d * .85);
            };
            this.app.assets.prefix = n + "/", this._loadTinyAppAssets(l.assets, e.assetTag, u).then(() => l.scriptUrl ? this._loadScript(n + "/" + l.scriptUrl, e) : Promise.resolve()).then(() => {
              s(.99);
              let d = new this.pc.Template(this.app, l.template);
              s(1), o(d.instantiate());
            }).catch(d => {
              h(d);
            });
          }).catch(l => {
            h(l);
          });
        });
      }, this.loadTemplate = (t, e, s) => new Promise((i, n) => {
        let o = t;
        if (!o) {
          n("asset is null");
          return;
        }
        o.loaded ? (s(1), i(o.resource.instantiate())) : (this.app.assets.load(o), o.once("load", () => {
          s(1), i(o.resource.instantiate());
        }));
      }), this.loadGltf = (t, e, s) => new Promise((i, n) => {
        let o = this._generateId(t),
          h = this.app.assets.get(o),
          l = t.slice(t.lastIndexOf("/") + 1);
        if (h || (h = new this.pc.Asset(l, "container", {
          url: t
        }), h.id = o, this.app.assets.add(h)), h.tags.add(e.assetTag), h.loaded) {
          let u = new this.pc.Entity();
          u.name = l, u.addComponent("model", {
            type: "asset",
            asset: h.resource.model
          }), s(1), i(u);
        } else {
          let u = !1;
          h.once("load", d => {
            if (u) return;
            u = !0;
            let y = new this.pc.Entity();
            y.name = l, y.addComponent("model", {
              type: "asset",
              asset: d.resource.model
            });
            let p = [];
            d.resource.animations && d.resource.animations.length > 0 && (d.resource.animations.forEach(f => {
              f.name = f.resource.name, p.push(f.id);
            }), y.addComponent("animation", {
              activate: !0,
              assets: p,
              loop: !0
            })), s(1), i(y);
          }), h.once("error", d => {
            n(d);
          }), this.app.assets.load(h);
        }
      }), this.unloadTinyApp = t => {
        let e = this.app.assets.findByTag(t);
        for (let s = 0; s < e.length; s++) e[s].tags.remove(t), e[s].tags.list().length == 0 && (e[s].loaded ? (e[s].unload(), this.app.assets.remove(e[s])) : e[s].loading && (e[s].off("load"), e[s].unload(), this.app.assets.remove(e[s])));
      }, this._cachedScript = [];
    }
    static get Instance() {
      return this._instance || (this._instance = new this());
    }
    _loadTinyAppAssets(t, e, s) {
      return new Promise((i, n) => {
        let o = 0,
          h = Object.keys(t).length;
        for (let l in t) {
          let u = this.app.assets.get(Number.parseInt(t[l].id));
          u || (u = new this.pc.Asset(t[l].name, t[l].type, t[l].file, t[l].data), u.id = t[l].id, this.app.assets.add(u)), u.tags.add(e), u.loaded ? (o++, s(o / h), o >= h && i(null)) : (u.once("load", () => {
            o++, s(o / h), o >= h && i(null);
          }), u.once("error", d => {
            n(d);
          }), this.app.assets.load(u));
        }
        h == 0 && i(null);
      });
    }
    _loadScript(t, e) {
      return new Promise((s, i) => {
        if (this._cachedScript.indexOf(t) >= 0) {
          s(null);
          return;
        }
        this.pc.http.get(t, {
          cache: !0,
          responseType: "text"
        }, (n, o) => {
          if (n) i(n);else {
            const h = {
              console,
              pc: this.pc,
              app: this.app,
              $my: typeof $my < "u" ? $my : null,
              my: typeof my < "u" ? my : null,
              setTimeout,
              setInterval,
              clearTimeout,
              clearInterval,
              Float32Array,
              $TinyLoader: E.Instance,
              $TinyLuncher: g.Instance,
              $GetTinyRoot: function (l) {
                return I.call(l);
              }
            };
            typeof window < "u" && document && document.body ? (new Function(...Object.keys(h), o)(...Object.values(h)), this._cachedScript.push(t), s(null)) : this.loadScriptFromString ? (this.loadScriptFromString(o, h), this._cachedScript.push(t), s(null)) : (console.warn("loadScriptFromString is null"), s(null));
          }
        });
      });
    }
    _generateId(t) {
      let e = 5381;
      for (let s = 0; s < t.length; s++) e = e * 33 ^ t.charCodeAt(s);
      return e >>> 0;
    }
    release() {
      E._instance = null;
    }
  }
  function $(r, t) {
    if (!r) throw new Error("entity is null!");
    if (!g.Instance.inited) throw new Error("TinyLuncher is not inited!");
    if (t) {
      const e = t.type.toLowerCase();
      switch (e) {
        case T.Annotation.toLowerCase():
          return new U(r, t);
        case T.TinyAPP.toLowerCase():
          return new S(r, t);
        case T.TestTemplate.toLowerCase():
          return new S(r, t);
        case T.GLTF.toLowerCase():
          return new S(r, t);
        case T.Empty.toLowerCase():
          return new k(r, t);
        default:
          return console.error("\u672A\u77E5\u7684 TinyRoot \u7C7B\u578B:", e), new k(r, t);
      }
    }
    return new k(r);
  }
  class k {
    constructor(t, e) {
      if (this.children = [], this._inited = !1, this._loading = !1, this._loaded = !1, this._active = !1, !t) throw new Error("entity is null!");
      if (!g.Instance.inited) throw new Error("TinyLuncher is not inited!");
      if (this.pc = g.Instance.pc, this.app = g.Instance.app, this.camera = g.Instance.camera, this.rootEntity = t, e) {
        if (e.externalData && typeof e.externalData == "string") try {
          e.externalData = JSON.parse(e.externalData);
        } catch (s) {
          console.error(s);
        }
        this.externalData = e.externalData, this.rawData = e, e.type === "empty" && (console.log("init tinyRoot from empty"), this.inited = !0, this.loaded = !0, this.active = !0);
      }
    }
    get assetTag() {
      return this.rootEntity.getGuid();
    }
    set inited(t) {
      this._inited !== t && (this._inited = t, this.fire("inited", this));
    }
    set loading(t) {
      this._loading !== t && (this._loading = t, t && this.fire("start_load", this));
    }
    set loaded(t) {
      this._loaded !== t && (this._loaded = t, t ? this.fire("loaded", this) : this.fire("unloaded", this));
    }
    set active(t) {
      this._active !== t && (console.log("set active:", t, ":", this.rootEntity.name), this._active = t, this.fire("active", this, t));
    }
    get loading() {
      return this._loading;
    }
    get loaded() {
      return this._loaded;
    }
    get active() {
      return this._active;
    }
    get inited() {
      return this._inited;
    }
    load(t) {}
    setActive(t) {
      this._active !== t && (t ? this.rootEntity.children.forEach(e => {
        e.enabled = !0;
      }) : this.rootEntity.children.forEach(e => {
        e.enabled = !1;
      }), this.active = t);
    }
    unLoad() {
      !this._loaded || (this.children.forEach(t => {
        g.Instance.removeTinyRoot(t.rootEntity);
      }), this.rootEntity.children.forEach(t => {
        t.destroy();
      }), E.Instance.unloadTinyApp(this.assetTag), console.log(`unLoad ${this.rootEntity.name}`), this.loaded = !1);
    }
    destroy() {
      g.Instance.removeTinyRoot(this.rootEntity);
    }
    _addRootHandlerScript(t = this.rootEntity, e = this.rawData) {
      setTimeout(() => {
        t.script || t.addComponent("script"), t.script.has("sdsTinyRootHandler") || (console.log("\u6DFB\u52A0 sdsTinyRootHandler \u811A\u672C\u5230\uFF1A", t.name), t.script.create("sdsTinyRootHandler", {
          attributes: e
        }));
      });
    }
    on(t, e, s) {
      this.rootEntity.on(t, e, s);
    }
    off(t, e, s) {
      this.rootEntity.off(t, e, s);
    }
    once(t, e, s) {
      this.rootEntity.once(t, e, s);
    }
    fire(t, ...e) {
      this.rootEntity.fire(t, ...e);
    }
  }
  class S extends k {
    constructor(t, e) {
      if (super(t, e), this._currentAnimName = "", e) switch ((!t.script || !t.script.has("sdsTinyRootHandler")) && this._addRootHandlerScript(), this.inited = !0, e.type.toLowerCase()) {
        case "tinyapp":
          console.log("init tinyRoot from TinyAPP");
          break;
        case "testtemplate":
          console.log("init tinyRoot from testTemplate");
          break;
        case "gltf":
          console.log("init tinyRoot from gltf");
          break;
      }
    }
    load(t) {
      if (super.load(t), this._loading || this._loaded) return;
      let e = null,
        s = n => {
          this.fire("load_prograss", n, this);
        },
        i = this.rawData.tinyAppUrl ? this.rawData.tinyAppUrl : this.rawData.url;
      switch (this.rawData.type.toLowerCase()) {
        case "tinyapp":
          if (!i.endsWith(".json")) throw console.error("tinyAppUrl is not end with .json"), new Error("tinyAppUrl is not end with .json");
          this.loading = !0, e = E.Instance.loadTinyApp(i, this, s);
          break;
        case "testtemplate":
          this.loading = !0, e = E.Instance.loadTemplate(this.rawData.template, this, s);
          break;
        case "gltf":
          if (!(i.toLowerCase().endsWith(".glb") || i.toLowerCase().endsWith(".gltf"))) throw console.error("tinyAppUrl is not end with .glb or .gltf"), new Error("tinyAppUrl is not end with .glb or .gltf");
          this.loading = !0, e = E.Instance.loadGltf(this.rawData.tinyAppUrl ? this.rawData.tinyAppUrl : this.rawData.url, this, s);
          break;
      }
      e.then(n => {
        var o;
        this.loaded || (n.enabled = !1, this.rootEntity.addChild(n), n.setLocalPosition(0, 0, 0), n.setLocalEulerAngles(0, 0, 0), this._modelRoot = n, console.log("load over:", this.rootEntity.name), this.loading = !1, this.loaded = !0, this.active ? n.enabled = !0 : this.rawData.showCondition == "auto" && (console.log(`auto show ${this.rootEntity.name}`), this.active = !0, n.enabled = !0), (o = this.externalData) != null && o.clickable && (n.script || n.addComponent("script"), n.script.has("sdsClickable") || (console.log("\u6DFB\u52A0 sdsClickable \u811A\u672C\u5230\uFF1A", n.name), n.script.create("sdsClickable"))), n.animation && (this._animation = n.animation), t && t(null));
      }).catch(n => {
        console.error(n), this._loading = !1, t && t(n);
      });
    }
    get animation() {
      return this._animation || console.warn(`${this._modelRoot.name} entity has no animation component`), this._animation;
    }
    playAnimation(t, e) {
      if (!this._animation) {
        console.warn(`${this._modelRoot.name} entity has no animation component`);
        return;
      }
      this._animation.speed = 1, this._currentAnimName !== t && (this._animation.currentTime = 0, this._animation.play(t, e), this._currentAnimName = t);
    }
    stopAnimation() {
      if (!this._animation) {
        console.warn(`${this._modelRoot.name} entity has no animation component`);
        return;
      }
      this._animation.speed = 0;
    }
  }
  class U extends k {
    constructor(t, e) {
      super(t, e), e && e.type === "Annotation" && (console.log("init tinyRoot from Annotation"), this._createEntitysFromAnnotation(e.ema), this.inited = !0, this.loaded = !0, this.active = !0);
    }
    _createEntitysFromAnnotation(t) {
      t.blocks.forEach(e => {
        const s = new this.pc.Entity(e.id);
        s.setGuid(e.id), s.setPosition(e.transform.position.x, e.transform.position.y, e.transform.position.z), s.setRotation(e.transform.rotation.x, e.transform.rotation.y, e.transform.rotation.z, e.transform.rotation.w), s.setLocalScale(e.transform.scale.x, e.transform.scale.y, e.transform.scale.z), this.rootEntity.addChild(s), this.app.fire("rejesterBlock", s.name, s);
      }), t.annotations.forEach(e => {
        if (e.type != "node") return;
        const s = new this.pc.Entity(e.properties.name);
        s.setGuid(e.id);
        let i = e.localTransform ? e.localTransform : e.transform;
        if (s.setLocalPosition(i.position.x, i.position.y, i.position.z), e.geometry === "cube" ? (s.setLocalRotation(i.rotation.x, i.rotation.y, i.rotation.z, i.rotation.w), s.setLocalScale(i.scale.x, i.scale.y, i.scale.z), this.externalData && this.externalData.show && s.addComponent("render", {
          enabled: !0,
          type: "box"
        }), s.name.toLowerCase().startsWith("mask") && (s.render || s.addComponent("render", {
          enabled: !0,
          type: "box"
        }), s.script || s.addComponent("script"), s.script.has("sdsMask") || (console.log("\u6DFB\u52A0 sdsMask \u811A\u672C\u5230\uFF1A", s.name), s.script.create("sdsMask"))), s.name.toLowerCase().startsWith("area") && (s.script || s.addComponent("script"), s.script.has("sdsMarkArea") || (console.log("\u6DFB\u52A0 sdsMarkArea \u811A\u672C\u5230\uFF1A", s.name), s.script.create("sdsMarkArea")))) : (this.externalData && this.externalData.show && s.addComponent("render", {
          enabled: !0,
          type: "sphere"
        }), s.setLocalScale(.2, .2, .2)), e.properties["wenlv:tinyapp"]) {
          console.log("\u53D1\u73B0 tinyapp \u4FE1\u606F");
          const n = e.properties["wenlv:tinyapp"];
          this._addRootHandlerScript(s, n);
        }
        this.rootEntity.findByGuid(e.parent.id).addChild(s);
      });
    }
  }
  const I = function () {
    if (this.entity) {
      if (this.__tr) return this.__tr;
      let r = this.entity.parent,
        t;
      for (; !(r.name == "Root" || (t = g.Instance.findTinyRoot(r), t));) r = r.parent;
      return this.__tr = t, t;
    }
  };
  function G(r, t) {
    class e extends r.ScriptType {
      constructor() {
        super(...arguments), this._nextCheckTimer = 0;
      }
      initialize() {
        let i = {
          type: this.type,
          tinyAppUrl: this.tinyAppUrl,
          template: this.testTemplate,
          loadCondition: this.loadCondition,
          loadDistance: this.loadDistance,
          loadAreas: this.loadAreas,
          showCondition: this.showCondition,
          showDistance: this.showDistance,
          showAreas: this.showAreas,
          externalData: this.externalData
        };
        this.tinyRoot = g.Instance.findTinyRoot(this.entity), this.tinyRoot || (console.log("sdsRootHandler \u521B\u5EFA TinyRoot,entity:", this.entity.name), this.tinyRoot = g.Instance.instantiateFromTinyApp(i, this.entity, I.call(this))), this.loadCondition == w.auto && !this.tinyRoot.loaded && !this.tinyRoot.loading && this.tinyRoot.load(), (this.loadCondition == w.area || this.showCondition == w.area) && (this.app.on("enter_area", this.onEnterArea, this), this.app.on("exit_area", this.onExitArea, this), this.on("destroy", () => {
          this.app.off("enter_area", this.onEnterArea, this), this.app.off("exit_area", this.onExitArea, this);
        }));
      }
      onEnterArea(i) {
        this.loadCondition == w.area && this.loadAreas && this.loadAreas.includes(i) && !this.tinyRoot.loaded && !this.tinyRoot.loading && this.tinyRoot.load(), this.showCondition == w.area && this.showAreas && this.showAreas.includes(i) && this.tinyRoot.setActive(!0);
      }
      onExitArea(i) {
        this.loadCondition == w.area && this.loadAreas && this.loadAreas.includes(i) && this.tinyRoot.loaded && this.tinyRoot.unLoad(), this.showCondition == w.area && this.showAreas && this.showAreas.includes(i) && this.tinyRoot.setActive(!1);
      }
      update(i) {
        if (!this.tinyRoot || (this.loadCondition == w.auto || this.loadCondition == w.manual) && (this.showCondition == w.auto || this.showCondition == w.manual) || (this._nextCheckTimer -= i, this._nextCheckTimer > 0)) return;
        let n = this.entity.getPosition().clone().sub(this.tinyRoot.camera.getPosition().clone()).lengthSq();
        this.loadCondition == w.distance && (!this.tinyRoot.loaded && !this.tinyRoot.loading && n < Math.pow(this.loadDistance, 2) ? this.tinyRoot.load() : this.tinyRoot.loaded && n > Math.pow(this.loadDistance, 2) && this.tinyRoot.unLoad()), this.tinyRoot.loaded && this.showCondition == w.distance && (!this.tinyRoot.active && n < Math.pow(this.showDistance, 2) ? this.tinyRoot.setActive(!0) : this.tinyRoot.active && n > Math.pow(this.showDistance, 2) && this.tinyRoot.setActive(!1));
        let o = Math.sqrt(n);
        this._nextCheckTimer = o / 10;
      }
    }
    r.registerScript(e, "sdsTinyRootHandler", t), e.attributes.add("type", {
      type: "string",
      default: "TinyAPP",
      enum: [{
        TinyAPP: "TinyAPP"
      }, {
        testTemplate: "testTemplate"
      }, {
        gltf: "gltf"
      }]
    }), e.attributes.add("testTemplate", {
      type: "asset",
      assetType: "template",
      default: null
    }), e.attributes.add("tinyAppUrl", {
      type: "string",
      default: ""
    }), e.attributes.add("loadCondition", {
      type: "string",
      default: "manual",
      enum: [{
        auto: "auto"
      }, {
        distance: "distance"
      }, {
        manual: "manual"
      }, {
        area: "area"
      }],
      description: "auto: \u81EA\u52A8\u52A0\u8F7D; distance: \u6839\u636E\u8DDD\u79BB\u52A0\u8F7D; manual: \u624B\u52A8\u52A0\u8F7D;area: \u76F8\u673A\u8FDB\u5165\u67D0\u533A\u57DF\u65F6\u52A0\u8F7D;"
    }), e.attributes.add("loadDistance", {
      type: "number",
      default: 5
    }), e.attributes.add("loadAreas", {
      type: "string",
      array: !0
    }), e.attributes.add("showCondition", {
      type: "string",
      default: "manual",
      enum: [{
        auto: "auto"
      }, {
        distance: "distance"
      }, {
        manual: "manual"
      }, {
        area: "area"
      }],
      description: "auto: \u81EA\u52A8\u663E\u793A; distance: \u6839\u636E\u8DDD\u79BB\u663E\u793A; manual: \u624B\u52A8\u663E\u793A;area: \u76F8\u673A\u8FDB\u5165\u67D0\u533A\u57DF\u65F6\u663E\u793A;"
    }), e.attributes.add("showDistance", {
      type: "number",
      default: 3
    }), e.attributes.add("showAreas", {
      type: "string",
      array: !0
    }), e.attributes.add("externalData", {
      type: "string",
      default: ""
    });
  }
  function Q(r) {
    r.extend(r, function () {
      var e = function (a) {
        this._app = a, this._tweens = [], this._add = [];
      };
      e.prototype = {
        add: function (a) {
          return this._add.push(a), a;
        },
        update: function (a) {
          for (var c = 0, m = this._tweens.length; c < m;) this._tweens[c].update(a) ? c++ : (this._tweens.splice(c, 1), m--);
          if (this._add.length) {
            for (var c = 0; c < this._add.length; c++) this._tweens.indexOf(this._add[c]) > -1 || this._tweens.push(this._add[c]);
            this._add.length = 0;
          }
        }
      };
      var s = function (a, c, m) {
          r.events.attach(this), this.manager = c, m && (this.entity = null), this.time = 0, this.complete = !1, this.playing = !1, this.stopped = !0, this.pending = !1, this.target = a, this.duration = 0, this._currentDelay = 0, this.timeScale = 1, this._reverse = !1, this._delay = 0, this._yoyo = !1, this._count = 0, this._numRepeats = 0, this._repeatDelay = 0, this._from = !1, this._slerp = !1, this._fromQuat = new r.Quat(), this._toQuat = new r.Quat(), this._quat = new r.Quat(), this.easing = r.Linear, this._sv = {}, this._ev = {};
        },
        i = function (a) {
          var c;
          return a instanceof r.Vec2 ? c = {
            x: a.x,
            y: a.y
          } : a instanceof r.Vec3 ? c = {
            x: a.x,
            y: a.y,
            z: a.z
          } : a instanceof r.Vec4 ? c = {
            x: a.x,
            y: a.y,
            z: a.z,
            w: a.w
          } : a instanceof r.Quat ? c = {
            x: a.x,
            y: a.y,
            z: a.z,
            w: a.w
          } : a instanceof r.Color ? (c = {
            r: a.r,
            g: a.g,
            b: a.b
          }, a.a !== void 0 && (c.a = a.a)) : c = a, c;
        };
      s.prototype = {
        to: function (a, c, m, _, b, P) {
          return this._properties = i(a), this.duration = c, m && (this.easing = m), _ && this.delay(_), b && this.repeat(b), P && this.yoyo(P), this;
        },
        from: function (a, c, m, _, b, P) {
          return this._properties = i(a), this.duration = c, m && (this.easing = m), _ && this.delay(_), b && this.repeat(b), P && this.yoyo(P), this._from = !0, this;
        },
        rotate: function (a, c, m, _, b, P) {
          return this._properties = i(a), this.duration = c, m && (this.easing = m), _ && this.delay(_), b && this.repeat(b), P && this.yoyo(P), this._slerp = !0, this;
        },
        start: function () {
          var a, c, m, _;
          if (this.playing = !0, this.complete = !1, this.stopped = !1, this._count = 0, this.pending = this._delay > 0, this._reverse && !this.pending ? this.time = this.duration : this.time = 0, this._from) {
            for (a in this._properties) this._properties.hasOwnProperty(a) && (this._sv[a] = this._properties[a], this._ev[a] = this.target[a]);
            this._slerp && (this._toQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z), c = this._properties.x !== void 0 ? this._properties.x : this.target.x, m = this._properties.y !== void 0 ? this._properties.y : this.target.y, _ = this._properties.z !== void 0 ? this._properties.z : this.target.z, this._fromQuat.setFromEulerAngles(c, m, _));
          } else {
            for (a in this._properties) this._properties.hasOwnProperty(a) && (this._sv[a] = this.target[a], this._ev[a] = this._properties[a]);
            this._slerp && (c = this._properties.x !== void 0 ? this._properties.x : this.target.x, m = this._properties.y !== void 0 ? this._properties.y : this.target.y, _ = this._properties.z !== void 0 ? this._properties.z : this.target.z, this._properties.w !== void 0 ? (this._fromQuat.copy(this.target), this._toQuat.set(c, m, _, this._properties.w)) : (this._fromQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z), this._toQuat.setFromEulerAngles(c, m, _)));
          }
          return this._currentDelay = this._delay, this.manager.add(this), this.fire("start"), this;
        },
        pause: function () {
          this.playing = !1, this.fire("pause");
        },
        resume: function () {
          this.playing = !0;
        },
        stop: function () {
          this.playing = !1, this.stopped = !0, this.fire("stop");
        },
        delay: function (a) {
          return this._delay = a, this.pending = !0, this;
        },
        repeat: function (a, c) {
          return this._count = 0, this._numRepeats = a, c ? this._repeatDelay = c : this._repeatDelay = 0, this;
        },
        loop: function (a) {
          return a ? (this._count = 0, this._numRepeats = 1 / 0) : this._numRepeats = 0, this;
        },
        yoyo: function (a) {
          return this._yoyo = a, this;
        },
        reverse: function () {
          return this._reverse = !this._reverse, this;
        },
        chain: function () {
          for (var a = arguments.length; a--;) a > 0 ? arguments[a - 1]._chained = arguments[a] : this._chained = arguments[a];
          return this;
        },
        update: function (a) {
          if (this.stopped) return !1;
          if (!this.playing) return !0;
          if (!this._reverse || this.pending ? this.time += a * this.timeScale : this.time -= a * this.timeScale, this.pending) if (this.time > this._currentDelay) this._reverse ? this.time = this.duration - (this.time - this._currentDelay) : this.time -= this._currentDelay, this.pending = !1;else return !0;
          var c = 0;
          (!this._reverse && this.time > this.duration || this._reverse && this.time < 0) && (this._count++, this.complete = !0, this.playing = !1, this._reverse ? (c = this.duration - this.time, this.time = 0) : (c = this.time - this.duration, this.time = this.duration));
          var m = this.duration === 0 ? 1 : this.time / this.duration,
            _ = this.easing(m),
            b,
            P;
          for (var L in this._properties) this._properties.hasOwnProperty(L) && (b = this._sv[L], P = this._ev[L], this.target[L] = b + (P - b) * _);
          if (this._slerp && this._quat.slerp(this._fromQuat, this._toQuat, _), this.entity && (this.entity._dirtifyLocal(), this.element && this.entity.element && (this.entity.element[this.element] = this.target), this._slerp && this.entity.setLocalRotation(this._quat)), this.fire("update", a), this.complete) {
            var z = this._repeat(c);
            return z ? this.fire("loop") : (this.fire("complete", c), this.entity && this.entity.off("destroy", this.stop, this), this._chained && this._chained.start()), z;
          }
          return !0;
        },
        _repeat: function (a) {
          if (this._count < this._numRepeats) {
            if (this._reverse ? this.time = this.duration - a : this.time = a, this.complete = !1, this.playing = !0, this._currentDelay = this._repeatDelay, this.pending = !0, this._yoyo) {
              for (var c in this._properties) {
                var m = this._sv[c];
                this._sv[c] = this._ev[c], this._ev[c] = m;
              }
              this._slerp && (this._quat.copy(this._fromQuat), this._fromQuat.copy(this._toQuat), this._toQuat.copy(this._quat));
            }
            return !0;
          }
          return !1;
        }
      };
      var n = function (a) {
          return a;
        },
        o = function (a) {
          return a * a;
        },
        h = function (a) {
          return a * (2 - a);
        },
        l = function (a) {
          return (a *= 2) < 1 ? .5 * a * a : -.5 * (--a * (a - 2) - 1);
        },
        u = function (a) {
          return a * a * a;
        },
        d = function (a) {
          return --a * a * a + 1;
        },
        y = function (a) {
          return (a *= 2) < 1 ? .5 * a * a * a : .5 * ((a -= 2) * a * a + 2);
        },
        p = function (a) {
          return a * a * a * a;
        },
        f = function (a) {
          return 1 - --a * a * a * a;
        },
        A = function (a) {
          return (a *= 2) < 1 ? .5 * a * a * a * a : -.5 * ((a -= 2) * a * a * a - 2);
        },
        M = function (a) {
          return a * a * a * a * a;
        },
        D = function (a) {
          return --a * a * a * a * a + 1;
        },
        R = function (a) {
          return (a *= 2) < 1 ? .5 * a * a * a * a * a : .5 * ((a -= 2) * a * a * a * a + 2);
        },
        x = function (a) {
          return a === 0 ? 0 : a === 1 ? 1 : 1 - Math.cos(a * Math.PI / 2);
        },
        F = function (a) {
          return a === 0 ? 0 : a === 1 ? 1 : Math.sin(a * Math.PI / 2);
        },
        C = function (a) {
          return a === 0 ? 0 : a === 1 ? 1 : .5 * (1 - Math.cos(Math.PI * a));
        },
        dt = function (a) {
          return a === 0 ? 0 : Math.pow(1024, a - 1);
        },
        pt = function (a) {
          return a === 1 ? 1 : 1 - Math.pow(2, -10 * a);
        },
        ft = function (a) {
          return a === 0 ? 0 : a === 1 ? 1 : (a *= 2) < 1 ? .5 * Math.pow(1024, a - 1) : .5 * (-Math.pow(2, -10 * (a - 1)) + 2);
        },
        mt = function (a) {
          return 1 - Math.sqrt(1 - a * a);
        },
        yt = function (a) {
          return Math.sqrt(1 - --a * a);
        },
        _t = function (a) {
          return (a *= 2) < 1 ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1);
        },
        gt = function (a) {
          var c,
            m = .1,
            _ = .4;
          return a === 0 ? 0 : a === 1 ? 1 : (!m || m < 1 ? (m = 1, c = _ / 4) : c = _ * Math.asin(1 / m) / (2 * Math.PI), -(m * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - c) * (2 * Math.PI) / _)));
        },
        vt = function (a) {
          var c,
            m = .1,
            _ = .4;
          return a === 0 ? 0 : a === 1 ? 1 : (!m || m < 1 ? (m = 1, c = _ / 4) : c = _ * Math.asin(1 / m) / (2 * Math.PI), m * Math.pow(2, -10 * a) * Math.sin((a - c) * (2 * Math.PI) / _) + 1);
        },
        wt = function (a) {
          var c,
            m = .1,
            _ = .4;
          return a === 0 ? 0 : a === 1 ? 1 : (!m || m < 1 ? (m = 1, c = _ / 4) : c = _ * Math.asin(1 / m) / (2 * Math.PI), (a *= 2) < 1 ? -.5 * (m * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - c) * (2 * Math.PI) / _)) : m * Math.pow(2, -10 * (a -= 1)) * Math.sin((a - c) * (2 * Math.PI) / _) * .5 + 1);
        },
        At = function (a) {
          var c = 1.70158;
          return a * a * ((c + 1) * a - c);
        },
        Et = function (a) {
          var c = 1.70158;
          return --a * a * ((c + 1) * a + c) + 1;
        },
        Tt = function (a) {
          var c = 2.5949095;
          return (a *= 2) < 1 ? .5 * (a * a * ((c + 1) * a - c)) : .5 * ((a -= 2) * a * ((c + 1) * a + c) + 2);
        },
        V = function (a) {
          return a < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375;
        },
        N = function (a) {
          return 1 - V(1 - a);
        },
        Rt = function (a) {
          return a < .5 ? N(a * 2) * .5 : V(a * 2 - 1) * .5 + .5;
        };
      return {
        TweenManager: e,
        Tween: s,
        Linear: n,
        QuadraticIn: o,
        QuadraticOut: h,
        QuadraticInOut: l,
        CubicIn: u,
        CubicOut: d,
        CubicInOut: y,
        QuarticIn: p,
        QuarticOut: f,
        QuarticInOut: A,
        QuinticIn: M,
        QuinticOut: D,
        QuinticInOut: R,
        SineIn: x,
        SineOut: F,
        SineInOut: C,
        ExponentialIn: dt,
        ExponentialOut: pt,
        ExponentialInOut: ft,
        CircularIn: mt,
        CircularOut: yt,
        CircularInOut: _t,
        BackIn: At,
        BackOut: Et,
        BackInOut: Tt,
        BounceIn: N,
        BounceOut: V,
        BounceInOut: Rt,
        ElasticIn: gt,
        ElasticOut: vt,
        ElasticInOut: wt
      };
    }()), function () {
      var e = r.version.split(".");
      if (Number.parseInt(e[0]) < 1 || Number.parseInt(e[0]) === 1 && Number.parseInt(e[1]) < 60) {
        r.Application.prototype.addTweenManager = function () {
          this._tweenManager = new r.TweenManager(this), this.on("update", function (n) {
            this._tweenManager.update(n);
          });
        }, r.Application.prototype.tween = function (n) {
          return new r.Tween(n, this._tweenManager);
        }, r.Entity.prototype.tween = function (n, o) {
          var h = this._app.tween(n);
          return h.entity = this, this.once("destroy", h.stop, h), o && o.element && (h.element = o.element), h;
        };
        var s = r.Application.getApplication();
        s && s.addTweenManager();
      } else {
        r.AppBase.prototype.addTweenManager = function () {
          this._tweenManager = new r.TweenManager(this), this.on("update", function (n) {
            this._tweenManager.update(n);
          });
        }, r.AppBase.prototype.tween = function (n) {
          return new r.Tween(n, this._tweenManager);
        }, r.Entity.prototype.tween = function (n, o) {
          var h = this._app.tween(n);
          return h.entity = this, this.once("destroy", h.stop, h), o && o.element && (h.element = o.element), h;
        };
        var i = r.AppBase.getApplication();
        i && i.addTweenManager();
      }
    }();
    var t = r.createScript("tween");
    t.attributes.add("tweens", {
      type: "json",
      schema: [{
        name: "autoPlay",
        title: "Autoplay",
        description: "Play tween immediately.",
        type: "boolean",
        default: !1
      }, {
        name: "event",
        title: "Trigger Event",
        description: "Play tween on the specified event name. This event must be fired on the global application object (e.g. this.app.fire('eventname');).",
        type: "string"
      }, {
        name: "path",
        title: "Path",
        description: "The path from the entity to the property. e.g. 'light.color', 'camera.fov' or 'script.vehicle.speed'.",
        type: "string"
      }, {
        name: "start",
        title: "Start",
        type: "vec4"
      }, {
        name: "end",
        title: "End",
        type: "vec4"
      }, {
        name: "easingFunction",
        title: "Easing Function",
        description: "The easing functions: Linear, Quadratic, Cubic, Quartic, Quintic, Sinusoidal, Exponential, Circular, Elastic, Back and Bounce.",
        type: "number",
        enum: [{
          Linear: 0
        }, {
          Quadratic: 1
        }, {
          Cubic: 2
        }, {
          Quartic: 3
        }, {
          Quintic: 4
        }, {
          Sine: 5
        }, {
          Exponential: 6
        }, {
          Circular: 7
        }, {
          Elastic: 8
        }, {
          Back: 9
        }, {
          Bounce: 10
        }],
        default: 0
      }, {
        name: "easingType",
        title: "Easing Type",
        description: "Whether to ease in, easy out or ease in and then out using the specified easing function. Note that for a Linear easing function, the easing type is ignored.",
        type: "number",
        enum: [{
          In: 0
        }, {
          Out: 1
        }, {
          InOut: 2
        }],
        default: 0
      }, {
        name: "delay",
        title: "Delay",
        description: "Time to wait in milliseconds after receiving the trigger event before executing the tween. Defaults to 0.",
        type: "number",
        default: 0
      }, {
        name: "duration",
        title: "Duration",
        description: "Time to execute the tween in milliseconds. Defaults to 1000.",
        type: "number",
        default: 1e3
      }, {
        name: "repeat",
        title: "Repeat",
        description: "The number of times the tween should be repeated after the initial playback. -1 will repeat forever. Defaults to 0.",
        type: "number",
        default: 0
      }, {
        name: "repeatDelay",
        title: "Repeat Delay",
        description: "Time to wait in milliseconds before executing each repeat of the tween. Defaults to 0.",
        type: "number",
        default: 0
      }, {
        name: "yoyo",
        title: "Yoyo",
        description: "This function only has effect if used along with repeat. When active, the behaviour of the tween will be like a yoyo, i.e. it will bounce to and from the start and end values, instead of just repeating the same sequence from the beginning. Defaults to false.",
        type: "boolean",
        default: !1
      }, {
        name: "startEvent",
        title: "Start Event",
        description: "Executed right before the tween starts animating, after any delay time specified by the delay method. This will be executed only once per tween, i.e. it will not be run when the tween is repeated via repeat(). It is great for synchronising to other events or triggering actions you want to happen when a tween starts.",
        type: "string"
      }, {
        name: "stopEvent",
        title: "Stop Event",
        description: "Executed when a tween is explicitly stopped via stop(), but not when it is completed normally.",
        type: "string"
      }, {
        name: "updateEvent",
        title: "Update Event",
        description: "Executed each time the tween is updated, after the values have been actually updated.",
        type: "string"
      }, {
        name: "completeEvent",
        title: "Complete Event",
        description: "Executed when a tween is finished normally (i.e. not stopped).",
        type: "string"
      }, {
        name: "repeatEvent",
        title: "Repeat Event",
        description: "Executed whenever a tween has just finished one repetition and will begin another.",
        type: "string"
      }],
      array: !0
    }), t.prototype.initialize = function () {
      var e = this.app,
        s;
      this.tweenInstances = [], this.tweenCallbacks = [];
      var i = function (o) {
        return function () {
          this.start(o);
        };
      };
      for (s = 0; s < this.tweens.length; s++) {
        var n = this.tweens[s];
        n.autoPlay && this.start(s), n.event && n.event.length > 0 && (this.tweenCallbacks[s] = {
          event: n.event,
          cb: i(s)
        }, e.on(this.tweenCallbacks[s].event, this.tweenCallbacks[s].cb, this));
      }
      this.on("enable", function () {
        for (s = 0; s < this.tweens.length; s++) this.tweenInstances[s] && !this.tweenInstances[s].playing && (this.tweenInstances[s].playing || this.tweenInstances[s].resume());
      }), this.on("disable", function () {
        for (s = 0; s < this.tweens.length; s++) this.tweenInstances[s] && this.tweenInstances[s].playing && this.tweenInstances[s].pause();
      }), this.on("attr", function (o, h, l) {
        for (s = 0; s < this.tweenCallbacks.length; s++) this.tweenCallbacks[s] && (e.off(this.tweenCallbacks[s].event, this.tweenCallbacks[s].cb, this), this.tweenCallbacks[s] = null);
        for (s = 0; s < this.tweens.length; s++) {
          var u = this.tweens[s];
          u.event.length > 0 && (this.tweenCallbacks[s] = {
            event: u.event,
            cb: i(s)
          }, e.on(this.tweenCallbacks[s].event, this.tweenCallbacks[s].cb, this));
        }
      });
    }, t.prototype.start = function (e) {
      var s = this.app,
        i = this.tweens[e],
        n = ["In", "Out", "InOut"],
        o = ["Linear", "Quadratic", "Cubic", "Quartic", "Quintic", "Sine", "Exponential", "Circular", "Elastic", "Back", "Bounce"],
        h;
      if (o[i.easingFunction] == "Linear" ? h = r[o[i.easingFunction]] : h = r[o[i.easingFunction] + n[i.easingType]], !h) {
        console.error("ERROR: tween - invalid easing function specified");
        return;
      }
      var l = this.tweenInstances;
      l[e] && l[e].stop();
      for (var u = i.path.split("."), d = this.entity, y = 0; y < u.length - 1; y++) d = d[u[y]];
      var p = u[u.length - 1],
        f = d[p],
        A,
        M,
        D = typeof f == "number",
        R = i.start,
        x = i.end;
      if (D) A = {
        x: R.x
      }, M = {
        x: x.x
      };else if (f instanceof r.Vec2) A = new r.Vec2(R.x, R.y), M = new r.Vec2(x.x, x.y);else if (f instanceof r.Vec3) A = new r.Vec3(R.x, R.y, R.z), M = new r.Vec3(x.x, x.y, x.z);else if (f instanceof r.Vec4) A = R.clone(), M = x.clone();else if (f instanceof r.Color) A = new r.Color(R.x, R.y, R.z, R.w), M = new r.Color(x.x, x.y, x.z, x.w);else {
        console.error("ERROR: tween - specified property must be a number, vec2, vec3, vec4 or color");
        return;
      }
      var F = function (C) {
        switch (p) {
          case "eulerAngles":
            d.setEulerAngles(C);
            break;
          case "localEulerAngles":
            d.setLocalEulerAngles(C);
            break;
          case "localPosition":
            d.setLocalPosition(C);
            break;
          case "localScale":
            d.setLocalScale(C);
            break;
          case "position":
            d.setPosition(C);
            break;
          default:
            d[p] = D ? C.x : C, d instanceof r.Material && d.update();
            break;
        }
      };
      F(A), l[e] = this.app.tween(A), l[e].on("start", () => {
        i.startEvent !== "" && s.fire(i.startEvent);
      }), l[e].on("stop", () => {
        i.stopEvent !== "" && s.fire(i.stopEvent), l[e] = null;
      }), l[e].on("update", () => {
        F(A), i.updateEvent !== "" && s.fire(i.updateEvent);
      }), l[e].on("complete", () => {
        i.completeEvent !== "" && s.fire(i.completeEvent), l[e] = null;
      }), l[e].on("loop", () => {
        i.repeatEvent !== "" && s.fire(i.repeatEvent);
      }), l[e].to(M, i.duration, h).repeat(i.repeat === -1 ? 1 / 0 : i.repeat, i.repeatDelay).yoyo(i.yoyo).delay(i.delay).start();
    };
  }
  function Y(r) {
    var t = r.createScript("sdsFlyCamera");
    t.attributes.add("speed", {
      type: "number",
      default: 10
    }), t.attributes.add("fastSpeed", {
      type: "number",
      default: 20
    }), t.attributes.add("mode", {
      type: "number",
      default: 0,
      enum: [{
        Lock: 0
      }, {
        Drag: 1
      }]
    }), t.prototype.initialize = function () {
      var e = this.entity.getLocalEulerAngles();
      this.ex = e.x, this.ey = e.y, this.moved = !1, this.lmbDown = !1, this.app.mouse.disableContextMenu(), this.app.mouse.on(r.EVENT_MOUSEMOVE, this.onMouseMove, this), this.app.mouse.on(r.EVENT_MOUSEDOWN, this.onMouseDown, this), this.app.mouse.on(r.EVENT_MOUSEUP, this.onMouseUp, this);
    }, t.prototype.update = function (e) {
      this.entity.setLocalEulerAngles(this.ex, this.ey, 0);
      var s = this.app,
        i = this.speed;
      s.keyboard.isPressed(r.KEY_SHIFT) && (i = this.fastSpeed), s.keyboard.isPressed(r.KEY_UP) || s.keyboard.isPressed(r.KEY_W) ? this.entity.translateLocal(0, 0, -i * e) : (s.keyboard.isPressed(r.KEY_DOWN) || s.keyboard.isPressed(r.KEY_S)) && this.entity.translateLocal(0, 0, i * e), s.keyboard.isPressed(r.KEY_LEFT) || s.keyboard.isPressed(r.KEY_A) ? this.entity.translateLocal(-i * e, 0, 0) : (s.keyboard.isPressed(r.KEY_RIGHT) || s.keyboard.isPressed(r.KEY_D)) && this.entity.translateLocal(i * e, 0, 0), s.keyboard.isPressed(r.KEY_E) ? this.entity.translateLocal(0, i * e, 0) : s.keyboard.isPressed(r.KEY_Q) && this.entity.translateLocal(0, -i * e, 0);
    }, t.prototype.onMouseMove = function (e) {
      if (this.mode) {
        if (!this.lmbDown) return;
      } else if (!r.Mouse.isPointerLocked()) return;
      if (!this.moved) {
        this.moved = !0;
        return;
      }
      this.ex -= e.dy / 5, this.ex = r.math.clamp(this.ex, -90, 90), this.ey -= e.dx / 5;
    }, t.prototype.onMouseDown = function (e) {
      e.button === 0 && (this.lmbDown = !0, !this.mode && !r.Mouse.isPointerLocked() && this.app.mouse.enablePointerLock());
    }, t.prototype.onMouseUp = function (e) {
      e.button === 0 && (this.lmbDown = !1);
    };
  }
  function W(r) {
    function t(o, h) {
      var l = {
        attributes: {
          aPosition: o.SEMANTIC_POSITION,
          aUv0: o.SEMANTIC_TEXCOORD0
        },
        vshader: ["attribute vec3 aPosition;", "attribute vec2 aUv0;", "", "uniform mat4 matrix_model;", "uniform mat4 matrix_viewProjection;", "", "varying vec2 vUv0;", "", "void main(void)", "{", "  vUv0 = aUv0;", "  gl_Position = matrix_viewProjection * matrix_model * vec4(aPosition, 1.0);", "}"].join(""),
        fshader: ["precision " + h.precision + " float;", "varying vec2 vUv0;", "", "uniform sampler2D uCombinedFrame;", "uniform float flip_y;", "", "void main(void)", "{", "vec2 uv = vUv0;", "if(flip_y >= 1.0) {", "   uv = vec2(vUv0.x, 1.0 - vUv0.y);", "}", "  float alpha = texture2D(uCombinedFrame, vec2(0.5 + uv.x / 2.0, uv.y)).r;", "  vec3 color = texture2D(uCombinedFrame, vec2(uv.x / 2.0, uv.y)).rgb;", "  gl_FragColor = vec4(color, alpha);", "}"].join("")
      };
      return new o.Shader(h, l);
    }
    function e(o, h) {
      var l = {
        attributes: {
          aPosition: o.SEMANTIC_POSITION,
          aUv0: o.SEMANTIC_TEXCOORD0
        },
        vshader: ["attribute vec3 aPosition;", "attribute vec2 aUv0;", "", "uniform mat4 matrix_model;", "uniform mat4 matrix_viewProjection;", "", "varying vec2 vUv0;", "", "void main(void)", "{", "  vUv0 = aUv0;", "  gl_Position = matrix_viewProjection * matrix_model * vec4(aPosition, 1.0);", "}"].join(""),
        fshader: ["precision " + h.precision + " float;", "varying vec2 vUv0;", "", "uniform sampler2D uCombinedFrame;", "uniform float flip_y;", "", "void main(void)", "{", "vec2 uv = vUv0;", "if(flip_y >= 1.0) {", "   uv = vec2(vUv0.x, 1.0 - vUv0.y);", "}", "  vec4 color = texture2D(uCombinedFrame, uv);", "  gl_FragColor = color;", "}"].join("")
      };
      return new o.Shader(h, l);
    }
    var s = function (o, h) {
      this.videoElement = document.createElement("video"), this.videoElement.addEventListener("canplay", function (l) {
        o.setSource(this.videoElement);
      }.bind(this)), this.videoElement.src = h, this.videoElement.crossOrigin = "anonymous", this.videoElement.loop = !0, this.videoElement.muted = !0;
    };
    s.prototype.constructor = s, s.prototype.play = function () {
      !this.videoElement || (this.videoElement.play(), this.videoElement.muted = !1);
    }, s.prototype.stop = function () {
      !this.videoElement || this.videoElement.pause();
    }, s.prototype.pause = function () {
      !this.videoElement || this.videoElement.pause();
    }, s.prototype.destroy = function () {
      !this.videoElement || (this.videoElement.pause(), this.videoElement.src = "", this.videoElement = null);
    };
    var i = r.createScript("sdsVideoPlayer");
    i.attributes.add("entitys", {
      type: "entity",
      array: !0,
      title: "Entitys",
      description: "\u7528\u4E8E\u627F\u8F7D\u89C6\u9891\u64AD\u653E\u76843D\u7269\u4F53\u3002"
    }), i.attributes.add("videoAssetURL", {
      type: "string",
      title: "Video Asset URL",
      description: "\u89C6\u9891\u8D44\u6E90\u5916\u90E8\u94FE\u63A5\u5730\u5740\u3002"
    }), i.attributes.add("isTransparentVideo", {
      type: "boolean",
      default: !0,
      title: "is transparent video",
      description: "\u662F\u5426\u4E3A\u900F\u660E\u89C6\u9891\uFF0C\u9ED8\u8BA4\u4E3A\u900F\u660E\u89C6\u9891\uFF0C\u8BE5\u9879\u4F1A\u5F71\u54CD\u6240\u6709\u89C6\u9891\u8D44\u6E90"
    }), i.attributes.add("id", {
      type: "string",
      default: "1",
      title: "video id",
      description: "\u8BBE\u7F6Evideo id, \u7528\u4E8E\u533A\u5206\u591A\u89C6\u9891"
    }), i.prototype.initialize = function () {
      var o = this.app;
      this.videoTexture = new r.Texture(o.graphicsDevice, {
        format: r.PIXELFORMAT_R8_G8_B8_A8,
        mipmaps: !1
      }), this.videoTexture.minFilter = r.FILTER_LINEAR, this.videoTexture.magFilter = r.FILTER_LINEAR, this.videoTexture.addressU = r.ADDRESS_CLAMP_TO_EDGE, this.videoTexture.addressV = r.ADDRESS_CLAMP_TO_EDGE, this.material = new r.Material(), this.isTransparentVideo ? this.material.shader = t(r, this.app.graphicsDevice) : this.material.shader = e(r, this.app.graphicsDevice), this.material.cull = r.CULLFACE_NONE, this.material.blendType = r.BLEND_NORMAL, this.material.setParameter("flip_y", 0), this.material.setParameter("uCombinedFrame", this.videoTexture), this.material.update();
      for (var h = 0; h < this.entitys.length; h++) this.entitys[h].model.meshInstances[0].material = this.material, this.entitys[h].enabled = !1;
      this.upload = !0, this.linkVideo(), this._videoFrame = null, this.on("enable", this.playVideo, this), this.on("disable", this.pauseVideo, this), this.on("destroy", this.destroyVideo, this);
    }, i.prototype.linkVideo = function () {
      if (!r.platform.browser) this.app.fire("videoplayer", this.videoAssetURL, this.id), this.app.on("setVideoTexture", this.setTexture.bind(this));else {
        var o = this._video = new s(this.videoTexture, this.videoAssetURL),
          h = this.material;
        this.app.on("start-demo", function (l) {
          if (l == this.id) {
            for (var u = 0; u < this.entitys.length; u++) this.entitys[u].enabled = !0;
            h.setParameter("u_textureSize", [o.videoElement.videoWidth, o.videoElement.videoHeight]), o.play();
          }
        }.bind(this));
      }
    }, i.prototype.playVideo = function () {
      r.platform.browser ? this._video.play() : this.app.fire("playvideo", this.id);
    }, i.prototype.stopVideo = function () {
      r.platform.browser ? this._video.stop() : this.app.fire("stopvideo", this.id);
    }, i.prototype.pauseVideo = function () {
      r.platform.browser ? this._video.pause() : this.app.fire("pasuevideo", this.id);
    }, i.prototype.destroyVideo = function () {
      r.platform.browser ? (this._video.destroy(), this._video = null) : this.app.fire("destroyvideo", this.id), this.off("enable", this.playVideo, this), this.off("disable", this.pauseVideo, this), this.off("destroy", this.destroyVideo, this);
    }, i.prototype.setTexture = function (o, h) {
      if (h == this.id) {
        this.material.setParameter("uCombinedFrame", o), this.material.update();
        for (var l = 0; l < this.entitys.length; l++) this.entitys[l].enabled = !0;
      }
    }, i.prototype.update = function (o) {
      this.upload = !this.upload, this.upload && r.platform.browser && this.videoTexture.upload();
    };
    var n = r.createScript("sdsPlayButton_test");
    n.prototype.initialize = function () {
      this.entity.element.on("click", function (o) {
        this.app.fire("start-demo"), this.entity.destroy();
      }, this), r.platform.browser || this.entity.destroy();
    };
  }
  function H(r) {
    class t extends r.ScriptType {
      constructor() {
        super(...arguments), this._slotMap = new Map(), this._playingCache = [];
      }
      initialize() {
        this.entity.audioPlayer = this, this.slots.forEach(i => {
          this.addSlot(i);
        }), this.on("destroy", () => {
          this._slotMap.forEach(i => {
            i.destroy();
          }), this.entity.off();
        }), this.on("disable", () => {
          this._slotMap.forEach(i => {
            i.playing && (i.pause(), this._playingCache.push(i.name));
          });
        }), this.on("enable", () => {
          this._playingCache.forEach(i => {
            this.getSlot(i).play();
          }), this._playingCache = [];
        });
      }
      getSlot(i) {
        return this._slotMap.get(i);
      }
      addSlot(i) {
        this._slotMap.set(i.name, new e(i));
      }
      play(i) {
        let n = this.getSlot(i);
        n && n.play();
      }
      pause(i) {
        let n = this.getSlot(i);
        n && n.pause();
      }
      stop(i) {
        let n = this.getSlot(i);
        n && n.stop();
      }
      seek(i, n) {
        let o = this.getSlot(i);
        o && o.seek(n);
      }
      setVolume(i, n) {
        let o = this.getSlot(i);
        o && (o.volume = n);
      }
    }
    class e {
      constructor(i) {
        r.platform.browser ? (this.context = new Audio(i.url), this.context.preload = "metadata") : typeof $my < "u" ? (this.context = $my.createInnerAudioContext(), this.context.src = i.url) : typeof my < "u" && (this.context = my.createInnerAudioContext(), this.context.src = i.url), this.context.autoplay = i.autoplay, i.autoplay && (this._playing = !0), this.context.loop = i.loop, this.context.volume = i.volume, this.name = i.name;
      }
      get volume() {
        return this.context.volume;
      }
      set volume(i) {
        this.context.volume = i;
      }
      get duration() {
        return this.context.duration;
      }
      get currentTime() {
        return this.context.currentTime;
      }
      seek(i) {
        r.platform.browser ? this.context.currentTime = i : this.context.seek(i);
      }
      get isLoop() {
        return this.context.loop;
      }
      set isLoop(i) {
        this.context.loop != i && (this.context.loop = i);
      }
      get playing() {
        return this._playing;
      }
      setUrl(i) {
        this._playing && (this._onPlayend && (r.platform.browser ? this.context.onended = null : this.context.offEnded(this._onPlayend), this._onPlayend = null), this.stop()), r.platform.browser ? this.context.src = i : this.context.src = i;
      }
      play() {
        this._playing || (this.context.play(), this._playing = !0, this.isLoop || (r.platform.browser ? this.context.onended = this._onPlayend = () => {
          this.stop();
        } : this.context.onEnded(this._onPlayend = () => {
          this.stop();
        })));
      }
      pause() {
        this._playing && (this.context.pause(), this._playing = !1);
      }
      stop() {
        r.platform.browser ? (this.context.currentTime = 0, this.context.pause(), this._playing = !1) : (this.context.stop(), this._playing = !1);
      }
      destroy() {
        this.stop(), r.platform.browser ? this.context : this.context.destroy(), this.context = null;
      }
    }
    r.registerScript(t, "sdsAudioPlayer"), t.attributes.add("slots", {
      type: "json",
      schema: [{
        name: "name",
        type: "string"
      }, {
        name: "url",
        type: "string"
      }, {
        name: "autoplay",
        type: "boolean",
        default: !1
      }, {
        name: "loop",
        type: "boolean",
        default: !1
      }, {
        name: "volume",
        type: "number",
        default: 1,
        min: 0,
        max: 1
      }],
      array: !0
    });
  }
  function q(r, t) {
    class e extends r.ScriptType {
      constructor() {
        super(...arguments), this.walkSpeed = 2, this.runSpeed = 4, this._moveTarget = null, this._isMoving = !1, this._controller = null, this._morphInstance = null, this._blendshape = [], this._sayData = [], this._audioPlaying = !1, this._assistantSlot = null;
      }
      get _isSelfControll() {
        return this._controller === this;
      }
      initialize() {
        this.anim = this.entity.anim, this.anim || console.error("sdsAssistant: entity has no AnimComponent"), this.audioPlayer = this.entity.audioPlayer, this.audioPlayer || console.error("sdsAssistant: entity has no audioPlayer"), this.audioPlayer.addSlot({
          name: "assistant",
          url: "",
          autoplay: !1,
          loop: !1,
          volume: 1
        }), this._morphInstance = this.entity.model._model.morphInstances[0], this._morphInstance || console.error("sdsAssistant: entity has no morphInstances"), this.tinyRoot = I.call(this), this.parentEntity = this.tinyRoot.rootEntity, this.cameraEntity = this.tinyRoot.camera;
        let i = this.cameraEntity.getPosition(),
          n = this._getCameraFrontPorition(1.5);
        this.parentEntity.setPosition(n), this.parentEntity.lookAt(new r.Vec3(i.x, n.y, i.z), r.Vec3.UP), this.on("destroy", () => {
          this.entity.off();
        });
      }
      update(i) {
        if (this._isMoving) {
          let n = this._moveTarget.clone().sub(this.parentEntity.getPosition()).normalize(),
            o = this._moveTarget.clone().sub(this.parentEntity.getPosition()).length();
          o > 2 ? (this.parentEntity.translate(n.mulScalar(i * this.runSpeed)), this.parentEntity.lookAt(this._moveTarget, r.Vec3.UP), this.anim.baseLayer.activeState != "run" && this.playAnim("run")) : o > .1 ? (this.parentEntity.translate(n.mulScalar(i * this.walkSpeed)), this.parentEntity.lookAt(this._moveTarget, r.Vec3.UP), this.anim.baseLayer.activeState != "walk" && this.playAnim("walk")) : (this._isMoving = !1, this._controller && this._controller.fire("assistant_move_end"));
        }
        if (this._isSelfControll, this._blendshape && this._audioPlaying) {
          const o = this._assistantSlot.currentTime / this._assistantSlot.duration;
          console.log("\u97F3\u9891\u64AD\u653E\u8FDB\u5EA6:", o), o > .99 && (this._blendshape = null, this._audioPlaying = !1, this._assistantSlot.stop(), this._assistantSlot = null);
          const h = parseInt("" + o * this._blendshape.length),
            l = this._blendshape[h];
          if (l.length === 116) {
            let u = this.blendShapeOfFacegoodToARKit(l);
            this.setARKitBSTest(this._morphInstance, u, 3);
          } else l.length === 52 && this.setARKitBSTest(this._morphInstance, l, 3);
        } else if (this._sayData.length > 0 && !this._audioPlaying) {
          let n = this._sayData.shift();
          this.playAudio(n.videoUrl), this._blendshape = n.blendShape, this._audioPlaying = this._assistantSlot.playing;
        } else this._assistantSlot && (this._audioPlaying = this._assistantSlot.playing);
      }
      blendShapeOfFacegoodToARKit(i) {
        const n = new Array(52);
        return n[14] = i[34], n[15] = i[32], n[16] = i[33], n[17] = i[73], n[18] = i[35], n[19] = Math.max(i[41], i[42], i[43], i[44]), n[20] = Math.max(i[67], i[68]), n[21] = i[70], n[22] = i[72], n[23] = i[52], n[24] = i[53], n[25] = Math.max(i[45], i[47]), n[26] = Math.max(i[46], i[48]), n[27] = i[39], n[28] = i[40], n[29] = i[56], n[30] = i[57], n[31] = Math.max(i[74], i[75]), n[32] = Math.max(i[76], i[77]), n[33] = i[36], n[34] = i[37], n[35] = i[65], n[36] = i[66], n[37] = i[58], n[38] = i[59], n[39] = i[78], n[40] = i[79], n[41] = i[0], n[42] = i[27], n[43] = i[38], n[44] = i[49], n[45] = i[60], n[46] = i[82], n[47] = i[18], n[48] = i[18], n[49] = i[6], n[50] = i[7], n;
      }
      setARKitBS(i, n, o = 1) {
        !i || n.forEach((h, l) => {
          i.setWeight(l, h * o);
        });
      }
      setARKitBSTest(i, n, o = 1) {
        !i || i.setWeight(0, n[17] * o);
      }
      playAnim(i) {
        this.anim.baseLayer.activeState != i && (console.log("anim set trigger", i), this.anim.setTrigger(i));
      }
      playAudio(i) {
        this._assistantSlot = this.audioPlayer.getSlot("assistant"), this._assistantSlot.setUrl(i), this.audioPlayer.play("assistant");
      }
      parseZhiYunData(i) {
        var n = i.trim().split(`
`);
        let o = {};
        for (var h = 0; h < n.length; h++) {
          var l = n[h].trim().split(" "),
            u = l[0],
            d = l.slice(1).map(parseFloat);
          o[u] = d;
        }
        let y = [];
        for (let p = 0; p < o.ARkit_jawOpen.length; p++) {
          const f = new Array(52);
          f[14] = o.ARkit_jawForward[p], f[15] = o.ARkit_jawLeft[p], f[16] = o.ARkit_jawRight[p], f[17] = o.ARkit_jawOpen[p], f[18] = o.ARkit_mouthClose[p], f[19] = o.ARkit_mouthFunnel[p], f[20] = o.ARkit_mouthPucker[p], f[21] = o.ARkit_mouthLeft[p], f[22] = o.ARkit_mouthRight[p], f[23] = o.ARkit_mouthSmileLeft[p], f[24] = o.ARkit_mouthSmileRight[p], f[25] = o.ARkit_mouthFrownLeft[p], f[26] = o.ARkit_mouthFrownRight[p], f[27] = o.ARkit_mouthDimpleLeft[p], f[28] = o.ARkit_mouthDimpleRight[p], f[29] = o.ARkit_mouthStretchLeft[p], f[30] = o.ARkit_mouthStretchRight[p], f[31] = o.ARkit_mouthRollLower[p], f[32] = o.ARkit_mouthRollUpper[p], f[33] = o.ARkit_mouthShrugLower[p], f[34] = o.ARkit_mouthShrugUpper[p], f[35] = o.ARkit_mouthPressLeft[p], f[36] = o.ARkit_mouthPressRight[p], f[37] = o.ARkit_mouthLowerDownLeft[p], f[38] = o.ARkit_mouthLowerDownRight[p], f[39] = o.ARkit_mouthUpperUpLeft[p], f[40] = o.ARkit_mouthUpperUpRight[p], f[41] = o.ARkit_browDownLeft[p], f[42] = o.ARkit_browDownRight[p], f[43] = o.ARkit_browInnerUp[p], f[44] = o.ARkit_browOuterUpLeft[p], f[45] = o.ARkit_browOuterUpRight[p], f[46] = o.ARkit_cheekPuff[p], f[47] = o.ARkit_cheekSquintLeft[p], f[48] = o.ARkit_cheekSquintRight[p], f[49] = o.ARkit_noseSneerLeft[p], f[50] = o.ARkit_noseSneerRight[p], y.push(f);
        }
        return y;
      }
      async say(i) {
        for (let n = 0; n < i.length; n++) await new Promise((o, h) => {
          if (i[n].audioUrl && i[n].blendShape) {
            let l = {
              videoUrl: i[n].audioUrl,
              blendShape: i[n].blendShape
            };
            this._sayData.push(l), o(l);
          } else i[n].tts && i[n].bs && setTimeout(() => {
            let l = this.parseZhiYunData(i[n].bs),
              u = {
                videoUrl: i[n].tts,
                blendShape: l
              };
            this._sayData.push(u), o(u);
          }, 1e3);
        });
      }
      moveToPosition(i) {
        this._moveTarget = i, this._isMoving = !0;
      }
      setPositionAndLookAt(i, n) {
        this.parentEntity.setPosition(i), this.parentEntity.lookAt(n, r.Vec3.UP);
      }
      setController(i) {
        this._controller && (this._controller.off("assistant_move"), this._controller.off("assistant_playAnim"), this._controller.off("assistant_say"), this._controller.off("assistant_playAudio"), this._controller.off("assistant_moveToPosition")), this._controller = i, this._controller && (this._controller.on("assistant_moveToPosition", n => {
          this.moveToPosition(n);
        }), this._controller.on("assistant_move", (n, o) => {
          this.setPositionAndLookAt(n, o);
        }), this._controller.on("assistant_playAnim", n => {
          this.playAnim(n);
        }), this._controller.on("assistant_say", n => {
          this.say(n);
        }), this._controller.on("assistant_playAudio", n => {
          this.playAudio(n);
        }));
      }
      _getCameraFrontPorition(i) {
        let n = this.cameraEntity.forward.clone();
        return n.y = 0, n.normalize(), this.cameraEntity.getPosition().clone().sub(new r.Vec3(0, 1.5, 0)).add(n.mulScalar(i));
      }
    }
    r.registerScript(e, "sdsAssistant", t), e.attributes.add("walkSpeed", {
      type: "number",
      default: 2
    }), e.attributes.add("runSpeed", {
      type: "number",
      default: 4
    });
  }
  function K(r, t) {
    const e = new r.StandardMaterial();
    e.diffuse = new r.Color(0, 0, 0, 0), e.opacity = 0, e.blendType = 2, e.update();
    let s = null;
    t && (s = t.scene.layers.getLayerByName("Mask"), s || (s = new r.Layer({
      name: "Mask",
      opaqueSortMode: r.SORTMODE_MATERIALMESH,
      transparentSortMode: r.SORTMODE_BACK2FRONT,
      enabled: !0
    }), t.scene.layers.insertTransparent(s, 0)));
    class i extends r.ScriptType {
      initialize() {
        if (this.entity.model && (this.entity.model.layers = [s.id], this.entity.model.meshInstances.forEach(o => {
          o.material = e;
        })), this.entity.render && (this.entity.render.layers = [s.id], this.entity.render.material = e), !g.Instance.camera.camera.layers.includes(s.id)) {
          let o = g.Instance.camera.camera.layers.slice();
          o.push(s.id), g.Instance.camera.camera.layers = o;
        }
      }
    }
    r.registerScript(i, "sdsMask");
  }
  class j {
    constructor(t, e, s, i) {
      this.entity = t, this.item = e, this.onclick = s, this.onmove = i, t.model && t.model.meshInstances ? this.meshInstances = t.model.meshInstances : t.render && t.render.meshInstances ? this.meshInstances = t.render.meshInstances : this.meshInstances = [];
    }
  }
  class X {
    constructor(t, e, s, i) {
      this.pc = t, this.app = e, this.camera = s, this.onClick = i, this.pickRadius = 10, this.triggerRadius = 20, this.triggerTime = 500, this.entries = [], this.layer = this.app.scene.layers.getLayerByName("pickerLayer"), this.layer || (this.layer = new this.pc.Layer({
        name: "pickerLayer"
      }), this.app.scene.layers.push(this.layer));
      let n = this.camera.camera.layers.slice();
      n.push(this.layer.id), this.camera.camera.layers = n, this.picker = new this.pc.Picker(this.app, Math.round(e.graphicsDevice.width / 16) * 4, Math.round(e.graphicsDevice.height / 16) * 4), this.app.touch ? (e.touch.on(t.EVENT_TOUCHSTART, this.touchStart, this), e.touch.on(t.EVENT_TOUCHEND, this.touchEnd, this)) : this.app.mouse && (e.mouse.on(t.EVENT_MOUSEDOWN, this.mouseDown, this), e.mouse.on(t.EVENT_MOUSEUP, this.mouseUp, this));
    }
    dispose() {
      this.app.touch ? (this.app.touch.off(this.pc.EVENT_TOUCHSTART, this.touchStart, this), this.app.touch.off(this.pc.EVENT_TOUCHEND, this.touchEnd, this)) : (this.app.mouse.off(this.pc.EVENT_MOUSEDOWN, this.mouseDown, this), this.app.mouse.off(this.pc.EVENT_MOUSEUP, this.mouseUp, this)), this.clear();
    }
    setCamera(t) {
      this.camera = t;
    }
    mouseDown(t) {
      this.camera && this.camera.camera && this.camera.camera.enabled && (this.startX = t.x, this.startY = t.y, this.startTime = Date.now());
    }
    mouseUp(t) {
      if (this.camera && this.camera.camera && this.camera.camera.enabled) {
        let e = t.x - this.startX,
          s = t.y - this.startY;
        Math.sqrt(e * e + s * s) < this.triggerRadius && Date.now() - this.startTime < this.triggerTime && this.onClick(this, t.x, t.y);
      }
    }
    touchStart(t) {
      this.camera && this.camera.camera && this.camera.camera.enabled && (this.startX = t.changedTouches[0].x, this.startY = t.changedTouches[0].y, this.startTime = Date.now());
    }
    touchEnd(t) {
      if (this.camera && this.camera.camera && this.camera.camera.enabled) {
        let e = t.changedTouches[0].x - this.startX,
          s = t.changedTouches[0].y - this.startY;
        Math.sqrt(e * e + s * s) < this.triggerRadius && Date.now() - this.startTime < this.triggerTime && this.onClick(this, t.changedTouches[0].x, t.changedTouches[0].y);
      }
    }
    intersectObjects(t, e) {
      var u, d;
      let s = this.app.scene,
        i = this.app.graphicsDevice.canvas,
        n = parseInt("" + i.clientWidth, 10),
        o = parseInt("" + i.clientHeight, 10);
      this.picker.prepare(this.camera.camera, s, [this.layer]);
      let h = (d = (u = this.layer.instances) == null ? void 0 : u.transparentMeshInstances) == null ? void 0 : d.length;
      for (let y = 0; y < h; y++) {
        let p = this.layer.instances.transparentMeshInstances[y].material;
        p.parameters.texture_opacityMap && (p.parameters.texture_opacityMap.passFlags |= 1 << 18);
      }
      return this.picker.getSelection(Math.floor(t * (this.picker.width / n)) - this.pickRadius / 2, Math.floor(e * (this.picker.height / o)) - this.pickRadius / 2, this.pickRadius, this.pickRadius);
    }
    pick(t, e, s = !0) {
      let i = this.intersectObjects(t, e),
        n = [],
        o = this.camera.getPosition();
      for (let h of i) if (h && h.node) {
        let l = h.node;
        for (; !(l instanceof this.pc.Entity) && l !== null;) l = l.parent;
        if (l && l instanceof this.pc.Entity) {
          let u = l.getPosition().clone().sub(o).length();
          n.push({
            entity: l,
            distance: u,
            meshInstance: h
          });
        }
      }
      n.sort((h, l) => h.distance - l.distance);
      for (let h of n) {
        let l = h.entity;
        if (l.enabled) {
          let u = this.find(l);
          if (u && (!s || u.onclick)) return {
            entity: u.entity,
            meshInstance: h.meshInstance,
            item: u.item,
            onclick: u.onclick,
            distance: h.distance
          };
        }
      }
      return null;
    }
    add(t, e, s) {
      let i = new j(t, e, s);
      this.entries.push(i), i.meshInstances && this.layer.addMeshInstances(i.meshInstances);
    }
    find(t) {
      let e = this.entries.length;
      for (let s = e - 1; s >= 0; s--) {
        let i = this.entries[s];
        if (i.entity === t) return i;
      }
      return null;
    }
    delete(t) {
      let e = this.entries.length;
      for (let s = e - 1; s >= 0; s--) {
        let i = this.entries[s];
        i.item === t && (this.layer.removeMeshInstances(i.meshInstances), this.entries.splice(s, 1));
      }
    }
    clear() {
      this.layer.clearMeshInstances(), this.entries = [];
    }
  }
  function Z(r, t) {
    var e = r.createScript("sdsEntityPicker");
    e.prototype.initialize = function () {
      this.entityPicker = new X(r, t, g.Instance.camera, (i, n, o) => {
        let h = i.pick(n, o);
        h && h.onclick(h);
      }), this.app.on("add_entity_to_picker", this.onAddEntity, this), this.app.on("remove_entity_from_picker", this.onRemoveEntity, this), this.on("destroy", () => {
        this.app.off("add_entity_to_picker", this.onAddEntity, this), this.app.off("remove_entity_from_picker", this.onRemoveEntity, this), this.entityPicker.dispose();
      }, this);
    }, e.prototype.onAddEntity = function (i, n, o) {
      this.entityPicker.add(i, n, o);
    }, e.prototype.onRemoveEntity = function (i) {
      this.entityPicker.delete(i);
    };
    var s = r.createScript("sdsClickable");
    s.prototype.initialize = function () {
      this.tinyRoot = I.call(this), this.added || (this.app.fire("add_entity_to_picker", this.entity, this.entity.name, this.onClick.bind(this)), this.added = !0), this.on("enable", () => {
        console.log("add entity to picker"), this.added || (this.app.fire("add_entity_to_picker", this.entity, this.entity.name, this.onClick.bind(this)), this.added = !0);
      }), this.on("disable", () => {
        this.added && (this.app.fire("remove_entity_from_picker", this.entity.name), this.added = !1);
      }), this.on("destroy", () => {
        this.added && (this.app.fire("remove_entity_from_picker", this.entity.name), this.added = !1);
      });
    }, s.prototype.onClick = function (i) {
      this.entity.fire("click", i), this.tinyRoot.fire("click", i);
    };
  }
  function J(r, t) {
    class e extends r.ScriptType {
      constructor() {
        super(...arguments), this.areas = [], this.maxCheckCount = 1, this._nameInareaMap = new Map();
      }
      initialize() {
        this.cameraEntity = g.Instance.camera, this.app.on("registerArea", this.onRegisterArea, this), this.app.on("unRegisterArea", this.onUnRegisterArea, this), this.on("destroy", () => {
          this.app.off("registerArea"), this.app.off("unRegisterArea");
        });
      }
      update(n) {
        for (let o = 0; o < this.maxCheckCount; o++) {
          let h = this.areas.shift();
          if (!h) break;
          let l = this.checkInArea(h);
          h.inArea !== l && (h.inArea = l, this.updateNameInAreaMap(h.name, l)), this.areas.push(h);
        }
      }
      updateNameInAreaMap(n, o) {
        let h = this._nameInareaMap.get(n);
        this._nameInareaMap.set(n, o), h != o && (this.app.fire(o ? "enter_area" : "exit_area", n, this.areas), this.app.fire(`${o ? "enter_area" : "exit_area"}:${n}`, this.areas), console.log(`${o ? "enter_area" : "exit_area"}:${n}`));
      }
      checkInArea(n) {
        let h = n.entity.getWorldTransform().clone().invert().mul(this.cameraEntity.getWorldTransform().clone()).getTranslation();
        if (n.type === "box") return h.x >= -.5 && h.x <= .5 && h.y >= -.5 && h.y <= .5 && h.z >= -.5 && h.z <= .5;
        if (n.type === "sphere") return h.length() <= .5;
        if (n.type === "cylinder") return new r.Vec2(h.x, h.z).length() <= .5 && h.y >= -.5 && h.y <= .5;
      }
      onRegisterArea(n) {
        n.inArea = !1, this.areas.push(n);
      }
      onUnRegisterArea(n) {
        this.areas = this.areas.filter(o => o.entity !== n.entity && o.name !== n.name);
      }
    }
    r.registerScript(e, "sdsAreaDetactor");
    class s extends r.ScriptType {
      initialize() {
        let n = "",
          o = "box";
        if (this.entity.model ? (this.entity.model.type == "box" ? o = "box" : this.entity.model.type == "sphere" ? o = "sphere" : this.entity.model.type == "cylinder" && (o = "cylinder"), this.entity.model.enabled = !1) : this.entity.render && (this.entity.render.type == "box" ? o = "box" : this.entity.render.type == "sphere" ? o = "sphere" : this.entity.render.type == "cylinder" && (o = "cylinder"), this.entity.render.enabled = !1), this.entity.name.toLowerCase().startsWith("area_")) {
          if (n = this.entity.name.substring(5), n.indexOf("_") == 1) {
            let h = n.split("_");
            o = h[0] == "b" ? "box" : h[0] == "s" ? "sphere" : "cylinder", n = h[1];
          }
        } else n = this.entity.name;
        this.areaData = {
          name: n,
          type: o,
          entity: this.entity
        }, this.app.fire("registerArea", this.areaData), this.on("enable", () => {
          this.app.fire("registerArea", this.areaData);
        }), this.on("disable", () => {
          this.app.fire("unRegisterArea", this.areaData);
        }), this.on("destroy", () => {
          this.app.fire("unRegisterArea", this.areaData);
        });
      }
    }
    r.registerScript(s, "sdsMarkArea");
  }
  function B(r, t) {
    r.createScript("sdsFlag"), G(r), Q(r), W(r), H(r), q(r), K(r, t), Z(r, t), J(r), typeof window < "u" && Y(r);
  }
  const O = {
    skybox: {
      url: "https://sightp-tour-tiny-app.sightp.com/AppSettings/skybox/studio_small_09_2k-envAtlas.png",
      format: "rgbm",
      intensity: 1
    }
  };
  class g {
    constructor() {
      this._pluginsMap = new Map(), this._inited = !1, this._tinyRootMap = new Map();
    }
    get plugins() {
      return Array.from(this._pluginsMap.values());
    }
    get inited() {
      return this._inited;
    }
    static get Instance() {
      return this.instance || (this.instance = new this());
    }
    init(t, e, s) {
      if (this._inited) {
        console.warn("TinyLuncher already inited!");
        return;
      }
      this.pc = t, e instanceof (this.pc.AppBase ? this.pc.AppBase : this.pc.Application) ? this.app = e : this.app = this._createApp(e), this.app.scripts.has("sdsFlag") || B(this.pc, this.app), this.camera = this.app.root.findByTag("MainCamera")[0], this.camera || (this.camera = this.app.root.findByName("Camera")), this.camera || (this.camera = new this.pc.Entity("Camera"), this.camera.addComponent("camera", {
        clearColor: new this.pc.Color(0, 0, 0, 0),
        farClip: 1e3,
        nearClip: .1,
        priority: 0
      }), this.camera.tags.add("MainCamera"), this.camera.camera.layers = [this.pc.LAYERID_WORLD, this.pc.LAYERID_UI, this.pc.LAYERID_DEPTH, this.pc.LAYERID_IMMEDIATE], this.app.root.children[0].addChild(this.camera)), this.camera.addComponent("audiolistener"), E.Instance.init(this.pc, this.app, s), this.app.on("destroy", () => {
        console.log("TinyLuncher destroy"), this.destroy();
      }), this._inited = !0, this.tinyAppRootEntity = this.app.root.findByName("TinyAppRoot"), this.tinyAppRootEntity || (this.tinyAppRootEntity = new this.pc.Entity("TinyAppRoot"), this.app.root.children[0].addChild(this.tinyAppRootEntity), console.log("TinyAppRoot not found, create a new one.")), this.tinyAppRootEntity.addComponent("script"), this.tinyAppRootEntity.script.create("sdsEntityPicker"), this.tinyAppRootEntity.script.create("sdsAreaDetactor"), console.log("\u521B\u5EFA TinyAppRoot \u7684 TinyRoot");
      const i = new k(this.tinyAppRootEntity, {
        type: T.Empty
      });
      this.tinyAppRoot = i, this._tinyRootMap.set(this.tinyAppRootEntity, i), this.plugins.forEach(o => {
        o.onTinyLuncherInited && o.onTinyLuncherInited(this, E.Instance);
      }), this.plugins.forEach(o => {
        o.onInitScripts && o.onInitScripts(this.pc, this.app);
      });
      const n = new this.pc.Asset("skybox", "texture", {
        url: O.skybox.url
      }, {
        type: O.skybox.format
      });
      this.app.assets.add(n), this.app.assets.load(n), n.on("load", () => {
        this.app.scene.skyboxMip = 1, this.app.scene.envAtlas = n.resource, this.app.scene.toneMapping = this.pc.TONEMAP_LINEAR, this.app.scene.skyboxIntensity = O.skybox.intensity, this.app.scene.ambientLight = new this.pc.Color(.2, .2, .2);
      });
    }
    instantiateFromAnotation(t, e) {
      if (!this._inited) throw new Error("TinyLuncher is not inited!");
      if (this._tinyRootMap.has(e)) throw new Error(`entity ${e.name} already is a tinyapp root!`);
      this.plugins.forEach(i => {
        i.beforeAddTinyRoot && i.beforeAddTinyRoot(t);
      }), e || (e = new this.pc.Entity("EMA"), this.tinyAppRootEntity.addChild(e));
      const s = new U(e, t);
      return this._tinyRootMap.set(e, s), this.plugins.forEach(i => {
        i.onAddTinyRoot && i.onAddTinyRoot(s);
      }), s;
    }
    instantiateFromTinyApp(t, e, s) {
      let i = null;
      return typeof t == "string" ? i = {
        tinyAppUrl: t,
        loadCondition: w.auto,
        showCondition: w.auto,
        type: T.TinyAPP
      } : i = t, this.instantiateTinyRoot(i, e, s);
    }
    instantiateTinyRoot(t, e = new this.pc.Entity(), s = this.tinyAppRoot) {
      if (!this._inited) throw new Error("TinyLuncher is not inited!");
      if (this._tinyRootMap.has(e)) throw new Error(`entity ${e.name} already is a tinyapp root!`);
      this.plugins.forEach(n => {
        n.beforeAddTinyRoot && n.beforeAddTinyRoot(t);
      }), t.name && (e.name = t.name), t.position && e.setPosition(t.position.x, t.position.y, t.position.z), t.euler && e.setEulerAngles(t.euler.x, t.euler.y, t.euler.z), t.scale && e.setLocalScale(t.scale.x, t.scale.y, t.scale.z);
      const i = $(e, t);
      return i.parent = s, s.children.push(i), e.parent || s.rootEntity.addChild(e), this._tinyRootMap.set(e, i), this.plugins.forEach(n => {
        n.onAddTinyRoot && n.onAddTinyRoot(i);
      }), i;
    }
    findTinyRoot(t) {
      let e = null;
      return typeof t == "string" ? (e = this._tinyRootMap.get(this.app.root.findByName(t)), e || (e = this._tinyRootMap.get(this.app.root.findByGuid(t)))) : e = this._tinyRootMap.get(t), e;
    }
    removeTinyRoot(t) {
      const e = this._tinyRootMap.get(t);
      e ? (this.plugins.forEach(s => {
        s.onRemoveTinyRoot && s.onRemoveTinyRoot(e);
      }), e.unLoad(), this._tinyRootMap.delete(t), t.destroy()) : console.warn("TinyRoot not found::", t.name);
    }
    addPlugin(t) {
      t.name && t.name.length > 0 ? this._pluginsMap.set(t.name, t) : this._pluginsMap.set(t.__proto__.constructor.name, t), t.onAdd && t.onAdd(), this._inited ? (console.log(`\u6DFB\u52A0\u63D2\u4EF6${t.name}\uFF0C\u6267\u884C\u63D2\u4EF6\u521D\u59CB\u5316\u65B9\u6CD5`), t.onTinyLuncherInited && t.onTinyLuncherInited(this, E.Instance), t.onInitScripts && t.onInitScripts(this.pc, this.app), this._tinyRootMap.forEach(e => {
        t.onAddTinyRoot && t.onAddTinyRoot(e);
      })) : console.log(`\u6DFB\u52A0\u63D2\u4EF6${t.name}\uFF0C\u7B49\u5F85\u7CFB\u7EDF\u521D\u59CB\u5316\u5B8C\u6210\u540E\u6267\u884C\u63D2\u4EF6\u521D\u59CB\u5316\u65B9\u6CD5`);
    }
    removePlugin(t) {
      t.name && t.name.length > 0 ? this._pluginsMap.delete(t.name) : this._pluginsMap.delete(t.__proto__.constructor.name), t.onRemove && t.onRemove();
    }
    getPlugin(t) {
      return this._pluginsMap.get(t);
    }
    destroy() {
      var t, e;
      g.instance != null && (this.plugins.forEach(s => {
        s.onDestroy && s.onDestroy(this, E.Instance);
      }), this._pluginsMap.clear(), (t = this.tinyAppRoot) == null || t.unLoad(), (e = this.tinyAppRootEntity) == null || e.destroy(), this._tinyRootMap.clear(), g.instance = null, E.Instance.release(), console.log("TinyLuncher destroy"));
    }
    _createApp(t) {
      const e = new this.pc.Application(t, {
        touch: new this.pc.TouchDevice(t),
        elementInput: new this.pc.ElementInput(t, {
          useMouse: !1,
          useTouch: !0
        }),
        graphicsDeviceOptions: {
          antialias: !1,
          useDevicePixelRatio: !0,
          alpha: !0,
          preserveDrawingBuffer: !1,
          preferWebGl2: !1,
          assetPrefix: "",
          scriptPrefix: ""
        }
      });
      return typeof $my < "u" ? e.graphicsDevice.maxPixelRatio = $my.getSystemInfoSync().pixelRatio : typeof my < "u" && (e.graphicsDevice.maxPixelRatio = my.getSystemInfoSync().pixelRatio), e.setCanvasFillMode(this.pc.FILLMODE_FILL_WINDOW), e.setCanvasResolution(this.pc.RESOLUTION_AUTO), e.root.addChild(new this.pc.Entity("Root")), e.start(), e;
    }
  }
  function tt(r, t, e, s = {}) {
    return new Promise(async (i, n) => {
      e.projectUrl = e.projectUrl.replace(/\/$/, "");
      const o = e.projectUrl + "/config.json",
        h = e.projectUrl + "/__game-scripts.js";
      console.log("set up pc");
      let l = et(r, t, s);
      l.assets.prefix = e.projectUrl + "/", console.log("load config"), await it(l, o).catch(u => {
        console.error("load config error", u), n(u);
      }), e.onProgress && e.onProgress(.1), console.log("preload"), l.on("preload:progress", u => {
        e.onProgress && e.onProgress(.1 + u * .8);
      }, this), await st(l).catch(u => {
        console.error("preload error", u), n(u);
      }), l.on("preload:end", u => {
        l.off("preload:progress");
      }), e.loadScript && (console.log("load script"), e.loadScript(r, l)), await new Promise((u, d) => {
        e.loadScriptFromString && e.loadNetworkScripts ? (console.log("load network script"), r.http.get(h, {
          cache: !1,
          responseType: "text"
        }, (y, p) => {
          if (y) d(y);else {
            const f = {
              console,
              pc: r,
              app: l,
              $my: typeof $my < "u" ? $my : null,
              my: typeof my < "u" ? my : null,
              setTimeout,
              setInterval,
              clearTimeout,
              clearInterval,
              Float32Array,
              $TinyLoader: E.Instance,
              $TinyLuncher: g.Instance,
              $GetTinyRoot: function (A) {
                return I.call(A);
              }
            };
            e.loadScriptFromString(p, f), u();
          }
        })) : u();
      }), e.onProgress && e.onProgress(.95), console.log("load scene"), await nt(l, e.sceneName).catch(u => {
        console.error("load scene error", u), n(u);
      }), e.onProgress && e.onProgress(1), l.start(), g.Instance.init(r, l, e.loadScriptFromString), e.onLoaded && e.onLoaded(r, l), i();
    }).catch(i => {
      e.onError && e.onError(i);
    });
  }
  function et(r, t, e) {
    let s = {
      elementInput: new r.ElementInput(t, {
        useMouse: !0,
        useTouch: !0
      }),
      touch: new r.TouchDevice(t),
      mouse: new r.Mouse(t)
    };
    e = Object.assign({
      touch: s.touch,
      mouse: s.mouse,
      elementInput: s.elementInput,
      graphicsDeviceOptions: {
        antialias: !1,
        useDevicePixelRatio: !0,
        alpha: !0,
        preserveDrawingBuffer: !1,
        preferWebGl2: !1
      }
    }, e);
    let i = new r.Application(t, e);
    return typeof $my < "u" ? i.graphicsDevice.maxPixelRatio = $my.getSystemInfoSync().pixelRatio : typeof my < "u" && (i.graphicsDevice.maxPixelRatio = my.getSystemInfoSync().pixelRatio), i.setCanvasFillMode(r.FILLMODE_FILL_WINDOW), i.setCanvasResolution(r.RESOLUTION_AUTO), i;
  }
  function it(r, t) {
    return new Promise((e, s) => {
      console.debug(new Date().getTime(), "loading config"), r.configure(t, i => {
        console.debug(new Date().getTime(), "config loaded"), i ? s(i) : e();
      });
    });
  }
  function st(r) {
    return new Promise((t, e) => {
      console.debug(new Date().getTime(), "preloading"), r.preload(s => {
        console.debug(new Date().getTime(), "preloaded"), s ? e(s) : t();
      });
    });
  }
  function nt(r, t) {
    return new Promise((e, s) => {
      console.debug(new Date().getTime(), "loading scene", t), r.scenes.loadScene(t, (i, n) => {
        console.debug(new Date().getTime(), "scene loaded", n), i ? s(i) : e(n);
      });
    });
  }
  class at {
    constructor(t) {
      this.name = "BlockController", this.entitys = [], this.blockConfig = t;
    }
    onClsResult(t) {
      setTimeout(() => {
        this.app && this.app.fire("clsResult", t);
      }, 34);
    }
    setBlockTransform(t) {
      this.blockConfig = t, this.entitys.forEach(e => {
        e.fire("setBlockTransform", t);
      });
    }
    onInitScripts(t, e) {
      let s = this;
      this.pc = t, this.app = e;
      let i = t.createScript("sdsBlockController", e);
      i.prototype.initialize = function () {
        console.log("sdsBolockController initialize"), this.app.on("clsResult", this.onClsResult, this), this.entity.on("setBlockTransform", this.setBlockTransform, this), this.on("destroy", function () {
          this.app.off("clsResult", this.onClsResult, this), this.entity.off("setBlockTransform", this.setBlockTransform, this);
        }), this.blockMap = new Map(), this.entity.children.forEach(n => {
          n.enabled = !1, this.blockMap.set(n.name, n);
        }), s.blockConfig && s.blockConfig.length > 0 && this.setBlockTransform(s.blockConfig);
      }, i.prototype.onClsResult = function (n) {
        let o = n.mapId;
        this.blockMap.forEach((h, l) => {
          l == o ? h.enabled = !0 : h.enabled = !1;
        });
      }, i.prototype.setBlockTransform = function (n) {
        console.log("start set block transform"), n.forEach(o => {
          if (this.blockMap.has(o.id)) {
            let h = this.blockMap.get(o.id);
            h.setPosition(o.transform.position.x, o.transform.position.y, o.transform.position.z), h.setRotation(o.transform.rotation.x, o.transform.rotation.y, o.transform.rotation.z, o.transform.rotation.w), h.setLocalScale(o.transform.scale.x, o.transform.scale.y, o.transform.scale.z), console.log(`set ${o.id} transform.p:${o.transform.position}  r:${o.transform.rotation}  r:${o.transform.scale}`);
          }
        });
      };
    }
    onAddTinyRoot(t) {
      t.rawData.type == "Annotation" && (t.rootEntity.script || t.rootEntity.addComponent("script"), t.rootEntity.script.has("sdsBlockController") || (t.rootEntity.script.create("sdsBlockController"), this.entitys.push(t.rootEntity)));
    }
    onRemove() {
      this.entitys.forEach(t => {
        t.script.destroy("sdsBlockController");
      }), this.entitys = [];
    }
  }
  class ot {
    constructor(t) {
      this.name = "AssistantPlugin", this.isReady = !1, this.tinyAPPUrl = t;
    }
    onTinyLuncherInited(t, e) {
      this.tinyAPPUrl && !this.assistantTinyRoot && (console.log("create assistant and start load at next frame"), setTimeout(() => {
        this.assistantTinyRoot = t.instantiateFromTinyApp({
          type: T.TinyAPP,
          name: "assistant",
          tinyAppUrl: this.tinyAPPUrl,
          loadCondition: w.auto,
          showCondition: w.auto,
          externalData: {
            type: "assistant"
          }
        });
      }, 30));
    }
    onAddTinyRoot(t) {
      if (t.externalData && t.externalData.type == "assistant") {
        if (console.log("add a Assistant"), !this.assistantTinyRoot) this.assistantTinyRoot = t;else {
          console.error("already has a assistant.try add another one:", t.rootEntity.name);
          return;
        }
        this.assistantTinyRoot.on("loaded", () => {
          let e = t.rootEntity.children[0],
            s = 0;
          for (; s < 5 && (e.script && e.script.sdsAssistant && (this.sdsAssistant = e.script.sdsAssistant), !this.sdsAssistant);) {
            e = e.children[0];
            s++;
          }
          if (!this.sdsAssistant) {
            console.error("can not find sdsAssistant");
            return;
          }
          this.isReady = !0, this.onReady && this.onReady();
        });
      }
    }
    onDestroy(t, e) {
      this.sdsAssistant = null, this.assistantTinyRoot = null, this.isReady = !1, this.onReady = null;
    }
  }
  class rt {
    constructor(t) {
      this.gl = t, this._dt = null, this._program = null, this._vao = null, this._vao_ext = null;
    }
    get program() {
      return this._program;
    }
    set program(t) {
      this._program = t;
    }
    initGL() {
      this.initShader(), this.initVAO();
    }
    initShader() {
      const t = this.gl,
        e = t.getParameter(t.CURRENT_PROGRAM),
        s = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        uniform mat3 displayTransform;
        varying vec2 v_texCoord;
        void main() {
          vec3 p = displayTransform * vec3(a_position, 0.0);
          gl_Position = vec4(p, 1.0);
          v_texCoord = a_texCoord;
        }
      `,
        i = `
        precision highp float;

        uniform sampler2D y_texture;
        uniform sampler2D uv_texture;
        varying vec2 v_texCoord;
        void main() {
          vec4 y_color = texture2D(y_texture, v_texCoord);
          vec4 uv_color = texture2D(uv_texture, v_texCoord);

          float Y, U, V;
          float R ,G, B;
          Y = y_color.r;
          U = uv_color.r - 0.5;
          V = uv_color.a - 0.5;
          
          R = Y + 1.402 * V;
          G = Y - 0.344 * U - 0.714 * V;
          B = Y + 1.772 * U;
          
          gl_FragColor = vec4(R, G, B, 1.0);
        }
      `,
        n = t.createShader(t.VERTEX_SHADER);
      t.shaderSource(n, s), t.compileShader(n);
      const o = t.createShader(t.FRAGMENT_SHADER);
      t.shaderSource(o, i), t.compileShader(o);
      const h = this._program = t.createProgram();
      this._program.gl = t, t.attachShader(h, n), t.attachShader(h, o), t.deleteShader(n), t.deleteShader(o), t.linkProgram(h), t.useProgram(h);
      const l = t.getUniformLocation(h, "y_texture");
      t.uniform1i(l, 5);
      const u = t.getUniformLocation(h, "uv_texture");
      t.uniform1i(u, 6), this._dt = t.getUniformLocation(h, "displayTransform"), t.useProgram(e);
    }
    initVAO() {
      const t = this.gl,
        e = t.getExtension("OES_vertex_array_object");
      this._vao_ext = e;
      const s = t.getParameter(t.VERTEX_ARRAY_BINDING),
        i = e.createVertexArrayOES();
      e.bindVertexArrayOES(i);
      const n = t.getAttribLocation(this._program, "a_position"),
        o = t.createBuffer();
      t.bindBuffer(t.ARRAY_BUFFER, o), t.bufferData(t.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), t.STATIC_DRAW), t.vertexAttribPointer(n, 2, t.FLOAT, !1, 0, 0), t.enableVertexAttribArray(n), i.posBuffer = o;
      const h = t.getAttribLocation(this._program, "a_texCoord"),
        l = t.createBuffer();
      t.bindBuffer(t.ARRAY_BUFFER, l), t.bufferData(t.ARRAY_BUFFER, new Float32Array([1, 1, 0, 1, 1, 0, 0, 0]), t.STATIC_DRAW), t.vertexAttribPointer(h, 2, t.FLOAT, !1, 0, 0), t.enableVertexAttribArray(h), i.texcoordBuffer = l, e.bindVertexArrayOES(s), this._vao = i;
    }
    renderGL(t) {
      const e = this.gl;
      e.disable(e.DEPTH_TEST);
      const {
          yTexture: s,
          uvTexture: i
        } = t.getCameraTexture(e),
        n = t.getDisplayTransform();
      if (s && i) {
        const o = e.getParameter(e.CURRENT_PROGRAM),
          h = e.getParameter(e.ACTIVE_TEXTURE),
          l = e.getParameter(e.VERTEX_ARRAY_BINDING);
        e.useProgram(this._program), this._vao_ext.bindVertexArrayOES(this._vao), e.uniformMatrix3fv(this._dt, !1, n), e.pixelStorei(e.UNPACK_ALIGNMENT, 1), e.activeTexture(e.TEXTURE0 + 5);
        const u = e.getParameter(e.TEXTURE_BINDING_2D);
        e.bindTexture(e.TEXTURE_2D, s), e.activeTexture(e.TEXTURE0 + 6);
        const d = e.getParameter(e.TEXTURE_BINDING_2D);
        e.bindTexture(e.TEXTURE_2D, i), e.drawArrays(e.TRIANGLE_STRIP, 0, 4), e.bindTexture(e.TEXTURE_2D, d), e.activeTexture(e.TEXTURE0 + 5), e.bindTexture(e.TEXTURE_2D, u), e.useProgram(o), e.activeTexture(h), this._vao_ext.bindVertexArrayOES(l);
      }
    }
    clearGL() {
      const t = this.gl;
      t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT), t.clear(t.DEPTH_BUFFER_BIT), t.clear(t.STENCIL_BUFFER_BIT);
    }
    destroy() {
      this._program && this._program.gl && (this.clearGL(), this._program.gl.deleteProgram(this._program), this._program = null, this.gl = null);
    }
  }
  class ht {
    constructor(t, e = {
      useMarker: !1,
      useCls: !1
    }) {
      this.name = "vkTinyPlugin", this._markersMap = new Map(), this.canvas = t, this.gl = t.getContext("webgl"), this._setting = e, this._captureCanvas = $my.createOffscreenCanvas({
        type: "2d",
        width: t.width,
        height: t.height
      });
      const s = setInterval(() => {
        if (this._captureCanvas) {
          clearInterval(s);
          return;
        }
        console.warn("create offscreen canvas fail, retry create"), this._captureCanvas = $my.createOffscreenCanvas({
          type: "2d",
          width: t.width,
          height: t.height
        });
      }, 60);
    }
    onTinyLuncherInited(t, e) {
      this.tinyLuncher = t, this.pc = e.pc, this.app = t.app, this.cameraEntity = t.camera, this.vkVersion = $my.isVKSupport("v2") ? "v2" : "v1", console.log("support version ", this.vkVersion), this._vkSessionStartPromise = new Promise((s, i) => {
        this.vkSession = $my.createVKSession({
          track: {
            plane: {
              mode: 1
            },
            marker: this._setting.useMarker,
            threeDof: this.vkVersion === "v1"
          },
          version: this.vkVersion,
          gl: this.gl
        }), this.vkSession.start(n => {
          if (n) return i(n), console.error("AR error", n);
          console.log("start vk session"), this.app.fire("vkSessionStart"), this.yuv = new rt(this.gl), this.yuv.initGL(), this.app.xr.session || (console.log("\u5173\u95ED App3d \u81EA\u52A8\u5237\u65B0"), this.app.xr = {
            session: {
              requestAnimationFrame: () => {}
            },
            end: () => {},
            destroy: () => {}
          }), this._frameRequestId = this.vkSession.requestAnimationFrame(() => {
            this._onFrame();
          }), this._setting.useMarker && (this.vkSession.on("addAnchors", this._onAddAnchors.bind(this)), this.vkSession.on("removeAnchors", this._onRemoveAnchors.bind(this)), this.vkSession.on("updateAnchors", this._onUpdateAnchors.bind(this))), s();
        });
      });
    }
    onInitScripts(t, e) {
      let s = this;
      class i extends t.ScriptType {
        initialize() {
          this.tinyRoot = s.tinyLuncher.findTinyRoot(this.entity), this.tinyRoot || this.entity.on("inited", o => {
            this.tinyRoot = o;
          }), this.app.on(`addMarkerAnchor:${this.markerId}`, o => {
            !this.tinyRoot.loaded && !this.tinyRoot.loading && this.tinyRoot.load(() => {
              this.tinyRoot.setActive(!0);
            }), this.tinyRoot.setActive(!0), this.app.fire("showmodel", this.entity), this.updateTransform(o.transform), console.log("add marker anchor");
          }), this.app.on(`updateMarkerAnchor:${this.markerId}`, o => {
            this.tinyRoot.active === !1 && Date.now() - this._lastHideTime > 1e3 && (this.tinyRoot.setActive(!0), this.app.fire("showmodel", this.entity.name), this.updateTransform(o.transform)), this.updateTransform(o.transform), this._lastUpdateTime = Date.now();
          }), this.app.on(`removeMarkerAnchor:${this.markerId}`, o => {
            this.tinyRoot.setActive(!1), this.app.fire("hidemodel", this.entity), s._currentMarkerAnchor = null, console.log("remove marker anchor");
          }), this.entity.on("removeMarker", () => {
            this._lastHideTime = Date.now(), this.tinyRoot.setActive(!1), this.app.fire("hidemodel", this.entity), s._currentMarkerAnchor = null, console.log("remove marker anchor");
          });
        }
        update(o) {
          let h = Date.now();
          this._lastUpdateTime && h - this._lastUpdateTime > 1e4 && !this.keep && (this.tinyRoot.setActive(!1), this.app.fire("hidemodel", this.entity), s._currentMarkerAnchor = null, this._lastHideTime = Date.now(), this._lastUpdateTime = null);
        }
        updateTransform(o) {
          let h = new t.Mat4();
          h.set(Array.from(o)), this.entity.setPosition(h.getTranslation()), this.tinyRoot.externalData.r && this.entity.setRotation(new t.Quat().setFromMat4(h)), this.tinyRoot.externalData.s && this.entity.setLocalScale(h.getScale());
        }
      }
      t.registerScript(i, "bindMarker", e), i.attributes.add("markerId", {
        type: "number",
        default: -1
      }), i.attributes.add("keep", {
        type: "boolean",
        default: !0
      });
    }
    onAddTinyRoot(t) {
      if (t.externalData && t.externalData.type == "vkMarker") {
        let e = t.externalData;
        this.addMarker(e.imgUrl).then(s => {
          t.rootEntity.script.create("bindMarker", {
            attributes: {
              markerId: s,
              keep: t.externalData.keep != null ? t.externalData.keep : !0
            }
          });
        }).catch(s => {
          console.error(s);
        });
      }
    }
    onRemove() {
      console.log("remove vk session");
      let t = $my.getFileSystemManager();
      this.app && (this.app.xr.session = null), this.vkSession && (this._markersMap.forEach(e => {
        this.vkSession.removeMarker(e.id), t.unlink({
          filePath: e.filePath,
          success: () => {
            console.log("delete file success", e.filePath);
          },
          fail: s => {
            console.log("delete file fail", e.filePath, s);
          }
        });
      }), this._markersMap.clear(), this.vkSession.off("addAnchors", this._onAddAnchors.bind(this)), this.vkSession.off("removeAnchors", this._onRemoveAnchors.bind(this)), this.vkSession.off("updateAnchors", this._onUpdateAnchors.bind(this)), this.vkSession.cancelAnimationFrame(this._frameRequestId), this.vkSession.stop(), this.vkSession.destroy(), this.vkSession = null), this.yuv && (this.yuv.destroy(), this.yuv = null);
    }
    onDestroy(t, e) {
      console.log("destroy vk session");
      let s = $my.getFileSystemManager();
      this.vkSession && (this._markersMap.forEach(i => {
        this.vkSession.removeMarker(i.id), s.unlink({
          filePath: i.filePath,
          success: () => {
            console.log("delete file success", i.filePath);
          },
          fail: n => {
            console.log("delete file fail", i.filePath, n);
          }
        });
      }), this._markersMap.clear(), this.vkSession.off("addAnchors", this._onAddAnchors.bind(this)), this.vkSession.off("removeAnchors", this._onRemoveAnchors.bind(this)), this.vkSession.off("updateAnchors", this._onUpdateAnchors.bind(this)), this.vkSession.cancelAnimationFrame(this._frameRequestId), this.vkFrame = null, this.vkSession.stop(), this.vkSession.destroy(), this.vkSession = null), this.yuv && (this.yuv.destroy(), this.yuv = null), this.canvas = null, this.gl = null;
    }
    addMarker(t) {
      return new Promise((e, s) => {
        if (!this.vkSession) return s(-1);
        let i = t.split("/").pop(),
          n = `${$my.env.USER_DATA_PATH}/${i}`,
          o = -1,
          h = $my.getFileSystemManager();
        ((u, d) => new Promise((y, p) => {
          h.stat({
            path: d,
            success: f => {
              f.stats.isFile() && (console.log("file exist", d), y(d));
            },
            fail: f => {
              console.log("file not exist", d), $my.downloadFile({
                url: u,
                filePath: d,
                success: A => {
                  A.statusCode === 200 && (console.log("download success", A.filePath), y(A.filePath));
                },
                fail: A => {
                  console.log("download fail", A), p(A);
                }
              });
            }
          });
        }))(t, n).then(u => {
          this._vkSessionStartPromise.then(() => {
            o = this.vkSession.addMarker(u), o > -1 ? (console.log("add marker success", o, {
              url: t,
              filePath: u,
              id: o
            }), e(o), this._markersMap.set(o, {
              url: t,
              filePath: u,
              id: o
            })) : s(o);
          });
        }).catch(u => {
          s(u);
        });
      });
    }
    removeMarker(t) {
      !this.vkSession || (this.vkSession.removeMarker(t), this._markersMap.delete(t));
    }
    stopSession() {
      !this.vkSession || (this.app.fire("vkSessionStop"), this.vkSession.cancelAnimationFrame(this._frameRequestId), this.vkFrame = null, this.vkSession.stop());
    }
    restartSession() {
      !this.vkSession || this.vkSession.start(t => {
        if (t) return console.error("AR error", t);
        this.app.fire("vkSessionStart"), console.log("start vk session"), this._frameRequestId = this.vkSession.requestAnimationFrame(() => {
          this._onFrame();
        });
      });
    }
    takePhoto() {
      return new Promise(async (t, e) => {
        $my.showLoading({
          title: "\u7167\u7247\u751F\u6210\u4E2D..."
        });
        let s = this._captureCanvas.getContext("2d"),
          i = await Promise.all([this._getDrawBuffer(this.gl), this._getDrawBuffer(this.app.graphicsDevice.gl)]),
          n = i[0],
          o = i[1];
        for (let u = 0; u < n.data.byteLength; u += 4) {
          let d = o.data[u + 3] / 255;
          n.data[u] = n.data[u] * (1 - d) + o.data[u] * d, n.data[u + 1] = n.data[u + 1] * (1 - d) + o.data[u + 1] * d, n.data[u + 2] = n.data[u + 2] * (1 - d) + o.data[u + 2] * d, n.data[u + 3] = 255;
        }
        this._flip(n.data, n.width, n.height, 4), s.clearRect(0, 0, this._captureCanvas.width, this._captureCanvas.height);
        let h = this._captureCanvas.createImageData(new Uint8ClampedArray(n.data), n.width, n.height);
        s.putImageData(h, 0, 0);
        let l = this._captureCanvas.toDataURL("image/jpeg", .9);
        t(l), $my.hideLoading();
      });
    }
    _getDrawBuffer(t) {
      const e = t;
      return new Promise((s, i) => {
        this.app.once("frameend", () => {
          const n = e.drawingBufferWidth,
            o = e.drawingBufferHeight;
          let h = new Uint8Array(n * o * 4);
          e.readPixels(0, 0, n, o, e.RGBA, e.UNSIGNED_BYTE, h), s({
            width: n,
            height: o,
            data: h
          });
        });
      });
    }
    _onFrame() {
      const t = this.vkSession.getVKFrame(this.canvas.width, this.canvas.height);
      t && (this.vkFrame = t, this.app.once("frameupdate", () => {
        let e = new this.pc.Mat4();
        e.set(Array.from(t.camera.viewMatrix)), e.invert(), this.cameraEntity.setPosition(e.getTranslation()), this.cameraEntity.setRotation(new this.pc.Quat().setFromMat4(e)), this.cameraEntity.setLocalScale(e.getScale());
        let s = t.camera.getProjectionMatrix(this.cameraEntity.camera.nearClip, this.cameraEntity.camera.farClip);
        this.cameraEntity.camera.projectionMatrix.set(Array.from(s)), this.yuv.renderGL(t);
      }), this.app.tick()), this._frameRequestId = this.vkSession.requestAnimationFrame(() => {
        this._onFrame();
      });
    }
    _onAddAnchors(t) {
      t.forEach(e => {
        e.type === 0 ? this.app.fire("addPlaneAnchor", e) : e.type === 1 ? this._currentMarkerAnchor || (this.app.fire(`addMarkerAnchor:${e.markerId}`, e), this.app.fire("addMarkerAnchor", e.markerId, e), this._currentMarkerAnchor = e) : e.type === 2 && (this.app.fire(`addOSDAnchor:${e.markerId}`, e), this.app.fire("addOSDAnchor", e.markerId, e));
      });
    }
    _onUpdateAnchors(t) {
      t.forEach(e => {
        e.type === 0 ? this.app.fire("updatePlaneAnchor", e) : e.type === 1 ? this.app.fire(`updateMarkerAnchor:${e.markerId}`, e) : e.type === 2 && this.app.fire(`updateOSDAnchor:${e.markerId}`, e);
      });
    }
    _onRemoveAnchors(t) {
      t.forEach(e => {
        e.type === 0 ? this.app.fire("removePlaneAnchor", e) : e.type === 1 ? this.app.fire(`removeMarkerAnchor:${e.markerId}`, e) : e.type === 2 && this.app.fire(`removeOSDAnchor:${e.markerId}`, e);
      });
    }
    _flip(t, e, s, i) {
      if (Array.isArray(t)) {
        for (var n = this._flip(new Uint8Array(t), e, s, i), o = 0; o < t.length; o++) t[o] = n[o];
        return t;
      }
      if (!e || !s) throw Error("Bad dimensions");
      i || (i = t.length / (e * s));
      var h = s >> 1,
        l = e * i;
      t.constructor;
      for (var u = new Uint8Array(e * i), d = 0; d < h; ++d) {
        var y = d * l,
          p = (s - d - 1) * l;
        u.set(t.subarray(y, y + l)), t.copyWithin(y, p, p + l), t.set(u, p);
      }
      return t;
    }
  }
  function lt(r) {
    return I.call(r);
  }
  const ut = E.Instance,
    ct = g.Instance;
  typeof window < "u" && (window.$TinyLoader = E.Instance, window.$TinyLuncher = g.Instance, window.$GetTinyRoot = function (r) {
    return I.call(r);
  }, window.pc && B(window.pc, window.pc.app)), v.$GetTinyRoot = lt, v.$TinyLoader = ut, v.$TinyLuncher = ct, v.AssistantPlugin = ot, v.BlockController = at, v.EmaTinyRoot = U, v.LoadCondition = w, v.TinyAppTinyRoot = S, v.TinyLoader = E, v.TinyLuncher = g, v.TinyRoot = k, v.TinyRootType = T, v.getMyRoot = I, v.initScripts = B, v.loadProject = tt, v.vkTinyPlugin = ht, Object.defineProperties(v, {
    __esModule: {
      value: !0
    },
    [Symbol.toStringTag]: {
      value: "Module"
    }
  });
});
console.log("use tiny-runtime v0.8.12");