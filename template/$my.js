import { BaseEvent } from "./BaseEvent";
class My {
  constructor() {}
}
My.prototype = my;

class CustomMy extends My {
  static getIns() {
    if (CustomMy.ins) return CustomMy.ins;
    CustomMy.ins = new CustomMy();
    return CustomMy.ins;
  }
  constructor() {
    super();
    this.eventManager = new BaseEvent();
  }
  debug = 0;
  isMy = true;
  startDeviceMotionListening(opt) {
    if (this.debug > 1) console.warn("no support startDeviceMotionListening", opt);
  }
  stopDeviceMotionListening(opt) {
    if (this.debug > 1) console.warn("no support stopDeviceMotionListening", opt);
  }

  getMenuButtonBoundingClientRect() {
    return my.getMenuButtonBoundingClientRect();
  }
  // wx: https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
  // my: https://opendocs.alipay.com/mini/api/owycmh
  request({ success, responseType, header, ...rest }) {
    if (undefined !== responseType) rest.dataType = responseType;
    if (undefined !== header) rest.headers = header;
    if ("function" === typeof success) {
      rest.success = (res) => {
        res.statusCode = res.status;
        delete res.status;

        let { date, ...oh } = res.headers;
        res.header = { Date: date, ...oh };
        success(res);
      };
    }
    return my.request(rest);
  }
  onLocationChange(fn) {
    // console.warn("不支持 onLocationChange，使用 getLocation替代"); // TODO
    this.eventManager.on("locationChange", fn);
  }
  offLocationChange(fn) {
    this.eventManager.off("locationChange", fn);
    // console.warn("不支持 offLocationChange");
  }
  startLocationUpdate(opt) {
    if (!this.locationeInterval) {
      this.locationeInterval = setInterval(() => {
        my.getLocation({
          success: (res) => this.eventManager.fire("locationChange", this, res),
          fail: (e) => console.warn("getLocation Error", e),
        });
      }, 1000);
    }
    // 首次获取位置
    my.getLocation({
      success: (res) => {
        if (opt && typeof opt.success === "function") {
          opt.success(res);
        }
      },
      fail: (e) => {
        if (opt && typeof opt.fail === "function") {
          opt.fail(e);
        }
        console.warn("getLocation Error", e);
      },
    });
    // console.warn("不支持 startLocationUpdate");
  }
  stopLocationUpdate(opt) {
    clearInterval(this.locationeInterval);
    this.locationeInterval = null;
    my.getLocation(opt); // 调用一次，回调是否能调用
    // console.warn("不支持 stopLocationUpdate");
  }
  startLocationUpdateBackground(fn) {
    this.startLocationUpdate(fn);
    // console.warn("不支持 startLocationUpdateBackground");
  }
  createSelectorQuery(opt) {
    return my.createSelectorQuery(opt);
  }
  showLoading(opt = {}) {
    let { title: content, ...props } = opt;
    return my.showLoading({ content, delay: 0, ...props });
  }
  showModal(opt) {
    let { showCancel = true, cancelText = "取消", confirmText = "确定", success, cancel, ...props } = opt;
    const onConfirm = (res) => success && success(res);
    const onCancel = () => cancel && cancel();
    if (showCancel) {
      return my.confirm({
        ...props,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        success: (res) => (res.confirm ? onConfirm(res) : onCancel()),
      });
    } else {
      return my.alert({ ...props, buttonText: confirmText, success: onConfirm });
    }
  }
  showToast(opt) {
    let { title: content, ...props } = opt;
    return my.showToast({ content, ...props });
  }
  login({ success, ...options }) {
    my.getAuthCode({
      scopes: "auth_user",
      success: (res) => {
        success && success({ code: res.authCode });
      },
      ...options,
    });
  }
  _mapObjectKey(obj, fn) {
    return Object.entries(obj).map(([k, v]) => [fn(k), v]).reduce((total, [k, v]) => {
      total[k] = v;
      return total;
    }, {});
  }
  getSetting({ success, ...options }) {
    my.getSetting({
      success: ({ authSetting }) => {
        success && success(
          {
            authSetting: {
              ...this._mapObjectKey(authSetting, k => `scope.${k}`), // 默认全部加scope
              "scope.userInfo": authSetting['userInfo'],
              "scope.userLocation": authSetting['location'],
              "scope.writePhotosAlbum": authSetting['writePhotosAlbum'],
              "scope.camera": authSetting['camera'],
              "scope.werun": authSetting['alipaysports'],
              "scope.record": authSetting['audioRecord'],
              // 其他授权项目适配，根据实际情况选择需要的授权
            },
            // 如果有订阅消息配置，需要将其适配结构进行映射
            subscriptionsSetting: authSetting['subscriptionsSetting'] || {},
          }
        );
      },
      ...options,
    });
  }
  getAppAuthorizeSetting({ success, ...options }) {
    my.getSetting({
      success: ({ authSetting }) => {
        success && success(
          {
            app_authorize: {
              "albumAuthorized": authSetting['album'],
              "cameraAuthorized": authSetting['camera'],
              "locationAuthorized": authSetting['location'],
              "microphoneAuthorized": authSetting['audioRecord'],
              // 其他授权项目适配，根据实际情况选择需要的授权
            },
          }
        );
      },
      ...options,
    });
  }
  getAppAuthorizeSetting() {
    return my.getAppAuthorizeSetting();
  }
  getWindowInfo() {
    return my.getSystemInfoSync();
  }
  getSystemInfoSync() {
    let { platform, ...info } = my.getSystemInfoSync();
    if (my.isIDE) platform = "devtools";
    return { platform, ...info, SDKVersion: my.SDKVersion };
  }
  createCameraContext(id) {
    return my.createCameraContext(id || "camera");
  }
  isVKSupport(_version) {
    // ARSession
    // enum ARSessionTrackingMode {
    //   // 6Dof
    //   SLAM = "worldTracking",
    //   // 3Dof
    //   IMU = "orientationTracking",
    //   // 相机模式
    //   CAMERA = "camera",
    //   // 视频模式
    //   VIDEO = "video",
    // }
    // return ARSession.isSupported({ mode: 'worldTracking' })
    // TODO v1 未适配
    if (this.getSystemInfoSync().platform == "devtools") return false;
    try {
      // 支付宝小程序特有 ARSession、ExpAREngine
      if (this.debug > 3) console.log("ARSession", ARSession);
      if (this.debug > 1)
        console.log("ARSession.isSupported", ARSession && ARSession.isSupported({ mode: "worldTracking" }));
      return ARSession && ARSession.isSupported({ mode: "worldTracking" });
    } catch (e) {
      console.error((e && e.toString && e.toString()) || JSON.stringify(e));
      return false;
      // return ARSession && ARSession.isSupported({ mode: "worldTracking" });
    }
  }
  createVKSession(option) {
    // { version, track, gl }
    // TODO https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/wx.createVKSession.html
    // AR/IOS/ARIos.ts、AR/Android/ARAndroid.ts
  }
  setInnerAudioOption() {
    if (this.debug > 1) console.warn("不支持 setInnerAudioOption");
  }
  reportPerformance() {
    if (this.debug > 1) console.warn("不支持 reportPerformance");
  }
  reportEvent() {
    if (this.debug > 1) console.warn("不支持 reportEvent");
  }
  setStorage(obj) {
    if (obj.encrypt) if (this.debug > 1) console.warn("不支持");
    return super.setStorage(obj);
  }
  // 设置本地存储数据（同步）
  setStorageSync(key, data) {
    return super.setStorageSync({ key, data });
  }
  // 获取本地存储数据（异步）
  getStorage(params) {
    if (params.encrypt) if (this.debug > 1) console.warn("不支持");
    super.getStorage({
      key: params.key,
      success(res) {
        params.success(res.data);
      },
      fail(error) {
        if (typeof params.fail === "function") {
          params.fail(error);
        }
      },
      complete() {
        if (typeof params.complete === "function") {
          params.complete();
        }
      },
    });
  }

