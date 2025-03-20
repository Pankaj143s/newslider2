// SLIDES
const slide1 = document.getElementById("slide1");
const slide2 = document.getElementById("slide2");
const slide3 = document.getElementById("slide3");
const slides = [slide1, slide2, slide3];
let currentSlide = null; // will be set when Slide1 is revealed
let hasSlide3Animated = false;

// ARROWS
const arrowLeft = document.getElementById("arrowLeft");
const arrowRight = document.getElementById("arrowRight");

// Slide 3 elements (text + video)
const repellentAll = document.getElementById("repellentAll");
const repellentText1 = document.getElementById("repellentText1");
const repellentText2 = document.getElementById("repellentText2");
const repellentCount = document.getElementById("repellentCount");
const repellentText3 = document.getElementById("repellentText3");
const tickVideo = document.getElementById("tickVideo");
const videoPlayBtn = document.getElementById("videoPlayBtn");

// INITIAL positions
slide1.style.transform = "translateX(-100%)";
slide1.style.opacity = "0";
slide2.style.transform = "translateX(-100%)";
slide2.style.opacity = "0";
slide3.style.transform = "scale(0.7)";
slide3.style.opacity = "0";

/* Use Intersection Observer to reveal Slide1 when slider is in view */
const sliderViewport = document.getElementById("sliderViewport");
let hasShownSlide1 = false;
const observerOptions = { root: null, threshold: 0.3 };
const observer = new IntersectionObserver((entries) => {
  const [entry] = entries;
  if (entry.isIntersecting && !hasShownSlide1) {
    showSlide1();
    currentSlide = 0;
    hasShownSlide1 = true;
  }
}, observerOptions);
observer.observe(sliderViewport);

function showSlide1() {
  slide1.style.transform = "translateX(0)";
  slide1.style.opacity = "1";
  slide1.classList.add("active");
}

/* ARROW Navigation */
arrowRight.addEventListener("click", () => {
  if (currentSlide === null) return;
  if (currentSlide < 2) nextSlide();
});
arrowLeft.addEventListener("click", () => {
  if (currentSlide === null) return;
  if (currentSlide > 0) prevSlide();
});

/* SCROLL Navigation with threshold */
let isScrolling = false;
const scrollThreshold = 110; // Only trigger if deltaY exceeds 50
window.addEventListener("wheel", (e) => {
  if (isScrolling || currentSlide === null) return;
  if (Math.abs(e.deltaY) < scrollThreshold) return; // ignore minor scrolls
  isScrolling = true;
  if (e.deltaY > 0) {
    if (currentSlide < 2) nextSlide();
  } else {
    if (currentSlide > 0) prevSlide();
  }
  setTimeout(() => { isScrolling = false; }, 800);
});

/* FORWARD Transition */
function nextSlide() {
  if (currentSlide === 0) {
    slide1ToSlide2();
    currentSlide = 1;
  } else if (currentSlide === 1) {
    slide2ToSlide3();
    currentSlide = 2;
  }
}

function slide1ToSlide2() {
  slide1.classList.remove("active");
  slide1.style.transform = "translateX(100%)";
  slide1.style.opacity = "0";
  slide2.style.transform = "translateX(0)";
  slide2.style.opacity = "1";
  slide2.classList.add("active");
}

function slide2ToSlide3() {
  slide2.classList.remove("active");
  slide2.style.transform = "scale(1.03)";
  slide2.style.opacity = "0";
  slide3.style.transform = "scale(1)";
  slide3.style.opacity = "1";
  slide3.classList.add("active");
  if (!hasSlide3Animated) {
    startSlide3Sequence();
  } else {
    showSlide3Final();
  }
}

/* BACKWARD Transition */
function prevSlide() {
  if (currentSlide === 1) {
    slide2ToSlide1();
    currentSlide = 0;
  } else if (currentSlide === 2) {
    slide3ToSlide2();
    currentSlide = 1;
  }
}

