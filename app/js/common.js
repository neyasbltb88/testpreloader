function log(argument) {
    console.log(argument);
}

(function init_preloader() {
    // log(window);
    var w_w = window.innerWidth;
    var w_h = window.innerHeight;
    // log(w_w + 'x' + w_h);
    var loader = document.querySelector('.loader');
    var loader_comp_style = getComputedStyle(loader);
    var loader_w = parseInt(loader_comp_style.width);
    var loader_ratio = w_w / loader_w;

    var segment = document.querySelectorAll('.segment');
    var segment_comp_style = getComputedStyle(segment[0]);
    var segment_w = parseInt(segment_comp_style.width);
    var segment_ratio = loader_w / segment_w;

    log('loader_w: ' + parseInt(w_w / loader_ratio));
    log('segment_w: ' + parseInt(segment_w));

    function preloader_resize() {
        var w_w = window.innerWidth;

        loader.style.height = w_w / loader_ratio + 'px';

        // var segment_w = (w_w / loader_ratio) / segment_ratio;
        // // log('loader_w: ' + parseInt(w_w / loader_ratio));
        // // log('segment_w: ' + parseInt(segment_w));
        // for (var i = 0; i < segment.length; i++) {
        //     segment[i].style.maxWidth = (segment_w) + 'px';
        // }
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

})();