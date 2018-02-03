function log(argument) {
  console.log(argument);
}

(function resize() {
  log(window);
  var w_w = window.innerWidth;
  var w_h = window.innerHeight;
  log(w_w+'x'+w_h);
})()
