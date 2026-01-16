// Herbal medicine prescriptions based on diagnosis
import { getTrigramByNumber } from "./data/trigram-data"

export interface HerbalIngredient {
  name: string
  latin?: string
  amount: string
  effects: string
}

export interface HerbalPrescription {
  name: string
  description: string
  category: string
  ingredients: HerbalIngredient[]
  preparation: string[]
  dosage: string
  duration: string
  precautions: string[]
  contraindications: string[]
  modifications?: string
}

export interface HerbalTreatment {
  diagnosis: string
  primaryPrescription: HerbalPrescription
  alternativePrescriptions: HerbalPrescription[]
  dietaryAdvice: string[]
  lifestyle: string[]
}

const HERBAL_PRESCRIPTIONS_DB: Record<string, HerbalPrescription> = {
  LucViDiaHoangHoan: {
    name: "Lục Vị Địa Hoàng Hoàn",
    description: "Bổ ích thận âm, dưỡng can minh mục",
    category: "Bổ ích tạng phủ",
    ingredients: [
      { name: "Thục Địa Hoàng", latin: "Rehmanniae Radix", amount: "24g", effects: "Bổ thận, dưỡng âm" },
      { name: "Sơn Dược", latin: "Dioscoreae Rhizoma", amount: "12g", effects: "Bổ tỳ, ích thận" },
      { name: "Sơn Thù Ngu", latin: "Corni Fructus", amount: "12g", effects: "Bổ can thận" },
      { name: "Trạch Tả", latin: "Alismatis Rhizoma", amount: "9g", effects: "Lợi thủy, tả nhiệt" },
      { name: "Phục Linh", latin: "Poria", amount: "9g", effects: "Lợi thủy, kiện tỳ" },
      { name: "Mẫu Đan Bì", latin: "Moutan Cortex", amount: "9g", effects: "Thanh nhiệt, lương huyết" },
    ],
    preparation: [
      "Rửa sạch các vị thuốc, ngâm trong nước lạnh 30 phút",
      "Đun sôi với 800ml nước, sau đó hạ lửa nhỏ",
      "Sắc trong 40-50 phút đến khi còn 300ml",
      "Lọc bỏ bã, chia làm 2 lần uống",
    ],
    dosage: "Uống 150ml mỗi lần, sáng và tối sau ăn 30 phút",
    duration: "Liên tục trong 4-8 tuần",
    precautions: [
      "Uống sau khi ăn để tránh khó tiêu",
      "Tránh ăn thực phẩm cay nóng, dầu mỡ",
      "Nên kết hợp với nghỉ ngơi đầy đủ",
    ],
    contraindications: [
      "Người có tỳ vị hư hàn, tiêu chảy mãn tính",
      "Phụ nữ có thai và cho con bú",
      "Người bị cảm mạo, sốt cao",
    ],
    modifications: "Nếu có chứng khẩu khô, thêm Mạch Môn 10g, Ngũ Vị Tử 6g (Bát Vị Địa Hoàng Hoàn)",
  },
  TuQuanTu: {
    name: "Tứ Quân Tử Thang",
    description: "Ích khí kiện tỳ, hòa vị",
    category: "Bổ ích khí",
    ingredients: [
      { name: "Nhân Sâm", latin: "Ginseng Radix", amount: "10g", effects: "Đại bổ nguyên khí" },
      { name: "Bạch Truật", latin: "Atractylodis Rhizoma", amount: "10g", effects: "Kiện tỳ, táo thấp" },
      { name: "Phục Linh", latin: "Poria", amount: "10g", effects: "Kiện tỳ, lợi thủy" },
      { name: "Cam Thảo", latin: "Glycyrrhizae Radix", amount: "6g", effects: "Ích khí, hòa dược" },
    ],
    preparation: ["Rửa sạch các vị thuốc", "Đun với 600ml nước, sắc còn 300ml", "Lọc bỏ bã, chia 2 lần uống"],
    dosage: "150ml mỗi lần, sáng và chiều",
    duration: "2-4 tuần",
    precautions: ["Nên uống trước khi ăn 30 phút", "Tránh ăn thực phẩm khó tiêu"],
    contraindications: ["Người có thực hỏa nội thạnh", "Cảm mạo chưa khỏi"],
  },
  TieuDaoTan: {
    name: "Tiêu Dao Tán",
    description: "Sơ can giải uất, kiện tỳ dưỡng huyết",
    category: "Điều hòa khí huyết",
    ingredients: [
      { name: "Sài Hồ", latin: "Bupleuri Radix", amount: "12g", effects: "Sơ can giải uất" },
      { name: "Đương Quy", latin: "Angelicae Sinensis Radix", amount: "10g", effects: "Bổ huyết, hoạt huyết" },
      { name: "Bạch Thược", latin: "Paeoniae Radix Alba", amount: "10g", effects: "Dưỡng huyết, nhu can" },
      { name: "Bạch Truật", latin: "Atractylodis Rhizoma", amount: "10g", effects: "Kiện tỳ, ích khí" },
      { name: "Phục Linh", latin: "Poria", amount: "10g", effects: "Kiện tỳ, an thần" },
      { name: "Sinh Khương", latin: "Zingiberis Rhizoma", amount: "3g", effects: "Ôn trung, hòa vị" },
      { name: "Bạc Hà", latin: "Menthae Herba", amount: "3g", effects: "Sơ can, thanh nhiệt" },
      { name: "Cam Thảo", latin: "Glycyrrhizae Radix", amount: "6g", effects: "Hòa dược, ích khí" },
    ],
    preparation: [
      "Rửa sạch các vị thuốc, ngâm 20 phút",
      "Đun sôi với 800ml nước",
      "Sắc nhỏ lửa 35-40 phút còn 350ml",
      "Cho Bạc Hà vào 5 phút cuối",
      "Lọc bỏ bã",
    ],
    dosage: "Uống ấm 150-200ml, ngày 2 lần",
    duration: "3-6 tuần",
    precautions: ["Tránh thức khuya, căng thẳng", "Nên ăn nhẹ nhàng, dễ tiêu"],
    contraindications: ["Người có âm hư hỏa vượng", "Phụ nữ có thai"],
  },
  BatChanThang: {
    name: "Bát Trân Thang",
    description: "Ích khí, dưỡng huyết",
    category: "Khí huyết song bổ",
    ingredients: [
      { name: "Đương Quy", latin: "Angelicae Sinensis Radix", amount: "10g", effects: "Bổ huyết, hoạt huyết" },
      { name: "Xuyên Khung", latin: "Chuanxiong Rhizoma", amount: "6g", effects: "Hoạt huyết, hành khí" },
      { name: "Bạch Thược", latin: "Paeoniae Radix Alba", amount: "10g", effects: "Dưỡng huyết, liễm âm" },
      { name: "Thục Địa", latin: "Rehmanniae Radix", amount: "15g", effects: "Bổ huyết, tư âm" },
      { name: "Nhân Sâm", latin: "Ginseng Radix", amount: "10g", effects: "Bổ khí, kiện tỳ" },
      { name: "Bạch Truật", latin: "Atractylodis Rhizoma", amount: "10g", effects: "Kiện tỳ, ích khí" },
      { name: "Phục Linh", latin: "Poria", amount: "10g", effects: "Kiện tỳ, an thần" },
      { name: "Cam Thảo", latin: "Glycyrrhizae Radix", amount: "6g", effects: "Hòa dược, ích khí" },
    ],
    preparation: [
      "Ngâm thuốc trong nước 30 phút",
      "Đun với 1000ml nước, sắc còn 400ml",
      "Lọc lấy nước, chia làm 2 lần",
    ],
    dosage: "200ml mỗi lần, sáng và tối",
    duration: "4-8 tuần",
    precautions: ["Ăn uống đầy đủ dinh dưỡng", "Nghỉ ngơi hợp lý"],
    contraindications: ["Người cảm mạo sốt cao", "Có chứng thực nhiệt"],
  },
  MaiMenDongThang: {
    name: "Mai Môn Đông Thang",
    description: "Bổ phế, dưỡng tâm, thanh nhiệt",
    category: "Bổ âm thanh nhiệt",
    ingredients: [
      { name: "Mạch Môn Đông", latin: "Ophiopogonis Radix", amount: "12g", effects: "Dưỡng âm, nhuận phế" },
      { name: "Bán Hạ", latin: "Pinelliae Rhizoma", amount: "9g", effects: "Hóa đàm, giáng nghịch" },
      { name: "Nhân Sâm", latin: "Ginseng Radix", amount: "6g", effects: "Bổ khí, sinh tân" },
      { name: "Cam Thảo", latin: "Glycyrrhizae Radix", amount: "6g", effects: "Hòa dược, nhuận phế" },
      { name: "Bạch Truật", latin: "Atractylodis Rhizoma", amount: "9g", effects: "Kiện tỳ, táo thấp" },
      { name: "Cánh Mễ", latin: "Oryzae Semen", amount: "15g", effects: "Ích khí, hòa vị" },
    ],
    preparation: ["Rửa sạch thuốc, ngâm 20 phút", "Sắc với 800ml nước còn 350ml", "Lọc bỏ bã"],
    dosage: "150ml mỗi lần, ngày 2 lần",
    duration: "3-6 tuần",
    precautions: ["Uống ấm, sau khi ăn", "Tránh thức ăn lạnh"],
    contraindications: ["Người có tỳ vị hư hàn, tiêu chảy"],
  },
}

