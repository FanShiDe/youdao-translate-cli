#!/usr/bin/env node

import appConfig from './config';
import program from 'commander';
import axios from 'axios';
import querystring from 'querystring';
import crypto from 'crypto';
import ora from 'ora';

const getTranslate = (params, language) => {
  axios.post(`${appConfig.url}?${querystring.stringify(params)}`).then(res => {
    let result = null;
    if (language.split('-')[1] === 'en') {
      const { basic: { explains } } = res.data;
      let { translation } = res.data;
      translation = translation.concat(explains);
      result =  Array.from(new Set(translation));
    } else if (language === 'en-zh') {
      const { basic: { explains } } = res.data;
      result = explains;
    } else if (language === 'ja-zh') {
      const { translation } = res.data;
      result = translation;
    } else if (language === 'es-zh') {
      const { translation } = res.data;
      result = translation;
    } else {
      const { translation } = res.data;
      result = translation;
    }
    console.log('\n', result.join('；'));
    spinner.stop();
  }).catch(e => {
    console.error('出了一点点小意外￣□￣\n', e);
    spinner.stop();
  });
}

const translate = () => {
  const word = process.argv[4] || '';
  const translateType = process.argv[3];
  const languages = translateType.split('-') || 'zh-en';
  const utf8Word = Buffer.from(word).toString();
  const md5 = crypto.createHash('md5');
  const randomNumber = Math.random() * 100;
  md5.update(`${appConfig.appID}${utf8Word}${randomNumber}${appConfig.appSecret}`);
  const sign = md5.digest('hex').slice(0, 32).toLocaleUpperCase();
  const params = {
    q: utf8Word,
    appKey: appConfig.appID,
    salt: randomNumber,
    sign,
    from: appConfig.from[languages[0]],
    to: appConfig.to[languages[1]]
  };
  getTranslate(params, translateType);
};

program.version('0.1.0').description('💻 你好，欢迎使用 cuitfanshide 的有道翻译脚本 🍺')
.option('-t', 'translate one language to another language', translate);

const spinner = ora('正在查询中,请稍候...').start();
spinner.color = 'green';

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ cts -t zh-en 可爱的');
  console.log("    $ cts -t en-es 'i love your'");
  console.log('');
});

program.parse(process.argv);
