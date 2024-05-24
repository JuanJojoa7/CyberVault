// Obtener una referencia al contenedor de cartas
const cardsContainer = document.getElementById('cards-container');

// Función para renderizar las cartas
function displayProducts(productsData) {
    // Obtener una referencia al contenedor de cartas
    const cardsContainer = document.getElementById('cards-container');

    // Limpiar el contenedor antes de agregar nuevas cartas
    cardsContainer.innerHTML = '';

    // Iterar sobre los datos de los productos y crear una carta para cada uno
    productsData.forEach(productData => {
        // Crear elementos HTML para la carta
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
        price.innerHTML = '<b> Price: </b>$'+ productData.price;

        const quantity = document.createElement('p');
        quantity.innerHTML = '<b>Quantity: </b>' + productData.quantity;


        const user = document.createElement('div');
        user.classList.add('user');

        // const userImage = document.createElement('img');
        // userImage.src = productData.user.image;
        // userImage.alt = productData.user.name;

        const userInfo = document.createElement('div');
        userInfo.classList.add('user-info');

        const userName = document.createElement('h5');
        userName.textContent = productData.user.name;

        const userTime = document.createElement('small');
        userTime.textContent = productData.user.time;

        // Agregar elementos a la estructura de la carta
        card.appendChild(cardHeader);
        cardBody.appendChild(tag);
        cardBody.appendChild(title);
        cardHeader.appendChild(cardImage); // Add image
        cardBody.appendChild(description);
        cardBody.appendChild(price); // Add price
        cardBody.appendChild(quantity); // Add quantity
        userInfo.appendChild(userName);
        userInfo.appendChild(userTime);
        // user.appendChild(userImage);
        user.appendChild(userInfo);
        cardBody.appendChild(user);
        card.appendChild(cardBody);

        // Agregar la carta al contenedor
        cardsContainer.appendChild(card);
    });
}


// Función para obtener productos
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products'); // Cambiado a la ruta del servidor Express
        
        console.log(response);
        
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
