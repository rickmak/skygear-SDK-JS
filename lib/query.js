import _ from 'lodash';

import Record from './record';

export default class Query {

  constructor(recordCls) {
    if (!Record.validType(recordCls.recordType)) {
      throw new Error('RecordType is not valid. Please start with alphanumeric string.');
    }
    this.recordCls = recordCls;
    this.recordType = recordCls.recordType;
    this._predicate = [];
    this._sort = [];
    this.limit = 50;
    this.offset = 0;
  }

  like(key, value) {
    this._predicate.push(['like', {$type: 'keypath', $val: key}, value]);
    return this;
  }

  equalTo(key, value) {
    this._predicate.push(['eq', {$type: 'keypath', $val: key}, value]);
    return this;
  }

  notEqualTo(key, value) {
    this._predicate.push(['neq', {$type: 'keypath', $val: key}, value]);
    return this;
  }

  greaterThan(key, value) {
    this._predicate.push(['gt', {$type: 'keypath', $val: key}, value]);
    return this;
  }

  greaterThanOrEqualTo(key, value) {
    this._predicate.push(['gte', {$type: 'keypath', $val: key}, value]);
    return this;
  }

  lessThan(key, value) {
    this._predicate.push(['lt', {$type: 'keypath', $val: key}, value]);
    return this;
  }

  lessThanOrEqualTo(key, value) {
    this._predicate.push(['lte', {$type: 'keypath', $val: key}, value]);
    return this;
  }

  addDescending(key) {
    this._sort.push([
      {$type: 'keypath', $val: key},
      'desc'
    ]);
    return this;
  }

  addAscending(key) {
    this._sort.push([
      {$type: 'keypath', $val: key},
      'asc'
    ]);
    return this;
  }

  get predicate() {
    if (this._predicate.length === 0) {
      return [];
    }
    if (this._predicate.length === 1) {
      return this._predicate[0];
    } else {
      let _predicate = _.clone(this._predicate);
      _predicate.unshift('and');
      return _predicate;
    }
  }

  /* eslint camelcase: 0 */
  toJSON() {
    let payload = {
      record_type: this.recordType,
      limit: this.limit,
      sort: this._sort
    };
    if (this.predicate.length > 1) {
      payload.predicate = this.predicate;
    }
    if (this.offset) {
      payload.offset = this.offset;
    }
    return payload;
  }

}