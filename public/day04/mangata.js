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
const slides = document.querySelectorAll('.slide');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
let current = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${100 * (i - index)}%)`;
    });
}

nextBtn.addEventListener('click', () => {
    current = (current + 1) % slides.length;
    showSlide(current);
});

prevBtn.addEventListener('click', () => {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
});

showSlide(current);
