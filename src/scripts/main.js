document.body.onload = function () {
  var nav = document.getElementById('nav');
  var header = document.getElementById('header');
  var content = document.getElementById('content');

  document.getElementById('hamburger').onclick = function() {
    if(nav.classList.contains('visible')) {
      nav.classList.remove('visible');
    } else
      nav.classList.add('visible');
      content.style.paddingTop = header.offsetHeight + "px";
  }
}

window.onscroll = function () {
  document.getElementById('nav').classList.remove('visible');
}

