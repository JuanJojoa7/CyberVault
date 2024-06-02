const baseURL = 'http://localhost:3000';

// Obtener una referencia al contenedor de cartas
const cardsContainer = document.getElementById('cards-container');
const addProductButton = document.getElementById('add-product-button');
const productModal = document.getElementById('product-modal');
const modalTitle = document.getElementById('modal-title');
const productForm = document.getElementById('product-form');
const closeModal = document.querySelector('.close');

let isAdmin = false;
let editProductId = null;

// Mostrar/ocultar modal
function showModal() {
  productModal.style.display = 'block';
}

function hideModal() {
  productModal.style.display = 'none';
  productForm.reset();
  editProductId = null;
}

addProductButton.addEventListener('click', () => {
  modalTitle.textContent = 'Add Product';
  showModal();
});

closeModal.addEventListener('click', hideModal);
window.addEventListener('click', (event) => {
  if (event.target == productModal) {
    hideModal();
  }
});

// Función para renderizar la barra de búsqueda
function renderSearchBar() {
    const searchBarContainer = document.getElementById('search-bar-container');
    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.id = 'search-bar';
    searchBar.placeholder = 'Search products...';
    searchBar.addEventListener('input', handleSearchInput);
    searchBarContainer.appendChild(searchBar);
}

// Función para inicializar la página
async function init() {
    const products = await fetchProducts();
    displayProducts(products);
}

// Llamar a init cuando la página se carga
window.onload = init;

// Función para manejar el evento de entrada de la barra de búsqueda
async function handleSearchInput(event) {
    const searchTerm = event.target.value;
    console.log(`Search term: ${searchTerm}`); // Log the search term

    const products = await fetchProducts();
    console.log(`Fetched products: ${JSON.stringify(products)}`); // Log the fetched products

    const filteredProducts = searchTerm ? products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) : products;
    console.log(`Filtered products: ${JSON.stringify(filteredProducts)}`); // Log the filtered products

    displayProducts(filteredProducts);
}

// Llamar a renderSearchBar en el evento DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    renderSearchBar();
});

// Función para renderizar las cartas
function displayProducts(productsData) {
  cardsContainer.innerHTML = '';

  productsData.forEach(productData => {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const tag = document.createElement('span');
    tag.classList.add('tag', `tag-${productData.tag}`);
    tag.textContent = productData.tag;

    const title = document.createElement('h4');
    title.textContent = productData.title;

    const cardImage = document.createElement('img');
    cardImage.src = productData.image;
    cardImage.alt = productData.title;

    const description = document.createElement('p');
    description.textContent = productData.description;

    const price = document.createElement('p');
    price.innerHTML = '<b>Price: </b>$' + productData.price;

    const quantity = document.createElement('p');
    quantity.innerHTML = '<b>Quantity: </b>' + productData.quantity;

    const addToCartBtn = document.createElement('button');
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.addEventListener('click', () => addToCart(productData));

    card.appendChild(cardHeader);
    cardHeader.appendChild(cardImage);
    cardBody.appendChild(tag);
    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(price);
    cardBody.appendChild(quantity);
    cardBody.appendChild(addToCartBtn);
    card.appendChild(cardBody);

    if (isAdmin) {
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.classList.add('edit-button');
      editButton.addEventListener('click', () => editProduct(productData));

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('delete-button');
      deleteButton.addEventListener('click', () => deleteProduct(productData.id));

      cardBody.appendChild(editButton);
      cardBody.appendChild(deleteButton);
    }

    cardsContainer.appendChild(card);
  });
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const index = cart.findIndex(item => item.id === product.id);

  if (index > -1) {
    cart[index].quantity++;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Product added to cart');
}

// Función para obtener productos
async function fetchProducts() {
    try {
        const response = await fetch(`${baseURL}/api/products`);
        if (response.ok) {
            const products = await response.json();
            return products;
        } else {
            console.error('Error al obtener los productos:', response.statusText);
        }
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
}

// Función para manejar el evento de entrada de la barra de búsqueda
async function handleSearchInput(event) {
    const searchTerm = event.target.value;
    const products = await fetchProducts();
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayProducts(filteredProducts);
}

// Redirigir a la página de inicio de sesión cuando se hace clic en el icono de inicio de sesión
document.getElementById('login-button').addEventListener('click', () => {
  window.location.href = 'pages/login.html';
});

// Redirigir a la página del carrito cuando se hace clic en la imagen del carrito
document.getElementById('cart-button').addEventListener('click', () => {
  window.location.href = 'cart.html';
});

// Obtener y mostrar productos al cargar la página
window.addEventListener('DOMContentLoaded', fetchProducts);

axios.get(`${baseURL}/api/whos_logged`)
  .then(response => {
    if (response.data.isSomebodyLogged) {
      document.getElementById('logout-button').style.display = 'block';
      document.getElementById('login-button').style.display = 'none';
    } else {
      document.getElementById('logout-button').style.display = 'none';
        document.getElementById('login-button').style.display = 'block';
    }

    if (response.data.isAdmin) {
      document.getElementById('cart-button').style.display = 'none';
      document.getElementById('add-product-button').style.display = 'block';
      isAdmin = true;
    } else {
      document.getElementById('cart-button').style.display = 'block';
      document.getElementById('add-product-button').style.display = 'none';
      isAdmin = false;
    }
  })
  .catch(error => console.error(error));

// Función para manejar el formulario de producto
productForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const productData = {
    title: productForm.title.value,
    description: productForm.description.value,
    price: productForm.price.value,
    quantity: productForm.quantity.value,
    tag: productForm.tag.value,
    image: productForm.image.value,
  };

  try {
    let response;
    if (editProductId) {
      response = await axios.put(`${baseURL}/api/products/${editProductId}`, productData);
    } else {
      response = await axios.post(`${baseURL}/api/products`, productData);
    }

    if (response.status === 201 || response.status === 200) {
      hideModal();
      fetchProducts();
    }
  } catch (error) {
    console.error('Error al guardar el producto:', error);
  }
});

function editProduct(productData) {
  modalTitle.textContent = 'Edit Product';
  productForm.title.value = productData.title;
  productForm.description.value = productData.description;
  productForm.price.value = productData.price;
  productForm.quantity.value = productData.quantity;
  productForm.tag.value = productData.tag;
  productForm.image.value = productData.image;
  editProductId = productData.id;
  showModal();
}

async function deleteProduct(productId) {
  try {
    const response = await axios.delete(`${baseURL}/api/products/${productId}`);
    if (response.status === 200) {
      fetchProducts();
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
  }
}