帮我把微信小程序中的关键帧动画接口：
this.animate(selector, keyframes, duration, callback)
适配到支付宝小程序中。
大体沿用这个步骤：
1. 在组件onInit时声明
this.animate = function(selector, keyframes, duration, callback){
  // TODO 帮我实现，思路如下：
  // 使用animation = my.createAnimation()实现
  // 将keyframes中属于样式类型的属性采用animation.<方法>(值)的方式调用,之后调用step进行下一组动画，最后export()并setData到xml中
  // animation.<方法>支持的<方法>列表随后以4个反引号括起来
  // 如果存在offset字段的话，需要把duration总时间按比例分配，多次step实现
  // setData使用的key假定为xxxxxx,需要更新wxml中对应节点animation="{{xxxxxx}}"用于更新动画
}

并在该函数中实现逻辑，要求支持的keyframs如下用3个反引号括起来

```
offset	Number		否	关键帧的偏移，范围[0-1]
ease	String	linear	否	动画缓动函数
transformOrigin	String	否	基点位置，即 CSS transform-origin	
backgroundColor	String		否	背景颜色，即 CSS background-color
bottom	Number/String		否	底边位置，即 CSS bottom
height	Number/String		否	高度，即 CSS height
left	Number/String		否	左边位置，即 CSS left
width	Number/String		否	宽度，即 CSS width
opacity	Number		否	不透明度，即 CSS opacity
right	Number		否	右边位置，即 CSS right
top	Number/String		否	顶边位置，即 CSS top
matrix	Array		否	变换矩阵，即 CSS transform matrix
matrix3d	Array		否	三维变换矩阵，即 CSS transform matrix3d
rotate	Number		否	旋转，即 CSS transform rotate
rotate3d	Array		否	三维旋转，即 CSS transform rotate3d
rotateX	Number		否	X 方向旋转，即 CSS transform rotateX
rotateY	Number		否	Y 方向旋转，即 CSS transform rotateY
rotateZ	Number		否	Z 方向旋转，即 CSS transform rotateZ
scale	Array		否	缩放，即 CSS transform scale
scale3d	Array		否	三维缩放，即 CSS transform scale3d
scaleX	Number		否	X 方向缩放，即 CSS transform scaleX
scaleY	Number		否	Y 方向缩放，即 CSS transform scaleY
scaleZ	Number		否	Z 方向缩放，即 CSS transform scaleZ
skew	Array		否	倾斜，即 CSS transform skew
skewX	Number		否	X 方向倾斜，即 CSS transform skewX
skewY	Number		否	Y 方向倾斜，即 CSS transform skewY
translate	Array		否	位移，即 CSS transform translate
translate3d	Array		否	三维位移，即 CSS transform translate3d
translateX	Number		否	X 方向位移，即 CSS transform translateX
translateY	Number		否	Y 方向位移，即 CSS transform translateY
translateZ	Number		否	Z 方向位移，即 CSS transform translateZ
```
以下用4个反引号括起来的内容是支付宝animation动画实例，提供的实现动画的方法描述。这些方法（不包括 export）调用结束后均返回实例本身，即支持链式调用。
````
opacity	value	透明度，参数范围 0~1。
backgroundColor	color	颜色值。
width	length	设置宽度：长度值，单位为 px，例如：300 px。
height	length	设置高度：长度值，单位为 px，例如：300 px。
top	length	设置 top 值：长度值，单位为 px，例如：300 px。
left	length	设置 left 值：长度值，单位为 px，例如：300 px。
bottom	length	设置 bottom 值：长度值，单位为 px，例如：300 px。
right	length	设置 right 值：长度值，单位为 px，例如：300 px。
rotate	deg	deg 范围 -180 ~ 180，从原点顺时针旋转一个 deg 角度。
rotateX	deg	deg 范围 -180 ~ 180，在 X 轴旋转一个 deg 角度。
rotateY	deg	deg 范围 -180 ~ 180，在 Y 轴旋转一个 deg 角度。
rotateZ	deg	deg 范围 -180 ~ 180，在 Z 轴旋转一个 deg 角度。
rotate3d	x, y , z, deg	同 transform-function rotate3d。
scale	sx[, sy]	只有一个参数时，表示在 X 轴、Y 轴同时缩放 sx 倍；
两个参数时表示在 X 轴缩放 sx 倍，在 Y 轴缩放 sy 倍。
scaleX	sx	在 X 轴缩放 sx 倍。
scaleY	sy	在 Y 轴缩放 sy 倍。
scaleZ	sz	在 Z 轴缩放 sy 倍。
scale3d	sx, sy, sz	在 X 轴缩放 sx 倍，在 Y 轴缩放 sy 倍，在 Z 轴缩放 sz 倍。
translate	tx[, ty]	只有一个参数时，表示在 X 轴偏移 tx；
有两个参数时，表示在 X 轴偏移 tx，在 Y 轴偏移 ty，单位均为 px。
translateX	tx	在 X 轴偏移 tx，单位 px。
translateY	ty	在 Y 轴偏移 ty，单位 px。
translateZ	tz	在 Z 轴偏移 tz，单位 px。
translate3d	tx, ty, tz	在 X 轴偏移 tx，在 Y 轴偏移 ty，在 Z 轴偏移 tz，单位 px。
skew	ax[, ay]	参数范围 -180 ~ 180。只有一个参数时，Y 轴坐标不变，X 轴坐标延顺时针倾斜 ax 度；两个参数时，分别在 X 轴倾斜 ax 度，在 Y 轴倾斜 ay 度。
skewX	ax	参数范围 -180 ~ 180。Y 轴坐标不变，X 轴坐标延顺时针倾斜 ax 度。
skewY	ay	参数范围 -180~180。X 轴坐标不变，Y 轴坐标延顺时针倾斜 ay 度。
matrix	a, b, c, d, tx, ty	同 transform-function。
matrix3d	a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, a4, b4, c4, d4	同 transform-function matrix3d。
````
请核对支付宝支持的<方法>，如不支持需要console.warn警告