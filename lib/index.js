'use strict';

var config = require('./config');
var add = require('./add');
var addFn = require('./add-fn');

var _require = require('./label-error'),
    addLabel = _require.addLabel,
    onError = _require.onError;

function extendJoi(joi) {
  var _loop = function _loop(type) {
    joi = joi.extend(function (joi) {
      return {
        base: joi[type](),
        name: type,
        language: {
          add: '{{!message}}'
        },
        rules: [{
          name: 'add',
          params: {
            schema: joi.alternatives().try(joi.func(), joi.object().schema()).required(),
            message: joi.string()
          },
          validate: add(joi, type)
        }]
      };
    });
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = config.types.scalars[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var type = _step.value;

      _loop(type);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var _loop2 = function _loop2(type) {
    joi = joi.extend(function (joi) {
      return {
        base: joi[type](),
        name: type,
        language: {
          addFn: '{{!message}}'
        },
        rules: [{
          name: 'addFn',
          params: {
            fn: joi.func().required(),
            message: joi.string().allow(null),
            noKey: joi.boolean()
          },
          validate: addFn(joi, type)
        }, {
          name: 'addLabel',
          params: {
            label: joi.string().min(1).required()
          },
          setup: addLabel
        }, {
          name: 'onError',
          params: {
            cb: joi.func()
          },
          setup: onError
        }]
      };
    });
  };

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = config.types.all[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var type = _step2.value;

      _loop2(type);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return joi;
}

var persistent = void 0;
module.exports = function (joi) {
  var persist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (!joi && persistent) return persistent;

  var ans = extendJoi(joi);
  persistent = persist ? ans : undefined;
  return ans;
};