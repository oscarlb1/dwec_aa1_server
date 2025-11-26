import { api } from "./api.js"

let selectedCategoryId = null
let allCategories = []
let currentSites = []

const categoryModal = document.getElementById("categoryModal")
const confirmModal = document.getElementById("confirmModal")
const addSiteBtn = document.getElementById("addSiteBtn")
const categoryNameInput = document.getElementById("categoryNameInput")
const categoryError = document.getElementById("categoryError")
const categoriesList = document.getElementById("categoriesList")
const sitesContainer = document.getElementById("sitesContainer")
const selectedCategoryName = document.getElementById("selectedCategoryName")

let pendingDeleteAction = null

function openCategoryModal() {
  categoryModal.classList.add("active")
  categoryNameInput.value = ""
  categoryError.textContent = ""
  categoryNameInput.focus()
}

function closeCategoryModal() {
  categoryModal.classList.remove("active")
}

function openConfirmModal(message, action) {
  document.getElementById("confirmMessage").textContent = message
  pendingDeleteAction = action
  confirmModal.classList.add("active")
}

function closeConfirmModal() {
  confirmModal.classList.remove("active")
  pendingDeleteAction = null
}

// OBLIGATORIO: Validar nombre de categoría 
function validateCategoryName(name) {
  if (!name || name.trim().length === 0) {
    categoryError.textContent = "El nombre es obligatorio"
    categoryError.classList.add("show")
    return false
  }
  categoryError.classList.remove("show")
  return true
}

// OBLIGATORIO: Añadir nueva categoría
async function handleSaveCategory() {
  const name = categoryNameInput.value.trim()
  if (!validateCategoryName(name)) return

  try {
    await api.addCategory({ name })
    closeCategoryModal()
    loadCategories()
  } catch (error) {
    console.error("Error:", error)
  }
}

// OBLIGATORIO: Eliminar categoría
async function handleDeleteCategory(categoryId) {
  try {
    await api.deleteCategory(categoryId)
    closeConfirmModal()
    if (selectedCategoryId === categoryId) {
      selectedCategoryId = null
      sitesContainer.innerHTML = "<p>Selecciona una categoría</p>"
      selectedCategoryName.textContent = "Selecciona una categoría"
    }
    loadCategories()
  } catch (error) {
    console.error("Error:", error)
  }
}

// OBLIGATORIO: Eliminar sitio
async function handleDeleteSite(siteId) {
  try {
    await api.deleteSite(siteId)
    closeConfirmModal()
    if (selectedCategoryId) {
      loadSites(selectedCategoryId)
    }
  } catch (error) {
    console.error("Error:", error)
  }
}

// OBLIGATORIO: Cargar categorías
async function loadCategories() {
  try {
    const categories = await api.getCategories()
    allCategories = categories
    renderCategories()
  } catch (error) {
    console.error("Error:", error)
  }
}

// Renderizar categorías
function renderCategories(categoriesToRender = allCategories) {
  categoriesList.innerHTML = ""
  const seenIds = new Set()

  categoriesToRender.forEach((category) => {
    if (!seenIds.has(category.id)) {
      seenIds.add(category.id)

      const li = document.createElement("li")
      li.className = `category-item ${category.id === selectedCategoryId ? "active" : ""}`

      li.innerHTML = `
        <span>${category.name}</span>
        <button class="category-delete">Borrar</button>
      `

      li.addEventListener("click", (e) => {
        if (e.target.classList.contains("category-delete")) {
          e.stopPropagation()
          openConfirmModal(`¿Eliminar "${category.name}"?`, () => handleDeleteCategory(category.id))
        } else {
          selectCategory(category.id)
        }
      })

      categoriesList.appendChild(li)
    }
  })
}

// OBLIGATORIO: Seleccionar categoría y ver sus sitios
async function selectCategory(categoryId) {
  selectedCategoryId = categoryId
  renderCategories()
  const category = allCategories.find((c) => c.id === categoryId)
  selectedCategoryName.textContent = category.name
  addSiteBtn.style.display = "block"
  loadSites(categoryId)
}

// OBLIGATORIO: Cargar sitios de una categoría 
async function loadSites(categoryId) {
  try {
    const category = await api.getCategorySites(categoryId)
    const sites = category.sites || []
    currentSites = sites 
    document.getElementById("siteSearchInput").value = ""
    renderSites(sites)
  } catch (error) {
    console.error("Error:", error)
  }
}

// OBLIGATORIO: Renderizar sitios 
function renderSites(sites) {
  if (sites.length === 0) {
    sitesContainer.innerHTML = "<p>No hay sitios en esta categoría</p>"
    return
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Usuario</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
  `

  sites.forEach((site) => {
    html += `
      <tr>
        <td>${site.name}</td>
        <td>${site.user}</td>
        <td>
          <button onclick="deleteSiteConfirm(${site.id}, '${site.name}')">Eliminar</button>
        </td>
      </tr>
    `
  })

  html += `
      </tbody>
    </table>
  `

  sitesContainer.innerHTML = html
}

// OBLIGATORIO: Confirmar eliminación de sitio
function deleteSiteConfirm(siteId, siteName) {
  openConfirmModal(`¿Eliminar sitio "${siteName}"?`, () => handleDeleteSite(siteId))
}

// OBLIGATORIO: Ir a formulario para agregar sitio
addSiteBtn.addEventListener("click", () => {
  localStorage.setItem("selectedCategoryId", selectedCategoryId)
  window.location.href = "form.html"
})

categoryNameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSaveCategory()
})

// OPCIONAL: Filtrar categorías
function filterCategories() {
  const searchTerm = document.getElementById("categorySearchInput").value.toLowerCase()
  const filteredCategories = allCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm)
  )
  renderCategories(filteredCategories) 
}

// OPCIONAL: Filtrar sitios
function filterSites() {
  const searchTerm = document.getElementById("siteSearchInput").value.toLowerCase()
  const filteredSites = currentSites.filter(site =>
    site.name.toLowerCase().includes(searchTerm)
  )
  renderSites(filteredSites) 
}

// EVENT LISTENERS
document.getElementById("addCategoryBtn").addEventListener("click", openCategoryModal)
document.getElementById("cancelCategoryBtn").addEventListener("click", closeCategoryModal)
document.getElementById("saveCategoryBtn").addEventListener("click", handleSaveCategory)
document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
  if (pendingDeleteAction) pendingDeleteAction()
})
document.getElementById("categorySearchInput").addEventListener("input", filterCategories)
document.getElementById("siteSearchInput").addEventListener("input", filterSites)


loadCategories()

window.selectCategory = selectCategory
window.deleteSiteConfirm = deleteSiteConfirm
window.openCategoryModal = openCategoryModal
window.closeCategoryModal = closeCategoryModal
window.openConfirmModal = openConfirmModal
window.closeConfirmModal = closeConfirmModal
