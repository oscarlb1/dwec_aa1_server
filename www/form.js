import { api } from "./api.js";

const siteName = document.getElementById("siteName");
const siteUser = document.getElementById("siteUser");
const sitePassword = document.getElementById("sitePassword");
const siteDescription = document.getElementById("siteDescription");
const nameError = document.getElementById("nameError");
const userError = document.getElementById("userError");
const passwordError = document.getElementById("passwordError");

function validarNombre() {
  if (!siteName.value.trim()) {
    nameError.textContent = "El nombre es obligatorio";
    return false;
  }
  nameError.textContent = "";
  return true;
}

function validarUsuario() {
  if (!siteUser.value.trim()) {
    userError.textContent = "El usuario es obligatorio";
    return false;
  }
  userError.textContent = "";
  return true;
}

function validarContrasena() {
  if (!sitePassword.value.trim()) {
    passwordError.textContent = "La contraseña es obligatoria";
    return false;
  }
  passwordError.textContent = "";
  return true;
}

function togglePassword() {
    sitePassword.type = sitePassword.type === "password" ? "text" : "password";
}

function guardarSitio(e) {
e.preventDefault();

  const isNameValid = validarNombre();
  const isUserValid = validarUsuario();
  const isPasswordValid = validarContrasena();

  if (!isNameValid || !isUserValid || !isPasswordValid) {
    return;
  }

  const categoryId = localStorage.getItem("selectedCategoryId");

  const siteData = {
    name: siteName.value.trim(),
    user: siteUser.value.trim(),
    password: sitePassword.value.trim(),
    description: siteDescription.value.trim(),
    categoryId: categoryId
  };

  api.addSite(siteData)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

document.getElementById("siteForm").addEventListener("submit", guardarSitio);

window.validarNombre = validarNombre;
window.validarUsuario = validarUsuario;
window.validarContrasena = validarContrasena;
window.togglePassword = togglePassword;
window.guardarSitio = guardarSitio;
