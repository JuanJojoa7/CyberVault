function displayCart() {
    const cartContainer = document.getElementById('cart-container');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty</p>';
        return;
    }

    cart.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('card');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const title = document.createElement('h4');
        title.textContent = product.title;

        const price = document.createElement('p');
        price.innerHTML = '<b>Price: </b>$' + product.price;

        const quantity = document.createElement('p');
        quantity.innerHTML = '<b>Quantity: </b>' + product.quantity;

        const removeFromCartBtn = document.createElement('button');
        removeFromCartBtn.textContent = 'Remove from Cart';
        removeFromCartBtn.addEventListener('click', () => removeFromCart(product.id));

        cardBody.appendChild(title);
        cardBody.appendChild(price);
        cardBody.appendChild(quantity);
        cardBody.appendChild(removeFromCartBtn);
        card.appendChild(cardBody);

        cartContainer.appendChild(card);
    });
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(product => product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length > 0) {
        alert('Purchase successful');
        localStorage.removeItem('cart');
        displayCart();
    } else {
        alert('Your cart is empty');
    }
}

document.getElementById('checkout-button').addEventListener('click', checkout);

window.addEventListener('DOMContentLoaded', displayCart);
