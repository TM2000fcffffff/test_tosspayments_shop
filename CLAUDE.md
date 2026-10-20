# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

토스페이먼츠 결제위젯 v2를 연동한 의류 쇼핑몰 **퍼블리싱 데모**입니다. 순수 HTML/CSS/JS만 사용하며, 빌드 도구, 패키지 매니저, 테스트, 린터, 백엔드 서버가 없습니다. 디자인은 무신사 스타일(검정 GNB, 랭킹 그리드, 빨간 할인율)을 참고했지만, 브랜드는 가상의 "LAYERED"를 씁니다.

## 실행

결제위젯은 `file://`에서 동작하지 않으므로(`js/checkout.js`에서 막아 둠) 반드시 HTTP로 띄워야 합니다. 이 PC에는 Node/Python이 없어서 PowerShell `HttpListener` 기반 정적 서버를 씁니다.

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
```

`http://localhost:5500`으로 접속합니다. 포트는 `-Port`로 바꿀 수 있고, `.claude/launch.json`의 `shop` 설정도 같은 명령을 씁니다. Git은 PATH에 없을 수 있으니 `C:\Program Files\Git\cmd\git.exe`를 직접 쓰세요.

## 구조

페이지마다 스크립트를 아래 순서로 로드하며, 모듈 시스템 없이 전역 변수/함수로 서로 참조합니다. 순서를 바꾸면 깨집니다.

1. `js/products.js`: 데이터 계층. `PRODUCTS`, `CATEGORIES`(카테고리 키 → 라벨/페이지 파일/세부 분류), `salePrice()`(할인가, 100원 단위 내림), `findProduct()`, `thumbSVG()`(상품 사진 대신 쓰는 SVG 실루엣)
2. `js/common.js`: 모든 페이지 공통. `#site-header`/`#site-footer`에 헤더·푸터 주입, `Cart`(localStorage), `toast()`, `won()`, `escapeHTML()`, `readStore`/`writeStore`(try/catch로 감싼 저장소 접근)
3. 페이지별 스크립트
   - `js/shop.js`: `index.html`(상의), `shoes.html`, `pants.html`이 함께 씁니다. `<body data-category="top|shoes|pants">`로 어떤 카테고리를 보여줄지 정합니다. 상세 모달도 이 파일이 동적으로 만듭니다.
   - `js/checkout.js`: `checkout.html` 전용
   - `success.html`, `fail.html`: 인라인 스크립트

새 카테고리를 추가하려면 `CATEGORIES`에 항목을 넣고, `PRODUCTS`에 해당 `category` 상품을 넣고, 기존 목록 페이지 HTML을 복사해 `data-category`만 바꾸면 됩니다. 헤더 탭은 `CATEGORIES`에서 자동으로 만들어집니다.

헤더 검색: `window.onSearch`가 정의된 페이지(목록 페이지)는 그 자리에서 필터링하고, 그 외 페이지는 `index.html?q=...`로 이동합니다. 검색어가 있으면 카테고리와 관계없이 전체 상품에서 찾습니다.

## 저장소 키

- `localStorage.layered_cart`: `[{ id, size, qty }]`. 상품 ID와 사이즈 조합이 한 줄입니다. 가격은 저장하지 않고 항상 `PRODUCTS`에서 다시 계산합니다.
- `localStorage.layered_likes`: 좋아요한 상품 ID 배열
- `sessionStorage.layered_pending_order`: 결제 요청 직전에 저장하는 `{ orderId, orderName, amount, items, address }`. `success.html`이 이 값과 쿼리스트링의 `orderId`/`amount`를 비교해 금액 위변조를 확인합니다.

## 결제 흐름 (토스페이먼츠 결제위젯 v2)

SDK는 `checkout.html`에서 `https://js.tosspayments.com/v2/standard`로 로드합니다.

1. `TossPayments(CLIENT_KEY).widgets({ customerKey: TossPayments.ANONYMOUS })`로 비회원 결제를 씁니다.
2. `setAmount` 후 `renderPaymentMethods('#payment-method')`와 `renderAgreement('#agreement')`를 렌더링합니다.
3. 장바구니 수량이 바뀌면 `onCartChange()`가 `widgets.setAmount()`를 다시 호출합니다. 금액이 바뀌는 코드를 추가할 때 이 호출을 빠뜨리면 위젯 금액과 주문 금액이 어긋납니다.
4. 결제 금액은 할인가 합계 + 배송비입니다. 할인가 합계가 50,000원 이상이면 무료배송, 아니면 3,000원입니다(`FREE_SHIPPING`, `SHIPPING_FEE`).
5. `requestPayment()`의 `successUrl`/`failUrl`은 `new URL('success.html', location.href)`처럼 현재 위치를 기준으로 만듭니다. `orderId`는 `LAYERED_{timestamp}_{random}` 형식이고, 토스 규칙(6~64자, 영문/숫자/`-`/`_`)을 지켜야 합니다.

**중요:** 이 프로젝트는 결제 **인증**까지만 처리합니다. 실제 결제를 완료하려면 서버에서 시크릿 키로 `POST https://api.tosspayments.com/v1/payments/confirm`을 10분 안에 호출해야 합니다. 시크릿 키는 프론트엔드에 넣으면 안 되므로, 서버 없이 승인 코드를 이 저장소에 추가하지 마세요. `CLIENT_KEY`는 토스 문서에 공개된 결제위젯 테스트 키입니다.

테스트 결제창에서는 토스가 테스트용 휴대폰 번호와 비밀번호(`000000`)를 안내해 줍니다.

## 토스페이먼츠 MCP

`.mcp.json`에 `tosspayments-integration-guide` MCP 서버(`npx -y @tosspayments/integration-guide-mcp@latest`)가 등록돼 있습니다. 토스 API를 바꿀 때는 이 MCP의 `get-v2-documents` 등으로 최신 문서를 확인하세요. Node.js가 없으면 연결되지 않습니다. 이때는 문서 URL 끝에 `.md`를 붙여 원문 마크다운을 읽을 수 있습니다(예: `https://docs.tosspayments.com/llms.txt`).

## 스타일 관례

- CSS는 `css/style.css` 한 파일에 섹션 주석(`/* ---------- Header ---------- */`)으로 나눠 씁니다. 색상은 `:root` 변수(`--sale`, `--point`, `--gray-*`)를 씁니다. 반응형 기준은 1200/960/720px입니다.
- 폰트는 jsDelivr의 Pretendard를 씁니다.
- 코드 주석과 UI 문구는 한국어입니다.
