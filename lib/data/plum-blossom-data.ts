// 梅花易数 (Plum Blossom Numerology) Complete System Data
// Based on traditional Chinese divination methodology

export interface TrigramAttributes {
  number: number // 卦数: 乾1, 兑2, 离3, 震4, 巽5, 坎6, 艮7, 坤8
  chinese: string
  vietnamese: string
  element: string // 五行: 金木水火土
  nature: string // 自然象征
  direction: string // 方位
  season: string // 季节
  characteristic: string // 特性
  family: string // 家人
  bodyPart: string // 肢体
  animal: string // 动物
  color: string // 五色
  taste: string // 五味
  sound: string // 五音
  emotion: string // 五情
  organ: string // 五脏
  viscera: string // 六腑
  lines: [boolean, boolean, boolean] // 爻象: true=阳爻(―), false=阴爻(- -)

  // Extended attributes from 梅花易数
  weather: string[] // 天时
  geography: string[] // 地理
  people: string[] // 人物
  affairs: string[] // 人事
  objects: string[] // 静物
  buildings: string[] // 屋舍
}

// 八卦万物类象 - Complete trigram attributes
export const PLUM_BLOSSOM_TRIGRAMS: Record<string, TrigramAttributes> = {
  qian: {
    number: 1,
    chinese: "乾 Qian",
    vietnamese: "Càn",
    element: "Kim", // 金
    nature: "Trời", // 天
    direction: "Tây Bắc", // 西北
    season: "Thu Đông", // 秋冬间
    characteristic: "Kiện", // 健
    family: "Phụ", // 父
    bodyPart: "Đầu", // 首
    animal: "Ngựa", // 马
    color: "Đỏ, Huyền", // 大赤色、玄色
    taste: "Cay", // 辛、辣
    sound: "Thương", // 商
    emotion: "Vui", // 喜
    organ: "Phổi", // 肺
    viscera: "Đại tràng", // 大肠
    lines: [true, true, true],
    weather: ["Trời", "Băng", "Mưa đá"], // 天、冰、雹、霰
    geography: ["Kinh đô", "Đại quận", "Nơi cao"], // 京都、大郡、高亢之所
    people: ["Quân", "Phụ", "Đại nhân", "Lão nhân", "Quan viên"], // 君、父、大人、老人、宦官
    affairs: ["Cương kiện", "Dũng võ", "Quyết đoán"], // 刚健勇武、果决
    objects: ["Kim ngọc", "Châu bảo", "Vật tròn"], // 金玉、宝珠、圆物
    buildings: ["Công sở", "Lầu đài", "Nhà cao"], // 公厕、楼台、高堂
  },

  dui: {
    number: 2,
    chinese: "兑 Dui",
    vietnamese: "Đoài",
    element: "Kim", // 金
    nature: "Đầm", // 泽
    direction: "Tây", // 西
    season: "Thu", // 秋
    characteristic: "Duyệt", // 悦
    family: "Thiếu nữ", // 少女
    bodyPart: "Miệng", // 口
    animal: "Dê", // 羊
    color: "Trắng", // 白
    taste: "Cay", // 辛
    sound: "Thương", // 商
    emotion: "Vui", // 喜
    organ: "Phổi", // 肺
    viscera: "Đại tràng", // 大肠
    lines: [false, true, true],
    weather: ["Mưa", "Trăng mới", "Sao"], // 雨泽、新月、星
    geography: ["Đầm lầy", "Bờ nước", "Giếng hoang"], // 泽、水际、废井
    people: ["Thiếu nữ", "Thiếp", "Ca kỹ", "Thông dịch viên"], // 少女、妾、歌妓、译人
    affairs: ["Hỷ duyệt", "Tranh cãi", "Ăn uống"], // 喜悦、口舌、饮食
    objects: ["Kim đao", "Nhạc khí", "Vật khuyết"], // 金刀、乐器、缺器
    buildings: ["Nhà hướng Tây", "Gần đầm"], // 西向之居、近泽
  },

  li: {
    number: 3,
    chinese: "离 Li",
    vietnamese: "Ly",
    element: "Hỏa", // 火
    nature: "Lửa, Mặt trời", // 火、日
    direction: "Nam", // 南
    season: "Hạ", // 夏
    characteristic: "Phụ", // 附
    family: "Trung nữ", // 次女
    bodyPart: "Mắt", // 目
    animal: "Trĩ", // 雉
    color: "Đỏ, Tím", // 赤、紫、红
    taste: "Đắng", // 苦
    sound: "Trĩ", // 徵
    emotion: "Vui", // 喜
    organ: "Tim", // 心
    viscera: "Tiểu tràng", // 小肠
    lines: [true, false, true],
    weather: ["Mặt trời", "Điện", "Cầu vồng"], // 日、电、虹、霓、霞
    geography: ["Nam phương", "Đất khô cằn", "Lò rèn"], // 南方、干亢之地、炉冶
    people: ["Trung nữ", "Văn nhân", "Người bụng to"], // 中女、文人、大腹
    affairs: ["Văn hóa", "Thông minh", "Tài học"], // 文化、聪明才学
    objects: ["Lửa", "Sách", "Văn thư", "Giáp trụ"], // 火、书、文、甲骨
    buildings: ["Nhà hướng Nam", "Phòng sáng"], // 南舍、明窗、虚室
  },

  zhen: {
    number: 4,
    chinese: "震 Zhen",
    vietnamese: "Chấn",
    element: "Mộc", // 木
    nature: "Sấm", // 雷
    direction: "Đông", // 东
    season: "Xuân", // 春
    characteristic: "Động", // 动
    family: "Trưởng nam", // 长男
    bodyPart: "Chân", // 足
    animal: "Rồng", // 龙
    color: "Đen xanh, Xanh lục", // 黑青、绿碧
    taste: "Chua, Ngọt", // 酸、甘
    sound: "Giác", // 角
    emotion: "Giận", // 怒
    organ: "Gan", // 肝
    viscera: "Mật", // 胆
    lines: [false, false, true],
    weather: ["Sấm"], // 雷
    geography: ["Đông phương", "Rừng núi", "Chợ náo nhiệt"], // 东方、树木、闹市
    people: ["Trưởng nam"], // 长男
    affairs: ["Khởi động", "Tức giận", "Nhiều động ít tĩnh"], // 起动、怒、多动少静
    objects: ["Gỗ tre", "Nhạc cụ", "Hoa quả"], // 木竹、乐器、花草
    buildings: ["Nhà hướng Đông", "Gần rừng"], // 东向之居、山林
  },

  xun: {
    number: 5,
    chinese: "巽 Xun",
    vietnamese: "Tốn",
    element: "Mộc", // 木
    nature: "Gió, Cây", // 风、木
    direction: "Đông Nam", // 东南
    season: "Xuân Hạ", // 春夏间
    characteristic: "Nhập", // 入
    family: "Trưởng nữ", // 长女
    bodyPart: "Đùi", // 股
    animal: "Gà", // 鸡
    color: "Xanh lục, Trắng sạch", // 青绿、碧洁白
    taste: "Chua", // 酸
    sound: "Giác", // 角
    emotion: "Giận", // 怒
    organ: "Gan", // 肝
    viscera: "Mật", // 胆
    lines: [true, true, false],
    weather: ["Gió"], // 风
    geography: ["Đông Nam", "Rừng núi", "Vườn hoa"], // 东南、山林、花果园
    people: ["Trưởng nữ", "Tú sĩ", "Góa phụ", "Đạo sĩ"], // 长女、秀士、寡妇、僧道
    affairs: ["Nhu hòa", "Không định", "Tiến thoái"], // 柔和、不定、进退
    objects: ["Hương gỗ", "Dây thừng", "Vật dài"], // 木香、绳、长物
    buildings: ["Nhà hướng Đông Nam", "Chùa chiền"], // 东南向、寺观
  },

  kan: {
    number: 6,
    chinese: "坎 Kan",
    vietnamese: "Khảm",
    element: "Thủy", // 水
    nature: "Nước, Mưa", // 水、雨
    direction: "Bắc", // 北
    season: "Đông", // 冬
    characteristic: "Hiểm", // 陷
    family: "Trung nam", // 次男
    bodyPart: "Tai", // 耳
    animal: "Lợn", // 猪
    color: "Đen", // 黑
    taste: "Mặn, Chua", // 咸、酸
    sound: "Vũ", // 羽
    emotion: "Sợ", // 恐
    organ: "Thận", // 肾
    viscera: "Bàng quang", // 膀胱
    lines: [false, true, false],
    weather: ["Trăng", "Mưa", "Tuyết", "Sương"], // 月、雨、雪、露、霜
    geography: ["Bắc phương", "Sông hồ", "Ao đầm"], // 北方、江湖、池沼
    people: ["Trung nam", "Người sông nước", "Thủy tặc"], // 中男、江湖人、盗贼
    affairs: ["Hiểm trở", "Thấp kém", "Nhu nhược"], // 险陷、卑下、漂泊
    objects: ["Đồ mang nước", "Trái cây có hạt", "Rượu"], // 水具、带核物、酒
    buildings: ["Nhà hướng Bắc", "Gần nước"], // 向北居、近水
  },

  gen: {
    number: 7,
    chinese: "艮 Gen",
    vietnamese: "Cấn",
    element: "Thổ", // 土
    nature: "Núi", // 山
    direction: "Đông Bắc", // 东北
    season: "Đông Xuân", // 冬春间
    characteristic: "Chỉ", // 止
    family: "Thiếu nam", // 少男
    bodyPart: "Tay", // 手
    animal: "Chó", // 犬
    color: "Vàng", // 黄
    taste: "Ngọt", // 甘
    sound: "Cung", // 宫
    emotion: "Nghĩ", // 思
    organ: "Tỳ", // 脾
    viscera: "Dạ dày", // 胃
    lines: [true, false, false],
    weather: ["Mây", "Sương mù"], // 云、雾、山岚
    geography: ["Núi non", "Đồi lăng", "Mộ phần"], // 山、丘陵、坟墓
    people: ["Thiếu nam", "Người nhàn", "Người núi"], // 少男、闲人、山中人
    affairs: ["Trở ngại", "Giữ tĩnh", "Dừng lại"], // 阻隔、守静、止住
    objects: ["Đất đá", "Quả dưa", "Vật vàng"], // 土石、瓜果、黄物
    buildings: ["Nhà hướng Đông Bắc", "Nhà núi"], // 东北居、山居
  },

  kun: {
    number: 8,
    chinese: "坤 Kun",
    vietnamese: "Khôn",
    element: "Thổ", // 土
    nature: "Đất", // 地
    direction: "Tây Nam", // 西南
    season: "Hạ Thu", // 夏秋间
    characteristic: "Thuận", // 顺
    family: "Mẫu", // 母
    bodyPart: "Bụng", // 腹
    animal: "Trâu", // 牛
    color: "Vàng, Đen", // 黄、黑
    taste: "Ngọt", // 甘
    sound: "Cung", // 宫
    emotion: "Nghĩ", // 思
    organ: "Tỳ", // 脾
    viscera: "Dạ dày", // 胃
    lines: [false, false, false],
    weather: ["Mây âm", "Sương mù", "Băng giá"], // 阴云、雾气、冰霜
    geography: ["Đồng ruộng", "Làng mạc", "Tây Nam"], // 田野、乡村、西南
    people: ["Mẫu thân", "Hậu mẫu", "Nông dân", "Lão phụ"], // 老母、农夫、乡人、老妇
    affairs: ["Nhu thuận", "Yếu đuối", "Kiệm lận"], // 柔顺、懦弱、吝啬
    objects: ["Vật vuông", "Vải", "Ngũ cốc"], // 方物、布帛、五谷
    buildings: ["Nhà hướng Tây Nam", "Nhà thấp"], // 西南居、矮屋
  },
}

