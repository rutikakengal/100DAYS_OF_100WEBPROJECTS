const pomodoro=document.querySelector('.pomodoro');
const shortBreak=document.querySelector('.short-break');
const longBreak=document.querySelector('.long-break');
// const loop=document.querySelector('.loop');
const display=document.getElementById('display-timer');
const start=document.querySelector('.start-btn')
const theme=document.getElementById("change-theme");
const theme_1=document.querySelector(".spirited-away")
const theme_2=document.querySelector(".the-neighbour")
let time
let defaultimer="25:00"
pomodoro.addEventListener("click",()=>{
    clearInterval(x)
    stopb.replaceWith(start)
    restart.remove();

    display.textContent="25:00";
    defaultimer="25:00"
})
shortBreak.addEventListener("click",()=>{
    clearInterval(x)
      stopb.replaceWith(start)
    restart.remove();
    display.textContent="5:00";
    defaultimer="5:00"
})
longBreak.addEventListener("click",()=>{
    clearInterval(x)
      stopb.replaceWith(start)
    restart.remove();
    display.textContent="15:00";
    defaultimer="15:00"
})
// loop.addEventListener("click",()=>{
//     display.textContent="25:00";
//     defaultimer="25:00"
// })
let x;
const restart=document.createElement("button")
const stopb=document.createElement("button");

    let min,sec;

const resume=document.createElement("button");
stopb.id="stop-btn"
restart.id="restart-btn"
stopb.textContent="PAUSE"
restart.textContent="RESTART"
resume.textContent="RESUME"
resume.id="resume-btn"
const display_timer=document.getElementById("action-buttons")
function startTimer(){
    clearInterval(x)
    x=setInterval(()=>{
    time--
    min=Math.floor(time/60);
    sec=time%60
    display.textContent=String(min).padStart(2,"0")+":"+String(sec).padStart(2,"0");
    if(time<=0){
        clearInterval(x);
        display.textContent="00:00"
}},1000);


}
start.addEventListener("click",()=>{
    start.remove();
    display_timer.appendChild(stopb)
   display_timer.appendChild(restart)
    let content=display.textContent.split(":")
    time=parseInt(content[0])*60+parseInt(content[1])
    startTimer();
})
    
restart.addEventListener("click",()=>{
    clearInterval(x)
    display.innerHTML=defaultimer
   let content = defaultimer.split(":");
    time = parseInt(content[0]) * 60 + parseInt(content[1]);

    startTimer();

    if (display_timer.contains(resume)) {
        resume.replaceWith(stopb);
 }
});
stopb.addEventListener("click", () => {
    clearInterval(x);
    stopb.replaceWith(resume)

});
resume.addEventListener("click",()=>{
    clearInterval(x);
    startTimer()   
    resume.replaceWith(stopb)})
theme_1.addEventListener("click",()=>{
    document.body.classList.remove("the-neighbour")
    document.body.classList.add("spirited-away")
})

theme_2.addEventListener("click",()=>{
    document.body.classList.remove("spirited-away")
    document.body.classList.add("the-neighbour")
})