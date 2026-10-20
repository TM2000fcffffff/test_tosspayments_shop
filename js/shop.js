// 상품 목록 페이지 (상의 / 신발 / 바지)
(function () {
  const category = document.body.dataset.category;
  const meta = CATEGORIES[category];
  const state = {
    sub: '전체',
    sort: 'rec',
    q: new URLSearchParams(location.search).get('q') || '',
  };
  const ICON_HEART = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.2 0 3.6 1.2 5.2 3 1.6-1.8 3-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z"/></svg>';

  let likes = readStore(LIKE_KEY, []);
  let current = null; // 모달에 열린 상품
  let selected = { size: null, qty: 1 };

  const $grid = document.getElementById('grid');
  const $chips = document.getElementById('chips');
  const $count = document.getElementById('count');
  const $sort = document.getElementById('sort');

  function list() {
    const q = state.q.toLowerCase();
    // 검색어가 있으면 전체 카테고리에서 찾는다
    let items = PRODUCTS.filter((p) =>
      q ? (p.name + ' ' + p.brand + ' ' + p.sub).toLowerCase().includes(q) : p.category === category
    );
    if (!q && state.sub !== '전체') items = items.filter((p) => p.sub === state.sub);

    const sorters = {
      rec: (a, b) => b.reviews * b.rating - a.reviews * a.rating,
      low: (a, b) => salePrice(a) - salePrice(b),
      high: (a, b) => salePrice(b) - salePrice(a),
      discount: (a, b) => b.discount - a.discount,
      review: (a, b) => b.reviews - a.reviews,
    };
    return items.slice().sort(sorters[state.sort]);
  }

  function renderChips() {
    $chips.innerHTML = meta.subs
      .map((s) => `<button type="button" class="chip ${s === state.sub && !state.q ? 'active' : ''}" data-sub="${s}">${s}</button>`)
      .join('');
  }

  function cardHTML(p, i) {
    const liked = likes.includes(p.id);
    const sale = salePrice(p);
    return `
      <article class="card" data-id="${p.id}">
        <div class="thumb">
          ${thumbSVG(p)}
          <span class="rank">${i + 1}</span>
          <button type="button" class="like ${liked ? 'on' : ''}" data-like="${p.id}" aria-label="좋아요" aria-pressed="${liked}">${ICON_HEART}</button>
        </div>
        <p class="brand">${p.brand}</p>
        <p class="name">${p.name}</p>
        <p class="price-row"><span class="rate">${p.discount}%</span>${won(sale)}</p>
        <p class="meta"><span class="star">★</span> ${p.rating} · 후기 ${p.reviews.toLocaleString()}</p>
        <div class="tags">${sale >= 50000 ? '<span class="tag">무료배송</span>' : ''}<span class="tag">${p.sub}</span></div>
      </article>`;
  }

  function render() {
    const items = list();
    document.getElementById('title').textContent = state.q ? `'${state.q}' 검색 결과` : `${meta.label} 랭킹`;
    $count.textContent = `${items.length}개 상품`;
    renderChips();
    $grid.innerHTML = items.length
      ? items.map(cardHTML).join('')
      : '<p class="empty">조건에 맞는 상품이 없습니다.</p>';
  }

  // ---------- 상품 상세 모달 ----------
  const $modal = document.createElement('div');
  $modal.className = 'modal-backdrop';
  $modal.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"></div>';
  document.body.appendChild($modal);
  const $modalBody = $modal.firstElementChild;

  function openModal(id) {
    current = findProduct(id);
    selected = { size: null, qty: 1 };
    renderModal();
    $modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    $modal.classList.remove('open');
    document.body.style.overflow = '';
    current = null;
  }

  function renderModal() {
    const p = current;
    const sale = salePrice(p);
    $modalBody.innerHTML = `
      <button type="button" class="modal-close" data-close aria-label="닫기">×</button>
      <div class="thumb">${thumbSVG(p)}</div>
      <div class="detail">
        <p class="brand">${p.brand}</p>
        <h2 id="modal-title">${p.name}</h2>
        <p class="meta"><span class="star">★</span> ${p.rating} · 후기 ${p.reviews.toLocaleString()}개</p>
        <p class="origin">${won(p.price)}</p>
        <p class="price-row"><span class="rate">${p.discount}%</span>${won(sale)}</p>
        <div class="benefit">
          배송 · ${sale >= 50000 ? '<b>무료배송</b>' : '50,000원 이상 구매 시 무료배송'}<br>
          결제 · 토스페이먼츠 간편결제 / 카드 / 계좌이체
        </div>
        <p class="opt-label">사이즈</p>
        <div class="sizes">
          ${p.sizes.map((s) => `<button type="button" class="size ${selected.size === s ? 'active' : ''}" data-size="${s}">${s}</button>`).join('')}
        </div>
        <div class="qty-row">
          <span class="opt-label" style="margin:0">수량</span>
          <div class="stepper">
            <button type="button" data-qty="-1" aria-label="수량 감소">−</button>
            <span>${selected.qty}</span>
            <button type="button" data-qty="1" aria-label="수량 증가">+</button>
          </div>
        </div>
        <div class="total-row">
          <span>총 상품 금액</span>
          <strong>${won(sale * selected.qty)}</strong>
        </div>
        <div class="btn-row">
          <button type="button" class="btn" data-action="cart">장바구니</button>
          <button type="button" class="btn btn-primary" data-action="buy">바로 구매</button>
        </div>
      </div>`;
  }

  $modal.addEventListener('click', (e) => {
    if (e.target === $modal || e.target.closest('[data-close]')) return closeModal();

    const size = e.target.closest('[data-size]');
    if (size) {
      selected.size = size.dataset.size;
      return renderModal();
    }

    const qty = e.target.closest('[data-qty]');
    if (qty) {
      selected.qty = Math.max(1, Math.min(99, selected.qty + Number(qty.dataset.qty)));
      return renderModal();
    }

    const action = e.target.closest('[data-action]');
    if (action) {
      if (!selected.size) {
        toast('사이즈를 선택해주세요.');
        return;
      }
      Cart.add(current.id, selected.size, selected.qty);
      if (action.dataset.action === 'buy') {
        location.href = 'checkout.html';
        return;
      }
      closeModal();
      toast('장바구니에 담았습니다.<a href="checkout.html">바로가기</a>');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && current) closeModal();
  });

  // ---------- 이벤트 ----------
  $grid.addEventListener('click', (e) => {
    const like = e.target.closest('[data-like]');
    if (like) {
      e.stopPropagation();
      const id = like.dataset.like;
      likes = likes.includes(id) ? likes.filter((x) => x !== id) : likes.concat(id);
      writeStore(LIKE_KEY, likes);
      like.classList.toggle('on');
      like.setAttribute('aria-pressed', likes.includes(id));
      return;
    }
    const card = e.target.closest('.card');
    if (card) openModal(card.dataset.id);
  });

  $chips.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-sub]');
    if (!chip) return;
    state.sub = chip.dataset.sub;
    if (state.q) {
      state.q = '';
      document.getElementById('search-input').value = '';
      history.replaceState(null, '', location.pathname);
    }
    render();
  });

  $sort.addEventListener('change', () => {
    state.sort = $sort.value;
    render();
  });

  window.onSearch = (value) => {
    state.q = value;
    history.replaceState(null, '', location.pathname + (value ? '?q=' + encodeURIComponent(value) : ''));
    render();
  };

  render();
})();
