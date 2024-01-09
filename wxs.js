module.exports = [{
    match: /\.wxs$/,// match 可以是函数、正则、字符
    parse(c, ctx) {
      let bb = c.getStr()
      bb = bb.replace("module.exports =","export default");
      c.serialize = () => bb
    }
}];