// ==UserScript==
// @name         GBB-jump
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.shuu.cf/extdomains/*
// @match        https://*.bing.com/*
// @match        https://gg.yhbl.workers.dev/*
// @match        https://*.baidu.com/*
// @match        https://en.yaodeyo.com:92/*
// @match        https://en.yaodeyo.com/*
// @match        https://*.luciaz.me/*
// @match        https://scholar.lanfanshu.cn/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keyup', function(event) {
        if ('input' === document.activeElement.tagName.toLowerCase()) {
            return;
        }

        const searchEngine = location.hostname;
        var google = /\w+.(shuu.cf|luciaz.me)/;
        let q;

        switch (searchEngine) {
            case searchEngine.match(google)?.input:
                q = document.getElementsByClassName("gLFyf gsfi")[1].value;
                break;
            case 'cn.bing.com':
            case 'www.bing.com':
                q = document.getElementById('sb_form_q').value;
                break;
            case 'gg.yhbl.workers.dev':
                q = document.getElementById('q').value;
                break;
            case 'www.baidu.com':
                q = document.getElementById('kw').value;
                break;
            case 'scholar.google.com':
            case 'scholar.lanfanshu.cn':
            case 'en.yaodeyo.com':
                q = document.getElementsByClassName('gs_in_txt gs_in_ac')[0].value;
                break;
            default:
                break;
        };

        let q_encoded = encodeURIComponent(q).replace(/%20/g, '+');

        switch (event.key) {
            // 谷歌
            case 'g':
                document.location = 'https://ceres.shuu.cf/extdomains/www.google.com.hk/search?newwindow=1&q=' + q_encoded;
                break;
            // 必应
            case 'b':
                document.location = 'https://www.bing.com/search?q=' + q_encoded;
                break;
            // 山寨蒙面谷歌
            case 's':
                document.location = 'https://gg.yhbl.workers.dev/do/search?lui=english&language=english&cat=web&query=' + q_encoded;
                break;
            // 度娘
            case 'd':
                document.location = 'https://www.baidu.com/s?ie=utf-8&wd=' + q_encoded;
                break;
            // 学术谷歌
            case 'x':
                document.location = 'https://scholar.lanfanshu.cn/scholar?hl=en&newwindow=1&q=' + q_encoded;
                break;
            // 浙大谷歌
            case 'z':
                document.location = 'https://g.luciaz.me/search?newwindow=1&q=' + q_encoded;
                break;
            default:
                break;
        };
    });
})();
