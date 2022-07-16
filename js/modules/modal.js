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

export default modal;
export {closeModal};
export {openModal};