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
  image?: string;
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
    name: '백종원쌈밥 둔산본점',
    emoji: '🍲',
    image: '/design/del/02.jpg',
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
        image: '/design/del/ss/025.jpg',
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
        image: '/design/del/ss/026.jpg',
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
      },
      {
        name: '훈제 오리 쌈밥 정식',
        price: 14000,
        desc: '담백한 훈제 오리와 특제 머스타드 드레싱 쌈정식',
        optionGroups: [
          {
            name: '밥 종류 선택',
            required: true,
            options: [
              { name: '백미공깃밥', price: 0 },
              { name: '건강 보리밥 변경', price: 1000 }
            ]
          }
        ]
      },
      {
        name: '고추장 대패삼겹 쌈밥 정식',
        price: 13500,
        desc: '매콤달콤한 고추장 특제 소스로 볶은 대패삼겹 정식',
        optionGroups: [
          {
            name: '매운맛 단계',
            required: true,
            options: [
              { name: '보통 매운맛', price: 0 },
              { name: '화끈한 매운맛', price: 500 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'store_korean_02',
    name: '한샘국밥 둔산 갤러리아점',
    emoji: '🍲',
    image: '/design/del/18.jpg',
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
        image: '/design/del/ss/003.jpg',
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
        image: '/design/del/ss/004.jpg',
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
      },
      {
        name: '얼큰 사골 내장국밥',
        price: 10000,
        desc: '쫄깃한 오소리감투와 곱창이 들어간 얼큰 사골 국밥',
        image: '/design/del/ss/029.jpg',
        optionGroups: [
          {
            name: '맵기 선택',
            required: true,
            options: [
              { name: '기본 얼큰한 맛', price: 0 },
              { name: '아주 매운맛', price: 500 }
            ]
          }
        ]
      },
      {
        name: '모둠 수육 한접시',
        price: 18000,
        desc: '머릿고기, 수육, 전통 순대가 조화롭게 담긴 안주 겸 별미',
        image: '/design/del/ss/030.jpg',
        optionGroups: [
          {
            name: '소스 선택',
            required: false,
            options: [
              { name: '새우젓 추가', price: 0 },
              { name: '초고추장 소스 추가', price: 500 }
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
    image: '/design/del/19.jpg',
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
        image: '/design/del/ss/005.jpg',
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
        image: '/design/del/ss/006.jpg',
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
      },
      {
        name: '치즈 폭탄 돼지갈비찜 (소)',
        price: 31000,
        desc: '자연산 모짜렐라 치즈가 이불처럼 덮인 고소한 돼지 갈비찜',
        image: '/design/del/ss/027.jpg',
        optionGroups: [
          {
            name: '맵기 단계',
            required: true,
            options: [
              { name: '순한맛 (아이 추천)', price: 0 },
              { name: '매콤한 맛', price: 0 }
            ]
          }
        ]
      },
      {
        name: '로제 매운 갈비찜 (소)',
        price: 30000,
        desc: '부드러운 크림과 매콤한 갈비찜 소스의 환상적 콜라보',
        image: '/design/del/ss/028.jpg',
        optionGroups: [
          {
            name: '사리 선택',
            required: false,
            options: [
              { name: '중국당면 추가', price: 2500 }
            ]
          }
        ]
      }
    ]
  },

  // === 분식 ===
  {
    id: 'store_boonsik_01',
    name: '엽기떡볶이 둔산점',
    emoji: '🌶️',
    image: '/design/del/01.jpg',
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
        name: '엽기 떡볶이',
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
        name: '마라 엽기 떡볶이',
        price: 16000,
        desc: '알싸하고 기분좋게 매운 마라 엽기 떡볶이',
        image: '/design/del/ss/007.jpg',
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
      },
      {
        name: '로제 엽기 떡볶이',
        price: 16000,
        desc: '부드러운 크림 풍미와 매콤한 엽떡 소스의 조화',
        optionGroups: [
          {
            name: '맵기 선택',
            required: true,
            options: [
              { name: '착한맛', price: 0 },
              { name: '오리지널맛', price: 0 }
            ]
          }
        ]
      },
      {
        name: '마라 로제 엽기 떡볶이',
        price: 18000,
        desc: '알싸한 마라와 부드러운 크림의 풍미가 조화롭게 합쳐진 베스트 셀러',
        optionGroups: []
      }
    ]
  },
  {
    id: 'store_boonsik_02',
    name: '남다른 김밥',
    emoji: '🍙',
    image: '/design/del/04.jpg',
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
        image: '/design/del/ss/008.jpg',
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
        image: '/design/del/ss/009.jpg',
        optionGroups: [
          {
            name: '토핑 업그레이드',
            required: false,
            options: [
              { name: '고소한 슬라이스 치즈 추가', price: 800 }
            ]
          }
        ]
      },
      {
        name: '매콤 진미채 김밥',
        price: 4500,
        desc: '쫄깃한 오징어 진미채를 매콤 양념에 무쳐 싼 인기 김밥',
        optionGroups: []
      },
      {
        name: '옛날 쌀 떡볶이',
        price: 5000,
        desc: '쫄깃한 쌀떡과 큼직한 어묵이 들어간 단짠 떡볶이',
        optionGroups: []
      }
    ]
  },
  {
    id: 'store_boonsik_03',
    name: '신전떡볶이 갈마점',
    emoji: '🍢',
    image: '/design/del/05.jpg',
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
        image: '/design/del/ss/010.jpg',
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
      },
      {
        name: '기본 신전 국물 떡볶이',
        price: 3500,
        desc: '카레향 은은한 신전 특제 매콤 국물 떡볶이',
        optionGroups: [
          {
            name: '맵기 단계',
            required: true,
            options: [
              { name: '순한맛', price: 0 },
              { name: '매운맛', price: 0 }
            ]
          }
        ]
      },
      {
        name: '신전 분모자 떡볶이',
        price: 6500,
        desc: '쫀득한 분모자 당면이 국물 양념에 쏙 밴 별미 떡볶이',
        image: '/design/del/ss/035.jpg',
        optionGroups: [
          {
            name: '맵기 단계',
            required: true,
            options: [
              { name: '순한맛', price: 0 },
              { name: '매운맛', price: 0 }
            ]
          }
        ]
      },
      {
        name: '신전 로제 떡볶이',
        price: 5500,
        desc: '부드러운 크림과 신전 특제 매콤 소스가 어우러진 신전 대표 로제 떡볶이',
        image: '/design/del/ss/036.jpg',
        optionGroups: [
          {
            name: '맵기 단계',
            required: true,
            options: [
              { name: '순한맛', price: 0 },
              { name: '매운맛', price: 0 }
            ]
          }
        ]
      }
    ]
  },

  // === 버거 ===
  {
    id: 'store_burger_01',
    name: '쉐이크쉑버거 둔산 갤러리아 타임월드점',
    emoji: '🍔',
    image: '/design/del/06.jpg',
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
        image: '/design/del/ss/011.jpg',
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
        image: '/design/del/ss/012.jpg',
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
      },
      {
        name: '슈룸 버거 (버섯 패티)',
        price: 10500,
        desc: '몬테레이 잭 치즈와 체다 치즈로 채워 튀긴 몬터레이 버섯 버거',
        image: '/design/del/ss/037.jpg',
        optionGroups: []
      },
      {
        name: '크런치 치킨 쉑 버거',
        price: 9500,
        desc: '바삭하게 튀겨낸 닭가슴살 패티와 듬뿍 올려진 쉐이크쉑 피클',
        image: '/design/del/ss/038.jpg',
        optionGroups: []
      }
    ]
  },
  {
    id: 'store_burger_02',
    name: '맥도날드 월평점',
    emoji: '🍔',
    image: '/design/del/07.jpg',
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
      },
      {
        name: '매콤 스파이시 상하이 버거',
        price: 6900,
        desc: '매콤하게 시즈닝된 100% 닭가슴 통살 패티와 싱싱한 양상추',
        optionGroups: [
          {
            name: '세트 변경',
            required: false,
            options: [
              { name: '세트로 업그레이드', price: 2300 }
            ]
          }
        ]
      },
      {
        name: '1955 버거 단품',
        price: 7200,
        desc: '113g 두툼한 순쇠고기 패티와 스페셜 1955 소스',
        image: '/design/del/ss/039.jpg',
        optionGroups: []
      },
      {
        name: '불고기 버거 단품',
        price: 4500,
        desc: '한국인 입맛에 딱 맞춘 달콤한 불고기 소스와 순돈육 패티',
        image: '/design/del/ss/040.jpg',
        optionGroups: []
      }
    ]
  },
  {
    id: 'store_burger_03',
    name: '맘스터치 탄방점',
    emoji: '🍗',
    image: '/design/del/03.jpg',
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
        image: '/design/del/ss/041.jpg',
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
      },
      {
        name: '딥치즈 싸이버거 세트',
        price: 8500,
        desc: '풍미 가득 딥치즈 소스가 듬뿍 올려진 통다리살 버거',
        image: '/design/del/ss/042.jpg',
        optionGroups: []
      },
      {
        name: '불싸이버거 세트',
        price: 7900,
        desc: '불맛 강한 스파이시 소스가 가미된 매니아 추천 버거',
        image: '/design/del/ss/043.jpg',
        optionGroups: []
      },
      {
        name: '케이준 양념치킨 반마리',
        price: 11000,
        desc: '매콤달콤한 케이준 양념 소스가 바삭하게 버무려진 치킨',
        image: '/design/del/ss/044.jpg',
        optionGroups: []
      }
    ]
  },

  // === 치킨 ===
  {
    id: 'store_chicken_01',
    name: 'BBQ 치킨',
    emoji: '🍗',
    image: '/design/del/21.jpg',
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
        name: 'BBQ 황금 올리브 후라이드',
        price: 17000,
        desc: '바삭바삭함의 정석, 전통 후라이드',
        image: '/design/del/ss/013.jpg',
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
    name: '교촌치킨 정부청사점',
    emoji: '🍗',
    image: '/design/del/08.jpg',
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
        name: '교촌 허니콤보',
        price: 23000,
        desc: '꿀을 발라 달콤 짭조름하고 바삭한 날개/다리 콤보 치킨',
        image: '/design/del/ss/014.jpg',
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
    name: '굽네치킨 갈마점',
    emoji: '🔥',
    image: '/design/del/09.jpg',
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
        image: '/design/del/ss/015.jpg',
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
      },
      {
        name: '굽네 볼케이노 오븐구이',
        price: 19500,
        desc: '불맛이 살아있는 화끈하고 핫한 오븐구이 치킨',
        image: '/design/del/ss/045.jpg',
        optionGroups: []
      },
      {
        name: '굽네 오리지널 오븐치킨',
        price: 17900,
        desc: '기름기를 쏙 뺀 고소하고 겉바속촉 오리지널 치킨',
        image: '/design/del/ss/046.jpg',
        optionGroups: []
      },
      {
        name: '남해마늘 바사삭',
        price: 21000,
        desc: '남해 마늘과 알싸한 마늘바사삭 시즈닝의 감칠맛',
        optionGroups: []
      }
    ]
  },

  // === 피자 ===
  {
    id: 'store_pizza_01',
    name: '도미노피자 괴정점',
    emoji: '🍕',
    image: '/design/del/10.jpg',
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
        image: '/design/del/ss/016.jpg',
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
    name: '피자헛 내동점',
    emoji: '🍕',
    image: '/design/del/11.jpg',
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
    name: '파파존스 만년점',
    emoji: '🍕',
    image: '/design/del/12.jpg',
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
        image: '/design/del/ss/018.jpg',
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
      },
      {
        name: '존스 페이버릿 피자 (L)',
        price: 29500,
        desc: '이탈리안 소시지, 페퍼로니와 6가지 치즈의 묵직한 조화',
        image: '/design/del/ss/046.jpg',
        optionGroups: []
      },
      {
        name: '올미트 피자 (L)',
        price: 28500,
        desc: '페퍼로니, 햄, 쇠고기가 풍성하게 올려진 고기 피자',
        image: '/design/del/ss/047.jpg',
        optionGroups: []
      },
      {
        name: '아이리쉬 포테이토 피자 (L)',
        price: 27500,
        desc: '달콤한 갈릭 소스와 감자의 고소함이 조화로운 피자',
        image: '/design/del/ss/048.jpg',
        optionGroups: []
      },
      {
        name: '스파이시 치킨랜치 피자 (L)',
        price: 27500,
        desc: '갈릭 랜치 소스에 그릴드 치킨과 할라피뇨가 조화로운 인기 피자',
        image: '/design/del/ss/049.jpg',
        optionGroups: []
      }
    ]
  },

  // === 일식 ===
  {
    id: 'store_japanese_01',
    name: '참스시: 장외 초밥',
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
        image: '/design/del/ss/019.jpg',
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
    name: '하루 돈부리',
    emoji: '🍛',
    image: '/design/del/13.jpg',
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
        image: '/design/del/ss/020.jpg',
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
    name: '멘야 둔산본점',
    emoji: '🍜',
    image: '/design/del/14.jpg',
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
      },
      {
        name: '얼큰 카라구치 매운 라멘',
        price: 10000,
        desc: '비법 다대기 양념을 풀어얼큰하고 매운 돈코츠 라멘',
        image: '/design/del/ss/050.jpg',
        optionGroups: [
          {
            name: '매운맛 선택',
            required: true,
            options: [
              { name: '1단계 (신라면 수준)', price: 0 },
              { name: '2단계 (불닭 수준)', price: 500 }
            ]
          }
        ]
      },
      {
        name: '특제 마제소바 (비빔라멘)',
        price: 10500,
        desc: '다진 고기와 특제 소스, 계란 노른자를 비벼먹는 비빔 라멘',
        image: '/design/del/ss/051.jpg',
        optionGroups: []
      },
      {
        name: '진한 미소 라멘',
        price: 10000,
        desc: '구수한 일본 미소 된장과 돼지 사골 육수가 어우러진 감칠맛 라멘',
        image: '/design/del/ss/052.jpg',
        optionGroups: [
          {
            name: '면의 익힘 정도',
            required: true,
            options: [
              { name: '기본 면 익힘', price: 0 },
              { name: '꼬들꼬들하게 카타멘', price: 0 }
            ]
          }
        ]
      }
    ]
  },

  // === 카페 ===
  {
    id: 'store_cafe_01',
    name: '가상블루보틀 대전신세계점',
    emoji: '☕',
    image: '/design/del/15.jpg',
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
        image: '/design/del/ss/022.jpg',
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
    name: '스타벅가상대리점 둔산점',
    emoji: '☕',
    image: '/design/del/17.jpg',
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
        image: '/design/del/ss/023.jpg',
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
    name: '설빙가상디저트 대전 신세계점',
    emoji: '🍧',
    image: '/design/del/16.jpg',
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
        image: '/design/del/ss/024.jpg',
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
      },
      {
        name: '애플망고 치즈 설빙',
        price: 13900,
        desc: '달콤한 애플망고와 고소한 프리미엄 치즈 큐브가 듬뿍 가미된 빙수',
        image: '/design/del/ss/053.jpg',
        optionGroups: []
      },
      {
        name: '딥초코 브라우니 설빙',
        price: 12900,
        desc: '진한 초코 가루와 쫀득 브라우니 조각이 가득한 초코 빙수',
        image: '/design/del/ss/054.jpg',
        optionGroups: []
      },
      {
        name: '바삭 꿀호떡 (2개)',
        price: 4500,
        desc: '달콤한 꿀과 갓 튀긴 고소함이 조화로운 디저트 호떡',
        image: '/design/del/ss/055.jpg',
        optionGroups: []
      },
      {
        name: '생딸기 찹쌀떡 설빙',
        price: 13500,
        desc: '상큼한 생딸기와 쫀득한 찹쌀떡이 어우러진 시즌 인기 설빙',
        image: '/design/del/ss/056.jpg',
        optionGroups: []
      },
      {
        name: '인절미 토스트',
        price: 4800,
        desc: '바삭한 식빵 사이에 쫄깃한 인절미 떡이 들어간 시그니처 토스트',
        image: '/design/del/ss/057.jpg',
        optionGroups: []
      }
    ]
  }
];
