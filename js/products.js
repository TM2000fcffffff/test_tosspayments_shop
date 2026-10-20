// 상품 데이터 (데모용). price = 정가, discount = 할인율(%)
const PRODUCTS = [
  // ---------- 상의 ----------
  { id: 'T001', category: 'top', sub: '반소매', brand: 'LAYERED STUDIO', name: '오버핏 헤비코튼 반소매 티셔츠', price: 39000, discount: 30, color: '#ffffff', rating: 4.9, reviews: 12840, sizes: ['S', 'M', 'L', 'XL'] },
  { id: 'T002', category: 'top', sub: '반소매', brand: 'BASIC LAB', name: '데일리 크루넥 반소매 티셔츠 2팩', price: 29000, discount: 15, color: '#1c1c1c', rating: 4.8, reviews: 9210, sizes: ['S', 'M', 'L', 'XL'] },
  { id: 'T003', category: 'top', sub: '긴소매', brand: 'MOOD ARCHIVE', name: '피그먼트 워싱 롱슬리브', price: 49000, discount: 20, color: '#8a9a7b', rating: 4.7, reviews: 3120, sizes: ['M', 'L', 'XL'] },
  { id: 'T004', category: 'top', sub: '니트', brand: 'COVE', name: '램스울 라운드 니트 스웨터', price: 89000, discount: 35, color: '#c8b49a', rating: 4.9, reviews: 5402, sizes: ['S', 'M', 'L'] },
  { id: 'T005', category: 'top', sub: '셔츠', brand: 'PLAIN DAILY', name: '옥스포드 버튼다운 오버셔츠', price: 59000, discount: 25, color: '#a9c1df', rating: 4.8, reviews: 4230, sizes: ['S', 'M', 'L', 'XL'] },
  { id: 'T006', category: 'top', sub: '긴소매', brand: 'URBAN FIELD', name: '스트라이프 보트넥 긴소매 티', price: 45000, discount: 10, color: '#2b3a67', rating: 4.6, reviews: 1890, sizes: ['S', 'M', 'L'] },
  { id: 'T007', category: 'top', sub: '니트', brand: 'NORTHWAVE', name: '케이블 꽈배기 하프집업 니트', price: 99000, discount: 40, color: '#5c4033', rating: 4.8, reviews: 2210, sizes: ['M', 'L', 'XL'] },
  { id: 'T008', category: 'top', sub: '반소매', brand: 'RUNLINE', name: '드라이핏 퍼포먼스 반소매', price: 35000, discount: 20, color: '#d64545', rating: 4.7, reviews: 3360, sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'T009', category: 'top', sub: '셔츠', brand: 'MOOD ARCHIVE', name: '린넨 블렌드 오픈카라 셔츠', price: 69000, discount: 30, color: '#e8e2d0', rating: 4.6, reviews: 980, sizes: ['M', 'L', 'XL'] },
  { id: 'T010', category: 'top', sub: '긴소매', brand: 'LAYERED STUDIO', name: '루즈핏 스웻셔츠 맨투맨', price: 59000, discount: 25, color: '#9aa0a6', rating: 4.9, reviews: 7710, sizes: ['S', 'M', 'L', 'XL'] },

  // ---------- 신발 ----------
  { id: 'S001', category: 'shoes', sub: '스니커즈', brand: 'STRIDE', name: '클래식 로우탑 레더 스니커즈', price: 119000, discount: 20, color: '#ffffff', rating: 4.9, reviews: 15320, sizes: ['240', '250', '260', '270', '280'] },
  { id: 'S002', category: 'shoes', sub: '러닝화', brand: 'RUNLINE', name: '에어쿠션 데일리 러닝화', price: 139000, discount: 30, color: '#3a3f47', rating: 4.8, reviews: 8840, sizes: ['250', '260', '270', '280', '290'] },
  { id: 'S003', category: 'shoes', sub: '로퍼', brand: 'COVE', name: '페니 스웨이드 로퍼', price: 159000, discount: 25, color: '#6b4a2f', rating: 4.7, reviews: 2140, sizes: ['250', '260', '270', '280'] },
  { id: 'S004', category: 'shoes', sub: '부츠', brand: 'NORTHWAVE', name: '워커 레이스업 앵클 부츠', price: 189000, discount: 35, color: '#1d1d1d', rating: 4.8, reviews: 3070, sizes: ['250', '260', '270', '280'] },
  { id: 'S005', category: 'shoes', sub: '스니커즈', brand: 'URBAN FIELD', name: '캔버스 하이탑 스니커즈', price: 69000, discount: 15, color: '#c03a2b', rating: 4.6, reviews: 4410, sizes: ['230', '240', '250', '260', '270', '280'] },
  { id: 'S006', category: 'shoes', sub: '러닝화', brand: 'STRIDE', name: '라이트웨이트 메쉬 트레이너', price: 99000, discount: 20, color: '#7fa7c9', rating: 4.7, reviews: 1920, sizes: ['240', '250', '260', '270'] },
  { id: 'S007', category: 'shoes', sub: '부츠', brand: 'MOOD ARCHIVE', name: '첼시 레더 부츠', price: 209000, discount: 30, color: '#4a3526', rating: 4.9, reviews: 1350, sizes: ['250', '260', '270', '280'] },
  { id: 'S008', category: 'shoes', sub: '스니커즈', brand: 'BASIC LAB', name: '슬립온 데일리 스니커즈', price: 49000, discount: 10, color: '#2b2b2b', rating: 4.5, reviews: 2760, sizes: ['230', '240', '250', '260', '270'] },
  { id: 'S009', category: 'shoes', sub: '로퍼', brand: 'PLAIN DAILY', name: '태슬 레더 로퍼', price: 129000, discount: 20, color: '#121212', rating: 4.7, reviews: 860, sizes: ['250', '260', '270', '280'] },
  { id: 'S010', category: 'shoes', sub: '러닝화', brand: 'NORTHWAVE', name: '트레일 아웃도어 러닝화', price: 159000, discount: 25, color: '#8a8f5a', rating: 4.8, reviews: 1430, sizes: ['250', '260', '270', '280', '290'] },

  // ---------- 바지 ----------
  { id: 'P001', category: 'pants', sub: '데님', brand: 'DENIM FACTORY', name: '와이드 스트레이트 데님 팬츠', price: 69000, discount: 30, color: '#4a6a94', rating: 4.9, reviews: 18230, sizes: ['28', '30', '32', '34', '36'] },
  { id: 'P002', category: 'pants', sub: '슬랙스', brand: 'PLAIN DAILY', name: '세미와이드 히든밴딩 슬랙스', price: 49000, discount: 20, color: '#222222', rating: 4.8, reviews: 14520, sizes: ['S', 'M', 'L', 'XL'] },
  { id: 'P003', category: 'pants', sub: '카고', brand: 'URBAN FIELD', name: '나일론 파라슈트 카고 팬츠', price: 79000, discount: 35, color: '#6b6e4e', rating: 4.7, reviews: 5310, sizes: ['S', 'M', 'L', 'XL'] },
  { id: 'P004', category: 'pants', sub: '트레이닝', brand: 'RUNLINE', name: '스웻 조거 트레이닝 팬츠', price: 45000, discount: 15, color: '#8c8c8c', rating: 4.8, reviews: 6650, sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'P005', category: 'pants', sub: '데님', brand: 'DENIM FACTORY', name: '블랙 워싱 스트레이트 진', price: 72000, discount: 25, color: '#2a2d33', rating: 4.7, reviews: 4120, sizes: ['28', '30', '32', '34'] },
  { id: 'P006', category: 'pants', sub: '슬랙스', brand: 'COVE', name: '울 블렌드 투턱 와이드 슬랙스', price: 99000, discount: 30, color: '#7a6a58', rating: 4.8, reviews: 2380, sizes: ['S', 'M', 'L'] },
  { id: 'P007', category: 'pants', sub: '카고', brand: 'NORTHWAVE', name: '코튼 립스탑 카고 팬츠', price: 89000, discount: 20, color: '#c2b28f', rating: 4.6, reviews: 1760, sizes: ['M', 'L', 'XL'] },
  { id: 'P008', category: 'pants', sub: '트레이닝', brand: 'LAYERED STUDIO', name: '사이드 라인 트랙 팬츠', price: 59000, discount: 25, color: '#1f2e52', rating: 4.7, reviews: 2990, sizes: ['S', 'M', 'L', 'XL'] },
  { id: 'P009', category: 'pants', sub: '데님', brand: 'MOOD ARCHIVE', name: '라이트 블루 배기 데님', price: 79000, discount: 20, color: '#9bb6d4', rating: 4.8, reviews: 3540, sizes: ['28', '30', '32', '34'] },
  { id: 'P010', category: 'pants', sub: '슬랙스', brand: 'BASIC LAB', name: '데일리 테이퍼드 치노 팬츠', price: 39000, discount: 10, color: '#d8ccb4', rating: 4.6, reviews: 7020, sizes: ['S', 'M', 'L', 'XL'] },
];

