$(function() {

  'use strict';

  $('abbr.timeago').timeago();

  // If touchscreen listen for touch, if not listen for click
  var hitEvent = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';

  $('.menu').on(hitEvent, function(event) {
    event.preventDefault();
    $('.nav-link').addClass('nav-show');
  });

  $('.content').on(hitEvent, function() {
    $('.nav-link').removeClass('nav-show');
  });
});
