// 1. Create a new div element in memory
const bottomBar = document.createElement('div');

// 2. Add some simple text to it so we can see it
bottomBar.textContent = 'Hello, this is our new extension bar!';

// 3. Add our new bar to the very end of the page's body
document.body.appendChild(bottomBar);