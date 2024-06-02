function displayCartHistory() {
    console.log('displayCartHistory function called'); 

    const historyContainer = document.getElementById('history-container');
    if (!historyContainer) {
        console.error('History container not found');
        return;
    }

    const history = JSON.parse(localStorage.getItem('receiptHistory')) || [];
    console.log('History:', history); 

    if (history.length === 0) {
        historyContainer.innerHTML = '<p>No purchase history available.</p>';
        return;
    }

    historyContainer.innerHTML = '';

    history.forEach((receipt, index) => {
        const receiptElement = document.createElement('div');
        receiptElement.classList.add('receipt');

        let receiptHTML = `<h3>Receipt ${index + 1}</h3><p>Date: ${receipt.date}</p><ul>`;
        
        receipt.items.forEach(item => {
            receiptHTML += `<li>${item.title} - $${item.price} x ${item.quantity} = $${item.itemTotal}</li>`;
        });

        receiptHTML += `</ul><p><b>Total: $${receipt.total}</b></p>`;
        receiptElement.innerHTML = receiptHTML;

        historyContainer.appendChild(receiptElement);
    });
}

document.getElementById('view-history-button').addEventListener('click', displayCartHistory);
window.addEventListener('DOMContentLoaded', displayCartHistory);
