// ==UserScript==
// @name         inoreader-highlight
// @description  Wrapping/Coloring letters in an HTML page
// @version      0.1
// @match        https://*.inoreader.com/*
// @match        https://*.innoreader.com/*
// @match        https://*.sciencedirect.com/*
// @match        https://*.springer.com/*
// @match        https://*.springeropen.com/*
// @match        https://*.wiley.com/*
// @match        https://*.science.org/*
// @match        https://*.nature.com/*
// @match        https://*.pnas.org/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://gist.githubusercontent.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

//-- Use CSS, *not* inline styles to color/style things
GM_addStyle ( "                                 \
    span.coloredWord {                          \
        background: #ff6;                       \
    }                                           \
" );

var letI_Wrapper = new wrapTextWithElement ('conservation|biological\\s*\\w*\\s*\\w*\\s*invasion|restoration|ecosystems?', '<span class="coloredWord">');

const rules={
    'Elsevier':{
        name:'Elsevier',
        matcher:/https:\/\/www.sciencedirect.com\/.+/,
        selector:'span.title-text, #abstracts p span, #abstracts p span a, #abstracts p a, #body p'
    },
    'Springer':{
        name:'Springer',
        matcher:/https:\/\/.*?.springer(open)?.com\/.+/,
        selector:'div.MainTitleSection h1, div.c-article-header > header > h1, #Abs1 p, #body p, div.c-article-body p, .c-article-section__content p'
    },
    'Wiley':{
        name:'Wiley',
        matcher:/https:\/\/.*?.wiley.com\/.+/,
        selector:'div.article-citation h1, #section-1-en li, section.article-section.article-section__full p, section.article-section.article-section__full header'
    },
    'Science':{
        name:'Science',
        matcher:/https:\/\/www.science.org\/.+/,
        selector:'#frontmatter h1, div[role="paragraph"]'
    },
    'Nature':{
        name:'Nature',
        matcher:/https:\/\/www.nature.com\/.+/,
        selector:'div.c-article-header > header > h1, div.c-article-body p'
    },
    'PNAS':{
        name:'PNAS',
        matcher:/https:\/\/www.pnas.org\/.+/,
        selector:'#page-title, #content-block-markup > div p'
    },
    'Inoreader':{
        name:'Inoreader',
        matcher:/https:\/\/www.inn?oreader.com\/.*/,
        selector:'span.article_header_title, div.article_title, div.article_content > h2 + p'
    }
};

(function() {
    'use strict';
    const GetActiveRule = ()=>rules[Object.keys(rules).filter(item=>GM_getValue("enable_rule:"+item,true)).find(item=>rules[item].matcher.test(document.location.href))];
    let url=document.location.href;
    let rule=GetActiveRule();
    setInterval(()=>{
        if(document.location.href!=url){
            url=document.location.href;
            const ruleNew=GetActiveRule();
            if(ruleNew!=rule){
                if(ruleNew!=null){
                    console.log(`【词高亮】检测到URl变更，改为使用【${ruleNew.name}】规则`)
                }else{
                    console.log("【词高亮】当前无匹配规则")
                }
                rule=ruleNew;
            }
        }
    },200)
    console.log(rule?`【词高亮】使用【${rule.name}】规则`:"【词高亮】当前无匹配规则");
    if(!rule)return;
    waitForKeyElements (rule.selector, letI_Wrapper.wrap);
})();

function wrapTextWithElement (targText, elemToWrapWith, bCaseSensitive) {
    var self            = this;
    var bCaseSensitive  = bCaseSensitive || false;
    self.targRegEx      = new RegExp ("(" + targText + ")", bCaseSensitive ? "" : "i");
    self.elemToWrapWith = elemToWrapWith;

    self.wrap = function (node) {
        $(node).contents ().each ( function () {
            if (this.nodeType === Node.ELEMENT_NODE) {
                self.wrap (this);
            }
            else if (this.nodeType === Node.TEXT_NODE) {
                var ndText  = this.nodeValue;

                if (self.targRegEx.test (ndText) ) {
                    var replaceNodes = $.map (
                        ndText.split (self.targRegEx),
                        function (phrase) {
                            if (self.targRegEx.test (phrase) ) {
                                /*  The $(HTML, props) form does not work if the HTML
                                    has attributes
                                var wrapped = $(self.elemToWrapWith, {text: phrase} );
                                */
                                var wrapped = $(self.elemToWrapWith).text (phrase);

                                return wrapped.get ();
                            }
                            else {
                                if (phrase == "")
                                    return null;
                                else
                                    return document.createTextNode (phrase)
                            }
                        }
                    );
                    $(this).replaceWith (replaceNodes);
                }
            }
        } );
    };
}
