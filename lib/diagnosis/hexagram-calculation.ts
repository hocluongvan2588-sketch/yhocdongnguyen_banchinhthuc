// Tính toán Quẻ Hổ (互卦) và phân tích sức mạnh theo mùa

export function calculateMutualHexagram(
  upperTrigram: number,
  lowerTrigram: number,
): {
  mutualUpper: number
  mutualLower: number
  description: string
} {
  // Quẻ Hổ (互卦) theo Mai Hoa Dịch Số:
  // Từ 6 hào của quẻ chính, lấy hào 2,3,4 tạo Hạ Hổ, hào 3,4,5 tạo Thượng Hổ
  // Công thức đơn giản: dựa vào tổng số của 2 quẻ

  const sum = upperTrigram + lowerTrigram
  const mutualLower = ((sum - 1) % 8) + 1
  const mutualUpper = (sum % 8) + 1

  return {
    mutualUpper,
    mutualLower,
    description: "Quẻ Hổ thể hiện quá trình biến chuyển bệnh từ hiện tại đến tương lai",
  }
}

export function getSeasonalStrength(
  element: string,
  month: number,
): {
  strength: "vượng" | "tương" | "hưu" | "tù" | "tử"
  description: string
  advice: string
} {
  // Theo Ngũ Hành Vượng Tương Hưu Tù Tử:
  // Xuân (1-3): Mộc vượng, Hỏa tương, Thủy hưu, Kim tù, Thổ tử
  // Hạ (4-6): Hỏa vượng, Thổ tương, Mộc hưu, Thủy tù, Kim tử
  // Thu (7-9): Kim vượng, Thủy tương, Thổ hưu, Hỏa tù, Mộc tử
  // Đông (10-12): Thủy vượng, Mộc tương, Kim hưu, Thổ tù, Hỏa tử

  const season = month <= 3 ? "spring" : month <= 6 ? "summer" : month <= 9 ? "autumn" : "winter"

  const strengthMap: Record<
    string,
    Record<
      string,
      {
        strength: "vượng" | "tương" | "hưu" | "tù" | "tử"
        description: string
        advice: string
      }
    >
  > = {
    spring: {
      Mộc: {
        strength: "vượng",
        description: "Xuân mùa Mộc vượng - Gan đang cực thịnh, năng lượng dồi dào",
        advice: "Đây là thời điểm tốt để chữa bệnh về Gan. Nên ăn rau xanh, tập thể dục ngoài trời",
      },
      Hỏa: {
        strength: "tương",
        description: "Mộc sinh Hỏa - Tim được sinh trợ tốt, tâm thần sảng khoái",
        advice: "Nên bồi bổ Tâm huyết lúc này, ăn táo đỏ, long nhãn",
      },
      Thủy: {
        strength: "hưu",
        description: "Thủy sinh Mộc - Thận đã tốn năng lượng sinh Gan, cần nghỉ ngơi",
        advice: "Tránh lao lực quá, ngủ đủ giấc để Thận phục hồi",
      },
      Kim: {
        strength: "tù",
        description: "Mộc khắc Kim - Phổi bị áp chế, dễ cảm, ho",
        advice: "Giữ ấm, tránh gió lạnh, ăn bổ Phế như lê, bạch hợp",
      },
      Thổ: {
        strength: "tử",
        description: "Mộc khắc Thổ mạnh nhất - Tỳ Vị rất yếu, dễ tiêu chảy",
        advice: "ĐẶC BIỆT CHÚ Ý: Ăn uống nhẹ nhàng, tránh lạnh, tránh lo nghĩ",
      },
    },
    summer: {
      Hỏa: {
        strength: "vượng",
        description: "Hạ mùa Hỏa vượng - Tim dương cực thịnh, dễ hỏa viêm",
        advice: "Thanh nhiệt, uống nhiều nước, tránh cay nóng. Thời điểm TỐT để chữa bệnh Tim",
      },
      Thổ: {
        strength: "tương",
        description: "Hỏa sinh Thổ - Tỳ Vị được bồi bổ, tiêu hóa tốt",
        advice: "Nên bổ Tỳ Vị lúc này, ăn khoai lang, bí đỏ",
      },
      Mộc: {
        strength: "hưu",
        description: "Mộc sinh Hỏa - Gan đã tốn lực, cần dưỡng Can huyết",
        advice: "Tránh thức khuya, tránh giận dữ, ăn rau xanh bổ Gan",
      },
      Thủy: {
        strength: "tù",
        description: "Hỏa khắc Thủy - Thận âm dễ hao, dễ khát nước",
        advice: "Uống nhiều nước, ăn bổ Thận âm như mè đen, óc chó",
      },
      Kim: {
        strength: "tử",
        description: "Hỏa khắc Kim nghiêm trọng - Phổi rất yếu, dễ viêm phế quản",
        advice: "CỰC KỲ CHÚ Ý: Giữ ấm phổi, tránh điều hòa thổi trực tiếp",
      },
    },
    autumn: {
      Kim: {
        strength: "vượng",
        description: "Thu mùa Kim vượng - Phổi khí thanh khiết, hô hấp tốt",
        advice: "Thời điểm TỐT nhất để chữa bệnh Phổi. Tập hít thở sâu",
      },
      Thủy: {
        strength: "tương",
        description: "Kim sinh Thủy - Thận được bổ dưỡng từ Phế khí",
        advice: "Nên bổ Thận lúc này, ăn đậu đen, hạt sen",
      },
      Thổ: {
        strength: "hưu",
        description: "Thổ sinh Kim - Tỳ Vị đã tốn khí, cần bồi bổ",
        advice: "Ăn cháo, súp ấm để bổ Tỳ Vị",
      },
      Hỏa: {
        strength: "tù",
        description: "Kim khắc Hỏa - Tim dương suy giảm, dễ buồn",
        advice: "Giữ ấm cơ thể, vận động để sinh dương khí",
      },
      Mộc: {
        strength: "tử",
        description: "Kim khắc Mộc mạnh - Gan rất yếu, dễ suy nhược",
        advice: "TRÁNH: Giận dữ, rượu bia. Ngủ sớm dậy sớm bổ Gan",
      },
    },
    winter: {
      Thủy: {
        strength: "vượng",
        description: "Đông mùa Thủy vượng - Thận khí tàng trữ đầy đủ",
        advice: "Thời điểm TỐT để chữa bệnh Thận. Giữ ấm lưng, chân",
      },
      Mộc: {
        strength: "tương",
        description: "Thủy sinh Mộc - Gan huyết được nuôi dưỡng tốt",
        advice: "Bổ Gan huyết bằng rau xanh, gan động vật",
      },
      Kim: {
        strength: "hưu",
        description: "Kim sinh Thủy - Phổi đã xuất khí, cần giữ ấm",
        advice: "Giữ ấm ngực, cổ, tránh lạnh",
      },
      Thổ: {
        strength: "tù",
        description: "Thủy khắc Thổ - Tỳ Vị hư hàn, dễ tiêu chảy",
        advice: "Ăn ấm, uống gừng, tránh đồ lạnh TUYỆT ĐỐI",
      },
      Hỏa: {
        strength: "tử",
        description: "Thủy khắc Hỏa nghiêm trọng - Tim dương cực yếu, sợ lạnh",
        advice: "CỰC KỲ CHÚ Ý: Giữ ấm cả người, tránh gió lạnh, vận động đều đặn",
      },
    },
  }

  return (
    strengthMap[season][element] || {
      strength: "tương",
      description: "Cần xét thêm theo thời tiết cụ thể",
      advice: "Tham khảo thầy thuốc",
    }
  )
}
