# TODO

# animate已支持

## keyframes方案
1. page.js 中记录节点选择器，添加到 state.opts.c.animationSelectors
2. wxml.js 中根据是否能获取到记录该 selectors 筛选节点，对每个selector对应的节点创建或添加行内style：`animation:{{${animationKey}}}`;"
3. wxss.js 中添加对应 keyframe 代码： `@keyframs ${animationName} {0% {...}, ..., 100% {...}}`
4. page.js 中针对匹配中的 node 节点替代代码，为 this.setData({`${animationKey}`:`${animationName} ${ease} ${duration}s ${delay}s ${infinite}`})

## createAnimation方案

支持的方法参考：https://opendocs.alipay.com/mini/api/ui-animation