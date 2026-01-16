/**
 * Diễn giải chi tiết 64 quẻ trong y học theo Mai Hoa Dịch Số
 * Mỗi quẻ có ý nghĩa riêng về sức khỏe, không thể áp dụng chung
 */

export interface HexagramHealthMeaning {
  number: number
  name: string
  healthNature: string // Tính chất y học của quẻ
  bodyAspect: string // Phần cơ thể liên quan
  commonSymptoms: string[] // Triệu chứng thường gặp khi quẻ này xuất hiện
  positiveSign: string // Dấu hiệu tốt
  negativeSign: string // Dấu hiệu xấu
  detailedAnalysis: string // Phân tích chi tiết bằng ngôn ngữ chuyên gia
  advice: string // Lời khuyên cụ thể
}

// 8 quẻ thuần (八纯卦) - quan trọng nhất trong y học
export const PURE_HEXAGRAMS: Record<number, HexagramHealthMeaning> = {
  1: {
    // 乾为天 - Càn Vi Thiên
    number: 1,
    name: "Càn Vi Thiên",
    healthNature: "Thuần dương chi quẻ, khí cương kiện, chủ đầu não và xương cốt",
    bodyAspect: "Đầu, não, xương, phổi (Kim tạng)",
    commonSymptoms: ["Đau đầu, chóng mặt", "Xương khớp cứng đơ", "Khí huyết vượng thịnh quá mức", "Cao huyết áp"],
    positiveSign:
      "Nếu Thể khắc Dụng hoặc Dụng sinh Thể: Thể chất cường tráng, xương cốt chắc khỏe, đầu óc minh mẫn. Quẻ này xuất hiện khi cơ thể đang ở trạng thái đỉnh cao.",
    negativeSign:
      "Nếu Dụng khắc Thể: Dương khí quá thịnh gây nóng trong, đau đầu dữ dội, cao huyết áp nguy hiểm. Cần giảm bớt sự căng thẳng ngay.",
    detailedAnalysis:
      "Quẻ Càn thuần dương, tượng trưng cho bầu trời, cho sức mạnh cương kiện. Trong y học, Càn chủ về đầu não - nơi chứa đựng tinh thần, và xương cốt - cấu trúc nền tảng của cơ thể. Khi quẻ Càn xuất hiện, tôi thường thấy bệnh nhân có vấn đề về huyết áp hoặc đầu óc căng thẳng quá mức. Càn thuộc Kim, nên cũng liên quan đến phổi và hô hấp. Người có quẻ Càn thường có tính cách mạnh mẽ, quyết đoán, nhưng dễ bị stress và làm việc quá sức. Thầy xưa nói: 'Càn vi thủ' - Càn chủ về đầu, vì vậy các bệnh về đầu não, huyết áp đều cần xem xét quẻ Càn.",
    advice:
      "Với quẻ Càn, bạn cần học cách thư giãn và 'nhu' hơn. Dương quá thịnh thì cần âm để điều hòa. Hãy tập thiền, yoga, hoặc đi bộ nhẹ nhàng. Ăn nhiều rau xanh, tránh đồ cay nóng và rượu bia. Ngủ đủ giấc rất quan trọng - 'Càn vi thủ', đầu não cần nghỉ ngơi thì mới sáng suốt. Nếu có cao huyết áp, cần kiểm tra thường xuyên và tuân thủ điều trị.",
  },

  2: {
    // 坤为地 - Khôn Vi Địa
    number: 2,
    name: "Khôn Vi Địa",
    healthNature: "Thuần âm chi quẻ, khí nhu thuận, chủ tỳ vị và hệ tiêu hóa",
    bodyAspect: "Tỳ, vị, bụng, cơ bắp",
    commonSymptoms: ["Đầy bụng, khó tiêu", "Mệt mỏi, chân tay nặng", "Da vàng xanh", "Phân lỏng"],
    positiveSign:
      "Nếu Dụng sinh Thể: Tiêu hóa tốt, cơ thể hấp thụ dinh dưỡng hiệu quả, cơ bắp khỏe mạnh. Tính tình nhu thuận, dễ chịu.",
    negativeSign:
      "Nếu Dụng khắc Thể hoặc Thể sinh Dụng: Tỳ vị hư yếu trầm trọng, ăn không tiêu, người gầy yếu, mệt mỏi kéo dài. Có thể thiếu máu.",
    detailedAnalysis:
      "Quẻ Khôn thuần âm, tượng trưng cho đất đai, cho sự nuôi dưỡng và chứa đựng. Trong y học cổ truyền, Khôn chính là Tỳ Vị - trung tiêu, nơi tiếp nhận và biến hóa thức ăn thành khí huyết nuôi cơ thể. Tôi hay gặp những người có quẻ Khôn thường có vấn đề về tiêu hóa, đặc biệt là đầy bụng, ăn không ngon miệng. Khôn thuộc Thổ, chủ cơ bắp, nên người Khôn yếu sẽ thấy cơ bắp teo, chân tay không có sức. Thầy xưa dạy: 'Khôn vi phúc' - Khôn chủ về bụng, và 'Tỳ vị vi hậu thiên chi bản' - Tỳ Vị là gốc của hậu thiên, nên phải chăm sóc cẩn thận.",
    advice:
      "Người có quẻ Khôn cần đặc biệt chú ý đến Tỳ Vị. Ăn uống phải điều độ, đúng giờ, nhai kỹ. Tránh ăn đồ lạnh, sống, khó tiêu. Nên ăn cháo, súp, thức ăn mềm dễ tiêu. Vận động nhẹ nhàng sau bữa ăn, đừng nằm ngay. Massage bụng theo chiều kim đồng hồ mỗi ngày. Suy nghĩ quá nhiều sẽ tổn thương Tỳ, vì 'Tư thương Tỳ', nên hãy giữ tâm trạng thoải mái, đừng lo nghĩ quá độ.",
  },

  3: {
    // 震为雷 - Chấn Vi Lôi
    number: 51,
    name: "Chấn Vi Lôi",
    healthNature: "Động quẻ, chủ chuyển động và kích động, liên quan đến gan và gân cơ",
    bodyAspect: "Gan, mật, gân cơ, chân",
    commonSymptoms: ["Chuột rút, co giật", "Chân tay run rẩy", "Giật mình, dễ hoảng", "Tiếng động lớn gây khó chịu"],
    positiveSign:
      "Nếu quẻ Chấn có lợi: Sinh lực mạnh mẽ, hành động nhanh nhẹn, gan khỏe, gân cơ dẻo dai. Phản ứng nhanh, thích vận động.",
    negativeSign:
      "Nếu quẻ Chấn bất lợi: Gan phong nội động, chuột rút thường xuyên, co giật, dễ giật mình hoảng sợ. Có thể bị động kinh (epilepsy).",
    detailedAnalysis:
      "Chấn là quẻ sấm động, là sự chuyển động bắt đầu từ dưới lên. Trong y học, Chấn tượng trưng cho Mộc - Gan, và đặc biệt là gân cơ. 'Gan chủ gân', khi Gan bị bệnh, gân cơ sẽ co cứng hoặc co giật. Tôi từng chữa nhiều trường hợp chuột rút đêm, run tay chân, sau khi xem quẻ thì đều là Chấn làm động. Chấn cũng liên quan đến chân (Chấn vi túc), nên các bệnh về chân cũng cần xem quẻ này. Người có quẻ Chấn thường năng động, thích vận động, nhưng cũng dễ bị thương do tai nạn hoặc động tác mạnh.",
    advice:
      "Quẻ Chấn động mạnh, cần có sự 'tĩnh' để điều hòa. Tập yoga, thái cực quyền để gân cơ dẻo dai mà không căng thẳng. Bổ sung canxi và magnesium để tránh chuột rút. Massage gân cốt thường xuyên. Tránh vận động quá mạnh đột ngột. Giữ tâm bình tĩnh, đừng để cảm xúc kích động quá mức. Nếu hay giật mình, cần bổ Gan huyết bằng táo đỏ, kỷ tử.",
  },

  29: {
    // 坎为水 - Khảm Vi Thủy
    number: 29,
    name: "Khảm Vi Thủy",
    healthNature: "Hiểm quẻ, chủ về thận, nước, hệ tiết niệu và sinh dục",
    bodyAspect: "Thận, bàng quang, tai, xương, hệ sinh dục",
    commonSymptoms: [
      "Đau lưng, mỏi gối",
      "Tiểu đêm nhiều",
      "Ù tai, điếc",
      "Sợ lạnh, chân tay lạnh",
      "Rối loạn sinh lý",
    ],
    positiveSign:
      "Nếu Khảm được sinh trợ: Thận khí đầy đủ, tai nghe rõ, xương chắc khỏe, trí nhớ tốt, sinh lực mạnh mẽ. Tuổi thọ cao.",
    negativeSign:
      "Nếu Khảm bị khắc hại: Thận hư trầm trọng, đau lưng không ngừng, tiểu không tự chủ, ù tai điếc, tóc rụng sớm. Sinh lý suy giảm nghiêm trọng.",
    detailedAnalysis:
      "Khảm là quẻ nước, là hiểm nạn, nhưng cũng là sinh mệnh. Trong y học, Khảm chính là Thận - 'Thận vi tiên thiên chi bản', gốc của tiên thiên, chứa đựng nguyên khí cha mẹ truyền cho. Tôi thấy những người lao động nặng, làm việc quá sức đều có Thận hư, và quẻ Khảm hay xuất hiện. Thầy xưa nói 'Thận khai khiếu ư nhĩ' - Thận mở ra ở tai, nên ù tai, điếc là dấu hiệu Thận hư. 'Thận chủ cốt sinh tủy' nên đau xương, mỏi gối cũng liên quan Thận. Khảm cũng chủ về sợ hãi (Thận chủ khủng), người hay sợ hãi vô cớ thường Thận hư.",
    advice:
      "Thận là gốc của sinh mệnh, phải hết sức trân trọng. Tránh làm việc quá sức, đặc biệt là làm đêm. Quan hệ tình dục phải điều độ, tuyệt đối không phóng túng. Ăn đậu đen, hạt óc chó, hạt sen đen để bổ Thận. Ngâm chân nước ấm mỗi tối. Massage vùng lưng dưới, huyệt Thận Du thường xuyên. Giữ ấm vùng lưng và chân. Nếu có triệu chứng Thận hư, cần dùng thuốc bổ Thận của thầy đông y, đừng tự ý mua thuốc.",
  },

  30: {
    // 离为火 - Ly Vi Hỏa
    number: 30,
    name: "Ly Vi Hỏa",
    healthNature: "Hỏa quẻ, chủ tim, huyết mạch, và tinh thần",
    bodyAspect: "Tim, tiểu tràng, mắt, huyết mạch",
    commonSymptoms: [
      "Tim đập nhanh, hồi hộp",
      "Mất ngủ, ác mộng",
      "Mắt đỏ, viêm mắt",
      "Lưỡi đỏ, lở miệng",
      "Lo âu, bồn chồn",
    ],
    positiveSign:
      "Nếu Ly quẻ tốt: Tinh thần minh mẫn, tâm trí sáng suốt, mắt sáng, da hồng hào. Nhiệt tình, vui vẻ, giao tiếp tốt.",
    negativeSign:
      "Nếu Ly quẻ xấu: Tâm hỏa vượng thịnh, mất ngủ trầm trọng, lo âu dữ dội, có thể rối loạn tâm thần. Tim loạn nhịp nguy hiểm. Mắt bị bệnh.",
    detailedAnalysis:
      "Ly là quẻ lửa, sáng rỡ nhưng cũng nóng bỏng. Trong y học, Ly chính là Tim - 'Tâm vi quân chủ chi quan' - Tim là quan của vua chúa, điều khiển toàn thân. Tôi thấy rất nhiều người stress, lo âu đều có vấn đề với quẻ Ly. 'Tâm chủ thần minh', Tim chủ về tinh thần ý thức, nên mất ngủ, lo âu, trầm cảm đều liên quan Tim. 'Tâm khai khiếu ư thiệt' - Tim mở ra ở lưỡi, nên lưỡi đỏ, lở miệng là dấu hiệu Tâm hỏa. Ly cũng chủ mắt (Ly vi mục), các bệnh về mắt cần xem quẻ Ly. Thời đại hiện đại, người ta làm việc căng thẳng, suy nghĩ nhiều, nên bệnh Tim rất phổ biến.",
    advice:
      "Tim là vua của các tạng, phải được bảo vệ tốt nhất. Giữ tâm bình tĩnh là quan trọng nhất - 'Tâm tĩnh tự nhiên lương' - Tâm tĩnh thì mát mẻ tự nhiên. Tránh cảm xúc thái quá, đừng quá vui hay quá buồn. Ngủ đủ giấc, tốt nhất là ngủ trước 11h đêm. Ăn đắng (khổ qua, trà xanh) để giáng hỏa. Thiền định hoặc niệm Phật để tâm thanh tịnh. Nếu mất ngủ, uống trà hoa sen hoặc táo nhân. Khám tim định kỳ nếu có tiền sử gia đình.",
  },

  52: {
    // 艮为山 - Cấn Vi Sơn
    number: 52,
    name: "Cấn Vi Sơn",
    healthNature: "Chỉ quẻ (dừng lại), chủ về tỳ vì, dạ dày, và xương khớp",
    bodyAspect: "Tỳ, vị, dạ dày, lưng, tay, khớp",
    commonSymptoms: [
      "Đau lưng, đau khớp",
      "Tiêu hóa kém, tắc nghẽn",
      "Tay sưng, đau ngón tay",
      "Cảm giác 'tắc', không thông",
    ],
    positiveSign: "Nếu Cấn ổn định: Vững vàng, ổn định, tiêu hóa đều đặn. Tay khỏe, cầm nắm tốt. Tính kiên nhẫn.",
    negativeSign:
      "Nếu Cấn bị bệnh: Tiêu hóa tắc nghẽn, táo bón, đầy bụng. Lưng đau, cứng khớp. Tư duy cứng nhắc, bế tắc.",
    detailedAnalysis:
      "Cấn là quẻ núi, là sự dừng lại, ngăn cản. Trong y học, Cấn thuộc Thổ, liên quan Tỳ Vị, nhưng khác với Khôn ở chỗ Cấn mang tính 'chỉ' - dừng, tắc. Tôi thấy bệnh nhân có quẻ Cấn thường gặp các vấn đề về 'tắc nghẽn' - táo bón, ứ đọng thức ăn, hay tắc đường mật, sỏi thận. Cấn cũng chủ về tay (Cấn vi thủ) và lưng, nên đau lưng, đau khớp tay cần xem quẻ Cấn. 'Cấn vi chỉ', khi cần vận động mà gặp Cấn thì sẽ bị cản trở. Nhưng đôi khi 'chỉ' cũng tốt - khi cơ thể cần nghỉ ngơi, Cấn xuất hiện nhắc nhở ta dừng lại.",
    advice:
      "Quẻ Cấn nhắc ta học cách 'dừng lại' đúng lúc. Đừng cố làm việc quá sức khi cơ thể mệt. Với tiêu hóa tắc nghẽn, cần ăn nhiều rau củ có chất xơ, uống nước đủ. Vận động nhẹ nhàng mỗi ngày để lưu thông khí huyết. Với đau khớp, massage và đắp nóng vùng đau. Tư duy cũng cần linh hoạt, đừng cố chấp. Thiền tọa sẽ rất tốt với quẻ Cấn - 'Cấn kì chỉ' - Cấn có nghĩa là biết lúc nào nên dừng.",
  },

  58: {
    // 兑为泽 - Đoài Vi Trạch
    number: 58,
    name: "Đoài Vi Trạch",
    healthNature: "Duyệt quẻ (vui vẻ), chủ phổi, miệng, da",
    bodyAspect: "Phổi, đại tràng, miệng, da, hệ hô hấp",
    commonSymptoms: ["Ho, hen", "Viêm họng, đau miệng", "Da khô, ngứa", "Táo bón"],
    positiveSign:
      "Nếu Đoài tốt: Phổi khỏe, hô hấp tốt, da mịn màng. Nói năng lưu loát, giao tiếp tốt. Vui vẻ, hài hước.",
    negativeSign: "Nếu Đoài xấu: Ho lâu ngày, hen suyễn, viêm họng mãn tính. Da ngoài bệnh. Nói nhiều hại khí.",
    detailedAnalysis:
      "Đoài là quẻ đầm lầy, là niềm vui, là miệng lưỡi. Trong y học, Đoài thuộc Kim, chính là Phổi. 'Phế chủ khí', Phổi chủ hơi thở, là cầu nối giữa ta và không khí bên ngoài. Tôi thấy những người hay nói, hát, hoặc hút thuốc lá đều dễ có vấn đề với Phổi và quẻ Đoài. 'Phế khai khiếu ư tị' - Phổi mở ra ở mũi, nên viêm mũi, viêm xoang liên quan Phổi. Đoài cũng chủ miệng (Đoài vi khẩu), nên viêm họng, lở miệng cũng cần xem. 'Phế chủ bì mao', Phổi chủ về da và lông, nên các bệnh ngoài da như chàm, vảy nến đều từ Phổi.",
    advice:
      "Phổi rất yếu, không chịu được tà khí. Tránh hít khói, bụi, không khí ô nhiễm. Bỏ thuốc lá nếu đang hút. Ăn lê, táo, mật ong để nhuận Phế. Thở sâu, hít thở buổi sáng ở nơi không khí trong lành. Đeo khẩu trang khi không khí xấu. Với ho, dùng hoa lê đun với mật ong. Với da ngoài, cần trị từ bên trong qua Phổi. Nói năng điều độ, đừng nói quá nhiều hao khí. Giữ ấm cổ họng.",
  },

  57: {
    // 巽为风 - Tốn Vi Phong
    number: 57,
    name: "Tốn Vi Phong",
    healthNature: "Nhập quẻ (xâm nhập), chủ gan, gió, thần kinh",
    bodyAspect: "Gan, mật, hông, đùi, thần kinh",
    commonSymptoms: ["Đau hông sườn", "Gió thấp, phong thấp", "Thần kinh đau", "Dị ứng"],
    positiveSign: "Nếu Tốn thuận: Linh hoạt, thích nghi tốt, kinh mạch thông thoáng. Tư duy mềm mỏng.",
    negativeSign: "Nếu Tốn nghịch: Phong tà nhập thể, đau thần kinh, phong thấp. Suy nghĩ nhiều, lo lắng.",
    detailedAnalysis:
      "Tốn là quẻ gió, là sự xâm nhập từ từ. Trong y học, Tốn cũng thuộc Mộc như Chấn, nhưng là Mộc nhu, khác với Chấn là Mộc cương. Tốn đại diện cho 'phong tà' - gió độc, là một trong sáu tà khí (phong, hàn, thử, thấp, táo, hỏa). Thầy xưa nói 'phong vi bách bệnh chi trưởng' - gió là thủ lĩnh của trăm bệnh, vì gió xâm nhập vào cơ thể rất dễ, mang theo các tà khí khác. Tôi chữa nhiều ca phong thấp, đau thần kinh, sau khi xem đều liên quan quẻ Tốn. Tốn cũng chủ đùi (Tốn vi cổ), và liên quan đến tư duy nhiều, lo lắng (Gan chủ mưu lự).",
    advice:
      "Tránh gió lùa, gió lạnh trực tiếp vào người, đặc biệt khi đổ mồ hôi. Giữ ấm các khớp. Với phong thấp, cần tắm nóng, xông hơi. Massage các huyệt chống phong: Phong Trì, Phong Phủ. Tập khí công để 'khí túc bất tư phong' - khí đủ thì gió không xâm nhập được. Giữ tâm thanh thản, đừng suy nghĩ quá nhiều. Ăn gừng, hành để tán phong. Nếu có phong tà nhập thể cần trị ngay, đừng để kéo dài hóa bệnh mạn tính.",
  },
}

