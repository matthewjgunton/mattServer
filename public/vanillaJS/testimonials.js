var slideIndexNew = 1;
let x0 = null;

function moveNew(e) {
  if(x0 || x0 === 0) {
    let dx = unify(e).clientX - x0;
    let s = Math.sign(dx);

    if(s > 0 && slideIndexNew > 1){
      showSlidesNew(--slideIndexNew);
    }
    if(s < 0 && slideIndexNew < 3){
      showSlidesNew(++slideIndexNew);
    }

    x0 = null;
  }
};

function unify(e) { return e.changedTouches ? e.changedTouches[0] : e };
function lock(e) { x0 = unify(e).clientX };

document.getElementById("testimonials").addEventListener('mousedown', lock, false);
document.getElementById("testimonials").addEventListener('touchstart', lock, false);

document.getElementById("testimonials").addEventListener('mouseup', moveNew, false);
document.getElementById("testimonials").addEventListener('touchend', moveNew, false);


showSlidesNew(slideIndexNew);

function plusSlidesNew(n) {
  showSlidesNew(slideIndexNew += n);
}

function currentSlideNew(n) {
  showSlidesNew(slideIndexNew = n);
}

function showSlidesNew(n) {

  var i;
  var slides = document.getElementsByClassName("mySlidesNew");
  var dots = document.getElementsByClassName("dotNew");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndexNew = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndexNew-1].style.display = "block";
  dots[slideIndexNew-1].className += " active";
}

function lookatNew(i){
  currentSlideNew(i);
}