  // 获取本地存储数据（同步）
  getStorageSync(key) {
    return super.getStorageSync({ key }).data;
  }

  // 移除本地存储数据（同步）
  removeStorageSync(key) {
    return super.removeStorageSync({ key });
  }

  // 移除本地存储数据（异步）
  removeStorage(obj) {
    return super.removeStorage(obj);
  }

  // 获取本地存储信息（同步）
  getStorageInfoSync() {
    return super.getStorageInfoSync();
  }

  // 清除本地存储数据（同步）
  clearStorageSync() {
    return super.clearStorageSync();
  }

  // 清除本地存储数据（异步）
  clearStorage() {
    return super.clearStorage();
  }

  // 批量设置本地存储数据（同步）
  batchSetStorageSync(dataList) {
    dataList.forEach((data) => {
      super.setStorageSync({ key: data.key, data: data.data });
    });
  }

  // 批量设置本地存储数据（异步）
  batchSetStorage(params) {
    params.list.forEach((item) => {
      super.setStorage({ key: item.key, data: item.data });
    });
  }

  // 批量获取本地存储数据（同步）
  batchGetStorageSync(keyList) {
    const result = {};
    keyList.forEach((key) => {
      const value = super.getStorageSync({ key }).data;
      result[key] = value;
    });
    return result;
  }
  // 批量获取本地存储数据（异步）
  batchGetStorage(params) {
    const result = {};
    const length = params.keyList.length;
    let count = 0;
    params.keyList.forEach((key) => {
      super.getStorage({
        key: key,
        success(res) {
          result[key] = res.data;
        },
        complete() {
          count++;
          if (count === length) {
            params.success(result);
          }
        },
      });
    });
  }

