let selectedCategoryId = null;
let allCategories = [];

const categoryModal = document.getElementById('categoryModal');
const confirmModal = document.getElementById('confirmModal');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const addSiteBtn = document.getElementById('addSiteBtn');
const categoryNameInput = document.getElementById('categoryNameInput');
const categoryError = document.getElementById('categoryError');
const searchInput = document.getElementById('searchInput');
const categoriesList = document.getElementById('categoriesList');
const sitesContainer = document.getElementById('sitesContainer');
const selectedCategoryName = document.getElementById('selectedCategoryName');

let pendingDeleteAction = null;

function openCategoryModal() {
  categoryModal.classList.add('active');
  categoryNameInput.value = '';
  categoryError.textContent = '';
  categoryError.classList.remove('show');
  categoryNameInput.focus();
}

function closeCategoryModal() {
  categoryModal.classList.remove('active');
}

function openConfirmModal(message, action) {
  document.getElementById('confirmMessage').textContent = message;
  pendingDeleteAction = action;
  confirmModal.classList.add('active');
}

function closeConfirmModal() {
  confirmModal.classList.remove('active');
  pendingDeleteAction = null;
}

function validateCategoryName(name) {
  if (!name || name.trim().length < 2) {
    categoryError.textContent = 'Mínimo 2 caracteres';
    categoryError.classList.add('show');
    return false;
  }
  categoryError.classList.remove('show');
  return true;
}

async function handleSaveCategory() {
  const name = categoryNameInput.value.trim();
  
  if (!validateCategoryName(name)) return;

  try {
    await api.addCategory({ name });
    closeCategoryModal();
    loadCategories();
  } catch (error) {
    categoryError.textContent = 'Error al guardar';
    categoryError.classList.add('show');
  }
}

async function handleDeleteCategory(categoryId) {
  try {
    await api.deleteCategory(categoryId);
    closeConfirmModal();
    if (selectedCategoryId === categoryId) {
      selectedCategoryId = null;
      sitesContainer.innerHTML = '<p class="empty-state">Selecciona una categoría</p>';
      selectedCategoryName.textContent = 'Selecciona una categoría';
      addSiteBtn.style.display = 'none';
    }
    loadCategories();
  } catch (error) {
    console.error('Error:', error);
  }
}

async function handleDeleteSite(siteId) {
  try {
    await api.deleteSite(siteId);
    closeConfirmModal();
    if (selectedCategoryId) {
      loadSites(selectedCategoryId);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function loadCategories() {
  try {
    const categories = await api.getCategories();
    allCategories = categories;
    renderCategories();
  } catch (error) {
    console.error('Error:', error);
  }
}

function renderCategories() {
  categoriesList.innerHTML = '';
  const uniqueCategories = [];
  const seenIds = new Set();

  allCategories.forEach(category => {
    if (!seenIds.has(category.id)) {
      seenIds.add(category.id);
      uniqueCategories.push(category);
    }
  });
  
  uniqueCategories.forEach(category => {
    const li = document.createElement('li');
    li.className = `category-item ${category.id === selectedCategoryId ? 'active' : ''}`;
    
    li.innerHTML = `
      <span>${category.name}</span>
      <button class="category-delete">X</button>
    `;
    
    li.addEventListener('click', (e) => {
      if (e.target.classList.contains('category-delete')) {
        e.stopPropagation();
        openConfirmModal(`¿Eliminar "${category.name}"?`, () => handleDeleteCategory(category.id));
      } else {
        selectCategory(category.id);
      }
    });
    
    categoriesList.appendChild(li);
  });
}

async function selectCategory(categoryId) {
  selectedCategoryId = categoryId;
  renderCategories();
  const category = allCategories.find(c => c.id === categoryId);
  selectedCategoryName.textContent = category.name;
  addSiteBtn.style.display = 'block';
  loadSites(categoryId);
}

async function loadSites(categoryId) {
  try {
    const category = await api.getCategorySites(categoryId);
    const sites = category.sites || [];
    renderSites(sites);
  } catch (error) {
    console.error('Error:', error);
  }
}

function renderSites(sites) {
  if (sites.length === 0) {
    sitesContainer.innerHTML = '<p class="empty-state">No hay sitios en esta categoría</p>';
    return;
  }

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Usuario</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      ${sites.map((site, idx) => `
        <tr>
          <td>${site.name}</td>
          <td>${site.user}</td>
          <td>
            <button class="btn-action" onclick="showPassword(${idx})">Ver</button>
            <button class="btn-action" onclick="deleteSiteConfirm(${site.id}, '${site.name}')">Eliminar</button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;

  sitesContainer.innerHTML = '';
  sitesContainer.appendChild(table);
}

function showPassword(idx) {
  alert('Contraseña: [Función para mostrar contraseña]');
}

function deleteSiteConfirm(siteId, siteName) {
  openConfirmModal(`¿Eliminar sitio "${siteName}"?`, () => handleDeleteSite(siteId));
}

function filterContent(searchTerm) {
  const term = searchTerm.toLowerCase();
  
  document.querySelectorAll('.category-item').forEach(item => {
    const name = item.textContent.toLowerCase();
    item.style.display = name.includes(term) ? '' : 'none';
  });

  if (document.querySelector('table')) {
    document.querySelectorAll('table tbody tr').forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(term) ? '' : 'none';
    });
  }
}

addCategoryBtn.addEventListener('click', openCategoryModal);
document.getElementById('cancelCategoryBtn').addEventListener('click', closeCategoryModal);
document.getElementById('saveCategoryBtn').addEventListener('click', handleSaveCategory);
document.getElementById('cancelConfirmBtn').addEventListener('click', closeConfirmModal);
document.getElementById('confirmBtn').addEventListener('click', () => pendingDeleteAction && pendingDeleteAction());

addSiteBtn.addEventListener('click', () => {
  localStorage.setItem('selectedCategoryId', selectedCategoryId);
  window.location.href = 'form.html';
});

categoryNameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSaveCategory();
});

categoryNameInput.addEventListener('blur', () => {
  validateCategoryName(categoryNameInput.value);
});

searchInput.addEventListener('input', (e) => {
  filterContent(e.target.value);
});

loadCategories();
