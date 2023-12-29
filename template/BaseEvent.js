export class BaseEvent {
  constructor() {
    this.$events = new Map();
    this.$onceEvents = new Map();
  }
  /**
   * 触发某事件
   * @param {*} event
   */
  fire(event, context = null, ...data) {
    if (event) {
      let fns = this.$events.get(event);
      fns && fns.map((fn) => fn.apply(context, data));
      let onceFns = this.$onceEvents.get(event);
      onceFns && onceFns.map((fn) => fn.apply(context, data));
      this.$onceEvents.delete(event);
    } else {
      let fnsArr = Array.from(this.$events.values());
      fnsArr.forEach((fns) => {
        fns.forEach((fn) => {
          fn.apply(context, data);
        });
      });
      let onceFnsArr = Array.from(this.$onceEvents.values());
      onceFnsArr && onceFnsArr.forEach((fns) => fns.forEach((fn) => fn.apply(context, data)));
      this.$onceEvents.clear();
    }
  }
  /**
   * 绑定某事件
   * @param {*} event
   */
  on(event, handler) {
    let fns = this.$events.get(event);
    fns ? fns.push(handler) : this.$events.set(event, [handler]);
  }
  size(event) {
    return this.$events.get(event).length;
  }
  has(event) {
    return this.$events.has(event);
  }
  /**
   * 绑定某事件，只触发一次
   * @param {*} event
   */
  once(event, handler) {
    let fns = this.$onceEvents.get(event);
    fns ? fns.push(handler) : this.$onceEvents.set(event, [handler]);
  }
  /**
   * 解绑某事件的处理函数
   * @param {*} event
   */
  off(event, handler) {
    let fns = this.$events.get(event);
    let onceFns = this.$onceEvents.get(event);
    if (handler) {
      if (fns) {
        let idx = fns.indexOf(handler);
        if (idx > -1) fns.splice(idx, 1);
      }
      if (onceFns) {
        let idx = onceFns.indexOf(handler);
        if (idx > -1) onceFns.splice(idx, 1);
      }
    } else {
      fns && fns.spilce(0, fns.length);
      onceFns && onceFns.spilce(0, onceFns.length);
    }
  }
  destory() {
    this.$events.clear();
    this.$onceEvents.clear();
  }
}
