const endDate = "23 June 2025 23:34";

document.querySelector(".eventDate h2").innerHTML = endDate;

const inputs = document.querySelectorAll("input");

function clock() {
    const end = new Date(endDate);
    const now = new Date();
    const diff = (end - now) / 1000;

    if (diff < 0){
        return;
    }
         

    inputs[0].value = Math.floor(diff / 24 / 60 / 60);
    inputs[1].value = Math.floor(diff / 60 / 60) % 24;
    inputs[2].value = Math.floor(diff / 60) % 60;
    inputs[3].value = Math.floor(diff) % 60;

}

clock();

setInterval(clock,1000)

