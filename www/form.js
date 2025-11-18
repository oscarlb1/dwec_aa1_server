const siteForm = document.getElementById('siteForm');
const siteNameInput = document.getElementById('siteName');
const siteUrlInput = document.getElementById('siteUrl');
const siteUserInput = document.getElementById('siteUser');
const sitePasswordInput = document.getElementById('sitePassword');
const togglePasswordBtn = document.getElementById('togglePasswordBtn');
const generatePasswordBtn = document.getElementById('generatePasswordBtn');

let categoryId = null;

const errors = {
  name: document.getElementById('nameError'),
  user: document.getElementById('userError'),
  password: document.getElementById('passwordError'),
  url: document.getElementById('urlError')
};

function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function showError(field, message) {
  errors[field].textContent = message;
  errors[field].classList.add('show');
}

function hideError(field) {
  errors[field].classList.remove('show');
}

function validateForm() {
  let valid = true;

  if (!siteNameInput.value.trim()) {
    showError('name', 'El nombre es obligatorio');
    valid = false;
  } else {
    hideError('name');
  }

  if (!siteUserInput.value.trim()) {
    showError('user', 'El usuario es obligatorio');
    valid = false;
  } else {
    hideError('user');
  }

  if (!sitePasswordInput.value) {
    showError('password', 'La contraseña es obligatoria');
    valid = false;
  } else {
    hideError('password');
  }

  if (siteUrlInput.value.trim() && !isValidUrl(siteUrlInput.value.trim())) {
    showError('url', 'URL inválida');
    valid = false;
  } else {
    hideError('url');
  }

  return valid;
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

togglePasswordBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const type = sitePasswordInput.type === 'password' ? 'text' : 'password';
  sitePasswordInput.type = type;
  togglePasswordBtn.textContent = type === 'password' ? 'Mostrar' : 'Ocultar';
});

generatePasswordBtn.addEventListener('click', (e) => {
  e.preventDefault();
  sitePasswordInput.value = generatePassword();
  sitePasswordInput.type = 'text';
  togglePasswordBtn.textContent = 'Ocultar';
});

siteNameInput.addEventListener('blur', () => {
  if (!siteNameInput.value.trim()) {
    showError('name', 'El nombre es obligatorio');
  } else {
    hideError('name');
  }
});

siteUserInput.addEventListener('blur', () => {
  if (!siteUserInput.value.trim()) {
    showError('user', 'El usuario es obligatorio');
  } else {
    hideError('user');
  }
});

sitePasswordInput.addEventListener('blur', () => {
  if (!sitePasswordInput.value) {
    showError('password', 'La contraseña es obligatoria');
  } else {
    hideError('password');
  }
});

siteUrlInput.addEventListener('blur', () => {
  const url = siteUrlInput.value.trim();
  if (url && !isValidUrl(url)) {
    showError('url', 'URL inválida');
  } else {
    hideError('url');
  }
});

siteForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const siteData = {
    name: siteNameInput.value.trim(),
    url: siteUrlInput.value.trim(),
    user: siteUserInput.value.trim(),
    password: sitePasswordInput.value,
    description: document.getElementById('siteDescription').value.trim(),
    categoryId: categoryId,
    createdAt: new Date().toISOString()
  };

  try {
    await api.addSite(siteData);
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error:', error);
    alert('Error al guardar');
  }
});

categoryId = parseInt(localStorage.getItem('selectedCategoryId'));
