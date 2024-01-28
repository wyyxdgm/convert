# TODO

- exclude 的文件，如果出现在代码中也需要删除

- components/parser/parser.js
  手动改 timer，原来的 timer 存在多次触发的情况

- 属性中的 props._.observer->到 observers._

- SelectorQuery 的回调调整到 exec 中

```js
SelectorQuery.select("#one")
  .boundingClientRect((res) => {})
  .exec();

SelectorQuery.select("#one")
  .boundingClientRect()
  .exec(([res]) => {});
```

- <template is="xxxx"></template>中如果出现组件自定义组件，无法解析，需要复制内容出来

```xml
  <view class="intro-wrapper theme-2-i-popup-text" a:if="{{currentPoi.intro}}">
    <view class="intro-title" a:if="{{introTitle}}">{{introTitle}}</view>
    <parser class="intro-richtext" html="{{currentPoi.intro}}" onReady="richtextLoadReady" />
  </view>
  <!-- <template is="intro" data="{{intro:currentPoi.intro}}"></template> -->
```

- movable-area 不支持 animation

```xml
<movable-area animation="{{animationAr}}" catch:touchmove="prevent">


<view animation="{{animationAr}}" catchTouchmove="prevent" style="position:absolute;z-index:200;" catchTouchmove="prevent">
<movable-area >
```

- button[open-type] 兼容

```xml
<button open-type="getPhoneNumber"
onGetphonenumber="getPhoneNumber"></button>
<!-- 替换 -->
<button open-type="getAuthorize" scope="phoneNumber"
onGetPhoneNumber="getPhoneNumber"></button>


<button open-type="agreePrivacyAuthorization"
onAgreeprivacyauthorization="handleAgree"></button>
<!-- 不支持 -->


<button open-type="getUserInfo"
onGetuserinfo="getuserinfo"></button>
<!-- 替换|getuserinfo内部事件暂不用处理，使用getUserProfile判断没有直接走默认的button事件 -->
<button open-type="getAuthorize" scope="userInfo"
onGetUserInfo="getuserinfo"></button>


<button open-type="share"></button>
<!-- 支付宝框架已支持  -->
```
