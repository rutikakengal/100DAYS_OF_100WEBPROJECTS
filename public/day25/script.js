const headers = document.querySelectorAll('.accordion-header');

headers.forEach(header => {
  header.addEventListener('click', () => {
    const openHeader = document.querySelector('.accordion-header.active');

    if (openHeader && openHeader !== header) {
      openHeader.classList.remove('active');
      openHeader.nextElementSibling.style.maxHeight = null;
    }

    header.classList.toggle('active');
    const body = header.nextElementSibling;

    if (header.classList.contains('active')) {
      body.style.maxHeight = body.scrollHeight + 'px';
    } else {
      body.style.maxHeight = null;
    }
  });
});
