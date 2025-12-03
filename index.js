/* ==============================================
   AR WATCHES | COMPLETE JAVASCRIPT FILE (UPDATED + LOCALSTORAGE)
   ============================================== */

// ✅ Product Data (SINGLE SOURCE OF TRUTH)
const products = [
  // Our Products
  { name: "Classic Elegance", price: "$250", color: "Classic Dark Brown and Silver", image: "watch1.jpg", category: "product" },
  { name: "Sport Edition", price: "$320", color: "Leather Brown and Black", image: "watch2.jpg", category: "product" },
  { name: "Minimal Silver", price: "$280", color: "Elegant Black and Brown", image: "watch3.jpg", category: "product" },
  { name: "Rolex Dark", price: "$540", color: "Royal Gold", image: "watch4.jpg", category: "product" },
  
  // New Arrivals (Collection)
  { name: "Rolex Prestige 2025", price: "$1,200", color: "Vintage Brown and Silver", image: "rolex.jpg", category: "collection" },
  { name: "Omega Seamaster 2025", price: "$1,050", color: "Classic Brown", image: "omega.jpg", category: "collection" },
  { name: "Rado HyperChrome", price: "$890", color: "Ceramic Black and Brown", image: "rado.jpg", category: "collection" }
];

// ✅ Global Cart Array (will be replaced by LocalStorage on startup)
const cart = [];

// Selectors  
const toggleBtn = document.getElementById('theme-toggle');
const homeSection = document.getElementById('home');
const contactForm = document.querySelector("form");
const hamburger = document.getElementById("hamburger");
const navMenu = document.querySelector("nav ul");

// Quick View Modal  
const modal = document.getElementById("quick-view-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalColor = document.getElementById("modal-color");
const closeBtn = document.querySelector(".close-btn");

// Cart Modal  
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartClose = document.querySelector(".cart-close");
const orderBtn = document.getElementById("order-btn");

// Navbar Cart Icon  
const navCartBtn = document.getElementById("nav-cart-btn");
const cartBadge = document.getElementById("cart-badge");

// Search  
const searchBar = document.querySelector(".search-bar");
const searchModal = document.getElementById("search-modal");
const searchContent = document.querySelector("#search-modal .search-content");
const searchResultsContainer = document.getElementById("search-results-container");
const closeSearch = document.querySelector("#search-modal .search-close");

/* ==============================================
   THEME, ANIMATIONS, AND PRODUCT LOAD
   ============================================== */

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  if (document.body.classList.contains('light-mode')) {
    toggleBtn.textContent = '🌙';
    homeSection.style.background = "url('luxury2.jpg') center/cover no-repeat";
  } else {
    toggleBtn.textContent = '☀️';
    homeSection.style.background = "url('luxury.jpg') center/cover no-repeat";
  }
});

document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.2 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

function loadProducts() {
  const productGrid = document.querySelector("#products .product-grid");
  const collectionGrid = document.querySelector("#collection .collection-grid");

  productGrid.innerHTML = "";
  collectionGrid.innerHTML = "";

  products.forEach(product => {
    const html = `
      <div class="${product.category === 'product' ? 'product-card' : 'collection-item'}">
        <img src="${product.image}" alt="${product.name}">
        <h4>${product.name}</h4>
        <p>${product.price}</p>
        <button class="add-to-cart">Add to Cart</button>
        <button class="view-details">View Details</button>
      </div>
    `;

    if (product.category === "product") productGrid.innerHTML += html;
    else collectionGrid.innerHTML += html;
  });
}

/* ==============================================
   CART FUNCTIONS
   ============================================== */

function updateCartBadge() {
  const totalItems = cart.reduce((t, i) => t + i.qty, 0);

  if (totalItems > 0) {
    cartBadge.textContent = totalItems;
    cartBadge.classList.add("visible");
  } else {
    cartBadge.textContent = "0";
    cartBadge.classList.remove("visible");
  }
}

