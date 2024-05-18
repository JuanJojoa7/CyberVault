// Función para mostrar productos
function displayProducts(products) {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '';

    products.forEach(product => {
        const productItem = document.createElement('li');
        productItem.textContent = `${product.name} - $${product.price}`;
        productsList.appendChild(productItem);
    });
}

// Función para obtener productos
async function fetchProducts() {
    try {
        const response = await fetch('/api/products'); // Ruta de la API
        if (response.ok) {
            const products = await response.json();
            displayProducts(products);
        } else {
            console.error('Error al obtener los productos:', response.statusText);
        }
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
}

// Obtener y mostrar productos al cargar la página
window.addEventListener('DOMContentLoaded', fetchProducts);
