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