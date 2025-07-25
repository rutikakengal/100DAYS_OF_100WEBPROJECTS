const img = document.getElementById('img')
const btn = document.getElementById('btn')

const GET_API = 'https://api.thecatapi.com/v1/images/search'

async function fetchImg() {
    try {
        const res = await fetch(GET_API)
        const data = await res.json()
        // const i = Math.floor(Math.random()*data.length) 
        // const result =data[i]
        img.style.backgroundImage = `url(${data[0].url})`
    }
    catch(error){
        img.innerText="Failed to fetch Image"
    }

}

btn.addEventListener('click', fetchImg)