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
    nameError.classList.add("show"); 
    siteName.classList.add("error");
    return false;
  }
  nameError.textContent = "";
  nameError.classList.remove("show"); 
  siteName.classList.remove("error");
  return true;
}

function validarUsuario() {
  if (!siteUser.value.trim()) {
    userError.textContent = "El usuario es obligatorio";
    userError.classList.add("show");
    siteUser.classList.add("error");
    return false;
  }
  userError.textContent = "";
  userError.classList.remove("show");
  siteUser.classList.remove("error");
  return true;
}

function validarContrasena() {
  if (!sitePassword.value.trim()) {
    passwordError.textContent = "La contraseña es obligatoria";
    passwordError.classList.add("show");
    sitePassword.classList.add("error");
    return false;
  }
  passwordError.textContent = "";
  passwordError.classList.remove("show");
  sitePassword.classList.remove("error");
  return true;
}

function togglePassword() {
    sitePassword.type = sitePassword.type === "password" ? "text" : "password";
}

// OPCIONAL: Implementar la opción de autogenerar contraseña segura
function generarContrasena() {
    let longitud = 16;
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
async function guardarSitio(e) {
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

  try {
    await api.addSite(siteData);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error al guardar el sitio:", error);
    // Opcional: Mostrar un mensaje de error al usuario
  }
}

document.getElementById("siteForm").addEventListener("submit", guardarSitio);

window.validarNombre = validarNombre;
window.validarUsuario = validarUsuario;
window.validarContrasena = validarContrasena;
window.togglePassword = togglePassword;
window.guardarSitio = guardarSitio;
window.generarContrasena = generarContrasena;