'use strict';

exports.isObject = function(value) {
  return Object.prototype.toString.call(value).slice(8, -1) === 'Object';
};

exports.isNumber = function(value) {
  return typeof(value) === 'number' && !isNaN(Number.parseInt(value, 10));
}
