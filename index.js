'use strict';

const VertexCrud = require('./lib/vertex');
const EdgeCrud   = require('./lib/edge');

module.exports = {
  vertex : VertexCrud,
  edge   : EdgeCrud
};
