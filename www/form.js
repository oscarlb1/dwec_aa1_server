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

// OPCIONAL: Implementar la opción de autogenerar contraseña segura
function generarContrasena() {
    const longitud = 16;
    if (longitud < 8) longitud = 8;
    
    const minusculas = 'abcdefghijklmnopqrstuvwxyz';
    const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
    const simbolos = '!@#$%^&*()_+[]{}|;:,.<>?';
    const todosLosCaracteres = minusculas + mayusculas + numeros + simbolos;

    let contrasena = '';

    // Garantizar un carácter de cada tipo
    contrasena += minusculas[Math.floor(Math.random() * minusculas.length)];
    contrasena += mayusculas[Math.floor(Math.random() * mayusculas.length)];
    contrasena += numeros[Math.floor(Math.random() * numeros.length)];
    contrasena += simbolos[Math.floor(Math.random() * simbolos.length)];

    // Rellenar hasta la longitud deseada
    for (let i = contrasena.length; i < longitud; i++) {
        contrasena += todosLosCaracteres[Math.floor(Math.random() * todosLosCaracteres.length)];
    }

    // Mezclar la contraseña final aleatoriamente
    const contrasenaGenerada = contrasena.split('').sort(() => 0.5 - Math.random()).join('');

    // Asignar el resultado al campo de entrada del formulario (sitePassword)
    if (sitePassword) {
        sitePassword.value = contrasenaGenerada; 
    }
}

// OBLIGATORIO: Guardar un sitio
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
window.generarContrasena = generarContrasena;
