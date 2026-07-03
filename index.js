let cart = [];

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
  document.getElementById('cartCount').textContent = count;

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
  if (e.key === 'Enter' && searchInput.value.trim()) {
    showToast(`Searching for "${searchInput.value.trim()}"…`);
    closeSearch();
  }
  if (e.key === 'Escape') closeSearch();
});
function closeSearch() {
  searchOverlay.classList.remove('open');
  searchInput.value = '';
}

/* ── ACCOUNT ── */
document.getElementById('accountBtn').addEventListener('click', () => {
  showToast('Account & login coming soon 👤');
});

/* ── NAV LINKS: smooth scroll to matching sections ── */
const navTargets = {
  'Home': null, // scrolls to top
  'Shop': '.two-col',
  'Categories': '.categories-grid',
  'Contact': 'footer',
};

document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const label = link.textContent.trim();

    // close mobile menu if open
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('hamburgerBtn').classList.remove('active');

    if (label === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const selector = navTargets[label];
    if (selector) {
      document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      showToast(`${label} page coming soon`);
    }
  });
});