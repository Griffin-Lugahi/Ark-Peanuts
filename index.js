/* ── DARK MODE ── */
const THEME_KEY = 'arkpeanuts_theme';

function getPreferredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

applyTheme(getPreferredTheme());

document.getElementById('themeToggleBtn').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ── PRODUCT DATA (single source of truth for cards, modal, and cart) ── */
const products = [
  {
    id: 'cashewnut-butter',
    name: 'Cashewnut Butter',
    image: 'nuts/cashewnut Butter .png',
    badge: 'Best Seller',
    description: 'Smooth, small-batch roasted cashew butter with no added oils or sugar. A rich, creamy spread that\'s just as good on toast as it is by the spoonful.',
    rating: 4.9,
    reviewCount: 86,
    variants: [
      { label: '250g', price: 600 },
      { label: '500g', price: 1000 },
      { label: '1kg', price: 1800 }
    ],
    reviews: [
      { name: 'David M.', initials: 'DM', stars: 5, date: 'Verified Buyer · Mombasa', text: 'Smooth, rich, and no weird additives. Will reorder monthly.' },
      { name: 'Fatuma S.', initials: 'FS', stars: 5, date: 'Verified Buyer · Nairobi', text: 'Best cashew butter I\'ve tried in Kenya, tastes fresh every time.' },
      { name: 'Peter K.', initials: 'PK', stars: 4, date: 'Verified Buyer · Thika', text: 'Great flavour, wish the jar was a bit bigger for the price.' }
    ]
  },
  {
    id: 'roasted-peanuts',
    name: 'Roasted Peanuts',
    image: 'nuts/Roasted Peanuts .png',
    badge: 'Best Seller',
    description: 'Lightly salted, small-batch roasted peanuts with a satisfying crunch. No preservatives, no added oils, just the nut the way nature made it.',
    rating: 4.8,
    reviewCount: 142,
    variants: [
      { label: '220g', price: 150 },
      { label: '500g', price: 320 },
      { label: '1kg', price: 580 }
    ],
    reviews: [
      { name: 'Wanjiru K.', initials: 'WK', stars: 5, date: 'Verified Buyer · Nairobi', text: 'Tastes so fresh, like they were just harvested.' },
      { name: 'James N.', initials: 'JN', stars: 5, date: 'Verified Buyer · Nakuru', text: 'My go-to snack for the office now, perfectly roasted.' },
      { name: 'Grace W.', initials: 'GW', stars: 4, date: 'Verified Buyer · Kiambu', text: 'Good crunch and flavour, a little salty for my taste but still great.' }
    ]
  },
  {
    id: 'sesame-brittles',
    name: 'Sesame Brittles',
    image: 'nuts/Sesame brittles.png',
    badge: 'Best Seller',
    description: 'Crunchy sesame brittles made with roasted sesame seeds and natural sweetener. Not overly sweet, and packaged to stay fresh for weeks.',
    rating: 4.9,
    reviewCount: 64,
    variants: [
      { label: '500g', price: 250 },
      { label: '1kg', price: 450 }
    ],
    reviews: [
      { name: 'James N.', initials: 'JN', stars: 5, date: 'Verified Buyer · Nakuru', text: 'Perfectly crunchy and not overly sweet. Packaging keeps them fresh for weeks.' },
      { name: 'Susan A.', initials: 'SA', stars: 5, date: 'Verified Buyer · Eldoret', text: 'Bought these for a road trip, gone before we even arrived.' }
    ]
  },
  {
    id: 'peanut-butter',
    name: 'Peanut Butter',
    image: 'nuts/Peanut Butter.png',
    badge: 'Best Seller',
    description: 'Classic small-batch roasted peanut butter, smooth and rich with zero added sugar. A pantry staple the whole family can enjoy.',
    rating: 4.7,
    reviewCount: 118,
    variants: [
      { label: '500g', price: 600 },
      { label: '1kg', price: 1100 }
    ],
    reviews: [
      { name: 'Amina O.', initials: 'AO', stars: 5, date: 'Verified Buyer · Kisumu', text: 'Everyone kept asking where the snacks were from at our event.' },
      { name: 'Brian O.', initials: 'BO', stars: 4, date: 'Verified Buyer · Nairobi', text: 'Great taste, a little runnier than store-bought brands but still good.' },
      { name: 'Lucy M.', initials: 'LM', stars: 5, date: 'Verified Buyer · Nyeri', text: 'Kids love it on toast every morning, no complaints here.' }
    ]
  }
];

