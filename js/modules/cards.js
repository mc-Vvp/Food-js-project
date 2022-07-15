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
}

module.exports = cards;