// 五行生克关系 (Five Elements Generation and Conquest)
export interface WuXingRelation {
  generates: string // 生
  conquers: string // 克
  generatedBy: string // 被生
  conqueredBy: string // 被克
}

export const WU_XING_RELATIONS: Record<string, WuXingRelation> = {
  Kim: {
    generates: "Thủy", // 金生水
    conquers: "Mộc", // 金克木
    generatedBy: "Thổ", // 土生金
    conqueredBy: "Hỏa", // 火克金
  },
  Mộc: {
    generates: "Hỏa", // 木生火
    conquers: "Thổ", // 木克土
    generatedBy: "Thủy", // 水生木
    conqueredBy: "Kim", // 金克木
  },
  Thủy: {
    generates: "Mộc", // 水生木
    conquers: "Hỏa", // 水克火
    generatedBy: "Kim", // 金生水
    conqueredBy: "Thổ", // 土克水
  },
  Hỏa: {
    generates: "Thổ", // 火生土
    conquers: "Kim", // 火克金
    generatedBy: "Mộc", // 木生火
    conqueredBy: "Thủy", // 水克火
  },
  Thổ: {
    generates: "Kim", // 土生金
    conquers: "Thủy", // 土克水
    generatedBy: "Hỏa", // 火生土
    conqueredBy: "Mộc", // 木克土
  },
}

