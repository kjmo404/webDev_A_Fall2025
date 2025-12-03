function shakeLettersByClass(className) {
    const elements = document.querySelectorAll("." + className);

    elements.forEach(el => {
        const text = el.textContent;
        el.innerHTML = ""; 

        [...text].forEach((char, index) => {
            const span = document.createElement("span");
            span.textContent = char;
            span.classList.add("letter");

            span.style.animation =
                (index % 2 === 0) ? "tilt-shaking-left 0.5s infinite"
                                  : "tilt-shaking-right 0.5s infinite";

            el.appendChild(span);
        });
    });
}

shakeLettersByClass("title");

