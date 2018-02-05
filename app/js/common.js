var fade_time_preloader = 700; //Время исчезновения прелоадера, мс

var w_w = window.innerWidth;
var body = document.querySelector('body');
var loader_wrap = document.querySelector('#loader_wrap');
var loader_base_display = getComputedStyle(loader_wrap).display;
var loader = document.querySelector('.loader');
var loader_comp_style = getComputedStyle(loader);
var loader_w = parseInt(loader_comp_style.width);
var loader_ratio = w_w / loader_w;

function init_preloader() {
    loader_wrap.style.display = loader_base_display;
    setTimeout(function() {
        loader_wrap.style.opacity = '1';
    }, 0);

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
        loader_wrap.style.transition = 'opacity ' + fade_time_preloader / 1000 + 's';
        loader_wrap.style.opacity = '0';
        setTimeout(function() {
            loader_wrap.style.display = 'none';
        }, fade_time_preloader);

    }
}

loader.addEventListener("click", remove_preloader); //Для теста
document.querySelector('#content_wrap').addEventListener("click", init_preloader); //Для теста

init_preloader();