function slide2ToSlide1() {
  slide2.classList.remove("active");
  slide2.style.transform = "translateX(-100%)";
  slide2.style.opacity = "0";
  slide1.style.transform = "translateX(0)";
  slide1.style.opacity = "1";
  slide1.classList.add("active");
}

function slide3ToSlide2() {
  slide3.classList.remove("active");
  slide3.style.transform = "scale(0.7)";
  slide3.style.opacity = "0";
  slide2.style.transform = "translateX(0)";
  slide2.style.opacity = "1";
  slide2.classList.add("active");
  if (!hasSlide3Animated) {
    resetSlide3Sequence();
  }
}

/* SLIDE 3 TEXT+VIDEO Sequence */
function startSlide3Sequence() {
  tickVideo.pause();
  tickVideo.currentTime = 0;
  repellentAll.classList.remove("expanded");
  repellentAll.style.opacity = "1";
  repellentAll.style.maxHeight = "0px";
  repellentText1.style.opacity = "0";
  repellentText2.style.opacity = "0";
  repellentText3.style.opacity = "0";
  repellentCount.textContent = "0%";
  repellentCount.style.color = "green";
  videoPlayBtn.classList.remove("show");

  // Animate white box to grow for first sentence
  setTimeout(() => {
    repellentAll.style.maxHeight = "100px"; // reveal first sentence
    setTimeout(() => {
      repellentText1.style.opacity = "1";
      // After 2 seconds, play video
      setTimeout(() => {
        tickVideo.play();
      }, 2000);
    }, 500);
  }, 300);

  tickVideo.addEventListener("ended", handleVideoEnded);
}

function handleVideoEnded() {
  repellentAll.style.maxHeight = "300px"; // expand for next lines
  repellentText2.style.opacity = "1";
  setTimeout(() => {
    animateCount();
  }, 1000);
}

function animateCount() {
  repellentCount.style.opacity = "1";
  let current = 0;
  let timer = setInterval(() => {
    current++;
    if (current > 95) {
      clearInterval(timer);
      setTimeout(() => {
        repellentText3.style.opacity = "1";
        videoPlayBtn.classList.add("show");
        repellentCount.style.color = "hsl(0,85%,50%)"; // elegant red shade
        hasSlide3Animated = true;
      }, 800);
      return;
    }
    let ratio = current / 95;
    let hue = 120 - ratio * 120;
    repellentCount.style.color = `hsl(${hue}, 100%, 40%)`;
    repellentCount.textContent = current + "%";
  }, 50);
}

function resetSlide3Sequence() {
  tickVideo.removeEventListener("ended", handleVideoEnded);
  tickVideo.pause();
  tickVideo.currentTime = 0;
  repellentAll.classList.remove("expanded");
  repellentAll.style.maxHeight = "0px";
  repellentText1.style.opacity = "0";
  repellentText2.style.opacity = "0";
  repellentText3.style.opacity = "0";
  repellentCount.textContent = "0%";
  repellentCount.style.color = "green";
  videoPlayBtn.classList.remove("show");
}

function showSlide3Final() {
  tickVideo.removeEventListener("ended", handleVideoEnded);
  tickVideo.pause();
  tickVideo.currentTime = 0;
  repellentAll.classList.add("expanded");
  repellentText1.style.opacity = "1";
  repellentText2.style.opacity = "1";
  repellentText3.style.opacity = "1";
  repellentCount.style.opacity = "1";
  repellentCount.textContent = "95%";
  repellentCount.style.color = "hsl(0,85%,50%)";
  videoPlayBtn.classList.add("show");
}

// "Play Video" button event on overlay
videoPlayBtn.addEventListener("click", () => {
  tickVideo.currentTime = 0;
  tickVideo.play();
});

// Hide play button when video starts playing
tickVideo.addEventListener("play", () => {
  videoPlayBtn.classList.remove("show");
});
