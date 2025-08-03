
    const apiKey="a0edd6d8982a09dd4d1a642c50646868";
    const apiUrl="https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
    const searchBox=document.querySelector(".search input");
    const searchBtn=document.querySelector("#searchBtn");

    const defaultCityMap = {
    "afghanistan": "Kabul",
    "albania": "Tirana",
    "algeria": "Algiers",
    "andorra": "Andorra la Vella",
    "angola": "Luanda",
    "argentina": "Buenos Aires",
    "armenia": "Yerevan",
    "australia": "Canberra",
    "austria": "Vienna",
    "azerbaijan": "Baku",
    "bangladesh": "Dhaka",
    "belgium": "Brussels",
    "bhutan": "Thimphu",
    "brazil": "Brasília",
    "bulgaria": "Sofia",
    "canada": "Ottawa",
    "china": "Beijing",
    "colombia": "Bogotá",
    "cuba": "Havana",
    "denmark": "Copenhagen",
    "egypt": "Cairo",
    "finland": "Helsinki",
    "france": "Paris",
    "germany": "Berlin",
    "greece": "Athens",
    "hungary": "Budapest",
    "iceland": "Reykjavik",
    "india": "New Delhi",
    "indonesia": "Jakarta",
    "iran": "Tehran",
    "iraq": "Baghdad",
    "ireland": "Dublin",
    "israel": "Jerusalem",
    "italy": "Rome",
    "japan": "Tokyo",
    "kazakhstan": "Astana",
    "kenya": "Nairobi",
    "malaysia": "Kuala Lumpur",
    "mexico": "Mexico City",
    "nepal": "Kathmandu",
    "netherlands": "Amsterdam",
    "new zealand": "Wellington",
    "nigeria": "Abuja",
    "north korea": "Pyongyang",
    "norway": "Oslo",
    "pakistan": "Islamabad",
    "philippines": "Manila",
    "poland": "Warsaw",
    "portugal": "Lisbon",
    "qatar": "Doha",
    "romania": "Bucharest",
    "russia": "Moscow",
    "saudi arabia": "Riyadh",
    "singapore": "Singapore",
    "south africa": "Pretoria",
    "south korea": "Seoul",
    "spain": "Madrid",
    "sri lanka": "Colombo",
    "sweden": "Stockholm",
    "switzerland": "Bern",
    "thailand": "Bangkok",
    "turkey": "Ankara",
    "ukraine": "Kyiv",
    "united arab emirates": "Abu Dhabi",
    "united kingdom": "London",
    "united states": "Washington",
    "vietnam": "Hanoi",
    "zimbabwe": "Harare",

    // Indian states
    "andhra pradesh": "Amaravati",
    "arunachal pradesh": "Itanagar",
    "assam": "Dispur",
    "bihar": "Patna",
    "chhattisgarh": "Raipur",
    "goa": "Panaji",
    "gujarat": "Gandhinagar",
    "haryana": "Chandigarh",
    "himachal pradesh": "Shimla",
    "jharkhand": "Ranchi",
    "karnataka": "Bengaluru",
    "kerala": "Thiruvananthapuram",
    "madhya pradesh": "Bhopal",
    "maharashtra": "Mumbai",
    "manipur": "Imphal",
    "meghalaya": "Shillong",
    "mizoram": "Aizawl",
    "nagaland": "Kohima",
    "odisha": "Bhubaneswar",
    "punjab": "Chandigarh",
    "rajasthan": "Jaipur",
    "sikkim": "Gangtok",
    "tamil nadu": "Chennai",
    "telangana": "Hyderabad",
    "tripura": "Agartala",
    "uttar pradesh": "Lucknow",
    "uttarakhand": "Dehradun",
    "west bengal": "Kolkata"
    };


    async function checkWeather(city){
        const response=await fetch(`${apiUrl}${city}&appid=${apiKey}`);
        if (response.status === 404) {
            alert("City/Country/State not found! Please enter a valid place name.");
            return;
        }
        const data=await response.json();
        
        document.querySelector(".temp").innerHTML=`${Math.round(data.main.temp)} &deg;C`;
        document.querySelector(".city").innerHTML=data.name;
        document.querySelector(".humidity").innerHTML=`${data.main.humidity}%`;
        document.querySelector(".wind").innerHTML=`${data.wind.speed} km/h`;
        if(data.weather[0].main=="Clouds"){
            document.querySelector(".weather-icon").src="images/clouds.png";
        }else if(data.weather[0].main=="Clear"){
            document.querySelector(".weather-icon").src="images/clear.jpg";
        }else if(data.weather[0].main=="Rain"){
            document.querySelector(".weather-icon").src="images/rain.jpg";
        }else if(data.weather[0].main=="Drizzle"){
            document.querySelector(".weather-icon").src="images/drizzle.png";
        }else if(data.weather[0].main=="Mist"){
            document.querySelector(".weather-icon").src="images/mist.png";
        }else if(data.weather[0].main == "Snow"){
            document.querySelector(".weather-icon").src = "images/snow.png";
        }else if(data.weather[0].main == "Thunderstorm"){
            document.querySelector(".weather-icon").src = "images/thunderstorm.png";
        } else if(data.weather[0].main == "Haze"){
            document.querySelector(".weather-icon").src = "images/mist.png";
        } else if(data.weather[0].main == "Fog"){
            document.querySelector(".weather-icon").src = "images/mist.png";
        }

        document.querySelector(".weather").style.display = "block";
    }

    searchBtn.addEventListener("click", () => {
    let userInput = searchBox.value.trim().toLowerCase();

    if (!userInput) {
        alert("Please enter a city/country/state name.");
        return;
    }
    if (defaultCityMap[userInput]) {
        userInput = defaultCityMap[userInput];
    }

    if (userInput) {
        checkWeather(userInput);
    }
    });