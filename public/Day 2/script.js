const hour = document.querySelector('#hour')
const min = document.querySelector('#min')
const sec = document.querySelector('#sec')
const am_pm = document.querySelector('#ampm')
const other_ampm = document.querySelector('#other-ampm')
const stopwatchHour = document.querySelector('#stopwatch-hour')
const stopwatchMinute = document.querySelector('#stopwatch-min')
const stopwatchSecond = document.querySelector('#stopwatch-sec')
const stopwatchMilliSecond = document.querySelector('#stopwatch-ms')
const start_stopwatch = document.querySelector('.start-stopwatch')
const lapStopwatch = document.querySelector('.lap-stopwatch')
const reset_stopwatch = document.querySelector('.reset-stopwatch')
const lapsBlock = document.querySelector('.laps')

$('.stopwatch-btn').click(function() {
    $(".outer-wrapper > div").slideUp()
    $(".stopwatch").slideDown()
    $(".type").html("Stopwatch")
})

$('.back-btn').click(function() {
    $(".outer-wrapper > div").slideUp()
    $(".clock").slideDown()
    $(".type").html("Clock")
})

$('.timer-btn').click(function() {
    $(".outer-wrapper > div").slideUp()
    $(".timer").slideDown()
    $(".type").html("Timer")
})

const addTrailingZeroes = (num) => {
    return num < 10 ? "0" + num : num
}

const updateTime = () => {
    const time = new Date()
    let hours = time.getHours()
    let minutes = time.getMinutes()
    let seconds = time.getSeconds()
    let ampm = hours >= 12 ? "PM" : "AM"
    let otherampm = hours >= 12 ? "AM" : "PM"

    hours = hours % 12 || 12

    hours = addTrailingZeroes(hours)
    minutes = addTrailingZeroes(minutes)
    seconds = addTrailingZeroes(seconds)

    hour.textContent = hours
    min.textContent = minutes
    sec.textContent = seconds
    am_pm.textContent = ampm
    other_ampm.textContent = otherampm
}

setInterval(() => {
    updateTime()
}, 1000)

//Stopwatch

let stopwatchHours = 0, stopwatchMinutes = 0, stopwatchSeconds = 0, stopwatchMilliSeconds = 0, stopwatchRunning = false, laps = 0, stopwatchInterval

const stopwatch = () => {
    stopwatchMilliSeconds++

    if(stopwatchMilliSeconds === 100){
        stopwatchSeconds++
        stopwatchMilliSeconds = 0
    }

    if(stopwatchSeconds === 60){
        stopwatchMinutes++
        stopwatchSeconds = 0
    }

    if(stopwatchMinutes === 60){
        stopwatchHours++
        stopwatchMinutes = 0
    }

    stopwatchHour.textContent = addTrailingZeroes(stopwatchHours)
    stopwatchMinute.textContent = addTrailingZeroes(stopwatchMinutes)
    stopwatchSecond.textContent = addTrailingZeroes(stopwatchSeconds)
    stopwatchMilliSecond.textContent = addTrailingZeroes(stopwatchMilliSeconds)
}

const startStopwatch = () => {
    if(!stopwatchRunning){
        stopwatchInterval = setInterval(stopwatch, 10)
        stopwatchRunning = true
    }
}

const stopStopwatch = () => {
    clearInterval(stopwatchInterval)
    stopwatchRunning = false
}

const resetStopwatch = () => {
    clearInterval(stopwatchInterval)
    stopwatchHours = 0
    stopwatchMinutes = 0 
    stopwatchSeconds = 0
    stopwatchMilliSeconds = 0
    stopwatchRunning = false
    laps = 0

    stopwatchHour.textContent = "00"
    stopwatchMinute.textContent = "00"
    stopwatchSecond.textContent = "00"
    stopwatchMilliSecond.textContent = "00"
    lapsBlock.textContent = ""
}

start_stopwatch.addEventListener('click', function() {
    startStopwatch()
    start_stopwatch.style.display = 'none'
    lapStopwatch.style.display = 'block'
})

reset_stopwatch.addEventListener('click', function(){
    resetStopwatch()
    start_stopwatch.style.display = 'block'
    lapStopwatch.style.display = 'none'
})

lapStopwatch.addEventListener('click', function(){
    laps++
    const prevActiveLap = document.querySelector('.lap.active')
    if(prevActiveLap){
        prevActiveLap.classList.remove('active')
    } 
    lapsBlock.insertAdjacentHTML(
        'afterbegin',
        `
        <div class="lap active">
            <p>lap ${laps}</p>
            <p>
                ${addTrailingZeroes(stopwatchHours)} : ${addTrailingZeroes(stopwatchMinutes)} : ${addTrailingZeroes(stopwatchSeconds)} : ${addTrailingZeroes(stopwatchMilliSeconds)}
            </p>
        </div>
        `
    )
})

let time = 0, timerHours = 0, timerMinutes = 0, timerSeconds = 0, timerMilliseconds = 0, timerInterval

const getTime = () => {
    time = prompt("Enter time in minutes")
    time = time * 60
    setTime()
}

const setTime = () => {
    timerHours = Math.floor(time / 3600)
    timerMinutes = Math.floor((time % 3600) / 60)
    timerSeconds = Math.floor(time % 60)

    $('#timer-hour').html(addTrailingZeroes(timerHours))
    $('#timer-min').html(addTrailingZeroes(timerMinutes))
    $('#timer-sec').html(addTrailingZeroes(timerSeconds))
    $('#timer-ms').html(addTrailingZeroes(timerMilliseconds))
}

const timer = () => {
    timerMilliseconds--;
    if(timerMilliseconds === -1){
        timerMilliseconds = 99
        timerSeconds--
    }
    if(timerSeconds === -1){
        timerSeconds = 59
        timerMinutes--
    }
    if(timerMinutes === -1){
        timerMinutes = 59
        timerHours--
    }

    $('#timer-hour').html(addTrailingZeroes(timerHours))
    $('#timer-min').html(addTrailingZeroes(timerMinutes))
    $('#timer-sec').html(addTrailingZeroes(timerSeconds))
    $('#timer-ms').html(addTrailingZeroes(timerMilliseconds))

    timeUp()
}

const startTimer = () => {
    if(timerHours === 0 && timerMinutes === 0 && timerSeconds === 0 && timerMilliseconds === 0){
        getTime()
    } else {
        timerInterval = setInterval(timer, 10)
        $('.start-timer').hide()
        $('.stop-timer').show()
    }
}

const stopTimer = () => {
    clearInterval(timerInterval)
    $('.start-timer').show()
    $('.stop-timer').hide()
}

const resetTimer = () => {
    stopTimer()
    time = 0
    setTime()
}

const timeUp = () => {
    if(timerHours === 0 && timerMinutes === 0 && timerSeconds === 0 && timerMilliseconds === 0){
        resetTimer()
        alert("Time's Up")
    }
}

$(".start-timer").click(function(){
    startTimer()
})

$('.stop-timer').click(function() {
    stopTimer()
})

$('.reset-timer').click(function() {
    resetTimer()
})