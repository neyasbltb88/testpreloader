var loader_demo = true;
var loader_wrap = document.querySelector('#loader_wrap');
var loader_wrap_original_display = getComputedStyle(loader_wrap).display;

var fade_time_preloader = 700; //Время исчезновения прелоадера, мс

var animation_classes = {
    rotation: "loader_animation_rotation",
    scale_before: "loader_animation_scale_before",
    scale_after: "loader_animation_scale_after"
};

function init_preloader() {
    console.log('init_preloader()');
    loader_wrap.style.display = loader_wrap_original_display;
    loader_wrap.classList.add(
        animation_classes.rotation,
        animation_classes.scale_before,
        animation_classes.scale_after
    );
    setTimeout(function() {
        loader_wrap.style.opacity = '1';
    }, 10);


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
}

function preloader_resize() {
    console.log('preloader_resize');
    var w_w = window.innerWidth;
    var loader = document.querySelector('.loader');
    var loader_comp_style = getComputedStyle(loader);
    var loader_w = parseInt(loader_comp_style.width);
    var loader_ratio = w_w / loader_w;
    loader.style.height = w_w / loader_ratio + 'px';

    loader.addEventListener("click", remove_preloader); //Для теста
    loader.style.cursor = 'pointer'; //Для теста
}

function remove_preloader() {
    console.log('remove_preloader()');
    window.removeEventListener("optimizedResize", preloader_resize);
    if (loader_wrap) {
        loader_wrap.style.transition = 'opacity ' + fade_time_preloader / 1000 + 's';
        loader_wrap.style.opacity = '0';
        setTimeout(function() {
            loader_wrap.style.display = 'none';
            loader_wrap.classList.remove(
                animation_classes.rotation,
                animation_classes.scale_before,
                animation_classes.scale_after
            );
        }, fade_time_preloader);

    }
}


document.querySelector('#content_wrap').addEventListener("click", init_preloader); //Для теста
document.querySelector('#content_wrap').style.cursor = 'pointer'; //Для теста

init_preloader();
preloader_resize();

if (loader_demo) {
    loader_demo = false;
    setInterval(function() {
        if (loader_wrap.style.display == loader_wrap_original_display) {
            remove_preloader();
        } else {
            init_preloader();
        }
    }, 3500);
}