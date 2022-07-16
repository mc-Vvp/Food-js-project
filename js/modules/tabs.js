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

export default tabs;