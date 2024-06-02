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


function generateReceipt(cart) {
    let receipt = {
        date: new Date().toLocaleString(),
        items: [],
        total: 0
    };

    cart.forEach(product => {
        const itemTotal = product.price * product.quantity;
        receipt.items.push({
            title: product.title,
            price: product.price,
            quantity: product.quantity,
            itemTotal: itemTotal.toFixed(2)
        });
        receipt.total += itemTotal;
    });

    receipt.total = receipt.total.toFixed(2);

    return receipt;
}

function formatReceiptHTML(receipt) {
    let receiptHTML = `<h2>Receipt</h2><p>Date: ${receipt.date}</p><ul>`;

    receipt.items.forEach(item => {
        receiptHTML += `<li>${item.title} - $${item.price} x ${item.quantity} = $${item.itemTotal}</li>`;
    });

    receiptHTML += `</ul><p><b>Total: $${receipt.total}</b></p>`;
    return receiptHTML;
}

function displayReceipt(receiptHTML, callback) {
    console.log('Displaying receipt container...'); // Debugging

    // Check if the receipt modal already exists
    if (document.getElementById('receipt-container')) {
        console.log('Receipt modal already exists'); // Debugging
        return;
    }

    console.log("Receipt: " + receiptHTML);

    // Create the modal
    const receiptModal = document.createElement('div');
    receiptModal.id = 'receipt-container';
    receiptModal.innerHTML = `
        <div class="container">
            <div class="container-content">
                ${receiptHTML}
                <button id="confirm-button">Confirm Purchase</button>
                <button id="cancel-button">Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(receiptModal);
    console.log('Receipt container appended to body'); // Debugging
    console.log("YES")

    document.getElementById('confirm-button').addEventListener('click', () => {
        console.log('Confirm button clicked'); // Debugging
        document.body.removeChild(receiptModal);
        callback(true);
    });

    document.getElementById('cancel-button').addEventListener('click', () => {
        console.log('Cancel button clicked'); // Debugging
        document.body.removeChild(receiptModal);
        callback(false);
    });
}

function saveReceiptToHistory(receipt) {
    let history = JSON.parse(localStorage.getItem('receiptHistory')) || [];
    history.push(receipt);
    localStorage.setItem('receiptHistory', JSON.stringify(history));
    console.log('Receipt saved to history'); // Debugging
}

function checkout() {
    console.log('Checkout button clicked'); // Debugging
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log("Cart " + cart);

    if (cart.length > 0) {
        const receipt = generateReceipt(cart);
        const receiptHTML = formatReceiptHTML(receipt);
        console.log("Y")
        console.log(receiptHTML)
        displayReceipt(receiptHTML, (confirmed) => {
            console.log("PASSED")
            if (confirmed) {
                saveReceiptToHistory(receipt);
                alert('Purchase successful');
                localStorage.removeItem('cart');
                displayCart();
            } else {
                alert('Purchase cancelled');
            }
        });
    } else {
        alert('Your cart is empty');
    }
}

document.getElementById('checkout-button').addEventListener('click', checkout);

window.addEventListener('DOMContentLoaded', displayCart);
