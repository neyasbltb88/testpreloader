function log(argument) {
    console.log(argument);
}

(function resize() {
    log(window);
    var w_w = window.innerWidth;
    var w_h = window.innerHeight;
    log(w_w + 'x' + w_h);
    var loader = document.querySelector('.loader');
    var loader_comp_style = getComputedStyle(loader);
    var loader_w = parseFloat(loader_comp_style.width);
    log(loader_w);
    loader.style.height = loader_w + 'px';
})();