// 卦气旺衰 (Hexagram Prosperity by Season)
export interface SeasonalProsperity {
  prosperous: string[] // 旺
  declining: string[] // 衰
}

export const SEASONAL_PROSPERITY: Record<string, SeasonalProsperity> = {
  Xuân: {
    // 春
    prosperous: ["Chấn", "Tốn"], // 震巽木旺于春
    declining: ["Khôn", "Cấn"], // 坤艮土衰于春
  },
  Hạ: {
    // 夏
    prosperous: ["Ly"], // 离火旺于夏
    declining: ["Càn", "Đoài"], // 乾兑金衰于夏
  },
  Thu: {
    // 秋
    prosperous: ["Càn", "Đoài"], // 乾兑金旺于秋
    declining: ["Chấn", "Tốn"], // 震巽木衰于秋
  },
  Đông: {
    // 冬
    prosperous: ["Khảm"], // 坎水旺于冬
    declining: ["Ly"], // 离火衰于冬
  },
  "Tứ mùa": {
    // 辰戌丑未月
    prosperous: ["Khôn", "Cấn"], // 坤艮土旺于四季
    declining: ["Khảm"], // 坎水衰于四季
  },
}

// 体用关系 (Body-Use Relationship) - Core of Plum Blossom interpretation
export enum BodyUseRelation {
  BODY_CONQUERS_USE = "thể_khắc_dụng", // 体克用 - Favorable
  USE_CONQUERS_BODY = "dụng_khắc_thể", // 用克体 - Unfavorable
  BODY_GENERATES_USE = "thể_sinh_dụng", // 体生用 - Consumption
  USE_GENERATES_BODY = "dụng_sinh_thể", // 用生体 - Beneficial
  BODY_USE_HARMONY = "thể_dụng_tỷ_hòa", // 体用比和 - Most auspicious
}

