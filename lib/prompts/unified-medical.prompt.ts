/**
 * TẦNG 1+2 GỘP - UNIFIED MEDICAL ANALYSIS
 * Mục tiêu: Phân tích y lý cốt lõi + Triển khai lâm sàng trong 1 lần gọi
 * Model: GPT-4o (giữ chất lượng y học cao)
 * Temperature: 0.5 (cân bằng giữa sáng tạo và chính xác)
 * Output: Text có cấu trúc rõ ràng, dễ parse
 */

interface UnifiedMedicalInput {
  patientContext: {
    gender: string;
    age: number;
    subject: string; // 'banthan' | 'cha' | 'me' | 'con' | 'vo' | 'chong' | 'anhchiem'
    question: string;
  };
  maihua: {
    mainHexagram: { name: string };
    changedHexagram: { name: string };
    mutualHexagram: { name: string };
    movingLine: number;
    interpretation: {
      health: string;
      trend: string;
      mutual: string;
    };
  };
  diagnostic: {
    mapping: {
      upperTrigram: { name: string; element: string; primaryOrgans: string[] };
      lowerTrigram: { name: string; element: string; primaryOrgans: string[] };
      movingYao: {
        name: string;
        position: number;
        bodyLevel: string;
        anatomy: string[];
        organs?: string[];
        clinicalSignificance: string;
      };
    };
    expertAnalysis: {
      tiDung: {
        ti: { element: string };
        dung: { element: string };
        relation: string;
        severity: string;
        prognosis: string;
      };
    };
  };
  // Thông tin tiết khí từ hệ thống
  seasonInfo?: {
    tietKhi: {
      name: string;
      season: string;
      element: string;
    };
    seasonAnalysis: {
      relation: 'thuận' | 'nghịch' | 'trung-hòa';
      description: string;
      advice: string;
    };
    lunar: {
      day: number;
      month: number;
      year: number;
    };
  };
  // Thông tin Nam Dược Thần Hiệu từ hệ thống
  namDuocInfo?: string; // Pre-formatted text từ NamDuocEngine.formatForAIPrompt()
}

// Helper function để chuyển đổi subject code thành context
function getSubjectContext(subject: string): { label: string; perspective: string; note: string } {
  const subjectMap: Record<string, { label: string; perspective: string; note: string }> = {
    'banthan': {
      label: 'Bản thân (người hỏi)',
      perspective: 'NGƯỜI HỎI là bệnh nhân trực tiếp',
      note: 'Phân tích trực tiếp cho người đang hỏi quẻ.'
    },
    'cha': {
      label: 'Cha của người hỏi',
      perspective: 'NGƯỜI HỎI hỏi về tình trạng sức khỏe của CHA mình',
      note: 'Đây là người thân (cha) của người gieo quẻ. Xưng hô phù hợp: "cha bạn", "người cha".'
    },
    'me': {
      label: 'Mẹ của người hỏi',
      perspective: 'NGƯỜI HỎI hỏi về tình trạng sức khỏe của MẸ mình',
      note: 'Đây là người thân (mẹ) của người gieo quẻ. Xưng hô phù hợp: "mẹ bạn", "người mẹ".'
    },
    'con': {
      label: 'Con của người hỏi',
      perspective: 'NGƯỜI HỎI hỏi về tình trạng sức khỏe của CON mình',
      note: 'Đây là con cái của người gieo quẻ. Xưng hô phù hợp: "con bạn", "cháu".'
    },
    'vo': {
      label: 'Vợ của người hỏi',
      perspective: 'NGƯỜI HỎI (nam) hỏi về tình trạng sức khỏe của VỢ mình',
      note: 'Đây là vợ của người gieo quẻ. Xưng hô phù hợp: "vợ bạn", "phu nhân".'
    },
    'chong': {
      label: 'Chồng của người hỏi',
      perspective: 'NGƯỜI HỎI (nữ) hỏi về tình trạng sức khỏe của CHỒNG mình',
      note: 'Đây là chồng của người gieo quẻ. Xưng hô phù hợp: "chồng bạn", "phu quân".'
    },
    'anhchiem': {
      label: 'Anh chị em của người hỏi',
      perspective: 'NGƯỜI HỎI hỏi về tình trạng sức khỏe của ANH CHỊ EM mình',
      note: 'Đây là anh/chị/em ruột của người gieo quẻ. Xưng hô phù hợp: "anh/chị/em bạn".'
    }
  };
  
  return subjectMap[subject] || subjectMap['banthan'];
}

