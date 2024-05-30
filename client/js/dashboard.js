const baseURL = 'http://localhost:3000';

// Obtener una referencia al contenedor de cartas
const cardsContainer = document.getElementById('cards-container');

// Función para renderizar las cartas
function displayProducts(productsData) {
  const cardsContainer = document.getElementById('cards-container');
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
      displayProducts(products);
    } else {
      console.error('Error al obtener los productos:', response.statusText);
    }
  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
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
    console.log(response);
    if (response.data.isSomebodyLogged) {
      document.getElementById('logout-button').style.display = 'block';
    } else {
      document.getElementById('logout-button').style.display = 'none';
    }

    if (response.data.isAdmin) {
      document.getElementById('cart-button').style.display = 'none';
    } else {
      document.getElementById('cart-button').style.display = 'block';
    }
  })
  .catch(error => console.error(error));
