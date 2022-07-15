function modal() {
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
}

module.exports = modal;