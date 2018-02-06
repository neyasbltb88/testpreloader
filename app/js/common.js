var loader_demo = true;
var loader_square = true;

var loader_wrap = document.querySelector('#loader_wrap');
var loader_wrap_original_display = getComputedStyle(loader_wrap).display;
var loader = document.querySelector('.loader');
var content_wrap = document.querySelector('#content_wrap');

var loader_fade_time_preloader = 700; //Время исчезновения прелоадера, мс
var loader_time_demo = 3500; //Период переключения демо, мс

var animation_classes = {
    rotation: "loader_animation_rotation",
    scale_before: "loader_animation_scale_before",
    scale_after: "loader_animation_scale_after"
};

if (loader_square) {
    init_optimizedResize();

    function preloader_resize() {
        console.log('preloader_resize');
        var w_w = window.innerWidth;
        var loader_comp_style = getComputedStyle(loader);
        var loader_w = parseInt(loader_comp_style.width);
        var loader_ratio = w_w / loader_w;
        loader.style.height = w_w / loader_ratio + 'px';
    }
    init_preloader();
} else {
    init_preloader();
}

if (loader_demo) { //Для теста
    init_loader_demo()
}

function init_preloader(callback1, callback2) {
    console.log('init_preloader()');
    loader_wrap.style.display = loader_wrap_original_display;
    loader_wrap.classList.add(
        animation_classes.rotation,
        animation_classes.scale_before,
        animation_classes.scale_after
    );
    loader_wrap.classList.add("active");
    setTimeout(function() {
        loader_wrap.style.opacity = '1';
    }, 10);

    if (loader_square) {
        window.addEventListener("optimizedResize", preloader_resize);
        preloader_resize();
    }

    setTimeout(function() {
        document.body.style.overflowY = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100vw';
        document.body.style.height = '100vh';

        if (typeof(callback1) == 'function') {
            callback1();
        } else if (typeof(callback2) == 'function') {
            callback2();
        }
    }, loader_fade_time_preloader);
}

function remove_preloader(callback1, callback2) {
    console.log('remove_preloader()');
    if (loader_square) {
        window.removeEventListener("optimizedResize", preloader_resize);
    }
    if (loader_wrap) {
        loader_wrap.style.transition = 'opacity ' + loader_fade_time_preloader / 1000 + 's';
        loader_wrap.style.opacity = '0';
        document.body.style.overflowY = 'unset';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.position = '';
        setTimeout(function() {
            loader_wrap.style.display = 'none';
            loader_wrap.classList.remove(
                animation_classes.rotation,
                animation_classes.scale_before,
                animation_classes.scale_after
            );

            if (typeof(callback1) == 'function') {
                callback1();
            } else if (typeof(callback2) == 'function') {
                callback2();
            }
            loader_wrap.classList.remove("active");
        }, loader_fade_time_preloader);
    }
}

content_wrap.addEventListener("click", init_preloader); //Для теста
content_wrap.style.cursor = 'pointer'; //Для теста

loader.addEventListener("click", remove_preloader, test_callback); //Для теста

loader.style.cursor = 'pointer'; //Для теста

function init_optimizedResize() {
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
}

function init_loader_demo() {
    loader_demo = false;
    console.log('Демо-режим');
    setInterval(function() {
        if (loader_wrap.style.display == loader_wrap_original_display) {
            remove_preloader(test_callback);
        } else {
            init_preloader(test_callback);
        }
    }, loader_time_demo);
}

function test_callback() {
    console.log('test_callback');
}