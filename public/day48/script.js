document.addEventListener('DOMContentLoaded', ()=>{
const btn = document.getElementById('generateBtn');
btn.addEventListener('click', generatePassword);
typeWriterEffect();
});


function generatePassword(){

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|{}[]<>?";
    let password = "";
   
    for (let i=0; i<8; i++){
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }    
    document.getElementById("passwordOutput").value = password;
    alert("Congratulations!! Password has been generated, press ok");
}
    


function typeWriterEffect(){

    const text = "Random_Password_Generator";
    const h2 = document.getElementById("typewriter");

    h2.innerText = "";
    let index = 0;

    function type(){
        if(index < text.length) {
        h2.innerText += text.charAt(index);
        index++;
        setTimeout(type,100);
        }
    }
     type();
}