function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("cart-item");

      div.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>${item.price}</p>
          <p>Color: ${item.color}</p>
        </div>
        <div class="cart-actions">
          <input type="number" class="cart-qty" min="1" value="${item.qty}" data-index="${index}">
          <i class="fas fa-trash remove-item" data-index="${index}" style="cursor:pointer;color:#C5A572;"></i>
        </div>
      `;

      cartItemsContainer.appendChild(div);
    });

    // Remove Item
    document.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", e => {
        cart.splice(e.target.dataset.index, 1);
        saveCartToStorage();
        renderCart();
      });
    });

    // Update Qty
    document.querySelectorAll(".cart-qty").forEach(input => {
      input.addEventListener("change", e => {
        cart[e.target.dataset.index].qty = parseInt(e.target.value);
        saveCartToStorage();
        updateCartBadge();
      });
    });
  }

  updateCartBadge();
}

/* ==============================================
   SEARCH RESULT LOGIC
   ============================================== */

function showSearchResults(results) {
  searchResultsContainer.innerHTML = "";

  if (results.length === 0) {
    alert("No matching product found.");
    return;
  }

  results.forEach(product => {
    searchResultsContainer.innerHTML += `
      <div class="search-result-card">
        <img src="${product.image}" alt="${product.name}">
        <div class="search-result-card-info">
          <h4>${product.name}</h4>
          <p>${product.price}</p>
          <p>Color: ${product.color}</p>
        </div>
        <button class="search-add-cart" data-name="${product.name}">
          <i class="fas fa-cart-plus"></i>
        </button>
      </div>
    `;
  });

  searchModal.style.display = "flex";
}

/* ==============================================
   EVENT LISTENERS
   ============================================== */

window.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadCartFromStorage();   // <-- Load saved cart
  renderCart();
  updateCartBadge();
});

document.body.addEventListener("click", e => {
  // View Details
  if (e.target.classList.contains("view-details")) {
    const card = e.target.closest(".product-card, .collection-item");
    const product = products.find(p => p.name === card.querySelector("h4").textContent);

    modalImg.src = product.image;
    modalTitle.textContent = product.name;
    modalPrice.textContent = "Price: " + product.price;
    modalColor.textContent = "Color: " + product.color;

    modal.style.display = "flex";
  }

  // Add to Cart
  if (e.target.classList.contains("add-to-cart")) {
    const card = e.target.closest(".product-card, .collection-item");
    const product = products.find(p => p.name === card.querySelector("h4").textContent);

    const existing = cart.find(i => i.name === product.name);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        img: product.image,
        name: product.name,
        price: product.price,
        color: product.color,
        qty: 1
      });
    }

    saveCartToStorage(); // <-- Save
    renderCart();
    updateCartBadge();
    cartModal.style.display = "flex";
  }
});

// Close modals
closeBtn.addEventListener("click", () => modal.style.display = "none");
cartClose.addEventListener("click", () => cartModal.style.display = "none");
closeSearch.addEventListener("click", () => searchModal.style.display = "none");

window.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
  if (e.target === cartModal) cartModal.style.display = "none";
  if (e.target === searchModal) searchModal.style.display = "none";
});

// Navbar Cart
navCartBtn.addEventListener("click", () => {
  cartModal.style.display = "flex";
  renderCart();
});

// Order Now
orderBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert("Thank you! Your order was placed.");
  cart.length = 0;

  saveCartToStorage();
  renderCart();
  cartModal.style.display = "none";
});

// Search
searchBar.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    const q = searchBar.value.trim().toLowerCase();
    if (!q) return;

    const matches = products.filter(p => p.name.toLowerCase().includes(q));
    showSearchResults(matches);
  }
});

// Search Add to Cart
searchContent.addEventListener("click", e => {
  if (e.target.closest(".search-add-cart")) {
    const name = e.target.closest(".search-add-cart").dataset.name;
    const product = products.find(p => p.name === name);

    const existing = cart.find(i => i.name === name);

    if (existing) existing.qty += 1;
    else cart.push({ img: product.image, name: product.name, price: product.price, color: product.color, qty: 1 });

    saveCartToStorage();
    renderCart();
    updateCartBadge();

    searchModal.style.display = "none";
    cartModal.style.display = "flex";
  }
});

// Contact Form
contactForm.addEventListener("submit", e => {
  e.preventDefault();
  alert("Thank you! Your message has been sent.");
  contactForm.reset();
});

// Hamburger Menu
hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

/* ==============================================
   LOCAL STORAGE (FINAL)
   ============================================== */

function saveCartToStorage() {
  localStorage.setItem("arWatchCart", JSON.stringify(cart));
}

function loadCartFromStorage() {
  const saved = localStorage.getItem("arWatchCart");
  if (!saved) return;

  const parsed = JSON.parse(saved);
  cart.length = 0;
  parsed.forEach(item => cart.push(item));
}
