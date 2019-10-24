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
  },
  getOnAir: function(oxSup) {
    var oppBool = (oxSup !== 'true');
    return oppBool.toString();
  },
  getAvpu: function(levelOfConsciousness) {
    switch (levelOfConsciousness) {
      case 'Alert':
        return 'at0005';

      case 'Voice':
        return 'at0006';

      case 'Pain':
        return 'at0007';

      case 'Unresponsive':
        return 'at0008';

      default:
        return 'Not known';
    }
  },
  getLevelOfConsciousness: function(levelOfConsciousnessCode) {
    switch (levelOfConsciousnessCode) {
      case 'at0005':
        return 'Alert';

      case 'at0006':
        return 'Voice';

      case 'at0007':
        return 'Pain';

      case 'at0008':
        return 'Unresponsive';

      default:
        return 'Not known';
    }
  },
  getNarrative: function(name, route, doseAmount, doseTiming) {
     return name + ' - ' + route + ' - ' + doseAmount + ' ' + doseTiming;
  },
  fromNarrative: function(text) {
    if (text.indexOf(' - ') !== -1) {
      var pieces = text.split(' - ');
      if (!pieces[1]) return '';
      if (!pieces[2]) return pieces[1];
      var dose = pieces[2].split(' ')[0];
      return dose;
      //return pieces[1] + ' - ' + pieces[2];
    }
    var pieces = text.split('; Dose: ');
    if (!pieces[1]) return '';
    var dose = pieces[1].split('; Timing: ')[0];
    return dose;
  }
};