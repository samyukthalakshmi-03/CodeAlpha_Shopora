// Hardcoded Products Array
const products = [
  {
    "id": 1,
    "name": "Premium Wireless Headphones",
    "price": 12000,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop"
  },
  {
    "id": 2,
    "name": "Titanium Smart Watch",
    "price": 25000,
    "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop"
  },
  {
    "id": 3,
    "name": "Urban Running Sneakers",
    "price": 8500,
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop"
  },
  {
    "id": 4,
    "name": "Pro DSLR Camera",
    "price": 145000,
    "image": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop"
  },
  {
    "id": 5,
    "name": "Vintage Leather Backpack",
    "price": 9500,
    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop"
  },
  {
    "id": 6,
    "name": "Classic Designer Sunglasses",
    "price": 4200,
    "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=400&fit=crop"
  }
];

// LocalStorage Helper Functions
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Helper to update cart count globally
function updateCartCount() {
  const items = getCart();
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) {
    cartCountEl.innerText = items.length > 0 ? `(${items.length})` : '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  // --------------------
  // Home Page: Load Products
  // --------------------
  const productsContainer = document.getElementById("products");
  if (productsContainer) {
    productsContainer.innerHTML = '';
    if (products.length === 0) {
      productsContainer.innerHTML = '<p style="text-align:center; width:100%;">No products available.</p>';
    } else {
      products.forEach(p => {
        productsContainer.innerHTML += `
          <div class="product">
            <div class="product-img-wrapper">
              <img src="${p.image}" alt="${p.name}">
            </div>
            <div class="product-info">
              <h3>${p.name}</h3>
              <p>₹${p.price.toLocaleString()}</p>
              <div class="buttons">
                <a href="product.html?id=${p.id}" class="btn-secondary">Details</a>
                <button type="button" onclick="addToCart(${p.id})" class="btn-secondary active">Add to Cart</button>
              </div>
            </div>
          </div>
        `;
      });
    }
  }

  // --------------------
  // Product Details Page
  // --------------------
  const productDetailContainer = document.getElementById("product-detail");
  if (productDetailContainer) {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (productId) {
      const product = products.find(p => p.id == productId);

      if (!product) {
        productDetailContainer.innerHTML = `<p style="text-align:center;">Product not found.</p>`;
      } else {
        productDetailContainer.innerHTML = `
          <div class="product-detail-wrapper">
            <div class="product-detail-image">
              <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-detail-info">
              <h2>${product.name}</h2>
              <div class="price">₹${product.price.toLocaleString()}</div>
              <p style="color: var(--text-muted); margin-bottom: 2rem; line-height: 1.8;">
                Experience premium quality with our ${product.name}. Crafted for excellence and designed to elevate your everyday lifestyle. Uncompromising performance meets stunning aesthetics.
              </p>
              <button onclick="addToCart(${product.id})" class="btn-primary" style="width: 100%;">Add to Cart</button>
            </div>
          </div>
        `;
      }
    } else {
      productDetailContainer.innerHTML = '<p style="text-align:center;">Product not found.</p>';
    }
  }

  // --------------------
  // Load Cart Items
  // --------------------
  const cartContainer = document.getElementById("cart");
  if (cartContainer) {
    const items = getCart();
    cartContainer.innerHTML = '';
    if (items.length === 0) {
      cartContainer.innerHTML = '<p style="text-align:center; color: var(--text-muted);">Your cart is empty.</p>';
    } else {
      let total = 0;
      items.forEach((item, index) => {
        total += item.price;
        cartContainer.innerHTML += `
          <div class="cart-item">
            <div class="cart-item-info">
              <h3>${item.name}</h3>
              <p style="color: var(--text-muted); font-size: 0.9rem;">Item Info</p>
            </div>
            <div class="cart-item-price" style="display: flex; align-items: center; gap: 1rem;">
               <span>₹${item.price.toLocaleString()}</span>
               <button onclick="removeFromCart(${item.id})" style="background:transparent; border:none; color:#ef4444; font-size: 1.2rem; cursor:pointer;" title="Remove Item">&times;</button>
            </div>
          </div>
        `;
      });

      const cartTotalContainer = document.getElementById("cart-total");
      const totalPriceEl = document.getElementById("totalPrice");
      if (cartTotalContainer && totalPriceEl) {
        cartTotalContainer.style.display = 'block';
        totalPriceEl.innerText = `₹${total.toLocaleString()}`;
      }
    }
  }

  // --------------------
  // Auth Pages
  // --------------------
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Mock Login
      if (email && password) {
        showToast("Login Successful!", "success");
        localStorage.setItem('user', JSON.stringify({ email }));
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      } else {
        showToast("Invalid credentials", "error");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Mock Registration
      if (name && email && password) {
        showToast("Registration Successful! Please login.", "success");
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      } else {
        showToast("Registration failed. Please fill all fields.", "error");
      }
    });
  }
});

// --------------------
// Global Actions
// --------------------
window.addToCart = function (id) {
  console.log("Adding product to cart:", id);
  const product = products.find(p => p.id == id);
  if (!product) {
    showToast("Error adding product! Product not found.", "error");
    return;
  }

  const cart = getCart();
  cart.push(product);
  saveCart(cart);

  showToast(`${product.name} added to cart!`, "success");
  updateCartCount();
}

window.removeFromCart = function (id) {
  const cart = getCart();
  const index = cart.findIndex(item => item.id == id);
  if (index !== -1) {
    cart.splice(index, 1);
    saveCart(cart);
    showToast("Item removed from cart.");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } else {
    showToast("Could not remove item.", "error");
  }
}

window.placeOrder = function () {
  const cart = getCart();
  if (cart.length === 0) {
    showToast("Cart is empty!", "error");
    return;
  }

  saveCart([]); // Clear cart
  showToast("Order placed successfully!", "success");
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}

// Global Toast Notification Logic
function showToast(message, type = "info") {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  // Remove the toast element from DOM after the animation completes (3.3s total)
  setTimeout(() => {
    toast.remove();
    if (container.children.length === 0) {
      container.remove();
    }
  }, 3300);
}