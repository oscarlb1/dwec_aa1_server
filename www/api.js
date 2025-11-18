class API {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  // (GET) Para obtener todas las categorías
  // GET http://localhost:3000/categories
  async getCategories() {
    const response = await fetch(`${this.baseUrl}/categories`);
    return response.json();
  }

  // Para obtener una categoría y todos sus sitios (reemplaza :id)
  // GET http://localhost:3000/categories/:id?_embed=sites
  async getCategorySites(categoryId) {
    const response = await fetch(`${this.baseUrl}/categories/${categoryId}?_embed=sites`);
    return response.json();
  }

  // Para obtener todos los sitios de todas las categorías
  // GET http://localhost:3000/sites
  async getSites() {
    const response = await fetch(`${this.baseUrl}/sites`);
    return response.json();
  }

  // (POST) Para añadir una nueva categoría
  // POST http://localhost:3000/categories
  async addCategory(categoryData) {
    const response = await fetch(`${this.baseUrl}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    });
    return response.json();
  }

  // Para añadir un nuevo sitio a una categoría (el body debe incluir el categoryId)
  // POST http://localhost:3000/sites
  async addSite(siteData) {
    const response = await fetch(`${this.baseUrl}/sites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(siteData)
    });
    return response.json();
  }

  // (DELETE) Para eliminar una categoría (reemplaza :id)
  // DELETE http://localhost:3000/categories/:id
  async deleteCategory(categoryId) {
    const response = await fetch(`${this.baseUrl}/categories/${categoryId}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  // Para eliminar un sitio (reemplaza :id)
  // DELETE http://localhost:3000/sites/:id
  async deleteSite(siteId) {
    const response = await fetch(`${this.baseUrl}/sites/${siteId}`, {
      method: 'DELETE'
    });
    return response.json();
  }
}

const api = new API();
