import $my from "../$my";
/* 
* version: 1.0.0
* buildTime: 2024/1/3 15:14:48
*/
(function (U, L) {
  typeof exports == "object" && typeof module < "u" ? L(exports) : typeof define == "function" && define.amd ? define(["exports"], L) : (U = typeof globalThis < "u" ? globalThis : U || self, L(U["tiny-ar-plugin"] = {}));
})(this, function (U) {
  "use strict";

  var L = (n => (n[n.Camera = 1] = "Camera", n[n.Dof3 = 2] = "Dof3", n[n.Dof6 = 3] = "Dof6", n))(L || {}),
    X = (n => (n[n.ARSession = 1] = "ARSession", n[n.EasyAR = 2] = "EasyAR", n[n.VKSession = 3] = "VKSession", n))(X || {}),
    $ = (n => (n.WorldTracking = "worldTracking", n.OrientationTracking = "orientationTracking", n.CAMERA = "camera", n))($ || {});
  const Et = class {
    constructor() {
      this._systemInfo = null, this._isAliPay = null, this._isWeChat = null, this._isBrowser = null, this._isWeChat = typeof $my < "u" && !$my.isMy, this._isAliPay = typeof my < "u", this._isBrowser = typeof document < "u", this._updateSystemInfo();
    }
    static get instance() {
      return this._instance == null && (this._instance = new Et()), this._instance;
    }
    _updateSystemInfo() {
      if (this._isWeChat) {
        let n = $my.getSystemInfoSync();
        this._systemInfo = n;
      } else if (this._isAliPay) {
        let n = my.getSystemInfoSync();
        this._systemInfo = n;
      } else typeof document < "u" && (this._systemInfo = null);
    }
    get isAliPay() {
      return this._isAliPay;
    }
    get isWeChat() {
      return this._isWeChat;
    }
    get isBrowser() {
      return this._isBrowser;
    }
    get isIos() {
      if (this._isWeChat) return this._systemInfo.platform == "ios";
      if (this._isAliPay) return this._systemInfo.platform == "iOS" || this._systemInfo.platform == "iPhone OS";
      if (this._isBrowser) return navigator.userAgent.indexOf("iPhone") > -1;
    }
    get isAndroid() {
      if (this._isWeChat) return this._systemInfo.platform == "android";
      if (this._isAliPay) return this._systemInfo.platform == "Android";
      if (this._isBrowser) return navigator.userAgent.indexOf("Android") > -1;
    }
    get windowWidth() {
      return this._systemInfo.windowWidth;
    }
    get windowHeight() {
      return this._systemInfo.windowHeight;
    }
    get pixelRatio() {
      return this._systemInfo.pixelRatio;
    }
    loadPlugin(n) {
      if (this._isAliPay) return my.loadPlugin(n);
      if (this._isWeChat) return console.warn("\u5FAE\u4FE1\u5E73\u53F0\u4E0D\u652F\u6301 loadPlugin \u64CD\u4F5C"), null;
    }
  };
  let q = Et;
  q._instance = null;
  class se {
    constructor(t, e) {
      this._worldMatrix = null, this._projectMatrix = null, this._textureProject = null, this._initialized = !1, this._startCallBack = null, this.pc = t, this.app = e, this._worldMatrix = new t.Mat4(), this._projectMatrix = new t.Mat4(), this._textureProject = new t.Mat4(), this._viewWidth = e.graphicsDevice.canvas.width, this._viewHeight = e.graphicsDevice.canvas.height, this._near = .1, this._far = 1e3, console.log(`\u521B\u5EFA ARCtrl,viewWidth: ${this._viewWidth},viewHeight:${this._viewHeight}`);
    }
    create(t, e, s) {
      const i = () => {
        switch (this._curARMode = t.trackMode, this._curARMode) {
          case L.Dof6:
            this._curTrackMode = $.WorldTracking;
            break;
          case L.Dof3:
            this._curTrackMode = $.WorldTracking;
            break;
          case L.Camera:
            this._curTrackMode = $.CAMERA;
            break;
        }
        const r = this._curTrackMode;
        ARSession && ARSession.isSupported({
          mode: r
        }) ? ARSession.createSession({
          mode: r,
          success: a => {
            this.curARSession = a, e && e();
          },
          fail: () => {
            s && s();
          }
        }) : (console.error("\u4E0D\u652F\u6301:" + r), s && s());
      };
      this._initialized ? i() : (q.instance.isIos || q.instance.loadPlugin("ARSession"), ARSession ? (this._initialized = !0, i()) : (console.error("\u652F\u4ED8\u5B9D\u7248\u672C\u6709\u8BEF,\u672A\u5305\u542BARSession !"), s && s()));
    }
    update() {
      const t = this._curARFrame;
      if (t) {
        switch (this.updateTexture(), this._curARMode) {
          case L.Dof3:
          case L.Dof6:
            this.updatePosition(), N.instance.clsClient && N.instance.clsClient.updateFrame(t);
            break;
        }
        this.disposeFrame();
      }
    }
    start(t, e, s) {
      let i = !1;
      if (this.curARSession) {
        const r = {
          vw: this._viewWidth,
          vh: this._viewHeight,
          needImuFilter: !0
        };
        switch (this._curTrackMode) {
          case $.WorldTracking:
            i = this.curARSession.start(JSON.stringify(r));
            break;
          case $.OrientationTracking:
            i = this.curARSession.start(JSON.stringify(r));
            break;
          case $.CAMERA:
            i = this.curARSession.start(JSON.stringify(r));
            break;
        }
      } else console.error("start\u5931\u8D25,\u8BF7\u68C0\u67E5\u662F\u5426\u521B\u5EFA\u5B9E\u4F8B");
      this._startCallBack = s, i ? (this.app.xr.session || (console.info("\u5173\u95ED App3d \u81EA\u52A8\u5237\u65B0"), this.app.xr = {
        session: {
          requestAnimationFrame: () => {}
        },
        end: () => {},
        destroy: () => {}
      }), this.curARSession.onARFrame(r => {
        this._curARFrame = r, this.app.tick();
      }), t && t()) : e && e();
    }
    destroy() {
      ARSession.removeSession(), this.curARSession = null, this._bgMaterial && (this._bgMaterial.destroy(), this._bgMaterial = null);
    }
    resume() {}
    pause() {}
    onShow() {}
    onHide() {}
    updatePosition() {
      const {
          _curARFrame: t
        } = this,
        {
          camera: e
        } = t;
      switch (e.transform[12] /= 100, e.transform[13] /= 100, e.transform[14] /= 100, this._curARMode) {
        case L.Dof6:
          e.trackingState === "normal" && (this._worldMatrix.set(e.transform), this._projectMatrix.set(e.projection).transpose(), this._startCallBack && (this._startCallBack(), this._startCallBack = null));
          break;
        case L.Dof3:
          if (e.trackingState === "normal") {
            const r = this._worldMatrix;
            r.set(e.transform), r.data[12] = r.data[13] = r.data[14] = 0, this._projectMatrix.set(e.projection).transpose(), this._startCallBack && (this._startCallBack(), this._startCallBack = null);
          }
          break;
      }
      const {
        _near: s,
        _far: i
      } = this;
      this._projectMatrix.data[10] = (s + i) / (s - i), this._projectMatrix.data[14] = 2 * s * i / (s - i);
    }
    updateTexture() {
      const {
        capturedImage: t,
        width: e,
        height: s,
        capturedImageMatrix: i
      } = this._curARFrame;
      if (e * s > 0 && t && i) {
        this._textureY || (this._textureY = new this.pc.Texture(this.app.graphicsDevice, {
          width: e,
          height: s,
          format: this.pc.PIXELFORMAT_A8,
          mipmaps: !1,
          addressU: this.pc.ADDRESS_CLAMP_TO_EDGE,
          addressV: this.pc.ADDRESS_CLAMP_TO_EDGE
        }), this._bgMaterial && (this._bgMaterial.setParameter("u_frameY", this._textureY), this._bgMaterial.update()), this._textureUV = new this.pc.Texture(this.app.graphicsDevice, {
          width: e / 2,
          height: s / 2,
          format: this.pc.PIXELFORMAT_L8_A8,
          mipmaps: !1,
          addressU: this.pc.ADDRESS_CLAMP_TO_EDGE,
          addressV: this.pc.ADDRESS_CLAMP_TO_EDGE
        }), this._bgMaterial && (this._bgMaterial.setParameter("u_frameUV", this._textureUV), this._bgMaterial.update())), this._textureProject.set(i), this._bgMaterial && (this._bgMaterial.setParameter("u_proMatrix", this._textureProject.data), this._bgMaterial.update());
        const r = t.byteLength,
          a = e * s;
        let o = this._textureY.lock();
        o.set(new Uint8Array(t, 0, a)), this._textureY.unlock(), o = this._textureUV.lock(), o.set(new Uint8Array(t, a, r - a)), this._textureUV.unlock();
      }
    }
    getBackgroundMaterial() {
      if (this._bgMaterial) return this._bgMaterial;
      {
        const e = this.app.graphicsDevice,
          s = ["attribute vec3 POSITION;", "uniform mat4 u_proMatrix;", "varying vec2 v_uv;", "void main() {", "v_uv = (u_proMatrix * vec4(POSITION.x * 0.5 + 0.5, POSITION.y * 0.5 + 0.5, 1.0, 1.0)).xy;", "gl_Position = vec4( POSITION.xy, 1.0, 1.0);", "gl_Position.z = gl_Position.w;", "}"].join(`
`),
          i = [`precision ${e.precision} float;`, "uniform sampler2D u_frameY;", "uniform sampler2D u_frameUV;", "varying vec2 v_uv;", "", "void main() {", "  vec2 cbcr = texture2D(u_frameUV, v_uv).ra - vec2(0.5, 0.5);", "  vec3 ycbcr = vec3(texture2D(u_frameY, v_uv).a, cbcr);", "  vec3 rgb = mat3(1.0, 1.0, 1.0,0.0, -0.344136, 1.772,1.402, -0.714136, 0.0) * ycbcr;", "", "  gl_FragColor = vec4(rgb, 1.0);", "}"].join(`
`);
        return this._bgShader = new this.pc.Shader(e, {
          attributes: {
            POSITION: this.pc.SEMANTIC_POSITION
          },
          vshader: s,
          fshader: i
        }), this._bgMaterial = new this.pc.Material(), this._bgMaterial.shader = this._bgShader, this._bgMaterial.depthTest = !1, this._bgMaterial.depthWrite = !1, this._bgMaterial.update(), this._bgMaterial;
      }
    }
    disposeFrame() {
      this._curARFrame = null;
    }
  }
  var ht = (n => (n.motionTrack = "motionTrack", n.localizer = "localizer", n.rtct = "rtct", n.megaTrack = "megaTrack", n))(ht || {}),
    bt = (n => (n.VIO = "VIO", n.SLAM = "SLAM", n.ANCHOR = "ANCHOR", n.LARGE_SCALE = "LARGE_SCALE", n))(bt || {}),
    Q = (n => (n[n.notInit = 0] = "notInit", n[n.enable = 1] = "enable", n[n.disable = 2] = "disable", n))(Q || {});
  class Ft {
    constructor(t, e) {
      this.initialized = !1, this.arSupportMap = {}, this._worldMatrix = null, this._projectMatrix = null, this._textureProject = null, this.pc = t, this.app = e, this._worldMatrix = new t.Mat4(), this._projectMatrix = new t.Mat4(), this._textureProject = new t.Mat4(), this._viewWidth = e.graphicsDevice.canvas.width, this._viewHeight = e.graphicsDevice.canvas.height, this._near = .1, this._far = 1e3, console.log(`\u521B\u5EFA ARCtrl,viewWidth: ${this._viewWidth},viewHeight:${this._viewHeight}`);
    }
    create(t, e, s) {
      this._config = t;
      const i = () => {
        this._curARMode = t.trackMode;
        let r = t.useCls ? ht.megaTrack : ht.motionTrack,
          a;
        switch (this._curARMode) {
          case L.Camera:
            a = bt.VIO;
            break;
          case L.Dof3:
          case L.Dof6:
            a = bt.LARGE_SCALE;
            break;
        }
        this.canIUse(r, () => {
          const o = {
            mode: r,
            trackingMode: a,
            viewWidth: this._viewWidth,
            viewHeight: this._viewHeight,
            nearPlane: this._near,
            farPlane: this._far
          };
          r == ht.megaTrack && (o.apiKey = t.clsConfig.apiKey, o.apiSecret = t.clsConfig.apiSecret, o.appId = t.clsConfig.clsAppId, o.preferArEngine = !0), this.curARSession && ExpAREngine.destroyInstance(this.curARSession);
          try {
            this.curARSession = ExpAREngine.createInstance(o), e && e();
          } catch (_unused) {
            s && s();
          }
        }, () => {
          s && s();
        });
      };
      this.initialized ? i() : (q.instance.loadPlugin("ExpAR"), ExpARLoader ? ExpARLoader.load({
        success: () => {
          ExpAREngine.init({
            success: () => {
              this.initialized = !0, i();
            },
            fail: () => {
              s && s();
            }
          });
        },
        fail: () => {
          s && s();
        }
      }) : (console.info("[MY] onReady: expARLoader not defined"), s && s()));
    }
    start(t, e) {
      try {
        this.curARSession && this.curARSession.start(), t && t();
      } catch (_unused2) {
        e && e();
      }
    }
    update() {
      if (this.curARSession) {
        const t = this._curARFrame = this.curARSession.peekFrame();
        t && (this.updateTexture(), this.updatePosition(), N.instance.clsClient && N.instance.clsClient.updateFrame(t), this.disposeFrame());
      }
    }
    destroy() {
      this._curARFrame && (this.curARSession.disposeFrame(this._curARFrame), this._curARFrame = null), this.curARSession && (ExpAREngine.destroyInstance(this.curARSession), this.curARSession = null), this._bgMaterial && (this._bgMaterial.destroy(), this._bgMaterial = null);
    }
    canIUse(t, e, s) {
      switch (this.arSupportMap[t]) {
        case Q.enable:
          e();
          break;
        case Q.disable:
          s && s();
          break;
        default:
          ExpAREngine.isSupported({
            mode: t,
            complete: r => {
              if (r.isSupported) this.arSupportMap[t] = Q.enable, e();else try {
                ExpAREngine.downloadCalibration({
                  complete: function (a) {
                    a.status == 0 ? (this.arSupportMap[t] = Q.enable, e()) : (this.arSupportMap[t] = Q.disable, s && s());
                  }
                });
              } catch (_unused3) {
                s && s();
              }
            }
          });
          break;
      }
    }
    pause() {
      this.initialized && ExpAREngine.pause();
    }
    resume() {
      this.initialized && ExpAREngine.resume();
    }
    onShow() {
      this.resume();
    }
    onHide() {
      this.pause();
    }
    updatePosition() {
      const {
        camera: t,
        timestamp: e,
        results: s
      } = this._curARFrame;
      t.trackingStatus != -1 && (this._worldMatrix.set(t.transform).transpose(), this._projectMatrix.set(t.projection).transpose());
    }
    updateTexture() {
      const {
        image: t
      } = this._curARFrame;
      if (t) {
        const {
          pixelWidth: e,
          pixelHeight: s,
          rawData: i
        } = t;
        this._textureY || (this._textureY = new this.pc.Texture(this.app.graphicsDevice, {
          width: e,
          height: s,
          format: this.pc.PIXELFORMAT_A8,
          mipmaps: !1,
          addressU: this.pc.ADDRESS_CLAMP_TO_EDGE,
          addressV: this.pc.ADDRESS_CLAMP_TO_EDGE
        }), this._bgMaterial && (this._bgMaterial.setParameter("u_frameY", this._textureY), this._bgMaterial.update()), this._textureUV = new this.pc.Texture(this.app.graphicsDevice, {
          width: e / 2,
          height: s / 2,
          format: this.pc.PIXELFORMAT_L8_A8,
          mipmaps: !1,
          addressU: this.pc.ADDRESS_CLAMP_TO_EDGE,
          addressV: this.pc.ADDRESS_CLAMP_TO_EDGE
        }), this._bgMaterial && (this._bgMaterial.setParameter("u_frameUV", this._textureUV), this._bgMaterial.update())), this._textureProject.set(t.imageProjection).transpose(), this._bgMaterial && (this._bgMaterial.setParameter("u_proMatrix", this._textureProject.data), this._bgMaterial.update());
        const r = i.byteLength,
          a = e * s;
        let o = this._textureY.lock();
        o.set(new Uint8Array(i, 0, a)), this._textureY.unlock(), o = this._textureUV.lock(), o.set(new Uint8Array(i, a, r - a)), this._textureUV.unlock();
      }
    }
    getBackgroundMaterial() {
      if (this._bgMaterial) return this._bgMaterial;
      {
        const e = this.app.graphicsDevice,
          s = ["attribute vec3 POSITION;", "", "uniform mat4 u_proMatrix;", "varying vec2 v_uv;", "", "void main() {", "  v_uv = POSITION.xy * 0.5 + 0.5;", "  v_uv.y = 1.0 - v_uv.y;", "  vec4 position =  u_proMatrix * vec4(POSITION.xy, 1.0, 1.0);", "  position.z = position.w;", "  gl_Position = position;", "}"].join(`
`),
          i = [`precision ${e.precision} float;`, "uniform sampler2D u_frameY;", "uniform sampler2D u_frameUV;", "varying vec2 v_uv;", "", "void main() {", "  vec2 cbcr = texture2D(u_frameUV, v_uv).ar - vec2(0.5, 0.5);", "  vec3 ycbcr = vec3(texture2D(u_frameY, v_uv).a, cbcr);", "  vec3 rgb = mat3(1, 1, 1, 0, -0.344, 1.772, 1.402, -0.714, 0) * ycbcr;", "  gl_FragColor = vec4(rgb, 1.0);", "}"].join(`
`);
        return this._bgShader = new this.pc.Shader(e, {
          attributes: {
            POSITION: this.pc.SEMANTIC_POSITION
          },
          vshader: s,
          fshader: i
        }), this._bgMaterial = new this.pc.Material(), this._bgMaterial.shader = this._bgShader, this._bgMaterial.depthTest = !1, this._bgMaterial.depthWrite = !1, this._bgMaterial.update(), this._bgMaterial;
      }
    }
    setClsConfig(t) {
      this._config.clsConfig = t, this.start();
    }
    disposeFrame() {
      this._curARFrame && this.curARSession.disposeFrame(this._curARFrame), this._curARFrame = null;
    }
  }
  class j {
    constructor(t = 0, e = 0, s = 0) {
      this.x = t, this.y = e, this.z = s;
    }
    set(t, e, s) {
      this.x = t, this.y = e, this.z = s;
    }
    clone() {
      return new j(this.x, this.y, this.z);
    }
    scale(t) {
      return this.x *= t, this.y *= t, this.z *= t, this;
    }
    getLength() {
      let t = this.x * this.x + this.y * this.y + this.z * this.z;
      return Math.sqrt(t);
    }
    getLengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    normalize() {
      let t = this.x * this.x + this.y * this.x + this.z * this.z;
      if (t > 0) {
        var e = 1 / Math.sqrt(t);
        this.x *= e, this.y *= e, this.z *= e;
      }
      return this;
    }
    add(t) {
      return this.x += t.x, this.y += t.y, this.z += t.z, this;
    }
    sub(t) {
      return this.x -= t.x, this.y -= t.y, this.z -= t.z, this;
    }
    distance(t) {
      return this.clone().sub(t).getLength();
    }
    dot(t) {
      return this.x * t.x + this.y * t.y + this.z * t.z;
    }
    getAngle(t) {
      let e = this.dot(t) / (this.getLength() * t.getLength());
      return Math.acos(e) * 180 / Math.PI;
    }
  }
  class Ct {
    constructor() {
      this.x = 0, this.y = 0, this.z = 0, this.w = 0;
    }
    setFromMat4(t) {
      let e = this,
        s,
        i,
        r,
        a,
        o,
        l,
        h,
        f,
        p,
        c,
        m,
        u,
        _,
        g,
        w;
      return s = t.data[0], i = t.data[4], r = t.data[8], a = t.data[1], o = t.data[5], l = t.data[9], h = t.data[2], f = t.data[6], p = t.data[10], _ = s * s + i * i + r * r, _ === 0 || (_ = 1 / Math.sqrt(_), g = a * a + o * o + l * l, g === 0) || (g = 1 / Math.sqrt(g), w = h * h + f * f + p * p, w === 0) || (w = 1 / Math.sqrt(w), s *= _, i *= _, r *= _, a *= g, o *= g, l *= g, h *= w, f *= w, p *= w, c = s + o + p, c >= 0 ? (m = Math.sqrt(c + 1), e.w = m * .5, m = .5 / m, e.x = (l - f) * m, e.y = (h - r) * m, e.z = (i - a) * m) : s > o ? s > p ? (u = s - (o + p) + 1, u = Math.sqrt(u), e.x = u * .5, u = .5 / u, e.w = (l - f) * u, e.y = (i + a) * u, e.z = (r + h) * u) : (u = p - (s + o) + 1, u = Math.sqrt(u), e.z = u * .5, u = .5 / u, e.w = (i - a) * u, e.x = (h + r) * u, e.y = (f + l) * u) : o > p ? (u = o - (p + s) + 1, u = Math.sqrt(u), e.y = u * .5, u = .5 / u, e.w = (h - r) * u, e.z = (l + f) * u, e.x = (a + i) * u) : (u = p - (s + o) + 1, u = Math.sqrt(u), e.z = u * .5, u = .5 / u, e.w = (i - a) * u, e.x = (h + r) * u, e.y = (f + l) * u)), e;
    }
    slerp(t, e, s) {
      const i = t.x,
        r = t.y,
        a = t.z,
        o = t.w;
      let l = e.x,
        h = e.y,
        f = e.z,
        p = e.w,
        c = o * p + i * l + r * h + a * f;
      if (c < 0 && (p = -p, l = -l, h = -h, f = -f, c = -c), Math.abs(c) >= 1) return this.w = o, this.x = i, this.y = r, this.z = a, this;
      const m = Math.acos(c),
        u = Math.sqrt(1 - c * c);
      if (Math.abs(u) < .001) return this.w = o * .5 + p * .5, this.x = i * .5 + l * .5, this.y = r * .5 + h * .5, this.z = a * .5 + f * .5, this;
      const _ = Math.sin((1 - s) * m) / u,
        g = Math.sin(s * m) / u;
      return this.w = o * _ + p * g, this.x = i * _ + l * g, this.y = r * _ + h * g, this.z = a * _ + f * g, this;
    }
  }
  class T {
    constructor() {
      let t = new Float32Array(16);
      t[0] = t[5] = t[10] = t[15] = 1, this.data = t;
    }
    static fromArray(t) {
      return new T().set(t);
    }
    set(t) {
      for (let e = 0; e < t.length; e++) this.data[e] = t[e];
      return this;
    }
    clone() {
      let t = new T();
      return t.set(this.data), t;
    }
    transpose() {
      let t = this.data,
        e;
      return e = t[1], t[1] = t[4], t[4] = e, e = t[2], t[2] = t[8], t[8] = e, e = t[6], t[6] = t[9], t[9] = e, e = t[3], t[3] = t[12], t[12] = e, e = t[7], t[7] = t[13], t[13] = e, e = t[11], t[11] = t[14], t[14] = e, this;
    }
    getInverse() {
      let t = this.data,
        e = [],
        s = t[0],
        i = t[1],
        r = t[2],
        a = t[3],
        o = t[4],
        l = t[5],
        h = t[6],
        f = t[7],
        p = t[8],
        c = t[9],
        m = t[10],
        u = t[11],
        _ = t[12],
        g = t[13],
        w = t[14],
        y = t[15],
        x = c * w * f - g * m * f + g * h * u - l * w * u - c * h * y + l * m * y,
        I = _ * m * f - p * w * f - _ * h * u + o * w * u + p * h * y - o * m * y,
        R = p * g * f - _ * c * f + _ * l * u - o * g * u - p * l * y + o * c * y,
        C = _ * c * h - p * g * h - _ * l * m + o * g * m + p * l * w - o * c * w,
        b = s * x + i * I + r * R + a * C;
      if (b === 0) throw new Error("error!");
      let v = 1 / b;
      return e[0] = x * v, e[1] = (g * m * a - c * w * a - g * r * u + i * w * u + c * r * y - i * m * y) * v, e[2] = (l * w * a - g * h * a + g * r * f - i * w * f - l * r * y + i * h * y) * v, e[3] = (c * h * a - l * m * a - c * r * f + i * m * f + l * r * u - i * h * u) * v, e[4] = I * v, e[5] = (p * w * a - _ * m * a + _ * r * u - s * w * u - p * r * y + s * m * y) * v, e[6] = (_ * h * a - o * w * a - _ * r * f + s * w * f + o * r * y - s * h * y) * v, e[7] = (o * m * a - p * h * a + p * r * f - s * m * f - o * r * u + s * h * u) * v, e[8] = R * v, e[9] = (_ * c * a - p * g * a - _ * i * u + s * g * u + p * i * y - s * c * y) * v, e[10] = (o * g * a - _ * l * a + _ * i * f - s * g * f - o * i * y + s * l * y) * v, e[11] = (p * l * a - o * c * a - p * i * f + s * c * f + o * i * u - s * l * u) * v, e[12] = C * v, e[13] = (p * g * r - _ * c * r + _ * i * m - s * g * m - p * i * w + s * c * w) * v, e[14] = (_ * l * r - o * g * r - _ * i * h + s * g * h + o * i * w - s * l * w) * v, e[15] = (o * c * r - p * l * r + p * i * h - s * c * h - o * i * m + s * l * m) * v, this.data = new Float32Array(e), this;
    }
    determinant() {
      const t = this.data,
        e = t[0],
        s = t[4],
        i = t[8],
        r = t[12],
        a = t[1],
        o = t[5],
        l = t[9],
        h = t[13],
        f = t[2],
        p = t[6],
        c = t[10],
        m = t[14],
        u = t[3],
        _ = t[7],
        g = t[11],
        w = t[15];
      return u * (+r * l * p - i * h * p - r * o * c + s * h * c + i * o * m - s * l * m) + _ * (+e * l * m - e * h * c + r * a * c - i * a * m + i * h * f - r * l * f) + g * (+e * h * p - e * o * m - r * a * p + s * a * m + r * o * f - s * h * f) + w * (-i * o * f - e * l * p + e * o * c + i * a * p - s * a * c + s * l * f);
    }
    decompose() {
      const t = this.data;
      let e = new j(t[0], t[1], t[2]).getLength(),
        s = new j(t[4], t[5], t[6]).getLength(),
        i = new j(t[8], t[9], t[10]).getLength();
      this.determinant() < 0 && (e = -e);
      let r = new j(t[12], t[13], t[14]),
        a = new T();
      a.set(this.data);
      const o = 1 / e,
        l = 1 / s,
        h = 1 / i;
      a.data[0] *= o, a.data[1] *= o, a.data[2] *= o, a.data[4] *= l, a.data[5] *= l, a.data[6] *= l, a.data[8] *= h, a.data[9] *= h, a.data[10] *= h;
      let f = new j(e, s, i);
      return f.x = e, f.y = s, f.z = i, {
        position: r,
        rotation: a,
        scale: f
      };
    }
    compose(t, e, s) {
      const i = this.data,
        r = e.x,
        a = e.y,
        o = e.z,
        l = e.w,
        h = r + r,
        f = a + a,
        p = o + o,
        c = r * h,
        m = r * f,
        u = r * p,
        _ = a * f,
        g = a * p,
        w = o * p,
        y = l * h,
        x = l * f,
        I = l * p,
        R = s.x,
        C = s.y,
        b = s.z;
      return i[0] = (1 - (_ + w)) * R, i[1] = (m + I) * R, i[2] = (u - x) * R, i[3] = 0, i[4] = (m - I) * C, i[5] = (1 - (c + w)) * C, i[6] = (g + y) * C, i[7] = 0, i[8] = (u + x) * b, i[9] = (g - y) * b, i[10] = (1 - (c + _)) * b, i[11] = 0, i[12] = t.x, i[13] = t.y, i[14] = t.z, i[15] = 1, this;
    }
    multiplyMatrices(t, e) {
      const s = t.data,
        i = e.data,
        r = this.data,
        a = s[0],
        o = s[4],
        l = s[8],
        h = s[12],
        f = s[1],
        p = s[5],
        c = s[9],
        m = s[13],
        u = s[2],
        _ = s[6],
        g = s[10],
        w = s[14],
        y = s[3],
        x = s[7],
        I = s[11],
        R = s[15],
        C = i[0],
        b = i[4],
        v = i[8],
        S = i[12],
        M = i[1],
        F = i[5],
        E = i[9],
        V = i[13],
        z = i[2],
        mt = i[6],
        _t = i[10],
        gt = i[14],
        wt = i[3],
        vt = i[7],
        At = i[11],
        yt = i[15];
      return r[0] = a * C + o * M + l * z + h * wt, r[4] = a * b + o * F + l * mt + h * vt, r[8] = a * v + o * E + l * _t + h * At, r[12] = a * S + o * V + l * gt + h * yt, r[1] = f * C + p * M + c * z + m * wt, r[5] = f * b + p * F + c * mt + m * vt, r[9] = f * v + p * E + c * _t + m * At, r[13] = f * S + p * V + c * gt + m * yt, r[2] = u * C + _ * M + g * z + w * wt, r[6] = u * b + _ * F + g * mt + w * vt, r[10] = u * v + _ * E + g * _t + w * At, r[14] = u * S + _ * V + g * gt + w * yt, r[3] = y * C + x * M + I * z + R * wt, r[7] = y * b + x * F + I * mt + R * vt, r[11] = y * v + x * E + I * _t + R * At, r[15] = y * S + x * V + I * gt + R * yt, this;
    }
    makePerspective(t, e, s, i, r, a) {
      a === void 0 && console.warn("THREE.Matrix4: .makePerspective() has been redefined and has a new signature. Please check the docs.");
      const o = this.data,
        l = 2 * r / (e - t),
        h = 2 * r / (s - i),
        f = (e + t) / (e - t),
        p = (s + i) / (s - i),
        c = -(a + r) / (a - r),
        m = -2 * a * r / (a - r);
      return o[0] = l, o[4] = 0, o[8] = f, o[12] = 0, o[1] = 0, o[5] = h, o[9] = p, o[13] = 0, o[2] = 0, o[6] = 0, o[10] = c, o[14] = m, o[3] = 0, o[7] = 0, o[11] = -1, o[15] = 0, this;
    }
    makeOrthographic(t, e, s, i, r, a) {
      const o = this.data,
        l = 1 / (e - t),
        h = 1 / (s - i),
        f = 1 / (a - r),
        p = (e + t) * l,
        c = (s + i) * h,
        m = (a + r) * f;
      return o[0] = 2 * l, o[4] = 0, o[8] = 0, o[12] = -p, o[1] = 0, o[5] = 2 * h, o[9] = 0, o[13] = -c, o[2] = 0, o[6] = 0, o[10] = -2 * f, o[14] = -m, o[3] = 0, o[7] = 0, o[11] = 0, o[15] = 1, this;
    }
    mul2(t, e) {
      const s = t.data,
        i = e.data,
        r = this.data,
        a = s[0],
        o = s[1],
        l = s[2],
        h = s[3],
        f = s[4],
        p = s[5],
        c = s[6],
        m = s[7],
        u = s[8],
        _ = s[9],
        g = s[10],
        w = s[11],
        y = s[12],
        x = s[13],
        I = s[14],
        R = s[15];
      let C, b, v, S;
      return C = i[0], b = i[1], v = i[2], S = i[3], r[0] = a * C + f * b + u * v + y * S, r[1] = o * C + p * b + _ * v + x * S, r[2] = l * C + c * b + g * v + I * S, r[3] = h * C + m * b + w * v + R * S, C = i[4], b = i[5], v = i[6], S = i[7], r[4] = a * C + f * b + u * v + y * S, r[5] = o * C + p * b + _ * v + x * S, r[6] = l * C + c * b + g * v + I * S, r[7] = h * C + m * b + w * v + R * S, C = i[8], b = i[9], v = i[10], S = i[11], r[8] = a * C + f * b + u * v + y * S, r[9] = o * C + p * b + _ * v + x * S, r[10] = l * C + c * b + g * v + I * S, r[11] = h * C + m * b + w * v + R * S, C = i[12], b = i[13], v = i[14], S = i[15], r[12] = a * C + f * b + u * v + y * S, r[13] = o * C + p * b + _ * v + x * S, r[14] = l * C + c * b + g * v + I * S, r[15] = h * C + m * b + w * v + R * S, this;
    }
    mul(t) {
      return this.mul2(this, t);
    }
    setTRS(t, e, s) {
      var i, r, a, o, l, h, f, p, c, m, u, _, g, w, y, x, I, R, C, b, v, S, M;
      return i = t.x, r = t.y, a = t.z, o = e.x, l = e.y, h = e.z, f = e.w, p = s.x, c = s.y, m = s.z, u = o + o, _ = l + l, g = h + h, w = o * u, y = o * _, x = o * g, I = l * _, R = l * g, C = h * g, b = f * u, v = f * _, S = f * g, M = this.data, M[0] = (1 - (I + C)) * p, M[1] = (y + S) * p, M[2] = (x - v) * p, M[3] = 0, M[4] = (y - S) * c, M[5] = (1 - (w + C)) * c, M[6] = (R + b) * c, M[7] = 0, M[8] = (x + v) * m, M[9] = (R - b) * m, M[10] = (1 - (w + I)) * m, M[11] = 0, M[12] = i, M[13] = r, M[14] = a, M[15] = 1, this;
    }
    toJSON() {
      return Array.from(this.data);
    }
  }
  function ie(n, t) {
    n = n.split("."), t = t.split(".");
    const e = Math.max(n.length, t.length);
    for (; n.length < e;) n.push("0");
    for (; t.length < e;) t.push("0");
    for (let s = 0; s < e; s++) {
      const i = parseInt(n[s]),
        r = parseInt(t[s]);
      if (i > r) return 1;
      if (i < r) return -1;
    }
    return 0;
  }
  function re(n) {
    return ie(n, "4.3") >= 0;
  }
  function J(n, t) {
    if (!n) throw new Error(t);
  }
  function xt(n, t, e) {
    let s = 0;
    return function (...i) {
      if (Date.now() - s > t) return s = Date.now(), n.apply(e, i);
    };
  }
  const ne = "https://global.easyar.cn",
    ae = "https://aroc-api.easyar.com",
    oe = "https://cls-api.easyar.com",
    le = "https://clsv3-api.easyar.com",
    he = "https://uac.easyar.com",
    K = {
      globalUrl: ne,
      arocUrl: ae,
      clsUrl: oe,
      uacUrl: he,
      clsV3Url: le,
      emaUrl: "https://large-spatialmaps.easyar.com"
    };
  function ce(n, t) {
    return t && [K.clsV3Url, K.clsUrl].indexOf(t) < 0 ? t : re(n) ? K.clsV3Url : K.clsUrl;
  }
  var D = null;
  function Lt(n) {
    D = n;
  }
  function ue(n) {
    return D(`${K.globalUrl}/anonymous/cls/${n}`, "GET", {}, null, null);
  }
  function fe(n, t, e) {
    return D(`${n}/cls/arannotations`, "GET", {
      appId: t,
      pageNum: 1,
      pageSize: 100
    }, {
      authorization: e
    }, null);
  }
  function pe(n, t, e, s) {
    return D(`${n}/cls/arannotation/${t}`, "GET", {
      appId: e
    }, {
      authorization: s
    }, null);
  }
  function de(n, t) {
    return D("https://clsv3-api.easyar.com/cls/client/mega/info", "GET", {
      appId: n
    }, {
      authorization: t
    }, null);
  }
  const Pt = {};
  async function ct(n, t) {
    return `https://clsv3-api.easyar.com/${Pt[n] ? Pt[n] : (await de(n, t)).path}`;
  }
  function me(n) {
    let t = JSON.stringify(n);
    return D("https://posefusion.easyar.com/pose/v1", "POST", null, null, t);
  }
  async function _e(n, t, e, s, i) {
    let r = Object.keys(e || {}),
      a = r.length ? r.map(l => `${l}=${encodeURIComponent(e[l])}`).join("&") : void 0,
      o = {
        url: n + (a ? `?${a}` : ""),
        method: t,
        headers: {},
        data: void 0
      };
    return s && (o.headers = s), i && (o.data = i), new Promise((l, h) => {
      my.request({
        ...o,
        success: f => l(f.data),
        fail: f => h(f)
      });
    });
  }
  async function ge(n, t, e, s, i) {
    let r = Object.keys(e || {}),
      a = r.length ? r.map(l => `${l}=${encodeURIComponent(e[l])}`).join("&") : void 0,
      o = {
        url: n + (a ? `?${a}` : ""),
        method: t,
        header: {},
        data: void 0
      };
    return s && (o.header = s), i && (o.data = i), new Promise((l, h) => {
      $my.request({
        ...o,
        success: f => l(f.data),
        fail: f => h(f)
      });
    });
  }
  class we {
    constructor() {
      this._callbacks = {}, this._callbackActive = {};
    }
    initEventHandler() {
      this._callbacks = {}, this._callbackActive = {};
    }
    _addCallback(t, e, s, i = !1) {
      !t || typeof t != "string" || !e || (this._callbacks[t] || (this._callbacks[t] = []), this._callbackActive[t] && this._callbackActive[t] === this._callbacks[t] && (this._callbackActive[t] = this._callbackActive[t].slice()), this._callbacks[t].push({
        callback: e,
        scope: s || this,
        once: i
      }));
    }
    on(t, e, s) {
      return this._addCallback(t, e, s, !1), this;
    }
    off(t, e, s) {
      if (t) this._callbackActive[t] && this._callbackActive[t] === this._callbacks[t] && (this._callbackActive[t] = this._callbackActive[t].slice());else for (const i in this._callbackActive) this._callbacks[i] && this._callbacks[i] === this._callbackActive[i] && (this._callbackActive[i] = this._callbackActive[i].slice());
      if (!t) this._callbacks = {};else if (!e) this._callbacks[t] && (this._callbacks[t] = []);else {
        const i = this._callbacks[t];
        if (!i) return this;
        let r = i.length;
        for (let a = 0; a < r; a++) i[a].callback === e && (s && i[a].scope !== s || (i[a--] = i[--r]));
        i.length = r;
      }
      return this;
    }
    fire(t, ...e) {
      if (!t || !this._callbacks[t]) return this;
      let s;
      this._callbackActive[t] ? (this._callbackActive[t] === this._callbacks[t] && (this._callbackActive[t] = this._callbackActive[t].slice()), s = this._callbacks[t].slice()) : this._callbackActive[t] = this._callbacks[t];
      for (let i = 0; (s || this._callbackActive[t]) && i < (s || this._callbackActive[t]).length; i++) {
        const r = (s || this._callbackActive[t])[i];
        if (r.callback.call(r.scope, ...e), r.once) {
          const a = this._callbacks[t],
            o = a ? a.indexOf(r) : -1;
          o !== -1 && (this._callbackActive[t] === a && (this._callbackActive[t] = this._callbackActive[t].slice()), this._callbacks[t].splice(o, 1));
        }
      }
      return s || (this._callbackActive[t] = null), this;
    }
    once(t, e, s) {
      return this._addCallback(t, e, s, !0), this;
    }
    hasEvent(t) {
      return this._callbacks[t] && this._callbacks[t].length !== 0 || !1;
    }
  }
  const zt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  function Bt(n, t, e, s) {
    let i, r, a;
    const o = t || [0],
      l = (e = e || 0) >>> 3,
      h = s === -1 ? 3 : 0;
    for (i = 0; i < n.length; i += 1) a = i + l, r = a >>> 2, o.length <= r && o.push(0), o[r] |= n[i] << 8 * (h + s * (a % 4));
    return {
      value: o,
      binLen: 8 * n.length + e
    };
  }
  function Z(n, t, e) {
    switch (t) {
      case "UTF8":
      case "UTF16BE":
      case "UTF16LE":
        break;
      default:
        throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE");
    }
    switch (n) {
      case "HEX":
        return function (s, i, r) {
          return function (a, o, l, h) {
            let f, p, c, m;
            if (a.length % 2 != 0) throw new Error("String of HEX type must be in byte increments");
            const u = o || [0],
              _ = (l = l || 0) >>> 3,
              g = h === -1 ? 3 : 0;
            for (f = 0; f < a.length; f += 2) {
              if (p = parseInt(a.substr(f, 2), 16), isNaN(p)) throw new Error("String of HEX type contains invalid characters");
              for (m = (f >>> 1) + _, c = m >>> 2; u.length <= c;) u.push(0);
              u[c] |= p << 8 * (g + h * (m % 4));
            }
            return {
              value: u,
              binLen: 4 * a.length + l
            };
          }(s, i, r, e);
        };
      case "TEXT":
        return function (s, i, r) {
          return function (a, o, l, h, f) {
            let p,
              c,
              m,
              u,
              _,
              g,
              w,
              y,
              x = 0;
            const I = l || [0],
              R = (h = h || 0) >>> 3;
            if (o === "UTF8") for (w = f === -1 ? 3 : 0, m = 0; m < a.length; m += 1) for (p = a.charCodeAt(m), c = [], 128 > p ? c.push(p) : 2048 > p ? (c.push(192 | p >>> 6), c.push(128 | 63 & p)) : 55296 > p || 57344 <= p ? c.push(224 | p >>> 12, 128 | p >>> 6 & 63, 128 | 63 & p) : (m += 1, p = 65536 + ((1023 & p) << 10 | 1023 & a.charCodeAt(m)), c.push(240 | p >>> 18, 128 | p >>> 12 & 63, 128 | p >>> 6 & 63, 128 | 63 & p)), u = 0; u < c.length; u += 1) {
              for (g = x + R, _ = g >>> 2; I.length <= _;) I.push(0);
              I[_] |= c[u] << 8 * (w + f * (g % 4)), x += 1;
            } else for (w = f === -1 ? 2 : 0, y = o === "UTF16LE" && f !== 1 || o !== "UTF16LE" && f === 1, m = 0; m < a.length; m += 1) {
              for (p = a.charCodeAt(m), y === !0 && (u = 255 & p, p = u << 8 | p >>> 8), g = x + R, _ = g >>> 2; I.length <= _;) I.push(0);
              I[_] |= p << 8 * (w + f * (g % 4)), x += 2;
            }
            return {
              value: I,
              binLen: 8 * x + h
            };
          }(s, t, i, r, e);
        };
      case "B64":
        return function (s, i, r) {
          return function (a, o, l, h) {
            let f,
              p,
              c,
              m,
              u,
              _,
              g,
              w = 0;
            const y = o || [0],
              x = (l = l || 0) >>> 3,
              I = h === -1 ? 3 : 0,
              R = a.indexOf("=");
            if (a.search(/^[a-zA-Z0-9=+/]+$/) === -1) throw new Error("Invalid character in base-64 string");
            if (a = a.replace(/=/g, ""), R !== -1 && R < a.length) throw new Error("Invalid '=' found in base-64 string");
            for (p = 0; p < a.length; p += 4) {
              for (u = a.substr(p, 4), m = 0, c = 0; c < u.length; c += 1) f = zt.indexOf(u.charAt(c)), m |= f << 18 - 6 * c;
              for (c = 0; c < u.length - 1; c += 1) {
                for (g = w + x, _ = g >>> 2; y.length <= _;) y.push(0);
                y[_] |= (m >>> 16 - 8 * c & 255) << 8 * (I + h * (g % 4)), w += 1;
              }
            }
            return {
              value: y,
              binLen: 8 * w + l
            };
          }(s, i, r, e);
        };
      case "BYTES":
        return function (s, i, r) {
          return function (a, o, l, h) {
            let f, p, c, m;
            const u = o || [0],
              _ = (l = l || 0) >>> 3,
              g = h === -1 ? 3 : 0;
            for (p = 0; p < a.length; p += 1) f = a.charCodeAt(p), m = p + _, c = m >>> 2, u.length <= c && u.push(0), u[c] |= f << 8 * (g + h * (m % 4));
            return {
              value: u,
              binLen: 8 * a.length + l
            };
          }(s, i, r, e);
        };
      case "ARRAYBUFFER":
        try {
          new ArrayBuffer(0);
        } catch (_unused4) {
          throw new Error("ARRAYBUFFER not supported by this environment");
        }
        return function (s, i, r) {
          return function (a, o, l, h) {
            return Bt(new Uint8Array(a), o, l, h);
          }(s, i, r, e);
        };
      case "UINT8ARRAY":
        try {
          new Uint8Array(0);
        } catch (_unused5) {
          throw new Error("UINT8ARRAY not supported by this environment");
        }
        return function (s, i, r) {
          return Bt(s, i, r, e);
        };
      default:
        throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
    }
  }
  function Nt(n, t, e, s) {
    switch (n) {
      case "HEX":
        return function (i) {
          return function (r, a, o, l) {
            const h = "0123456789abcdef";
            let f,
              p,
              c = "";
            const m = a / 8,
              u = o === -1 ? 3 : 0;
            for (f = 0; f < m; f += 1) p = r[f >>> 2] >>> 8 * (u + o * (f % 4)), c += h.charAt(p >>> 4 & 15) + h.charAt(15 & p);
            return l.outputUpper ? c.toUpperCase() : c;
          }(i, t, e, s);
        };
      case "B64":
        return function (i) {
          return function (r, a, o, l) {
            let h,
              f,
              p,
              c,
              m,
              u = "";
            const _ = a / 8,
              g = o === -1 ? 3 : 0;
            for (h = 0; h < _; h += 3) for (c = h + 1 < _ ? r[h + 1 >>> 2] : 0, m = h + 2 < _ ? r[h + 2 >>> 2] : 0, p = (r[h >>> 2] >>> 8 * (g + o * (h % 4)) & 255) << 16 | (c >>> 8 * (g + o * ((h + 1) % 4)) & 255) << 8 | m >>> 8 * (g + o * ((h + 2) % 4)) & 255, f = 0; f < 4; f += 1) u += 8 * h + 6 * f <= a ? zt.charAt(p >>> 6 * (3 - f) & 63) : l.b64Pad;
            return u;
          }(i, t, e, s);
        };
      case "BYTES":
        return function (i) {
          return function (r, a, o) {
            let l,
              h,
              f = "";
            const p = a / 8,
              c = o === -1 ? 3 : 0;
            for (l = 0; l < p; l += 1) h = r[l >>> 2] >>> 8 * (c + o * (l % 4)) & 255, f += String.fromCharCode(h);
            return f;
          }(i, t, e);
        };
      case "ARRAYBUFFER":
        try {
          new ArrayBuffer(0);
        } catch (_unused6) {
          throw new Error("ARRAYBUFFER not supported by this environment");
        }
        return function (i) {
          return function (r, a, o) {
            let l;
            const h = a / 8,
              f = new ArrayBuffer(h),
              p = new Uint8Array(f),
              c = o === -1 ? 3 : 0;
            for (l = 0; l < h; l += 1) p[l] = r[l >>> 2] >>> 8 * (c + o * (l % 4)) & 255;
            return f;
          }(i, t, e);
        };
      case "UINT8ARRAY":
        try {
          new Uint8Array(0);
        } catch (_unused7) {
          throw new Error("UINT8ARRAY not supported by this environment");
        }
        return function (i) {
          return function (r, a, o) {
            let l;
            const h = a / 8,
              f = o === -1 ? 3 : 0,
              p = new Uint8Array(h);
            for (l = 0; l < h; l += 1) p[l] = r[l >>> 2] >>> 8 * (f + o * (l % 4)) & 255;
            return p;
          }(i, t, e);
        };
      default:
        throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
    }
  }
  const A = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298],
    G = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428],
    Y = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225],
    st = "Chosen SHA variant is not supported";
  function ut(n, t) {
    let e, s;
    const i = n.binLen >>> 3,
      r = t.binLen >>> 3,
      a = i << 3,
      o = 4 - i << 3;
    if (i % 4 != 0) {
      for (e = 0; e < r; e += 4) s = i + e >>> 2, n.value[s] |= t.value[e >>> 2] << a, n.value.push(0), n.value[s + 1] |= t.value[e >>> 2] >>> o;
      return (n.value.length << 2) - 4 >= r + i && n.value.pop(), {
        value: n.value,
        binLen: n.binLen + t.binLen
      };
    }
    return {
      value: n.value.concat(t.value),
      binLen: n.binLen + t.binLen
    };
  }
  function Ut(n) {
    const t = {
        outputUpper: !1,
        b64Pad: "=",
        outputLen: -1
      },
      e = n || {},
      s = "Output length must be a multiple of 8";
    if (t.outputUpper = e.outputUpper || !1, e.b64Pad && (t.b64Pad = e.b64Pad), e.outputLen) {
      if (e.outputLen % 8 != 0) throw new Error(s);
      t.outputLen = e.outputLen;
    } else if (e.shakeLen) {
      if (e.shakeLen % 8 != 0) throw new Error(s);
      t.outputLen = e.shakeLen;
    }
    if (typeof t.outputUpper != "boolean") throw new Error("Invalid outputUpper formatting option");
    if (typeof t.b64Pad != "string") throw new Error("Invalid b64Pad formatting option");
    return t;
  }
  function W(n, t, e, s) {
    const i = n + " must include a value and format";
    if (!t) {
      if (!s) throw new Error(i);
      return s;
    }
    if (t.value === void 0 || !t.format) throw new Error(i);
    return Z(t.format, t.encoding || "UTF8", e)(t.value);
  }
  class ft {
    constructor(t, e, s) {
      const i = s || {};
      if (this.t = e, this.i = i.encoding || "UTF8", this.numRounds = i.numRounds || 1, isNaN(this.numRounds) || this.numRounds !== parseInt(this.numRounds, 10) || 1 > this.numRounds) throw new Error("numRounds must a integer >= 1");
      this.o = t, this.h = [], this.u = 0, this.l = !1, this.A = 0, this.H = !1, this.S = [], this.p = [];
    }
    update(t) {
      let e,
        s = 0;
      const i = this.m >>> 5,
        r = this.C(t, this.h, this.u),
        a = r.binLen,
        o = r.value,
        l = a >>> 5;
      for (e = 0; e < l; e += i) s + this.m <= a && (this.R = this.U(o.slice(e, e + i), this.R), s += this.m);
      return this.A += s, this.h = o.slice(s >>> 5), this.u = a % this.m, this.l = !0, this;
    }
    getHash(t, e) {
      let s,
        i,
        r = this.v;
      const a = Ut(e);
      if (this.K) {
        if (a.outputLen === -1) throw new Error("Output length must be specified in options");
        r = a.outputLen;
      }
      const o = Nt(t, r, this.T, a);
      if (this.H && this.F) return o(this.F(a));
      for (i = this.g(this.h.slice(), this.u, this.A, this.B(this.R), r), s = 1; s < this.numRounds; s += 1) this.K && r % 32 != 0 && (i[i.length - 1] &= 16777215 >>> 24 - r % 32), i = this.g(i, r, 0, this.L(this.o), r);
      return o(i);
    }
    setHMACKey(t, e, s) {
      if (!this.M) throw new Error("Variant does not support HMAC");
      if (this.l) throw new Error("Cannot set MAC key after calling update");
      const i = Z(e, (s || {}).encoding || "UTF8", this.T);
      this.k(i(t));
    }
    k(t) {
      const e = this.m >>> 3,
        s = e / 4 - 1;
      let i;
      if (this.numRounds !== 1) throw new Error("Cannot set numRounds with MAC");
      if (this.H) throw new Error("MAC key already set");
      for (e < t.binLen / 8 && (t.value = this.g(t.value, t.binLen, 0, this.L(this.o), this.v)); t.value.length <= s;) t.value.push(0);
      for (i = 0; i <= s; i += 1) this.S[i] = 909522486 ^ t.value[i], this.p[i] = 1549556828 ^ t.value[i];
      this.R = this.U(this.S, this.R), this.A = this.m, this.H = !0;
    }
    getHMAC(t, e) {
      const s = Ut(e);
      return Nt(t, this.v, this.T, s)(this.Y());
    }
    Y() {
      let t;
      if (!this.H) throw new Error("Cannot call getHMAC without first setting MAC key");
      const e = this.g(this.h.slice(), this.u, this.A, this.B(this.R), this.v);
      return t = this.U(this.p, this.L(this.o)), t = this.g(e, this.v, this.m, t, this.v), t;
    }
  }
  function tt(n, t) {
    return n << t | n >>> 32 - t;
  }
  function O(n, t) {
    return n >>> t | n << 32 - t;
  }
  function Dt(n, t) {
    return n >>> t;
  }
  function Ot(n, t, e) {
    return n ^ t ^ e;
  }
  function Ht(n, t, e) {
    return n & t ^ ~n & e;
  }
  function Vt(n, t, e) {
    return n & t ^ n & e ^ t & e;
  }
  function ve(n) {
    return O(n, 2) ^ O(n, 13) ^ O(n, 22);
  }
  function P(n, t) {
    const e = (65535 & n) + (65535 & t);
    return (65535 & (n >>> 16) + (t >>> 16) + (e >>> 16)) << 16 | 65535 & e;
  }
  function Ae(n, t, e, s) {
    const i = (65535 & n) + (65535 & t) + (65535 & e) + (65535 & s);
    return (65535 & (n >>> 16) + (t >>> 16) + (e >>> 16) + (s >>> 16) + (i >>> 16)) << 16 | 65535 & i;
  }
  function it(n, t, e, s, i) {
    const r = (65535 & n) + (65535 & t) + (65535 & e) + (65535 & s) + (65535 & i);
    return (65535 & (n >>> 16) + (t >>> 16) + (e >>> 16) + (s >>> 16) + (i >>> 16) + (r >>> 16)) << 16 | 65535 & r;
  }
  function ye(n) {
    return O(n, 7) ^ O(n, 18) ^ Dt(n, 3);
  }
  function be(n) {
    return O(n, 6) ^ O(n, 11) ^ O(n, 25);
  }
  function Ce(n) {
    return [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
  }
  function jt(n, t) {
    let e, s, i, r, a, o, l;
    const h = [];
    for (e = t[0], s = t[1], i = t[2], r = t[3], a = t[4], l = 0; l < 80; l += 1) h[l] = l < 16 ? n[l] : tt(h[l - 3] ^ h[l - 8] ^ h[l - 14] ^ h[l - 16], 1), o = l < 20 ? it(tt(e, 5), Ht(s, i, r), a, 1518500249, h[l]) : l < 40 ? it(tt(e, 5), Ot(s, i, r), a, 1859775393, h[l]) : l < 60 ? it(tt(e, 5), Vt(s, i, r), a, 2400959708, h[l]) : it(tt(e, 5), Ot(s, i, r), a, 3395469782, h[l]), a = r, r = i, i = tt(s, 30), s = e, e = o;
    return t[0] = P(e, t[0]), t[1] = P(s, t[1]), t[2] = P(i, t[2]), t[3] = P(r, t[3]), t[4] = P(a, t[4]), t;
  }
  function xe(n, t, e, s) {
    let i;
    const r = 15 + (t + 65 >>> 9 << 4),
      a = t + e;
    for (; n.length <= r;) n.push(0);
    for (n[t >>> 5] |= 128 << 24 - t % 32, n[r] = 4294967295 & a, n[r - 1] = a / 4294967296 | 0, i = 0; i < n.length; i += 16) s = jt(n.slice(i, i + 16), s);
    return s;
  }
  class Ie extends ft {
    constructor(t, e, s) {
      if (t !== "SHA-1") throw new Error(st);
      super(t, e, s);
      const i = s || {};
      this.M = !0, this.F = this.Y, this.T = -1, this.C = Z(this.t, this.i, this.T), this.U = jt, this.B = function (r) {
        return r.slice();
      }, this.L = Ce, this.g = xe, this.R = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.m = 512, this.v = 160, this.K = !1, i.hmacKey && this.k(W("hmacKey", i.hmacKey, this.T));
    }
  }
  function Kt(n) {
    let t;
    return t = n == "SHA-224" ? G.slice() : Y.slice(), t;
  }
  function Gt(n, t) {
    let e, s, i, r, a, o, l, h, f, p, c;
    const m = [];
    for (e = t[0], s = t[1], i = t[2], r = t[3], a = t[4], o = t[5], l = t[6], h = t[7], c = 0; c < 64; c += 1) m[c] = c < 16 ? n[c] : Ae(O(u = m[c - 2], 17) ^ O(u, 19) ^ Dt(u, 10), m[c - 7], ye(m[c - 15]), m[c - 16]), f = it(h, be(a), Ht(a, o, l), A[c], m[c]), p = P(ve(e), Vt(e, s, i)), h = l, l = o, o = a, a = P(r, f), r = i, i = s, s = e, e = P(f, p);
    var u;
    return t[0] = P(e, t[0]), t[1] = P(s, t[1]), t[2] = P(i, t[2]), t[3] = P(r, t[3]), t[4] = P(a, t[4]), t[5] = P(o, t[5]), t[6] = P(l, t[6]), t[7] = P(h, t[7]), t;
  }
  class Re extends ft {
    constructor(t, e, s) {
      if (t !== "SHA-224" && t !== "SHA-256") throw new Error(st);
      super(t, e, s);
      const i = s || {};
      this.F = this.Y, this.M = !0, this.T = -1, this.C = Z(this.t, this.i, this.T), this.U = Gt, this.B = function (r) {
        return r.slice();
      }, this.L = Kt, this.g = function (r, a, o, l) {
        return function (h, f, p, c, m) {
          let u, _;
          const g = 15 + (f + 65 >>> 9 << 4),
            w = f + p;
          for (; h.length <= g;) h.push(0);
          for (h[f >>> 5] |= 128 << 24 - f % 32, h[g] = 4294967295 & w, h[g - 1] = w / 4294967296 | 0, u = 0; u < h.length; u += 16) c = Gt(h.slice(u, u + 16), c);
          return _ = m === "SHA-224" ? [c[0], c[1], c[2], c[3], c[4], c[5], c[6]] : c, _;
        }(r, a, o, l, t);
      }, this.R = Kt(t), this.m = 512, this.v = t === "SHA-224" ? 224 : 256, this.K = !1, i.hmacKey && this.k(W("hmacKey", i.hmacKey, this.T));
    }
  }
  class d {
    constructor(t, e) {
      this.N = t, this.I = e;
    }
  }
  function Yt(n, t) {
    let e;
    return t > 32 ? (e = 64 - t, new d(n.I << t | n.N >>> e, n.N << t | n.I >>> e)) : t !== 0 ? (e = 32 - t, new d(n.N << t | n.I >>> e, n.I << t | n.N >>> e)) : n;
  }
  function H(n, t) {
    let e;
    return t < 32 ? (e = 32 - t, new d(n.N >>> t | n.I << e, n.I >>> t | n.N << e)) : (e = 64 - t, new d(n.I >>> t | n.N << e, n.N >>> t | n.I << e));
  }
  function Xt(n, t) {
    return new d(n.N >>> t, n.I >>> t | n.N << 32 - t);
  }
  function Se(n, t, e) {
    return new d(n.N & t.N ^ n.N & e.N ^ t.N & e.N, n.I & t.I ^ n.I & e.I ^ t.I & e.I);
  }
  function Me(n) {
    const t = H(n, 28),
      e = H(n, 34),
      s = H(n, 39);
    return new d(t.N ^ e.N ^ s.N, t.I ^ e.I ^ s.I);
  }
  function B(n, t) {
    let e, s;
    e = (65535 & n.I) + (65535 & t.I), s = (n.I >>> 16) + (t.I >>> 16) + (e >>> 16);
    const i = (65535 & s) << 16 | 65535 & e;
    return e = (65535 & n.N) + (65535 & t.N) + (s >>> 16), s = (n.N >>> 16) + (t.N >>> 16) + (e >>> 16), new d((65535 & s) << 16 | 65535 & e, i);
  }
  function ke(n, t, e, s) {
    let i, r;
    i = (65535 & n.I) + (65535 & t.I) + (65535 & e.I) + (65535 & s.I), r = (n.I >>> 16) + (t.I >>> 16) + (e.I >>> 16) + (s.I >>> 16) + (i >>> 16);
    const a = (65535 & r) << 16 | 65535 & i;
    return i = (65535 & n.N) + (65535 & t.N) + (65535 & e.N) + (65535 & s.N) + (r >>> 16), r = (n.N >>> 16) + (t.N >>> 16) + (e.N >>> 16) + (s.N >>> 16) + (i >>> 16), new d((65535 & r) << 16 | 65535 & i, a);
  }
  function Te(n, t, e, s, i) {
    let r, a;
    r = (65535 & n.I) + (65535 & t.I) + (65535 & e.I) + (65535 & s.I) + (65535 & i.I), a = (n.I >>> 16) + (t.I >>> 16) + (e.I >>> 16) + (s.I >>> 16) + (i.I >>> 16) + (r >>> 16);
    const o = (65535 & a) << 16 | 65535 & r;
    return r = (65535 & n.N) + (65535 & t.N) + (65535 & e.N) + (65535 & s.N) + (65535 & i.N) + (a >>> 16), a = (n.N >>> 16) + (t.N >>> 16) + (e.N >>> 16) + (s.N >>> 16) + (i.N >>> 16) + (r >>> 16), new d((65535 & a) << 16 | 65535 & r, o);
  }
  function rt(n, t) {
    return new d(n.N ^ t.N, n.I ^ t.I);
  }
  function Ee(n) {
    const t = H(n, 19),
      e = H(n, 61),
      s = Xt(n, 6);
    return new d(t.N ^ e.N ^ s.N, t.I ^ e.I ^ s.I);
  }
  function Fe(n) {
    const t = H(n, 1),
      e = H(n, 8),
      s = Xt(n, 7);
    return new d(t.N ^ e.N ^ s.N, t.I ^ e.I ^ s.I);
  }
  function Le(n) {
    const t = H(n, 14),
      e = H(n, 18),
      s = H(n, 41);
    return new d(t.N ^ e.N ^ s.N, t.I ^ e.I ^ s.I);
  }
  const Pe = [new d(A[0], 3609767458), new d(A[1], 602891725), new d(A[2], 3964484399), new d(A[3], 2173295548), new d(A[4], 4081628472), new d(A[5], 3053834265), new d(A[6], 2937671579), new d(A[7], 3664609560), new d(A[8], 2734883394), new d(A[9], 1164996542), new d(A[10], 1323610764), new d(A[11], 3590304994), new d(A[12], 4068182383), new d(A[13], 991336113), new d(A[14], 633803317), new d(A[15], 3479774868), new d(A[16], 2666613458), new d(A[17], 944711139), new d(A[18], 2341262773), new d(A[19], 2007800933), new d(A[20], 1495990901), new d(A[21], 1856431235), new d(A[22], 3175218132), new d(A[23], 2198950837), new d(A[24], 3999719339), new d(A[25], 766784016), new d(A[26], 2566594879), new d(A[27], 3203337956), new d(A[28], 1034457026), new d(A[29], 2466948901), new d(A[30], 3758326383), new d(A[31], 168717936), new d(A[32], 1188179964), new d(A[33], 1546045734), new d(A[34], 1522805485), new d(A[35], 2643833823), new d(A[36], 2343527390), new d(A[37], 1014477480), new d(A[38], 1206759142), new d(A[39], 344077627), new d(A[40], 1290863460), new d(A[41], 3158454273), new d(A[42], 3505952657), new d(A[43], 106217008), new d(A[44], 3606008344), new d(A[45], 1432725776), new d(A[46], 1467031594), new d(A[47], 851169720), new d(A[48], 3100823752), new d(A[49], 1363258195), new d(A[50], 3750685593), new d(A[51], 3785050280), new d(A[52], 3318307427), new d(A[53], 3812723403), new d(A[54], 2003034995), new d(A[55], 3602036899), new d(A[56], 1575990012), new d(A[57], 1125592928), new d(A[58], 2716904306), new d(A[59], 442776044), new d(A[60], 593698344), new d(A[61], 3733110249), new d(A[62], 2999351573), new d(A[63], 3815920427), new d(3391569614, 3928383900), new d(3515267271, 566280711), new d(3940187606, 3454069534), new d(4118630271, 4000239992), new d(116418474, 1914138554), new d(174292421, 2731055270), new d(289380356, 3203993006), new d(460393269, 320620315), new d(685471733, 587496836), new d(852142971, 1086792851), new d(1017036298, 365543100), new d(1126000580, 2618297676), new d(1288033470, 3409855158), new d(1501505948, 4234509866), new d(1607167915, 987167468), new d(1816402316, 1246189591)];
  function qt(n) {
    return n === "SHA-384" ? [new d(3418070365, G[0]), new d(1654270250, G[1]), new d(2438529370, G[2]), new d(355462360, G[3]), new d(1731405415, G[4]), new d(41048885895, G[5]), new d(3675008525, G[6]), new d(1203062813, G[7])] : [new d(Y[0], 4089235720), new d(Y[1], 2227873595), new d(Y[2], 4271175723), new d(Y[3], 1595750129), new d(Y[4], 2917565137), new d(Y[5], 725511199), new d(Y[6], 4215389547), new d(Y[7], 327033209)];
  }
  function Wt(n, t) {
    let e, s, i, r, a, o, l, h, f, p, c, m;
    const u = [];
    for (e = t[0], s = t[1], i = t[2], r = t[3], a = t[4], o = t[5], l = t[6], h = t[7], c = 0; c < 80; c += 1) c < 16 ? (m = 2 * c, u[c] = new d(n[m], n[m + 1])) : u[c] = ke(Ee(u[c - 2]), u[c - 7], Fe(u[c - 15]), u[c - 16]), f = Te(h, Le(a), (g = o, w = l, new d((_ = a).N & g.N ^ ~_.N & w.N, _.I & g.I ^ ~_.I & w.I)), Pe[c], u[c]), p = B(Me(e), Se(e, s, i)), h = l, l = o, o = a, a = B(r, f), r = i, i = s, s = e, e = B(f, p);
    var _, g, w;
    return t[0] = B(e, t[0]), t[1] = B(s, t[1]), t[2] = B(i, t[2]), t[3] = B(r, t[3]), t[4] = B(a, t[4]), t[5] = B(o, t[5]), t[6] = B(l, t[6]), t[7] = B(h, t[7]), t;
  }
  class ze extends ft {
    constructor(t, e, s) {
      if (t !== "SHA-384" && t !== "SHA-512") throw new Error(st);
      super(t, e, s);
      const i = s || {};
      this.F = this.Y, this.M = !0, this.T = -1, this.C = Z(this.t, this.i, this.T), this.U = Wt, this.B = function (r) {
        return r.slice();
      }, this.L = qt, this.g = function (r, a, o, l) {
        return function (h, f, p, c, m) {
          let u, _;
          const g = 31 + (f + 129 >>> 10 << 5),
            w = f + p;
          for (; h.length <= g;) h.push(0);
          for (h[f >>> 5] |= 128 << 24 - f % 32, h[g] = 4294967295 & w, h[g - 1] = w / 4294967296 | 0, u = 0; u < h.length; u += 32) c = Wt(h.slice(u, u + 32), c);
          return _ = m === "SHA-384" ? [c[0].N, c[0].I, c[1].N, c[1].I, c[2].N, c[2].I, c[3].N, c[3].I, c[4].N, c[4].I, c[5].N, c[5].I] : [c[0].N, c[0].I, c[1].N, c[1].I, c[2].N, c[2].I, c[3].N, c[3].I, c[4].N, c[4].I, c[5].N, c[5].I, c[6].N, c[6].I, c[7].N, c[7].I], _;
        }(r, a, o, l, t);
      }, this.R = qt(t), this.m = 1024, this.v = t === "SHA-384" ? 384 : 512, this.K = !1, i.hmacKey && this.k(W("hmacKey", i.hmacKey, this.T));
    }
  }
  const Be = [new d(0, 1), new d(0, 32898), new d(2147483648, 32906), new d(2147483648, 2147516416), new d(0, 32907), new d(0, 2147483649), new d(2147483648, 2147516545), new d(2147483648, 32777), new d(0, 138), new d(0, 136), new d(0, 2147516425), new d(0, 2147483658), new d(0, 2147516555), new d(2147483648, 139), new d(2147483648, 32905), new d(2147483648, 32771), new d(2147483648, 32770), new d(2147483648, 128), new d(0, 32778), new d(2147483648, 2147483658), new d(2147483648, 2147516545), new d(2147483648, 32896), new d(0, 2147483649), new d(2147483648, 2147516424)],
    Ne = [[0, 36, 3, 41, 18], [1, 44, 10, 45, 2], [62, 6, 43, 15, 61], [28, 55, 25, 21, 56], [27, 20, 39, 8, 14]];
  function It(n) {
    let t;
    const e = [];
    for (t = 0; t < 5; t += 1) e[t] = [new d(0, 0), new d(0, 0), new d(0, 0), new d(0, 0), new d(0, 0)];
    return e;
  }
  function Ue(n) {
    let t;
    const e = [];
    for (t = 0; t < 5; t += 1) e[t] = n[t].slice();
    return e;
  }
  function pt(n, t) {
    let e, s, i, r;
    const a = [],
      o = [];
    if (n !== null) for (s = 0; s < n.length; s += 2) t[(s >>> 1) % 5][(s >>> 1) / 5 | 0] = rt(t[(s >>> 1) % 5][(s >>> 1) / 5 | 0], new d(n[s + 1], n[s]));
    for (e = 0; e < 24; e += 1) {
      for (r = It(), s = 0; s < 5; s += 1) a[s] = (l = t[s][0], h = t[s][1], f = t[s][2], p = t[s][3], c = t[s][4], new d(l.N ^ h.N ^ f.N ^ p.N ^ c.N, l.I ^ h.I ^ f.I ^ p.I ^ c.I));
      for (s = 0; s < 5; s += 1) o[s] = rt(a[(s + 4) % 5], Yt(a[(s + 1) % 5], 1));
      for (s = 0; s < 5; s += 1) for (i = 0; i < 5; i += 1) t[s][i] = rt(t[s][i], o[s]);
      for (s = 0; s < 5; s += 1) for (i = 0; i < 5; i += 1) r[i][(2 * s + 3 * i) % 5] = Yt(t[s][i], Ne[s][i]);
      for (s = 0; s < 5; s += 1) for (i = 0; i < 5; i += 1) t[s][i] = rt(r[s][i], new d(~r[(s + 1) % 5][i].N & r[(s + 2) % 5][i].N, ~r[(s + 1) % 5][i].I & r[(s + 2) % 5][i].I));
      t[0][0] = rt(t[0][0], Be[e]);
    }
    var l, h, f, p, c;
    return t;
  }
  function $t(n) {
    let t,
      e,
      s = 0;
    const i = [0, 0],
      r = [4294967295 & n, n / 4294967296 & 2097151];
    for (t = 6; t >= 0; t--) e = r[t >> 2] >>> 8 * t & 255, e === 0 && s === 0 || (i[s + 1 >> 2] |= e << 8 * (s + 1), s += 1);
    return s = s !== 0 ? s : 1, i[0] |= s, {
      value: s + 1 > 4 ? i : [i[0]],
      binLen: 8 + 8 * s
    };
  }
  function Rt(n) {
    return ut($t(n.binLen), n);
  }
  function Jt(n, t) {
    let e,
      s = $t(t);
    s = ut(s, n);
    const i = t >>> 2,
      r = (i - s.value.length % i) % i;
    for (e = 0; e < r; e++) s.value.push(0);
    return s.value;
  }
  class De extends ft {
    constructor(t, e, s) {
      let i = 6,
        r = 0;
      super(t, e, s);
      const a = s || {};
      if (this.numRounds !== 1) {
        if (a.kmacKey || a.hmacKey) throw new Error("Cannot set numRounds with MAC");
        if (this.o === "CSHAKE128" || this.o === "CSHAKE256") throw new Error("Cannot set numRounds for CSHAKE variants");
      }
      switch (this.T = 1, this.C = Z(this.t, this.i, this.T), this.U = pt, this.B = Ue, this.L = It, this.R = It(), this.K = !1, t) {
        case "SHA3-224":
          this.m = r = 1152, this.v = 224, this.M = !0, this.F = this.Y;
          break;
        case "SHA3-256":
          this.m = r = 1088, this.v = 256, this.M = !0, this.F = this.Y;
          break;
        case "SHA3-384":
          this.m = r = 832, this.v = 384, this.M = !0, this.F = this.Y;
          break;
        case "SHA3-512":
          this.m = r = 576, this.v = 512, this.M = !0, this.F = this.Y;
          break;
        case "SHAKE128":
          i = 31, this.m = r = 1344, this.v = -1, this.K = !0, this.M = !1, this.F = null;
          break;
        case "SHAKE256":
          i = 31, this.m = r = 1088, this.v = -1, this.K = !0, this.M = !1, this.F = null;
          break;
        case "KMAC128":
          i = 4, this.m = r = 1344, this.X(s), this.v = -1, this.K = !0, this.M = !1, this.F = this._;
          break;
        case "KMAC256":
          i = 4, this.m = r = 1088, this.X(s), this.v = -1, this.K = !0, this.M = !1, this.F = this._;
          break;
        case "CSHAKE128":
          this.m = r = 1344, i = this.O(s), this.v = -1, this.K = !0, this.M = !1, this.F = null;
          break;
        case "CSHAKE256":
          this.m = r = 1088, i = this.O(s), this.v = -1, this.K = !0, this.M = !1, this.F = null;
          break;
        default:
          throw new Error(st);
      }
      this.g = function (o, l, h, f, p) {
        return function (c, m, u, _, g, w, y) {
          let x,
            I,
            R = 0;
          const C = [],
            b = g >>> 5,
            v = m >>> 5;
          for (x = 0; x < v && m >= g; x += b) _ = pt(c.slice(x, x + b), _), m -= g;
          for (c = c.slice(x), m %= g; c.length < b;) c.push(0);
          for (x = m >>> 3, c[x >> 2] ^= w << x % 4 * 8, c[b - 1] ^= 2147483648, _ = pt(c, _); 32 * C.length < y && (I = _[R % 5][R / 5 | 0], C.push(I.I), !(32 * C.length >= y));) C.push(I.N), R += 1, 64 * R % g == 0 && (pt(null, _), R = 0);
          return C;
        }(o, l, 0, f, r, i, p);
      }, a.hmacKey && this.k(W("hmacKey", a.hmacKey, this.T));
    }
    O(t, e) {
      const s = function (r) {
        const a = r || {};
        return {
          funcName: W("funcName", a.funcName, 1, {
            value: [],
            binLen: 0
          }),
          customization: W("Customization", a.customization, 1, {
            value: [],
            binLen: 0
          })
        };
      }(t || {});
      e && (s.funcName = e);
      const i = ut(Rt(s.funcName), Rt(s.customization));
      if (s.customization.binLen !== 0 || s.funcName.binLen !== 0) {
        const r = Jt(i, this.m >>> 3);
        for (let a = 0; a < r.length; a += this.m >>> 5) this.R = this.U(r.slice(a, a + (this.m >>> 5)), this.R), this.A += this.m;
        return 4;
      }
      return 31;
    }
    X(t) {
      const e = function (i) {
        const r = i || {};
        return {
          kmacKey: W("kmacKey", r.kmacKey, 1),
          funcName: {
            value: [1128353099],
            binLen: 32
          },
          customization: W("Customization", r.customization, 1, {
            value: [],
            binLen: 0
          })
        };
      }(t || {});
      this.O(t, e.funcName);
      const s = Jt(Rt(e.kmacKey), this.m >>> 3);
      for (let i = 0; i < s.length; i += this.m >>> 5) this.R = this.U(s.slice(i, i + (this.m >>> 5)), this.R), this.A += this.m;
      this.H = !0;
    }
    _(t) {
      const e = ut({
        value: this.h.slice(),
        binLen: this.u
      }, function (s) {
        let i,
          r,
          a = 0;
        const o = [0, 0],
          l = [4294967295 & s, s / 4294967296 & 2097151];
        for (i = 6; i >= 0; i--) r = l[i >> 2] >>> 8 * i & 255, r === 0 && a === 0 || (o[a >> 2] |= r << 8 * a, a += 1);
        return a = a !== 0 ? a : 1, o[a >> 2] |= a << 8 * a, {
          value: a + 1 > 4 ? o : [o[0]],
          binLen: 8 + 8 * a
        };
      }(t.outputLen));
      return this.g(e.value, e.binLen, this.A, this.B(this.R), t.outputLen);
    }
  }
  class Oe {
    constructor(t, e, s) {
      if (t == "SHA-1") this.P = new Ie(t, e, s);else if (t == "SHA-224" || t == "SHA-256") this.P = new Re(t, e, s);else if (t == "SHA-384" || t == "SHA-512") this.P = new ze(t, e, s);else {
        if (t != "SHA3-224" && t != "SHA3-256" && t != "SHA3-384" && t != "SHA3-512" && t != "SHAKE128" && t != "SHAKE256" && t != "CSHAKE128" && t != "CSHAKE256" && t != "KMAC128" && t != "KMAC256") throw new Error(st);
        this.P = new De(t, e, s);
      }
    }
    update(t) {
      return this.P.update(t), this;
    }
    getHash(t, e) {
      return this.P.getHash(t, e);
    }
    setHMACKey(t, e, s) {
      this.P.setHMACKey(t, e, s);
    }
    getHMAC(t, e) {
      return this.P.getHMAC(t, e);
    }
  }
  function He(n) {
    let t = new Oe("SHA-256", "TEXT");
    return t.update(n), t.getHash("HEX");
  }
  let dt = {},
    St = {};
  function Ve(n, t, e) {
    if (!n) return Promise.reject("apiKey undefined");
    if (!t) return Promise.reject("apiSecret undefined");
    if (!e) return Promise.reject("appId undefined");
    let s = new Date().getTime();
    if (St[n] && s < St[n] && dt[n]) return Promise.resolve(dt[n]);
    const i = 3600;
    St[n] = s + i * 1e3;
    const r = `[{"service":"ecs:cls","effect":"Allow","resource":["${e}"],"permission":["READ","WRITE"]}]`;
    let a = {
        expires: i,
        timestamp: s,
        apiKey: n,
        acl: r
      },
      o = Object.keys(a).sort().map(l => `${l}${a[l]}`).concat(t).join("");
    return a.signature = He(o), D(`${K.uacUrl}/token/v2`, "POST", null, null, a).then(l => l.result && l.result.token ? (dt[n] = l.result.token, dt[n]) : (console.error("token error"), "TOKEN_ERROR"));
  }
  class Mt extends we {
    constructor(t) {
      super(), this.clsdata = {}, J(t.apiKey, "apiKey \u4E0D\u4E3A\u7A7A"), J(t.apiSecret, "apiSecret \u4E0D\u4E3A\u7A7A"), J(t.clsAppId, "clsAppId \u4E0D\u4E3A\u7A7A"), this.config = t, this.config.useCache === void 0 && (this.config.useCache = !0), t.serverConfig && Object.assign(K, t.serverConfig), this.clsdata = {};
    }
    setConfig(t, e) {
      e = e || this.config.clsAppId != t.clsAppId, J(t.apiKey, "apiKey \u4E0D\u4E3A\u7A7A"), J(t.apiSecret, "apiSecret \u4E0D\u4E3A\u7A7A"), J(t.clsAppId, "clsAppId \u4E0D\u4E3A\u7A7A"), Object.assign(this.config, t), t.serverConfig && Object.assign(K, t.serverConfig), e && (this.clsdata = {});
    }
    getConfig() {
      return this.config;
    }
    async getToken() {
      return this.token = await Ve(this.config.apiKey, this.config.apiSecret, this.config.clsAppId), this.token;
    }
    async getVersion() {
      if (this.config.useCache && this.clsdata.clsVersion) return this.clsdata.clsVersion;
      const t = await ue(this.config.clsAppId);
      return this.clsdata.clsVersion = t.version, this.clsdata.clsVersion;
    }
    async getClsHost() {
      return this.config.useCache && this.clsdata.clsHost ? this.clsdata.clsHost : (await this.getVersion(), this.clsdata.clsHost = ce(this.clsdata.clsVersion), this.clsdata.clsHost);
    }
    async getArannotations() {
      if (this.config.useCache && this.clsdata.arannotations) return this.clsdata.arannotations;
      await this.getToken(), await this.getClsHost();
      let t = await fe(this.clsdata.clsHost, this.config.clsAppId, this.token),
        {
          arannotations: e
        } = t.result;
      return this.clsdata.arannotations = e, this.clsdata.arannotations;
    }
    async getArannotationsDetail() {
      if (this.config.useCache && this.clsdata.arannotationsDetail) return this.clsdata.arannotationsDetail;
      const t = await this.getArannotations(),
        e = await Promise.all(t.map(s => this._getEmaByArannotaionId(s.arannotationId)));
      return Object.assign(this.clsdata, {
        arannotationsDetail: e
      }), this.clsdata;
    }
    async getArannotationDetail(t, e) {
      e || (e = {
        ema: !0,
        meta: !0
      });
      const s = await this.getArannotations();
      t = t != null ? t : this.config.arannotationId, J(t, "arannotationId\u4E0D\u80FD\u4E3A\u7A7A");
      let i = s.find(a => a.arannotationId == t);
      if (!i) return Promise.reject("arannotationId\u4E0D\u5B58\u5728");
      let r = await this._getEmaByArannotaionId(i.arannotationId, e);
      return Object.assign(this.clsdata, r), this.clsdata;
    }
    async _getEmaByArannotaionId(t, e) {
      e || (e = {
        ema: !0,
        meta: !0
      });
      let s = await pe(this.clsdata.clsHost, t, this.config.clsAppId, this.token),
        i = {
          ema: null,
          meta: null,
          emaClusters: null,
          emaBlocks: null,
          emaMaps: null,
          emaRelationships: null
        };
      const r = e.ema && s.result.emaUrl ? D(s.result.emaUrl.replace("https://large-spatialmaps.easyar.com", K.emaUrl || "/api/large-spatialmaps"), "GET", null, {
          "content-type": " "
        }, null).then(o => (i.ema = o, o)) : Promise.resolve(),
        a = e.meta && s.result.metaUrl ? D(s.result.metaUrl, "GET", null, {
          "content-type": " "
        }, null).then(o => (i.meta = o, o)) : Promise.resolve();
      return await Promise.all([r, a]), i;
    }
    destroy() {
      this.off(), this.clsdata = null;
    }
  }
  const Qt = class et {
    constructor() {
      this._isAC = !1, this.frames = [], this.debugFusions = [], this.lastFrameTs = 0, this.lastVio = [], this._enable = !0, this.poseFusions = [], this.localFusion = null, this.currentFusion = null, this.lastFusion = null, this.poseFusionResult = null;
    }
    static get instance() {
      return this._instance || (this._instance = new et()), this._instance;
    }
    get isAC() {
      return this._isAC;
    }
    set isAC(t) {
      this._isAC != t && (this.currentFusion = null, this.poseFusionResult = null, this._isAC = t, this._enable = !t);
    }
    get enable() {
      return this._enable;
    }
    set enable(t) {
      this._isAC || this._enable != t && (t ? (this.currentFusion = null, this.poseFusionResult = null, this._updateCurrentFusion()) : this._updateLocalFusion(), this._enable = t);
    }
    insertData(t, e, s) {
      let i = {
        localTwc: {
          data: t
        },
        mapTcw: {
          data: e
        },
        timestamp: s
      };
      this.poseFusions.push(i);
      let r = 0;
      for (; i.timestamp - this.poseFusions[r].timestamp > 90;) r++;
      return r > 0 && (this.poseFusions = this.poseFusions.slice(r)), this._isAC ? this._updateACFusion() : this._enable ? this._updateCurrentFusion() : this._updateLocalFusion();
    }
    _updateLocalFusion() {
      return this.poseFusions.length < 1 ? Promise.reject("poseFusion empty") : new Promise((t, e) => {
        const s = this.poseFusions[this.poseFusions.length - 1],
          {
            localTwc: i,
            mapTcw: r
          } = s;
        this.localFusion = new T().mul2(new T().set(i.data).transpose(), new T().set(r.data).transpose()), t(null);
      });
    }
    _updateCurrentFusion() {
      return this.poseFusions.length < 1 ? Promise.reject("poseFusion empty") : me(this.poseFusions).then(t => {
        const e = this.poseFusionResult ? this.poseFusionResult : t.result;
        if (this.poseFusionResult = t.result, this.poseFusionResult.status < e.status || this.poseFusionResult.timestamp < e.timestamp) return;
        const s = new T().set(this.poseFusionResult.transform.data).transpose().clone().getInverse(),
          i = this.currentFusion ? this.currentFusion : s,
          r = s;
        this.isSlerp = !et.sim3DifferenceIsTooBig(i, r), this.isSlerp && (this.sFusion = this.sFusion ? this.sFusion : i, this.lastFusion = this.sFusion, this.slerpTimestamp = new Date().getTime()), this.currentFusion = r;
      });
    }
    _updateACFusion() {
      return this.poseFusions.length < 1 ? Promise.reject("poseFusion empty") : new Promise((t, e) => {
        const {
          localTwc: s,
          mapTcw: i
        } = this.poseFusions[this.poseFusions.length - 1];
        this.localFusion = new T().mul2(new T().set(s.data).transpose(), new T().set(i.data).transpose()), this.sFusion = this.sFusion || this.localFusion, this.lastFusion = this.sFusion, t(null);
      });
    }
    getPoseInMap(t, e, s = 0) {
      if (this._isAC) return this.getACPose(t, e, s);
      const i = this._enable && this.currentFusion ? this.currentFusion : this.localFusion;
      if (!i) return null;
      if (this._enable && this.isSlerp) {
        const a = (new Date().getTime() - this.slerpTimestamp) / 1e3,
          o = Math.min(1, a);
        this.sFusion = et.averageResult(this.lastFusion, i, o);
      } else this.sFusion = i;
      let r = new T().mul2(new T().set(t), this.sFusion.clone()).getInverse();
      return this.norm(r.data);
    }
    getACPose(t, e, s = 0) {
      const i = Array.from(new T().set(t).transpose().getInverse().data);
      this.insertFrames(e, s, i);
      const r = this.localFusion;
      if (!r) return null;
      let a = null;
      if (this.poseFusions.length < 2 || et.sim3DifferenceIsTooBig(this.lastFusion, r)) this.sFusion = r;else {
        const o = this.poseFusions[this.poseFusions.length - 1].timestamp,
          l = e - o,
          h = Math.min(1, l);
        this.sFusion = et.averageResult(this.lastFusion, r, h);
      }
      return a = new T().mul2(new T().set(t), this.sFusion.clone()).getInverse(), this.norm(a.data);
    }
    norm(t) {
      const e = Math.sqrt(t[0] * t[0] + t[4] * t[4] + t[8] * t[8]),
        s = t.map((i, r) => r < 12 && r % 4 < 3 ? i / e : i);
      return s[15] = 1, s;
    }
    clearFusion() {
      this.poseFusions = [], this.debugFusions = [], this.frames = [], this.poseFusionResult = null, this.lastFrameTs = 0, this.lastVio = [], this.currentFusion = null, this.localFusion = null;
    }
    clearFrames() {
      this.frames = [];
    }
    getFrames() {
      return this.frames;
    }
    insertFrames(t, e, s) {
      this.frames.push({
        rotate: `${e}`,
        frameTimestamp: `${t}`,
        vioPose: s.map(i => `${i}`),
        trackingStatus: "2"
      }), this.frames.length > 120 && (this.frames = this.frames.slice(120));
    }
    insertDebug(t, e, s, i, r = "") {
      this.debugFusions.push({
        localTwc: t,
        mapTcw: e,
        timestamp: s,
        cameraParam: `${JSON.stringify(i)}}`,
        base64: r,
        fusionPoses: []
      });
    }
    getDebug() {
      return this.debugFusions;
    }
    detectVioJumps(t, e) {
      if (this.lastFrameTs == 0 || this.lastVio.length == 0) return this.lastFrameTs = e, this.lastVio = t, !1;
      let s = !0;
      const i = {
          x: this.lastVio[3],
          y: this.lastVio[7],
          z: this.lastVio[11]
        },
        r = {
          x: t[3],
          y: t[7],
          z: t[11]
        },
        a = {
          x: i.x - r.x,
          y: i.y - r.y,
          z: i.z - r.z
        },
        o = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z),
        l = e - this.lastFrameTs;
      return l < 1e-7 && (s = !1), s && (o / l > 6 || o > 3) && this.clearFusion(), this.lastFrameTs = e, this.lastVio = t, s;
    }
    static sim3DifferenceIsTooBig(t, e) {
      const s = t.decompose(),
        i = e.decompose(),
        r = s.rotation.getInverse().mul(i.rotation).data;
      let a = (r[0] + r[5] + r[10] + r[15] - 1.000001) / 2;
      a >= 1 && (a = 1), a <= -1 && (a = -1);
      const o = Math.acos(a) * 180 / Math.PI,
        l = {
          x: s.position.x - i.position.x,
          y: s.position.y - i.position.y,
          z: s.position.z - i.position.z
        };
      return Math.sqrt(l.x * l.x + l.y * l.y + l.z * l.z) > 5 || o > 90;
    }
    static averageResult(t, e, s) {
      const i = t.decompose(),
        r = e.decompose(),
        a = new Ct().setFromMat4(t),
        o = new Ct().setFromMat4(e),
        l = new j(i.position.x * (1 - s) + r.position.x * s, i.position.y * (1 - s) + r.position.y * s, i.position.z * (1 - s) + r.position.z * s),
        h = new j(i.scale.x * (1 - s) + r.scale.x * s, i.scale.y * (1 - s) + r.scale.y * s, i.scale.z * (1 - s) + r.scale.z * s),
        f = new Ct().slerp(a, o, s);
      return f.w = -f.w, new T().setTRS(l, f, h);
    }
  };
  Qt._instance = null;
  let k = Qt;
  const je = {
    normal: "2",
    notAvailable: "0"
  };
  class Ke extends Mt {
    constructor(t) {
      var e;
      super(t), this._interval = 1e3, this._worldMatrix = null;
      let s = (e = this.config.serverConfig) != null && e.cloudUrl ? this.config.serverConfig.cloudUrl + "/file/localize" : null;
      s ? (this._clsUrl = s, this.fire("clsLoaded", this), t.autoStart && this.start()) : this.getToken().then(async () => {
        s = await ct(this.config.clsAppId, this.token), this._clsUrl = s, s.indexOf("/ext") > 0 ? k.instance.isAC = !0 : k.instance.isAC = !1, this.fire("clsLoaded", this), t.autoStart && this.start();
      }), t.arannotationId && this.getArannotationDetail(t.arannotationId, {
        ema: !0,
        meta: !1
      }).then(i => {
        this.fire("emaLoaded", i);
      });
    }
    get currentBlockId() {
      var t, e, s;
      return this._curLocalizerRes ? (t = this._curLocalizerRes) != null && t.blockId ? (e = this._curLocalizerRes) == null ? void 0 : e.blockId : (s = this._curLocalizerRes) == null ? void 0 : s.mapId : null;
    }
    get currentBlockName() {
      var t;
      return this._curLocalizerRes ? (t = this._curLocalizerRes) == null ? void 0 : t.name : null;
    }
    get offsetMatrix() {
      return k.instance.currentFusion.data;
    }
    get worldMatrix() {
      return this._worldMatrix;
    }
    updateFrame(t) {
      if (this._inLoop && this._request && this._request(t), this._curLocalizerRes && t.camera.trackingState == "normal") {
        let e = new T().set(t.camera.transform).getInverse().data;
        this._worldMatrix = k.instance.getPoseInMap(e, Date.now() / 1e3);
      }
    }
    setGPS(t) {}
    setConfig(t, e) {
      var s;
      super.setConfig(t, e), this.clearFusion();
      let i = (s = this.config.serverConfig) != null && s.cloudUrl ? this.config.serverConfig.cloudUrl + "/file/localize" : null;
      i ? (this._clsUrl = i, this.fire("clsLoaded", this), t.autoStart && this.start()) : this.getToken().then(async () => {
        i = await ct(this.config.clsAppId, this.token), this._clsUrl = i, i.indexOf("/ext") > 0 ? k.instance.isAC = !0 : k.instance.isAC = !1, this.fire("clsLoaded", this), t.autoStart && this.start();
      }), t.arannotationId && this.getArannotationDetail(t.arannotationId, {
        ema: !0,
        meta: !1
      }).then(r => {
        this.fire("emaLoaded", r);
      });
    }
    clearFusion() {
      k.instance.clearFusion(), this._arSessionId = null;
    }
    start(t) {
      this._inLoop || (this._inLoop = !0, t && (this._interval = t), this._request = xt(this.localizeOnce, this._interval, this));
    }
    stop() {
      this._inLoop && (this._inLoop = !1, this._request = null, this.clearFusion(), k._instance = null);
    }
    getPoseInBlock(t) {
      let e = new T().set(t).getInverse().data;
      return k.instance.getPoseInMap(e);
    }
    async localizeOnce(t) {
      if (this._busy) return;
      this._busy = !0;
      const e = t.capturedImage,
        s = t.width,
        i = t.height,
        r = t.camera.intrinsics,
        a = r[0],
        o = r[4],
        l = r[6],
        h = r[7],
        f = [a, o, l, h],
        p = 960 / s,
        c = i * p,
        m = 960,
        u = o * p,
        _ = a * p,
        g = h * p,
        w = l * p,
        y = [u, _, g, w].map(v => v.toString()),
        x = t.camera.transform.slice();
      var I = [];
      for (let v = 0; v < 4; v++) I[v] = x[4 * v], I[v + 4] = x[4 * v + 1], I[v + 8] = x[4 * v + 2], I[v + 12] = x[4 * v + 3];
      let R = Date.now();
      const C = {
          appId: this.config.clsAppId,
          apiKey: this.config.apiKey,
          timestamp: R,
          cameraParam: f,
          apiSecret: this.config.apiSecret,
          arSessionId: this._arSessionId,
          args: JSON.stringify({
            vioPose: I.map(v => `${v}`),
            cameraParam: y,
            rotate: "0",
            cameraSize: [c.toString(), m.toString()],
            frameTimestamp: t.timestamp.toString(),
            trackingStatus: je[t.camera.trackingState],
            recentFrames: k.instance.getFrames()
          })
        },
        b = this._clsUrl;
      return new Promise((v, S) => {
        ExpAREngine.localize({
          url: b,
          params: JSON.stringify(C),
          image: e,
          width: s,
          height: i,
          complete: M => {
            const F = JSON.parse(M),
              E = JSON.parse(F.data);
            if (F.data = E, F.status === 200) {
              if (E && E.statusCode === 0) {
                this._curLocalizerRes = E.result[0], this._arSessionId = E.arSessionId;
                var V = [];
                for (let z = 0; z < 4; z++) V[z] = t.camera.transform[4 * z], V[z + 4] = t.camera.transform[4 * z + 1], V[z + 8] = t.camera.transform[4 * z + 2], V[z + 12] = t.camera.transform[4 * z + 3];
                k.instance.insertData(V, this._curLocalizerRes.pose, R / 1e3).then(z => {
                  this.fire("localize_sucess", F.data), v(F);
                });
              } else this.fire("localize_fail", F.data), v(F);
              this._busy = !1;
            } else this.fire("localize_error", F), S(F), this._busy = !1;
          }
        });
      });
    }
    destroy() {
      super.destroy(), this.stop();
    }
  }
  class Ge extends Mt {
    constructor(t) {
      super(t), this._interval = 1e3, this._curLocalizerRes = null, t.arannotationId && this.getArannotationDetail(t.arannotationId, {
        ema: !0,
        meta: !1
      }).then(e => {
        this.fire("emaLoaded", e);
      }), this.fire("clsLoaded", this), t.autoStart && this.start();
    }
    get currentBlockId() {
      var t;
      return (t = this._curLocalizerRes) == null ? void 0 : t.blockId;
    }
    get offsetMatrix() {
      return k.instance.currentFusion.data;
    }
    get worldMatrix() {
      return this._worldMatrix;
    }
    get currentBlockName() {
      var t;
      return this._curLocalizerRes ? (t = this._curLocalizerRes) == null ? void 0 : t.name : null;
    }
    updateFrame(t) {
      const {
        camera: e,
        timestamp: s,
        results: i
      } = t;
      if (this._inLoop && this._request && this._request(t), e.trackingStatus != -1 && i && i.length > 0) {
        const r = this.parseMegaResult(i);
        r && (this._curLocalizerRes === null ? this._curLocalizerRes = r : this._curLocalizerRes.name != r.name && (this._curLocalizerRes = r), this._worldMatrix = new T().set(r.pose).transpose().getInverse().data);
      }
    }
    setGPS(t) {}
    setConfig(t, e) {
      super.setConfig(t, e), this.clearFusion(), t.arannotationId && this.getArannotationDetail(t.arannotationId, {
        ema: !0,
        meta: !1
      }).then(s => {
        this.fire("emaLoaded", s);
      });
    }
    clearFusion() {
      k.instance.clearFusion();
    }
    start(t) {
      this._inLoop || (this._inLoop = !0, t && (this._interval = t), this._request = xt(this.localizeOnce, this._interval, this));
    }
    stop() {
      this._inLoop && (this._inLoop = !1, this._request = null);
    }
    getPoseInBlock(t) {
      let e = new T().set(t).getInverse().data;
      return k.instance.getPoseInMap(e);
    }
    async localizeOnce(t) {
      this._busy || (this._busy = !0, this._curLocalizerRes ? this.fire("localize_sucess", {
        statusCode: 0,
        msg: "Localization Scc",
        result: [this._curLocalizerRes]
      }) : this.fire("localize_fail", {
        statusCode: 17,
        msg: "Localization failed"
      }), this._busy = !1);
    }
    parseMegaResult(t) {
      const e = t.length;
      for (let s = 0; s < e; s++) {
        const i = t[s].instances,
          r = i.length;
        for (let a = 0; a < r; a++) return i[a];
      }
      return null;
    }
  }
  const Zt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    nt = new Uint8Array(256);
  for (let n = 0; n < Zt.length; n++) nt[Zt.charCodeAt(n)] = n;
  function Ye(n) {
    let t = n.length * .75;
    const e = n.length;
    let s,
      i = 0,
      r,
      a,
      o,
      l;
    n[n.length - 1] === "=" && (t--, n[n.length - 2] === "=" && t--);
    const h = new ArrayBuffer(t),
      f = new Uint8Array(h);
    for (s = 0; s < e; s += 4) r = nt[n.charCodeAt(s)], a = nt[n.charCodeAt(s + 1)], o = nt[n.charCodeAt(s + 2)], l = nt[n.charCodeAt(s + 3)], f[i++] = r << 2 | a >> 4, f[i++] = (a & 15) << 4 | o >> 2, f[i++] = (o & 3) << 6 | l & 63;
    return h;
  }
  const Xe = function (n) {
    function t() {}
    function e(l, h) {
      if (l = l === void 0 ? "utf-8" : l, h = h === void 0 ? {
        fatal: !1
      } : h, a.indexOf(l.toLowerCase()) === -1) throw new RangeError("Failed to construct 'TextDecoder': The encoding label provided ('" + l + "') is invalid.");
      if (h.fatal) throw Error("Failed to construct 'TextDecoder': the 'fatal' option is unsupported.");
    }
    function s(l) {
      return Buffer.from(l.buffer, l.byteOffset, l.byteLength).toString("utf-8");
    }
    function i(l) {
      var h = URL.createObjectURL(new Blob([l], {
        type: "text/plain;charset=UTF-8"
      }));
      try {
        var f = new XMLHttpRequest();
        return f.open("GET", h, !1), f.send(), f.responseText;
      } catch (_unused8) {
        return r(l);
      } finally {
        URL.revokeObjectURL(h);
      }
    }
    function r(l) {
      for (var h = 0, f = Math.min(65536, l.length + 1), p = new Uint16Array(f), c = [], m = 0;;) {
        var u = h < l.length;
        if (!u || m >= f - 1) {
          if (c.push(String.fromCharCode.apply(null, p.subarray(0, m))), !u) return c.join("");
          l = l.subarray(h), m = h = 0;
        }
        if (u = l[h++], !(u & 128)) p[m++] = u;else if ((u & 224) === 192) {
          var _ = l[h++] & 63;
          p[m++] = (u & 31) << 6 | _;
        } else if ((u & 240) === 224) {
          _ = l[h++] & 63;
          var g = l[h++] & 63;
          p[m++] = (u & 31) << 12 | _ << 6 | g;
        } else if ((u & 248) === 240) {
          _ = l[h++] & 63, g = l[h++] & 63;
          var w = l[h++] & 63;
          u = (u & 7) << 18 | _ << 12 | g << 6 | w, 65535 < u && (u -= 65536, p[m++] = u >>> 10 & 1023 | 55296, u = 56320 | u & 1023), p[m++] = u;
        }
      }
    }
    if (n.TextEncoder && n.TextDecoder) return n;
    var a = ["utf-8", "utf8", "unicode-1-1-utf-8"];
    Object.defineProperty(t.prototype, "encoding", {
      value: "utf-8"
    }), t.prototype.encode = function (l, h) {
      if (h = h === void 0 ? {
        stream: !1
      } : h, h.stream) throw Error("Failed to encode: the 'stream' option is unsupported.");
      h = 0;
      for (var f = l.length, p = 0, c = Math.max(32, f + (f >>> 1) + 7), m = new Uint8Array(c >>> 3 << 3); h < f;) {
        var u = l.charCodeAt(h++);
        if (55296 <= u && 56319 >= u) {
          if (h < f) {
            var _ = l.charCodeAt(h);
            (_ & 64512) === 56320 && (++h, u = ((u & 1023) << 10) + (_ & 1023) + 65536);
          }
          if (55296 <= u && 56319 >= u) continue;
        }
        if (p + 4 > m.length && (c += 8, c *= 1 + h / l.length * 2, c = c >>> 3 << 3, _ = new Uint8Array(c), _.set(m), m = _), !(u & 4294967168)) m[p++] = u;else {
          if (!(u & 4294965248)) m[p++] = u >>> 6 & 31 | 192;else if (!(u & 4294901760)) m[p++] = u >>> 12 & 15 | 224, m[p++] = u >>> 6 & 63 | 128;else if (!(u & 4292870144)) m[p++] = u >>> 18 & 7 | 240, m[p++] = u >>> 12 & 63 | 128, m[p++] = u >>> 6 & 63 | 128;else continue;
          m[p++] = u & 63 | 128;
        }
      }
      return m.slice ? m.slice(0, p) : m.subarray(0, p);
    }, Object.defineProperty(e.prototype, "encoding", {
      value: "utf-8"
    }), Object.defineProperty(e.prototype, "fatal", {
      value: !1
    }), Object.defineProperty(e.prototype, "ignoreBOM", {
      value: !1
    });
    var o = r;
    return typeof Buffer == "function" && Buffer.from ? o = s : typeof Blob == "function" && typeof URL == "function" && typeof URL.createObjectURL == "function" && (o = i), e.prototype.decode = function (l, h) {
      if (h = h === void 0 ? {
        stream: !1
      } : h, h.stream) throw Error("Failed to decode: the 'stream' option is unsupported.");
      return l = l instanceof Uint8Array ? l : l.buffer instanceof ArrayBuffer ? new Uint8Array(l.buffer) : new Uint8Array(l), o(l);
    }, n.TextEncoder = t, n.TextDecoder = e, n;
  }(typeof window < "u" ? window : typeof global < "u" ? global : globalThis);
  class qe extends Mt {
    constructor(t) {
      var e;
      super(t), this._interval = 1e3, this._worldMatrix = null, this.capturePixelRatio = null;
      const s = (() => new Promise((r, a) => {
        this.captureCanvas = $my.createOffscreenCanvas({
          type: "2d",
          width: 480,
          height: 640
        });
        const o = setInterval(() => {
          if (this.captureCanvas) {
            this.captureCTX = this.captureCanvas.getContext("2d"), clearInterval(o), r(null);
            return;
          }
          console.warn("try create capture canvas"), this.captureCanvas = $my.createOffscreenCanvas({
            type: "2d",
            width: 480,
            height: 640
          });
        }, 60);
      }))();
      let i = (e = this.config.serverConfig) != null && e.cloudUrl ? this.config.serverConfig.cloudUrl + "/file/localize" : null;
      i ? (this._clsUrl = i, this.fire("clsLoaded", this), t.autoStart && s.then(() => {
        this.start();
      })) : this.getToken().then(async () => {
        i = await ct(this.config.clsAppId, this.token), this._clsUrl = i, i.indexOf("/ext") > 0 ? k.instance.isAC = !0 : k.instance.isAC = !1, this.fire("clsLoaded", this), t.autoStart && s.then(() => {
          this.start();
        });
      }), t.arannotationId && this.getArannotationDetail(t.arannotationId, {
        ema: !0,
        meta: !1
      }).then(r => {
        this.fire("emaLoaded", r);
      });
    }
    get currentBlockId() {
      var t, e, s;
      return this._curLocalizerRes ? (t = this._curLocalizerRes) != null && t.blockId ? (e = this._curLocalizerRes) == null ? void 0 : e.blockId : (s = this._curLocalizerRes) == null ? void 0 : s.mapId : null;
    }
    get currentBlockName() {
      var t;
      return this._curLocalizerRes ? (t = this._curLocalizerRes) == null ? void 0 : t.name : null;
    }
    get offsetMatrix() {
      return k.instance.currentFusion.data;
    }
    get worldMatrix() {
      return this._worldMatrix;
    }
    updateFrame(t, e, s) {
      if (this.capturePixelRatio == null && (this.capturePixelRatio = 720 / e, this.captureCanvas.width = e * this.capturePixelRatio, this.captureCanvas.height = s * this.capturePixelRatio), this._inLoop && this._request && this._request(t), this._curLocalizerRes) {
        let i = t.camera.viewMatrix;
        const r = t.timestamp ? t.timestamp / 1e9 : Date.now() / 1e3;
        this._worldMatrix = k.instance.getPoseInMap(i, r);
      }
    }
    setGPS(t) {}
    setConfig(t, e) {
      var s;
      super.setConfig(t, e), this.clearFusion();
      let i = (s = this.config.serverConfig) != null && s.cloudUrl ? this.config.serverConfig.cloudUrl + "/file/localize" : null;
      i ? (this._clsUrl = i, this.fire("clsLoaded", this), t.autoStart && this.start()) : this.getToken().then(async () => {
        i = await ct(this.config.clsAppId, this.token), this._clsUrl = i, i.indexOf("/ext") > 0 ? k.instance.isAC = !0 : k.instance.isAC = !1, this.fire("clsLoaded", this), t.autoStart && this.start();
      }), t.arannotationId && this.getArannotationDetail(t.arannotationId, {
        ema: !0,
        meta: !1
      }).then(r => {
        this.fire("emaLoaded", r);
      });
    }
    clearFusion() {
      k.instance.clearFusion(), this._arSessionId = null;
    }
    start(t) {
      this._inLoop || (this._inLoop = !0, t && (this._interval = t), this._request = xt(this.localizeOnce, this._interval, this));
    }
    stop() {
      this._inLoop && (this._inLoop = !1, this._request = null, this.clearFusion(), k._instance = null);
    }
    getPoseInBlock(t) {
      let e = new T().set(t).getInverse().data;
      return k.instance.getPoseInMap(e);
    }
    async localizeOnce(t) {
      if (this._busy) return;
      this._busy = !0;
      const e = t,
        s = e.timestamp ? e.timestamp / 1e9 : Date.now() / 1e3,
        i = Array.from(new T().set(Array.from(e.camera.viewMatrix)).transpose().getInverse().data),
        r = this.captureCanvas.width,
        a = this.captureCanvas.height,
        o = e.camera.intrinsics;
      let l = null;
      o ? l = [o[0] * this.capturePixelRatio, o[4] * this.capturePixelRatio, o[7] * this.capturePixelRatio, o[6] * this.capturePixelRatio] : l = [0, 0, 0, 0];
      const h = this.captureCanvas,
        f = e.getCameraBuffer(r, a);
      let p = this.captureCTX,
        c = h.createImageData(new Uint8ClampedArray(f), r, a);
      p.putImageData(c, 0, 0);
      const m = await new Promise(E => {
        setTimeout(() => {
          E(h.toDataURL("image/jpeg", .7).substr(23));
        });
      });
      let u = Date.now();
      const _ = {
        appId: this.config.clsAppId,
        apiKey: this.config.apiKey,
        timestamp: u,
        cameraParam: JSON.stringify(l),
        apiSecret: this.config.apiSecret,
        arSessionId: this._arSessionId,
        args: JSON.stringify({
          rotate: "0",
          cameraSize: [`${r}`, `${a}`],
          cameraParam: l.map(E => `${E}`),
          frameTimestamp: `${s}`,
          vioPose: i.map(E => `${E}`),
          trackingStatus: "2",
          recentFrames: k.instance.getFrames()
        })
      };
      let g = Ye(m),
        w = Object.keys(_).map(E => `\r
--XXX\r
Content-Disposition: form-data;name="${E}"\r
\r
` + _[E]).join("") + `\r
--XXX\r
Content-Disposition: form-data;name="image"; filename="image.jpg"\r
Content-Type: application/octet-stream\r
Content-Transfer-Encoding: binary\r
\r
`,
        y = `\r
--XXX--`,
        x = new Xe.TextEncoder(),
        I = x.encode(w),
        R = new Uint8Array(g),
        C = x.encode(y),
        b = new Uint8Array(I.length + R.length + C.length);
      b.set(I, 0), b.set(R, I.length), b.set(C, I.length + R.length);
      let v = b.buffer;
      const S = await this.getToken();
      let M = {
        url: this._clsUrl,
        data: v,
        header: {
          "content-type": "multipart/form-data; boundary=XXX",
          Authorization: S
        }
      };
      const F = await D(M.url, "POST", {}, M.header, M.data).catch(E => (this.fire("localize_error", E), this._busy = !1, E));
      this._arSessionId = F.arSessionId || "", F && F.statusCode === 0 ? (this._curLocalizerRes = F.result[0], k.instance.insertData(i, this._curLocalizerRes.pose, s).then(E => {
        this.fire("localize_sucess", F), this._busy = !1;
      })) : (this.fire("localize_fail", F), this._busy = !1);
    }
    destroy() {
      super.destroy(), this.stop(), this.captureCTX = null, this.captureCanvas = null;
    }
  }
  typeof $my < "u" && !$my.isMy ? Lt(ge) : typeof my < "u" && Lt(_e), console.log("use cls-client v1.0.0");
  class kt {
    constructor(t, e) {
      this.pc = null, this.app = null, this._currentActiveBlockId = null, this._update = null, this.pc = t, this.app = e, this.blockTransformMap = new Map(), this.blockEntityMap = new Map(), this.app.on("rejesterBlock", (i, r) => {
        this.rigesterBlock(i, r);
      });
      let s = 0;
      this.app.on("update", this._update = i => {
        s += i, s > 5 && (s = 0, this._checkUnsedBlock());
      });
    }
    set currentAcriveBlockId(t) {
      this._currentActiveBlockId != t && (this._currentActiveBlockId != null && this._setBlockActive(this._currentActiveBlockId, !1), this._currentActiveBlockId = t, this._currentActiveBlockId != null && this._setBlockActive(this._currentActiveBlockId, !0), this.app.fire("activeBlockChange", this._currentActiveBlockId));
    }
    get currentAcriveBlockId() {
      return this._currentActiveBlockId;
    }
    setBlockInfo(t) {
      for (let e = 0; e < t.length; e++) {
        let s = t[e];
        if (s.keepTransform) {
          let i = s.id,
            r = this._mackTransformMat(s.transform);
          if (this.blockTransformMap.set(i, r), this.blockEntityMap.has(i)) {
            let a = this.blockEntityMap.get(i);
            for (let o = 0; o < a.length; o++) this._applyTransform(r, a[o]);
          }
        }
      }
    }
    getBlockTransform(t) {
      return this.blockTransformMap.has(t) || this.blockTransformMap.set(t, new this.pc.Mat4()), this.blockTransformMap.get(t);
    }
    rigesterBlock(t, e) {
      this.blockEntityMap.has(t) || this.blockEntityMap.set(t, []), this.blockEntityMap.get(t).push(e), this._applyTransform(this.getBlockTransform(t), e), this.currentAcriveBlockId == t ? e.enabled = !0 : e.enabled = !1;
    }
    _applyTransform(t, e) {
      e.setPosition(t.getTranslation()), e.setRotation(new this.pc.Quat().setFromMat4(t)), e.setLocalScale(t.getScale());
    }
    destroy() {
      this.blockTransformMap.clear(), this.blockEntityMap.clear(), this.app.off("rejesterBlock"), this.app.off("update", this._update);
    }
    _checkUnsedBlock() {
      let t = this.blockEntityMap.keys();
      for (let e in t) {
        let s = e,
          i = this.blockEntityMap.get(s);
        i = i.filter(r => r.parent != null), this.blockEntityMap.set(s, i);
      }
    }
    transforByBlockId(t, e) {
      if (this.blockTransformMap.has(t)) {
        let s = this.blockTransformMap.get(t);
        return new this.pc.Mat4().mul2(s, e);
      } else return e;
    }
    transforAnnotations(t) {
      t.forEach(e => {
        if (e.type != "node") return;
        e.localTransform || (e.localTransform = JSON.parse(JSON.stringify(e.transform)));
        let s = e.localTransform,
          i = this._mackTransformMat(s),
          r = this.transforByBlockId(e.parent.id, i),
          {
            x: a,
            y: o,
            z: l
          } = r.getTranslation();
        if (e.transform.position = {
          x: a,
          y: o,
          z: l
        }, e.geometry == "cube") {
          let {
            x: h,
            y: f,
            z: p,
            w: c
          } = new this.pc.Quat().setFromMat4(r);
          e.transform.rotation = {
            x: h,
            y: f,
            z: p,
            w: c
          };
          let {
            x: m,
            y: u,
            z: _
          } = r.getScale();
          e.transform.scale = {
            x: m,
            y: u,
            z: _
          };
        }
      });
    }
    _setBlockActive(t, e) {
      if (this.blockEntityMap.has(t)) {
        let s = this.blockEntityMap.get(t);
        for (let i = 0; i < s.length; i++) s[i].enabled = e;
      }
    }
    _mackTransformMat(t) {
      let e = new this.pc.Mat4(),
        s = new this.pc.Vec3(t.position.x, t.position.y, t.position.z),
        i = new this.pc.Quat(),
        r = new this.pc.Vec3(1, 1, 1);
      return t.rotation && (i = new this.pc.Quat(t.rotation.x, t.rotation.y, t.rotation.z, t.rotation.w)), t.scale && (r = new this.pc.Vec3(t.scale.x, t.scale.y, t.scale.z)), e.setTRS(s, i, r), e;
    }
  }
  class We {
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
        r = t.createShader(t.VERTEX_SHADER);
      t.shaderSource(r, s), t.compileShader(r);
      const a = t.createShader(t.FRAGMENT_SHADER);
      t.shaderSource(a, i), t.compileShader(a);
      const o = this._program = t.createProgram();
      this._program.gl = t, t.attachShader(o, r), t.attachShader(o, a), t.deleteShader(r), t.deleteShader(a), t.linkProgram(o), t.useProgram(o);
      const l = t.getUniformLocation(o, "y_texture");
      t.uniform1i(l, 5);
      const h = t.getUniformLocation(o, "uv_texture");
      t.uniform1i(h, 6), this._dt = t.getUniformLocation(o, "displayTransform"), t.useProgram(e);
    }
    initVAO() {
      const t = this.gl,
        e = t.getExtension("OES_vertex_array_object");
      this._vao_ext = e;
      const s = t.getParameter(t.VERTEX_ARRAY_BINDING),
        i = e.createVertexArrayOES();
      e.bindVertexArrayOES(i);
      const r = t.getAttribLocation(this._program, "a_position"),
        a = t.createBuffer();
      t.bindBuffer(t.ARRAY_BUFFER, a), t.bufferData(t.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), t.STATIC_DRAW), t.vertexAttribPointer(r, 2, t.FLOAT, !1, 0, 0), t.enableVertexAttribArray(r), i.posBuffer = a;
      const o = t.getAttribLocation(this._program, "a_texCoord"),
        l = t.createBuffer();
      t.bindBuffer(t.ARRAY_BUFFER, l), t.bufferData(t.ARRAY_BUFFER, new Float32Array([1, 1, 0, 1, 1, 0, 0, 0]), t.STATIC_DRAW), t.vertexAttribPointer(o, 2, t.FLOAT, !1, 0, 0), t.enableVertexAttribArray(o), i.texcoordBuffer = l, e.bindVertexArrayOES(s), this._vao = i;
    }
    renderGL(t) {
      const e = this.gl;
      e.disable(e.DEPTH_TEST);
      const {
          yTexture: s,
          uvTexture: i
        } = t.getCameraTexture(e),
        r = t.getDisplayTransform();
      if (s && i) {
        const a = e.getParameter(e.CURRENT_PROGRAM),
          o = e.getParameter(e.ACTIVE_TEXTURE),
          l = e.getParameter(e.VERTEX_ARRAY_BINDING);
        e.useProgram(this._program), this._vao_ext.bindVertexArrayOES(this._vao), e.uniformMatrix3fv(this._dt, !1, r), e.pixelStorei(e.UNPACK_ALIGNMENT, 1), e.activeTexture(e.TEXTURE0 + 5);
        const h = e.getParameter(e.TEXTURE_BINDING_2D);
        e.bindTexture(e.TEXTURE_2D, s), e.activeTexture(e.TEXTURE0 + 6);
        const f = e.getParameter(e.TEXTURE_BINDING_2D);
        e.bindTexture(e.TEXTURE_2D, i), e.drawArrays(e.TRIANGLE_STRIP, 0, 4), e.bindTexture(e.TEXTURE_2D, f), e.activeTexture(e.TEXTURE0 + 5), e.bindTexture(e.TEXTURE_2D, h), e.useProgram(a), e.activeTexture(o), this._vao_ext.bindVertexArrayOES(l);
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
  class te {
    constructor(t, e, s) {
      this._cameraRenderMode = "towCanvas", this.pc = t, this.app = e, this._worldMatrix = new t.Mat4(), this._projectMatrix = new t.Mat4(), this._viewWidth = s ? s.width : e.graphicsDevice.canvas.width, this._viewHeight = s ? s.height : e.graphicsDevice.canvas.height, this._near = .1, this._far = 1e3, s && this._cameraRenderMode == "towCanvas" ? this._cameraCanvas3d = s : (console.warn("\u4F7F\u7528 oneCanvas \u6A21\u5F0F\u5C06\u4F1A\u964D\u4F4E\u6027\u80FD,\u8BF7\u4F20\u5165\u7528\u4E8E\u7ED8\u5236\u76F8\u673A\u753B\u9762\u7684 canvas"), this._cameraRenderMode = "oneCanvas", this._cameraCanvas3d = $my.createOffscreenCanvas({
        type: "webgl",
        width: this._viewWidth,
        height: this._viewHeight
      })), this._cameraCanvasGl = this._cameraCanvas3d.getContext("webgl");
    }
    create(t, e, s) {
      let i = null;
      switch (t.trackMode) {
        case L.Camera:
          i = "v1";
          break;
        case L.Dof3:
          i = "v1";
          break;
        case L.Dof6:
          i = "v2";
          break;
      }
      $my.isVKSupport(i) || s && s(), this.curARSession = $my.createVKSession({
        version: i,
        track: {
          plane: {
            mode: 1
          },
          marker: t.trackImage,
          threeDof: i === "v1" && !t.trackImage
        },
        gl: this._cameraCanvasGl
      }), e && e();
    }
    start(t, e, s) {
      this.curARSession.start(i => {
        i && (console.error("vksession start error:", i), e && e()), t && t(), this.yuv = new We(this._cameraCanvasGl), this.yuv.initGL(), this.app.xr.session || (console.info("\u5173\u95ED App3d \u81EA\u52A8\u5237\u65B0"), this.app.xr = {
          session: {
            requestAnimationFrame: () => {}
          },
          end: () => {},
          destroy: () => {}
        });
        const r = () => {
          this._frameRequestId = this.curARSession.requestAnimationFrame(r), this.app.tick();
        };
        r();
      });
    }
    update() {
      const t = this.curARSession.getVKFrame(this._viewWidth, this._viewHeight);
      t && (this._curARFrame = t, this.updatePosition(), N.instance.clsClient && N.instance.clsClient.updateFrame(t, this.curARSession.cameraSize.width, this.curARSession.cameraSize.height), this.updateTexutre());
    }
    updateTexutre() {
      if (this.yuv.renderGL(this._curARFrame), this._cameraRenderMode != "towCanvas" && (this._textureRGBA || (this._textureRGBA = new this.pc.Texture(this.app.graphicsDevice, {
        width: this._viewWidth,
        height: this._viewHeight,
        format: this.pc.PIXELFORMAT_R8_G8_B8_A8,
        mipmaps: !1,
        addressU: this.pc.ADDRESS_CLAMP_TO_EDGE,
        addressV: this.pc.ADDRESS_CLAMP_TO_EDGE
      }), this._bgMaterial && (this._bgMaterial.setParameter("rgba_texture", this._textureRGBA), this._bgMaterial.update())), this._textureRGBA)) {
        let t = this._textureRGBA.lock();
        this._cameraCanvasGl.readPixels(0, 0, this._viewWidth, this._viewHeight, this._cameraCanvasGl.RGBA, this._cameraCanvasGl.UNSIGNED_BYTE, t), this._textureRGBA.unlock();
      }
    }
    updatePosition() {
      this._worldMatrix.set(Array.from(this._curARFrame.camera.viewMatrix)).invert(), this._projectMatrix.set(Array.from(this._curARFrame.camera.getProjectionMatrix(this._near, this._far)));
    }
    destroy() {
      this.curARSession && (this.curARSession.destroy(), this.curARSession = null), this.yuv && (this.yuv.destroy(), this.yuv = null), this._bgMaterial && (this._bgMaterial.destroy(), this._bgMaterial = null), this._curARFrame = null, this._cameraCanvas3d = null, this._cameraCanvasGl = null;
    }
    pause() {
      !this.curARSession || (this._frameRequestId && this.curARSession.cancelAnimationFrame(this._frameRequestId), this.curARSession.stop(), this.yuv.clearGL());
    }
    resume() {
      !this.curARSession || this.curARSession.start(t => {
        t && console.error("vksession start error:", t), this._frameRequestId = this.curARSession.requestAnimationFrame(() => {
          this.app.tick();
        });
      });
    }
    onShow() {
      this.resume();
    }
    onHide() {
      this.pause();
    }
    getBackgroundMaterial() {
      if (this._bgMaterial) return this._bgMaterial;
      {
        const e = this.app.graphicsDevice,
          s = ["attribute vec3 a_position;", "varying vec2 v_texCoord;", "void main() {", "    gl_Position = vec4(a_position.xy,1.0, 1.0);", "    v_texCoord = a_position.xy * 0.5 + 0.5;", "}"].join(`
`),
          i = [`precision ${e.precision} float;`, "uniform sampler2D rgba_texture;", "varying vec2 v_texCoord;", "void main() {", "gl_FragColor = texture2D(rgba_texture, v_texCoord);", "}"].join(`
`);
        return this._bgShader = new this.pc.Shader(e, {
          attributes: {
            a_position: this.pc.SEMANTIC_POSITION
          },
          vshader: s,
          fshader: i
        }), this._bgMaterial = new this.pc.Material(), this._bgMaterial.shader = this._bgShader, this._bgMaterial.depthTest = !1, this._bgMaterial.depthWrite = !1, this._bgMaterial.update(), this._bgMaterial;
      }
    }
  }
  let at,
    ot,
    Tt,
    ee = 0;
  function $e() {
    at || (at = Date.now());
    const n = Date.now();
    return ot || (ot = Tt = 0), ot++, n - at > 1e3 && (ee = Math.round((ot - Tt) * 1e3 / (n - at)), Tt = ot, at = n), ee;
  }
  const lt = class {
    constructor() {
      this.pc = null, this.app = null, this.clsClient = null, this._initialized = !1, this._arCtrl = null, this._arSdk = null, this.blockController = null, this._fps = 0;
    }
    static get instance() {
      return this._instance == null && (this._instance = new lt()), this._instance;
    }
    get sdk() {
      return this._arSdk;
    }
    get arCtrl() {
      return this._arCtrl;
    }
    get arSession() {
      return this._arCtrl.curARSession;
    }
    get arFrame() {
      return this._arCtrl._curARFrame;
    }
    get worldMatrix() {
      return this.clsClient ? this.clsClient.worldMatrix ? this.blockController ? this.blockController.transforByBlockId(this.clsClient.currentBlockId, new this.pc.Mat4().set(Array.from(this.clsClient.worldMatrix))) : new this.pc.Mat4().set(Array.from(this.clsClient.worldMatrix)) : null : this._arCtrl._worldMatrix;
    }
    get vioMatrix() {
      return this._arCtrl._worldMatrix;
    }
    get projectMatrix() {
      return this._arCtrl._projectMatrix;
    }
    get bgMaterial() {
      return this._arCtrl && this._arCtrl.getBackgroundMaterial();
    }
    get fps() {
      return this._fps;
    }
    create(n, t, e, s, i) {
      this._initialized || (this.pc = n, this.app = t, this._initialized = !0, q.instance.isWeChat ? e.sdk = X.VKSession : q.instance.isAliPay && (q.instance.isIos ? e.sdk = X.ARSession : e.sdk = X.EasyAR), this._arSdk = e.sdk, e.sdk == X.ARSession ? (this._arCtrl = new se(n, t), e.useCls && e.clsConfig && (this.clsClient = new Ke(e.clsConfig), this.blockController = new kt(n, t))) : e.sdk == X.EasyAR ? (this._arCtrl = new Ft(n, t), e.useCls && e.clsConfig && (this.clsClient = new Ge(e.clsConfig), this.blockController = new kt(n, t))) : e.sdk == X.VKSession && (this._arCtrl = new te(n, t, e.canvas), e.useCls && e.clsConfig && (this.clsClient = new qe(e.clsConfig), this.blockController = new kt(n, t))), this._arCtrl ? (this._arCtrl.create(e, s, i), this._initScripts(n, t)) : i && i(), this.clsClient && (this.clsClient.on("localize_sucess", (...r) => {
        this.blockController && (this.blockController.currentAcriveBlockId = this.clsClient.currentBlockId), this.app.fire("localize_sucess", ...r);
      }, this), this.clsClient.on("localize_fail", (...r) => {
        this.app.fire("localize_fail", ...r);
      }, this), this.clsClient.on("localize_error", (...r) => {
        this.app.fire("localize_error", ...r);
      }, this), this.clsClient.on("emaLoaded", (...r) => {
        this.blockController && this.clsClient && this.clsClient.clsdata && this.clsClient.clsdata.ema && this.blockController.transforAnnotations(this.clsClient.clsdata.ema.annotations), this.app.fire("emaLoaded", ...r);
      }, this)));
    }
    start(n) {
      this._arCtrl && (this._arCtrl.start(n), this.app.on("frameupdate", this.update, this));
    }
    update() {
      this._arCtrl && (this._arCtrl.update(), this._fps = $e());
    }
    stop() {
      this._arCtrl && (this._arCtrl.pause(), this.app.off("frameupdate", this.update, this)), this.clsClient && this.clsClient.stop(), this.app.fire("arStop");
    }
    restart() {
      this._arCtrl && (this._arCtrl.resume(), this.app.on("frameupdate", this.update, this)), this.clsClient && (this.clsClient.clearFusion(), this.clsClient.start(1e3)), this.app.fire("arRestart");
    }
    onLocalizeSuccess(n, t) {
      if (!this._initialized) {
        console.warn("ARManager not initialized");
        return;
      }
      this.app.on("localize_sucess", n, t);
    }
    onLocalizeFail(n, t) {
      if (!this._initialized) {
        console.warn("ARManager not initialized");
        return;
      }
      this.app.on("localize_fail", n, t);
    }
    onLocalizeError(n, t) {
      if (!this._initialized) {
        console.warn("ARManager not initialized");
        return;
      }
      this.app.on("localize_error", n, t);
    }
    onEmaLoaded(n, t) {
      if (!this._initialized) {
        console.warn("ARManager not initialized");
        return;
      }
      this.app.on("emaLoaded", n, t);
    }
    destroy() {
      var n, t, e, s, i;
      try {
        (n = this.app) == null || n.off("frameupdate", this.update, this), (t = this.app) == null || t.off("localize_sucess"), (e = this.app) == null || e.off("localize_fail"), (s = this.app) == null || s.off("localize_error"), (i = this.app) == null || i.off("emaLoaded"), this.clsClient && this.clsClient.destroy(), this._arCtrl && this._arCtrl.destroy(), this.blockController && this.blockController.destroy();
      } catch (r) {
        console.error(r);
      }
      this._arCtrl = null, this._initialized = !1, lt._instance = null;
    }
    _initScripts(n, t) {
      if (!(this._arCtrl instanceof te && this._arCtrl._cameraRenderMode == "towCanvas")) {
        class s extends n.ScriptType {
          initialize() {
            let r = t.scene.layers.getLayerByName("arBg");
            r || (r = new n.Layer({
              name: "arBg",
              opaqueSortMode: n.SORTMODE_NONE,
              enabled: !0
            }), t.scene.layers.insert(r, 0));
            let a = lt.instance.bgMaterial;
            var o = new n.VertexFormat(t.graphicsDevice, [{
                semantic: n.SEMANTIC_POSITION,
                components: 2,
                type: n.ELEMENTTYPE_FLOAT32
              }]),
              l = new n.VertexBuffer(t.graphicsDevice, o, 4, n.BUFFER_STATIC),
              h = l.lock(),
              f = new Float32Array(h);
            f.set([-1, -1, 1, -1, -1, 1, 1, 1]), l.unlock();
            var p = new n.Mesh();
            p.vertexBuffer = l, p.primitive[0] = {
              type: n.PRIMITIVE_TRISTRIP,
              base: 0,
              count: 4,
              indexed: !1
            };
            var c = new n.GraphNode(),
              m = new n.MeshInstance(p, a, c),
              u = new n.Model();
            u.graph = c, u.meshInstances = [m], this.entity.addComponent("model", {
              type: "asset",
              castShadows: !1
            }), this.entity.model.model = u, this.entity.model.enabled = !0, this.entity.model.layers = [r.id];
            let _ = this.entity.camera.layers.slice(0);
            _.push(r.id), this.entity.camera.layers = _, this.on("destroy", () => {
              this.entity.model && this.entity.removeComponent("model");
            });
          }
        }
        n.registerScript(s, "sdsArBg");
      }
      class e extends n.ScriptType {
        constructor() {
          super(...arguments), this.camera = null, this._triggeredLocalize = !1;
        }
        initialize() {
          this.camera = this.entity.camera;
        }
        update(i) {
          const {
            worldMatrix: r,
            vioMatrix: a,
            projectMatrix: o
          } = lt.instance;
          r && o ? (this.entity.setPosition(r.getTranslation()), this.entity.setRotation(new n.Quat().setFromMat4(r)), this.entity.setLocalScale(r.getScale()), this.camera.projectionMatrix.set(Array.from(o.data)), this._triggeredLocalize || (this._triggeredLocalize = !0, this.app.fire("firstLocalize"))) : a && o && (this._triggeredLocalize = !1, this.entity.setPosition(a.getTranslation()), this.entity.setRotation(new n.Quat().setFromMat4(a)), this.entity.setLocalScale(a.getScale()), this.camera.projectionMatrix.set(Array.from(o.data)));
        }
      }
      n.registerScript(e, "sdsArCamera");
    }
    setClsConfig(n, t = !0) {
      this.clsClient && this.clsClient.setConfig(n, t), this._arCtrl instanceof Ft && this._arCtrl.setClsConfig(n);
    }
    setBlockInfo(n) {
      n.forEach(t => {
        t.keepTransform || (t.keepTransform = !0, console.warn(`block ${t.id} keepTransform is false, set to true`));
      }), this.blockController && (this.blockController.setBlockInfo(n), this.clsClient && this.clsClient.clsdata && this.clsClient.clsdata.ema && this.blockController.transforAnnotations(this.clsClient.clsdata.ema.annotations));
    }
  };
  let N = lt;
  N._instance = null;
  class Je {
    constructor(t) {
      this.name = "TinyARPlugin", this._arConfig = null, this.onSessionCreate = null, this.onSessionStart = null, this.onSessionCreateFail = null, this._arConfig = t, this._arConfig.clsConfig && (this._arConfig.trackMode = L.Dof6);
    }
    onTinyLuncherInited(t, e) {
      N.instance.create(t.pc, t.app, this._arConfig, () => {
        t.camera.script || t.camera.addComponent("script"), t.camera.script.has("sdsArBg") || t.camera.script.create("sdsArBg"), t.camera.script.has("sdsArCamera") || t.camera.script.create("sdsArCamera"), this.onSessionCreate && this.onSessionCreate(), N.instance.start(() => {
          this.onSessionStart && this.onSessionStart();
        });
      }, () => {
        console.error("ARManager create fail"), this.onSessionCreateFail && this.onSessionCreateFail();
      });
    }
    onDestroy(t, e) {
      N.instance.destroy();
    }
  }
  U.ARManager = N, U.ARSdk = X, U.ARTrackMode = L, U.TinyARPlugin = Je, U.systemInfo = q, Object.defineProperties(U, {
    __esModule: {
      value: !0
    },
    [Symbol.toStringTag]: {
      value: "Module"
    }
  });
});
console.log("use tiny-ar-plugin v1.0.0");