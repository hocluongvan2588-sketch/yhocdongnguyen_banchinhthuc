// Bagua Numerology data for healing
import { getTrigramByNumber } from "./data/trigram-data"

export interface NumerologySequence {
  sequence: string
  title: string
  description: string
  effects: string[]
  targetOrgans: string[]
  element: string
  frequency: string
  duration: string
  bestTime: string[]
}

export interface NumerologyTreatment {
  diagnosis: string
  primarySequence: NumerologySequence
  secondarySequences: NumerologySequence[]
  instructions: {
    howToChant: string[]
    posture: string
    breathing: string
    mindset: string
  }
  wallpaperColors: {
    primary: string
    secondary: string
    text: string
  }
}

// Bagua number mapping
const TRIGRAM_NUMBERS: Record<number, string> = {
  1: "1", // Càn (Qian)
  2: "2", // Đoài (Dui)
  3: "3", // Ly (Li)
  4: "4", // Chấn (Zhen)
  5: "5", // Tốn (Xun)
  6: "6", // Khảm (Kan)
  7: "7", // Cấn (Gen)
  8: "8", // Khôn (Kun)
}

const NUMEROLOGY_SEQUENCES_DB: Record<string, NumerologySequence> = {
  "640": {
    sequence: "6 4 0",
    title: "Thận Khảm Sinh Gan Mộc",
    description: "Bổ thận, tăng cường gan, cải thiện thị lực",
    effects: ["Bồi bổ thận khí", "Điều hòa gan mộc", "Cải thiện thị lực", "Giảm mệt mỏi mắt", "Tăng cường sinh lực"],
    targetOrgans: ["Thận", "Gan", "Mắt"],
    element: "Thủy sinh Mộc",
    frequency: "108 lần/ngày",
    duration: "21-49 ngày",
    bestTime: ["5:00-7:00 (Giờ Mão)", "23:00-1:00 (Giờ Tý)"],
  },
  "820": {
    sequence: "8 2 0",
    title: "Khôn Thổ Sinh Kim Phế",
    description: "Bổ tỳ vị, tăng cường phổi, cải thiện hô hấp",
    effects: ["Kiện tỳ ích vị", "Bổ phế khí", "Cải thiện tiêu hóa", "Tăng cường hệ hô hấp", "Nâng cao miễn dịch"],
    targetOrgans: ["Tỳ vị", "Phổi", "Dạ dày"],
    element: "Thổ sinh Kim",
    frequency: "81 lần/ngày",
    duration: "28-49 ngày",
    bestTime: ["7:00-9:00 (Giờ Thìn)", "3:00-5:00 (Giờ Dần)"],
  },
  "430": {
    sequence: "4 3 0",
    title: "Chấn Mộc Sinh Ly Hỏa",
    description: "Điều hòa gan, nuôi dưỡng tâm, an thần",
    effects: ["Sơ can giải uất", "Dưỡng tâm an thần", "Cải thiện giấc ngủ", "Giảm căng thẳng", "Tăng tuần hoàn máu"],
    targetOrgans: ["Gan", "Tim", "Mạch máu"],
    element: "Mộc sinh Hỏa",
    frequency: "49 lần/ngày",
    duration: "21-42 ngày",
    bestTime: ["11:00-13:00 (Giờ Ngọ)", "5:00-7:00 (Giờ Mão)"],
  },
  "380": {
    sequence: "3 8 0",
    title: "Ly Hỏa Sinh Khôn Thổ",
    description: "Ôn tâm hỏa, bổ tỳ thổ, điều hòa tiêu hóa",
    effects: ["Ôn dưỡng tâm dương", "Bổ ích tỳ vị", "Tăng cường tiêu hóa", "Cải thiện hấp thu", "Tăng cường sinh khí"],
    targetOrgans: ["Tim", "Tỳ", "Dạ dày"],
    element: "Hỏa sinh Thổ",
    frequency: "72 lần/ngày",
    duration: "28-49 ngày",
    bestTime: ["7:00-9:00 (Giờ Thìn)", "11:00-13:00 (Giờ Ngọ)"],
  },
  "160": {
    sequence: "1 6 0",
    title: "Càn Kim Sinh Khảm Thủy",
    description: "Thanh phế, bổ thận, tăng cường sinh lực",
    effects: ["Thanh phế nhuận táo", "Bổ ích thận khí", "Cải thiện hô hấp", "Tăng sinh lực", "Cường tráng cơ xương"],
    targetOrgans: ["Phổi", "Thận", "Xương"],
    element: "Kim sinh Thủy",
    frequency: "64 lần/ngày",
    duration: "49-81 ngày",
    bestTime: ["3:00-5:00 (Giờ Dần)", "23:00-1:00 (Giờ Tý)"],
  },
  "650": {
    sequence: "6 5 0",
    title: "Khảm Thủy Điều Hòa",
    description: "Bổ thận, điều hòa thủy lộ, lợi tiểu",
    effects: ["Bổ thận dưỡng âm", "Điều hòa thủy đạo", "Lợi tiểu tiêu thủng", "Giảm phù nề", "Cải thiện tuần hoàn"],
    targetOrgans: ["Thận", "Bàng quang", "Tiết niệu"],
    element: "Thủy",
    frequency: "54 lần/ngày",
    duration: "28-49 ngày",
    bestTime: ["15:00-17:00 (Giờ Thân)", "23:00-1:00 (Giờ Tý)"],
  },
  "720": {
    sequence: "7 2 0",
    title: "Cấn Thổ Ổn Định",
    description: "Kiện tỳ, ổn định tinh thần, an thần",
    effects: ["Kiện tỳ hòa vị", "Ổn định tâm thần", "Giảm lo âu", "Cải thiện giấc ngủ", "Tăng cường sự tập trung"],
    targetOrgans: ["Tỳ", "Dạ dày", "Thần kinh"],
    element: "Thổ",
    frequency: "63 lần/ngày",
    duration: "21-42 ngày",
    bestTime: ["7:00-9:00 (Giờ Thìn)", "19:00-21:00 (Giờ Tuất)"],
  },
  "260": {
    sequence: "2 6 0",
    title: "Đoài Kim Thanh Phế",
    description: "Thanh nhiệt, nhuận phế, lợi hầu",
    effects: [
      "Thanh nhiệt nhuận táo",
      "Bổ ích phế khí",
      "Lợi họng thanh âm",
      "Giảm ho khàn tiếng",
      "Tăng cường hô hấp",
    ],
    targetOrgans: ["Phổi", "Họng", "Miệng"],
    element: "Kim",
    frequency: "36 lần/ngày",
    duration: "14-28 ngày",
    bestTime: ["3:00-5:00 (Giờ Dần)", "15:00-17:00 (Giờ Thân)"],
  },
}