export function getHerbalTreatment(upperTrigram: number, lowerTrigram: number, movingLine: number): HerbalTreatment {
  const upper = getTrigramByNumber(upperTrigram)
  const lower = getTrigramByNumber(lowerTrigram)

  const diagnosis = `${upper.vietnamese} ${lower.vietnamese} - Ảnh hưởng ${upper.organ} và ${lower.organ}`

  let primaryPrescription: HerbalPrescription
  let alternativePrescriptions: HerbalPrescription[] = []

  // Select prescription based on element interactions
  const upperElement = upper.element
  const lowerElement = lower.element

  if (upperElement === "Thủy" || lowerElement === "Thủy") {
    // Thận hư, cần bổ thận
    primaryPrescription = HERBAL_PRESCRIPTIONS_DB.LucViDiaHoangHoan
    alternativePrescriptions = [HERBAL_PRESCRIPTIONS_DB.BatChanThang]
  } else if (upperElement === "Thổ" || lowerElement === "Thổ") {
    // Tỳ vị yếu
    primaryPrescription = HERBAL_PRESCRIPTIONS_DB.TuQuanTu
    alternativePrescriptions = [HERBAL_PRESCRIPTIONS_DB.BatChanThang]
  } else if (upperElement === "Mộc" || lowerElement === "Mộc") {
    // Gan uất
    primaryPrescription = HERBAL_PRESCRIPTIONS_DB.TieuDaoTan
    alternativePrescriptions = [HERBAL_PRESCRIPTIONS_DB.BatChanThang]
  } else if (upperElement === "Kim" || lowerElement === "Kim") {
    // Phổi hư
    primaryPrescription = HERBAL_PRESCRIPTIONS_DB.MaiMenDongThang
    alternativePrescriptions = [HERBAL_PRESCRIPTIONS_DB.TuQuanTu]
  } else {
    // Mặc định - khí huyết hư
    primaryPrescription = HERBAL_PRESCRIPTIONS_DB.BatChanThang
    alternativePrescriptions = [HERBAL_PRESCRIPTIONS_DB.TuQuanTu]
  }

  const dietaryAdvice = [
    "Ăn nhiều ngũ cốc nguyên hạt, rau xanh và trái cây",
    "Hạn chế thức ăn cay nóng, dầu mỡ, đồ chiên rán",
    "Tránh rượu bia, chất kích thích",
    "Ăn đúng giờ, không ăn quá no hoặc quá đói",
    "Uống đủ nước, tránh nước đá lạnh",
  ]

  const lifestyle = [
    "Ngủ đủ 7-8 giờ mỗi đêm, không thức khuya",
    "Tập thể dục nhẹ nhàng như thái cực, khí công",
    "Tránh căng thẳng, lo lắng kéo dài",
    "Giữ ấm cơ thể, tránh gió lạnh",
    "Tâm trạng thoải mái, lạc quan",
  ]

  return {
    diagnosis,
    primaryPrescription,
    alternativePrescriptions,
    dietaryAdvice,
    lifestyle,
  }
}
