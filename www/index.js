import { api } from './api.js';

const categoriesList = document.getElementById('categoriesList');

function renderCategories(categories) {
  categoriesList.innerHTML = '';

  categories.forEach(category => {
    const categoryItem = document.createElement('li');
    categoryItem.className = 'category-item';
    categoryItem.innerHTML = `
      <div class="category-content">
        <a href="#" onclick="selectCategory(${category.id})" class="category-name">
          ${category.name}
        </a>
        <button onclick="deleteCategory(${category.id})" class="btn-delete-category">
          Borrar
        </button>
      </div>
    `;
    categoriesList.appendChild(categoryItem);
  });
}

async function cargarCategories() {
  const categories = await api.getCategories();
  renderCategories(categories);
}

async function selectCategory(categoryId) {
  const category = await api.getCategorySites(categoryId);
}

async function deleteCategory(categoryId) {
  await api.deleteCategory(categoryId);
  cargarCategories();
}

cargarCategories();