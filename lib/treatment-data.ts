export interface AcupressurePoint {
  name: string
  location: string
  technique: string
  duration: string
  benefits: string
}

export interface HerbalFormula {
  name: string
  ingredients: { name: string; amount: string }[]
  preparation: string
  dosage: string
  contraindications: string
}

export interface NumerologySequence {
  sequence: string
  meaning: string
  instructions: string
  frequency: string
}

export function getAcupressureTreatment(organs: string[]): AcupressurePoint[] {
  const treatments: Record<string, AcupressurePoint[]> = {
    Thận: [
      {
        name: "Huyệt Thận Du (BL23)",
        location: "Lưng, ngang rốn, cách đường giữa 1.5 thốn",
        technique: "Bấm nhẹ nhàng theo vòng tròn",
        duration: "3-5 phút mỗi bên, 2 lần/ngày",
        benefits: "Bồi bổ thận khí, tăng cường sinh lực",
      },
      {
        name: "Huyệt Dũng Tuyền (KI1)",
        location: "Gan bàn chân, 1/3 trước bàn chân",
        technique: "Xoa nóng bằng lòng bàn tay",
        duration: "5-10 phút trước khi ngủ",
        benefits: "An thần, bồi bổ thận âm",
      },
    ],
    Tim: [
      {
        name: "Huyệt Thần Môn (HT7)",
        location: "Cổ tay trong, phía ngoài gân cổ tay",
        technique: "Bấm nhẹ nhàng, hít thở sâu",
        duration: "3 phút mỗi bên, khi căng thẳng",
        benefits: "An thần, giảm lo âu, cải thiện giấc ngủ",
      },
    ],
    Gan: [
      {
        name: "Huyệt Thái Xung (LR3)",
        location: "Mu bàn chân, giữa ngón cái và ngón trỏ",
        technique: "Bấm sâu, giữ 30 giây rồi nhả",
        duration: "5 phút mỗi bên, buổi tối",
        benefits: "Giải uất gan, giảm căng thẳng",
      },
    ],
    Phổi: [
      {
        name: "Huyệt Trung Phủ (LU1)",
        location: "Ngực, dưới xương đòn 1 thốn",
        technique: "Xoa nhẹ nhàng theo chiều kim đồng hồ",
        duration: "3-5 phút, 2 lần/ngày",
        benefits: "Tuyên thông phế khí, giảm ho",
      },
    ],
    "Tỳ vị": [
      {
        name: "Huyệt Túc Tam Lý (ST36)",
        location: "Chân, dưới đầu gối 3 thốn, ngoài xương chày",
        technique: "Bấm vừa mạnh, xoay tròn",
        duration: "5 phút mỗi bên, sau bữa ăn 30 phút",
        benefits: "Bổ tỳ vị, tăng cường tiêu hóa",
      },
    ],
  }

  let points: AcupressurePoint[] = []
  organs.forEach((organ) => {
    if (treatments[organ]) {
      points = [...points, ...treatments[organ]]
    }
  })

  return points.length > 0
    ? points
    : [
        {
          name: "Huyệt Hợp Cốc (LI4)",
          location: "Mu bàn tay, giữa xương bàn tay thứ 1 và 2",
          technique: "Bấm mạnh, giữ 1 phút",
          duration: "3-5 phút mỗi bên",
          benefits: "Tăng cường sức khỏe tổng thể",
        },
      ]
}

export function getHerbalFormula(element: string): HerbalFormula {
  const formulas: Record<string, HerbalFormula> = {
    Thủy: {
      name: "Lục Vị Địa Hoàng Hoàn",
      ingredients: [
        { name: "Thục địa hoàng", amount: "24g" },
        { name: "Sơn thù du", amount: "12g" },
        { name: "Sơn dược", amount: "12g" },
        { name: "Trạch tả", amount: "9g" },
        { name: "Mẫu đơn bì", amount: "9g" },
        { name: "Phục linh", amount: "9g" },
      ],
      preparation: "Sắc với 800ml nước còn 300ml, chia 2 lần uống",
      dosage: "Ngày 1 thang, uống ấm sau bữa ăn",
      contraindications: "Không dùng khi bị cảm, tiêu chảy",
    },
    Hỏa: {
      name: "Thiên Vương Bổ Tâm Đan",
      ingredients: [
        { name: "Sinh địa", amount: "15g" },
        { name: "Đương quy", amount: "10g" },
        { name: "Thiên môn đông", amount: "10g" },
        { name: "Mạch môn đông", amount: "10g" },
        { name: "Toan táo nhân", amount: "10g" },
        { name: "Bách tử nhân", amount: "10g" },
      ],
      preparation: "Sắc với 1000ml nước còn 400ml, chia 2 lần",
      dosage: "Uống buổi sáng và tối, trước khi ngủ 1 giờ",
      contraindications: "Không dùng khi bị cảm, sốt cao",
    },
    Mộc: {
      name: "Tiêu Dao Tán",
      ingredients: [
        { name: "Sài hồ", amount: "12g" },
        { name: "Đương quy", amount: "12g" },
        { name: "Bạch thược", amount: "12g" },
        { name: "Bạch truật", amount: "10g" },
        { name: "Phục linh", amount: "10g" },
        { name: "Cam thảo", amount: "6g" },
      ],
      preparation: "Sắc với 800ml nước còn 300ml",
      dosage: "Chia 2 lần uống trong ngày",
      contraindications: "Thai phụ hỏi ý kiến thầy thuốc",
    },
    Kim: {
      name: "Sa Sâm Mạch Môn Đông Thang",
      ingredients: [
        { name: "Sa sâm", amount: "15g" },
        { name: "Mạch môn đông", amount: "10g" },
        { name: "Ngũ vị tử", amount: "6g" },
        { name: "Bách bộ", amount: "10g" },
        { name: "Hạnh nhân", amount: "10g" },
      ],
      preparation: "Sắc với 800ml nước còn 300ml",
      dosage: "Ngày 1 thang, uống ấm",
      contraindications: "Không dùng khi bị phong hàn",
    },
    Thổ: {
      name: "Tứ Quân Tử Thang",
      ingredients: [
        { name: "Nhân sâm", amount: "10g" },
        { name: "Bạch truật", amount: "10g" },
        { name: "Phục linh", amount: "10g" },
        { name: "Cam thảo", amount: "6g" },
      ],
      preparation: "Sắc với 600ml nước còn 250ml",
      dosage: "Uống ấm, 2 lần/ngày",
      contraindications: "Không dùng khi bị nhiệt cao",
    },
  }

  return formulas[element] || formulas["Thổ"]
}

export function getNumerologySequence(upperTrigram: number, lowerTrigram: number): NumerologySequence {
  const sequence = `${upperTrigram}${lowerTrigram}0.${upperTrigram * 100 + lowerTrigram}`

  return {
    sequence,
    meaning: `Dãy số tượng trưng cho sự hài hòa giữa Thiên (${upperTrigram}) và Địa (${lowerTrigram})`,
    instructions:
      "Niệm dãy số này trong tâm trí, mỗi số đọc rõ ràng. Tưởng tượng ánh sáng vàng ấm áp lan toa khắp cơ thể.",
    frequency: "Niệm 108 lần mỗi ngày, buổi sáng và tối mỗi lần 54 lần",
  }
}