const CATEGORIES = {
  top: { label: '상의', page: 'index.html', subs: ['전체', '반소매', '긴소매', '니트', '셔츠'] },
  shoes: { label: '신발', page: 'shoes.html', subs: ['전체', '스니커즈', '러닝화', '로퍼', '부츠'] },
  pants: { label: '바지', page: 'pants.html', subs: ['전체', '데님', '슬랙스', '카고', '트레이닝'] },
};

function salePrice(p) {
  return Math.floor((p.price * (100 - p.discount)) / 100 / 100) * 100;
}

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

// 상품 이미지 대신 쓰는 SVG 실루엣
const SHAPES = {
  tee: 'M70 46 L48 54 L24 82 L42 100 L58 88 L58 172 L142 172 L142 88 L158 100 L176 82 L152 54 L130 46 Q100 68 70 46 Z',
  long: 'M72 44 L48 52 Q36 58 34 76 L26 166 L46 168 L58 94 L58 172 L142 172 L142 94 L154 168 L174 166 L166 76 Q164 58 152 52 L128 44 Q100 64 72 44 Z',
  shirt: 'M72 44 L48 52 Q36 58 34 76 L26 166 L46 168 L58 94 L58 172 L142 172 L142 94 L154 168 L174 166 L166 76 Q164 58 152 52 L128 44 L112 62 L100 50 L88 62 Z',
  pants: 'M64 36 L136 36 L146 180 L110 180 L100 84 L90 180 L54 180 Z',
  sneaker: 'M28 136 L28 110 Q36 100 58 96 L94 78 Q106 74 114 82 L132 102 Q162 108 174 122 L174 138 Q174 144 168 144 L34 144 Q28 144 28 136 Z',
  boot: 'M58 52 L108 52 L110 112 Q150 116 170 130 L172 144 Q172 150 166 150 L60 150 Q56 150 56 144 Z',
};

