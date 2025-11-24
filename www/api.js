const BASE_URL = 'http://localhost:3000';

class API {
    // (GET) Para obtener todas las categorías
    // GET http://localhost:3000/categories
    async getCategories() {
        const response = await fetch(`${BASE_URL}/categories`);
        return response.json();
    }

    // Para obtener una categoría y todos sus sitios (reemplaza :id)
    // GET http://localhost:3000/categories/:id?_embed=sites
    async getCategorySites(categoryId) {
        const response = await fetch(`${BASE_URL}/categories/${categoryId}?_embed=sites`);
        return response.json();
    }

    // Para obtener todos los sitios de todas las categorías
    // GET http://localhost:3000/sites
    async getSites() {
        const response = await fetch(`${BASE_URL}/sites`);
        return response.json();
    }

    // (POST) Para añadir una nueva categoría
    // POST http://localhost:3000/categories
    async addCategory(categoryData) {
        const response = await fetch(`${BASE_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData)
        });
        return response.json();
    }

    // Para añadir un nuevo sitio a una categoría a través de la ruta de categorías
    // POST http://localhost:3000/categories/:id
    async addSite(siteData) {
        const categoryId = siteData.categoryId; 
        const { categoryId: _, ...siteBody } = siteData; // Extrae categoryId y usa el resto del cuerpo
        const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(siteBody)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al guardar el sitio. Código: ${response.status}. Detalle: ${errorText}`);
        }
        return response.json();
    }

    // (DELETE) Para eliminar una categoría (reemplaza :id)
    // DELETE http://localhost:3000/categories/:id
    async deleteCategory(categoryId) {
        const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
            method: 'DELETE'
        });
        return response.ok;
    }

    // Para eliminar un sitio (reemplaza :id)
    // DELETE http://localhost:3000/sites/:id
    async deleteSite(siteId) {
        const response = await fetch(`${BASE_URL}/sites/${siteId}`, {
            method: 'DELETE'
        });
        return response.ok;
    }
}
export const api = new API();