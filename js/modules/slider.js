import { getZero } from "./timer";

function slider({container, slide, nextArrow, prewArrow, totalCounter, currentCounter, wrapper, field}) {
    // SLIDER
    const nextSlide = document.querySelector(nextArrow),
          prevSlide = document.querySelector(prewArrow),
          slides = document.querySelectorAll(slide),
          slider = document.querySelector(container),
          currentSlideNum = document.getElementById(currentCounter),
          totalSlidesNum = document.getElementById(totalCounter),
          slidesWrapper = document.querySelector(wrapper),
          slidesField = document.querySelector(field),
          width = window.getComputedStyle(slidesWrapper).width;

    let slidenum = 1;
    let offset = 0;

    function selectedDot() {
        dots.forEach(dot => dot.style.opacity = ".5");
        dots[slidenum - 1].style.opacity = 1;
    }

    function removeNumbers(str) {
        return +str.replace(/\D/g, "");
    }

    slidesField.style.width = 100 * slides.length + "%";
    slidesField.style.display = "flex";
    slidesField.style.transition = "0.5s all";

    slidesWrapper.style.overflow = "hidden";

    slides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = "relative";

    const indicators = document.createElement("ol"),
          dots = [];
    indicators.classList.add("carousel-indicators");
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);

    for(let i = 0; i < slides.length; i++) {
        const dot = document.createElement("li");
        dot.setAttribute("data-slide-to", i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        if(i === 0)  {dot.style.opacity = 1;}
        indicators.append(dot);
        dots.push(dot);
    }

    nextSlide.addEventListener("click", () => {
        offset == removeNumbers(width) * (slides.length - 1) ? offset = 0 : offset += removeNumbers(width);
        slidesField.style.transform = `translateX(-${offset}px)`;

        slidenum == slides.length ? slidenum = 1 : slidenum++;
        updateSLideNum(slidenum);

        selectedDot();
    });

    prevSlide.addEventListener("click", () => {
        offset == 0 ? offset = removeNumbers(width) * (slides.length - 1) : offset -= removeNumbers(width);
        slidesField.style.transform = `translateX(-${offset}px)`;

        slidenum === 1 ? slidenum = slides.length : slidenum--;
        updateSLideNum(slidenum);

        selectedDot();
    });

    function updateSLideNum(i) {
        currentSlideNum.textContent = getZero(i);
    }

    totalSlidesNum.textContent = getZero(slides.length);
    updateSLideNum(slidenum);

    dots.forEach(dot => {
        dot.addEventListener("click", (event) => {
            const slideTo = event.target.getAttribute("data-slide-to");

            slidenum = slideTo;
            offset = removeNumbers(width) * (slideTo - 1);
            slidesField.style.transform = `translateX(-${offset}px)`;

            selectedDot();

            updateSLideNum(slidenum);
        });
    });
}

export default slider;