// 起卦法 (Divination Methods) - Various methods from 梅花易数
export enum DivinationMethod {
  TIME_BASED = "年月日时起卦", // Based on year, month, day, hour
  NUMBER_BASED = "直接数字起卦", // Direct number method
  ORIENTATION_BASED = "端法后天起卦", // Orientation method
  SOUND_BASED = "按声音起卦", // Sound-based method
  CHARACTER_BASED = "按字起卦", // Character stroke method
  MEASUREMENT_BASED = "丈尺寸起卦", // Measurement method
  OBJECT_BASED = "物数占", // Object count method
  PERSON_BASED = "为人占", // Person observation method
  SELF_BASED = "自己占", // Self divination method
}

// 十二地支五行属相 (12 Earthly Branches with Elements and Animals)
export const EARTHLY_BRANCHES = [
  { branch: "Tý", element: "Thủy", animal: "Chuột", number: 1 },
  { branch: "Sửu", element: "Thổ", animal: "Trâu", number: 2 },
  { branch: "Dần", element: "Mộc", animal: "Hổ", number: 3 },
  { branch: "Mão", element: "Mộc", animal: "Thỏ", number: 4 },
  { branch: "Thìn", element: "Thổ", animal: "Rồng", number: 5 },
  { branch: "Tỵ", element: "Hỏa", animal: "Rắn", number: 6 },
  { branch: "Ngọ", element: "Hỏa", animal: "Ngựa", number: 7 },
  { branch: "Mùi", element: "Thổ", animal: "Dê", number: 8 },
  { branch: "Thân", element: "Kim", animal: "Khỉ", number: 9 },
  { branch: "Dậu", element: "Kim", animal: "Gà", number: 10 },
  { branch: "Tuất", element: "Thổ", animal: "Chó", number: 11 },
  { branch: "Hợi", element: "Thủy", animal: "Lợn", number: 12 },
]

