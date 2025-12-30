export interface ProductFeature {
  title: string;
  desc: string;
  icon?: string; // 아이콘 이미지 경로 (선택)
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  img: string;
  title: string;
  desc: string;
  category: string;

  features: ProductFeature[]; // 🔥 핵심 기능
  specs: ProductSpec[]; // 🔥 스펙 테이블
}
export const ProductData: Product[] = [
  {
    id: "prod-001",
    slug: "rear-warning-light",
    img: "/image/hero_product01.png",
    title: "Rear Warning Light",
    desc: "작업자 안전을 위한 고출력 후방 경고 조명",
    category: "heavy",

    features: [
      {
        icon: "/image/icon_warning.png",
        title: "강력한 경고 출력",
        desc: "고휘도 LED로 시인성을 극대화",
      },
      {
        icon: "/image/icon_sound.png",
        title: "음성 경고 지원",
        desc: "작업자 인지도를 높이는 음성 알림",
      },
      {
        icon: "/image/icon_durable.png",
        title: "내구성 설계",
        desc: "진동·충격에 강한 산업용 설계",
      },
      {
        icon: "/image/icon_weather.png",
        title: "전천후 사용",
        desc: "방진·방수 구조로 실외 환경 대응",
      },
    ],

    specs: [
      { label: "입력 전원", value: "DC 12~90V" },
      { label: "소비 전력", value: "약 20W" },
      { label: "출력 방식", value: "LED + Voice Alarm" },
      { label: "방수 등급", value: "IP65" },
      { label: "하우징 소재", value: "Aluminum Die-cast" },
      { label: "렌즈 소재", value: "Polycarbonate" },
      { label: "사용 온도", value: "-40℃ ~ +60℃" },
      { label: "적용 차량", value: "지게차, 산업 차량" },
    ],
  },
  {
    id: "prod-002",
    slug: "rear-warning-light",
    img: "/image/hero_product01.png",
    title: "Rear Warning Light",
    desc: "작업자 안전을 위한 고출력 후방 경고 조명",
    category: "heavy",

    features: [
      {
        icon: "/image/icon_warning.png",
        title: "강력한 경고 출력",
        desc: "고휘도 LED로 시인성을 극대화",
      },
      {
        icon: "/image/icon_sound.png",
        title: "음성 경고 지원",
        desc: "작업자 인지도를 높이는 음성 알림",
      },
      {
        icon: "/image/icon_durable.png",
        title: "내구성 설계",
        desc: "진동·충격에 강한 산업용 설계",
      },
      {
        icon: "/image/icon_weather.png",
        title: "전천후 사용",
        desc: "방진·방수 구조로 실외 환경 대응",
      },
    ],

    specs: [
      { label: "입력 전원", value: "DC 12~90V" },
      { label: "소비 전력", value: "약 20W" },
      { label: "출력 방식", value: "LED + Voice Alarm" },
      { label: "방수 등급", value: "IP65" },
      { label: "하우징 소재", value: "Aluminum Die-cast" },
      { label: "렌즈 소재", value: "Polycarbonate" },
      { label: "사용 온도", value: "-40℃ ~ +60℃" },
      { label: "적용 차량", value: "지게차, 산업 차량" },
    ],
  },
  {
    id: "prod-003",
    slug: "rear-warning-light",
    img: "/image/hero_product01.png",
    title: "Rear Warning Light",
    desc: "작업자 안전을 위한 고출력 후방 경고 조명",
    category: "heavy",

    features: [
      {
        icon: "/image/icon_warning.png",
        title: "강력한 경고 출력",
        desc: "고휘도 LED로 시인성을 극대화",
      },
      {
        icon: "/image/icon_sound.png",
        title: "음성 경고 지원",
        desc: "작업자 인지도를 높이는 음성 알림",
      },
      {
        icon: "/image/icon_durable.png",
        title: "내구성 설계",
        desc: "진동·충격에 강한 산업용 설계",
      },
      {
        icon: "/image/icon_weather.png",
        title: "전천후 사용",
        desc: "방진·방수 구조로 실외 환경 대응",
      },
    ],

    specs: [
      { label: "입력 전원", value: "DC 12~90V" },
      { label: "소비 전력", value: "약 20W" },
      { label: "출력 방식", value: "LED + Voice Alarm" },
      { label: "방수 등급", value: "IP65" },
      { label: "하우징 소재", value: "Aluminum Die-cast" },
      { label: "렌즈 소재", value: "Polycarbonate" },
      { label: "사용 온도", value: "-40℃ ~ +60℃" },
      { label: "적용 차량", value: "지게차, 산업 차량" },
    ],
  },
  {
    id: "prod-004",
    slug: "rear-warning-light",
    img: "/image/hero_product01.png",
    title: "Rear Warning Light",
    desc: "작업자 안전을 위한 고출력 후방 경고 조명",
    category: "heavy",

    features: [
      {
        icon: "/image/icon_warning.png",
        title: "강력한 경고 출력",
        desc: "고휘도 LED로 시인성을 극대화",
      },
      {
        icon: "/image/icon_sound.png",
        title: "음성 경고 지원",
        desc: "작업자 인지도를 높이는 음성 알림",
      },
      {
        icon: "/image/icon_durable.png",
        title: "내구성 설계",
        desc: "진동·충격에 강한 산업용 설계",
      },
      {
        icon: "/image/icon_weather.png",
        title: "전천후 사용",
        desc: "방진·방수 구조로 실외 환경 대응",
      },
    ],

    specs: [
      { label: "입력 전원", value: "DC 12~90V" },
      { label: "소비 전력", value: "약 20W" },
      { label: "출력 방식", value: "LED + Voice Alarm" },
      { label: "방수 등급", value: "IP65" },
      { label: "하우징 소재", value: "Aluminum Die-cast" },
      { label: "렌즈 소재", value: "Polycarbonate" },
      { label: "사용 온도", value: "-40℃ ~ +60℃" },
      { label: "적용 차량", value: "지게차, 산업 차량" },
    ],
  },
];
