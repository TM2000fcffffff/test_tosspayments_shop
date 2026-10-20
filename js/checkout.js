// 주문/결제 페이지 - 토스페이먼츠 결제위젯 v2 연동
(function () {
  // 토스페이먼츠 문서용 공개 테스트 클라이언트 키 (결제위젯 연동 키).
  // 실서비스에서는 개발자센터 > API 키 메뉴의 "결제위젯 연동 키 > 클라이언트 키"로 교체하세요.
  const CLIENT_KEY = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
  const FREE_SHIPPING = 50000;
  const SHIPPING_FEE = 3000;
  const PENDING_KEY = 'layered_pending_order';

  const $list = document.getElementById('cart-list');
  const $payBtn = document.getElementById('pay-btn');
  const $form = document.getElementById('order-form');

  let widgets = null;
  let widgetReady = false;

  function totals() {
    const items = Cart.items();
    let origin = 0;
    let sale = 0;
    items.forEach((it) => {
      const p = findProduct(it.id);
      origin += p.price * it.qty;
      sale += salePrice(p) * it.qty;
    });
    const shipping = sale === 0 || sale >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
    return { items, origin, discount: origin - sale, sale, shipping, total: sale + shipping };
  }

  function renderEmpty() {
    document.getElementById('checkout').innerHTML = `
      <h1>주문/결제</h1>
      <div class="cart-empty">
        <p>장바구니에 담긴 상품이 없습니다.</p>
        <a class="btn btn-primary" href="index.html">쇼핑하러 가기</a>
      </div>`;
  }

  function renderCart() {
    const t = totals();
    if (!t.items.length) {
      renderEmpty();
      return t;
    }

    document.getElementById('item-count').textContent = `총 ${t.items.reduce((s, it) => s + it.qty, 0)}개`;
    $list.innerHTML = t.items
      .map((it) => {
        const p = findProduct(it.id);
        return `
        <div class="cart-item" data-id="${it.id}" data-size="${it.size}">
          <div class="thumb">${thumbSVG(p)}</div>
          <div>
            <p class="brand">${p.brand}</p>
            <p class="name">${p.name}</p>
            <p class="opt">사이즈 ${it.size}</p>
            <div class="stepper">
              <button type="button" data-step="-1" aria-label="수량 감소">−</button>
              <span>${it.qty}</span>
              <button type="button" data-step="1" aria-label="수량 증가">+</button>
            </div>
          </div>
          <div class="right">
            <button type="button" class="remove" data-remove>삭제</button>
            <div><s>${won(p.price * it.qty)}</s><b>${won(salePrice(p) * it.qty)}</b></div>
          </div>
        </div>`;
      })
      .join('');

    document.getElementById('sum-origin').textContent = won(t.origin);
    document.getElementById('sum-discount').textContent = t.discount ? '-' + won(t.discount) : '0원';
    document.getElementById('sum-ship').textContent = t.shipping ? won(t.shipping) : '무료';
    document.getElementById('sum-total').textContent = won(t.total);
    document.getElementById('ship-note').textContent =
      t.shipping ? `${won(FREE_SHIPPING - t.sale)} 더 담으면 무료배송` : '무료배송 혜택이 적용되었습니다.';
    if (widgetReady) $payBtn.textContent = `${won(t.total)} 결제하기`;
    return t;
  }

  function showWidgetError(message) {
    document.getElementById('payment-method').innerHTML = `<div class="widget-msg">${message}</div>`;
    $payBtn.textContent = '결제 불가';
    $payBtn.disabled = true;
  }

  async function initWidgets(amount) {
    if (location.protocol === 'file:') {
      showWidgetError('결제위젯은 <b>http://localhost</b> 같은 웹 서버에서만 동작합니다.<br>프로젝트 폴더에서 <code>serve.ps1</code>을 실행한 뒤 http://localhost:5500 으로 접속해주세요.');
      return;
    }
    if (typeof TossPayments === 'undefined') {
      showWidgetError('토스페이먼츠 SDK를 불러오지 못했습니다. 네트워크 연결을 확인해주세요.');
      return;
    }
    try {
      const tossPayments = TossPayments(CLIENT_KEY);
      // 비회원 결제. 회원 결제라면 회원 ID 기반의 고유한 customerKey를 넣으세요.
      widgets = tossPayments.widgets({ customerKey: TossPayments.ANONYMOUS });
      await widgets.setAmount({ currency: 'KRW', value: amount });
      await Promise.all([
        widgets.renderPaymentMethods({ selector: '#payment-method', variantKey: 'DEFAULT' }),
        widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' }),
      ]);
      widgetReady = true;
      $payBtn.disabled = false;
      $payBtn.textContent = `${won(amount)} 결제하기`;
    } catch (err) {
      console.error(err);
      showWidgetError('결제위젯을 불러오지 못했습니다. ' + escapeHTML(err.message || ''));
    }
  }

  async function onCartChange() {
    const t = renderCart();
    if (!t.items.length) return;
    // 금액이 바뀌면 위젯에도 반영해야 결제 금액이 일치합니다.
    if (widgets && widgetReady) await widgets.setAmount({ currency: 'KRW', value: t.total });
  }

  $list.addEventListener('click', (e) => {
    const row = e.target.closest('.cart-item');
    if (!row) return;
    const { id, size } = row.dataset;
    const step = e.target.closest('[data-step]');
    if (step) {
      const it = Cart.items().find((x) => x.id === id && x.size === size);
      Cart.setQty(id, size, it.qty + Number(step.dataset.step));
      onCartChange();
    } else if (e.target.closest('[data-remove]')) {
      Cart.remove(id, size);
      onCartChange();
    }
  });

  function validateForm() {
    const rules = {
      name: (v) => v.length >= 2,
      phone: (v) => /^01\d{8,9}$/.test(v.replace(/\D/g, '')),
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      address: (v) => v.length >= 5,
    };
    let firstInvalid = null;
    Object.entries(rules).forEach(([key, ok]) => {
      const input = $form.elements[key];
      const valid = ok(input.value.trim());
      input.classList.toggle('invalid', !valid);
      if (!valid && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      toast('주문자 정보를 정확히 입력해주세요.');
      return false;
    }
    return true;
  }

  function makeOrderId() {
    // 6~64자, 영문 대소문자/숫자/-/_ 만 허용
    const rand = Math.random().toString(36).slice(2, 10);
    return `LAYERED_${Date.now()}_${rand}`;
  }

  $payBtn.addEventListener('click', async () => {
    if (!widgetReady || !validateForm()) return;
    const t = totals();
    if (!t.items.length) return;

    const first = findProduct(t.items[0].id);
    const orderName = t.items.length > 1 ? `${first.name} 외 ${t.items.length - 1}건` : first.name;
    const orderId = makeOrderId();
    const name = $form.elements.name.value.trim();

    // 결제 성공 페이지에서 금액 위변조를 확인하기 위해 주문 정보를 임시 저장
    try {
      sessionStorage.setItem(
        PENDING_KEY,
        JSON.stringify({ orderId, orderName, amount: t.total, items: t.items, address: $form.elements.address.value.trim() })
      );
    } catch (e) {
      /* 저장소를 쓸 수 없는 환경 */
    }

    $payBtn.disabled = true;
    try {
      await widgets.requestPayment({
        orderId,
        orderName: orderName.slice(0, 100),
        successUrl: new URL('success.html', location.href).href,
        failUrl: new URL('fail.html', location.href).href,
        customerName: name,
        customerEmail: $form.elements.email.value.trim(),
        customerMobilePhone: $form.elements.phone.value.replace(/\D/g, ''),
      });
    } catch (err) {
      // 사용자가 결제창을 닫은 경우 등
      if (err && err.code !== 'USER_CANCEL') toast(escapeHTML(err.message || '결제 요청 중 오류가 발생했습니다.'));
    } finally {
      $payBtn.disabled = false;
    }
  });

  const initial = renderCart();
  if (initial.items.length) initWidgets(initial.total);
})();