function shapeFor(p) {
  if (p.category === 'pants') return 'pants';
  if (p.category === 'shoes') return p.sub === '부츠' ? 'boot' : 'sneaker';
  if (p.sub === '셔츠') return 'shirt';
  if (p.sub === '반소매') return 'tee';
  return 'long';
}

function thumbSVG(p) {
  const shape = shapeFor(p);
  const isShoe = p.category === 'shoes';
  const sole = isShoe
    ? `<rect x="${shape === 'boot' ? 56 : 28}" y="${shape === 'boot' ? 146 : 140}" width="${shape === 'boot' ? 116 : 146}" height="9" rx="3" fill="#fafafa" stroke="rgba(0,0,0,.15)"/>`
    : '';
  const detail =
    shape === 'pants'
      ? '<line x1="64" y1="48" x2="136" y2="48" stroke="rgba(0,0,0,.18)" stroke-width="2"/>'
      : shape === 'shirt'
      ? '<line x1="100" y1="54" x2="100" y2="172" stroke="rgba(0,0,0,.15)" stroke-width="1.5"/>'
      : '';
  return `<svg viewBox="0 0 200 220" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <path d="${SHAPES[shape]}" fill="${p.color}" stroke="rgba(0,0,0,.14)" stroke-width="1.5" stroke-linejoin="round" transform="translate(0 ${isShoe ? 14 : 4})"/>
    <g transform="translate(0 ${isShoe ? 14 : 4})">${sole}${detail}</g>
  </svg>`;
}
