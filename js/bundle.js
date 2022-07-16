/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calculator.js":
/*!**********************************!*\
  !*** ./js/modules/calculator.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function calculator() {
    // calculator
    const result = document.querySelector('.calculating__result span');
    
    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
    
                e.target.classList.add(activeClass);
    
                calcTotal();
            });
        });
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) {
                input.style.border = "1px solid red";
            } else {
                input.style.border = 'none';
            }
            switch(input.getAttribute('id')) {
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

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (calculator);

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/services */ "./js/services/services.js");


function cards() {
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

    (0,_services_services__WEBPACK_IMPORTED_MODULE_0__.getResources)("http://localhost:3000/menu")
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new menuCard(img, altimg, title, descr, price, ".menu .container").render();
            });
        });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cards);

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal */ "./js/modules/modal.js");
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/services */ "./js/services/services.js");



function forms(formSelector, modalTimer) {
    // SEND DATA TO SERVER (forms)
    const forms = document.querySelectorAll(formSelector);

    const message = {
        loading: "img/form/spinner.svg",
        success: "Спасибо! Скоро мы с вами свяжемся",
        failure: "Что то пошло не так..."
    };

    forms.forEach(item => {
        bindPostData(item);
    });

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

            (0,_services_services__WEBPACK_IMPORTED_MODULE_1__.postData)("http://localhost:3000/requests", json)
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
        (0,_modal__WEBPACK_IMPORTED_MODULE_0__.openModal)(".modal", modalTimer);

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
            (0,_modal__WEBPACK_IMPORTED_MODULE_0__.closeModal)(".modal");
        }, 4000);
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (forms);

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "closeModal": () => (/* binding */ closeModal),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "openModal": () => (/* binding */ openModal)
/* harmony export */ });
function openModal(modalSelector, modalTimer) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add("fadepoup");
    //modal.style.display = "block"; anothe rway
    modal.classList.add("show");
    modal.classList.remove("hide");
    document.body.style.overflow = "hidden";

    console.log(modalTimer);
    if(modalTimer) {
    clearInterval(modalTimer);
    }
}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    //modal.style.display = "none"; another way
    document.body.style.overflow = "";
    modal.classList.add("hide");
    modal.classList.remove("show");
}

function modal(triggerSelector, modalSelector, modalTimer) {
    // MODAL
    const modalShow = document.querySelectorAll(triggerSelector),
          modal = document.querySelector(modalSelector);

    modalShow.forEach(btn => {
        btn.addEventListener("click", () => openModal(modalSelector, modalTimer)); // arrow function used to prevent function from calling itself
    });

    modal.addEventListener("click", (event) => {
        if(event.target === modal || event.target.getAttribute("data-close") == "")  {
           closeModal(modalSelector);
        }
    });

    document.addEventListener("keydown", (event) => {
        if(event.code === "Escape" && modal.style.display === "block") {
            closeModal(modalSelector);
        }
    });

    function showModalByScroll() {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight/* can add -1 if not working */) {
            openModal(modalSelector, modalTimer);
            window.removeEventListener("scroll", showModalByScroll);
        }
    }

    window.addEventListener("scroll", showModalByScroll);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (modal);



/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _timer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./timer */ "./js/modules/timer.js");


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
        currentSlideNum.textContent = (0,_timer__WEBPACK_IMPORTED_MODULE_0__.getZero)(i);
    }

    totalSlidesNum.textContent = (0,_timer__WEBPACK_IMPORTED_MODULE_0__.getZero)(slides.length);
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (slider);

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function tabs(tabsSelector, tabsContentSelector, tabsParenSelector, activeClass) {
    // TABS
    const tabs = document.querySelectorAll(tabsSelector),
          tabsContent = document.querySelectorAll(tabsContentSelector),
          tabsParent = document.querySelector(tabsParenSelector);

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add("hide");
            item.classList.remove("show", "fade");
        });

        tabs.forEach(item => {
            item.classList.remove(activeClass);
        });
    }

    function showTabContent(i = 0) { // assighn default value to argument in function
        tabsContent[i].classList.add("show", "fade");
        tabsContent[i].classList.remove("hide");
        tabs[i].classList.add(activeClass);
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener("click", (event) => {
        const target = event.target;

        if(target && target.classList.contains(tabsSelector.slice(1))) { // make sure that only sons are clickable and not parent
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tabs);

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "getZero": () => (/* binding */ getZero)
/* harmony export */ });
function getZero(num) {
    if (num >= 0 && num < 10) {
        return `0${num}`;
    } else if (num < 0) {
        return "00";
    } else {
        return num;
    }
}

function timer(id, deadLine) {
    // TIMER

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

    setClock(id, deadLine);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (timer);


/***/ }),

/***/ "./js/services/services.js":
/*!*********************************!*\
  !*** ./js/services/services.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getResources": () => (/* binding */ getResources),
/* harmony export */   "postData": () => (/* binding */ postData)
/* harmony export */ });
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

const getResources = async (url) => {
    const res = await fetch(url);
    if(!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`); //trow error if request is mot ok (because fetch only vount error if no connection)
    }
    return await res.json();
};




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_tabs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js");
/* harmony import */ var _modules_modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js");
/* harmony import */ var _modules_timer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js");
/* harmony import */ var _modules_cards__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js");
/* harmony import */ var _modules_calculator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/calculator */ "./js/modules/calculator.js");
/* harmony import */ var _modules_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js");
/* harmony import */ var _modules_slider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js");









window.addEventListener("DOMContentLoaded", () => {

    const modalTimer = setTimeout(() => (0,_modules_modal__WEBPACK_IMPORTED_MODULE_1__.openModal)(".modal", modalTimer), 50000);

    (0,_modules_tabs__WEBPACK_IMPORTED_MODULE_0__["default"])(".tabheader__item", ".tabcontent", ".tabheader__items", "tabheader__item_active");
    (0,_modules_modal__WEBPACK_IMPORTED_MODULE_1__["default"])("[data-modal]", ".modal", modalTimer);
    (0,_modules_timer__WEBPACK_IMPORTED_MODULE_2__["default"])(".timer", "2022-09-22 00:00");
    (0,_modules_cards__WEBPACK_IMPORTED_MODULE_3__["default"])();
    (0,_modules_calculator__WEBPACK_IMPORTED_MODULE_4__["default"])();
    (0,_modules_forms__WEBPACK_IMPORTED_MODULE_5__["default"])("form", modalTimer);
    (0,_modules_slider__WEBPACK_IMPORTED_MODULE_6__["default"])({
        container: ".offer__slider",
        nextArrow: ".offer__slider-next",
        slide: ".offer__slide",
        prewArrow: ".offer__slider-prev",
        totalCounter: "total",
        currentCounter: "current",
        wrapper: ".offer__slider-wrapper",
        field: ".offer__slider-inner"
    });
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map