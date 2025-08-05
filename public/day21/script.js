let tog = 1;
let rollingSound = new Audio('dice-rolling.mp3');
let winSound = new Audio('win-sound.mp3');
let p1sum = 0;
let p2sum = 0;

function play(player, psum, correction, num) {
    let sum;
    if (psum == 'p1sum') {
        p1sum = p1sum + num;

        if (p1sum > 100) {
            p1sum = p1sum - num;
        }

        // Ladders for Player 1
        if (p1sum == 1) { p1sum = 38; }
        if (p1sum == 4) { p1sum = 14; }
        if (p1sum == 8) { p1sum = 30; }
        if (p1sum == 21) { p1sum = 42; }
        if (p1sum == 28) { p1sum = 76; }
        if (p1sum == 50) { p1sum = 67; }
        if (p1sum == 71) { p1sum = 92; }
        if (p1sum == 80) { p1sum = 99; }
        
        // Snakes for Player 1
        if (p1sum == 32) { p1sum = 10; }
        if (p1sum == 36) { p1sum = 6; }
        if (p1sum == 48) { p1sum = 26; }
        if (p1sum == 62) { p1sum = 18; }
        if (p1sum == 88) { p1sum = 24; }
        if (p1sum == 95) { p1sum = 56; }
        if (p1sum == 97) { p1sum = 78; }

        sum = p1sum;
    }

    if (psum == 'p2sum') {
        p2sum = p2sum + num;

        if (p2sum > 100) {
            p2sum = p2sum - num;
        }
        
        // Ladders for Player 2
        if (p2sum == 1) { p2sum = 38; }
        if (p2sum == 4) { p2sum = 14; }
        if (p2sum == 8) { p2sum = 30; }
        if (p2sum == 21) { p2sum = 42; }
        if (p2sum == 28) { p2sum = 76; }
        if (p2sum == 50) { p2sum = 67; }
        if (p2sum == 71) { p2sum = 92; }
        if (p2sum == 80) { p2sum = 99; }

        // Snakes for Player 2
        if (p2sum == 32) { p2sum = 10; }
        if (p2sum == 36) { p2sum = 6; }
        if (p2sum == 48) { p2sum = 26; }
        if (p2sum == 62) { p2sum = 18; }
        if (p2sum == 88) { p2sum = 24; }
        if (p2sum == 95) { p2sum = 56; }
        if (p2sum == 97) { p2sum = 78; }
        sum = p2sum;
    }
    document.getElementById(`${player}`).style.transition = `linear all .5s`;

    if (sum < 10) {
        document.getElementById(`${player}`).style.left = `${(sum - 1) * 62}px`;
        document.getElementById(`${player}`).style.top = `${-0 * 62 - correction}px`;
    } else if (sum == 100) {
        winSound.play();
        if (player == 'p1') {
            alert("Red Won !!");
        } else if (player == 'p2') {
            alert("Yellow Won !!");
        }
        location.reload();
    } else {
        // This logic handles movement on the board based on the sum
        let numarr = Array.from(String(sum));
        let n1 = eval(numarr.shift()); // First digit (tens place, e.g., for 23, n1 is 2)
        let n2 = eval(numarr.pop()); // Second digit (ones place, e.g., for 23, n2 is 3)

        if (n1 % 2 != 0) { // If tens digit is odd (e.g., 10-19, 30-39, etc. - moving left to right)
            if (n2 == 0) { // If it's a multiple of 10 (e.g., 20, 40, 60)
                document.getElementById(`${player}`).style.left = `${(9) * 62}px`; // Move to the rightmost column
                document.getElementById(`${player}`).style.top = `${(-n1 + 1) * 62 - correction}px`; // Move up one row
            } else {
                document.getElementById(`${player}`).style.left = `${(9 - (n2 - 1)) * 62}px`; // Move from right to left
                document.getElementById(`${player}`).style.top = `${-n1 * 62 - correction}px`; // Stay on current row (tens digit)
            }
        } else if (n1 % 2 == 0) { // If tens digit is even (e.g., 20-29, 40-49, etc. - moving right to left)
            if (n2 == 0) { // If it's a multiple of 10 (e.g., 10, 30, 50)
                document.getElementById(`${player}`).style.left = `${(0) * 62}px`; // Move to the leftmost column
                document.getElementById(`${player}`).style.top = `${(-n1 + 1) * 62 - correction}px`; // Move up one row
            } else {
                document.getElementById(`${player}`).style.left = `${(n2 - 1) * 62}px`; // Move from left to right
                document.getElementById(`${player}`).style.top = `${-n1 * 62 - correction}px`; // Stay on current row (tens digit)
            }
        }
    }
}

document.getElementById("diceBtn").addEventListener("click", function () {
    rollingSound.play();
    let num = Math.floor(Math.random() * (6 - 1 + 1) + 1); // Generate random number from 1 to 6
    document.getElementById("dice").innerText = num;

    if (tog % 2 != 0) {
        document.getElementById('tog').innerText = "Yellow's Turn : ";
        play('p1', 'p1sum', 0, num);

    } else if (tog % 2 == 0) {
        document.getElementById('tog').innerText = "Red's Turn : ";
        play('p2', 'p2sum', 55, num);
    }

    tog = tog + 1;
});