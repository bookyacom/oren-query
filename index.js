'use strict';

const VertexCrud = require('./lib/vertex');
const EdgeCrud   = require('./lib/edge');
const DocCrud    = require('./lib/document');

const Model = require('./lib/model');

module.exports = {
  vertex : VertexCrud,
  edge   : EdgeCrud,
  document: DocCrud,
  model : Model
};
