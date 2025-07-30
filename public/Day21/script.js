let html_input = document.querySelector("#html-section textarea");
let css_input = document.querySelector("#css-section textarea");
let js_input = document.querySelector("#js-section textarea");
let save = document.querySelector("#save");
let output = document.querySelector("#output");

save.addEventListener("click",() => {
    output.contentDocument.body.innerHTML = html_input.value;
    output.contentDocument.head.innerHTML = `<style>${css_input.value}</style>`;
    const script = document.createElement("script");
    script.textContent = js_input.value;
    output.contentDocument.body.appendChild(script);
})

let full = document.querySelector("#full-screen");
let output_container = document.querySelector(".output-container");
full.addEventListener("click" , () => {
    output_container.classList.toggle("output-full-screen");
    if( output_container.classList.contains("output-full-screen")){
        full.style.transform = "rotate(180deg)";
    }else{
         full.style.transform = "rotate(0deg)";
    }
})

let copy = document.querySelectorAll(".copy");
copy.forEach((e) => {
    e.addEventListener("click" , () => {
        if(e.classList.contains("copy1")){
        navigator.clipboard.writeText(html_input.value);
        }else if(e.classList.contains("copy2")){
        navigator.clipboard.writeText(css_input.value);
        }else if(e.classList.contains("copy3")){
        navigator.clipboard.writeText(js_input.value);
        }
    })
})