/**
 * Phân tích chi tiết theo hào động (Moving Line Analysis)
 * Mỗi hào động ảnh hưởng khác nhau đến sức khỏe
 */
export function getMovingLineHealthInfluence(hexagramNumber: number, movingLine: number): string {
  // Hào 1-3: Hạ quẻ (dưới) - chủ thân hạ, bụng dưới, chân
  // Hào 4-6: Thượng quẻ (trên) - chủ thân thượng, ngực, đầu

  if (movingLine >= 1 && movingLine <= 3) {
    const lowerInfluences = {
      1: "Hào một động ảnh hưởng đến chân, phần thấp nhất của cơ thể, và Thận (gốc của tiên thiên). Nếu hào này có vấn đề, thường thấy chân yếu, đau lưng dưới, hoặc vấn đề về hệ sinh dục. Cần bổ Thận, giữ ấm chân.",
      2: "Hào hai động ảnh hưởng đến bụng, vùng trung tiêu, chủ yếu là Tỳ Vị và sinh dục. Các vấn đề về tiêu hóa, đau bụng dưới, hoặc phụ khoa thường xuất hiện. Cần điều hòa Tỳ Vị, ăn uống điều độ.",
      3: "Hào ba động là ranh giới giữa hạ và thượng quẻ, ảnh hưởng đùi, háng, và phần thấp của lưng. Là vùng quan trọng cho vận động. Nếu có vấn đề thường thấy đau háng, đau lưng. Cần vận động nhiều, tránh ngồi lâu.",
    }
    return lowerInfluences[movingLine as 1 | 2 | 3]
  } else {
    const upperInfluences = {
      4: "Hào tư động ảnh hưởng đến ngực, vùng thượng tiêu, chủ yếu là Tim và Phổi. Các vấn đề về tim mạch, hô hấp thường liên quan. Là vị trí gần với vua (hào 5), nên rất quan trọng. Cần chú ý tim mạch, tránh stress.",
      5: "Hào năm động là vị trí của vua, ảnh hưởng lớn nhất! Chủ về tim, huyết mạch, và tinh thần. Khi hào này động, ý nghĩa rất lớn - hoặc rất tốt, hoặc rất xấu. Cần xem kỹ quan hệ sinh khắc để biết hung hay cát. Đây là hào quyết định.",
      6: "Hào sáu động ảnh hưởng đến đầu, não, và đỉnh đầu. Là vị trí cao nhất, đã đến cùng cực. Thường liên quan đầu óc, cao huyết áp, đau đầu đỉnh. Cũng có nghĩa là 'cao quá dễ gãy', cần cẩn thận không được kiêu căng. Nên hạ hoả, giữ đầu óc tỉnh táo.",
    }
    return upperInfluences[movingLine as 4 | 5 | 6]
  }
}
