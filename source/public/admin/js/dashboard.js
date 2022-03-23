/* globals Chart:false, feather:false */

(function () {
  "use strict";

  feather.replace();
})();


$(".nav-link").on('click', (ev) => {
  ev.preventDefault();
  $(".panels").hide();
  $(".nav-link").removeClass("active");
  ev.currentTarget.classList.add("active")
  $(ev.currentTarget.hash).show();
})