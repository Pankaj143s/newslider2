// DOM Elements
const sliderSection = document.getElementById('sliderSection');
const slide1 = document.getElementById('slide1');
const slide1Text = slide1.querySelector('.slide-text');
const slide2 = document.getElementById('slide2');
const typingHeading = document.getElementById('typingHeading');
const typingFooter = document.getElementById('typingFooter');
const videoElement = document.getElementById('videoElement');
const customPlayButton = document.getElementById('customPlayButton');

// Global state flags
let currentIndex = 0;
let firstPlayback = true;   // Typewriter effects run only once
let slide1Animated = false; // Ensure slide1 text animates only once
let allowTransition = false; // Extra delay before allowing transition to slide2

/**
 * TYPEWRITER EFFECT:
 * Types text into the given element at 'speed' ms per character.
 * For the heading, once ~85% is typed, reveal the play button.
 */
function typeWriter(element, text, speed = 80, callback) {
    element.textContent = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            // For heading, reveal play button at ~85% progress.
            if (element === typingHeading && i === Math.floor(text.length * 0.85)) {
                customPlayButton.style.display = "flex";
            }
            setTimeout(type, speed);
        } else if (typeof callback === "function") {
            callback();
        }
    }
    type();
}

/**
 * INTERSECTION OBSERVER for Slide 1 Text Animation:
 * When slide1 is at least 10% visible (with a threshold of 0.5 for safety),
 * wait 1500ms then animate the text in (by adding the 'animate' class).
 * After that, wait an additional 3000ms before allowing transition.
 */
const slide1Observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.target.id === "slide1" &&
            entry.intersectionRatio >= 0.1 &&
            !slide1Animated) {
            // Delay before animating the text
            setTimeout(() => {
                slide1Text.classList.add('animate');
                slide1Animated = true;
                // After text animation, wait 3000ms before allowing transition.
                setTimeout(() => {
                    allowTransition = true;
                }, 500);
            }, 1000);
        }
    });
}, { threshold: 0.5 });
slide1Observer.observe(slide1);

/**
 * INTERSECTION OBSERVER for Slider:
 * Attach the wheel event when the slider viewport is in view.
 */
const sliderObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            window.addEventListener('wheel', onWheelEvent, { passive: false });
        } else {
            window.removeEventListener('wheel', onWheelEvent, { passive: false });
        }
    });
}, { threshold: 0.6 });
sliderObserver.observe(sliderSection);

/**
 * ON WHEEL EVENT:
 * If we're on slide1, scrolling down (deltaY > 0), and allowed to transition,
 * trigger the transition to slide2.
 */
function onWheelEvent(e) {
    if (currentIndex === 0 && e.deltaY > 0 && allowTransition) {
        e.preventDefault();
        transitionToSlide2();
    }
}

/**
 * TRANSITION TO SLIDE 2:
 * Add the 'transitioned' class to slide1 and slide2 so that:
 * - Slide1 moves to the right (translateX(100%))
 * - Slide2 slides in from the left (from translateX(-100%) to translateX(0))
 * Then, if first playback, run the typewriter for the heading and auto-play video.
 */
function transitionToSlide2() {
    currentIndex = 1;
    slide1.classList.add('transitioned'); // Slide1 moves right
    slide2.classList.add('transitioned'); // Slide2 moves in from left

    if (firstPlayback) {
        typeWriter(typingHeading, "How do you test a tick repellent?", 80, () => {
            videoElement.muted = true; // Ensure auto-play compliance
            videoElement.play();
            customPlayButton.style.display = "none";
        });
    }
}

/**
 * PLAY BUTTON EVENT:
 * When the custom play button is clicked, replay the video and hide the button.
 */
customPlayButton.addEventListener('click', () => {
    videoElement.play();
    customPlayButton.style.display = "none";
});

/**
 * VIDEO ENDED EVENT:
 * On first playback, run typewriter on the footer text and then show the play button;
 * On subsequent plays, simply show the play button.
 */
videoElement.addEventListener('ended', () => {
    if (firstPlayback) {
        typeWriter(typingFooter, "95% of the tick repellents we tested do not pass this test.", 80, () => {
            customPlayButton.style.display = "flex";
            firstPlayback = false;
        });
    } else {
        customPlayButton.style.display = "flex";
    }
});