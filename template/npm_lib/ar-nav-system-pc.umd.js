(function (P, N) {
  typeof exports == "object" && typeof module < "u" ? N(exports) : typeof define == "function" && define.amd ? define(["exports"], N) : (P = typeof globalThis < "u" ? globalThis : P || self, N(P["ar-nav-system-pc"] = {}));
})(this, function (P) {
  "use strict";

  var Lt = Object.defineProperty;
  var Ot = (P, N, R) => N in P ? Lt(P, N, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: R
  }) : P[N] = R;
  var u = (P, N, R) => (Ot(P, typeof N != "symbol" ? N + "" : N, R), R);
  class N {
    constructor(e) {
      u(this, "_rawUrl");
      u(this, "_baseUrl");
      u(this, "_params");
      this._params = new Map(), this._rawUrl = e;
      let i = e.split("?");
      this._baseUrl = i[0], i.length == 2 && i[1].split("&").forEach(a => {
        let r = a.split("=");
        this._params.set(r[0], r[1]);
      });
    }
    getParam(e) {
      return this._params.has(e) ? this._params.get(e) : null;
    }
    hasParam(e) {
      return this._params.has(e);
    }
    get baseUrl() {
      return this._baseUrl;
    }
    get rawUrl() {
      return this._rawUrl;
    }
    get fileNameWithExt() {
      let e = this._baseUrl.split("/");
      return e[e.length - 1];
    }
    get fileName() {
      return this.fileNameWithExt.split(".")[0];
    }
  }
  const ut = class {
    constructor() {
      u(this, "app");
      u(this, "pc");
      u(this, "catch", new Map());
    }
    static get instnce() {
      return this._instance || (this._instance = new ut()), this._instance;
    }
    loadModel(e) {
      let i = new N(e),
        s = null;
      i.baseUrl.endsWith(".json") || i.baseUrl.endsWith("pc.glb") ? s = "model" : (i.baseUrl.endsWith(".gltf") || i.baseUrl.endsWith(".glb")) && (s = "container");
      let a = this.loadFromUrl(i.baseUrl, s, i.fileNameWithExt),
        r = new this.pc.Entity();
      s == "model" ? r.addComponent("model", {
        type: "asset",
        asset: a.id
      }) : s == "container" && a.promise.then(h => {
        r.addComponent("model", {
          type: "asset",
          asset: h.resource.model
        });
      });
      let n = new this.pc.Entity();
      if (n.addChild(r), i.hasParam("p")) {
        let h = i.getParam("p").split(",");
        r.setLocalPosition(Number(h[0]), Number(h[1]), Number(h[2]));
      }
      if (i.hasParam("r")) {
        let h = i.getParam("r").split(",");
        r.setLocalEulerAngles(Number(h[0]), Number(h[1]), Number(h[2]));
      }
      if (i.hasParam("s")) {
        let h = i.getParam("s").split(",");
        r.setLocalScale(Number(h[0]), Number(h[1]), Number(h[2]));
      }
      return n;
    }
    loadModelWithAnimation(e, i) {
      let s = this.loadModel(e).children[0],
        a = this.catch.get(e.split("?")[0]);
      if (a.type == "model") {
        let r = [];
        for (let n in i) {
          if (!i[n].startsWith("http")) continue;
          let h = this.loadFromUrl(i[n], "animation", n);
          r.push(h.id);
        }
        s.addComponent("animation", {
          activate: !0,
          assets: r,
          loop: !0
        });
      } else if (a.type == "container") {
        let r = [];
        s.addComponent("animation", {
          activate: !0,
          assets: r,
          loop: !0
        });
        for (let n in i) if (i[n].startsWith("http")) {
          let h = this.loadFromUrl(i[n], "animation", n);
          r.push(h.id), r.length == Object.keys(i).length && (s.animation.assets = r);
        } else a.promise.then(h => {
          let o = !1;
          if (h.resource.animations.forEach(l => {
            l.name == i[n] && (o = !0, l.name = n, r.push(l.id));
          }), !o) {
            console.warn("\u52A8\u753B", i[n], "\u672A\u88AB\u52A0\u8F7D");
            return;
          }
          r.length == Object.keys(i).length && (s.animation.assets = r);
        });
      }
      return s.parent;
    }
    loadFromUrl(e, i, s) {
      if (this.catch.has(e)) return this.catch.get(e);
      this.app.assets.loadFromUrl(e, i, (n, h) => {});
      let a = this.app.assets.getByUrl(e);
      s && a.name != s && (a.name = s);
      let r = {
        id: a.id,
        asset: a,
        type: i,
        state: "loading",
        name: s,
        promise: new Promise((n, h) => {
          a.once("load", o => {
            r.state = "loaded", i == "container" && o.resource.animations.forEach(l => {
              l.name = l.resource.name;
            }), n(o);
          }), a.once("error", o => {
            console.error("\u52A0\u8F7D\u8D44\u6E90", e, "\u5931\u8D25", o), r.state = "error", h(o);
          });
        })
      };
      return this.catch.set(e, r), r;
    }
    getLoadingPromise(e) {
      e = Array.from(new Set(e));
      let i = [];
      return e.forEach(s => {
        !s.startsWith("http") || (this.catch.has(s.split("?")[0]) ? i.push(this.catch.get(s.split("?")[0]).promise) : console.warn("\u8D44\u6E90", s, "\u672A\u88AB\u52A0\u8F7D"));
      }), Promise.all(i);
    }
    clear() {
      this.catch.forEach(e => {
        e.asset.unload();
      }), this.catch.clear();
    }
  };
  let R = ut;
  u(R, "_instance");
  const nt = class {
    constructor() {
      u(this, "app");
      u(this, "entity");
      u(this, "jobqueue");
      u(this, "templeteMap");
      u(this, "catchMap");
      u(this, "countMap");
      u(this, "activeMap");
      u(this, "creatCountPerUpdate", 1);
    }
    static get Instance() {
      return this._instance || (this._instance = new nt()), this._instance;
    }
    init(e, i) {
      this.app = i, this.entity = new e.Entity("objectPool", i), this.app.root.addChild(this.entity), this.app.on("update", this.update, this);
    }
    update(e) {
      if (this.jobqueue && this.jobqueue.length > 0) for (let i = 0; i < (this.creatCountPerUpdate < this.jobqueue.length ? this.creatCountPerUpdate : this.jobqueue.length); i++) {
        let s = this.jobqueue.shift(),
          a = this.templeteMap.get(s).clone();
        a.enabled = !1, a.reparent(this.entity), this.catchMap.get(s).push(a);
      }
    }
    register(e, i) {
      if (!this.app || !this.entity) {
        console.warn("\u5BF9\u8C61\u6C60\u672A\u521D\u59CB\u5316");
        return;
      }
      this.templeteMap || (this.templeteMap = new Map()), this.templeteMap.set(e.name, e), this.catchMap || (this.catchMap = new Map()), this.catchMap.set(e.name, []), this.countMap || (this.countMap = new Map()), this.countMap.set(e.name, i), this.activeMap || (this.activeMap = new Map()), this.jobqueue || (this.jobqueue = []);
      for (let s = 0; s < i; s++) this.jobqueue.push(e.name);
    }
    create(e) {
      if (this.catchMap && this.catchMap.has(e)) {
        let i = this.catchMap.get(e);
        if (i.length > 0) {
          let s = i.shift();
          return this.activeMap.set(s, e), s.enabled = !0, s;
        } else {
          let s = this.templeteMap.get(e).clone();
          return this.activeMap.set(s, e), s.enabled = !0, s;
        }
      } else console.warn("\u672A\u5728\u5BF9\u8C61\u6C60\u4E2D\u6CE8\u518C");
    }
    destroy(e) {
      let i = this.activeMap.get(e);
      if (i) {
        let s = this.catchMap.get(i);
        s.length >= this.countMap.get(i) ? e.destroy() : (e.enabled = !1, e.reparent(this.entity), s.push(e)), this.activeMap.delete(e);
      } else e.destroy();
    }
    clear(e) {
      e ? (this.catchMap && this.catchMap.get(e)).forEach(s => {
        s.destroy();
      }) : (this.templeteMap && this.templeteMap.clear(), this.templeteMap = null, this.catchMap && this.catchMap.forEach(i => {
        i.forEach(s => {
          s.destroy();
        });
      }), this.catchMap && this.catchMap.clear(), this.catchMap = null, this.activeMap && this.activeMap.forEach((i, s) => {
        s.destroy();
      }), this.activeMap && this.activeMap.clear(), this.activeMap = null);
    }
    destroyPool() {
      this.clear(), this.entity.destroy(), this.app.off("update", this.update, this), nt._instance = null, console.log("\u6E05\u7406\u5BF9\u8C61\u6C60");
    }
  };
  let z = nt;
  u(z, "_instance");
  class dt {
    constructor() {
      this._navPlans = [];
    }
    get currentPlan() {
      return !this._currentPlan && this._navPlans.length > 0 && (this._currentPlan = this._navPlans[0], this._currentPlanIndex = 0), this._currentPlan;
    }
    addPlan(e) {
      if (this._navPlans.length > 0) {
        let i = this._navPlans[this._navPlans.length - 1];
        i.needDraw === e.needDraw ? i.mergePlaneItem(e) : (this._navPlans.push(e), i.nextPlan = e, e.lastPlan = i);
      } else this._navPlans.push(e);
    }
    getNextViablePlan() {
      if (console.log("\u7531\u7EE7\u7EED\u5BFC\u822A\u66F4\u6539\u8BA1\u5212\uFF1A"), console.log("\u66F4\u6539\u524D\uFF1A", this._currentPlan.info), this._currentPlan) do this._currentPlanIndex += 1, this._currentPlan = this._navPlans[this._currentPlanIndex]; while (!this._currentPlan.needDraw);
      return console.log("\u66F4\u6539\u540E\uFF1A", this._currentPlan.info), this.currentPlan;
    }
    clear() {
      this._navPlans = [], this._currentPlan = null, this._allSceneMarkers = null;
    }
    get planCount() {
      return this._navPlans.length;
    }
    get plans() {
      return this._navPlans;
    }
    get allSceneMarker() {
      if (!this._allSceneMarkers) {
        this._allSceneMarkers = [];
        let e = this._navPlans[0].startMarker,
          i = this._navPlans[this._navPlans.length - 1].endMarker,
          s = e;
        for (; s != i;) this._allSceneMarkers.push(s), s = s.nextMark;
        this._allSceneMarkers.push(i);
      }
      return this._allSceneMarkers;
    }
    getPlanOfMarkerIndex(e, i) {
      let s = this.currentPlan.getPlanOfMarkerIndex(e);
      return s ? (i && this._currentPlan != s && (console.log("\u7531\u4F4D\u7F6E\u5224\u5B9A\u66F4\u6539\u8BA1\u5212"), console.log("\u5F53\u524D marker:", e, ":", this._allSceneMarkers[e]), console.log("\u66F4\u6539\u524D\uFF1A", this._currentPlan.info), console.log("\u66F4\u6539\u540E\uFF1A", s.info), this._currentPlan = s, this._currentPlanIndex = this._navPlans.indexOf(s)), s) : null;
    }
  }
  class ht {
    constructor(e, i, s) {
      e && (this.code = e), i && (this.name = i), s && (this.mathNumber = s);
    }
  }
  const pt = class {
    constructor() {
      this.defaultFloorInfo = [{
        name: "B3",
        mathNumber: -3
      }, {
        name: "B2",
        mathNumber: -2
      }, {
        name: "B1",
        mathNumber: -1
      }, {
        name: "F1",
        mathNumber: 1
      }, {
        name: "F2",
        mathNumber: 2
      }, {
        name: "F3",
        mathNumber: 3
      }, {
        name: "F4",
        mathNumber: 4
      }, {
        name: "F5",
        mathNumber: 5
      }], this._n2fMap = new Map();
    }
    static get Instance() {
      return this._instance || (this._instance = new pt()), this._instance;
    }
    getFloorFromMathNumber(t) {
      if (this._n2fMap.has(t)) return this._n2fMap.get(t);
      {
        let e = this.createDefaultFlor(t);
        return this._n2fMap.set(t, e), e;
      }
    }
    getFloorFromPosition(t, e, i) {}
    createDefaultFlor(t) {
      let e = this.defaultFloorInfo.find(i => i.mathNumber == t);
      if (e) return new ht(e.code ? e.code : null, e.name, e.mathNumber);
      {
        let i = t > 0 ? "F" + t : "B" + Math.abs(t);
        return new ht(null, i, t);
      }
    }
  };
  let tt = pt;
  tt._instance = null;
  var U = (t => (t.StaticArrow = "StaticArrow", t.MoveArrow = "MoveArrow", t.MeshPlane = "MeshPlane", t.AverageArrowPath = "AverageArrowPath", t.None = "None", t))(U || {}),
    y = (t => (t.None = "None", t.Start = "Start", t.End = "End", t.TurnRight = "TurnRight", t.TurnLeft = "TurnLeft", t.GoUp = "GoUp", t.GoDown = "GoDown", t.GoBack = "GoBack", t.Elevator = "Elevator", t.Stairs = "Stairs", t.Escalator = "Escalator", t))(y || {}),
    C = (t => (t[t.WormholeStart = 0] = "WormholeStart", t[t.WormholeEnd = 1] = "WormholeEnd", t))(C || {});
  class gt {
    constructor(e, i) {
      this._pathLength = null, this._needDraw = null, this._info = null, this._startSceneMarker = e, this._endSceneMarker = i, [y.Elevator, y.Escalator, y.Stairs].includes(e.action) && e.action == i.action && e.floor != i.floor && (e.addTag(C.WormholeStart), i.addTag(C.WormholeEnd));
    }
    get startMarker() {
      return this._startSceneMarker;
    }
    get endMarker() {
      return this._endSceneMarker;
    }
    get sceneMarkers() {
      return this._sceneMarkers || this._refrashPath(), this._sceneMarkers;
    }
    get pathLength() {
      return this._pathLength == null && this._refrashPath(), this._pathLength;
    }
    _refrashPath() {
      this._sceneMarkers = [], this._pathLength = 0;
      let e = this._startSceneMarker;
      for (; e != this._endSceneMarker;) this._sceneMarkers.push(e), this._pathLength += e.distanceToNext, e = e.nextMark;
      this._sceneMarkers.push(e);
    }
    get needDraw() {
      return this._needDraw == null && (this._startSceneMarker.hasTag(C.WormholeStart) && this._endSceneMarker.hasTag(C.WormholeEnd) ? this._needDraw = !1 : this._startSceneMarker.hasTag(C.WormholeEnd) && this._endSceneMarker.hasTag(C.WormholeStart) && this.pathLength < 5 ? this._needDraw = !1 : this._needDraw = !0), this._needDraw;
    }
    get markersCount() {
      return this._sceneMarkers || this._refrashPath(), this._sceneMarkers.length;
    }
    get info() {
      return this._info || (this._info = {
        startFloor: tt.Instance.getFloorFromMathNumber(this._startSceneMarker.floor),
        endFloor: tt.Instance.getFloorFromMathNumber(this._endSceneMarker.floor),
        crossFloor: this._endSceneMarker.floor - this._startSceneMarker.floor,
        startAction: this._startSceneMarker.action,
        endAction: this._endSceneMarker.action,
        pathLength: this.pathLength
      }), this._info;
    }
    mergePlaneItem(e) {
      if (this._endSceneMarker == e._startSceneMarker) {
        let i = this._endSceneMarker;
        this._endSceneMarker = e._endSceneMarker;
        let s = this._needDraw;
        if (this.reset(), s === e.needDraw && (this._needDraw = s, this._needDraw && this._endSceneMarker.break)) for (i.break = !1; i.lastMark && !i.lastMark.break;) i = i.lastMark, i.resetNextBreakMarker();
        return this;
      } else return console.warn("can not merge plan"), null;
    }
    reset() {
      this._sceneMarkers = null, this._needDraw = null, this._pathLength = null;
    }
    get nextPlan() {
      return this._nextPlan;
    }
    set nextPlan(e) {
      this._nextPlan = e;
    }
    get lastPlan() {
      return this._lastPlan;
    }
    set lastPlan(e) {
      this._lastPlan = e;
    }
    get startIndex() {
      return this.lastPlan ? this.lastPlan.endIndex : 0;
    }
    get endIndex() {
      return this.startIndex + this.markersCount - 1;
    }
    getPlanOfMarkerIndex(e) {
      return e >= this.startIndex && e < this.endIndex ? this : e >= this.endIndex ? this.nextPlan ? this.nextPlan.getPlanOfMarkerIndex(e) : this : e < this.startIndex && this.lastPlan ? this.lastPlan.getPlanOfMarkerIndex(e) : null;
    }
  }
  const B = {
      DEG_TO_RAD: Math.PI / 180,
      RAD_TO_DEG: 180 / Math.PI,
      clamp: function (t, e, i) {
        return t >= i ? i : t <= e ? e : t;
      },
      intToBytes24: function (t) {
        const e = t >> 16 & 255,
          i = t >> 8 & 255,
          s = t & 255;
        return [e, i, s];
      },
      intToBytes32: function (t) {
        const e = t >> 24 & 255,
          i = t >> 16 & 255,
          s = t >> 8 & 255,
          a = t & 255;
        return [e, i, s, a];
      },
      bytesToInt24: function (t, e, i) {
        return t.length && (i = t[2], e = t[1], t = t[0]), t << 16 | e << 8 | i;
      },
      bytesToInt32: function (t, e, i, s) {
        return t.length && (s = t[3], i = t[2], e = t[1], t = t[0]), (t << 24 | e << 16 | i << 8 | s) >>> 0;
      },
      lerp: function (t, e, i) {
        return t + (e - t) * B.clamp(i, 0, 1);
      },
      lerpAngle: function (t, e, i) {
        return e - t > 180 && (e -= 360), e - t < -180 && (e += 360), B.lerp(t, e, B.clamp(i, 0, 1));
      },
      powerOfTwo: function (t) {
        return t !== 0 && !(t & t - 1);
      },
      nextPowerOfTwo: function (t) {
        return t--, t |= t >> 1, t |= t >> 2, t |= t >> 4, t |= t >> 8, t |= t >> 16, t++, t;
      },
      random: function (t, e) {
        const i = e - t;
        return Math.random() * i + t;
      },
      smoothstep: function (t, e, i) {
        return i <= t ? 0 : i >= e ? 1 : (i = (i - t) / (e - t), i * i * (3 - 2 * i));
      },
      smootherstep: function (t, e, i) {
        return i <= t ? 0 : i >= e ? 1 : (i = (i - t) / (e - t), i * i * i * (i * (i * 6 - 15) + 10));
      },
      roundUp: function (t, e) {
        return e === 0 ? t : Math.ceil(t / e) * e;
      },
      between: function (t, e, i, s) {
        const a = Math.min(e, i),
          r = Math.max(e, i);
        return s ? t >= a && t <= r : t > a && t < r;
      }
    },
    W = class {
      constructor(t = 0, e = 0) {
        t.length === 2 ? (this.x = t[0], this.y = t[1]) : (this.x = t, this.y = e);
      }
      add(t) {
        return this.x += t.x, this.y += t.y, this;
      }
      add2(t, e) {
        return this.x = t.x + e.x, this.y = t.y + e.y, this;
      }
      addScalar(t) {
        return this.x += t, this.y += t, this;
      }
      clone() {
        return new W(this.x, this.y);
      }
      copy(t) {
        return this.x = t.x, this.y = t.y, this;
      }
      cross(t) {
        return this.x * t.y - this.y * t.x;
      }
      distance(t) {
        const e = this.x - t.x,
          i = this.y - t.y;
        return Math.sqrt(e * e + i * i);
      }
      div(t) {
        return this.x /= t.x, this.y /= t.y, this;
      }
      div2(t, e) {
        return this.x = t.x / e.x, this.y = t.y / e.y, this;
      }
      divScalar(t) {
        return this.x /= t, this.y /= t, this;
      }
      dot(t) {
        return this.x * t.x + this.y * t.y;
      }
      equals(t) {
        return this.x === t.x && this.y === t.y;
      }
      length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      }
      lengthSq() {
        return this.x * this.x + this.y * this.y;
      }
      lerp(t, e, i) {
        return this.x = t.x + i * (e.x - t.x), this.y = t.y + i * (e.y - t.y), this;
      }
      mul(t) {
        return this.x *= t.x, this.y *= t.y, this;
      }
      mul2(t, e) {
        return this.x = t.x * e.x, this.y = t.y * e.y, this;
      }
      mulScalar(t) {
        return this.x *= t, this.y *= t, this;
      }
      normalize() {
        const t = this.x * this.x + this.y * this.y;
        if (t > 0) {
          const e = 1 / Math.sqrt(t);
          this.x *= e, this.y *= e;
        }
        return this;
      }
      floor() {
        return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
      }
      ceil() {
        return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
      }
      round() {
        return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
      }
      min(t) {
        return t.x < this.x && (this.x = t.x), t.y < this.y && (this.y = t.y), this;
      }
      max(t) {
        return t.x > this.x && (this.x = t.x), t.y > this.y && (this.y = t.y), this;
      }
      set(t, e) {
        return this.x = t, this.y = e, this;
      }
      sub(t) {
        return this.x -= t.x, this.y -= t.y, this;
      }
      sub2(t, e) {
        return this.x = t.x - e.x, this.y = t.y - e.y, this;
      }
      subScalar(t) {
        return this.x -= t, this.y -= t, this;
      }
      toString() {
        return `[${this.x}, ${this.y}]`;
      }
      static angleRad(t, e) {
        return Math.atan2(t.x * e.y - t.y * e.x, t.x * e.x + t.y * e.y);
      }
    };
  let L = W;
  L.ZERO = Object.freeze(new W(0, 0)), L.ONE = Object.freeze(new W(1, 1)), L.UP = Object.freeze(new W(0, 1)), L.DOWN = Object.freeze(new W(0, -1)), L.RIGHT = Object.freeze(new W(1, 0)), L.LEFT = Object.freeze(new W(-1, 0));
  const j = class {
    constructor(t = 0, e = 0, i = 0) {
      t.length === 3 ? (this.x = t[0], this.y = t[1], this.z = t[2]) : (this.x = t, this.y = e, this.z = i);
    }
    add(t) {
      return this.x += t.x, this.y += t.y, this.z += t.z, this;
    }
    add2(t, e) {
      return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this;
    }
    addScalar(t) {
      return this.x += t, this.y += t, this.z += t, this;
    }
    clone() {
      return new j(this.x, this.y, this.z);
    }
    copy(t) {
      return this.x = t.x, this.y = t.y, this.z = t.z, this;
    }
    cross(t, e) {
      const i = t.x,
        s = t.y,
        a = t.z,
        r = e.x,
        n = e.y,
        h = e.z;
      return this.x = s * h - n * a, this.y = a * r - h * i, this.z = i * n - r * s, this;
    }
    distance(t) {
      const e = this.x - t.x,
        i = this.y - t.y,
        s = this.z - t.z;
      return Math.sqrt(e * e + i * i + s * s);
    }
    div(t) {
      return this.x /= t.x, this.y /= t.y, this.z /= t.z, this;
    }
    div2(t, e) {
      return this.x = t.x / e.x, this.y = t.y / e.y, this.z = t.z / e.z, this;
    }
    divScalar(t) {
      return this.x /= t, this.y /= t, this.z /= t, this;
    }
    dot(t) {
      return this.x * t.x + this.y * t.y + this.z * t.z;
    }
    equals(t) {
      return this.x === t.x && this.y === t.y && this.z === t.z;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    lerp(t, e, i) {
      return this.x = t.x + i * (e.x - t.x), this.y = t.y + i * (e.y - t.y), this.z = t.z + i * (e.z - t.z), this;
    }
    mul(t) {
      return this.x *= t.x, this.y *= t.y, this.z *= t.z, this;
    }
    mul2(t, e) {
      return this.x = t.x * e.x, this.y = t.y * e.y, this.z = t.z * e.z, this;
    }
    mulScalar(t) {
      return this.x *= t, this.y *= t, this.z *= t, this;
    }
    normalize() {
      const t = this.x * this.x + this.y * this.y + this.z * this.z;
      if (t > 0) {
        const e = 1 / Math.sqrt(t);
        this.x *= e, this.y *= e, this.z *= e;
      }
      return this;
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
    }
    min(t) {
      return t.x < this.x && (this.x = t.x), t.y < this.y && (this.y = t.y), t.z < this.z && (this.z = t.z), this;
    }
    max(t) {
      return t.x > this.x && (this.x = t.x), t.y > this.y && (this.y = t.y), t.z > this.z && (this.z = t.z), this;
    }
    project(t) {
      const e = this.x * t.x + this.y * t.y + this.z * t.z,
        i = t.x * t.x + t.y * t.y + t.z * t.z,
        s = e / i;
      return this.x = t.x * s, this.y = t.y * s, this.z = t.z * s, this;
    }
    set(t, e, i) {
      return this.x = t, this.y = e, this.z = i, this;
    }
    sub(t) {
      return this.x -= t.x, this.y -= t.y, this.z -= t.z, this;
    }
    sub2(t, e) {
      return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this;
    }
    subScalar(t) {
      return this.x -= t, this.y -= t, this.z -= t, this;
    }
    toString() {
      return `[${this.x}, ${this.y}, ${this.z}]`;
    }
  };
  let g = j;
  g.ZERO = Object.freeze(new j(0, 0, 0)), g.ONE = Object.freeze(new j(1, 1, 1)), g.UP = Object.freeze(new j(0, 1, 0)), g.DOWN = Object.freeze(new j(0, -1, 0)), g.RIGHT = Object.freeze(new j(1, 0, 0)), g.LEFT = Object.freeze(new j(-1, 0, 0)), g.FORWARD = Object.freeze(new j(0, 0, -1)), g.BACK = Object.freeze(new j(0, 0, 1));
  const et = class {
    constructor(t = 0, e = 0, i = 0, s = 0) {
      t.length === 4 ? (this.x = t[0], this.y = t[1], this.z = t[2], this.w = t[3]) : (this.x = t, this.y = e, this.z = i, this.w = s);
    }
    add(t) {
      return this.x += t.x, this.y += t.y, this.z += t.z, this.w += t.w, this;
    }
    add2(t, e) {
      return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this.w = t.w + e.w, this;
    }
    addScalar(t) {
      return this.x += t, this.y += t, this.z += t, this.w += t, this;
    }
    clone() {
      return new et(this.x, this.y, this.z, this.w);
    }
    copy(t) {
      return this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w, this;
    }
    div(t) {
      return this.x /= t.x, this.y /= t.y, this.z /= t.z, this.w /= t.w, this;
    }
    div2(t, e) {
      return this.x = t.x / e.x, this.y = t.y / e.y, this.z = t.z / e.z, this.w = t.w / e.w, this;
    }
    divScalar(t) {
      return this.x /= t, this.y /= t, this.z /= t, this.w /= t, this;
    }
    dot(t) {
      return this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w;
    }
    equals(t) {
      return this.x === t.x && this.y === t.y && this.z === t.z && this.w === t.w;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    lerp(t, e, i) {
      return this.x = t.x + i * (e.x - t.x), this.y = t.y + i * (e.y - t.y), this.z = t.z + i * (e.z - t.z), this.w = t.w + i * (e.w - t.w), this;
    }
    mul(t) {
      return this.x *= t.x, this.y *= t.y, this.z *= t.z, this.w *= t.w, this;
    }
    mul2(t, e) {
      return this.x = t.x * e.x, this.y = t.y * e.y, this.z = t.z * e.z, this.w = t.w * e.w, this;
    }
    mulScalar(t) {
      return this.x *= t, this.y *= t, this.z *= t, this.w *= t, this;
    }
    normalize() {
      const t = this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
      if (t > 0) {
        const e = 1 / Math.sqrt(t);
        this.x *= e, this.y *= e, this.z *= e, this.w *= e;
      }
      return this;
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
    }
    min(t) {
      return t.x < this.x && (this.x = t.x), t.y < this.y && (this.y = t.y), t.z < this.z && (this.z = t.z), t.w < this.w && (this.w = t.w), this;
    }
    max(t) {
      return t.x > this.x && (this.x = t.x), t.y > this.y && (this.y = t.y), t.z > this.z && (this.z = t.z), t.w > this.w && (this.w = t.w), this;
    }
    set(t, e, i, s) {
      return this.x = t, this.y = e, this.z = i, this.w = s, this;
    }
    sub(t) {
      return this.x -= t.x, this.y -= t.y, this.z -= t.z, this.w -= t.w, this;
    }
    sub2(t, e) {
      return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this.w = t.w - e.w, this;
    }
    subScalar(t) {
      return this.x -= t, this.y -= t, this.z -= t, this.w -= t, this;
    }
    toString() {
      return `[${this.x}, ${this.y}, ${this.z}, ${this.w}]`;
    }
  };
  let it = et;
  it.ZERO = Object.freeze(new et(0, 0, 0, 0)), it.ONE = Object.freeze(new et(1, 1, 1, 1));
  const X = new L(),
    G = new g(),
    q = new g(),
    V = new g(),
    st = new g(),
    $ = class {
      constructor() {
        const t = new Float32Array(16);
        t[0] = t[5] = t[10] = t[15] = 1, this.data = t;
      }
      static _getPerspectiveHalfSize(t, e, i, s, a) {
        a ? (t.x = s * Math.tan(e * Math.PI / 360), t.y = t.x / i) : (t.y = s * Math.tan(e * Math.PI / 360), t.x = t.y * i);
      }
      add2(t, e) {
        const i = t.data,
          s = e.data,
          a = this.data;
        return a[0] = i[0] + s[0], a[1] = i[1] + s[1], a[2] = i[2] + s[2], a[3] = i[3] + s[3], a[4] = i[4] + s[4], a[5] = i[5] + s[5], a[6] = i[6] + s[6], a[7] = i[7] + s[7], a[8] = i[8] + s[8], a[9] = i[9] + s[9], a[10] = i[10] + s[10], a[11] = i[11] + s[11], a[12] = i[12] + s[12], a[13] = i[13] + s[13], a[14] = i[14] + s[14], a[15] = i[15] + s[15], this;
      }
      add(t) {
        return this.add2(this, t);
      }
      clone() {
        return new $().copy(this);
      }
      copy(t) {
        const e = t.data,
          i = this.data;
        return i[0] = e[0], i[1] = e[1], i[2] = e[2], i[3] = e[3], i[4] = e[4], i[5] = e[5], i[6] = e[6], i[7] = e[7], i[8] = e[8], i[9] = e[9], i[10] = e[10], i[11] = e[11], i[12] = e[12], i[13] = e[13], i[14] = e[14], i[15] = e[15], this;
      }
      equals(t) {
        const e = this.data,
          i = t.data;
        return e[0] === i[0] && e[1] === i[1] && e[2] === i[2] && e[3] === i[3] && e[4] === i[4] && e[5] === i[5] && e[6] === i[6] && e[7] === i[7] && e[8] === i[8] && e[9] === i[9] && e[10] === i[10] && e[11] === i[11] && e[12] === i[12] && e[13] === i[13] && e[14] === i[14] && e[15] === i[15];
      }
      isIdentity() {
        const t = this.data;
        return t[0] === 1 && t[1] === 0 && t[2] === 0 && t[3] === 0 && t[4] === 0 && t[5] === 1 && t[6] === 0 && t[7] === 0 && t[8] === 0 && t[9] === 0 && t[10] === 1 && t[11] === 0 && t[12] === 0 && t[13] === 0 && t[14] === 0 && t[15] === 1;
      }
      mul2(t, e) {
        const i = t.data,
          s = e.data,
          a = this.data,
          r = i[0],
          n = i[1],
          h = i[2],
          o = i[3],
          l = i[4],
          c = i[5],
          d = i[6],
          p = i[7],
          x = i[8],
          _ = i[9],
          k = i[10],
          b = i[11],
          m = i[12],
          M = i[13],
          v = i[14],
          F = i[15];
        let A, w, S, E;
        return A = s[0], w = s[1], S = s[2], E = s[3], a[0] = r * A + l * w + x * S + m * E, a[1] = n * A + c * w + _ * S + M * E, a[2] = h * A + d * w + k * S + v * E, a[3] = o * A + p * w + b * S + F * E, A = s[4], w = s[5], S = s[6], E = s[7], a[4] = r * A + l * w + x * S + m * E, a[5] = n * A + c * w + _ * S + M * E, a[6] = h * A + d * w + k * S + v * E, a[7] = o * A + p * w + b * S + F * E, A = s[8], w = s[9], S = s[10], E = s[11], a[8] = r * A + l * w + x * S + m * E, a[9] = n * A + c * w + _ * S + M * E, a[10] = h * A + d * w + k * S + v * E, a[11] = o * A + p * w + b * S + F * E, A = s[12], w = s[13], S = s[14], E = s[15], a[12] = r * A + l * w + x * S + m * E, a[13] = n * A + c * w + _ * S + M * E, a[14] = h * A + d * w + k * S + v * E, a[15] = o * A + p * w + b * S + F * E, this;
      }
      mulAffine2(t, e) {
        const i = t.data,
          s = e.data,
          a = this.data,
          r = i[0],
          n = i[1],
          h = i[2],
          o = i[4],
          l = i[5],
          c = i[6],
          d = i[8],
          p = i[9],
          x = i[10],
          _ = i[12],
          k = i[13],
          b = i[14];
        let m, M, v;
        return m = s[0], M = s[1], v = s[2], a[0] = r * m + o * M + d * v, a[1] = n * m + l * M + p * v, a[2] = h * m + c * M + x * v, a[3] = 0, m = s[4], M = s[5], v = s[6], a[4] = r * m + o * M + d * v, a[5] = n * m + l * M + p * v, a[6] = h * m + c * M + x * v, a[7] = 0, m = s[8], M = s[9], v = s[10], a[8] = r * m + o * M + d * v, a[9] = n * m + l * M + p * v, a[10] = h * m + c * M + x * v, a[11] = 0, m = s[12], M = s[13], v = s[14], a[12] = r * m + o * M + d * v + _, a[13] = n * m + l * M + p * v + k, a[14] = h * m + c * M + x * v + b, a[15] = 1, this;
      }
      mul(t) {
        return this.mul2(this, t);
      }
      transformPoint(t, e = new g()) {
        const i = this.data,
          s = t.x,
          a = t.y,
          r = t.z;
        return e.x = s * i[0] + a * i[4] + r * i[8] + i[12], e.y = s * i[1] + a * i[5] + r * i[9] + i[13], e.z = s * i[2] + a * i[6] + r * i[10] + i[14], e;
      }
      transformVector(t, e = new g()) {
        const i = this.data,
          s = t.x,
          a = t.y,
          r = t.z;
        return e.x = s * i[0] + a * i[4] + r * i[8], e.y = s * i[1] + a * i[5] + r * i[9], e.z = s * i[2] + a * i[6] + r * i[10], e;
      }
      transformVec4(t, e = new it()) {
        const i = this.data,
          s = t.x,
          a = t.y,
          r = t.z,
          n = t.w;
        return e.x = s * i[0] + a * i[4] + r * i[8] + n * i[12], e.y = s * i[1] + a * i[5] + r * i[9] + n * i[13], e.z = s * i[2] + a * i[6] + r * i[10] + n * i[14], e.w = s * i[3] + a * i[7] + r * i[11] + n * i[15], e;
      }
      setLookAt(t, e, i) {
        V.sub2(t, e).normalize(), q.copy(i).normalize(), G.cross(q, V).normalize(), q.cross(V, G);
        const s = this.data;
        return s[0] = G.x, s[1] = G.y, s[2] = G.z, s[3] = 0, s[4] = q.x, s[5] = q.y, s[6] = q.z, s[7] = 0, s[8] = V.x, s[9] = V.y, s[10] = V.z, s[11] = 0, s[12] = t.x, s[13] = t.y, s[14] = t.z, s[15] = 1, this;
      }
      setFrustum(t, e, i, s, a, r) {
        const n = 2 * a,
          h = e - t,
          o = s - i,
          l = r - a,
          c = this.data;
        return c[0] = n / h, c[1] = 0, c[2] = 0, c[3] = 0, c[4] = 0, c[5] = n / o, c[6] = 0, c[7] = 0, c[8] = (e + t) / h, c[9] = (s + i) / o, c[10] = (-r - a) / l, c[11] = -1, c[12] = 0, c[13] = 0, c[14] = -n * r / l, c[15] = 0, this;
      }
      setPerspective(t, e, i, s, a) {
        return $._getPerspectiveHalfSize(X, t, e, i, a), this.setFrustum(-X.x, X.x, -X.y, X.y, i, s);
      }
      setOrtho(t, e, i, s, a, r) {
        const n = this.data;
        return n[0] = 2 / (e - t), n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = 2 / (s - i), n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = -2 / (r - a), n[11] = 0, n[12] = -(e + t) / (e - t), n[13] = -(s + i) / (s - i), n[14] = -(r + a) / (r - a), n[15] = 1, this;
      }
      setFromAxisAngle(t, e) {
        e *= B.DEG_TO_RAD;
        const i = t.x,
          s = t.y,
          a = t.z,
          r = Math.cos(e),
          n = Math.sin(e),
          h = 1 - r,
          o = h * i,
          l = h * s,
          c = this.data;
        return c[0] = o * i + r, c[1] = o * s + n * a, c[2] = o * a - n * s, c[3] = 0, c[4] = o * s - n * a, c[5] = l * s + r, c[6] = l * a + n * i, c[7] = 0, c[8] = o * a + n * s, c[9] = l * a - i * n, c[10] = h * a * a + r, c[11] = 0, c[12] = 0, c[13] = 0, c[14] = 0, c[15] = 1, this;
      }
      setTranslate(t, e, i) {
        const s = this.data;
        return s[0] = 1, s[1] = 0, s[2] = 0, s[3] = 0, s[4] = 0, s[5] = 1, s[6] = 0, s[7] = 0, s[8] = 0, s[9] = 0, s[10] = 1, s[11] = 0, s[12] = t, s[13] = e, s[14] = i, s[15] = 1, this;
      }
      setScale(t, e, i) {
        const s = this.data;
        return s[0] = t, s[1] = 0, s[2] = 0, s[3] = 0, s[4] = 0, s[5] = e, s[6] = 0, s[7] = 0, s[8] = 0, s[9] = 0, s[10] = i, s[11] = 0, s[12] = 0, s[13] = 0, s[14] = 0, s[15] = 1, this;
      }
      setViewport(t, e, i, s) {
        const a = this.data;
        return a[0] = i * .5, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = s * .5, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = .5, a[11] = 0, a[12] = t + i * .5, a[13] = e + s * .5, a[14] = .5, a[15] = 1, this;
      }
      invert() {
        const t = this.data,
          e = t[0],
          i = t[1],
          s = t[2],
          a = t[3],
          r = t[4],
          n = t[5],
          h = t[6],
          o = t[7],
          l = t[8],
          c = t[9],
          d = t[10],
          p = t[11],
          x = t[12],
          _ = t[13],
          k = t[14],
          b = t[15],
          m = e * n - i * r,
          M = e * h - s * r,
          v = e * o - a * r,
          F = i * h - s * n,
          A = i * o - a * n,
          w = s * o - a * h,
          S = l * _ - c * x,
          E = l * k - d * x,
          Z = l * b - p * x,
          Q = c * k - d * _,
          J = c * b - p * _,
          K = d * b - p * k,
          zt = m * K - M * J + v * Q + F * Z - A * E + w * S;
        if (zt === 0) this.setIdentity();else {
          const T = 1 / zt;
          t[0] = (n * K - h * J + o * Q) * T, t[1] = (-i * K + s * J - a * Q) * T, t[2] = (_ * w - k * A + b * F) * T, t[3] = (-c * w + d * A - p * F) * T, t[4] = (-r * K + h * Z - o * E) * T, t[5] = (e * K - s * Z + a * E) * T, t[6] = (-x * w + k * v - b * M) * T, t[7] = (l * w - d * v + p * M) * T, t[8] = (r * J - n * Z + o * S) * T, t[9] = (-e * J + i * Z - a * S) * T, t[10] = (x * A - _ * v + b * m) * T, t[11] = (-l * A + c * v - p * m) * T, t[12] = (-r * Q + n * E - h * S) * T, t[13] = (e * Q - i * E + s * S) * T, t[14] = (-x * F + _ * M - k * m) * T, t[15] = (l * F - c * M + d * m) * T;
        }
        return this;
      }
      set(t) {
        const e = this.data;
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], this;
      }
      setIdentity() {
        const t = this.data;
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
      }
      setTRS(t, e, i) {
        const s = e.x,
          a = e.y,
          r = e.z,
          n = e.w,
          h = i.x,
          o = i.y,
          l = i.z,
          c = s + s,
          d = a + a,
          p = r + r,
          x = s * c,
          _ = s * d,
          k = s * p,
          b = a * d,
          m = a * p,
          M = r * p,
          v = n * c,
          F = n * d,
          A = n * p,
          w = this.data;
        return w[0] = (1 - (b + M)) * h, w[1] = (_ + A) * h, w[2] = (k - F) * h, w[3] = 0, w[4] = (_ - A) * o, w[5] = (1 - (x + M)) * o, w[6] = (m + v) * o, w[7] = 0, w[8] = (k + F) * l, w[9] = (m - v) * l, w[10] = (1 - (x + b)) * l, w[11] = 0, w[12] = t.x, w[13] = t.y, w[14] = t.z, w[15] = 1, this;
      }
      transpose() {
        let t;
        const e = this.data;
        return t = e[1], e[1] = e[4], e[4] = t, t = e[2], e[2] = e[8], e[8] = t, t = e[3], e[3] = e[12], e[12] = t, t = e[6], e[6] = e[9], e[9] = t, t = e[7], e[7] = e[13], e[13] = t, t = e[11], e[11] = e[14], e[14] = t, this;
      }
      invertTo3x3(t) {
        const e = this.data,
          i = t.data,
          s = e[0],
          a = e[1],
          r = e[2],
          n = e[4],
          h = e[5],
          o = e[6],
          l = e[8],
          c = e[9],
          d = e[10],
          p = d * h - o * c,
          x = -d * a + r * c,
          _ = o * a - r * h,
          k = -d * n + o * l,
          b = d * s - r * l,
          m = -o * s + r * n,
          M = c * n - h * l,
          v = -c * s + a * l,
          F = h * s - a * n,
          A = s * p + a * k + r * M;
        if (A === 0) return this;
        const w = 1 / A;
        return i[0] = w * p, i[1] = w * x, i[2] = w * _, i[3] = w * k, i[4] = w * b, i[5] = w * m, i[6] = w * M, i[7] = w * v, i[8] = w * F, this;
      }
      getTranslation(t = new g()) {
        return t.set(this.data[12], this.data[13], this.data[14]);
      }
      getX(t = new g()) {
        return t.set(this.data[0], this.data[1], this.data[2]);
      }
      getY(t = new g()) {
        return t.set(this.data[4], this.data[5], this.data[6]);
      }
      getZ(t = new g()) {
        return t.set(this.data[8], this.data[9], this.data[10]);
      }
      getScale(t = new g()) {
        return this.getX(G), this.getY(q), this.getZ(V), t.set(G.length(), q.length(), V.length()), t;
      }
      setFromEulerAngles(t, e, i) {
        t *= B.DEG_TO_RAD, e *= B.DEG_TO_RAD, i *= B.DEG_TO_RAD;
        const s = Math.sin(-t),
          a = Math.cos(-t),
          r = Math.sin(-e),
          n = Math.cos(-e),
          h = Math.sin(-i),
          o = Math.cos(-i),
          l = this.data;
        return l[0] = n * o, l[1] = -n * h, l[2] = r, l[3] = 0, l[4] = a * h + o * s * r, l[5] = a * o - s * r * h, l[6] = -n * s, l[7] = 0, l[8] = s * h - a * o * r, l[9] = o * s + a * r * h, l[10] = a * n, l[11] = 0, l[12] = 0, l[13] = 0, l[14] = 0, l[15] = 1, this;
      }
      getEulerAngles(t = new g()) {
        this.getScale(st);
        const e = st.x,
          i = st.y,
          s = st.z;
        if (e === 0 || i === 0 || s === 0) return t.set(0, 0, 0);
        const a = this.data,
          r = Math.asin(-a[2] / e),
          n = Math.PI * .5;
        let h, o;
        return r < n ? r > -n ? (h = Math.atan2(a[6] / i, a[10] / s), o = Math.atan2(a[1] / e, a[0] / e)) : (o = 0, h = -Math.atan2(a[4] / i, a[5] / i)) : (o = 0, h = Math.atan2(a[4] / i, a[5] / i)), t.set(h, r, o).mulScalar(B.RAD_TO_DEG);
      }
      toString() {
        return "[" + this.data.join(", ") + "]";
      }
    };
  let I = $;
  I.IDENTITY = Object.freeze(new $()), I.ZERO = Object.freeze(new $().set([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
  const Pt = {
    create: function () {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (t) {
        const e = Math.random() * 16 | 0;
        return (t === "x" ? e : e & 3 | 8).toString(16);
      });
    }
  };
  class O {
    constructor(e, i = y.None) {
      this._break = !1, this._floor = null, this._tags = new Set(), this._position = e, this._id = Pt.create(), i != y.None && (this._action = i);
    }
    get id() {
      return this._id;
    }
    get action() {
      if (!this._action) if (!this.lastMark) this._action = y.Start;else if (!this.nextMark) this._action = y.End;else {
        let e = new I().setLookAt(new g(), this._fromDir, g.UP).invert().mul(new I().setTranslate(this._toDir.x, this._toDir.y, this._toDir.z)).getTranslation();
        e.x >= .7 ? this._action = y.TurnRight : e.x <= -.7 ? this._action = y.TurnLeft : e.y >= .34 ? this._action = y.GoUp : e.y <= -.34 ? this._action = y.GoDown : e.z > .7 ? this._action = y.GoBack : this._action = y.None;
      }
      return this._action;
    }
    set action(e) {
      this._action = e, (this._action == y.Elevator || this._action == y.Escalator) && (this._break = !0);
    }
    get nextMark() {
      return this._nextMark;
    }
    set nextMark(e) {
      this._nextMark = e, e ? this._toDir = new g().sub2(e.position, this.position).normalize() : this._toDir = null;
    }
    get lastMark() {
      return this._lastMark;
    }
    set lastMark(e) {
      this._lastMark = e, e ? this._fromDir = new g().sub2(this.position, e.position).normalize() : this._fromDir = null;
    }
    get position() {
      return this._position;
    }
    get fromDir() {
      return this._fromDir || (this._fromDir = this._toDir.clone().mulScalar(-1)), this._fromDir;
    }
    get toDir() {
      return this._toDir || (this._toDir = this._fromDir.clone().mulScalar(-1)), this._toDir;
    }
    get forward() {
      return this._forward || (this._fromDir && this._toDir ? this._forward = new g().add2(this._fromDir, this._toDir).normalize() : this._fromDir ? this._forward = this._fromDir.clone() : this._toDir && (this._forward = this._toDir.clone())), this._forward;
    }
    get distanceFromStart() {
      return this._distanceFromStart || (this.lastMark ? this._distanceFromStart = this.lastMark.distanceFromStart + this.lastMark.distanceToNext : this._distanceFromStart = 0), this._distanceFromStart;
    }
    get distanceToNext() {
      return this._distanceToNext || (this._nextMark ? this._distanceToNext = this.position.distance(this._nextMark.position) : this._distanceToNext = 0), this._distanceToNext;
    }
    get distanceToEnd() {
      return this._distanceToEnd || (this._nextMark ? this._distanceToEnd = this.distanceToNext + this._nextMark.distanceToEnd : this._distanceToEnd = 0), this._distanceToEnd;
    }
    get pose() {
      return this._pose || (this._pose = new I().setLookAt(this.position, this.position.clone().add(this.forward), g.UP)), this._pose;
    }
    set break(e) {
      this._break = e;
    }
    get break() {
      return this._break;
    }
    set floor(e) {
      this._floor = e;
    }
    get floor() {
      return this._floor == null && (this.lastMark ? this._floor = this.lastMark.floor : this._floor = 0), this._floor;
    }
    inArea(e, i, s = null, a = null) {
      s === null && (s = -i / 2), a === null && (a = i / 2);
      let r = new g();
      if (this._toDir) return r = new I().setLookAt(this.position, this.position.clone().add(this._toDir), g.UP).invert().mul(new I().setTranslate(e.x, e.y, e.z)).getTranslation(), {
        inArea: r.x >= s && r.x <= a && r.y >= -1 && r.y <= 4 && (r.z <= 0 && r.z >= -this.distanceToNext || new L(r.x, r.z).length() <= i / 2),
        zLen: r.z <= 0 ? -r.z : 0,
        xLen: r.x,
        yLen: r.y
      };
      {
        let n = new L(e.x, e.z).distance(new L(this.position.x, this.position.z));
        return {
          inArea: e.y - this.position.y >= -1 && e.y - this.position.y <= 4 && n <= i / 2,
          zLen: 0,
          xLen: n
        };
      }
    }
    getMarkerIndexOfDistance(e, i) {
      return this.nextMark ? this.distanceToNext >= e ? ++i : this.nextMark.getMarkerIndexOfDistance(e - this.distanceToNext, ++i) : i;
    }
    getNextAction() {
      if (this._nextAction && this._nextAction != y.None) return {
        action: this._nextAction,
        distance: this._nextActionDistance
      };
      if (!this.nextMark) return {
        action: y.End,
        distance: 0
      };
      if (this.nextMark.action != y.None) return this._nextAction = this.nextMark.action, this._nextActionDistance = this.distanceToNext, {
        action: this._nextAction,
        distance: this._nextActionDistance
      };
      {
        let {
          action: e,
          distance: i
        } = this.nextMark.getNextAction();
        return this._nextActionDistance = this.distanceToNext + i, this._nextAction = e, {
          action: this._nextAction,
          distance: this._nextActionDistance
        };
      }
    }
    getNextBreakMarker() {
      if (this._nextBreakMarker) return {
        breakMarker: this._nextBreakMarker,
        distance: this._nextBreakDistance
      };
      if (!this.nextMark) return this.break = !0, this._nextBreakMarker = this, this._nextBreakDistance = 0, {
        breakMarker: this._nextBreakMarker,
        distance: this._nextBreakDistance
      };
      if (this.nextMark.break) return this._nextBreakMarker = this.nextMark, this._nextBreakDistance = this.distanceToNext, {
        breakMarker: this._nextBreakMarker,
        distance: this._nextBreakDistance
      };
      {
        let {
          breakMarker: e,
          distance: i
        } = this.nextMark.getNextBreakMarker();
        return this._nextBreakDistance = this.distanceToNext + i, this._nextBreakMarker = e, {
          breakMarker: this._nextBreakMarker,
          distance: this._nextBreakDistance
        };
      }
    }
    getPositionInRoute(e, i) {
      let s = e - this.distanceFromStart;
      return s >= 0 && s < this.distanceToNext ? i ? this.getBazerPosition(s) : new g().add2(this.position, this._toDir.clone().mulScalar(s)) : s >= 0 && s >= this.distanceToNext ? this.nextMark ? this.nextMark.getPositionInRoute(e, i) : this.position : this.lastMark ? this.lastMark.getPositionInRoute(e, i) : this.position;
    }
    getBazerPosition(e) {
      const i = e / this.distanceToNext,
        s = this.position.clone(),
        a = new g().add2(this.position, this.forward),
        r = new g().sub2(this.nextMark.position, this.nextMark.forward),
        n = this.nextMark.position.clone();
      return s.mulScalar(Math.pow(1 - i, 3)).add(a.mulScalar(3 * i * Math.pow(1 - i, 2))).add(r.mulScalar(3 * Math.pow(i, 2) * (1 - i))).add(n.mulScalar(Math.pow(i, 3)));
    }
    addTag(e) {
      this._tags.add(e);
    }
    removeTag(e) {
      this._tags.delete(e);
    }
    hasTag(e) {
      return this._tags.has(e);
    }
    get distanceToNextBreak() {
      return this.getNextBreakMarker(), this._nextBreakDistance;
    }
    resetNextBreakMarker() {
      this._nextBreakMarker = null, this._nextBreakDistance = null;
    }
  }
  class f {
    constructor() {
      this._bestArrowDistance = 5, this._currentRouteIndex = -1, this._checkInRouteMaxCount = 5;
    }
    get routeWidth() {
      return this._routeWidth;
    }
    set routeWidth(e) {
      this._routeWidth = e;
    }
    get bestArrowDistance() {
      return this._bestArrowDistance;
    }
    set bestArrowDistance(e) {
      this._bestArrowDistance = e;
    }
    get checkInRouteMaxCount() {
      return this._checkInRouteMaxCount;
    }
    set checkInRouteMaxCount(e) {
      this._checkInRouteMaxCount = e;
    }
    static get Instance() {
      return this._instance || (this._instance = new f()), this._instance;
    }
    get navPlanManager() {
      return this._navPlanManager || (this._navPlanManager = new dt()), this._navPlanManager;
    }
    setRoutePlane(e, i, s) {
      !i || i.length <= 0 || (this._rawRoute = i, this.navPlanManager.clear(), this._creatSceneMarkerRoutePlanes(this._rawRoute, e, s), this._sceneMarkerRoute = this.navPlanManager.allSceneMarker, console.log("3d: sceneMarkers:", this._sceneMarkerRoute), this._currentRouteIndex = 0);
    }
    _refineRoute(e, i, s) {
      let a = [],
        r = e.map(l => new g(l.position.x, l.position.y, l.position.z)),
        n = new g(i.x, r[0].y, i.z);
      if (r.length >= 2) {
        const l = new g(r[0].x, r[0].y, r[0].z),
          c = new g(r[1].x, r[1].y, r[1].z),
          d = new I().setLookAt(l, c, g.UP).invert().mul(new I().setTranslate(n.x, n.y, n.z)).getTranslation();
        if (d.z < 0 && (r.shift(), e.shift(), Math.abs(d.x) > this._routeWidth / 2 && l.distance(c) + d.z > this._bestArrowDistance)) {
          const p = l.add(new g().sub2(c, l).normalize().mulScalar(-d.z));
          r.unshift(p), e.unshift({
            id: "",
            name: "",
            position: {
              x: p.x,
              y: p.y,
              z: p.z
            }
          });
        }
      }
      if (r.unshift(n), e.unshift({
        id: "",
        name: "start",
        position: {
          x: n.x,
          y: n.y,
          z: n.z
        }
      }), s) {
        let l = new g(s.x, r[r.length - 1].y, s.z);
        if (r.length >= 2) {
          const c = new g(r[r.length - 1].x, r[r.length - 1].y, r[r.length - 1].z),
            d = new g(r[r.length - 2].x, r[r.length - 2].y, r[r.length - 2].z),
            p = new I().setLookAt(c, d, g.UP).invert().mul(new I().setTranslate(l.x, l.y, l.z)).getTranslation();
          if (p.z < 0 && (r.pop(), Math.abs(p.x) > this._routeWidth / 2 && c.distance(d) + p.z > this._bestArrowDistance)) {
            const x = c.add(new g().sub2(d, c).normalize().mulScalar(-p.z));
            r.push(x), e.push({
              id: "",
              name: "",
              position: {
                x: x.x,
                y: x.y,
                z: x.z
              }
            });
          }
        }
        r.push(l), e.push({
          id: "",
          name: "end",
          position: {
            x: l.x,
            y: l.y,
            z: l.z
          }
        });
      }
      console.log("3d: posint len", r.length, "  route len:", e.length);
      let h = l => {
        let c = null;
        return l.name && (l.name.toLocaleLowerCase().indexOf("elevator") >= 0 ? c = y.Elevator : l.name.toLocaleLowerCase().indexOf("stairs") >= 0 ? c = y.Stairs : l.name.toLocaleLowerCase().indexOf("escalator") >= 0 && (c = y.Escalator)), c;
      };
      a.push(new O(r[r.length - 1], h(e[r.length - 1])));
      let o = r[r.length - 1];
      for (let l = r.length - 2; l >= 0; l--) {
        let c = h(e[l]),
          d = o.distance(r[l]);
        if (Math.abs(d - this._bestArrowDistance) < this._bestArrowDistance * .382) {
          let p = new O(r[l], c);
          p.nextMark = a[a.length - 1], a[a.length - 1].lastMark = p, a.push(p), o = r[l];
        } else if (d < this._bestArrowDistance) {
          if (e[l].name) {
            let p = new O(r[l], c);
            p.nextMark = a[a.length - 1], a[a.length - 1].lastMark = p, a.push(p), o = r[l];
          } else if (l != 0) {
            const p = r[l].clone().sub(o.clone()).normalize(),
              x = r[l - 1].clone().sub(r[l].clone()).normalize();
            if (p.dot(x) < .866) {
              let _ = new O(r[l], c);
              _.nextMark = a[a.length - 1], a[a.length - 1].lastMark = _, a.push(_), o = r[l];
            }
          }
        } else if (d > this._bestArrowDistance) {
          const p = r[l].clone().sub(o.clone()).normalize();
          let x = new g().add2(o.clone(), p.clone().mulScalar(this._bestArrowDistance)),
            _ = new O(x, c);
          _.nextMark = a[a.length - 1], a[a.length - 1].lastMark = _, a.push(_), o = x, l++;
        }
      }
      return a.reverse();
    }
    _creatSceneMarkerRoutePlanes(e, i, s) {
      let a = null,
        r = null;
      for (let p = 0; p < e.length; p++) {
        let x = this._addSceneMarker(e[p], r, a);
        a == null && (a = x), r = x;
      }
      let n = a.floor,
        h = new g(i.x, e[0].position.y, i.z);
      if (e.length >= 2) {
        const p = new g(e[0].position.x, e[0].position.y, e[0].position.z),
          x = new g(e[1].position.x, e[1].position.y, e[1].position.z),
          _ = new I().setLookAt(p, x, g.UP).invert().mul(new I().setTranslate(h.x, h.y, h.z)).getTranslation();
        if (_.z < 0 && (a = a.nextMark, a.lastMark = null, console.log("remove head Marker"), Math.abs(_.x) > this._routeWidth / 2 && p.distance(x) + _.z > this._bestArrowDistance)) {
          const k = p.add(new g().sub2(x, p).normalize().mulScalar(-_.z));
          let b = new O(k);
          b.nextMark = a, a.lastMark = b, a = a.lastMark, console.log("add an marker in head");
        }
      }
      let o = new O(h, y.Start);
      if (o.floor = n, o.nextMark = a, a.lastMark = o, a = a.lastMark, console.log("add camera marker as start"), s) {
        let p = new g(s.x, e[e.length - 1].position.y, s.z);
        if (e.length >= 2) {
          const _ = new g(e[e.length - 1].position.x, e[e.length - 1].position.y, e[e.length - 1].position.z),
            k = new g(e[e.length - 2].position.x, e[e.length - 2].position.y, e[e.length - 2].position.z),
            b = new I().setLookAt(_, k, g.UP).invert().mul(new I().setTranslate(p.x, p.y, p.z)).getTranslation();
          if (b.z < 0 && (r = r.lastMark, r.nextMark = null, console.log("remove tail marker"), Math.abs(b.x) > this._routeWidth / 2 && _.distance(k) + b.z > this._bestArrowDistance)) {
            const m = _.add(new g().sub2(k, _).normalize().mulScalar(-b.z));
            let M = new O(m);
            M.lastMark = r, r.nextMark = M, r = r.nextMark, console.log("add a marker in tail");
          }
        }
        let x = new O(p, y.End);
        x.lastMark = r, r.nextMark = x, r = r.nextMark, console.log("add target as end marker");
      }
      let l = a;
      for (; l.nextMark;) l = l.nextMark;
      let c = a,
        d = [];
      do {
        let p = c.getNextBreakMarker();
        d.push(new gt(c, p.breakMarker)), c = p.breakMarker;
      } while (c != r);
      d.forEach(p => {
        this.navPlanManager.addPlan(p);
      }), console.log("nav plan:", this.navPlanManager.plans), console.log("plan length:", this.navPlanManager.planCount);
    }
    _addSceneMarker(e, i, s) {
      let a = o => {
        let l = null;
        return o.toLocaleLowerCase().indexOf("elevator") >= 0 ? l = y.Elevator : o.toLocaleLowerCase().indexOf("stairs") >= 0 ? l = y.Stairs : o.toLocaleLowerCase().indexOf("escalator") >= 0 && (l = y.Escalator), l;
      };
      const {
          name: r,
          position: n
        } = e,
        h = new O(new g(n.x, n.y, n.z));
      if (e.properties && e.properties["EasyARWenLv:LuWangExtension"]) {
        const {
          floor: o,
          tag: l,
          isBreak: c
        } = e.properties["EasyARWenLv:LuWangExtension"];
        h.break = c;
        const d = a(l);
        h.action = d, h.floor = o, s && s.floor == 0 && (s.floor = o);
      } else {
        const o = a(r);
        h.action = o;
      }
      return e.floor && (h.floor = e.floor), e.isBreak && (h.break = e.isBreak), i && (h.lastMark = i, i.nextMark = h), h;
    }
    getRoute(e, i) {
      if (!this._sceneMarkerRoute || this._sceneMarkerRoute.length <= 0) return null;
      let s = {},
        a = this._checkInRouteMaxCount;
      if (this._checkInRoute(e, this._currentRouteIndex, a, s)) {
        this._currentRouteIndex = s.markerIndex;
        const r = this._sceneMarkerRoute[this._currentRouteIndex];
        let n = this.navPlanManager.getPlanOfMarkerIndex(this._currentRouteIndex, !0);
        if (!n) {
          console.error("\u5F53\u524Dmarker\u4E0D\u5C5E\u4E8E\u4EFB\u4F55plan");
          debugger;
        }
        const h = {
          distanceFromStart: -1,
          distanceFromLastBreak: -1,
          distanceToEnd: -1,
          distanceToNextBreak: -1,
          nextAction: y.None,
          distanceToNextAction: -1,
          offsetFirstMark: 0,
          inBreak: !1,
          route: []
        };
        let o;
        h.distanceToEnd = r.distanceToEnd - s.zLen, h.distanceFromStart = this._sceneMarkerRoute[0].distanceToEnd - h.distanceToEnd, h.distanceToNextBreak = r.distanceToNextBreak - s.zLen, h.distanceFromLastBreak = n ? n.pathLength - h.distanceToNextBreak : 0;
        let {
          action: l,
          distance: c
        } = r.getNextAction();
        return h.nextAction = l, h.distanceToNextAction = c - s.zLen, h.offsetFirstMark = s.zLen, h.inBreak = n ? !n.needDraw : !0, h.distanceToNextBreak <= i || i == -1 ? n ? o = this._sceneMarkerRoute.slice(this._currentRouteIndex, n.endIndex + 1) : o = this._sceneMarkerRoute.slice(this._currentRouteIndex, r.getMarkerIndexOfDistance(i, this._currentRouteIndex) + 1) : o = this._sceneMarkerRoute.slice(this._currentRouteIndex, r.getMarkerIndexOfDistance(i, this._currentRouteIndex) + 1), h.route = o, h;
      } else return null;
    }
    getPositionInRoute(e, i = !1) {
      return this._sceneMarkerRoute ? this._sceneMarkerRoute[this._currentRouteIndex].getPositionInRoute(e, i) : null;
    }
    _checkInRoute(e, i, s, a = {}, r = "b") {
      if (!this._sceneMarkerRoute || i < 0 || i >= this._sceneMarkerRoute.length || s <= 0) return !1;
      s--;
      const n = this._sceneMarkerRoute[i];
      n.break && (r = "r");
      let h = this._sceneMarkerRoute[i].inArea(e, this._routeWidth);
      if (a.markerIndex = i, a.zLen = h.zLen, a.xLen = h.xLen, h.inArea) {
        let o = {
          markerIndex: -1,
          zLen: -1,
          xLen: -1
        };
        return n.nextMark && n.nextMark.break || this._checkInRoute(e, i + 1, 2, o, "r") && Math.abs(o.xLen) < Math.abs(a.xLen) && (a.markerIndex = o.markerIndex, a.zLen = o.zLen, a.xLen = o.xLen), !0;
      } else {
        if (r == "b") return this._checkInRoute(e, i + 1, s, a, "r") || this._checkInRoute(e, i - 1, s, a, "l");
        if (r == "r") return this._checkInRoute(e, i + 1, s, a, "r");
        if (r == "l") return this._checkInRoute(e, i - 1, s, a, "l");
      }
    }
    clear() {
      this._rawRoute = null, this._sceneMarkerRoute = null, this._currentRouteIndex = -1, this._navPlanManager = null;
    }
    get routeLength() {
      return this._sceneMarkerRoute.length ? this._sceneMarkerRoute[0].distanceToEnd : 0;
    }
    get currentPlanBreakFromStart() {
      return this.navPlanManager.currentPlan.endMarker.distanceFromStart;
    }
    getMarker(e) {
      if (e >= 0 && e <= this._sceneMarkerRoute.length - 1) return this._sceneMarkerRoute[e];
      console.error("get marker index out of length");
    }
    get markerCount() {
      return this._sceneMarkerRoute.length;
    }
    get matkers() {
      return this._sceneMarkerRoute;
    }
    getBrekInfo() {
      if (this._navPlanManager.currentPlan.needDraw) {
        if (this._navPlanManager.currentPlan.nextPlan && !this._navPlanManager.currentPlan.nextPlan.needDraw) return this._navPlanManager.currentPlan.nextPlan.info;
      } else return this._navPlanManager.currentPlan.info;
    }
    setNextRoutePlan() {
      let e = this.navPlanManager.getNextViablePlan();
      console.log("\u8BBE\u7F6E\u5F53\u524Dmarker \u4E3A\uFF1A", e.startIndex, e.startMarker), this._currentRouteIndex = e.startIndex;
    }
  }
  const at = class {
    constructor() {
      const t = new Float32Array(9);
      t[0] = t[4] = t[8] = 1, this.data = t;
    }
    clone() {
      return new at().copy(this);
    }
    copy(t) {
      const e = t.data,
        i = this.data;
      return i[0] = e[0], i[1] = e[1], i[2] = e[2], i[3] = e[3], i[4] = e[4], i[5] = e[5], i[6] = e[6], i[7] = e[7], i[8] = e[8], this;
    }
    set(t) {
      const e = this.data;
      return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], this;
    }
    equals(t) {
      const e = this.data,
        i = t.data;
      return e[0] === i[0] && e[1] === i[1] && e[2] === i[2] && e[3] === i[3] && e[4] === i[4] && e[5] === i[5] && e[6] === i[6] && e[7] === i[7] && e[8] === i[8];
    }
    isIdentity() {
      const t = this.data;
      return t[0] === 1 && t[1] === 0 && t[2] === 0 && t[3] === 0 && t[4] === 1 && t[5] === 0 && t[6] === 0 && t[7] === 0 && t[8] === 1;
    }
    setIdentity() {
      const t = this.data;
      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, this;
    }
    toString() {
      return "[" + this.data.join(", ") + "]";
    }
    transpose() {
      const t = this.data;
      let e;
      return e = t[1], t[1] = t[3], t[3] = e, e = t[2], t[2] = t[6], t[6] = e, e = t[5], t[5] = t[7], t[7] = e, this;
    }
    setFromMat4(t) {
      const e = t.data,
        i = this.data;
      return i[0] = e[0], i[1] = e[1], i[2] = e[2], i[3] = e[4], i[4] = e[5], i[5] = e[6], i[6] = e[8], i[7] = e[9], i[8] = e[10], this;
    }
    transformVector(t, e = new g()) {
      const i = this.data,
        s = t.x,
        a = t.y,
        r = t.z;
      return e.x = s * i[0] + a * i[3] + r * i[6], e.y = s * i[1] + a * i[4] + r * i[7], e.z = s * i[2] + a * i[5] + r * i[8], e;
    }
  };
  let ot = at;
  ot.IDENTITY = Object.freeze(new at()), ot.ZERO = Object.freeze(new at().set([0, 0, 0, 0, 0, 0, 0, 0, 0]));
  const rt = class {
    constructor(t = 0, e = 0, i = 0, s = 1) {
      t.length === 4 ? (this.x = t[0], this.y = t[1], this.z = t[2], this.w = t[3]) : (this.x = t, this.y = e, this.z = i, this.w = s);
    }
    clone() {
      return new rt(this.x, this.y, this.z, this.w);
    }
    conjugate() {
      return this.x *= -1, this.y *= -1, this.z *= -1, this;
    }
    copy(t) {
      return this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w, this;
    }
    equals(t) {
      return this.x === t.x && this.y === t.y && this.z === t.z && this.w === t.w;
    }
    getAxisAngle(t) {
      let e = Math.acos(this.w) * 2;
      const i = Math.sin(e / 2);
      return i !== 0 ? (t.x = this.x / i, t.y = this.y / i, t.z = this.z / i, (t.x < 0 || t.y < 0 || t.z < 0) && (t.x *= -1, t.y *= -1, t.z *= -1, e *= -1)) : (t.x = 1, t.y = 0, t.z = 0), e * B.RAD_TO_DEG;
    }
    getEulerAngles(t = new g()) {
      let e, i, s;
      const a = this.x,
        r = this.y,
        n = this.z,
        h = this.w,
        o = 2 * (h * r - a * n);
      return o <= -.99999 ? (e = 2 * Math.atan2(a, h), i = -Math.PI / 2, s = 0) : o >= .99999 ? (e = 2 * Math.atan2(a, h), i = Math.PI / 2, s = 0) : (e = Math.atan2(2 * (h * a + r * n), 1 - 2 * (a * a + r * r)), i = Math.asin(o), s = Math.atan2(2 * (h * n + a * r), 1 - 2 * (r * r + n * n))), t.set(e, i, s).mulScalar(B.RAD_TO_DEG);
    }
    invert() {
      return this.conjugate().normalize();
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    mul(t) {
      const e = this.x,
        i = this.y,
        s = this.z,
        a = this.w,
        r = t.x,
        n = t.y,
        h = t.z,
        o = t.w;
      return this.x = a * r + e * o + i * h - s * n, this.y = a * n + i * o + s * r - e * h, this.z = a * h + s * o + e * n - i * r, this.w = a * o - e * r - i * n - s * h, this;
    }
    mul2(t, e) {
      const i = t.x,
        s = t.y,
        a = t.z,
        r = t.w,
        n = e.x,
        h = e.y,
        o = e.z,
        l = e.w;
      return this.x = r * n + i * l + s * o - a * h, this.y = r * h + s * l + a * n - i * o, this.z = r * o + a * l + i * h - s * n, this.w = r * l - i * n - s * h - a * o, this;
    }
    normalize() {
      let t = this.length();
      return t === 0 ? (this.x = this.y = this.z = 0, this.w = 1) : (t = 1 / t, this.x *= t, this.y *= t, this.z *= t, this.w *= t), this;
    }
    set(t, e, i, s) {
      return this.x = t, this.y = e, this.z = i, this.w = s, this;
    }
    setFromAxisAngle(t, e) {
      e *= .5 * B.DEG_TO_RAD;
      const i = Math.sin(e),
        s = Math.cos(e);
      return this.x = i * t.x, this.y = i * t.y, this.z = i * t.z, this.w = s, this;
    }
    setFromEulerAngles(t, e, i) {
      if (t instanceof g) {
        const c = t;
        t = c.x, e = c.y, i = c.z;
      }
      const s = .5 * B.DEG_TO_RAD;
      t *= s, e *= s, i *= s;
      const a = Math.sin(t),
        r = Math.cos(t),
        n = Math.sin(e),
        h = Math.cos(e),
        o = Math.sin(i),
        l = Math.cos(i);
      return this.x = a * h * l - r * n * o, this.y = r * n * l + a * h * o, this.z = r * h * o - a * n * l, this.w = r * h * l + a * n * o, this;
    }
    setFromMat4(t) {
      let e, i, s, a, r, n, h, o, l, c, d, p, x, _;
      if (t = t.data, e = t[0], i = t[1], s = t[2], a = t[4], r = t[5], n = t[6], h = t[8], o = t[9], l = t[10], p = e * e + i * i + s * s, p === 0) return this;
      if (p = 1 / Math.sqrt(p), x = a * a + r * r + n * n, x === 0) return this;
      if (x = 1 / Math.sqrt(x), _ = h * h + o * o + l * l, _ === 0) return this;
      _ = 1 / Math.sqrt(_), e *= p, i *= p, s *= p, a *= x, r *= x, n *= x, h *= _, o *= _, l *= _;
      const k = e + r + l;
      return k >= 0 ? (c = Math.sqrt(k + 1), this.w = c * .5, c = .5 / c, this.x = (n - o) * c, this.y = (h - s) * c, this.z = (i - a) * c) : e > r ? e > l ? (d = e - (r + l) + 1, d = Math.sqrt(d), this.x = d * .5, d = .5 / d, this.w = (n - o) * d, this.y = (i + a) * d, this.z = (s + h) * d) : (d = l - (e + r) + 1, d = Math.sqrt(d), this.z = d * .5, d = .5 / d, this.w = (i - a) * d, this.x = (h + s) * d, this.y = (o + n) * d) : r > l ? (d = r - (l + e) + 1, d = Math.sqrt(d), this.y = d * .5, d = .5 / d, this.w = (h - s) * d, this.z = (n + o) * d, this.x = (a + i) * d) : (d = l - (e + r) + 1, d = Math.sqrt(d), this.z = d * .5, d = .5 / d, this.w = (i - a) * d, this.x = (h + s) * d, this.y = (o + n) * d), this;
    }
    slerp(t, e, i) {
      const s = t.x,
        a = t.y,
        r = t.z,
        n = t.w;
      let h = e.x,
        o = e.y,
        l = e.z,
        c = e.w,
        d = n * c + s * h + a * o + r * l;
      if (d < 0 && (c = -c, h = -h, o = -o, l = -l, d = -d), Math.abs(d) >= 1) return this.w = n, this.x = s, this.y = a, this.z = r, this;
      const p = Math.acos(d),
        x = Math.sqrt(1 - d * d);
      if (Math.abs(x) < .001) return this.w = n * .5 + c * .5, this.x = s * .5 + h * .5, this.y = a * .5 + o * .5, this.z = r * .5 + l * .5, this;
      const _ = Math.sin((1 - i) * p) / x,
        k = Math.sin(i * p) / x;
      return this.w = n * _ + c * k, this.x = s * _ + h * k, this.y = a * _ + o * k, this.z = r * _ + l * k, this;
    }
    transformVector(t, e = new g()) {
      const i = t.x,
        s = t.y,
        a = t.z,
        r = this.x,
        n = this.y,
        h = this.z,
        o = this.w,
        l = o * i + n * a - h * s,
        c = o * s + h * i - r * a,
        d = o * a + r * s - n * i,
        p = -r * i - n * s - h * a;
      return e.x = l * o + p * -r + c * -h - d * -n, e.y = c * o + p * -n + d * -r - l * -h, e.z = d * o + p * -h + l * -n - c * -r, e;
    }
    toString() {
      return `[${this.x}, ${this.y}, ${this.z}, ${this.w}]`;
    }
  };
  let lt = rt;
  lt.IDENTITY = Object.freeze(new rt(0, 0, 0, 1)), lt.ZERO = Object.freeze(new rt(0, 0, 0, 0));
  class Y {}
  const xt = "endModel",
    wt = "elevatorModel",
    ft = "downStairModel",
    _t = "upStairModel";
  class H {
    constructor() {
      u(this, "pc");
      u(this, "app");
      u(this, "pathRoot");
      u(this, "endModel");
      u(this, "elevatorModel");
      u(this, "downStairModel");
      u(this, "upStairModel");
      u(this, "objectInScene");
    }
    init(e, i, s, a) {
      this.pathRoot = a, this.endModel = s.models.endModel, this.endModel.name = xt, this.elevatorModel = s.models.elevatorModel, this.elevatorModel.name = wt, this.downStairModel = s.models.downStairModel, this.downStairModel.name = ft, this.upStairModel = s.models.upStairModel, this.upStairModel.name = _t, this.objectInScene = new Map(), z.Instance.register(this.endModel, 1), z.Instance.register(this.elevatorModel, 1), z.Instance.register(this.downStairModel, 1), z.Instance.register(this.upStairModel, 1);
    }
    clearPath() {
      for (let e of this.objectInScene.keys()) z.Instance.destroy(this.objectInScene.get(e)), this.objectInScene.delete(e);
    }
    drawPath(e) {
      let i = e.route.map(a => a.id),
        s = this.objectInScene.keys();
      for (let a of s) i.includes(a) || (z.Instance.destroy(this.objectInScene.get(a)), this.objectInScene.delete(a));
      for (let a of e.route) if (!this.objectInScene.has(a.id)) {
        if (a.action == y.Elevator && !a.hasTag(C.WormholeEnd)) {
          let r = z.Instance.create(wt);
          r.reparent(this.pathRoot), r.setPosition(a.position.x, a.position.y, a.position.z);
          let n = a.position.clone().add(a.fromDir);
          r.lookAt(n.x, n.y, n.z, 0, 1, 0), this.objectInScene.set(a.id, r);
        } else if (a.action == y.End) {
          let r = z.Instance.create(xt);
          r.reparent(this.pathRoot), r.setPosition(a.position.x, a.position.y, a.position.z), this.objectInScene.set(a.id, r);
        } else if ((a.action == y.Escalator || a.action == y.Stairs) && !a.hasTag(C.WormholeEnd) && a.hasTag(C.WormholeStart)) {
          let r = f.Instance.navPlanManager.getPlanOfMarkerIndex(f.Instance.matkers.indexOf(a), !1);
          if (r.info.crossFloor > 0) {
            let n = z.Instance.create(_t);
            n.reparent(this.pathRoot), n.setPosition(a.position.x, a.position.y, a.position.z);
            let h = a.position.clone().add(a.fromDir);
            n.lookAt(h.x, h.y, h.z, 0, 1, 0), this.objectInScene.set(a.id, n);
          } else if (r.info.crossFloor < 0) {
            let n = z.Instance.create(ft);
            n.reparent(this.pathRoot), n.setPosition(a.position.x, a.position.y, a.position.z);
            let h = a.position.clone().add(a.fromDir);
            n.lookAt(h.x, h.y, h.z, 0, 1, 0), this.objectInScene.set(a.id, n);
          }
        }
      }
    }
    destroy() {
      this.clearPath();
    }
  }
  const yt = "routeArrow";
  class bt extends Y {
    constructor() {
      super(...arguments);
      u(this, "routeArrow");
      u(this, "app");
      u(this, "pc");
      u(this, "pathRoot");
      u(this, "arrowsMap");
      u(this, "pathObjects");
    }
    init(i, s, a) {
      this.routeArrow = a.models.routeArrow, this.routeArrow.name = yt, this.app = i, this.pc = s, this.pathRoot = new this.pc.Entity("pathRoot", i), this.app.root.addChild(this.pathRoot), this.arrowsMap = new Map(), this.pathObjects = new H(), this.pathObjects.init(i, s, a, this.pathRoot), z.Instance.register(this.routeArrow, 50);
    }
    clearPath() {
      this.pathObjects.clearPath();
      for (let i of this.arrowsMap.keys()) z.Instance.destroy(this.arrowsMap.get(i)), this.arrowsMap.delete(i);
    }
    drawPath(i) {
      this.pathObjects.drawPath(i);
      let s = i.route.map(r => r.id),
        a = this.arrowsMap.keys();
      for (let r of a) s.includes(r) || (z.Instance.destroy(this.arrowsMap.get(r)), this.arrowsMap.delete(r));
      for (let r of i.route) if (!this.arrowsMap.has(r.id) && !(r.action == y.Elevator || r.action == y.End)) {
        if (r.action != y.Escalator) {
          if (r.action != y.Stairs) {
            let n = z.Instance.create(yt);
            n.reparent(this.pathRoot), n.setPosition(r.position.x, r.position.y, r.position.z);
            let h = r.position.clone().add(r.toDir);
            n.lookAt(h.x, h.y, h.z, 0, 1, 0), this.arrowsMap.set(r.id, n);
          }
        }
      }
    }
    onCameraUpdate(i, s) {}
    destroy() {
      this.clearPath(), this.pathObjects.destroy(), this.pathRoot.destroy();
    }
  }
  class St {
    constructor() {
      u(this, "pc");
      u(this, "app");
      u(this, "cameraEntity");
      u(this, "arrowEntity");
      u(this, "_targetPosition");
      u(this, "_lookAtDistance", 5);
    }
    init(e, i, s, a, r = {
      x: 0,
      y: -.35,
      z: -1
    }, n = 5) {
      this.pc = e, this.app = i, this.cameraEntity = s, this.arrowEntity = a, this._lookAtDistance = n, s.addChild(this.arrowEntity), this.arrowEntity.setLocalPosition(r.x, r.y, r.z), this.app.on("update", this.update, this), this.arrowEntity.enabled = !1;
    }
    onCameraUpdate(e, i) {
      this._targetPosition = f.Instance.getPositionInRoute(i + this._lookAtDistance), this.arrowEntity.enabled || (this.arrowEntity.enabled = !0);
    }
    update(e) {
      if (!!this.arrowEntity.enabled && this._targetPosition) {
        let i = this.arrowEntity.getPosition().clone(),
          s = new this.pc.Mat4().setLookAt(i, new this.pc.Vec3(this._targetPosition.x, i.y, this._targetPosition.z), this.pc.Vec3.UP),
          a = new this.pc.Quat().setFromMat4(s);
        this.arrowEntity.setRotation(new this.pc.Quat().slerp(this.arrowEntity.getRotation().clone(), a, e * 2));
      }
    }
    hide() {
      this.arrowEntity.enabled = !1;
    }
    detroy() {
      this.app.off("update", this.update, this), this.arrowEntity.destroy();
    }
  }
  const D = {
    routeWidth: 6,
    arriveRadious: 5,
    drawPathLength: -1,
    pathSetting: {
      pathType: U.AverageArrowPath,
      arrowDistance: 5,
      routeArrowModelUrl: "https://sightp-tour-cdn.sightp.com/wxapp/apps/Test/nav_model/routeArrow/jt02.json",
      endModelUrl: "https://sightp-tour-cdn.sightp.com/wxapp/apps/Test/nav_model/end/ZD_DH.json?s=15,15,15",
      elevatorModelUrl: "https://sightp-tour-cdn.sightp.com/wxapp/apps/Test/nav_model/elevator1/elevator.json",
      upStairModelUrl: "https://sightp-tour-cdn.sightp.com/wxapp/apps/Test/nav_model/upStair/upStair.json",
      downStairModelUrl: "https://sightp-tour-cdn.sightp.com/wxapp/apps/Test/nav_model/downStair/downStair.json"
    },
    flowArrowSetting: {
      offsetCamera: {
        x: 0,
        y: -.35,
        z: -1
      },
      lookDistance: 8,
      flowArrowModelUrl: "https://sightp-tour-cdn.sightp.com/wxapp/apps/Test/nav_model/flowArrow/jiantou.json?s=0.12,0.12,0.12"
    },
    navigator: {
      disable: !0,
      navigatorModelUrl: "https://sightp-tour-cdn.sightp.com/wxapp/apps/Test/nav_model/Ch47/Ch46.json?r=0,180,0",
      navigatorAnimations: {
        Walk: "https://sightp-tour-cdn.sightp.com/wxapp/apps/Test/nav_model/Ch47/Walking.json",
        Idle: "https://sightp-tour-cdn.sightp.com/wxapp/apps/Test/nav_model/Ch47/Angry.json",
        Run: "https://sightp-tour-cdn.sightp.com/wxapp/apps/Test/nav_model/Ch47/Running.json",
        Start: "https://sightp-tour-cdn.sightp.com/wxapp/apps/Test/nav_model/Ch47/StandingGreeting.json",
        Stop: "https://sightp-tour-cdn.sightp.com/wxapp/apps/Test/nav_model/Ch47/Idle.json"
      },
      moveSpeed: 1.2,
      maxMoveSpeed: 1.9,
      maxWaitDistance: 8,
      minWaitDistance: 2,
      maxRunDistance: 5,
      minRunDistance: .9,
      targetFinder: {
        textrue: "https://sightp-tour-cdn.sightp.com/wxapp/apps/Test/nav_model/finderArrow.png",
        size: {
          width: 50,
          height: 50
        },
        edge: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        }
      }
    }
  };
  function Et(t) {
    return t.routeWidth || (t.routeWidth = D.routeWidth), t.arriveRadious || (t.arriveRadious = D.arriveRadious), t.drawPathLength || (t.drawPathLength = D.drawPathLength), t.pathSetting ? (t.pathSetting.routeArrowModelUrl || (t.pathSetting.routeArrowModelUrl = D.pathSetting.routeArrowModelUrl), t.pathSetting.endModelUrl || (t.pathSetting.endModelUrl = D.pathSetting.endModelUrl), t.pathSetting.elevatorModelUrl || (t.pathSetting.elevatorModelUrl = D.pathSetting.elevatorModelUrl), t.pathSetting.upStairModelUrl || (t.pathSetting.upStairModelUrl = D.pathSetting.upStairModelUrl), t.pathSetting.downStairModelUrl || (t.pathSetting.downStairModelUrl = D.pathSetting.downStairModelUrl), t.pathSetting.arrowDistance || (t.pathSetting.arrowDistance = D.pathSetting.arrowDistance)) : t.pathSetting = D.pathSetting, t.flowArrowSetting ? (t.flowArrowSetting.flowArrowModelUrl || (t.flowArrowSetting.flowArrowModelUrl = D.flowArrowSetting.flowArrowModelUrl), t.flowArrowSetting.offsetCamera || (t.flowArrowSetting.offsetCamera = D.flowArrowSetting.offsetCamera), t.flowArrowSetting.lookDistance || (t.flowArrowSetting.lookDistance = D.flowArrowSetting.lookDistance)) : t.flowArrowSetting = D.flowArrowSetting, t.navigator ? (t.navigator.moveSpeed || (t.navigator.moveSpeed = D.navigator.moveSpeed), t.navigator.maxMoveSpeed || (t.navigator.maxMoveSpeed = D.navigator.maxMoveSpeed), t.navigator.maxWaitDistance || (t.navigator.maxWaitDistance = D.navigator.maxWaitDistance), t.navigator.minWaitDistance || (t.navigator.minWaitDistance = D.navigator.minWaitDistance), t.navigator.maxRunDistance || (t.navigator.maxRunDistance = D.navigator.maxRunDistance), t.navigator.minRunDistance || (t.navigator.minRunDistance = D.navigator.minRunDistance), t.navigator.targetFinder ? (t.navigator.targetFinder.edge || (t.navigator.targetFinder.edge = D.navigator.targetFinder.edge), t.navigator.targetFinder.size || (t.navigator.targetFinder.size = D.navigator.targetFinder.size), t.navigator.targetFinder.textrue || (t.navigator.targetFinder.textrue = D.navigator.targetFinder.textrue)) : t.navigator.targetFinder = D.navigator.targetFinder) : t.navigator = D.navigator, t;
  }
  class Dt {
    constructor() {
      u(this, "pc");
      u(this, "app");
      u(this, "_cameraEntity");
      u(this, "_targetEntity");
      u(this, "_onInsight");
      u(this, "_onOutSight");
      u(this, "arrowEntity");
      u(this, "clientWidth");
      u(this, "clientHeight");
      u(this, "minX");
      u(this, "minY");
      u(this, "maxX");
      u(this, "maxY");
      u(this, "screenCenter");
      u(this, "_inSight", null);
      u(this, "_hide");
    }
    get inSight() {
      return this._inSight;
    }
    set inSight(e) {
      this._inSight !== e && (e ? (console.log("insight"), this._onInsight && this._onInsight()) : (console.log("outsight"), this._onOutSight && this._onOutSight()), this.arrowEntity.enabled = !e, this._inSight = e);
    }
    async init(e, i, s) {
      var o, l, c, d;
      this.pc = e, this.app = i;
      const a = i.graphicsDevice.clientRect.width;
      this.clientWidth = a;
      const r = i.graphicsDevice.clientRect.height;
      this.clientHeight = r;
      let n = this.app.root.findByName("2D Screen");
      n ? n.screen.referenceResolution = new this.pc.Vec2(a, r) : (n = new e.Entity("2D Screen"), n.addComponent("screen", {
        referenceResolution: new this.pc.Vec2(a, r),
        screenSpace: !0,
        scaleMode: "blend"
      }), i.root.children[0].addChild(n)), this.arrowEntity = new this.pc.Entity("arrowEntity");
      let h = await R.instnce.loadFromUrl(s.textrue, "texture");
      this.arrowEntity.addComponent("element", {
        type: e.ELEMENTTYPE_IMAGE,
        pivot: new e.Vec2(.5, 1),
        anchor: new e.Vec4(0, 0, 0, 0),
        width: s.size.width,
        height: s.size.height,
        textureAsset: h.id
      }), n.addChild(this.arrowEntity), this.arrowEntity.enabled = !1, this.arrowEntity.setLocalPosition(a / 2, r / 2, 0), this.minX = (o = s.edge) != null && o.left ? s.edge.left : 0, this.maxX = (l = s.edge) != null && l.right ? a - s.edge.right : a, this.minY = (c = s.edge) != null && c.bottom ? s.edge.bottom : 0, this.maxY = (d = s.edge) != null && d.top ? r - s.edge.top : r, this.screenCenter = new this.pc.Vec2(a / 2, r / 2), console.log("canvasWidth:", i.graphicsDevice.width, " canvasHeight:", i.graphicsDevice.height), console.log("clientWidth:", a, " clientHeight:", r), console.log("edge:", JSON.stringify(s.edge)), console.log(`minx: ${this.minX}, miny: ${this.minY}, maxx: ${this.maxX}, maxy: ${this.maxY}`);
    }
    startFind(e, i, s, a) {
      this._hide = !1, this._cameraEntity = e, this._targetEntity = i, this._onInsight = s, this._onOutSight = a, this.app.on("update", this.update, this);
    }
    stopFind() {
      this.app.off("update", this.update, this), this._hide = !0, this.arrowEntity.enabled = !1, this._inSight = null, this._cameraEntity = null, this._targetEntity = null, this._onInsight = null, this._onOutSight = null;
    }
    update(e) {
      if (!this._targetEntity || !this._cameraEntity || this._hide) return;
      const i = this.buildAABB(this._targetEntity);
      i.getMax(), i.getMin();
      const s = i.center;
      let a = this.getScreenPosition(s),
        r = a.x >= this.minX && a.x <= this.maxX && a.y >= this.minY && a.y <= this.maxY && a.z > 0;
      if (this.inSight = r, !this.inSight) {
        const n = (this.maxY - this.minY) / 2,
          h = (this.maxX - this.minX) / 2;
        let o = new this.pc.Vec3(),
          l = 0,
          c = new this.pc.Vec2().sub2(new this.pc.Vec2(a.x, a.y), this.screenCenter);
        if (c.y > 0) {
          l = -Math.atan(c.x / c.y) * (180 / Math.PI);
          let d = c.x / c.y * n;
          if (d >= -h && d <= h) o.x = this.screenCenter.x + d, o.y = this.maxY;else {
            let p = c.y / c.x * h;
            p > 0 ? (o.x = this.maxX, o.y = this.screenCenter.y + p) : (o.x = this.minX, o.y = this.screenCenter.y - p);
          }
        } else if (c.y < 0) {
          l = -Math.atan(c.x / c.y) * (180 / Math.PI) - 180;
          let d = c.x / c.y * -n;
          if (d >= -h && d <= h) o.x = this.screenCenter.x + d, o.y = this.minY;else {
            let p = c.y / c.x * h;
            p < 0 ? (o.x = this.maxX, o.y = this.screenCenter.y + p) : (o.x = this.minX, o.y = this.screenCenter.y - p);
          }
        } else c.x <= 0 ? (l = 90, o.x = this.minX, o.y = this.screenCenter.y) : (l = -90, o.x = this.maxX, o.y = this.screenCenter.y);
        this.arrowEntity.setLocalEulerAngles(0, 0, l), this.arrowEntity.setLocalPosition(o);
      }
    }
    buildAABB(e) {
      let i = new this.pc.BoundingBox(e.getPosition());
      if (e instanceof this.pc.Entity) {
        let s = e.model;
        if (s) {
          let a = s.meshInstances;
          if (a) for (let r = 0; r < a.length; r++) i.add(a[r].aabb);
        }
      }
      for (let s = 0; s < e.children.length; ++s) i.add(this.buildAABB(e.children[s]));
      return i;
    }
    getScreenPosition(e) {
      let i = new this.pc.Vec3();
      return this._cameraEntity.camera.worldToScreen(e, i), this._cameraEntity.forward.clone().dot(e.clone().sub(this._cameraEntity.getPosition()).normalize()) >= 0 ? i.y = this.clientHeight - i.y : i.x = this.clientWidth - i.x, i;
    }
    hide() {
      this._inSight = null, this.arrowEntity.enabled = !1, this._hide = !0;
    }
    show() {
      this.arrowEntity.enabled = !0, this._hide = !1;
    }
  }
  class Rt {
    constructor(e) {
      u(this, "app");
      u(this, "pc");
      u(this, "navManager");
      u(this, "targetFinder");
      u(this, "navigatorEntity");
      u(this, "modelEntity");
      u(this, "cameraEntity");
      u(this, "movespeed");
      u(this, "maxMoveSpeed");
      u(this, "maxWaitDistance");
      u(this, "minWaitDistance");
      u(this, "maxRunDistance");
      u(this, "minRunDistance");
      u(this, "currentDTS");
      u(this, "cameraDTS");
      u(this, "currentSpeed");
      u(this, "state");
      this.navManager = e;
    }
    init(e, i, s, a) {
      this.app = e, this.pc = i, a.targetFinder && !a.targetFinder.disable && (this.targetFinder = new Dt(), this.targetFinder.init(i, e, a.targetFinder)), s ? (this.navigatorEntity = s, this.modelEntity = s.children[0], this.navigatorEntity.name = "navigatorEntity") : (this.navigatorEntity = new this.pc.Entity("navigatorEntity", e), this.modelEntity = null), this.movespeed = a.moveSpeed, this.maxMoveSpeed = a.maxMoveSpeed, this.maxWaitDistance = a.maxWaitDistance, this.minWaitDistance = a.minWaitDistance, this.minRunDistance = a.minRunDistance, this.maxRunDistance = a.maxRunDistance, e.root.addChild(this.navigatorEntity), this.navigatorEntity.enabled = !1, this.app.on("update", this.update, this), this.setState(0);
    }
    setState(e) {
      switch (e) {
        case 0:
          {
            console.log("----set navigator state --- BeforeStart"), this.app.fire("navigator_beforeStart"), this.currentDTS = 0, this.cameraDTS = 0, this.hide();
            break;
          }
        case 1:
          {
            console.log("----set navigator state --- Start"), this.currentDTS = this.cameraDTS + 3;
            let i = f.Instance.getPositionInRoute(this.currentDTS, !0);
            this.navigatorEntity.setPosition(i.x, i.y, i.z);
            let s = this.cameraEntity.getPosition();
            this.navigatorEntity.lookAt(s.x, i.y, s.z, 0, 1, 0), this.navigatorEntity.enabled = !0, this.app.fire("navigator_start", i, new this.pc.Vec3(s.x, i.y, s.z)), this.navManager.fire("assistant_moveToPosition", new this.pc.Vec3(i.x, i.y, i.z)), this.modelEntity ? this.targetFinder ? (this.targetFinder.startFind(this.cameraEntity, this.navigatorEntity, () => {}, () => {}), this.playAnim("Start", 0), setTimeout(() => {
              console.log("\u64AD\u653E\u5B8C\u5F00\u59CB\u52A8\u753B\uFF0C\u5F00\u59CB\u884C\u8D70"), this.state != 7 && this.setState(2);
            }, 2 * 1e3), this.targetFinder._onInsight = null) : (this.playAnim("Start", 0), setTimeout(() => {
              console.log("\u64AD\u653E\u5B8C\u5F00\u59CB\u52A8\u753B\uFF0C\u5F00\u59CB\u884C\u8D70"), this.state != 7 && this.setState(2);
            }, 2 * 1e3), this.targetFinder._onInsight = null) : this.navManager.once("assistant_move_end", () => {
              this.state != 7 && this.setState(2);
            }, this);
            break;
          }
        case 2:
          {
            console.log("----set navigator state --- Walk"), this.app.fire("navigator_walk"), this.playAnim("Walk", .1), this.navManager.fire("assistant_playAnim", "walk"), this.currentSpeed = this.movespeed;
            break;
          }
        case 3:
          {
            console.log("----set navigator state --- Run"), this.app.fire("navigator_run"), this.playAnim("Run", .1), this.navManager.fire("assistant_playAnim", "run"), this.currentSpeed = this.maxMoveSpeed;
            break;
          }
        case 4:
          {
            console.log("----set navigator state --- Wait"), this.app.fire("navigator_wait");
            let i = this.cameraEntity.getPosition();
            this.navigatorEntity.lookAt(i.x, this.navigatorEntity.getPosition().y, i.z, 0, 1, 0), this.currentSpeed = 0, this.playAnim("Idle"), this.navManager.fire("assistant_playAnim", "idle"), this.navManager.fire("assistant_move", this.navigatorEntity.getPosition(), new this.pc.Vec3(i.x, this.navigatorEntity.getPosition().y, i.z));
            break;
          }
        case 5:
          {
            console.log("----set navigator state --- Reset"), this.app.fire("navigator_reset"), this.hide(), this.currentDTS = 0, this.cameraDTS = 0, this.targetFinder && this.targetFinder.hide();
            break;
          }
        case 6:
          {
            console.log("----set navigator state --- Stop"), this.app.fire("navigator_stop"), this.currentSpeed = 0, this.playAnim("Stop"), this.navManager.fire("assistant_playAnim", "stop"), this.navManager.fire("assistant_move", this.navigatorEntity.getPosition(), new this.pc.Vec3(this.cameraEntity.getPosition().x, this.navigatorEntity.getPosition().y, this.cameraEntity.getPosition().z)), this.navigatorEntity.rotateLocal(0, 180, 0);
            break;
          }
        case 7:
          {
            console.log("----set navigator state --- Over"), this.app.fire("navigator_over"), this.currentDTS = 0, this.cameraDTS = 0, this.hide(), this.targetFinder && this.targetFinder.stopFind();
            break;
          }
      }
      this.state = e;
    }
    onCameraUpdate(e, i) {
      this.cameraEntity || (this.cameraEntity = e), this.cameraDTS = i, this.state == 0 ? this.setState(1) : this.state == 1 ? this.cameraDTS - this.currentDTS >= 1 && (console.log("\u7528\u6237\u8D85\u8FC7\u6570\u5B57\u4EBA\uFF0C\u76F4\u63A5\u5207\u6362"), this.targetFinder && (this.targetFinder._onInsight = null), this.setState(2)) : this.state == 5 ? (this.currentDTS = this.cameraDTS + 1, this.navigatorEntity.enabled = !0, this.targetFinder && this.targetFinder.show(), this.setState(2)) : this.state == 7 && this.setState(1);
    }
    update(e) {
      if (!(this.state <= 0)) if (this.state == 2 || this.state == 3) {
        const i = f.Instance.currentPlanBreakFromStart - this.currentDTS <= 5;
        this.currentDTS += this.currentSpeed * e;
        let s = f.Instance.getPositionInRoute(this.currentDTS, !0);
        this.navigatorEntity.setPosition(s.x, s.y, s.z);
        let a = f.Instance.getPositionInRoute(this.currentDTS + this.currentSpeed * e, !0);
        if (this.navigatorEntity.lookAt(a.x, s.y, a.z, 0, 1, 0), this.app.fire("navigator_move", s, new this.pc.Vec3(a.x, s.y, a.z)), this.navManager.fire("assistant_move", new this.pc.Vec3(s.x, s.y, s.z), new this.pc.Vec3(a.x, s.y, a.z)), Number.isNaN(this.navigatorEntity.getPosition().x) || Number.isNaN(this.navigatorEntity.getRotation().x)) debugger;
        i && this.state != 3 && this.setState(3), f.Instance.currentPlanBreakFromStart - this.currentDTS <= 1 ? this.setState(6) : this.currentDTS - this.cameraDTS > this.maxWaitDistance && !i ? this.setState(4) : this.currentDTS - this.cameraDTS < this.minRunDistance && this.state == 2 ? this.setState(3) : this.currentDTS - this.cameraDTS > this.maxRunDistance && this.state == 3 && !i ? this.setState(2) : this.currentDTS - this.cameraDTS < -5 && this.setState(5);
      } else this.state == 4 && this.currentDTS - this.cameraDTS <= this.minWaitDistance && this.setState(2);
    }
    playAnim(e, i = .2) {
      if (!!this.modelEntity) if (this.modelEntity.animation.animations[e]) this.modelEntity.animation.play(e, i), this.modelEntity.animation.speed = 1, console.log("\u6B63\u5E38\u64AD\u653E\u52A8\u753B", e);else switch (e) {
        case "Start":
          this.modelEntity.animation.play("Idle", i), this.modelEntity.animation.speed = 1, console.log("\u672A\u627E\u5230\u52A8\u753B", e, ",\u64AD\u653E\u52A8\u753BIdle");
          break;
        case "Stop":
          this.modelEntity.animation.play("Idle", i), this.modelEntity.animation.speed = 1, console.log("\u672A\u627E\u5230\u52A8\u753B", e, ",\u64AD\u653E\u52A8\u753BIdle");
          break;
        case "Run":
          let s = this.maxMoveSpeed / this.movespeed;
          this.modelEntity.animation.speed = s, console.log("\u672A\u627E\u5230\u52A8\u753B", e, ",\u64AD\u653E\u52A8\u753Bwalk,speedUp");
          break;
      }
    }
    hide() {
      this.modelEntity && (this.modelEntity.animation.speed = 0), this.navigatorEntity.enabled = !1, this.targetFinder && this.targetFinder.hide();
    }
    reset() {
      this.setState(5);
    }
    over() {
      this.setState(7);
    }
    destroy() {
      this.app.off("update", this.update, this), this.navigatorEntity.destroy();
    }
  }
  class It extends Y {
    constructor() {
      super(...arguments);
      u(this, "app");
      u(this, "pc");
      u(this, "pathRoot");
      u(this, "pathObjects");
    }
    init(i, s, a) {
      this.app = i, this.pc = s, this.pathRoot = new this.pc.Entity("pathRoot", i), this.app.root.addChild(this.pathRoot), this.pathObjects = new H(), this.pathObjects.init(i, s, a, this.pathRoot);
    }
    clearPath() {
      this.pathObjects.clearPath();
    }
    drawPath(i) {
      this.pathObjects.drawPath(i);
    }
    onCameraUpdate(i, s) {}
    destroy() {
      this.clearPath(), this.pathObjects.destroy(), this.pathRoot.destroy();
    }
  }
  const Mt = "routeArrow";
  class Tt extends Y {
    constructor() {
      super(...arguments);
      u(this, "routeArrow");
      u(this, "app");
      u(this, "pc");
      u(this, "pathRoot");
      u(this, "pathObjects");
      u(this, "_drawPathLength");
      u(this, "_arrowDistance");
      u(this, "_dtsArrowMap");
      u(this, "_moveSpeed");
      u(this, "_moveOffset");
    }
    init(i, s, a) {
      this.routeArrow = a.models.routeArrow, this.routeArrow.name = Mt, this.app = i, this.pc = s, this._drawPathLength = a.drawPathLength == -1 ? Number.MAX_VALUE : a.drawPathLength, this._arrowDistance = a.arrowDistance, this._moveSpeed = a.moveSpeed ? a.moveSpeed : .5, this.pathRoot = new this.pc.Entity("pathRoot", i), this.app.root.addChild(this.pathRoot), this.pathObjects = new H(), this.pathObjects.init(i, s, a, this.pathRoot), z.Instance.register(this.routeArrow, 50);
    }
    clearPath() {
      if (this.pathObjects.clearPath(), this._moveOffset = 0, this.app.off("update", this.update, this), this._dtsArrowMap) {
        for (let i of this._dtsArrowMap) i[1] != null && z.Instance.destroy(i[1]);
        this._dtsArrowMap.clear(), this._dtsArrowMap = null;
      }
    }
    drawPath(i) {
      this.pathObjects.drawPath(i);
      const s = i.distanceFromStart;
      if (!this._dtsArrowMap || this._dtsArrowMap.size <= 0) {
        this._dtsArrowMap = new Map();
        let n = f.Instance.routeLength,
          h = 0;
        for (; h <= n;) this._dtsArrowMap.set(h, null), h += this._arrowDistance;
        this.app.on("update", this.update, this), this._moveOffset = 0;
      }
      let a = s - 1 >= 0 ? s - 1 : 0,
        r = s + this._drawPathLength >= f.Instance.currentPlanBreakFromStart ? f.Instance.currentPlanBreakFromStart : s + this._drawPathLength;
      for (let n of this._dtsArrowMap.keys()) if (n >= a && n <= r - this._arrowDistance) {
        if (this._dtsArrowMap.get(n) == null) {
          let h = z.Instance.create(Mt);
          h.reparent(this.pathRoot);
          let o = f.Instance.getPositionInRoute(n + this._moveOffset, !0);
          h.setPosition(o.x, o.y, o.z);
          let l = f.Instance.getPositionInRoute(n + this._moveOffset + .1, !0);
          h.lookAt(l.x, l.y, l.z), this._dtsArrowMap.set(n, h);
        }
      } else this._dtsArrowMap.get(n) != null && (z.Instance.destroy(this._dtsArrowMap.get(n)), this._dtsArrowMap.set(n, null));
    }
    onCameraUpdate(i, s) {}
    update(i) {
      if (this._moveOffset = this._moveOffset + i * this._moveSpeed, this._moveOffset > this._arrowDistance && (this._moveOffset = this._moveOffset - this._arrowDistance), this._dtsArrowMap && this._dtsArrowMap.size > 0) for (let s of this._dtsArrowMap.keys()) {
        let a = this._dtsArrowMap.get(s);
        if (a) {
          let r = f.Instance.getPositionInRoute(s + this._moveOffset, !0);
          a.setPosition(r.x, r.y, r.z);
          let n = f.Instance.getPositionInRoute(s + this._moveOffset + .1, !0);
          a.lookAt(n.x, n.y, n.z);
        }
      }
    }
    destroy() {
      this.clearPath(), this.pathObjects.destroy(), this.pathRoot.destroy();
    }
  }
  const mt = "routeArrow";
  class Ft extends Y {
    constructor() {
      super(...arguments);
      u(this, "routeArrow");
      u(this, "app");
      u(this, "pc");
      u(this, "pathRoot");
      u(this, "pathObjects");
      u(this, "_drawPathLength");
      u(this, "_arrowDistance");
      u(this, "_dtsArrowMap");
    }
    init(i, s, a) {
      this.routeArrow = a.models.routeArrow, this.routeArrow.name = mt, this.app = i, this.pc = s, this._drawPathLength = a.drawPathLength == -1 ? Number.MAX_VALUE : a.drawPathLength, this._arrowDistance = a.arrowDistance, this.pathRoot = new this.pc.Entity("pathRoot", i), this.app.root.addChild(this.pathRoot), this.pathObjects = new H(), this.pathObjects.init(i, s, a, this.pathRoot), z.Instance.register(this.routeArrow, 50);
    }
    clearPath() {
      if (this.pathObjects.clearPath(), this._dtsArrowMap) {
        for (let i of this._dtsArrowMap) i[1] != null && z.Instance.destroy(i[1]);
        this._dtsArrowMap.clear(), this._dtsArrowMap = null;
      }
    }
    drawPath(i) {
      this.pathObjects.drawPath(i);
      const s = i.distanceFromStart;
      if (!this._dtsArrowMap || this._dtsArrowMap.size <= 0) {
        this._dtsArrowMap = new Map();
        let n = f.Instance.routeLength,
          h = 0;
        for (; h <= n;) this._dtsArrowMap.set(h, null), h += this._arrowDistance;
      }
      let a = s - 1 >= 0 ? s - 1 : 0,
        r = s + this._drawPathLength >= f.Instance.currentPlanBreakFromStart ? f.Instance.currentPlanBreakFromStart : s + this._drawPathLength;
      for (let n of this._dtsArrowMap.keys()) if (n >= a && n <= r) {
        if (this._dtsArrowMap.get(n) == null) {
          let h = z.Instance.create(mt);
          h.reparent(this.pathRoot);
          let o = f.Instance.getPositionInRoute(n, !0);
          h.setPosition(o.x, o.y, o.z);
          let l = f.Instance.getPositionInRoute(n + .1, !0);
          h.lookAt(l.x, l.y, l.z), this._dtsArrowMap.set(n, h);
        }
      } else this._dtsArrowMap.get(n) != null && (z.Instance.destroy(this._dtsArrowMap.get(n)), this._dtsArrowMap.set(n, null));
    }
    onCameraUpdate(i, s) {}
    destroy() {
      this.clearPath(), this.pathObjects.destroy(), this.pathRoot.destroy();
    }
  }
  const kt = "routeArrow";
  class Nt extends Y {
    constructor() {
      super(...arguments);
      u(this, "routeArrow");
      u(this, "app");
      u(this, "pc");
      u(this, "pathRoot");
      u(this, "pathObjects");
      u(this, "_drawPathLength");
      u(this, "_arrowDistance");
      u(this, "_dtsArrowMap");
    }
    init(i, s, a) {
      this.routeArrow = a.models.routeArrow, this.routeArrow.name = kt, this.app = i, this.pc = s, this._drawPathLength = a.drawPathLength, this._arrowDistance = a.arrowDistance, this.pathRoot = new this.pc.Entity("pathRoot", i), this.app.root.addChild(this.pathRoot), this.pathObjects = new H(), this.pathObjects.init(i, s, a, this.pathRoot), z.Instance.register(this.routeArrow, 50);
    }
    clearPath() {
      this.pathObjects.clearPath();
    }
    drawPath(i) {
      this.pathObjects.drawPath(i);
      const s = i.distanceFromStart;
      if (!this._dtsArrowMap || this._dtsArrowMap.size <= 0) {
        this._dtsArrowMap = new Map();
        let n = f.Instance.routeLength,
          h = 0;
        for (; h <= n;) this._dtsArrowMap.set(h, null), h += this._arrowDistance;
      }
      let a = s - 1 >= 0 ? s - 1 : 0,
        r = s + this._drawPathLength >= f.Instance.routeLength ? f.Instance.routeLength : s + this._drawPathLength;
      for (let n of this._dtsArrowMap.keys()) if (n >= a && n <= r) {
        if (this._dtsArrowMap.get(n) == null) {
          let h = z.Instance.create(kt);
          h.reparent(this.pathRoot);
          let o = f.Instance.getPositionInRoute(n, !0);
          h.setPosition(o.x, o.y, o.z);
          let l = f.Instance.getPositionInRoute(n + .1, !0);
          h.lookAt(l.x, l.y, l.z), this._dtsArrowMap.set(n, h);
        }
      } else this._dtsArrowMap.get(n) != null && (z.Instance.destroy(this._dtsArrowMap.get(n)), this._dtsArrowMap.set(n, null));
    }
    onCameraUpdate(i, s) {}
    destroy() {
      this.clearPath(), this.pathObjects.destroy(), this.pathRoot.destroy();
    }
  }
  class Bt {
    constructor() {
      u(this, "_callbacks");
      u(this, "_callbackActive");
      this._callbacks = {}, this._callbackActive = {};
    }
    initEventHandler() {
      this._callbacks = {}, this._callbackActive = {};
    }
    _addCallback(e, i, s, a = !1) {
      !e || typeof e != "string" || !i || (this._callbacks[e] || (this._callbacks[e] = []), this._callbackActive[e] && this._callbackActive[e] === this._callbacks[e] && (this._callbackActive[e] = this._callbackActive[e].slice()), this._callbacks[e].push({
        callback: i,
        scope: s || this,
        once: a
      }));
    }
    on(e, i, s) {
      return this._addCallback(e, i, s, !1), this;
    }
    off(e, i, s) {
      if (e) this._callbackActive[e] && this._callbackActive[e] === this._callbacks[e] && (this._callbackActive[e] = this._callbackActive[e].slice());else for (const a in this._callbackActive) !this._callbacks[a] || this._callbacks[a] === this._callbackActive[a] && (this._callbackActive[a] = this._callbackActive[a].slice());
      if (!e) this._callbacks = {};else if (!i) this._callbacks[e] && (this._callbacks[e] = []);else {
        const a = this._callbacks[e];
        if (!a) return this;
        let r = a.length;
        for (let n = 0; n < r; n++) a[n].callback === i && (s && a[n].scope !== s || (a[n--] = a[--r]));
        a.length = r;
      }
      return this;
    }
    fire(e, ...i) {
      if (!e || !this._callbacks[e]) return this;
      let s;
      this._callbackActive[e] ? (this._callbackActive[e] === this._callbacks[e] && (this._callbackActive[e] = this._callbackActive[e].slice()), s = this._callbacks[e].slice()) : this._callbackActive[e] = this._callbacks[e];
      for (let a = 0; (s || this._callbackActive[e]) && a < (s || this._callbackActive[e]).length; a++) {
        const r = (s || this._callbackActive[e])[a];
        if (r.callback.call(r.scope, ...i), r.once) {
          const n = this._callbacks[e],
            h = n ? n.indexOf(r) : -1;
          h !== -1 && (this._callbackActive[e] === n && (this._callbackActive[e] = this._callbackActive[e].slice()), this._callbacks[e].splice(h, 1));
        }
      }
      return s || (this._callbackActive[e] = null), this;
    }
    once(e, i, s) {
      return this._addCallback(e, i, s, !0), this;
    }
    hasEvent(e) {
      return this._callbacks[e] && this._callbacks[e].length !== 0 || !1;
    }
  }
  function ct(t) {
    return t && typeof t.x == "number" && typeof t.y == "number" && typeof t.z == "number";
  }
  function vt(t) {
    return t && t.length > 0 && ct(t[0]);
  }
  function Ct(t, e, i, s) {
    Et(i);
    const a = new At(e);
    a.initialize(), R.instnce.app = e, R.instnce.pc = t, z.Instance.init(t, e), i.id && (a.id = i.id), i.routeWidth && (a.routeWidth = i.routeWidth, f.Instance.routeWidth = i.routeWidth), i.requestRoute && (a.requestRoute = i.requestRoute), i.arriveRadious && (a.arriveRadious = i.arriveRadious), i.drawPathLength && (a.drawPathLength = i.drawPathLength);
    let r = [],
      n = [];
    if (i.pathSetting) {
      const h = i.pathSetting;
      a.pathType = h.pathType;
      let o = {};
      switch (h.pathType != U.None && (o.routeArrow = R.instnce.loadModel(h.routeArrowModelUrl), r.push(h.routeArrowModelUrl), n.push(h.routeArrowModelUrl)), o.endModel = R.instnce.loadModel(h.endModelUrl), o.elevatorModel = R.instnce.loadModel(h.elevatorModelUrl), o.downStairModel = R.instnce.loadModel(h.downStairModelUrl), o.upStairModel = R.instnce.loadModel(h.upStairModelUrl), r.push(h.endModelUrl, h.elevatorModelUrl, h.downStairModelUrl, h.upStairModelUrl), n.push(h.endModelUrl, h.elevatorModelUrl, h.downStairModelUrl, h.upStairModelUrl), h.pathType) {
        case U.StaticArrow:
          a.path = new bt();
          break;
        case U.AverageArrowPath:
          a.path = new Ft();
          break;
        case U.MeshPlane:
          a.path = new Nt();
          break;
        case U.MoveArrow:
          a.path = new Tt();
          break;
        case U.None:
          a.path = new It();
          break;
      }
      if (a.path) {
        let l = {
          routeWidth: 3,
          drawPathLength: i.drawPathLength,
          arrowDistance: h.arrowDistance,
          moveSpeed: h.moveSpeed,
          models: o
        };
        a.path.init(e, t, l);
      }
    }
    if (i.flowArrowSetting && !i.flowArrowSetting.disable) {
      const h = i.flowArrowSetting;
      a.flowArrow = new St();
      let o = R.instnce.loadModel(h.flowArrowModelUrl);
      r.push(h.flowArrowModelUrl), n.push(h.flowArrowModelUrl), a.flowArrow.init(t, e, a.cameraEntity, o, h.offsetCamera, h.lookDistance);
    }
    if (i.navigator && !i.navigator.disable) {
      const h = i.navigator;
      let o = null;
      h.navigatorModelUrl && (o = R.instnce.loadModelWithAnimation(h.navigatorModelUrl, h.navigatorAnimations), n.push(h.navigatorModelUrl, ...Object.values(h.navigatorAnimations))), a.navigator = new Rt(a), a.navigator.init(e, t, o, h);
    }
    return a.allAssetLoadPromise = R.instnce.getLoadingPromise(n), a.baseAssetLoadPromise = R.instnce.getLoadingPromise(r), a;
  }
  class At extends Bt {
    constructor(i) {
      super();
      u(this, "baseAssetLoadPromise");
      u(this, "allAssetLoadPromise");
      u(this, "app");
      u(this, "serverHost", "https://dijkstra-server-staging-api.easyar.com/route");
      u(this, "id", "default");
      u(this, "pathType", "static");
      u(this, "cameraEntity");
      u(this, "routeWidth", 3);
      u(this, "arriveRadious", 3);
      u(this, "messageInterval", 1);
      u(this, "drawPathLength", 50);
      u(this, "requestRoute");
      u(this, "path");
      u(this, "flowArrow");
      u(this, "navigator");
      u(this, "maxTryRegetRouteCount", 3);
      u(this, "deviateRegetTime", 2);
      u(this, "isVRNav", !1);
      u(this, "_rawRoute");
      u(this, "_target", null);
      u(this, "_realTarget", null);
      u(this, "_naving", !1);
      u(this, "_endPos", null);
      u(this, "_messageTimer", 0);
      u(this, "_tryRegetRouteCount", 0);
      u(this, "_deviateTimer", 0);
      this.app = i, this.app.on("update", this.update, this);
    }
    initialize() {
      this.cameraEntity = this.app.root.findByTag("MainCamera")[0], this.cameraEntity || (this.cameraEntity = this.app.root.findByName("Camera")), this.on("nav_start", this.startNav, this), this.on("nav_cancel", this.cancelNav, this), this.on("nav_setConfig", this.setConfig, this), this.on("nav_setId", this.setId, this), this.on("nav_continue", this.navContinue, this), this.on("nav_call_arrive", this.navArrive, this), this.on("nav_call_break", this.navBreak, this);
    }
    update(i) {
      if (this._naving) {
        this._messageTimer -= i;
        let s = f.Instance.getRoute(this.cameraEntity.getPosition(), this.drawPathLength);
        if (s) {
          if (this.app.fire("routeRes", s), this._deviateTimer = 0, this._tryRegetRouteCount = 0, this.path && this.path.onCameraUpdate(this.cameraEntity, s.distanceFromStart), this.flowArrow && this.flowArrow.onCameraUpdate(this.cameraEntity, s.distanceFromStart), this.navigator && this.navigator.onCameraUpdate(this.cameraEntity, s.distanceFromStart), this._messageTimer <= 0) {
            this._messageTimer = this.messageInterval;
            let a = {
              target: this._realTarget,
              distanceToEnd: s.distanceToEnd,
              nextAction: s.nextAction,
              distanceToNextAction: s.distanceToNextAction,
              distanceToBreak: s.distanceToNextBreak
            };
            if (this.path.drawPath(s), this.fire("nav_message", a), s.distanceToEnd < this.arriveRadious && !this.isVRNav) {
              this.navArrive();
              return;
            }
            (s.distanceToNextBreak < this.arriveRadious || s.inBreak) && (this.isVRNav || this.navBreak());
          }
        } else this._deviateTimer += i, this._deviateTimer >= this.deviateRegetTime && (console.warn("3d:\u504F\u79BB\u8DEF\u7EBF\uFF0C\u91CD\u65B0\u8BA1\u7B97"), this.fire("nav_deviate"), this._naving = !1, this.navigator && this.navigator.reset(), this.path && this.path.clearPath(), this.regetRoutePlan());
      }
    }
    destroy() {
      this.allAssetLoadPromise = null, this.baseAssetLoadPromise = null, this.app.off("update", this.update, this), this.off("nav_start", this.startNav, this), this.off("nav_cancel", this.cancelNav, this), this.off("nav_setConfig", this.setConfig, this), this.off("nav_setId", this.setId, this), this.off("nav_continue", this.navContinue, this), this.off("nav_call_arrive", this.navArrive, this), this.off("nav_call_break", this.navBreak, this), this.flowArrow && this.flowArrow.detroy(), this.path && this.path.destroy(), this.navigator && this.navigator.destroy(), z.Instance.destroyPool(), R.instnce.clear(), this.off();
    }
    startNav(i) {
      this._naving && this.cancelNav(), this._target = i, Array.isArray(this._target) ? vt(this._target) ? this._endPos = this._target : this._endPos = this._target.map(s => s.position) : ct(this._target) ? this._endPos = this._target : this._endPos = this._target.position, this.getRoutePlan().then(s => {
        if (!s) return;
        this._rawRoute = s.route, f.Instance.setRoutePlane(s.start, s.route, s.end), this._messageTimer = 0, this._deviateTimer = 0, this._naving = !0;
        let a = {
          target: this._realTarget,
          distanceToEnd: f.Instance.matkers[0].distanceToEnd,
          nextAction: f.Instance.matkers[0].getNextAction().action,
          distanceToNextAction: f.Instance.matkers[0].getNextAction().distance,
          distanceToBreak: f.Instance.matkers[0].distanceToNextBreak
        };
        this.fire("nav_message", a), this.fire("route_ready", f.Instance.matkers, f.Instance.navPlanManager.plans), this._tryRegetRouteCount = 0;
      });
    }
    cancelNav() {
      this._naving = !1, console.log("3d:nav_calcel", this._target), this._target = null, this.path && this.path.clearPath(), this.flowArrow && this.flowArrow.hide(), this.navigator && this.navigator.over(), f.Instance.clear(), this.off("enter_trigger", this.onEnterTargetTirgger, this);
    }
    navArrive() {
      this._naving = !1;
      let i = {
        target: this._target,
        endAction: f.Instance.getMarker(f.Instance.markerCount - 1).action
      };
      this._target = null, this.path && this.path.clearPath(), this.flowArrow && this.flowArrow.hide(), this.navigator && this.navigator.over(), f.Instance.clear(), this.off("enter_trigger", this.onEnterTargetTirgger, this), this.fire("nav_arrive", this._realTarget, i.endAction), console.log("3d:nav_arrive", i);
    }
    navBreak() {
      let i = f.Instance.getBrekInfo();
      i && (this._naving = !1, this.path && this.path.clearPath(), this.flowArrow && this.flowArrow.hide(), this.navigator && this.navigator.reset(), this.fire("nav_break", i));
    }
    async getRoutePlan() {
      let i = this.cameraEntity.getPosition();
      console.log("3d:quireRoute", JSON.stringify({
        id: this.id,
        start: {
          x: i.x,
          y: i.y,
          z: i.z
        },
        end: this._endPos
      }));
      const s = await this.requestRoute({
        alg: {
          method: "astar",
          heuristic: 1
        },
        id: this.id,
        start: {
          x: i.x,
          y: i.y,
          z: i.z
        },
        end: this._endPos
      });
      if (console.log("3d: route res:", s), s.error) return console.error(s.error), this._naving = !1, null;
      if (s.route.length <= 0) return console.error("\u8DEF\u7B97\u8FD4\u56DE\u7A7A\u8DEF\u5F84"), null;
      if (s.start = {
        x: i.x,
        y: i.y,
        z: i.z
      }, ct(this._endPos)) s.end = this._endPos, this._realTarget = this._target;else if (vt(this._endPos)) {
        let a = null,
          r = 0,
          n = Number.MAX_VALUE,
          h = s.route[s.route.length - 1].position;
        this._endPos.forEach((o, l) => {
          let c = new g(h.x, h.y, h.z).distance(new g(o.x, o.y, o.z));
          c < n && (n = c, a = o, r = l);
        }), s.end = a, this._realTarget = this._target[r];
      } else s.end = null;
      return s;
    }
    regetRoutePlan() {
      this._tryRegetRouteCount++, this._tryRegetRouteCount <= this.maxTryRegetRouteCount ? this.getRoutePlan().then(i => {
        if (!i) return;
        let s = i.route,
          a = Math.min(s.length, this._rawRoute.length);
        for (let n = 1; n <= a; n++) if (this._rawRoute[this._rawRoute.length - n].id != s[s.length - n].id) {
          this.fire("nav_resetRoute"), console.log("3d:nav_resetRoute");
          break;
        }
        this._rawRoute = s, f.Instance.setRoutePlane(i.start, i.route, i.end), this._messageTimer = 0, this._deviateTimer = 0, this._naving = !0;
        let r = {
          target: this._realTarget,
          distanceToEnd: f.Instance.matkers[0].distanceToEnd,
          nextAction: f.Instance.matkers[0].getNextAction().action,
          distanceToNextAction: f.Instance.matkers[0].getNextAction().distance,
          distanceToBreak: f.Instance.matkers[0].distanceToNextBreak
        };
        this.fire("nav_message", r), this.fire("route_ready", f.Instance.matkers);
      }) : (console.warn("\u591A\u6B21\u91CD\u590D\u504F\u79BB\u8DEF\u7EBF,\u505C\u6B62\u8BF7\u6C42"), this.cancelNav(), this.fire("nav_maxRetryCount"));
    }
    onEnterTargetTirgger(i) {}
    setConfig(i) {
      i.id && (this.id = i.id), i.requestRoute && (this.requestRoute = i.requestRoute);
    }
    setId(i) {
      this.id = i;
    }
    navContinue() {
      this._naving || (f.Instance.setNextRoutePlan(), this._naving = !0);
    }
  }
  console.log("use nav-system --v3.0.4"), P.Floor = ht, P.LocationManager = tt, P.Mat3 = ot, P.Mat4 = I, P.NavManager = At, P.NavPlanManager = dt, P.PathType = U, P.PlanItem = gt, P.Quat = lt, P.RouteManager = f, P.SceneMarker = O, P.Vec2 = L, P.Vec3 = g, P.Vec4 = it, P.initNavSystem = Ct, P.markerTag = C, P.math = B, P.routeAction = y, Object.defineProperties(P, {
    __esModule: {
      value: !0
    },
    [Symbol.toStringTag]: {
      value: "Module"
    }
  });
});