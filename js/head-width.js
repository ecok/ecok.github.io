// $('.digest').prev('.menu').children('ul').css( "max-width", "1080px");
(function() {
let el = document.querySelector('.container.list.digest');
let na = el.previousElementSibling;
na.querySelector('ul').style.maxWidth = '1080px';

let fo = document.querySelector('.container.list.digest ~ footer');
fo.querySelector('.footer').style.maxWidth = '1080px';
})();
