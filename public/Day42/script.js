const showToastBtn = document.querySelector('.show-toast');
const horizontalPosition = document.querySelector('#horizontal-position');
const verticalPosition = document.querySelector('#vertical-position');
const toastType = document.querySelector('#toast-type');
const toastMessage = document.querySelector('#toast-message');
const toastsContainer = document.querySelector('.toasts-container');
const durationInput = document.querySelector('#duration');
const durationValue = document.querySelector('#duration-value');

durationInput.addEventListener('input', () => {
  durationValue.innerText = durationInput.value;
});

showToastBtn.addEventListener('click', () => {
  // Set container positions
  toastsContainer.className = 'toasts-container'; // reset classes
  toastsContainer.classList.add(horizontalPosition.value, verticalPosition.value);

  // Create toast
  const newToast = document.createElement('div');
  newToast.classList.add('toast', toastType.value);
  newToast.innerText = toastMessage.value;

  // Close button
  const closeIcon = document.createElement('span');
  closeIcon.innerText = '✕';
  newToast.append(closeIcon);

  function removeToast() {
    newToast.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => newToast.remove(), 300);
  }

  closeIcon.addEventListener('click', removeToast);

  setTimeout(() => removeToast(), parseInt(durationInput.value) * 1000);

  toastsContainer.append(newToast);

  // Force reflow for animation
  newToast.offsetHeight;
});
