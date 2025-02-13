class VerySimpleTimer {
    static maxSeconds = 6000;
    constructor() {
        this.count = 0;
        this.minutes = 0;
        this.seconds = 0;

        this.formatMinutes = "00";
        this.formatSeconds = "000";
        this.interval = null;
        this.isRunning = false;
        this.eventList = {};
    }

    _eventFire(eventName, data) {
        if (this.eventList[eventName]) {
            this.eventList[eventName].forEach((fn) => {
                fn(this, data);
            });
        }
    }

    _addPad(number = 0, pad = 2) {
        return number.toString().padStart(pad, "0");
    }

    _calculate() {
        this.minutes = Math.floor(this.count / 600);
        this.seconds = this.count % 600;
        this.formatMinutes = this._addPad(this.minutes, 2);
        this.formatSeconds = this._addPad(this.seconds, 3);
        this._eventFire("tick");
    }

    _tick() {
        this.count -= 1;
        if (this.count <= 0) {
            this.stop();
        }
        this._calculate();
    }

    on(eventName, fn) {
        if (typeof eventName === "string" && typeof fn === "function") {
            if (!this.eventList[eventName]) {
                this.eventList[eventName] = [];
            }
            this.eventList[eventName] = [...this.eventList[eventName], fn];
        }
    }

    start(seconds = 60) {
        seconds = Math.min(seconds, VerySimpleTimer.maxSeconds);
        this.isRunning = true;
        this.count = seconds * 10;
        this.interval = setInterval(() => {
            this._tick();
        }, 100);
        this._eventFire("start");
    }

    stop() {
        clearInterval(this.interval);
        this.isRunning = false;
        this._eventFire("stop");
    }
}

const myTimer = new VerySimpleTimer();

myTimer.start(60);

const initPage = () => {
    const el_timer = document.querySelector(".timer");
    const el_units = el_timer.querySelectorAll("div > span");
    const el_timerTrail = el_timer.querySelector(".timer__trail");

    myTimer.on("start", () => {
        el_timerTrail.classList.add("-on");
    });

    myTimer.on("tick", () => {
        el_units[0].innerText = myTimer.formatMinutes[0];
        el_units[1].innerText = myTimer.formatMinutes[1];
        el_units[2].innerText = myTimer.formatSeconds[0];
        el_units[3].innerText = myTimer.formatSeconds[1];
        el_units[4].innerText = myTimer.formatSeconds[2];
    });

    myTimer.on("stop", () => {
        el_timerTrail.classList.remove("-on");
    });
};

window.addEventListener("DOMContentLoaded", initPage);
