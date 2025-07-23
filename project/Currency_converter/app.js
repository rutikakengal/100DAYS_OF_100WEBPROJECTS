const BASE_URL = "https://open.er-api.com/v6/latest/";

let dropdowns = document.querySelectorAll("select");
let btn=document.querySelector("button");
let fromCurr =document.querySelector(".from select")
let toCurr =document.querySelector(".to select")
let msg = document.querySelector(".msg");
let amount = document.querySelector(".amount input")
let exchange = document.querySelector(".exchange i")


for (let select of dropdowns) {
  select.innerHTML = ""; // Clear old hardcoded <option> if needed
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.value = currCode;
    newOption.textContent = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.appendChild(newOption);
  }
  select.addEventListener("change",(evt)=>{
    updateFlag(evt.target);
  })
}

let updateFlag = (element) =>{
    let currCode= element.value;
    let countryCode = countryList[currCode]
    let newSource = `https://flagsapi.com/${countryCode}/flat/64.png`
    let img = element.parentElement.querySelector("img");
    img.src = newSource
}

exchange.addEventListener("click",()=>{
    let tempVal = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = tempVal;

    updateFlag(fromCurr);
    updateFlag(toCurr);

    // Also update exchange rate
    updateExchangeRate();
})

let updateExchangeRate = async()=>{
    msg.classList.toggle("after");
    
    let amtVal= amount.value;
    if(amtVal=="" || amtVal < 0){
        amtVal=1;
        amount.value=1;
        amount.value =""
        return
    }
    
    const URL = `${BASE_URL}${fromCurr.value}`;
    let response = await fetch(URL)
    let data= await response.json();
    let rate = data.rates[toCurr.value];
    console.log(rate);
    const result = (amtVal * rate).toFixed(3);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${result} ${toCurr.value}`;
}

btn.addEventListener("click",(evt)=>{
    evt.preventDefault();
    updateExchangeRate();
})

window.addEventListener("load" ,()=>{
    amount.value =1;
    updateExchangeRate();
})
