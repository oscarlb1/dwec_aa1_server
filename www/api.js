// (GET) 
// Para obtener todas las categorías
// GET http://localhost:3000/categories

// Para obtener una categoría y todos sus sitios (reemplaza :id)
// GET http://localhost:3000/categories/:id?_embed=sites

// Para obtener todos los sitios de todas las categorías
// GET http://localhost:3000/sites

// (POST) 
// Para añadir una nueva categoría
// POST http://localhost:3000/categories

// Para añadir un nuevo sitio a una categoría (el body debe incluir el categoryId)
// POST http://localhost:3000/sites

// (DELETE)
// Para eliminar una categoría (reemplaza :id)
// DELETE http://localhost:3000/categories/:id

// Para eliminar un sitio (reemplaza :id)
// DELETE http://localhost:3000/sites/:id