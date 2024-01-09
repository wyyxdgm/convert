const EnvConfig = {
  host: "http://10.10.33.60:8081",
  host: "https://wenlvlocsim.easyar.com",
};
import $my from "./$my";

function stringify(obj, replacer, spaces, cycleReplacer) {
  let nocontinue = false;
  for (v of obj) {
    if (nocontinue) break;
    if (typeof v === 'object' || typeof v === 'function') {
      for (v of obj) {
        if (nocontinue) break;
        if (typeof v === 'object' || typeof v === 'function') {
          for (v of obj) {
            if (nocontinue) break;
            if (typeof v === 'object' || typeof v === 'function') {
              nocontinue = true;
            }
          }
        }
      }
    }
  }
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces);
}

$my.onError((e) => {
  logRemote("error-event", e);
});

function serializer(replacer, cycleReplacer) {
  var stack = [],
    keys = [];

  if (cycleReplacer == null)
    cycleReplacer = function (key, value) {
      if (stack[0] === value) return "[Circular ~]";
      return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]";
    };

  return function (key, value) {
    if ('function' === typeof value) return 'Function';
    if (stack.length > 0) {
      var thisPos = stack.indexOf(this);
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value);
    } else stack.push(value);

    return replacer == null ? value : replacer.call(this, key, value);
  };
}

export function logRemote(...data) {
  return new Promise((resolve, reject) => {
    const url = EnvConfig.host + "/log";
    $my.request({
      url,
      method: "POST",
      data: data.map((d) => (typeof d === "object" ? stringify(d) : d)),
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}
export function getAuthCode() {
  return new Promise((rs, rj) => {
    $my.getAuthCode({
      scopes: "auth_base",
      success: (res) => {
        const authCode = res.authCode;
        rs(authCode);
      },
      fail: (err) => {
        console.log("my.getAuthCode 调用失败", err);
        rj(err);
      }
    });
  });
}
export function initLogConfig() {
  return new Promise(async (resolve, reject) => {
    const url = EnvConfig.host + "/log/login";
    let authCode = await getAuthCode();

    $my.request({
      url,
      method: "POST",
      data: { accountInfo: $my.getAccountInfoSync(), authCode },
      success: (res) => {
        if (res.data.debugOn) {
          setDebugOn();
        } else {
          setDebugOff();
        }
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}
function setDebugOn() {
  console.log(`setDebugOn`);
  // bk
  console._debug = console.debug;
  console._log = console.log;
  console._error = console.error;
  // override
  console.debug = (...d) => logRemote("debug", ...d);
  console.log = (...d) => logRemote("log", ...d);
  console.error = (...d) => logRemote("error", ...d);
}
function setDebugOff() {
  console.log(`setDebugOff`);
  if (console._debug) console.debug = console._debug;
  if (console._log) console.log = console._log;
  if (console._error) console.error = console._error;
}
let inited = false;
export function initLog() {
  if (inited) return;
  inited = true;
  initLogConfig();
}
