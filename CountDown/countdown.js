function showTimer(total_time) {
    let remaining_time = document.querySelector('#timer');
    let hour = document.querySelector('#hour').value * 60 * 60;
    let minute = document.querySelector('#minute').value * 60;
    remaining_time.status = "original";

    let total = total_time;
    if (total == null) {
        total = hour + minute;
    }

    function countdown() {
        if (remaining_time.status == "original") {
            total -= 1;
            remaining_time.textContent = total;
            console.log(remaining_time.status);
        }
        else if (remaining_time.status == "resume") {
            startCountdown();
        }
        else {
            clearInterval(interval);
        }
    }
    const startCountdown = () => {
        interval = setInterval(countdown, 1000);
    };
    startCountdown();

}

function pause() {
    let remaining_time = document.querySelector('#timer');
    remaining_time.status = "pause";
}

function resume() {
    let remaining_time = document.querySelector('#timer');
    const new_total = remaining_time.textContent;
    console.log(new_total);
    remaining_time.status = "resume";
    showTimer(new_total);
}