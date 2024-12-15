const shoppingListModal = document.getElementById('shoppingListModal');
const shoppingList = document.getElementById('shoppingList');
const openModalIcon = document.getElementById('openModal');
const itemAddedToast = document.getElementById('itemAddedToast');
const toastBootstrap = new bootstrap.Toast(itemAddedToast);

// Function to add an item to the shopping list
function addToShoppingList(cardTitle) {
  const listItem = document.createElement('li');
  listItem.classList.add('list-group-item', 'd-flex', 'justify-content-around', 'align-items-center');

  listItem.textContent = cardTitle;

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = function() {
    shoppingList.removeChild(listItem); 
  };

  listItem.appendChild(deleteButton);
  shoppingList.appendChild(listItem);
  toastBootstrap.show();
}

function setupCardClickListeners() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const cardTitle = card.querySelector('.card-title').textContent;
    card.addEventListener('click', () => {
      addToShoppingList(cardTitle); 
    });
  });
}

openModalIcon.addEventListener('click', () => {
  const modal = new bootstrap.Modal(shoppingListModal);
  modal.show(); 
});


document.addEventListener('DOMContentLoaded', setupCardClickListeners);