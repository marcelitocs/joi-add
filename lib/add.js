'use strict';

var cloneDeep = require('lodash.clonedeep');
var merge = require('lodash.merge');
var config = require('./config');

module.exports = function (joi, type) {
  return function validate(params, value, state, options) {
    // Prepare schema if function
    var schema = params.schema;
    if (typeof schema === 'function') {
      schema = schema(joi[type]()) || {};
      joi.assert(schema, joi.object().schema(), Error('The function passed to .add() must return a Joi schema.'));
    }

    // Clone validation options and
    // ensure abortEarly and empty language.key
    var opts = cloneDeep(options);
    opts.abortEarly = true;
    if (!opts.language) opts.language = {};
    opts.language.key = '';

    // Validate
    var ans = joi.validate(value, schema, opts);
    // and return error if validation failed
    if (ans.error) {
      // Get validation error (old)
      // and create error to return (new)
      var err = {};
      err.old = ans.error.details[0];
      err.new = this.createError(config.addInheritErrorTypes ? err.old.type : type + '.add', { message: err.old.message }, state, options);

      // Merge old and new paths
      err.new.path = (err.new.path || []).concat(err.old.path || []);

      // Merge old and new contexts
      var rootLabel = opts.language ? opts.language.root || 'value' : 'value';
      if (err.old.context.label === rootLabel) delete err.old.context.label;
      err.new.context = merge(err.new.context, err.old.context);

      // Replace message if explicit
      if (params.message) {
        err.new.message = params.message;
        err.new.context.isExplicit = true;
      }

      return err.new;
    }
    return ans.value;
  };
};