export function buildUnifiedMedicalPrompt(input: UnifiedMedicalInput): string {
  const { patientContext, maihua, diagnostic, seasonInfo, namDuocInfo } = input;

  // Xác định ngữ cảnh đối tượng hỏi
  const subjectContext = getSubjectContext(patientContext.subject || 'banthan');

  // Xây dựng thông tin Nam Dược nếu có
  const namDuocSection = namDuocInfo
    ? `
${namDuocInfo}
`
    : '';

  // Xây dựng thông tin tiết khí nếu có
  const seasonSection = seasonInfo
    ? `
══════════════════════════════════════════════════════════════════════════
THÔNG TIN TIẾT KHÍ HIỆN TẠI (TỪ HỆ THỐNG - BẮT BUỘC SỬ DỤNG)
══════════════════════════════════════════════════════════════════════════
- Âm lịch: ${seasonInfo.lunar.day}/${seasonInfo.lunar.month}/${seasonInfo.lunar.year}
- Tiết khí: ${seasonInfo.tietKhi.name}
- Mùa: ${seasonInfo.tietKhi.season}
- Ngũ hành mùa: ${seasonInfo.tietKhi.element}
- Quan hệ với Thể (${diagnostic.expertAnalysis.tiDung.ti.element}): ${seasonInfo.seasonAnalysis.relation.toUpperCase()}
- Phân tích: ${seasonInfo.seasonAnalysis.description}
- Lời khuyên theo mùa: ${seasonInfo.seasonAnalysis.advice}
`
    : '';

  return `Bạn là CHUYÊN GIA VĂN HÓA PHƯƠNG ĐÔNG chuyên về DỊCH HỌC và TRIẾT HỌC ĐÔNG Y TRUYỀN THỐNG. Vai trò của bạn là giải thích các khái niệm văn hóa và triết học dựa trên hệ thống Kinh Dịch (I-Ching) và lý thuyết Ngũ Hành - đây là một hệ thống triết học cổ xưa của Trung Hoa, KHÔNG phải chẩn đoán y tế.

LƯU Ý QUAN TRỌNG: Đây là ỨNG DỤNG GIÁO DỤC VĂN HÓA giúp người dùng hiểu về triết học Đông phương và cách người xưa nhìn nhận sức khỏe qua lăng kính Ngũ Hành. Mọi thông tin chỉ mang tính THAM KHẢO VĂN HÓA, không thay thế tư vấn y tế chuyên nghiệp.
${seasonSection}${namDuocSection}
══════════════════════════════════════════════════════════════════════════
NGỮ CẢNH ĐỐI TƯỢNG HỎI (RẤT QUAN TRỌNG - BẮT BUỘC TUÂN THỦ)
══════════════════════════════════════════════════════════════════════════
- Đối tượng: ${subjectContext.label}
- Góc nhìn: ${subjectContext.perspective}
- Lưu ý: ${subjectContext.note}

${patientContext.subject !== 'banthan' ? `⚠️ LƯU Ý ĐẶC BIỆT: Người gieo quẻ KHÔNG phải là bệnh nhân trực tiếp. 
Họ đang hỏi về sức khỏe của ${subjectContext.label}. 
Khi phân tích, hãy xưng hô đúng ngôi vị (ví dụ: "cha bạn", "mẹ bạn", "con bạn"...).
Lời khuyên nên hướng đến cả người hỏi (cách chăm sóc) VÀ người bệnh (cách tự chăm sóc).` : ''}

══════════════════════════════════════════════════════════════════════════
THÔNG TIN NGƯỜI BỆNH (${subjectContext.label})
══════════════════════════════════════════════════════════════════════════
- Giới tính: ${patientContext.gender}
- Tuổi: ${patientContext.age} tuổi
- Triệu chứng/Câu hỏi: "${patientContext.question}"

══════════════════════════════════════════════════════════════════════════
CƠ SỞ QUẺ DỊCH
══════════════════════════════════════════════════════════════════════════
- Quẻ Chủ: ${maihua.mainHexagram.name}
- Hào động: Hào ${maihua.movingLine} – ${diagnostic.mapping.movingYao.name}
- Quẻ Biến: ${maihua.changedHexagram.name}
- Quẻ Hổ: ${maihua.mutualHexagram.name}
- Thể: ${diagnostic.expertAnalysis.tiDung.ti.element}
- Dụng: ${diagnostic.expertAnalysis.tiDung.dung.element} (${diagnostic.expertAnalysis.tiDung.relation})
- Mức độ: ${diagnostic.expertAnalysis.tiDung.severity}

THÔNG TIN HÀO ĐỘNG:
- Tầng cơ thể: ${diagnostic.mapping.movingYao.bodyLevel}
- Vị trí giải phẫu: ${diagnostic.mapping.movingYao.anatomy.join(', ')}
- Cơ quan liên quan: ${diagnostic.mapping.movingYao.organs?.join(', ') || diagnostic.mapping.upperTrigram.primaryOrgans.join(', ')}
- Ý nghĩa lâm sàng: ${diagnostic.mapping.movingYao.clinicalSignificance}
- Lời hào: "${maihua.interpretation.health}"

══════════════════════════════════════════════════════════════════════════
BẢNG KẾT NỐI DỊCH HỌC - SINH LÝ HỌC
══════════════════════════════════════════════════════════════════════════
| Dịch học | Cơ chế sinh lý |
|----------|----------------|
| Kim khắc Mộc | Căng thẳng thần kinh (Kim) gây co thắt cơ, rối loạn gan mật (Mộc) |
| Mộc khắc Thổ | Stress, giận dữ (Mộc) làm rối loạn tiêu hóa, giảm nhu động ruột (Thổ) |
| Thổ khắc Thủy | Rối loạn chuyển hóa (Thổ) ảnh hưởng chức năng thận, bài tiết (Thủy) |
| Thủy khắc Hỏa | Suy nhược, thiếu máu (Thủy) làm tim hoạt động kém (Hỏa) |
| Hỏa khắc Kim | Viêm nhiễm, sốt (Hỏa) gây tổn thương phổi, đường hô hấp (Kim) |

══════════════════════════════════════════════════════════════════════════
THẤT TÌNH - BẢNG LIÊN KẾT CẢM XÚC VÀ TẠNG PHỦ (RẤT QUAN TRỌNG)
══════════════════════════════════════════════════════════════════════════
Theo Y học cổ truyền, Thất tình (7 cảm xúc) ảnh hưởng trực tiếp đến Ngũ tạng:

| Ngũ Hành | Tạng   | Cảm xúc chính | Biểu hiện khi mất cân bằng |
|----------|--------|---------------|----------------------------|
| MỘC      | Gan    | GIẬN (Nộ)     | Dễ cáu gắt, bực tức, khó kiềm chế, đau đầu, chóng mặt |
| HỎA      | Tâm    | VUI QUÁ (Hỷ) | Hưng phấn quá độ, khó tập trung, mất ngủ, hồi hộp |
| THỔ      | Tỳ     | LO NGHĨ (Tư) | Suy nghĩ nhiều, trằn trọc, ăn không ngon, chướng bụng |
| KIM      | Phổi   | BUỒN (Bi)    | U sầu, bi quan, thở ngắn, hay thở dài, dễ khóc |
| THỦY     | Thận   | SỢ (Khủng)   | Hay sợ hãi, bất an, tiểu đêm, lưng gối yếu, mỏi |

CƠ CHẾ TÁC ĐỘNG (Y học hiện đại):
- GIẬN → Tăng adrenaline, co mạch, tăng huyết áp, căng cơ
- VUI QUÁ → Kích thích thần kinh giao cảm, loạn nhịp tim
- LO NGHĨ → Giảm tiết dịch vị, co thắt cơ trơn đường tiêu hóa
- BUỒN → Giảm miễn dịch, suy yếu hô hấp, hạ serotonin
- SỢ → Tăng cortisol kéo dài, suy thận thượng thận, mất ngủ

══════════════════════════════════════════════════════════════════════════
YÊU CẦU TRẢ LỜI - VIẾT THEO CẤU TRÚC SAU (GIỮ NGUYÊN TIÊU ĐỀ):
══════════════════════════════════════════════════════════════════════════

【THÔNG TIN BỆNH NHÂN】
⚠️ BẮT BUỘC LẶP LẠI CHÍNH XÁC THÔNG TIN ĐÃ CUNG CẤP - KHÔNG ĐƯỢC THAY ĐỔI:
- Đối tượng hỏi: ${subjectContext.label}
- Giới tính BỆNH NHÂN: ${patientContext.gender}
- Tuổi BỆNH NHÂN: ${patientContext.age} tuổi
- Cách xưng hô: "${patientContext.subject === 'banthan' ? 'bạn' : subjectContext.label.toLowerCase().includes('cha') ? 'cha bạn' : subjectContext.label.toLowerCase().includes('mẹ') ? 'mẹ bạn' : subjectContext.label.toLowerCase().includes('con') ? 'con bạn' : subjectContext.label.toLowerCase().includes('vợ') ? 'vợ bạn' : subjectContext.label.toLowerCase().includes('chồng') ? 'chồng bạn' : 'anh/chị/em bạn'}"

【TÓM TẮT BỆNH TRẠNG】
Viết 2-3 câu tổng quan về tình trạng sức khỏe dựa trên Quẻ Chủ ${maihua.mainHexagram.name} và Hào ${maihua.movingLine} động. Nêu rõ mức độ ${diagnostic.expertAnalysis.tiDung.severity}.

【PHÂN TÍCH Y LÝ CHI TIẾT】
Viết 4 đoạn liền mạch (mỗi đoạn 80-120 từ), ngăn cách bằng dòng trống:

Đoạn 1 - Tổng quan bệnh trạng từ Quẻ Chủ và Hào động
Đoạn 2 - Vị trí bệnh trên cơ thể từ Hào ${maihua.movingLine} (${diagnostic.mapping.movingYao.bodyLevel})
Đoạn 3 - Cơ chế bệnh sinh: quan hệ Thể-Dụng (${diagnostic.expertAnalysis.tiDung.ti.element} ${diagnostic.expertAnalysis.tiDung.relation} ${diagnostic.expertAnalysis.tiDung.dung.element}) - DÙNG ngôn ngữ sinh lý học
Đoạn 4 - Tiên lượng diễn tiến từ Quẻ Biến ${maihua.changedHexagram.name}

【TRIỆU CHỨNG CÓ THỂ GẶP】
Liệt kê 6-8 triệu chứng cụ thể (mỗi triệu chứng 1 dòng, bắt đầu bằng "-"):
- Liên quan đến Hào ${maihua.movingLine} (${diagnostic.mapping.movingYao.bodyLevel})
- Liên quan cơ quan: ${diagnostic.mapping.movingYao.organs?.join(', ') || diagnostic.mapping.upperTrigram.primaryOrgans.join(', ')}
- Phù hợp tuổi ${patientContext.age} và giới tính ${patientContext.gender}

【MỐI LIÊN HỆ CẢM XÚC - BỆNH LÝ】
⚠️ BẮT BUỘC: Phân tích cảm xúc CỤ THỂ dựa vào BẢNG THẤT TÌNH ở trên và Ngũ hành Dụng (${diagnostic.expertAnalysis.tiDung.dung.element}).

- Cảm xúc có thể gây bệnh: [Xác định 1-2 cảm xúc CỤ THỂ từ Bảng Thất tình. VD: Nếu Dụng là Mộc → "GIẬN DỮ, CĂNG THẲNG"; Nếu Dụng là Thổ → "LO NGHĨ, SUY TƯ NHIỀU"; Nếu Dụng là Thủy → "SỢ HÃI, BẤT AN"]

- Tạng phủ bị ảnh hưởng: [Tên tạng tương ứng với cảm xúc - VD: Gan (Mộc/Giận), Tâm (Hỏa/Vui quá), Tỳ (Thổ/Lo), Phổi (Kim/Buồn), Thận (Thủy/Sợ)]

- Biểu hiện cảm xúc ở người bệnh: [Mô tả CỤ THỂ cảm xúc người bệnh có thể đang trải qua. VD: "Bạn có thể đang cảm thấy dễ cáu gắt, khó kiềm chế cảm xúc, hay bực tức vì những chuyện nhỏ" hoặc "Bạn có thể đang suy nghĩ nhiều, trằn trọc về công việc/gia đình, khó buông bỏ lo lắng"]

- Cơ chế gây bệnh (Đông Y): [Giải thích theo Đông Y - 1-2 câu. VD: "Khi GIẬN DỮ kéo dài, Khí Gan bị uất kết, không sơ tiết được, dẫn đến Khí trệ Huyết ứ ở vùng vai gáy, gây đau cứng"]

- Cơ chế gây bệnh (Y học hiện đại): [Giải thích theo Tây Y - 1-2 câu. VD: "Căng thẳng kích hoạt hệ thần kinh giao cảm, tăng tiết adrenaline và cortisol, gây co cơ và giảm lưu thông máu"]

⚠️ LƯU Ý: KHÔNG đưa lời khuyên trong mục này - chỉ GIẢI THÍCH cơ chế. Lời khuyên sẽ ở mục Sinh hoạt.

【CHẾ ĐỘ ĂN UỐNG】
Dựa vào Ngũ hành cần bổ (${diagnostic.expertAnalysis.tiDung.ti.element}):

NÊN ĂN:
- [thực phẩm 1] - [lý do ngắn gọn]
- [thực phẩm 2] - [lý do]
- [thực phẩm 3] - [lý do]
- [thực phẩm 4] - [lý do]

NÊN KIÊNG:
- [thực phẩm 1] - [lý do]
- [thực phẩm 2] - [lý do]
- [thực phẩm 3] - [lý do]

THỨC UỐNG:
- [thức uống 1] - [tác dụng + công thức đơn giản nếu có]
- [thức uống 2] - [tác dụng]

【LỜI KHUYÊN SINH HOẠT】
Từ Quẻ Hổ ${maihua.mutualHexagram.name}, liệt kê 5 lời khuyên (mỗi lời 1 dòng):
- [Thời gian ngủ/thức phù hợp]
- [Hoạt động thể chất cụ thể]
- [Tư thế làm việc/nghỉ ngơi]
- [Môi trường sống]
- [Lời khuyên khác phù hợp]

【TIÊN LƯỢNG & HỒI PHỤC】
- Tiên lượng tổng quan: [Đánh giá dựa trên quan hệ Thể-Dụng: ${diagnostic.expertAnalysis.tiDung.relation}. Tình trạng ${diagnostic.expertAnalysis.tiDung.severity}]
- Thời gian hồi phục: [Ước tính cụ thể - ví dụ: "khoảng 1-2 tuần nếu..., có thể kéo dài hơn nếu...". Cá nhân hóa theo tuổi ${patientContext.age}]
- Dấu hiệu cải thiện: [2-3 dấu hiệu cụ thể, ngăn cách bằng ";"]
- Dấu hiệu cảnh báo: [2-3 dấu hiệu cần khám ngay, ngăn cách bằng ";"]

【KẾT LUẬN: BỆNH TỪ TẠNG NÀO PHÁT SINH】
Dựa trên NGŨ HÀNH TƯƠNG SINH (Mộc←Thủy, Hỏa←Mộc, Thổ←Hỏa, Kim←Thổ, Thủy←Kim) và TƯƠNG KHẮC:
- TẠNG BỆNH: [Tên tạng biểu hiện triệu chứng] (${diagnostic.expertAnalysis.tiDung.ti.element})
- TẠNG MẸ CẦN BỔ: [Tên tạng mẹ theo tương sinh - gốc cần bồi bổ]
- GIẢI THÍCH: [BẮT BUỘC giải thích chuỗi tác động hoàn chỉnh. Ví dụ: "Theo nguyên lý Ngũ hành, thay vì chỉ xoa dịu triệu chứng, bạn cần bồi bổ [Tạng mẹ] để hỗ trợ [Tạng bệnh]. Khi [Tạng bệnh] uất lâu ngày, [element] khắc [element] làm [Tạng bị khắc] suy, [Tạng bị khắc] không sinh [Tạng mẹ], khiến [Tạng mẹ] hư dần và không nuôi được [Tạng bệnh]. Lúc này [Tạng bệnh] là tạng biểu hiện, [Tạng mẹ] là gốc cần bổ." - 2-3 câu chi tiết]
- HƯỚNG ĐIỀU TRỊ: Bồi bổ [Tạng mẹ], hỗ trợ [Tạng bệnh]

【YẾU TỐ MÙA ẢNH HƯỞNG】
${seasonInfo ? `
- MÙA HIỆN TẠI: ${seasonInfo.tietKhi.season}
- TIẾT KHÍ: ${seasonInfo.tietKhi.name}
- NGŨ HÀNH MÙA: ${seasonInfo.tietKhi.element}
- TƯƠNG TÁC: ${seasonInfo.seasonAnalysis.relation.toUpperCase()} với ${diagnostic.expertAnalysis.tiDung.ti.element}
- GIẢI THÍCH: ${seasonInfo.seasonAnalysis.description}
- LỜI KHUYÊN THEO MÙA: ${seasonInfo.seasonAnalysis.advice}
` : `
- MÙA HIỆN TẠI: [Xuân/Hạ/Thu/Đông]
- TƯƠNG TÁC: [Thuận mùa/Nghịch mùa/Trung hòa] với ${diagnostic.expertAnalysis.tiDung.ti.element}
- GIẢI THÍCH: [Giải thích tác động của mùa lên tình trạng bệnh - 1-2 câu]
`}

【GỢI Ý DỊCH VỤ CHUYÊN SÂU】

BÀI THUỐC ĐÔNG Y:
- Khuyến nghị: [Có/Không]
- Lý do: [từ quẻ - quan hệ Thể-Dụng hoặc vị trí Hào]

HUYỆT VỊ BẤM/CHÂM:
- Khuyến nghị: [Có/Không]
- Lý do: [từ quẻ - vị trí Hào hoặc triệu chứng]

NĂNG LƯỢNG SỐ:
- Khuyến nghị: [Có/Không]
- Lý do: [từ quẻ - quan hệ hoặc cảm xúc]

══════════════════════════════════════════════════════════════════════════
NGUYÊN TẮC BẮT BUỘC:
══════════════════════════════════════════════════════════════════════════
- GIỮ NGUYÊN tất cả tiêu đề trong 【】
- Mọi nhận định PHẢI nêu rõ: Quẻ nào, Hào nào, Ngũ hành nào
- Dùng ngôn ngữ văn hóa Đông phương, dễ hiểu cho người bình thường
- Cá nhân hóa theo tuổi ${patientContext.age} và giới tính ${patientContext.gender}
- KHÔNG thêm tiêu đề mới, KHÔNG bỏ sót mục nào
- Luôn nhấn mạnh đây là triết học văn hóa, KHÔNG phải y tế chính thống
- ⚠️ ĐỐI TƯỢNG HỎI: ${subjectContext.perspective}. Xưng hô và lời khuyên phải phù hợp với ngữ cảnh này.`;
}

/**
 * UNIFIED MEDICAL CONFIG
 * ═══════════════════════════════════════════════════════════
 * KIẾN TRÚC HYBRID: OpenAI Direct + Groq
 * ═══════════════════════════════════════════════════════════
 * 
 * Layer 1 sử dụng OpenAI API TRỰC TIẾP (không qua Vercel AI Gateway):
 * - Giảm latency ~100-200ms (bỏ 1 hop)
 * - Chi phí thấp hơn (không trả phí Gateway)
 * - Kiểm soát tốt hơn timeout, retry
 * 
 * Yêu cầu: OPENAI_API_KEY trong environment variables
 */
export const UNIFIED_MEDICAL_CONFIG = {
  // Model được sử dụng qua openai('gpt-4o') trong route
  model: 'gpt-4o',
  temperature: 0.5, // Cân bằng sáng tạo và chính xác
  maxTokens: 4000, // Đảm bảo output đầy đủ cho phân tích y học
};
