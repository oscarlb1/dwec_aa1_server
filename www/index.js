import { api } from './api.js';

const categoriesList = document.getElementById('categoriesList');
const selectedCategoryName = document.getElementById('selectedCategoryName');
const addSiteBtn = document.getElementById('addSiteBtn');
const sitesContainer = document.getElementById('sitesContainer');
const categoryModal = document.getElementById('categoryModal');
const categoryNameInput = document.getElementById('categoryNameInput');
const categoryError = document.getElementById('categoryError');
const confirmModal = document.getElementById('confirmModal');
const confirmMessage = document.getElementById('confirmMessage');
let currentCategoryId = null;
let categoryToDeleteId = null;

function renderCategories(categories) {
  categoriesList.innerHTML = '';
  categories.forEach(category => {
    const categoryItem = document.createElement('li');
    categoryItem.onclick = () => selectCategory(category.id, category.name);
    if (category.id === currentCategoryId) {
      categoryItem.classList.add('active');
    }

    categoryItem.innerHTML = `
            ${category.name}
            <button onclick="prepararEliminacion(${category.id}, '${category.name}')">
                Borrar
            </button>
        `;
    categoriesList.appendChild(categoryItem);
  });
}

function renderSites(sites) {
  sitesContainer.innerHTML = '';
  if (sites.length === 0) {
    sitesContainer.innerHTML = '<p>No hay sitios guardados.</p>';
    return;
  }

  sites.forEach(site => {
    const siteDiv = document.createElement('div');
    siteDiv.innerHTML = `
            <h3>${site.name}</h3>
            <p>Usuario: ${site.user}</p>
            <p>Contraseña: *******</p>
            <p>URL: ${site.url || 'Sin URL'}</p>
            <button onclick="deleteSite(${site.id})">Eliminar</button>
            <hr>
        `;
    sitesContainer.appendChild(siteDiv);
  });
}

async function cargarCategories() {
  try {
    const categories = await api.getCategories();
    renderCategories(categories);
  } catch (error) {
    categoriesList.innerHTML = '<li>Error de conexión.</li>';
  }
}

async function selectCategory(categoryId, categoryName) {
  currentCategoryId = categoryId;
  selectedCategoryName.textContent = categoryName;
  addSiteBtn.style.display = 'block';
  cargarCategories();
  try {
    const categoryData = await api.getCategorySites(categoryId);
    renderSites(categoryData.sites || []);
  } catch (error) {
    sitesContainer.innerHTML = '<p>Error al cargar los sitios.</p>';
  }
}

async function deleteSite(siteId) {
  if (!confirm('¿Seguro que quieres eliminar este sitio?')) return;

  try {
    await api.deleteSite(siteId);
    if (currentCategoryId) {
      const currentCategoryName = selectedCategoryName.textContent;
      await selectCategory(currentCategoryId, currentCategoryName);
    }
  } catch (error) {
    alert(`Error al eliminar sitio.`);
  }
}

function abrirModalCategoria() {
  categoryNameInput.value = '';
  categoryError.textContent = '';
  categoryModal.style.display = 'block';
  categoryNameInput.focus();
}

function cerrarModalCategoria() {
  categoryModal.style.display = 'none';
}

async function guardarCategoria() {
  const name = categoryNameInput.value.trim();
  categoryError.textContent = '';

  if (!name) {
    categoryError.textContent = 'El nombre es obligatorio.';
    return;
  }
  try {
    await api.addCategory(name);
    cerrarModalCategoria();
    await cargarCategories();
  } catch (error) {
    categoryError.textContent = `Error: La categoría ya existe o hay un problema.`;
  }
}

function prepararEliminacion(id, name) {
  categoryToDeleteId = id;
  confirmMessage.textContent = `¿Seguro que quieres eliminar "${name}" y todos sus sitios?`;
  confirmModal.style.display = 'block';
}

function cerrarConfirm() {
  categoryToDeleteId = null;
  confirmModal.style.display = 'none';
}

async function confirmarEliminacion() {
  if (categoryToDeleteId === null) return;

  try {
    await api.deleteCategory(categoryToDeleteId);
    cerrarConfirm();

    if (categoryToDeleteId === currentCategoryId) {
      currentCategoryId = null;
      selectedCategoryName.textContent = 'Selecciona una categoría';
      addSiteBtn.style.display = 'none';
      sitesContainer.innerHTML = '';
    }
    await cargarCategories();

  } catch (error) {
    alert("Error al intentar eliminar la categoría.");
    cerrarConfirm();
  }
}

async function irAFormulario() {
  if (currentCategoryId) {
    window.location.assign(`form.html?categoryId=${currentCategoryId}`);
  } else {
    alert("Selecciona una categoría primero.");
  }
}

cargarCategories();

window.selectCategory = selectCategory;
window.deleteSite = deleteSite;
window.abrirModalCategoria = abrirModalCategoria;
window.cerrarModalCategoria = cerrarModalCategoria;
window.guardarCategoria = guardarCategoria;
window.prepararEliminacion = prepararEliminacion;
window.cerrarConfirm = cerrarConfirm;
window.confirmarEliminacion = confirmarEliminacion;
window.irAFormulario = irAFormulario;