  createMapContext(mapId, parent) {
    // https://opendocs.alipay.com/mini/api/mapcontext
    let ctx = super.createMapContext(mapId);
    [
      "addArc",
      "addCustomLayer",
      "addGroundOverlay",
      "addMarkers",
      "addVisualLayer",
      "eraseLines",
      "executeVisualLayerCommand",
      "fromScreenLocation",
      "getCenterLocation",
      "getRegion",
      "getRotate",
      "getScale",
      "getSkew",
      "includePoints",
      "initMarkerCluster",
      "moveAlong",
      "moveToLocation",
      "on",
      "openMapApp",
      "removeArc",
      "removeCustomLayer",
      "removeGroundOverlay",
      "removeMarkers",
      "removeVisualLayer",
      "setBoundary",
      "setCenterOffset",
      "setLocMarkerIcon",
      "toScreenLocation",
      "translateMarker",
      "updateGroundOverlay",
    ].forEach((fnName) => {
      if (!ctx[fnName]) {
        ctx[fnName] = function () {
          console.warn(`[TODO] MapContext.${fnName}方法暂不支持`);
        };
      }
    });
    return ctx;
  }

  chooseMedia({ success, ...option }) {
    if (option.mediaType.includes("image") && option.mediaType.includes("video")) console.warn("暂不支持多种类型");
    // 适配
    if (option.mediaType.includes("image")) {
      super.chooseImage({
        ...option,
        success: (res) => {
          const adaptedRes = res.tempFiles.map((tf) => {
            tf.path = tf.tempFilePath;
            return tf;
          });
          success(adaptedRes);
        },
      });
    } else if (option.mediaType.includes("video")) {
      // 适配视频类型
      super.chooseVideo({
        ...option,
        success: (res) => {
          const adaptedRes = {
            path: res.tempFilePath,
            duration: res.duration,
            size: res.size,
            height: res.height,
            width: res.width,
          };
          success(adaptedRes);
        },
      });
    }
  }

  showShareMenu(obj) {
    if (this.getSystemInfoSync().platform == "devtools") return console.warn("my.showShareMenu在开发者工具不支持");
    return super.showShareMenu(obj);
  }

  onAppRoute(listener) {
    this.eventManager.on("approute", listener);
  }
  offAppRoute(listener) {
    this.eventManager.off("approute", listener);
  }
  fireAppRoute(path) {
    this.eventManager.fire("approute", this, { path });
  }
}
export default CustomMy.getIns();
