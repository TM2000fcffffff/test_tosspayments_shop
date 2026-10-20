// 공통: 헤더/푸터, 장바구니, 토스트
const CART_KEY = 'layered_cart';
const LIKE_KEY = 'layered_likes';

function won(n) {
  return n.toLocaleString('ko-KR') + '원';
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function readStore(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v == null ? fallback : v;
  } catch (e) {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* 저장소를 쓸 수 없는 환경 */
  }
}

const Cart = {
  items() {
    // 존재하지 않는 상품은 정리
    return readStore(CART_KEY, []).filter((it) => findProduct(it.id));
  },
  save(items) {
    writeStore(CART_KEY, items);
    renderCartCount();
  },
  add(id, size, qty) {
    const items = this.items();
    const found = items.find((it) => it.id === id && it.size === size);
    if (found) found.qty = Math.min(found.qty + qty, 99);
    else items.push({ id, size, qty });
    this.save(items);
  },
  setQty(id, size, qty) {
    const items = this.items();
    const found = items.find((it) => it.id === id && it.size === size);
    if (found) found.qty = Math.max(1, Math.min(qty, 99));
    this.save(items);
  },
  remove(id, size) {
    this.save(this.items().filter((it) => !(it.id === id && it.size === size)));
  },
  clear() {
    this.save([]);
  },
  count() {
    return this.items().reduce((sum, it) => sum + it.qty, 0);
  },
};

const ICON_SEARCH = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
const ICON_CART = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 8h14l-1.2 12H6.2L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>';

function renderHeader() {
  const el = document.getElementById('site-header');
  if (!el) return;
  const current = document.body.dataset.category || '';
  const q = new URLSearchParams(location.search).get('q') || '';
  const tabs = Object.entries(CATEGORIES)
    .map(([key, c]) => `<a href="${c.page}" class="${key === current ? 'active' : ''}">${c.label}</a>`)
    .join('');

  el.innerHTML = `
    <header class="gnb">
      <a class="logo" href="index.html">LAYERED</a>
      <form class="search" id="search-form" role="search">
        <input id="search-input" type="search" placeholder="상품명, 브랜드를 검색해보세요" value="${escapeHTML(q)}" aria-label="검색">
        <button type="submit" aria-label="검색">${ICON_SEARCH}</button>
      </form>
      <nav class="gnb-util">
        <a class="login" href="#" onclick="return false">로그인</a>
        <a class="cart-link" href="checkout.html">${ICON_CART}장바구니 <span class="cart-count" id="cart-count">0</span></a>
      </nav>
    </header>
    <nav class="cate-nav" aria-label="카테고리">${tabs}</nav>
  `;

  document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const value = document.getElementById('search-input').value.trim();
    // 상품 목록 페이지는 자체적으로 필터링, 그 외 페이지는 상의 페이지로 이동
    if (typeof window.onSearch === 'function') window.onSearch(value);
    else location.href = 'index.html' + (value ? '?q=' + encodeURIComponent(value) : '');
  });

  renderCartCount();
}

function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
    <footer class="footer">
      <strong>LAYERED</strong><br>
      본 사이트는 토스페이먼츠 결제 연동을 위한 퍼블리싱 데모입니다. 실제 상품은 판매하지 않으며, 테스트 결제는 청구되지 않습니다.<br>
      고객센터 1588-0000 · 평일 10:00 - 18:00
    </footer>
  `;
}

function renderCartCount() {
  const el = document.getElementById('cart-count');
  if (el) el.textContent = Cart.count();
}

let toastTimer;
function toast(html) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.innerHTML = html;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
});
