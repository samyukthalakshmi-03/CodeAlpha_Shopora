// Helper to update cart count globally
function updateCartCount() {
  fetch('/cart')
    .then(res => res.json())
    .then(items => {
      const cartCountEl = document.getElementById('cartCount');
      if (cartCountEl) {
        cartCountEl.innerText = items.length > 0 ? `(${items.length})` : '';
      }
    })
    .catch(err => console.error('Error fetching cart:', err));
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  // --------------------
  // Home Page: Load Products
  // --------------------
  const productsContainer = document.getElementById("products");
  if (productsContainer) {
    fetch('/products')
      .then(res => res.json())
      .then(data => {
        productsContainer.innerHTML = '';
        if (data.length === 0) {
          productsContainer.innerHTML = '<p style="text-align:center; width:100%;">No products available.</p>';
          return;
        }

        data.forEach(p => {
          productsContainer.innerHTML += `
            <div class="product">
              <div class="product-img-wrapper">
                <img src="${p.image}" alt="${p.name}">
              </div>
              <div class="product-info">
                <h3>${p.name}</h3>
                <p>₹${p.price.toLocaleString()}</p>
                <div class="buttons">
                  <a href="/product.html?id=${p.id}" class="btn-secondary">Details</a>
                  <button type="button" onclick="addToCart(${p.id})" class="btn-secondary active">Add to Cart</button>
                </div>
              </div>
            </div>
          `;
        });
      });
  }

  // --------------------
  // Product Details Page
  // --------------------
  const productDetailContainer = document.getElementById("product-detail");
  if (productDetailContainer) {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (productId) {
      fetch('/products/' + productId)
        .then(res => res.json())
        .then(product => {
          if (product.message) {
            productDetailContainer.innerHTML = `<p style="text-align:center;">${product.message}</p>`;
            return;
          }

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
        });
    } else {
      productDetailContainer.innerHTML = '<p style="text-align:center;">Product not found.</p>';
    }
  }

  // --------------------
  // Load Cart Items
  // --------------------
  const cartContainer = document.getElementById("cart");
  if (cartContainer) {
    fetch('/cart')
      .then(res => res.json())
      .then(items => {
        cartContainer.innerHTML = '';
        if (items.length === 0) {
          cartContainer.innerHTML = '<p style="text-align:center; color: var(--text-muted);">Your cart is empty.</p>';
          return;
        }

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
      });
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

      fetch('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      .then(res => res.json())
      .then(data => {
         if(data.message === "Login successful") {
            showToast("Login Successful!", "success");
            localStorage.setItem('user', JSON.stringify({email}));
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
         } else {
            showToast(data.message || "Invalid credentials", "error");
         }
      })
      .catch(err => {
         showToast("An error occurred during login.", "error");
         console.error(err);
      });
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      fetch('/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      .then(res => res.json())
      .then(data => {
        if(data.message === "User registered successfully") {
            showToast("Registration Successful! Please login.", "success");
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1500);
        } else {
            showToast(data.message || "Registration failed", "error");
        }
      })
      .catch(err => {
         showToast("An error occurred during registration.", "error");
         console.error(err);
      });
    });
  }
});

// --------------------
// Global Actions
// --------------------
window.addToCart = function(id) {
  console.log("Adding product to cart:", id);
  fetch('/products/' + id)
    .then(res => res.json())
    .then(product => {
      if (product.message) {
        showToast("Error adding product!", "error");
        return;
      }
      fetch('/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      })
      .then(res => res.json())
      .then(data => {
        showToast(`${product.name} added to cart!`, "success");
        updateCartCount();
      })
      .catch(err => {
         console.error('Error adding to cart:', err);
         showToast("Could not add to cart. Server error.", "error");
      });
    })
    .catch(err => {
       console.error('Error fetching product:', err);
    });
}

window.removeFromCart = function(id) {
  fetch('/cart/' + id, { method: 'DELETE' })
    .then(res => res.json())
    .then(data => {
       if (data.message === "Item removed from cart") {
           showToast("Item removed from cart.");
           setTimeout(() => {
                window.location.reload();
           }, 500);
       } else {
           showToast("Could not remove item.", "error");
       }
    })
    .catch(err => console.error('Error removing from cart:', err));
}

function placeOrder() {
  fetch('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date: new Date().toISOString() })
  })
  .then(res => res.json())
  .then(data => {
    if(data.message === "Order placed successfully") {
        fetch('/cart', { method: 'DELETE' })
        .then(() => {
           showToast("Order placed successfully!", "success");
           setTimeout(() => {
                window.location.href = '/';
           }, 1500);
        });
    }
  })
  .catch(err => console.error('Error placing order:', err));
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