// Simple login form JS: validation, show/hide pw, remember me
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const email = document.getElementById('email');
  const pw = document.getElementById('password');
  const toggle = document.getElementById('togglePw');
  const remember = document.getElementById('remember');
  const message = document.getElementById('message');
  const demoBtn = document.getElementById('demoBtn');

  // If previously remembered, fill email
  const rememberedEmail = localStorage.getItem('rememberedEmail');
  if (rememberedEmail) {
    email.value = rememberedEmail;
    remember.checked = true;
  }

  toggle.addEventListener('click', () => {
    if (pw.type === 'password') {
      pw.type = 'text';
      toggle.textContent = '🙈';
    } else {
      pw.type = 'password';
      toggle.textContent = '👁️';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Simple validation
    const mailVal = email.value.trim();
    const pwVal = pw.value.trim();

    if (!mailVal || !/^\S+@\S+\.\S+$/.test(mailVal)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }
    if (!pwVal || pwVal.length < 6) {
      showMessage('Password must be at least 6 characters.', 'error');
      return;
    }

    // Remember logic
    if (remember.checked) localStorage.setItem('rememberedEmail', mailVal);
    else localStorage.removeItem('rememberedEmail');

    // Simulate success (no backend)
    showMessage(`Welcome back, ${mailVal.split('@')[0]}! Successfully signed in.`, 'success');

    // Optionally clear password
    pw.value = '';
  });

  demoBtn.addEventListener('click', () => {
    email.value = 'demo@example.com';
    pw.value = 'password123';
    remember.checked = false;
    showMessage('Demo credentials loaded — try signing in!', 'success');
  });

  function showMessage(text, type = 'success') {
    message.className = 'message ' + (type === 'error' ? 'error' : 'success');
    message.textContent = text;
    // hide after a while
    setTimeout(() => {
      message.style.display = 'none';
    }, 4000);
    message.style.display = 'block';
  }
});
