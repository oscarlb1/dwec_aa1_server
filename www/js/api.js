const BASE_URL = 'http://localhost:3000';

class API {
    // (GET) Para obtener todas las categorías
    // GET http://localhost:3000/categories
    async getCategories() {
        try {
            const response = await fetch(`${BASE_URL}/categories`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    }

    // Para obtener una categoría y todos sus sitios (reemplaza :id por la id que quieras obtener)
    // GET http://localhost:3000/categories/:id?_embed=sites
    async getCategorySites(categoryId) {
        try {
            const response = await fetch(`${BASE_URL}/categories/${categoryId}?_embed=sites`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        } catch (error) {
            console.error(`Error fetching sites for category ${categoryId}:`, error);
            throw error;
        }
    }

    // Para obtener todos los sitios de todas las categorías
    // GET http://localhost:3000/sites
    async getSites() {
        try {
            const response = await fetch(`${BASE_URL}/sites`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        } catch (error) {
            console.error("Error fetching all sites:", error);
            throw error;
        }
    }

    // (POST) Para añadir una nueva categoría
    // POST http://localhost:3000/categories
    async addCategory(categoryData) {
        try {
            const response = await fetch(`${BASE_URL}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryData)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        } catch (error) {
            console.error("Error adding category:", error);
            throw error;
        }
    }

    // Para añadir un nuevo sitio a una categoría a través de la ruta de categorías
    // POST http://localhost:3000/categories/:id
    async addSite(siteData) {
        const categoryId = siteData.categoryId; 
        const { categoryId: _, ...siteBody } = siteData; 
        
        try {
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
        } catch (error) {
            console.error("Error adding site:", error);
            throw error;
        }
    }

    // (DELETE) Para eliminar una categoría (reemplaza :id)
    // DELETE http://localhost:3000/categories/:id
    async deleteCategory(categoryId) {
        try {
            const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.ok;
        } catch (error) {
            console.error(`Error deleting category ${categoryId}:`, error);
            throw error;
        }
    }

    // Para eliminar un sitio (reemplaza :id)
    // DELETE http://localhost:3000/sites/:id
    async deleteSite(siteId) {
        try {
            const response = await fetch(`${BASE_URL}/sites/${siteId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.ok;
        } catch (error) {
            console.error(`Error deleting site ${siteId}:`, error);
            throw error;
        }
    }
}

export const api = new API();