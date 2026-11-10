const STORAGE_KEY = "inventario-productos";
const initialProducts = [
  { id: "computador", name: "Computador", quantity: 10 },
  { id: "mouse", name: "Mouse", quantity: 20 },
];

const form = document.querySelector("#product-form");
const nameInput = document.querySelector("#product-name");
const quantityInput = document.querySelector("#product-quantity");
const productList = document.querySelector("#product-list");
const productCount = document.querySelector("#product-count");
const emptyState = document.querySelector("#empty-state");
const formMessage = document.querySelector("#form-message");

function loadProducts() {
  try {
    const savedProducts = localStorage.getItem(STORAGE_KEY);
    return savedProducts === null ? initialProducts : JSON.parse(savedProducts);
  } catch {
    return initialProducts;
  }
}

let products = loadProducts();

function saveProducts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return true;
  } catch {
    formMessage.textContent = "No se pudo guardar en este navegador.";
    return false;
  }
}

function renderProducts() {
  productList.replaceChildren();

  for (const product of products) {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const quantityCell = document.createElement("td");
    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");

    nameCell.textContent = product.name;
    quantityCell.textContent = product.quantity;
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Eliminar";
    deleteButton.setAttribute("aria-label", `Eliminar ${product.name}`);
    deleteButton.addEventListener("click", () => {
      products = products.filter((item) => item.id !== product.id);
      saveProducts();
      renderProducts();
    });

    actionCell.append(deleteButton);
    row.append(nameCell, quantityCell, actionCell);
    productList.append(row);
  }

  const totalUnits = products.reduce((total, product) => total + product.quantity, 0);
  productCount.textContent = `${products.length} productos · ${totalUnits} unidades`;
  emptyState.hidden = products.length > 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const quantity = Number(quantityInput.value);

  if (!name || !Number.isInteger(quantity) || quantity < 1) {
    formMessage.textContent = "Escribe un nombre y una cantidad entera mayor que cero.";
    return;
  }

  products.push({ id: `${Date.now()}-${Math.random()}`, name, quantity });
  saveProducts();
  renderProducts();
  form.reset();
  formMessage.textContent = "Producto agregado al inventario.";
  nameInput.focus();
});

renderProducts();
