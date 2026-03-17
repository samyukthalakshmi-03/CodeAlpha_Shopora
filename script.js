// Global Products Array
let products = [];

// API Base URL
const API_BASE = 'http://localhost:3000';

// Fetch products from server
async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    showToast('Failed to load products. Please refresh the page.', 'error');
    return [];
  }
}

// Cart Helper Functions using backend API
async function getCart() {
  try {
    const response = await fetch(`${API_BASE}/cart`);
    if (!response.ok) throw new Error('Failed to fetch cart');
    return await response.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
}

async function addToCartAPI(product) {
  try {
    const response = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return await response.json();
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

async function removeFromCartAPI(id) {
  try {
    const response = await fetch(`${API_BASE}/cart/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to remove from cart');
    return await response.json();
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

async function clearCartAPI() {
  try {
    const response = await fetch(`${API_BASE}/cart`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to clear cart');
    return await response.json();
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}

// Helper to update cart count globally
async function updateCartCount() {
  try {
    const items = await getCart();
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
      cartCountEl.innerText = items.length > 0 ? `(${items.length})` : '';
    }
  } catch (error) {
    console.error('Error updating cart count:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await updateCartCount();

  // --------------------
  // Home Page: Load Products
  // --------------------
  const productsContainer = document.getElementById("products");
  if (productsContainer) {
    try {
      await fetchProducts();
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
    } catch (error) {
      productsContainer.innerHTML = '<p style="text-align:center; width:100%;">Failed to load products.</p>';
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
      try {
        await fetchProducts();
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
      } catch (error) {
        productDetailContainer.innerHTML = '<p style="text-align:center;">Failed to load product details.</p>';
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
    try {
      const items = await getCart();
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
    } catch (error) {
      cartContainer.innerHTML = '<p style="text-align:center; color: var(--text-muted);">Failed to load cart.</p>';
    }
  }

  // --------------------
  // Auth Pages
  // --------------------
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch(`${API_BASE}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          showToast("Login Successful!", "success");
          localStorage.setItem('user', JSON.stringify({ email }));
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1000);
        } else {
          showToast("Invalid credentials", "error");
        }
      } catch (error) {
        console.error('Login error:', error);
        showToast("Login failed. Please try again.", "error");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch(`${API_BASE}/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
          showToast("Registration Successful! Please login.", "success");
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 1500);
        } else {
          const data = await response.json();
          showToast(data.message || "Registration failed", "error");
        }
      } catch (error) {
        console.error('Registration error:', error);
        showToast("Registration failed. Please try again.", "error");
      }
    });
  }
});

// --------------------
// Global Actions
// --------------------
window.addToCart = async function (id) {
  console.log("Adding product to cart:", id);
  const product = products.find(p => p.id == id);
  if (!product) {
    showToast("Error adding product! Product not found.", "error");
    return;
  }

  try {
    await addToCartAPI(product);
    showToast(`${product.name} added to cart!`, "success");
    await updateCartCount();
  } catch (error) {
    showToast("Failed to add product to cart.", "error");
  }
}

window.removeFromCart = async function (id) {
  try {
    await removeFromCartAPI(id);
    showToast("Item removed from cart.");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (error) {
    showToast("Could not remove item.", "error");
  }
}

window.placeOrder = async function () {
  try {
    const cart = await getCart();
    if (cart.length === 0) {
      showToast("Cart is empty!", "error");
      return;
    }

    await clearCartAPI();
    showToast("Order placed successfully!", "success");
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  } catch (error) {
    showToast("Failed to place order.", "error");
  }
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