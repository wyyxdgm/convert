const project = require('./project.json');
const ajs = require("./ajs");
const wxml = require("./wxml");
const app = require("./app.json");
const wxs = require("./wxs");
const wxss = require("./wxss");
const json = require('./json');
// ...
module.exports = [
  project,
  app,
  ...ajs,
  ...wxml,
  ...wxs,
  ...wxss,
  ...json
  //...
];
