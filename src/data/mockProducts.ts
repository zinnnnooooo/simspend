import { ShoppingProduct } from '@/@types';
import rolexImg from '../../design/rolex.jpg';
import chanelImg from '../../design/chanel.jpg';
import ringImg from '../../design/ring.jpg';
import hermesImg from '../../design/hermes.jpg';
import lvImg from '../../design/lv.jpg';
import omegaImg from '../../design/omega..jpg';
import hermesBagImg from '../../design/hermes_bag.jpg';
import diorImg from '../../design/dior.jpg';
import nbImg from '../../design/nb.jpg';
import mmImg from '../../design/mm.jpg';
import iphoneImg from '../../design/iphone.jpg';
import sonyImg from '../../design/sony.jpg';
import galaxyImg from '../../design/galaxy.jpg';
import maxImg from '../../design/max.jpg';
import awatchImg from '../../design/awatch.jpg';
import mcbookImg from '../../design/mcbook.jpg';
import ipadImg from '../../design/ipad.jpg';
import leicaImg from '../../design/leica.jpg';

export const mockProducts: ShoppingProduct[] = [
  // ==========================================
  // === 1. 고가 전자제품 (Premium Electronics) ===
  // ==========================================
  {
    id: 'prod_digital_phone_01',
    name: 'iPhone 16 Pro Max 1TB 내추럴 티타늄',
    category: '전자기기',
    brand: 'Apple',
    originalPrice: 2500000,
    discountRate: 10,
    price: 2250000,
    savedAmount: 250000,
    image: iphoneImg,
    badge: 'BEST',
    rating: 4.9,
    reviewCount: 540,
    colors: ['#A49E93', '#2F3238', '#F2F2F2', '#3D3E42'],
    options: [
      {
        name: '저장 용량',
        required: true,
        options: [
          { name: '512GB (-300,000원)', priceDelta: -300000 },
          { name: '1TB (기본 선택)', priceDelta: 0 }
        ]
      },
      {
        name: 'AppleCare+ 파손 보증',
        required: false,
        options: [
          { name: '선택 안 함', priceDelta: 0 },
          { name: 'AppleCare+ 2년 결합 (+329,000원)', priceDelta: 329000 }
        ]
      }
    ],
    description: 'A18 Pro 칩셋과 5배 광학 줌 테트라프리즘 카메라, 경량 에어로스페이스 등급 티타늄 디자인을 탑재한 애플의 최상위 플래그십 스마트폰입니다.',
    specs: [
      { label: '디스플레이', value: '6.9인치 Super Retina XDR ProMotion 120Hz' },
      { label: '프로세서', value: 'Apple A18 Pro 칩 (3nm)' },
      { label: '카메라', value: '48MP 퓨전 메인 + 48MP 초광각 + 12MP 5배 망원' },
      { label: '무게', value: '227g' }
    ],
    reviews: [
      {
        id: 'rev_phone_01',
        author: 'tech_master',
        rating: 5,
        date: '2026-08-05',
        content: '가상 쇼핑으로 지르니 25만원이나 아끼고 대리만족 100%입니다! 카메라 성능이랑 배터리가 미쳤어요.'
      }
    ]
  },
  {
    id: 'prod_digital_phone_02',
    name: '갤럭시 S24 울트라 512GB 티타늄 그레이',
    category: '전자기기',
    brand: 'Samsung',
    originalPrice: 1841400,
    discountRate: 15,
    price: 1565190,
    savedAmount: 276210,
    image: galaxyImg,
    badge: 'HOT',
    rating: 4.8,
    reviewCount: 390,
    colors: ['#4E5057', '#E4E5E9', '#F9F5EA', '#333742'],
    options: [
      {
        name: '용량 선택',
        required: true,
        options: [
          { name: '256GB (-140,000원)', priceDelta: -140000 },
          { name: '512GB (기본 선택)', priceDelta: 0 },
          { name: '1TB (+280,000원)', priceDelta: 280000 }
        ]
      }
    ],
    description: 'Galaxy AI 실시간 통역 및 2억 화소 카메라, S펜 내장과 평면 티타늄 디스플레이가 적용된 최상위 프리미엄 폰입니다.',
    specs: [
      { label: '디스플레이', value: '6.8인치 QHD+ Dynamic AMOLED 2X' },
      { label: '프로세서', value: 'Snapdragon 8 Gen 3 for Galaxy' },
      { label: '카메라', value: '2억 화소 광각 + 50MP 5배 망원 + 10MP 3배 망원' },
      { label: '배터리', value: '5,000mAh (45W 고속 충전)' }
    ]
  },
  {
    id: 'prod_digital_laptop_01',
    name: 'MacBook Pro 16 M3 Max 48GB 1TB 스페이스 블랙',
    category: '전자기기',
    brand: 'Apple',
    originalPrice: 5190000,
    discountRate: 12,
    price: 4567200,
    savedAmount: 622800,
    image: mcbookImg,
    badge: 'BEST',
    rating: 5.0,
    reviewCount: 210,
    colors: ['#1F2022', '#DCDDE1'],
    options: [
      {
        name: '통합 메모리 구성',
        required: true,
        options: [
          { name: '48GB 통합 메모리 (기본)', priceDelta: 0 },
          { name: '64GB 통합 메모리 (+540,000원)', priceDelta: 540000 },
          { name: '128GB 통합 메모리 (+1,350,000원)', priceDelta: 1350000 }
        ]
      }
    ],
    description: '극강의 워크플로우를 위한 16코어 CPU, 40코어 GPU의 M3 Max 칩 탑재. 전문 영상 편집과 3D 렌더링, 머신러닝 개발을 위한 끝판왕 랩탑입니다.',
    specs: [
      { label: '디스플레이', value: '16.2인치 Liquid Retina XDR (120Hz)' },
      { label: '칩셋', value: 'Apple M3 Max (16코어 CPU / 40코어 GPU)' },
      { label: '배터리', value: '최대 22시간 동영상 재생' },
      { label: '포트', value: 'Thunderbolt 4 x 3, HDMI, SDXC, MagSafe 3' }
    ]
  },
  {
    id: 'prod_digital_tablet_01',
    name: 'iPad Pro 13인치 M4 1TB Ultra Retina XDR',
    category: '전자기기',
    brand: 'Apple',
    originalPrice: 2890000,
    discountRate: 14,
    price: 2485400,
    savedAmount: 404600,
    image: ipadImg,
    badge: 'HOT',
    rating: 4.9,
    reviewCount: 185,
    colors: ['#2B2D30', '#E5E7EB'],
    options: [
      {
        name: '디스플레이 글래스',
        required: true,
        options: [
          { name: '표준 글래스', priceDelta: 0 },
          { name: 'Nano-texture 글래스 (+150,000원)', priceDelta: 150000 }
        ]
      },
      {
        name: '액세서리 패키지',
        required: false,
        options: [
          { name: '본품 단품', priceDelta: 0 },
          { name: 'Apple Pencil Pro 결합 (+195,000원)', priceDelta: 195000 },
          { name: 'Magic Keyboard 풀패키지 (+449,000원)', priceDelta: 449000 }
        ]
      }
    ],
    description: '놀랍도록 얇은 5.1mm 두께에 탠덤 OLED 기술의 Ultra Retina XDR과 차세대 M4 칩을 탑재한 현존 최강의 태블릿입니다.'
  },
  {
    id: 'prod_digital_watch_01',
    name: 'Apple Watch Ultra 2 GPS + Cellular 49mm 티타늄',
    category: '전자기기',
    brand: 'Apple',
    originalPrice: 1149000,
    discountRate: 15,
    price: 976650,
    savedAmount: 172350,
    image: awatchImg,
    badge: '추천',
    rating: 4.9,
    reviewCount: 310,
    colors: ['#A39E93', '#2B2C30'],
    options: [
      {
        name: '밴드 종류',
        required: true,
        options: [
          { name: '오션 밴드 (워터스포츠용)', priceDelta: 0 },
          { name: '알파인 루프 (아웃도어용)', priceDelta: 0 },
          { name: '트레일 루프 (초경량 러닝용)', priceDelta: 0 },
          { name: '티타늄 밀레니즈 루프 (+160,000원)', priceDelta: 160000 }
        ]
      }
    ],
    description: '항공우주 등급 49mm 티타늄 케이스와 최대 3,000니트 밝기, 정밀 이중 주파수 GPS를 탑재한 극한 환경용 스마트워치입니다.'
  },
  {
    id: 'prod_digital_headphone_01',
    name: '에어팟 맥스 스페이스 그레이',
    category: '전자기기',
    brand: 'Apple',
    originalPrice: 769000,
    discountRate: 15,
    price: 653650,
    savedAmount: 115350,
    image: maxImg,
    badge: 'BEST',
    rating: 4.9,
    reviewCount: 328,
    colors: ['#3C3D42', '#E2E4E9', '#D9B99B', '#4E6578', '#E6A5A1'],
    description: '원음에 충실한 하이파이 오디오와 업계 최고 수준의 액티브 노이즈 캔슬링을 갖춘 프리미엄 오버이어 헤드폰입니다.'
  },
  {
    id: 'prod_digital_headphone_02',
    name: 'WH-1000XM5 프리미엄 무선 노이즈 캔슬링 헤드폰',
    category: '전자기기',
    brand: 'Sony',
    originalPrice: 479000,
    discountRate: 20,
    price: 383200,
    savedAmount: 95800,
    image: sonyImg,
    badge: 'HOT',
    rating: 4.9,
    reviewCount: 460,
    colors: ['#1C1D21', '#E8E4D9', '#2E3D52'],
    description: '8개의 마이크와 Auto NC Optimizer로 정밀 제어되는 독보적인 노이즈 캔슬링 헤드폰입니다.'
  },
  {
    id: 'prod_digital_camera_01',
    name: 'Leica Q3 풀프레임 컴팩트 카메라 28mm F1.7',
    category: '전자기기',
    brand: 'Leica',
    originalPrice: 9450000,
    discountRate: 8,
    price: 8694000,
    savedAmount: 756000,
    image: leicaImg,
    badge: 'BEST',
    rating: 5.0,
    reviewCount: 94,
    colors: ['#1A1A1A'],
    description: '6,000만 화소 BSI CMOS 센서와 전설적인 Summilux 28mm f/1.7 ASPH 렌즈가 탑재된 독일 명품 카메라입니다.',
    specs: [
      { label: '센서', value: '60MP / 36MP / 18MP 삼중 해상도 풀프레임' },
      { label: '렌즈', value: 'Leica Summilux 28 f/1.7 ASPH (매크로 지원)' },
      { label: '동영상', value: '최대 8K 30fps / C4K 60fps ProRes 녹화' },
      { label: '원산지', value: 'Made in Germany (독일 수제작)' }
    ]
  },

  // ==========================================
  // === 2. 명품 (Luxury Goods) ===
  // ==========================================
  {
    id: 'prod_lux_bag_01',
    name: '클래식 미디엄 플랩 백 캐비어 스킨 블랙 금장',
    category: '명품',
    brand: 'CHANEL',
    originalPrice: 15570000,
    discountRate: 5,
    price: 14791500,
    savedAmount: 778500,
    image: chanelImg,
    badge: 'BEST',
    rating: 5.0,
    reviewCount: 420,
    colors: ['#1A1A1A'],
    options: [
      {
        name: '하드웨어(체인 메탈)',
        required: true,
        options: [
          { name: '골드 하드웨어 (금장)', priceDelta: 0 },
          { name: '실버 하드웨어 (은장)', priceDelta: 0 }
        ]
      }
    ],
    description: '샤넬의 상징적인 다이아몬드 퀼팅 캐비어 가죽과 CC 턴락 잠금장치, 가죽이 엮인 체인 스트랩의 영원한 클래식 백입니다.',
    specs: [
      { label: '크기', value: '15.5 x 25.5 x 6.5 cm' },
      { label: '소재', value: 'Grained Calfskin (그레인드 카프스킨)' },
      { label: '제조국', value: '프랑스 / 이탈리아' }
    ],
    reviews: [
      {
        id: 'rev_lux_01',
        author: 'luxury_holic',
        rating: 5,
        date: '2026-08-02',
        content: '샤넬 백을 가상으로 사보니까 통장에 1500만원이 그대로 남아있는 기적! 절약 효과 최고입니다.'
      }
    ]
  },
  {
    id: 'prod_lux_bag_02',
    name: '버킨 30 토고 골드 카프스킨 금장',
    category: '명품',
    brand: 'HERMÈS',
    originalPrice: 21500000,
    discountRate: 3,
    price: 20855000,
    savedAmount: 645000,
    image: hermesBagImg,
    badge: 'HOT',
    rating: 5.0,
    reviewCount: 160,
    colors: ['#A0522D', '#1A1A1A', '#E8D8C8'],
    description: '에르메스 장인의 수작업 새들 스티치로 완성되는 세계에서 가장 상징적인 최고급 럭셔리 토트백입니다.'
  },
  {
    id: 'prod_lux_wallet_01',
    name: '사라 월릿 모노그램 앙프렝뜨 장지갑',
    category: '명품',
    brand: 'LOUIS VUITTON',
    originalPrice: 1380000,
    discountRate: 10,
    price: 1242000,
    savedAmount: 138000,
    image: lvImg,
    badge: 'BEST',
    rating: 4.9,
    reviewCount: 230,
    colors: ['#1F2430', '#7B3F00'],
    description: '부드러운 모노그램 앙프렝뜨 양각 엠보싱 천연 소가죽으로 제작된 우아한 엔벨로프 스타일 장지갑입니다.'
  },
  {
    id: 'prod_lux_watch_01',
    name: '서브마리너 데이트 오이스터스틸 41mm 블랙',
    category: '명품',
    brand: 'ROLEX',
    originalPrice: 14710000,
    discountRate: 5,
    price: 13974500,
    savedAmount: 735500,
    image: rolexImg,
    badge: 'BEST',
    rating: 5.0,
    reviewCount: 510,
    colors: ['#1A1A1A'],
    description: '수심 300m 방수를 자랑하는 전설적인 다이버 워치. 세라크롬 베젤과 부식 방지 904L 오이스터스틸의 걸작입니다.',
    specs: [
      { label: '케이스', value: '41mm 오이스터스틸 (Oystersteel)' },
      { label: '무브먼트', value: '롤렉스 매뉴팩처 칼리버 3235 (오토매틱)' },
      { label: '파워리저브', value: '약 70시간' },
      { label: '방수', value: '300m / 1,000피트' }
    ]
  },
  {
    id: 'prod_lux_watch_02',
    name: '스피드마스터 문워치 프로페셔널 코-액시얼 42mm',
    category: '명품',
    brand: 'OMEGA',
    originalPrice: 10800000,
    discountRate: 12,
    price: 9504000,
    savedAmount: 1296000,
    image: omegaImg,
    badge: '추천',
    rating: 4.9,
    reviewCount: 180,
    colors: ['#202124'],
    description: '달 표면에서 착용된 최초의 시계. 인류의 우주 탐험 역사와 함께한 전설적인 크로노그래프입니다.'
  },
  {
    id: 'prod_lux_shoe_01',
    name: '오란 샌들 카프스킨 골드 에프송',
    category: '명품',
    brand: 'HERMÈS',
    originalPrice: 1040000,
    discountRate: 8,
    price: 956800,
    savedAmount: 83200,
    image: hermesImg,
    badge: 'HOT',
    rating: 4.8,
    reviewCount: 290,
    colors: ['#9E693F', '#FFFFFF', '#1A1A1A'],
    options: [
      {
        name: '사이즈 (EU)',
        required: true,
        options: [
          { name: '36 (230mm)', priceDelta: 0 },
          { name: '37 (240mm)', priceDelta: 0 },
          { name: '38 (250mm)', priceDelta: 0 }
        ]
      }
    ],
    description: '상징적인 H 시그니처 컷아웃 디자인의 에르메스 대표 여름 아이코닉 슬라이드 샌들입니다.'
  },
  {
    id: 'prod_lux_cloth_01',
    name: '오블리크 실크 트윌 반소매 셔츠',
    category: '명품',
    brand: 'DIOR',
    originalPrice: 2400000,
    discountRate: 15,
    price: 2040000,
    savedAmount: 360000,
    image: diorImg,
    badge: 'HOT',
    rating: 4.9,
    reviewCount: 88,
    colors: ['#2A3950'],
    options: [
      {
        name: '사이즈',
        required: true,
        options: [
          { name: '46 (95~100)', priceDelta: 0 },
          { name: '48 (100~105)', priceDelta: 0 },
          { name: '50 (105~110)', priceDelta: 0 }
        ]
      }
    ],
    description: '올오버 디올 오블리크(Dior Oblique) 자카드 패턴의 최고급 실크 트윌 소재 럭셔리 셔츠입니다.'
  },
  {
    id: 'prod_lux_jewel_01',
    name: 'LOVE 링 18K 옐로우 골드 클래식',
    category: '명품',
    brand: 'Cartier',
    originalPrice: 2610000,
    discountRate: 6,
    price: 2453400,
    savedAmount: 156600,
    image: ringImg,
    badge: 'BEST',
    rating: 5.0,
    reviewCount: 380,
    colors: ['#E6CA65', '#E3C1B4', '#E0E0E0'],
    options: [
      {
        name: '소재 컬러',
        required: true,
        options: [
          { name: '18K 옐로우 골드', priceDelta: 0 },
          { name: '18K 핑크 골드', priceDelta: 0 },
          { name: '18K 화이트 골드 (+180,000원)', priceDelta: 180000 }
        ]
      }
    ],
    description: '1970년대 뉴욕에서 탄생한 까르띠에의 전설적인 스크루 모티프 러브 링 컬렉션입니다.'
  },

  // ==========================================
  // === 3. 패션 (Fashion) ===
  // ==========================================
  {
    id: 'prod_fashion_01',
    name: '헤비웨이트 오버핏 시그니처 후드티',
    category: '패션',
    brand: 'Mardi Maison',
    originalPrice: 89000,
    discountRate: 35,
    price: 57850,
    savedAmount: 31150,
    image: mmImg,
    badge: 'BEST',
    rating: 4.9,
    reviewCount: 420,
    colors: ['#1E1F2E', '#9CA3AF', '#3B82F6', '#10B981'],
    description: '고중량 프리미엄 코튼 100% 원단으로 탄탄한 핏을 유지하는 데일리 후드입니다.'
  },
  {
    id: 'prod_fashion_02',
    name: '어반 러닝 스니커즈 블랑',
    category: '패션',
    brand: 'New Balance',
    originalPrice: 169000,
    discountRate: 20,
    price: 135200,
    savedAmount: 33800,
    image: nbImg,
    badge: 'HOT',
    rating: 4.9,
    reviewCount: 512,
    colors: ['#FFFFFF', '#1F2937', '#9CA3AF'],
    description: '최상의 쿠셔닝과 트렌디한 레트로 디자인으로 일상과 러닝을 모두 소화합니다.'
  },

  // ==========================================
  // === 4. 뷰티 (Beauty) ===
  // ==========================================
  {
    id: 'prod_beauty_01',
    name: '딥 하이드레이팅 세럼 & 크림 세트',
    category: '뷰티',
    brand: 'Aesop',
    originalPrice: 125000,
    discountRate: 24,
    price: 95000,
    savedAmount: 30000,
    image: 'https://images.unsplash.com/photo-1608248597359-00f73f5509cf?w=600&auto=format&fit=crop&q=80',
    badge: 'BEST',
    rating: 4.9,
    reviewCount: 215,
    description: '식물성 추출물이 지친 피부에 풍부한 수분과 항산화 영양을 공급합니다.'
  },
  {
    id: 'prod_beauty_02',
    name: '우디 시트러스 오 드 퍼퓸 50ml',
    category: '뷰티',
    brand: 'Byredo',
    originalPrice: 280000,
    discountRate: 15,
    price: 238000,
    savedAmount: 42000,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
    badge: '추천',
    rating: 4.8,
    reviewCount: 142,
    description: '새벽 숲의 맑은 공기와 상쾌한 베르가못이 어우러진 시그니처 니치 향수입니다.'
  },

  // ==========================================
  // === 5. 생활용품 (Living) ===
  // ==========================================
  {
    id: 'prod_living_01',
    name: '진공 단열 스테인리스 텀블러 591ml',
    category: '생활용품',
    brand: 'Stanley',
    originalPrice: 49000,
    discountRate: 25,
    price: 36750,
    savedAmount: 12250,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    badge: 'BEST',
    rating: 4.9,
    reviewCount: 680,
    colors: ['#F3F4F6', '#10B981', '#F59E0B'],
    description: '최대 24시간 보냉력을 자랑하는 친환경 텀블러입니다.'
  },
  {
    id: 'prod_living_03',
    name: '스마트 타이머 핸드드립 커피 머신',
    category: '생활용품',
    brand: 'Balmuda',
    originalPrice: 389000,
    discountRate: 18,
    price: 318980,
    savedAmount: 70020,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80',
    badge: 'HOT',
    rating: 4.8,
    reviewCount: 110,
    description: '바리스타의 정밀한 추출 테크닉을 재현한 프리미엄 드립 머신입니다.'
  },



  // ==========================================
  // === 7. 스포츠 (Sports) ===
  // ==========================================
  {
    id: 'prod_sports_01',
    name: '프리미엄 NBR 친환경 요가매트 10mm',
    category: '스포츠',
    brand: 'Lululemon Studio',
    originalPrice: 62000,
    discountRate: 32,
    price: 42160,
    savedAmount: 19840,
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80',
    badge: 'BEST',
    rating: 4.9,
    reviewCount: 260,
    description: '뛰어난 충격 흡수력과 미끄럼 방지 텍스처로 홈트레이닝을 돕습니다.'
  }
];

// === 헬퍼 함수들 ===

/**
 * ID로 특정 상품 조회
 */
export const getProductById = (id: string): ShoppingProduct | undefined => {
  return mockProducts.find(p => p.id === id);
};

/**
 * 카테고리별 상품 목록 조회
 */
export const getProductsByCategory = (category?: string): ShoppingProduct[] => {
  if (!category || category === '전체' || category === '전체보기') {
    return mockProducts;
  }
  return mockProducts.filter(p => p.category === category);
};

/**
 * 인기/추천 상품 조회
 */
export const getFeaturedProducts = (limit = 6): ShoppingProduct[] => {
  return [...mockProducts]
    .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
    .slice(0, limit);
};

/**
 * 핫딜(할인율 및 절약금액 높은 순) 상품 조회
 */
export const getHotDeals = (limit = 6): ShoppingProduct[] => {
  return [...mockProducts]
    .sort((a, b) => b.savedAmount - a.savedAmount)
    .slice(0, limit);
};

/**
 * 배열 랜덤 셔플
 */
export const shuffleProducts = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
