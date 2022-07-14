"use strict";

window.addEventListener("DOMContentLoaded", () => {

    // TABS
    const tabs = document.querySelectorAll(".tabheader__item"),
          tabsContent = document.querySelectorAll(".tabcontent"),
          tabsParent = document.querySelector(".tabheader__items");

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add("hide");
            item.classList.remove("show", "fade");
        });

        tabs.forEach(item => {
            item.classList.remove("tabheader__item_active");
        });
    }

    function showTabContent(i = 0) { // assighn default value to argument in function
        tabsContent[i].classList.add("show", "fade");
        tabsContent[i].classList.remove("hide");
        tabs[i].classList.add("tabheader__item_active");
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener("click", (event) => {
        const target = event.target;

        if(target && target.classList.contains("tabheader__item")) { // make sure that only sons are clickable and not parent
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });


    // TIMER
    const deadLine = "2022-09-22 00:00";

    function getTimeRemainig(endtime) {
        const remainTime = Date.parse(endtime) - Date.parse(new Date()),
              remainDays = Math.floor(remainTime / (1000 * 60 * 60 * 24)),
              remainHours = Math.floor((remainTime / (1000 * 60 * 60) % 24)),
              remainMinutes = Math.floor((remainTime / (1000 * 60) % 60)),
              remainSec = Math.floor((remainTime / 1000) % 60);

        return {
            "total": remainTime,
            "days": remainDays,
            "hours": remainHours,
            "minutes": remainMinutes,
            "seconds": remainSec
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else if (num < 0) {
            return "00";
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector("#days"),
              hours = timer.querySelector("#hours"),
              minutes = timer.querySelector("#minutes"),
              seconds = timer.querySelector("#seconds"),
              timeIntervel = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const remainTime = getTimeRemainig(endtime);

            days.innerHTML = getZero(remainTime.days);
            hours.innerHTML = getZero(remainTime.hours);
            minutes.innerHTML = getZero(remainTime.minutes);
            seconds.innerHTML = getZero(remainTime.seconds);

            if(remainTime.total <= 0) {
                clearInterval(timeIntervel);
            }
        }
    }

    setClock(".timer", deadLine);


    // MODAL
    const modalShow = document.querySelectorAll("[data-modal]"),
          modal = document.querySelector(".modal");

    modalShow.forEach(btn => {
        btn.addEventListener("click", openModal);
    });

    function openModal() {
        modal.classList.add("fadepoup");
        //modal.style.display = "block"; anothe rway
        modal.classList.add("show");
        modal.classList.remove("hide");
        document.body.style.overflow = "hidden";
        clearInterval(modalTimer);
    }

    function closeModal() {
        //modal.style.display = "none"; another way
        document.body.style.overflow = "";
        modal.classList.add("hide");
        modal.classList.remove("show");
    }

    modal.addEventListener("click", (event) => {
        if(event.target === modal || event.target.getAttribute("data-close") == "")  {
           closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if(event.code === "Escape" && modal.style.display === "block") {
            closeModal();
        }
    });

    const modalTimer = setTimeout(openModal, 50000);

    function showModalByScroll() {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight/* can add -1 if not working */) {
            openModal();
            window.removeEventListener("scroll", showModalByScroll);
        }
    }

    window.addEventListener("scroll", showModalByScroll);


    // CREATE CLASSES FOR CARDS
    class menuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 4;
            this.changeToILS();
        }

        changeToILS() {
            this.price *= this.transfer;
        }

        render() {
            const element = document.createElement("div");
            if(this.classes.length === 0) {
                this.element = "menu__item";
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> нис/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    const getResources = async (url) => {
        const res = await fetch(url);
        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`); //trow error if request is mot ok (because fetch only vount error if no connection)
        }
        return await res.json();
    };

    /* getResources("http://localhost:3000/menu")
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new menuCard(img, altimg, title, descr, price, ".menu .container").render();
            });
        }); */

       axios.get("http://localhost:3000/menu")
            .then(data => {
                data.data.forEach(({img, altimg, title, descr, price}) => {
                    new menuCard(img, altimg, title, descr, price, ".menu .container").render();
                });
            });


    // SEND DATA TO SERVER (forms)
    const forms = document.querySelectorAll("form");

    const message = {
        loading: "img/form/spinner.svg",
        success: "Спасибо! Скоро мы с вами свяжемся",
        failure: "Что то пошло не так..."
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const statusMessage = document.createElement("img");
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement("afterend", statusMessage);
            
            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData("http://localhost:3000/requests", json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                form.reset();
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();               
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector(".modal__dialog");
        
        prevModalDialog.classList.add("hide");
        openModal();

        const thanksModal = document.createElement("div");
        thanksModal.classList.add("modal__dialog");
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${message}</div>
        </div>
        `;

        document.querySelector(".modal").append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add("show");
            prevModalDialog.classList.remove("hide");
            closeModal();
        }, 4000);
    }


    // SLIDER
    const nextSlide = document.querySelector(".offer__slider-next"),
          prevSlide = document.querySelector(".offer__slider-prev"),
          slides = document.querySelectorAll(".offer__slide"),
          slider = document.querySelector(".offer__slider"),
          currentSlideNum = document.getElementById("current"),
          totalSlidesNum = document.getElementById("total"),
          slidesWrapper = document.querySelector(".offer__slider-wrapper"),
          slidesField = document.querySelector(".offer__slider-inner"),
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


    // CALcULATOR
    const result = document.querySelector(".calculating__result span");
    let sex = "female",
        height, weight, age, 
        ratio = 1.375;

    function calcTotal() {
        if(!sex || !height || !weight || !age || !ratio) {
            result.textContent = "____";
            return;
        }
        
        sex === "female" ?
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio) :
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
    }

    calcTotal();

    function getStaticInforametion(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(elem => {
            elem.addEventListener("click", (event) => {
                if(event.target.getAttribute("data-ratio")) {
                    ratio = +event.target.getAttribute("data-ratio");
                } else {
                    sex = event.target.getAttribute("id");
                }
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
    
                event.target.classList.add(activeClass);
    
                calcTotal();
            });
        });
    }

    getStaticInforametion("#gender", "calculating__choose-item_active");
    getStaticInforametion(".calculating__choose_big", "calculating__choose-item_active");

    function getDynamicInforametion(selector) {
        const input = document.querySelector(selector);

        input.addEventListener("input", () => {
            switch(input.getAttribute("id")) {
                case "height":
                    height = +input.value;
                    break;
                case "weight":
                    weight = +input.value;
                    break;
                case "age":
                    age = +input.value;
                    break;
            }
            calcTotal();
        });
    }

    getDynamicInforametion("#height");
    getDynamicInforametion("#weight");
    getDynamicInforametion("#age");

});