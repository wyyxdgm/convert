/*
  微信wxml中的标签属性适配
*/
const attrMap = [
  /*  微信   ->   支付宝  */
  // 基础事件
  ["bindtap", "onTap"],
  ["catchtap", "catchTap"],
  ["binderror", "onError"],
  ["bindload", "onLoad"],
  ["bindlongpress", "onLongTap"],

  // 基础内容
  // icon 无差异
  // progress https://opendocs.alipay.com/mini/component/progress
  ["activeColor", "active-color"],
  ["backgroundColor", "background-color"],
  /*
    special : wx: active-mode[forwards default:backwards] a:active[true default:false]
    border-radius、font-size、color、duration、bindactiveend,active-
  */
  // 富文本编辑器editor 无此标签
  // 富文本rich-text  https://opendocs.alipay.com/mini/component/rich-text
  /*
    user-select,-
    space,-
  */
  // text
  /*
    user-select,-
    -,number-of-lines
  */

  // 媒体
  // channel-*、live-*,-
  // -,lottie动画
  // audio 支付宝无此标签，使用API实现功能
  // 图片image https://opendocs.alipay.com/mini/component/image#%E5%B1%9E%E6%80%A7%E8%AF%B4%E6%98%8E
  /*
    show-menu-by-longpress,-
    webp,-
    -,default-source
  */
  // 相机 https://opendocs.alipay.com/mini/03qegu#%E5%B1%9E%E6%80%A7%E8%AF%B4%E6%98%8E
  ["resolution", "output-dimension", "1080P"], // 默认720P
  ["bindstop", "onStop"],
  ["binderror", "onError"],
  ["bindinitdone", "onReady"],
  ["bindscancode", "onScanCode"],

  // canvas https://opendocs.alipay.com/mini/component/canvas#%E5%B1%9E%E6%80%A7%E8%AF%B4%E6%98%8E
  ["bindtouchstart", "onTouchStart"],
  ["bindtouchmove", "onTouchMove"],
  ["bindtouchend", "onTouchEnd"],
  ["bindtouchcancel", "onTouchCancel"],
  ["bindlongtap", "onLongTap"],
  /*
    binderror,-
  */

  // form
  // 多项选择器组 checkbox-group
  ["bindchange", "onChange"],
  // 表单 form  https://opendocs.alipay.com/mini/component/form
  ["bindsubmit", "onSubmit"],
  ["bindreset", "onReset"],
  /*
    report-submit-timeout,-
  */
  // input  https://opendocs.alipay.com/mini/component/input
  ["bindinput", "onInput"],
  ["bindfocus", "onFocus"],
  ["bindblur", "onBlur"],
  ["bindconfirm", "onConfirm"],
  /*
    bindkeyboardheightchange,-
    bindnicknamereview,-
    safe-password-*,-
    adjust-position,-
    hold-keyboard,-
    always-embed,-
    -,always-system
    -,controlled
    cursor-spacing,-
    值{
      type:{
        safe-password,-
        nickname,-
        -,numberpad、digitpad、idcardpad
      }
    }
  */
  // keyboard-accessory 无此标签
  // label 无差异
  // 底部弹出选择器picker special:微信倾向于封装，支付宝倾向于自定义
  ["header-text", "title"],
  /*
    https://developers.weixin.qq.com/miniprogram/dev/component/picker.html

    https://opendocs.alipay.com/mini/component/picker、
    https://opendocs.alipay.com/mini/api/multi-level-select、
    https://opendocs.alipay.com/mini/api/ui-date
    mode,-
    bindcancel,-
    -,range、range-key、value
  */
  // picker-view
  ["bindpickstart", "onPickStart"],
  ["bindpickend", "onPickEnd"],
  /*
    immediate-change,-
  */
  // radio、radio-group 无差异 使用限制：https://opendocs.alipay.com/mini/component/radio
  // slider todo
  // switch todo
  // textarea todo

  // map
  ["polygons", "polygon"],
  ["bindmarkertap", "onMarkerTap"],
  ["bindcallouttap", "onCalloutTap"],
  ["bindcontroltap", "onControlTap"],
  ["bindregionchange", "onRegionChange"],
  /*
    bindanchorpointtap、bindpoitap、bindupdated、bindlabeltap,-
    -,onInitComplete、onPanelTap
    min-scale、max-scale,-
    subkey、layer-style、enable-3D、enable-auto-max-overlooking,-
    special:  scale wx:[3-20 default:16] a:[5-18 default:16]
  */

  // navigator
  /*
    target、app-id、path、extra-data、version、short-link、hover-stop-propagation、delta,-
    bindsuccess、bindfail、bindcomplate,-
  */
  // functional-page-navigator 无此标签

  // 开放能力（组件）
  // web-view
  ["bindmessage", "onMessage"],
  // 内容号
  /*
    关注公众号 official-account https://developers.weixin.qq.com/miniprogram/dev/component/official-account.html
    关注生活号 lifestyle  https://opendocs.alipay.com/mini/component/lifestyle
  */
  // ad、adcustom,无此标签
  // 无此标签,error-view、contact-button、join-group-chat、subscribe-message

  // 页面属性配置节点 page-meta
  ["bindscroll", "onScroll"],
  /*
    background-text-style、page-orientation、bindresize、bindscrolldone
  */

  // 视图容器
  // grid-view、list-view、sticky-header、sticky-section,无此标签
  // view
  /*
    -,动画监听事件,元素显示占比监听事件
  */
  // swpier
  ["bindtransition", "onTransition"],
  ["bindanimationfinish", "onAnimationEnd"],
  /*
    -,active-class、changing-class、惯性跨屏滑动acceleration、disable-touch、swipe-ratio、swipe-speed、touch-angle、adjust-height、adjust-vertical-height
  */
  // scroll-view
  ["bindscrolltoupper", "onScrollToUpper"],
  ["bindscrolltolower", "onScrollToLower"],
  /*
    enable-flex、scroll-anchoring、enable-passive、自定义下拉刷新refresher-*、enhanced、bounces、show-scrollbar、paging-enabled、fast-deceleration,-
    binddrag-*
    -,scroll-animation-duration、disable-lower-scroll、disable-upper-scroll、trap-scroll
  */
  // cover-view、cover-image、match-media、movable-area  [nothing to convert]
  // movable-view
  ["bindscale", "onScale"],
  /*
    htouchmove、vtouchmove,-
    -,onChangeEnd,
  */
  // page-container
  ["bindbeforeenter", "onBeforeEnter"],
  ["bindenter", "onEnter"],
  ["bindafterenter", "onafterEnter"],
  ["bindbeforeleave", "onBeforeLeave"],
  ["bindleave", "onLeave"],
  ["bindafterleave", "onAfterLeave"],
  ["bindclickoverlay", "onClickOverlay"],
  // share-element
  ["key", "name"],
  // root-portal 无差异

  // 原生组件 native-component 无此标签

  // 导航栏 navigation-bar（！不同于导航）无此标签

  // 无障碍 todo

  // xr-frame 无此标签

  // wxs
  ["module","name"]
]
