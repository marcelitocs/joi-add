'use strict';

function run(errs, cb) {
  var addLabel = this._flags.addLabel;
  if (addLabel) {
    errs.forEach(function (err) {
      if (err.hasOwnProperty('context') && err.context.label === addLabel) {
        err.context.addLabel = addLabel;
      }
    });
  }
  return cb ? cb(errs) : errs;
}

module.exports = {
  addLabel: function addLabel(params) {
    var _this = this;

    this._flags.addLabel = params.label;
    return this.label(params.label).error(function (errs) {
      return run.call(_this, errs);
    });
  },
  onError: function onError(params) {
    var _this2 = this;

    return this.error(function (errs) {
      return run.call(_this2, errs, params.cb);
    });
  }
};