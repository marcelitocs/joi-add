"use strict";

module.exports = function (joi, type) {
  return function validate(params, value, state, options) {
    var ans = Boolean(params.fn(value, options));

    // Test passes if true
    if (ans) return value;

    // Test fails if false
    var message = void 0,
        noKey = void 0;
    if (params.message) {
      message = params.message;
      // eslint-disable-next-line
      noKey = params.noKey == undefined ? true : params.noKey;
    } else {
      message = "didn't pass";
      noKey = params.noKey || false;
    }
    var error = this.createError(type + ".addFn", { message: message }, state, options);
    if (params.message) error.context.isExplicit = true;
    if (noKey) error.message = message;
    return error;
  };
};