export function getNumerologyTreatment(
  upperTrigram: number,
  lowerTrigram: number,
  movingLine: number,
): NumerologyTreatment {
  const upper = getTrigramByNumber(upperTrigram)
  const lower = getTrigramByNumber(lowerTrigram)

  const diagnosis = `${upper.vietnamese} ${lower.vietnamese} - Điều chỉnh năng lượng ${upper.element} và ${lower.element}`

  // Select sequences based on element interactions
  let primarySequence: NumerologySequence
  const secondarySequences: NumerologySequence[] = []

  // Determine primary sequence based on elements
  if (upper.element === "Thủy" || lower.element === "Thủy") {
    if (upper.element === "Mộc" || lower.element === "Mộc") {
      primarySequence = NUMEROLOGY_SEQUENCES_DB["640"] // Thủy sinh Mộc
      secondarySequences.push(NUMEROLOGY_SEQUENCES_DB["650"])
    } else if (upper.element === "Hỏa" || lower.element === "Hỏa") {
      primarySequence = NUMEROLOGY_SEQUENCES_DB["650"] // Cân bằng Thủy Hỏa
      secondarySequences.push(NUMEROLOGY_SEQUENCES_DB["430"])
    } else {
      primarySequence = NUMEROLOGY_SEQUENCES_DB["160"] // Kim sinh Thủy
      secondarySequences.push(NUMEROLOGY_SEQUENCES_DB["650"])
    }
  } else if (upper.element === "Hỏa" || lower.element === "Hỏa") {
    if (upper.element === "Thổ" || lower.element === "Thổ") {
      primarySequence = NUMEROLOGY_SEQUENCES_DB["380"] // Hỏa sinh Thổ
      secondarySequences.push(NUMEROLOGY_SEQUENCES_DB["430"])
    } else {
      primarySequence = NUMEROLOGY_SEQUENCES_DB["430"] // Mộc sinh Hỏa
      secondarySequences.push(NUMEROLOGY_SEQUENCES_DB["380"])
    }
  } else if (upper.element === "Thổ" || lower.element === "Thổ") {
    if (upper.element === "Kim" || lower.element === "Kim") {
      primarySequence = NUMEROLOGY_SEQUENCES_DB["820"] // Thổ sinh Kim
      secondarySequences.push(NUMEROLOGY_SEQUENCES_DB["720"])
    } else {
      primarySequence = NUMEROLOGY_SEQUENCES_DB["720"] // Cấn Thổ
      secondarySequences.push(NUMEROLOGY_SEQUENCES_DB["820"])
    }
  } else if (upper.element === "Kim" || lower.element === "Kim") {
    primarySequence = NUMEROLOGY_SEQUENCES_DB["160"] // Kim sinh Thủy
    secondarySequences.push(NUMEROLOGY_SEQUENCES_DB["260"], NUMEROLOGY_SEQUENCES_DB["820"])
  } else {
    // Mộc
    primarySequence = NUMEROLOGY_SEQUENCES_DB["430"] // Mộc sinh Hỏa
    secondarySequences.push(NUMEROLOGY_SEQUENCES_DB["640"])
  }

  // Color scheme based on primary element
  let wallpaperColors = {
    primary: "#4A7C59", // Green (Mộc)
    secondary: "#E8F5E9",
    text: "#1B5E20",
  }

  if (primarySequence.element.includes("Hỏa")) {
    wallpaperColors = { primary: "#C62828", secondary: "#FFEBEE", text: "#B71C1C" }
  } else if (primarySequence.element.includes("Thổ")) {
    wallpaperColors = { primary: "#F57C00", secondary: "#FFF3E0", text: "#E65100" }
  } else if (primarySequence.element.includes("Kim")) {
    wallpaperColors = { primary: "#CFD8DC", secondary: "#FAFAFA", text: "#455A64" }
  } else if (primarySequence.element.includes("Thủy")) {
    wallpaperColors = { primary: "#1565C0", secondary: "#E3F2FD", text: "#0D47A1" }
  }

  return {
    diagnosis,
    primarySequence,
    secondarySequences: secondarySequences.slice(0, 2),
    instructions: {
      howToChant: [
        'Ngồi thoải mái, lưng thẳng, hai tay đặt trên đùi hoặc kết ấn "hợp thập"',
        "Nhắm mắt hoặc nhìn xuống dưới, tâm thần tập trung",
        "Đọc từng con số một cách rõ ràng và chậm rãi",
        'Ví dụ: "Sáu... Bốn... Không...", sau đó nghỉ 1-2 giây rồi lặp lại',
        "Có thể đọc thầm trong tâm hoặc niệm nhỏ theo hơi thở",
        "Sau khi hoàn thành, ngồi yên 2-3 phút để cảm nhận năng lượng",
      ],
      posture: "Ngồi kiết già, bán già hoặc ngồi ghế với lưng thẳng, vai thả lỏng, đầu hơi cúi về phía trước",
      breathing: "Hít thở tự nhiên, đều đặn. Khi niệm số, kéo dài hơi thở một cách tự nhiên không gượng ép",
      mindset:
        "Giữ tâm thanh tịnh, không suy nghĩ tạp niệm. Tập trung vào âm thanh của số và cảm nhận năng lượng tại vùng tạng phủ tương ứng",
    },
    wallpaperColors,
  }
}
