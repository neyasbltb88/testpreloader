var w_w = window.innerWidth;
var loader = document.querySelector('.loader');
var loader_comp_style = getComputedStyle(loader);
var loader_w = parseInt(loader_comp_style.width);
var loader_ratio = w_w / loader_w;
var body = document.querySelector('body');
var loader_wrap = document.querySelector('#loader_wrap');

function init_preloader() {
    preloader_resize();
    (function() {
        var throttle = function(type, name, obj) {
            obj = obj || window;
            var running = false;
            var func = function() {
                if (running) { return; }
                running = true;
                requestAnimationFrame(function() {
                    obj.dispatchEvent(new CustomEvent(name));
                    running = false;
                });
            };
            obj.addEventListener(type, func);
        };
        throttle("resize", "optimizedResize");
    })();

    window.addEventListener("optimizedResize", preloader_resize);

    // setTimeout(function() {
    //     remove_preloader();
    // }, 5000);
}

function preloader_resize() {
    console.log('preloader_resize');
    w_w = window.innerWidth;
    loader.style.height = w_w / loader_ratio + 'px';
}

function remove_preloader() {
    console.log('remove_preloader');
    window.removeEventListener("optimizedResize", preloader_resize);
    if (loader_wrap) {
        loader_wrap.classList.add("opacity0");
        setTimeout(function() {
            body.removeChild(loader_wrap);
        }, 1000);

    }
}

loader.addEventListener("click", remove_preloader); //Для теста

init_preloader();