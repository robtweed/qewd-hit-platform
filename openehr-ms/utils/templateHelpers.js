module.exports = {
  now: function() {
    return Date.now();
  },
  getTime: function(openehr_date) {
    return new Date(openehr_date).getTime();
  },
  dvtext_value: function(value) {
    console.log('this.node = ' + this.node + '; this.key = ' + this.key);
    console.log('value = ' + value);
    console.log('this.path = ' + this.path);
    return value;
  }
};