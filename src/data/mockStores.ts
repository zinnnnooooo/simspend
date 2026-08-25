export interface OptionItem {
  name: string;
  price: number;
}

export interface OptionGroup {
  name: string;
  required: boolean;
  options: OptionItem[];
}

export interface StoreMenu {
  name: string;
  price: number;
  desc: string;
  optionGroups?: OptionGroup[];
}

export interface Store {
  id: string;
  name: string;
  emoji: string;
  image?: string;
  rating: number;
  reviewCount: number;
  menuTags: string[];
  category: string;
  etaLabel: string;
  deliveryFee: string;
  minOrder: number;
  price: number;
  savingLabel: string;
  badge?: string;
  menus?: StoreMenu[];
}

export const mockStores: Store[] = [
  // === 한식 ===
  {
    id: 'store_korean_01',
    name: '백종원가상쌈밥 역삼본점',
    emoji: '🍲',
    rating: 4.6,
    reviewCount: 95,
    menuTags: ['제육쌈밥정식', '우삼겹쌈밥'],
    category: '한식',
    etaLabel: '20~30분',
    deliveryFee: '무료',
    minOrder: 15000,
    price: 12000,
    savingLabel: '모둠쌈채소 제공',
    badge: '추천',
    menus: [
      {
        name: '매콤 제육 쌈밥 정식',
        price: 12000,
        desc: '불향 가득한 제육볶음과 유기농 모둠 쌈정식',
        optionGroups: [
          {
            name: '밥 종류 선택',
            required: true,
            options: [
              { name: '백미공깃밥', price: 0 },
              { name: '건강 보리밥 변경', price: 1000 },
              { name: '찰오곡밥 변경', price: 1500 }
            ]
          },
          {
            name: '사이드 반찬 추가',
            required: false,
            options: [
              { name: '우렁강된장 추가', price: 3000 },
              { name: '계란후라이 추가', price: 1000 }
            ]
          }
        ]
      },
      {
        name: '간장 우삼겹 쌈밥 정식',
        price: 13000,
        desc: '달콤한 비법 소스로 볶아낸 우삼겹 정식',
        optionGroups: [
          {
            name: '고기 양 선택',
            required: true,
            options: [
              { name: '보통 (150g)', price: 0 },
              { name: '고기 곱빼기 (250g)', price: 4000 }
            ]
          },
          {
            name: '추가 메뉴',
            required: false,
            options: [
              { name: '구이용 생마늘/고추 추가', price: 500 },
              { name: '김치찌개 추가', price: 3500 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'store_korean_02',
    name: '한샘가상국밥 역삼점',
    emoji: '🍲',
    rating: 4.7,
    reviewCount: 180,
    menuTags: ['순대국밥', '수육국밥', '모둠순대'],
    category: '한식',
    etaLabel: '15~25분',
    deliveryFee: '1,000원',
    minOrder: 10000,
    price: 9000,
    savingLabel: '든든한 한끼 할인',
    menus: [
      {
        name: '진국 순대국밥',
        price: 9000,
        desc: '직접 우려낸 깊고 구수한 순대국밥',
        optionGroups: [
          {
            name: '순대 옵션 선택',
            required: true,
            options: [
              { name: '고기+순대 섞어', price: 0 },
              { name: '순대만 넣어주세요', price: 0 },
              { name: '고기만 넣어주세요', price: 0 }
            ]
          },
          {
            name: '국밥 양념/사이드',
            required: false,
            options: [
              { name: '얼큰 다대기 양념 따로', price: 0 },
              { name: '들깨가루 듬뿍 추가', price: 500 },
              { name: '맛보기 머릿고기 추가', price: 5000 }
            ]
          }
        ]
      },
      {
        name: '명가 수육국밥',
        price: 9500,
        desc: '부드러운 살코기가 듬뿍 들어간 맑은 국밥',
        optionGroups: [
          {
            name: '수육 사이즈',
            required: true,
            options: [
              { name: '일반 사이즈', price: 0 },
              { name: '특 (고기 곱빼기)', price: 2000 }
            ]
          },
          {
            name: '토핑 선택',
            required: false,
            options: [
              { name: '향긋한 부추 가득 추가', price: 500 },
              { name: '소면 사리 추가', price: 1000 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'store_korean_03',
    name: '도란도란가상갈비찜',
    emoji: '🍖',
    rating: 4.9,
    reviewCount: 95,
    menuTags: ['매운갈비찜', '간장갈비찜'],
    category: '한식',
    etaLabel: '30~40분',
    deliveryFee: '무료',
    minOrder: 24000,
    price: 28000,
    savingLabel: '배달비 무료 혜택',
    badge: '인기',
    menus: [
      {
        name: '중독 매운 갈비찜 (소)',
        price: 28000,
        desc: '스트레스 날리는 매콤함, 부드러운 돼지 갈비찜',
        optionGroups: [
          {
            name: '매운맛 조절',
            required: true,
            options: [
              { name: '1단계 (신라면 수준)', price: 0 },
              { name: '2단계 (매니아 추천)', price: 0 },
              { name: '3단계 (눈물 쏙 지옥맛)', price: 500 }
            ]
          },
          {
            name: '모둠 사리 추가',
            required: false,
            options: [
              { name: '쫄깃 납작당면 사리', price: 2000 },
              { name: '말랑 치즈떡 사리', price: 1500 },
              { name: '고소한 치즈 토핑 추가', price: 3000 }
            ]
          }
        ]
      },
      {
        name: '달콤 소갈비찜 (소)',
        price: 35000,
        desc: '과일 양념으로 부드럽게 재운 최고급 소갈비찜',
        optionGroups: [
          {
            name: '공깃밥 포함 여부',
            required: true,
            options: [
              { name: '공깃밥 별도 (고기만)', price: 0 },
              { name: '공깃밥 2개 추가', price: 2000 }
            ]
          },
          {
            name: '추가 사리',
            required: false,
            options: [
              { name: '알감자 사리 추가', price: 1500 },
              { name: '모둠 야채 사리 추가', price: 2000 }
            ]
          }
        ]
      }
    ]
  },

  // === 분식 ===
  {
    id: 'store_boonsik_01',
    name: '엽기가상떡볶이 강남역점',
    emoji: '🌶️',
    rating: 4.9,
    reviewCount: 520,
    menuTags: ['엽기떡볶이', '주먹김밥', '모둠튀김'],
    category: '분식',
    etaLabel: '35~45분',
    deliveryFee: '2,000원',
    minOrder: 14000,
    price: 14000,
    savingLabel: '음료수 서비스',
    badge: '인기',
    menus: [
      {
        name: '엽기 떡볶이 (기본맛)',
        price: 14000,
        desc: '중독성 강한 매운맛의 국민 대표 떡볶이',
        optionGroups: [
          {
            name: '매운 강도 선택',
            required: true,
            options: [
              { name: '초보맛', price: 0 },
              { name: '덜매운맛', price: 0 },
              { name: '오리지널 엽떡맛', price: 0 }
            ]
          },
          {
            name: '기본 떡/오뎅 비율',
            required: true,
            options: [
              { name: '엽기떡볶이 (떡 많이)', price: 0 },
              { name: '엽기오뎅 (오뎅 많이)', price: 0 },
              { name: '엽기반반 (떡 반 오뎅 반)', price: 0 }
            ]
          },
          {
            name: '토핑 추가',
            required: false,
            options: [
              { name: '모짜렐라 치즈 폭탄', price: 3000 },
              { name: '중국당면 추가', price: 2500 },
              { name: '비엔나소시지 (7개)', price: 1000 }
            ]
          }
        ]
      },
      {
        name: '바삭 모둠 튀김 (5개)',
        price: 4000,
        desc: '김말이, 야채튀김, 만두 등 모둠 구성',
        optionGroups: [
          {
            name: '튀김 구성 변경',
            required: true,
            options: [
              { name: '바삭 기본 구성', price: 0 },
              { name: '오징어 튀김 2개로 변경', price: 1000 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'store_boonsik_02',
    name: '남다르가상김밥',
    emoji: '🍙',
    rating: 4.5,
    reviewCount: 140,
    menuTags: ['참치김밥', '돈까스김밥', '국물떡볶이'],
    category: '분식',
    etaLabel: '15~25분',
    deliveryFee: '2,000원',
    minOrder: 9000,
    price: 4500,
    savingLabel: '실속 주문 할인',
    menus: [
      {
        name: '꽉찬 참치 마요 김밥',
        price: 4500,
        desc: '참치와 마요네즈가 듬뿍 들어간 영양 김밥',
        optionGroups: [
          {
            name: '오이 제외 선택',
            required: true,
            options: [
              { name: '오이 포함 (기본)', price: 0 },
              { name: '오이 빼주세요', price: 0 }
            ]
          },
          {
            name: '디핑 소스류',
            required: false,
            options: [
              { name: '고소한 청양마요소스', price: 500 },
              { name: '매콤 겨자소스', price: 500 }
            ]
          }
        ]
      },
      {
        name: '수제 등심 돈까스 김밥',
        price: 4800,
        desc: '바삭한 돈까스가 통째로 들어간 별미 김밥',
        optionGroups: [
          {
            name: '토핑 업그레이드',
            required: false,
            options: [
              { name: '고소한 슬라이스 치즈 추가', price: 800 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'store_boonsik_03',
    name: '청년가상신전떡볶이',
    emoji: '🍢',
    rating: 4.8,
    reviewCount: 320,
    menuTags: ['치즈떡볶이', '오뎅튀김', '신전김밥'],
    category: '분식',
    etaLabel: '20~30분',
    deliveryFee: '1,500원',
    minOrder: 12000,
    price: 6000,
    savingLabel: '쿨피스 무료 증정',
    menus: [
      {
        name: '치즈 폭탄 신전 떡볶이',
        price: 6000,
        desc: '고소한 모짜렐라 치즈가 듬뿍 올라간 국물 떡볶이',
        optionGroups: [
          {
            name: '매운 맵기 설정',
            required: true,
            options: [
              { name: '순한맛', price: 0 },
              { name: '중간 매운맛', price: 0 },
              { name: '매운맛 폭탄', price: 0 }
            ]
          },
          {
            name: '신전 필수 사이드',
            required: false,
            options: [
              { name: '신전튀김오뎅 (6개) 추가', price: 2000 },
              { name: '잡채말이 튀김 (3개) 추가', price: 2000 },
              { name: '매운 신전 치즈김밥 추가', price: 4000 }
            ]
          }
        ]
      }
    ]
  },

  // === 버거 ===
  {
    id: 'store_burger_01',
    name: '쉑쉑가상버거 강남점',
    emoji: '🍔',
    rating: 4.8,
    reviewCount: 450,
    menuTags: ['쉑버거', '스모크쉑', '치즈프라이'],
    category: '버거',
    etaLabel: '15~25분',
    deliveryFee: '1,500원',
    minOrder: 12000,
    price: 10900,
    savingLabel: '세트 주문 시 할인',
    badge: '인기',
    menus: [
      {
        name: '쉑 버거 (Single)',
        price: 8900,
        desc: '비프패티와 토마토, 쉑소스가 토핑된 수제버거',
        optionGroups: [
          {
            name: '패티 종류 선택',
            required: true,
            options: [
              { name: '싱글 비프패티 (Single)', price: 0 },
              { name: '더블 비프패티로 변경 (Double)', price: 4500 }
            ]
          },
          {
            name: '치즈/야채 추가',
            required: false,
            options: [
              { name: '아메리칸 슬라이스 치즈 추가', price: 1000 },
              { name: '훈제 베이컨 토핑 추가', price: 2000 }
            ]
          }
        ]
      },
      {
        name: '스모크 쉑 버거',
        price: 10900,
        desc: '베이컨과 체리 페퍼가 들어간 스모키한 버거',
        optionGroups: [
          {
            name: '세트 구성 업그레이드',
            required: false,
            options: [
              { name: '크링클컷 감자튀김 추가', price: 4800 },
              { name: '치즈 소스 감자튀김으로 변경', price: 5900 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'store_burger_02',
    name: '맥도날가상버거 선릉점',
    emoji: '🍔',
    rating: 4.4,
    reviewCount: 900,
    menuTags: ['빅맥', '상하이버거', '1955버거'],
    category: '버거',
    etaLabel: '15~25분',
    deliveryFee: '2,500원',
    minOrder: 10000,
    price: 6500,
    savingLabel: '앱 전용 특별 할인',
    menus: [
      {
        name: '가상 빅맥 단품',
        price: 6500,
        desc: '100% 순쇠고기 패티 두 장에 특별한 빅맥 소스',
        optionGroups: [
          {
            name: '세트 업그레이드',
            required: true,
            options: [
              { name: '빅맥 단품만 구매', price: 0 },
              { name: '감자튀김+음료 세트로 변경', price: 2500 },
              { name: '후렌치후라이 L 라지 세트 변경', price: 3200 }
            ]
          },
          {
            name: '소스 및 패티 옵션',
            required: false,
            options: [
              { name: '빅맥 특제 소스 듬뿍', price: 0 },
              { name: '슬라이스 치즈 추가', price: 600 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'store_burger_03',
    name: '맘스터가상싸이버거',
    emoji: '🍗',
    rating: 4.7,
    reviewCount: 410,
    menuTags: ['싸이버거', '딥치즈버거', '케이준양념감자'],
    category: '버거',
    etaLabel: '20~30분',
    deliveryFee: '1,800원',
    minOrder: 11000,
    price: 7500,
    savingLabel: '감자튀김 업그레이드',
    menus: [
      {
        name: '싸이 버거 세트',
        price: 7500,
        desc: '매콤한 통다리살 패티와 고소한 소스가 조화로운 맘스 대표 세트',
        optionGroups: [
          {
            name: '감자튀김 종류 변경',
            required: true,
            options: [
              { name: '케이준 양념감자 (기본)', price: 0 },
              { name: '치즈뿌치감자로 변경', price: 1000 },
              { name: '콘샐러드로 사이드 변경', price: 500 }
            ]
          }
        ]
      }
    ]
  },

  // === 치킨 ===
  {
    id: 'store_chicken_01',
    name: '바삭바삭 챌린지 치킨',
    emoji: '🍗',
    image: '/assets/chicken_thumbnail.png',
    rating: 4.9,
    reviewCount: 312,
    menuTags: ['후라이드', '양념치킨', '간장치킨'],
    category: '치킨',
    etaLabel: '15~25분',
    deliveryFee: '무료',
    minOrder: 15000,
    price: 18000,
    savingLabel: '오늘 배달비 절약 3,500원',
    badge: '인기',
    menus: [
      {
        name: '오리진 후라이드 치킨',
        price: 17000,
        desc: '바삭바삭함의 정석, 전통 후라이드',
        optionGroups: [
          {
            name: '뼈 / 순살 타입 선택',
            required: true,
            options: [
              { name: '오리지널 뼈치킨', price: 0 },
              { name: '부드러운 100% 순살 변경', price: 2000 }
            ]
          },
          {
            name: '사이드 및 소스',
            required: false,
            options: [
              { name: '새콤 아삭 치킨무 추가', price: 500 },
              { name: '허니머스타드/양념 소스 추가', price: 500 },
              { name: '쫀득 치즈볼 (3개) 추가', price: 3000 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'store_chicken_02',
    name: '교촌가상허니콤보',
    emoji: '🍗',
    rating: 4.8,
    reviewCount: 820,
    menuTags: ['허니콤보', '레드콤보', '반반오리지날'],
    category: '치킨',
    etaLabel: '35~45분',
    deliveryFee: '3,000원',
    minOrder: 20000,
    price: 23000,
    savingLabel: '시크릿 갈릭 소스 증정',
    menus: [
      {
        name: '달달 촉촉 허니콤보',
        price: 23000,
        desc: '꿀을 발라 달콤 짭조름하고 바삭한 날개/다리 콤보 치킨',
        optionGroups: [
          {
            name: '윙/봉/다리 콤보 부위',
            required: true,
            options: [
              { name: '허니콤보 (날개+다리)', price: 0 },
              { name: '허니오리지날 (한마리 전 부위)', price: -3000 },
              { name: '허니순살 변경', price: 1000 }
            ]
          },
          {
            name: '소품 및 소스 딥',
            required: false,
            options: [
              { name: '교촌 레드디핑소스 추가', price: 1000 },
              { name: '교촌 허니 스파클링 음료 추가', price: 1500 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'store_chicken_03',
    name: '굽네가상고추바사삭',
    emoji: '🔥',
    rating: 4.9,
    reviewCount: 650,
    menuTags: ['고추바사삭', '볼케이노', '오리지널오븐'],
    category: '치킨',
    etaLabel: '30~40분',
    deliveryFee: '2,000원',
    minOrder: 18000,
    price: 21000,
    savingLabel: '마블링소스 추가 증정',
    badge: '대표',
    menus: [
      {
        name: '고추 바사삭 오븐구이',
        price: 21000,
        desc: '청양고추 알갱이가 쏙쏙 박힌 바삭한 웰빙 오븐치킨',
        optionGroups: [
          {
            name: '고기 조리 스타일',
            required: true,
            options: [
              { name: '고추바사삭 뼈형', price: 0 },
              { name: '고추바사삭 윙봉 변경', price: 3000 },
              { name: '고추바사삭 순살 변경', price: 4000 }
            ]
          },
          {
            name: '기본 디핑 소스 변경',
            required: false,
            options: [
              { name: '마블링소스 1개 추가', price: 800 },
              { name: '고블링소스 1개 추가', price: 800 },
              { name: '치즈 치즈 바게트볼 1개 추가', price: 3500 }
            ]
          }
        ]
      }
    ]
  },

  // === 피자 ===
  {
    id: 'store_pizza_01',
    name: '도미노가상피자 역삼본점',
    emoji: '🍕',
    rating: 4.7,
    reviewCount: 189,
    menuTags: ['포테이토피자', '블랙타이거슈림프'],
    category: '피자',
    etaLabel: '30~40분',
    deliveryFee: '무료',
    minOrder: 19000,
    price: 25900,
    savingLabel: '방문 포장 30% 할인',
    menus: [
      {
        name: '리치 포테이토 피자 (L)',
        price: 25900,
        desc: '부드러운 감자와 베이컨이 어우러진 베스트셀러',
        optionGroups: [
          {
            name: '도우 종류 및 엣지 선택',
            required: true,
            options: [
              { name: '슈퍼시드 함유 오리지널 도우', price: 0 },
              { name: '더블치즈엣지 변경', price: 5000 },
              { name: '나폴리 씬 도우 변경', price: 0 }
            ]
          },
          {
            name: '치즈 및 베이컨 추가',
            required: false,
            options: [
              { name: '모짜렐라 치즈 토핑 더블 추가', price: 3000 },
              { name: '도미노 갈릭 디핑 소스 2개', price: 1000 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'store_pizza_02',
    name: '피자나가가상피자',
    emoji: '🍕',
    rating: 4.3,
    reviewCount: 110,
    menuTags: ['페퍼로니피자', '콤비네이션피자'],
    category: '피자',
    etaLabel: '25~35분',
    deliveryFee: '1,000원',
    minOrder: 15000,
    price: 16900,
    savingLabel: '치즈크러스트 업그레이드',
    menus: [
      {
        name: '치즈폭탄 페퍼로니 피자 (M)',
        price: 16900,
        desc: '짭조름한 햄과 자연산 모짜렐라 치즈가 넘치게 토핑된 피자',
        optionGroups: [
          {
            name: '사이즈 규격',
            required: true,
            options: [
              { name: 'M 레귤러 사이즈 (2~3인용)', price: 0 },
              { name: 'L 패밀리 사이즈 변경 (3~4인용)', price: 4000 }
            ]
          },
          {
            name: '엣지 치즈 크러스트',
            required: false,
            options: [
              { name: '골드 고구마무스 크러스트 추가', price: 3000 },
              { name: '치즈 오븐 가상 오븐 스파게티', price: 6500 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'store_pizza_03',
    name: '파파존가상슈퍼파파스',
    emoji: '🍕',
    rating: 4.8,
    reviewCount: 340,
    menuTags: ['수퍼파파스', '존스페이버릿', '갈릭릭디핑'],
    category: '피자',
    etaLabel: '20~30분',
    deliveryFee: '무료',
    minOrder: 21000,
    price: 28500,
    savingLabel: '갈릭디핑소스 2개 증정',
    badge: '인기',
    menus: [
      {
        name: '수퍼 파파스 피자 (L)',
        price: 28500,
        desc: '파파존스 고유의 풍미가 돋보이는 정통 오리지널 피자',
        optionGroups: [
          {
            name: '패밀리 업그레이드',
            required: true,
            options: [
              { name: 'L 라지 사이즈', price: 0 },
              { name: 'F 패밀리 대형 사이즈 변경', price: 6000 }
            ]
          }
        ]
      }
    ]
  },

  // === 일식 ===
  {
    id: 'store_japanese_01',
    name: '심스시: 장외 초밥',
    emoji: '🍣',
    image: '/assets/sushi_thumbnail.png',
    rating: 4.7,
    reviewCount: 204,
    menuTags: ['모둠초밥 A', '연어초밥정식'],
    category: '일식',
    etaLabel: '20~30분',
    deliveryFee: '무료',
    minOrder: 18000,
    price: 24000,
    savingLabel: '미니우동 서비스 제공',
    menus: [
      {
        name: '특선 모둠초밥 (12pcs)',
        price: 18000,
        desc: '광어, 연어, 참치, 새우 등으로 구성된 고품격 초밥',
        optionGroups: [
          {
            name: '와사비 양 조절',
            required: true,
            options: [
              { name: '기본 고추냉이 포함', price: 0 },
              { name: '와사비 빼주세요 (아기용)', price: 0 },
              { name: '와사비 많이 넣어주세요', price: 0 }
            ]
          },
          {
            name: '초밥 부위 단품 추가',
            required: false,
            options: [
              { name: '생연어 초밥 2pcs 추가', price: 3500 },
              { name: '광어 지느러미 초밥 2pcs 추가', price: 4000 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'store_japanese_02',
    name: '홍대가상돈부리',
    emoji: '🍛',
    rating: 4.6,
    reviewCount: 150,
    menuTags: ['사케동', '가츠동', '에비동'],
    category: '일식',
    etaLabel: '25~35분',
    deliveryFee: '1,200원',
    minOrder: 13000,
    price: 14000,
    savingLabel: '온센타마고 반값 혜택',
    menus: [
      {
        name: '싱싱 생연어 사케동',
        price: 14000,
        desc: '생연어를 올려 알싸한 와사비와 비벼먹는 일본식 덮밥',
        optionGroups: [
          {
            name: '연어 양 선택',
            required: true,
            options: [
              { name: '일반 사케동 (연어 9pcs)', price: 0 },
              { name: '더블 사케동 변경 (연어 15pcs)', price: 6000 }
            ]
          },
          {
            name: '토핑 선택',
            required: false,
            options: [
              { name: '생와사비 추가 제공', price: 0 },
              { name: '수비드 온센타마고(반숙란) 추가', price: 1000 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'store_japanese_03',
    name: '가상라멘 멘야 역삼점',
    emoji: '🍜',
    rating: 4.7,
    reviewCount: 290,
    menuTags: ['돈코츠라멘', '카라구치라멘', '야끼교자'],
    category: '일식',
    etaLabel: '15~25분',
    deliveryFee: '2,000원',
    minOrder: 10000,
    price: 9500,
    savingLabel: '공깃밥 1공기 서비스',
    badge: '인기',
    menus: [
      {
        name: '깊은맛 사골 돈코츠 라멘',
        price: 9500,
        desc: '오랜 시간 푹 고아낸 돈골 육수의 진하고 구수한 라멘',
        optionGroups: [
          {
            name: '면의 익힘 정도',
            required: true,
            options: [
              { name: '기본 면 익힘', price: 0 },
              { name: '꼬들꼬들하게 카타멘', price: 0 },
              { name: '부드럽게 푹 익힘', price: 0 }
            ]
          },
          {
            name: '라멘 고명 추가',
            required: false,
            options: [
              { name: '두툼한 돼지 차슈 (2장) 추가', price: 2000 },
              { name: '반숙 아지타마고 (반알) 추가', price: 1000 },
              { name: '아삭 숙주나물 사리 추가', price: 500 }
            ]
          }
        ]
      }
    ]
  },

  // === 카페 ===
  {
    id: 'store_cafe_01',
    name: '가상블루보틀 역삼스튜디오',
    emoji: '☕',
    rating: 4.9,
    reviewCount: 680,
    menuTags: ['싱글오리진', '뉴올리언스라떼'],
    category: '카페',
    etaLabel: '10~20분',
    deliveryFee: '1,000원',
    minOrder: 8000,
    price: 6000,
    savingLabel: '스페셜 컵받침 선착순 증정',
    badge: '인기',
    menus: [
      {
        name: '뉴올리언스 콜드브루 라떼',
        price: 6200,
        desc: '볶은 치커리와 유기농 설탕이 들어간 블루보틀 시그니처',
        optionGroups: [
          {
            name: '밀크 종류 커스텀',
            required: true,
            options: [
              { name: '유기농 일반 우유 (기본)', price: 0 },
              { name: '오트 오트밀 크림 변경', price: 800 },
              { name: '소이 두유 변경', price: 500 }
            ]
          },
          {
            name: '달콤함 추가',
            required: false,
            options: [
              { name: '에스프레소 샷 1회 추가', price: 1000 },
              { name: '유기농 비정제 설탕 시럽 펌프', price: 500 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'store_cafe_02',
    name: '스타벅가상대리점 강남점',
    emoji: '☕',
    rating: 4.8,
    reviewCount: 1200,
    menuTags: ['아메리카노', '카페라떼', '자몽허니블랙티'],
    category: '카페',
    etaLabel: '10~20분',
    deliveryFee: '2,500원',
    minOrder: 8000,
    price: 4500,
    savingLabel: '사이렌 오더 우선 조리',
    menus: [
      {
        name: '카페 아메리카노 (Tall)',
        price: 4500,
        desc: '스타벅스 고유의 딥한 에스프레소 아메리카노',
        optionGroups: [
          {
            name: '온도/컵 사이즈',
            required: true,
            options: [
              { name: 'HOT (뜨겁게) / Tall 355ml', price: 0 },
              { name: 'ICED (차갑게) / Tall 355ml', price: 0 },
              { name: 'ICED / Grande 473ml 변경', price: 500 },
              { name: 'ICED / Venti 591ml 변경', price: 1000 }
            ]
          },
          {
            name: '퍼스널 샷/시럽 커스텀',
            required: false,
            options: [
              { name: '에스프레소 샷 1회 추가', price: 600 },
              { name: '달콤한 카라멜 드리즐 추가', price: 600 },
              { name: '헤이즐넛 시럽 2펌프 추가', price: 600 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'store_cafe_03',
    name: '설빙가상디저트 선릉점',
    emoji: '🍧',
    rating: 4.7,
    reviewCount: 230,
    menuTags: ['인절미설빙', '애플망고치즈설빙'],
    category: '카페',
    etaLabel: '20~30분',
    deliveryFee: '2,000원',
    minOrder: 12000,
    price: 9900,
    savingLabel: '빙수 연유 시럽 1회 무료 리필',
    menus: [
      {
        name: '고소한 인절미 빙수',
        price: 9900,
        desc: '고소한 콩가루와 쫄깃한 인절미 떡이 듬뿍 올라간 시그니처 빙수',
        optionGroups: [
          {
            name: '연어만큼 소중한 연유',
            required: true,
            options: [
              { name: '기본 순연유 1팩 포함', price: 0 },
              { name: '순연유 1팩 추가 구매', price: 500 }
            ]
          },
          {
            name: '토핑 추가',
            required: false,
            options: [
              { name: '쫀득 인절미 떡 사리 추가', price: 1500 },
              { name: '바삭 바닐라 아이스크림 한 쿱', price: 2000 },
              { name: '고소한 통단팥 추가 토핑', price: 1500 }
            ]
          }
        ]
      }
    ]
  }
];
