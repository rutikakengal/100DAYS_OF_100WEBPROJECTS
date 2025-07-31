let body = document.querySelector('body');

let today = document.querySelectorAll('.date');

const img = [
    "url(img-1.jpg)", "url(img-2.jpg)", "url(img-3.jpg)", "url(img-4.jpg)", "url(img-5.jpg)"
]

setInterval(() => {
 let cng = Math.floor(Math.random()*5);
body.style.backgroundImage = img[cng];
},5000);


function updateClock(element) {
  const timeZone = element.id;

  const now = new Date().toLocaleString("en-GB", {
    timeZone,
    hour12: false,
  });

  const [datePart, timePart] = now.split(", ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  element.innerHTML = `<i>${timeZone}</i><br>Date: ${day}/${month}/${year}`;

  const container = element.parentElement; 
  const hourHand = container.querySelector(".hour");
  const minuteHand = container.querySelector(".min");
  const secondHand = container.querySelector(".sec");

  const secDeg = seconds * 6;
  const minDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  hourHand.style.transform = `rotateZ(${hourDeg}deg)`;
  minuteHand.style.transform = `rotateZ(${minDeg}deg)`;
  secondHand.style.transform = `rotateZ(${secDeg}deg)`;
}



today.forEach((element) => {
  updateClock(element); 
  setInterval(() => updateClock(element), 1000); 
});
 



