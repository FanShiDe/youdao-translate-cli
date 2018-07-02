#!/usr/bin/env node
'use strict';

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getTranslate = function getTranslate(params, language) {
  _axios2.default.post(_config2.default.url + '?' + _querystring2.default.stringify(params)).then(function (res) {
    var result = null;
    if (language.split('-')[1] === 'en') {
      var explains = res.data.basic.explains;
      var translation = res.data.translation;

      translation = translation.concat(explains);
      result = Array.from(new Set(translation));
    } else if (language === 'en-zh') {
      var _explains = res.data.basic.explains;

      result = _explains;
    } else if (language === 'ja-zh') {
      var _translation = res.data.translation;

      result = _translation;
    } else if (language === 'es-zh') {
      var _translation2 = res.data.translation;

      result = _translation2;
    } else {
      var _translation3 = res.data.translation;

      result = _translation3;
    }
    console.log('\n', result.join('；'));
    spinner.stop();
  }).catch(function (e) {
    console.error('出了一点点小意外￣□￣\n', e);
    spinner.stop();
  });
};

var translate = function translate() {
  var word = process.argv[4] || '';
  var translateType = process.argv[3];
  var languages = translateType.split('-') || 'zh-en';
  var utf8Word = Buffer.from(word).toString();
  var md5 = _crypto2.default.createHash('md5');
  var randomNumber = Math.random() * 100;
  md5.update('' + _config2.default.appID + utf8Word + randomNumber + _config2.default.appSecret);
  var sign = md5.digest('hex').slice(0, 32).toLocaleUpperCase();
  var params = {
    q: utf8Word,
    appKey: _config2.default.appID,
    salt: randomNumber,
    sign: sign,
    from: _config2.default.from[languages[0]],
    to: _config2.default.to[languages[1]]
  };
  getTranslate(params, translateType);
};

_commander2.default.version('0.1.0').description('💻 你好，欢迎使用 cuitfanshide 的有道翻译脚本 🍺').option('-t', 'translate one language to another language', translate);

var spinner = (0, _ora2.default)('正在查询中,请稍候...').start();
spinner.color = 'green';

_commander2.default.on('--help', function () {
  console.log('  Examples:');
  console.log('');
  console.log('    $ cts -t zh-en 可爱的');
  console.log("    $ cts -t en-es 'i love your'");
  console.log('');
});

_commander2.default.parse(process.argv);
