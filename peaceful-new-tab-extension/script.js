// Get the h1 element where we will show the greeting
const greetingElement = document.getElementById('greeting');

// Get the current hour of the day (from 0 to 23)
const currentHour = new Date().getHours();

let greeting;

// Determine the greeting based on the current hour
if (currentHour < 12) {
    greeting = 'Good morning!';
} else if (currentHour < 18) {
    greeting = 'Good afternoon!';
} else {
    greeting = 'Good evening!';
}

// Set the text of the h1 element to the new greeting
greetingElement.textContent = greeting;
greetingElement.style.color='red'

// setting the new image in the background every time we open the tab
const body=document.querySelector('body')
body.style.backgroundImage='url("https://picsum.photos/1920/1080")'
