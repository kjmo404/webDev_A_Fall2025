const glitch = [
    { transform: "skewX(24deg)" }, 
    { transform: "skewX(-8deg)" },
    { transform: "skewX(55deg)" },
    { transform: "skewX(-90deg)" },
    { transform: "skewX(29deg)" },
    { transform: "skewX(-90deg)" },
    { transform: "skewX(3deg)" },
    { transform: "skewX(-2deg)" },
    { transform: "skewX(1deg)" },
    { transform: "skewX(10deg)" },
    { transform: "skewX(0deg)" }
];

const glitchAnim = document.querySelector(".target").animate(glitch, {
    duration: 800,
    iterations: Infinity
});

const glitchBlock = document.querySelector('main');

glitchBlock.addEventListener("mouseenter", theyHovered);
glitchBlock.addEventListener("mouseleave", theyUnhovered);

function theyHovered() {
    glitchAnim.pause();
}

function theyUnhovered() {
    glitchAnim.play();
}