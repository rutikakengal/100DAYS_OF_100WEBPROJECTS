let totop = document.getElementById('scrltotop');

totop.style.display = 'none';

window.addEventListener('scroll', () => {
    if(window.scrollY > 500){
        totop.style.display = 'block';
    }
    else{
        totop.style.display = 'none';
    }
})

totop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});