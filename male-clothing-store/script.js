// Product Data
const products = [
    {
        id: 1,
        name: 'Classic White T-Shirt',
        category: 't-shirts',
        price: 29.99,
        image: '👕',
        description: 'Premium cotton t-shirt, perfect for casual wear',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        rating: 4.5
    },
    {
        id: 2,
        name: 'Oxford Blue Shirt',
        category: 'shirts',
        price: 59.99,
        image: '👔',
        description: 'Formal shirt ideal for office and formal occasions',
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.8
    },
    {
        id: 3,
        name: 'Black Denim Jeans',
        category: 'trousers',
        price: 79.99,
        image: '👖',
        description: 'Comfortable and stylish denim jeans',
        sizes: ['28', '30', '32', '34', '36', '38'],
        rating: 4.6
    },
    {
        id: 4,
        name: 'Casual Blazer',
        category: 'jackets',
        price: 129.99,
        image: '🧥',
        description: 'Sophisticated blazer for smart casual looks',
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.7
    },
    {
        id: 5,
        name: 'Striped Polo Shirt',
        category: 't-shirts',
        price: 39.99,
        image: '👕',
        description: 'Comfortable polo shirt with classic stripes',
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.4
    },
    {
        id: 6,
        name: 'Formal White Shirt',
        category: 'shirts',
        price: 69.99,
        image: '👔',
        description: 'Premium formal shirt for business and formal events',
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.9
    },
    {
        id: 7,
        name: 'Chinos Khaki',
        category: 'trousers',
        price: 59.99,
        image: '👖',
        description: 'Versatile khaki chinos for smart casual styling',
        sizes: ['28', '30', '32', '34', '36'],
        rating: 4.5
    },
    {
        id: 8,
        name: 'Winter Jacket',
        category: 'jackets',
        price: 149.99,
        image: '🧥',
        description: 'Warm and stylish winter jacket',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        rating: 4.8
    }
];

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Add to cart
function addToCart(productId, size) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (!size) {
        alert('Please select a size');
        return;
    }

    const cartItem = {
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        size: size,
        quantity: 1
    };

    const existingItem = cart.find(item => item.id === productId && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} (Size: ${size}) added to cart!`);
}

// Remove from cart
function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// Update quantity
function updateQuantity(productId, size, quantity) {
    const item = cart.find(item => item.id === productId && item.size === size);
    if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
            removeFromCart(productId, size);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
        }
    }
}

// Calculate totals
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
}

// Format price
function formatPrice(price) {
    return '$' + price.toFixed(2);
}

// Render products
function renderProducts(productsToRender = products) {
    const container = document.getElementById('products-grid') || document.getElementById('featured-products');
    
    if (!container) return;

    container.innerHTML = productsToRender.map(product => `
        <div class="product-card">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${formatPrice(product.price)}</div>
                <div class="product-rating">
                    ${'⭐'.repeat(Math.floor(product.rating))} ${product.rating}
                </div>
                <div class="product-sizes">
                    ${product.sizes.map(size => `
                        <button class="size-option" data-product-id="${product.id}" data-size="${size}">
                            ${size}
                        </button>
                    `).join('')}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');

    // Event listeners for size selection
    document.querySelectorAll('.size-option').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll(`[data-product-id="${this.dataset.productId}"]`).forEach(b => {
                b.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });

    // Event listeners for add to cart
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            const selectedSize = document.querySelector(`.size-option[data-product-id="${productId}"].selected`);
            const size = selectedSize ? selectedSize.dataset.size : null;
            addToCart(productId, size);
        });
    });
}

// Display cart
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Start shopping to add items to your cart</p>
                <a href="product.html" class="btn btn-primary">Shop Now</a>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${item.image}</div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Size: ${item.size}</p>
                    <p>Price: ${formatPrice(item.price)}</p>
                </div>
                <div class="cart-item-actions">
                    <input 
                        type="number" 
                        class="quantity-input" 
                        value="${item.quantity}" 
                        min="1"
                        onchange="updateQuantity(${item.id}, '${item.size}', this.value)"
                    >
                    <button class="remove-btn" onclick="removeFromCart(${item.id}, '${item.size}')">
                        Remove
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
    const { subtotal, shipping, tax, total } = calculateTotals();

    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = formatPrice(shipping);
    if (taxEl) taxEl.textContent = formatPrice(tax);
    if (totalEl) totalEl.textContent = formatPrice(total);

    // Update checkout summary as well
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutShipping = document.getElementById('checkout-shipping');
    const checkoutTax = document.getElementById('checkout-tax');
    const checkoutTotal = document.getElementById('checkout-total');

    if (checkoutSubtotal) checkoutSubtotal.textContent = formatPrice(subtotal);
    if (checkoutShipping) checkoutShipping.textContent = formatPrice(shipping);
    if (checkoutTax) checkoutTax.textContent = formatPrice(tax);
    if (checkoutTotal) checkoutTotal.textContent = formatPrice(total);

    // Display checkout items
    const checkoutItemsContainer = document.getElementById('checkout-items');
    if (checkoutItemsContainer) {
        checkoutItemsContainer.innerHTML = cart.map(item => `
            <div class="summary-row">
                <span>${item.name} (${item.size}) x${item.quantity}</span>
                <span>${formatPrice(item.price * item.quantity)}</span>
            </div>
        `).join('');
    }
}

// Filter products
function filterProducts() {
    const categories = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    const maxPrice = parseInt(document.getElementById('price-range')?.value || 500);
    const sizes = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"]:checked'))
        .map(cb => cb.value);

    let filtered = products.filter(product => {
        const categoryMatch = categories.length === 0 || categories.includes(product.category);
        const priceMatch = product.price <= maxPrice;
        return categoryMatch && priceMatch;
    });

    renderProducts(filtered);
}

// Sort products
function sortProducts(sortBy) {
    let sorted = [...products];

    switch(sortBy) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            sorted.reverse();
            break;
        default:
            sorted = products;
    }

    renderProducts(sorted);
}

// Handle checkout form
function handleCheckout(e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Simulate processing
    alert('Order placed successfully! Order confirmation has been sent to your email.');
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Redirect to home
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Price range input
function updatePriceRange() {
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            priceValue.textContent = this.value;
            filterProducts();
        });
    }
}

// Clear filters
function clearFilters() {
    document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    document.getElementById('price-range').value = 500;
    document.getElementById('price-value').textContent = '500';
    renderProducts();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Render products on product page
    if (document.getElementById('products-grid')) {
        renderProducts();
    }

    // Render featured products on home page
    if (document.getElementById('featured-products')) {
        renderProducts(products.slice(0, 4));
    }

    // Display cart items
    if (document.getElementById('cart-items')) {
        displayCart();
    }

    // Filter functionality
    document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });

    // Sort functionality
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortProducts(e.target.value);
        });
    }

    // Price range
    updatePriceRange();

    // Clear filters button
    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
    }

    // Checkout form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    // Newsletter form
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for subscribing!');
            form.reset();
        });
    });
});