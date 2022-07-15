function timer() {
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
}

module.exports = timer;