function log(argument) {
    console.log(argument);
}

function preloader_resize() {
    // log(window);
    // var w_w = window.innerWidth;
    // var w_h = window.innerHeight;
    // log(w_w + 'x' + w_h);
    var loader = document.querySelector('.loader');
    var loader_comp_style = getComputedStyle(loader);
    var loader_w = parseFloat(loader_comp_style.width);
    // log(loader_w);
    loader.style.height = loader_w + 'px';

    var segment = document.querySelectorAll('.segment');
    // log(segment);

    for (var i = 0; i < segment.length; i++) {
        segment[i].style.maxWidth = 'initial';
        // log(segment[i].style.maxWidth);
    }

    var segment_comp_style = getComputedStyle(segment[0]);
    // log(segment_comp_style);
    var segment_w = parseFloat(segment_comp_style.width);
    // log(segment_w);
    for (var i = 0; i < segment.length; i++) {
        segment[i].style.maxWidth = segment_w + 'px';
        // log(segment[i].style.maxWidth);
    }
}

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

    /* init - you can init any event */
    throttle("resize", "optimizedResize");
})();

window.addEventListener("optimizedResize", preloader_resize);