// Helper function: Get trigram by number
export function getTrigramByNumber(num: number): TrigramAttributes | undefined {
  const trigramKey = Object.keys(PLUM_BLOSSOM_TRIGRAMS).find((key) => PLUM_BLOSSOM_TRIGRAMS[key].number === num)
  return trigramKey ? PLUM_BLOSSOM_TRIGRAMS[trigramKey] : undefined
}

// Helper function: Determine Body-Use relationship
export function determineBodyUseRelation(bodyElement: string, useElement: string): BodyUseRelation {
  if (bodyElement === useElement) {
    return BodyUseRelation.BODY_USE_HARMONY
  }

  const bodyRelation = WU_XING_RELATIONS[bodyElement]
  if (!bodyRelation) return BodyUseRelation.BODY_USE_HARMONY

  if (bodyRelation.conquers === useElement) {
    return BodyUseRelation.BODY_CONQUERS_USE
  }
  if (bodyRelation.conqueredBy === useElement) {
    return BodyUseRelation.USE_CONQUERS_BODY
  }
  if (bodyRelation.generates === useElement) {
    return BodyUseRelation.BODY_GENERATES_USE
  }
  if (bodyRelation.generatedBy === useElement) {
    return BodyUseRelation.USE_GENERATES_BODY
  }

  return BodyUseRelation.BODY_USE_HARMONY
}

// Helper function: Get interpretation based on Body-Use relation
export function interpretBodyUseRelation(relation: BodyUseRelation, context: string): string {
  const interpretations: Record<string, Record<BodyUseRelation, string>> = {
    marriage: {
      [BodyUseRelation.BODY_CONQUERS_USE]: "Hôn nhân có thể thành công, nhưng cần thời gian",
      [BodyUseRelation.USE_CONQUERS_BODY]: "Hôn nhân khó thành, nếu cưỡng thành sẽ có hại",
      [BodyUseRelation.BODY_GENERATES_USE]: "Hôn nhân khó thành hoặc có tổn thất",
      [BodyUseRelation.USE_GENERATES_BODY]: "Hôn nhân dễ thành, có lợi ích từ hôn nhân",
      [BodyUseRelation.BODY_USE_HARMONY]: "Hôn nhân mỹ mãn, đại cát đại lợi",
    },
    career: {
      [BodyUseRelation.BODY_CONQUERS_USE]: "Sự nghiệp thuận lợi, có thể kiểm soát tình hình",
      [BodyUseRelation.USE_CONQUERS_BODY]: "Sự nghiệp gặp khó khăn, bất lợi",
      [BodyUseRelation.BODY_GENERATES_USE]: "Tốn kém công sức, tài lực",
      [BodyUseRelation.USE_GENERATES_BODY]: "Có tiến ích, quý nhân phù trợ",
      [BodyUseRelation.BODY_USE_HARMONY]: "Mọi việc như ý, dễ thành công",
    },
    wealth: {
      [BodyUseRelation.BODY_CONQUERS_USE]: "Có tài, nhưng kiếm được chậm",
      [BodyUseRelation.USE_CONQUERS_BODY]: "Không có tài, khó cầu",
      [BodyUseRelation.BODY_GENERATES_USE]: "Tán tài, có lo hao tán",
      [BodyUseRelation.USE_GENERATES_BODY]: "Tiến tài, có hỷ khánh",
      [BodyUseRelation.BODY_USE_HARMONY]: "Cầu tài dễ dàng, như ý",
    },
    health: {
      [BodyUseRelation.BODY_CONQUERS_USE]: "Bệnh dễ khỏi, thể trạng phục hồi",
      [BodyUseRelation.USE_CONQUERS_BODY]: "Bệnh khó chữa, nguy hiểm",
      [BodyUseRelation.BODY_GENERATES_USE]: "Bệnh kéo dài, khó khỏi",
      [BodyUseRelation.USE_GENERATES_BODY]: "Bệnh nhanh khỏi, không cần thuốc",
      [BodyUseRelation.BODY_USE_HARMONY]: "Bệnh dễ an, mau khỏi",
    },
  }

  return interpretations[context]?.[relation] || "Cần xem xét thêm yếu tố khác"
}

// Export for use in other modules
const BodyUse = {} // Declare the variable to fix the lint error
export { BodyUse }