let activeProduct = null;
let activeVariantIndex = 0;
let modalQty = 1;

/* ── STAR RATING RENDER ── */
function renderStars(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

/* ── RENDER PRODUCT CARDS ── */
function renderProductCards() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  grid.innerHTML = products.map(p => `
    <div class="product-card" onclick="openProductModal('${p.id}')">
      ${p.badge ? `<span class="best-badge">${p.badge}</span>` : ''}
      <img class="product-img" src="${p.image}" alt="${p.name}" />
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-card-rating">
          <span class="stars-sm">${renderStars(p.rating)}</span>
          <span class="rating-count-sm">(${p.reviewCount})</span>
        </div>
        <div class="product-weight">${p.variants[0].label}</div>
        <div class="product-footer">
          <div class="product-price">KSh ${p.variants[0].price.toLocaleString()}</div>
          <button class="add-btn" onclick="event.stopPropagation(); quickAddToCart('${p.id}', this)">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ── QUICK ADD (from card, uses first/default variant) ── */
function quickAddToCart(productId, btn) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const variant = product.variants[0];
  addToCart(`${product.name} - ${variant.label}`, variant.price, btn);
}

/* ── PRODUCT MODAL ── */
function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  activeProduct = product;
  activeVariantIndex = 0;
  modalQty = 1;

  document.getElementById('modalBadge').style.display = product.badge ? 'inline-block' : 'none';
  document.getElementById('modalBadge').textContent = product.badge || '';
  document.getElementById('modalImg').src = product.image;
  document.getElementById('modalImg').alt = product.name;
  document.getElementById('modalName').textContent = product.name;
  document.getElementById('modalStars').textContent = renderStars(product.rating);
  document.getElementById('modalRatingCount').textContent = `${product.rating.toFixed(1)} (${product.reviewCount} reviews)`;
  document.getElementById('modalDesc').textContent = product.description;
  document.getElementById('modalQty').textContent = modalQty;

  renderModalVariants();
  updateModalPrice();
  renderModalReviews();

  document.getElementById('productModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function renderModalVariants() {
  const container = document.getElementById('modalVariants');
  container.innerHTML = activeProduct.variants.map((v, i) => `
    <button class="variant-btn ${i === activeVariantIndex ? 'active' : ''}" onclick="selectVariant(${i})">
      ${v.label}
    </button>
  `).join('');
}

function selectVariant(index) {
  activeVariantIndex = index;
  renderModalVariants();
  updateModalPrice();
}

function updateModalPrice() {
  const variant = activeProduct.variants[activeVariantIndex];
  const total = variant.price * modalQty;
  document.getElementById('modalPrice').textContent = 'KSh ' + total.toLocaleString();
}

function changeModalQty(delta) {
  modalQty = Math.max(1, modalQty + delta);
  document.getElementById('modalQty').textContent = modalQty;
  updateModalPrice();
}

function renderModalReviews() {
  const container = document.getElementById('modalReviewsList');
  container.innerHTML = activeProduct.reviews.map(r => `
    <div class="modal-review-card">
      <div class="modal-review-head">
        <div class="review-avatar">${r.initials}</div>
        <div>
          <strong>${r.name}</strong>
          <span>${r.date}</span>
        </div>
        <span class="modal-review-stars">${renderStars(r.stars)}</span>
      </div>
      <p>${r.text}</p>
    </div>
  `).join('');
}

function addModalToCart() {
  const variant = activeProduct.variants[activeVariantIndex];
  const existing = cart.find(i => i.name === `${activeProduct.name} - ${variant.label}`);
  if (existing) {
    existing.qty += modalQty;
  } else {
    cart.push({ name: `${activeProduct.name} - ${variant.label}`, price: variant.price, qty: modalQty });
  }
  updateCart();
  showToast(`${activeProduct.name} (${variant.label}) added to cart!`);
  closeProductModal();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductModal();
    closeCheckoutModal();
    closeOrdersModal();
  }
});

/* ── CHECKOUT ── */
const DELIVERY_FEES = { nairobi: 200, major: 400, upcountry: 600 };
const FREE_DELIVERY_THRESHOLD = 3000; // Nairobi only, per shipping policy

function openCheckoutModal() {
  if (cart.length === 0) {
    showToast('Your cart is empty 🥜');
    return;
  }
  closeCart();
  document.getElementById('checkoutFormView').style.display = 'block';
  document.getElementById('checkoutSuccessView').style.display = 'none';
  renderCheckoutSummary();
  document.getElementById('checkoutOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
  document.getElementById('checkoutOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function calcDeliveryFee(subtotal) {
  const city = document.getElementById('checkoutCity').value;
  if (city === 'nairobi' && subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  return DELIVERY_FEES[city] ?? DELIVERY_FEES.nairobi;
}

function renderCheckoutSummary() {
  const container = document.getElementById('checkoutItems');
  container.innerHTML = cart.map(item => `
    <div class="checkout-summary-item">
      <div class="cart-item-thumb">🥜</div>
      <div class="checkout-summary-item-info">
        <div class="cart-item-name">${item.name}</div>
        <span>Qty ${item.qty}</span>
      </div>
      <div class="checkout-summary-item-price">KSh ${(item.price * item.qty).toLocaleString()}</div>
    </div>
  `).join('');

  const subtotal = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const delivery = calcDeliveryFee(subtotal);
  const total = subtotal + delivery;

  document.getElementById('checkoutSubtotal').textContent = 'KSh ' + subtotal.toLocaleString();
  document.getElementById('checkoutDelivery').textContent = delivery === 0 ? 'FREE' : 'KSh ' + delivery.toLocaleString();
  document.getElementById('checkoutTotal').textContent = 'KSh ' + total.toLocaleString();
}

function setPaymentMethod(input) {
  document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('active'));
  input.closest('.payment-option').classList.add('active');

  const hints = {
    mpesa: 'You\'ll receive an M-Pesa prompt once your order is confirmed.',
    card: 'You\'ll be redirected to a secure card payment page after placing your order.',
    cod: 'Pay in cash when your order arrives. Available within Nairobi only.'
  };
  document.getElementById('paymentHint').textContent = hints[input.value] || '';
}

function generateOrderNumber() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return 'AP-' + Date.now().toString().slice(-6) + random;
}

function submitCheckout(e) {
  e.preventDefault();

  const name = document.getElementById('checkoutName').value.trim();
  const orderNumber = generateOrderNumber();
  const city = document.getElementById('checkoutCity').value;
  const subtotal = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const delivery = calcDeliveryFee(subtotal);
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

  saveOrder({
    orderNumber,
    timestamp: Date.now(),
    customerName: name,
    customerEmail: document.getElementById('checkoutEmail').value.trim(),
    customerPhone: document.getElementById('checkoutPhone').value.trim(),
    address: document.getElementById('checkoutAddress').value.trim(),
    city,
    paymentMethod,
    items: cart.map(i => ({ ...i })),
    subtotal,
    delivery,
    total: subtotal + delivery
  });

  document.getElementById('checkoutFormView').style.display = 'none';
  document.getElementById('checkoutSuccessView').style.display = 'block';
  document.getElementById('successName').textContent = name ? `, ${name}` : '';
  document.getElementById('successOrderNumber').textContent = orderNumber;

  // Clear cart now that the order has been "placed"
  cart = [];
  updateCart();
  document.getElementById('checkoutForm').reset();
  setPaymentMethod(document.querySelector('input[name="payment"][value="mpesa"]'));
}

/* ── ORDER HISTORY / TRACKING ── */
const ORDERS_KEY = 'arkpeanuts_orders';
const CITY_DELIVERY_DAYS = { nairobi: 1, major: 3, upcountry: 5 };
const CITY_LABELS = { nairobi: 'Nairobi', major: 'Major Town', upcountry: 'Upcountry / Rural' };
const PAYMENT_LABELS = { mpesa: 'M-Pesa', card: 'Card', cod: 'Cash on Delivery' };

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch {
    return [];
  }
}
function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order); // newest first
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

/* Realistic, time-based status: no backend, so we derive progress from how
   long ago the order was placed vs. the delivery estimate for its area. */
function computeOrderStatus(order) {
  const days = CITY_DELIVERY_DAYS[order.city] || CITY_DELIVERY_DAYS.nairobi;
  const totalMs = days * 24 * 60 * 60 * 1000;
  const elapsed = Date.now() - order.timestamp;

  if (elapsed >= totalMs) return { step: 3, label: 'Delivered' };
  if (elapsed >= totalMs / 3) return { step: 2, label: 'Out for Delivery' };
  return { step: 1, label: 'Processing' };
}

function formatOrderDate(ts) {
  return new Date(ts).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function openOrdersModal() {
  renderOrderHistory();
  document.getElementById('ordersOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeOrdersModal() {
  document.getElementById('ordersOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function renderOrderHistory() {
  const orders = getOrders();
  const listEl = document.getElementById('ordersList');
  const emptyEl = document.getElementById('ordersEmpty');

  if (orders.length === 0) {
    listEl.style.display = 'none';
    emptyEl.style.display = 'flex';
    return;
  }
  listEl.style.display = 'flex';
  emptyEl.style.display = 'none';

  const steps = ['Processing', 'Out for Delivery', 'Delivered'];

  listEl.innerHTML = orders.map(order => {
    const status = computeOrderStatus(order);
    const itemsHtml = order.items.map(i => `
      <div class="order-item-row">
        <span>${i.name} × ${i.qty}</span>
        <span>KSh ${(i.price * i.qty).toLocaleString()}</span>
      </div>
    `).join('');

    const stepsHtml = steps.map((label, i) => {
      const stepNum = i + 1;
      const state = stepNum < status.step ? 'done' : stepNum === status.step ? 'active' : '';
      return `
        <div class="order-step ${state}">
          <span class="order-step-dot"></span>
          <span class="order-step-label">${label}</span>
        </div>
      `;
    }).join('<span class="order-step-line"></span>');

    return `
      <div class="order-card">
        <div class="order-card-head">
          <div>
            <strong>${order.orderNumber}</strong>
            <span class="order-card-date">${formatOrderDate(order.timestamp)}</span>
          </div>
          <span class="order-status-badge status-step-${status.step}">${status.label}</span>
        </div>

        <div class="order-progress">${stepsHtml}</div>

        <div class="order-items">${itemsHtml}</div>

        <div class="order-card-foot">
          <div class="order-card-meta">
            <span>${CITY_LABELS[order.city] || order.city}</span>
            <span>·</span>
            <span>${PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span>
          </div>
          <div class="order-card-total">KSh ${order.total.toLocaleString()}</div>
        </div>
      </div>
    `;
  }).join('');
}

document.getElementById('ordersBtn').addEventListener('click', openOrdersModal);

let cart = [];
renderProductCards();

/* ── CART OPEN / CLOSE ── */
document.getElementById('cartBtn').addEventListener('click', openCart);

function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartPanel').classList.add('open');
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartPanel').classList.remove('open');
}

/* ── ADD TO CART ── */
function addToCart(name, price, btn) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  updateCart();
  showToast(name + ' added to cart!');

  // Button feedback
  const original = btn.textContent;
  btn.textContent = '✓';
  btn.style.background = '#4caf50';
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
  }, 1200);
}

/* ── REMOVE FROM CART ── */
function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  updateCart();
}

/* ── CHANGE QUANTITY ── */
function changeQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.name !== name);
  updateCart();
}

/* ── RENDER CART ── */
function updateCart() {
  const count = cart.reduce((a, i) => a + i.qty, 0);
  const countEl = document.getElementById('cartCount');
  countEl.textContent = count;
  countEl.classList.remove('bump');
  void countEl.offsetWidth; // restart animation
  countEl.classList.add('bump');

  const container = document.getElementById('cartItems');
  const foot      = document.getElementById('cartFoot');

  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty">Your cart is empty 🥜</div>';
    foot.style.display = 'none';
    return;
  }

  foot.style.display = 'block';
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-thumb">🥜</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">KSh ${item.price.toLocaleString()}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty('${item.name}', -1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
          <button class="remove-item" onclick="removeFromCart('${item.name}')">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((a, i) => a + i.price * i.qty, 0);
  document.getElementById('cartTotal').textContent = 'KSh ' + total.toLocaleString();
}

/* ── TOAST NOTIFICATION ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

/* ── HAMBURGER MENU (mobile nav toggle) ── */
document.getElementById('hamburgerBtn').addEventListener('click', toggleMobileMenu);

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('hamburgerBtn');
  menu.classList.toggle('open');
  btn.classList.toggle('active');
}

/* ── BACK TO TOP ── */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── SEARCH ── */
const searchOverlay = document.getElementById('searchOverlay');
const searchInput   = document.getElementById('searchInput');

document.getElementById('searchBtn').addEventListener('click', () => {
  searchOverlay.classList.add('open');
  setTimeout(() => searchInput.focus(), 100);
});
document.getElementById('searchCloseBtn').addEventListener('click', closeSearch);
searchOverlay.addEventListener('click', (e) => {
  if (e.target === searchOverlay) closeSearch();
});
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim();
    const matches = performProductSearch(query);
    closeSearch();

    document.getElementById('shop').scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (query) {
      showToast(
        matches > 0
          ? `Found ${matches} result${matches === 1 ? '' : 's'} for "${query}"`
          : `No results for "${query}"`
      );
    }
  }
  if (e.key === 'Escape') closeSearch();
});
function closeSearch() {
  searchOverlay.classList.remove('open');
  searchInput.value = '';
}

/* ── PRODUCT SEARCH / FILTER ── */
function performProductSearch(query) {
  const q = query.trim().toLowerCase();
  let matches = 0;

  function filterCards(selector, nameSelector) {
    document.querySelectorAll(selector).forEach(card => {
      const nameEl = card.querySelector(nameSelector);
      const text = nameEl ? nameEl.textContent.toLowerCase() : '';
      const isMatch = q === '' || text.includes(q);
      card.style.display = isMatch ? '' : 'none';
      if (isMatch && q !== '') matches++;
    });
  }

  filterCards('.cat-card', '.cat-name');
  filterCards('.product-card', '.product-name');

  const emptyState = document.getElementById('searchEmptyState');
  const emptyQuery = document.getElementById('searchEmptyQuery');
  if (q !== '' && matches === 0) {
    emptyState.style.display = 'flex';
    emptyQuery.textContent = query.trim();
  } else {
    emptyState.style.display = 'none';
  }

  return matches;
}

function clearProductSearch() {
  performProductSearch('');
  showToast('Showing all products');
}

/* ── ACCOUNT SYSTEM (front-end only, stored in localStorage) ── */
const ACCOUNTS_KEY = 'arkpeanuts_accounts';
const SESSION_KEY   = 'arkpeanuts_current_user';

function getAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || [];
  } catch {
    return [];
  }
}
function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}
function setCurrentUser(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}
function clearCurrentUser() {
  localStorage.removeItem(SESSION_KEY);
}

const accountOverlay  = document.getElementById('accountOverlay');
const accountDropdown = document.getElementById('accountDropdown');
const loginForm       = document.getElementById('loginForm');
const signupForm      = document.getElementById('signupForm');
const loginTabBtn     = document.getElementById('loginTabBtn');
const signupTabBtn    = document.getElementById('signupTabBtn');

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  const showing = input.type === 'password';
  input.type = showing ? 'text' : 'password';
  btn.classList.toggle('showing', showing);
  btn.textContent = showing ? '🙈' : '👁';
  btn.setAttribute('aria-label', showing ? 'Hide password' : 'Show password');
}

function openAccountModal() {
  document.getElementById('loginError').textContent = '';
  document.getElementById('signupError').textContent = '';
  accountOverlay.classList.add('open');
}
function closeAccountModal() {
  accountOverlay.classList.remove('open');
}
function switchAccountTab(tab) {
  const isLogin = tab === 'login';
  loginForm.style.display  = isLogin ? 'flex' : 'none';
  signupForm.style.display = isLogin ? 'none' : 'flex';
  loginTabBtn.classList.toggle('active', isLogin);
  signupTabBtn.classList.toggle('active', !isLogin);
}

function handleSignup(e) {
  e.preventDefault();
  const name     = document.getElementById('signupName').value.trim();
  const email    = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;
  const errorEl  = document.getElementById('signupError');

  const accounts = getAccounts();
  if (accounts.some(a => a.email === email)) {
    errorEl.textContent = 'An account with that email already exists.';
    return;
  }

  const newAccount = { name, email, password };
  accounts.push(newAccount);
  saveAccounts(accounts);
  setCurrentUser({ name, email });

  closeAccountModal();
  signupForm.reset();
  refreshAccountUI();
  showToast(`Welcome, ${name}! 🥜`);
}

function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const errorEl  = document.getElementById('loginError');

  const accounts = getAccounts();
  const match = accounts.find(a => a.email === email && a.password === password);

  if (!match) {
    errorEl.textContent = 'Incorrect email or password.';
    return;
  }

  setCurrentUser({ name: match.name, email: match.email });
  closeAccountModal();
  loginForm.reset();
  refreshAccountUI();
  showToast(`Welcome back, ${match.name}! 🥜`);
}

function handleLogout() {
  clearCurrentUser();
  accountDropdown.classList.remove('open');
  refreshAccountUI();
  showToast('Logged out');
}

function refreshAccountUI() {
  const user = getCurrentUser();
  const btn  = document.getElementById('accountBtn');

  if (user) {
    const initial = user.name.trim().charAt(0).toUpperCase() || '?';
    btn.textContent = '';
    const avatarSpan = document.createElement('span');
    avatarSpan.className = 'account-avatar';
    avatarSpan.style.cssText = 'width:26px;height:26px;font-size:.7rem;';
    avatarSpan.textContent = initial;
    btn.appendChild(avatarSpan);

    document.getElementById('accountAvatar').textContent = initial;
    document.getElementById('accountDropdownName').textContent = user.name;
    document.getElementById('accountDropdownEmail').textContent = user.email;
  } else {
    btn.textContent = '👤';
  }
}

document.getElementById('accountBtn').addEventListener('click', () => {
  const user = getCurrentUser();
  if (user) {
    accountDropdown.classList.toggle('open');
  } else {
    openAccountModal();
  }
});
document.getElementById('accountCloseBtn').addEventListener('click', closeAccountModal);
accountOverlay.addEventListener('click', (e) => {
  if (e.target === accountOverlay) closeAccountModal();
});
document.addEventListener('click', (e) => {
  if (
    accountDropdown.classList.contains('open') &&
    !accountDropdown.contains(e.target) &&
    e.target.id !== 'accountBtn' &&
    !e.target.closest('#accountBtn')
  ) {
    accountDropdown.classList.remove('open');
  }
});

refreshAccountUI();

/* ── NAV LINKS: smooth scroll to matching sections ── */
// All nav links now point to real in-page anchors (e.g. #about, #contact),
// so we just intercept the click to close the mobile menu and do a smooth scroll.
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#') || href.length <= 1) return; // let plain "#" links do nothing special

    e.preventDefault();

    // close mobile menu if open
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('hamburgerBtn').classList.remove('active');

    const targetId = href.slice(1);
    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── FAQ ACCORDION ── */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');

  // close all, then reopen the clicked one if it wasn't already open
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

/* ── CONTACT FORM ── */
function submitContactForm(e) {
  e.preventDefault();
  const name = document.getElementById('contactName').value.trim();
  document.getElementById('contactName').closest('form').reset();
  showToast(name ? `Thanks ${name}, we'll be in touch! 🥜` : 'Message sent, thank you!');
}

/* ── SCROLL REVEAL ── */
const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach(el => revealObserver.observe(el));

/* ── ANIMATED STAT COUNTERS ── */
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = Math.round(target * eased);
    el.textContent = value.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterEls = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

counterEls.forEach(el => counterObserver.observe(el));