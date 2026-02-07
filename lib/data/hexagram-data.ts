// Complete I Ching 64 Hexagrams with traditional sequence and accurate naming

export interface HexagramData {
  number: number // Traditional sequence number (1-64)
  upperTrigram: number // Upper trigram (1-8)
  lowerTrigram: number // Lower trigram (1-8)
  chinese: string
  vietnamese: string
  meaning: string // Brief meaning from zhouyi.cc
  image: string // 卦象 Image/Symbol description
}

// 64 Hexagrams in traditional King Wen sequence
export const HEXAGRAMS: HexagramData[] = [
  // 1. 乾为天 (Qian) - Heaven
  {
    number: 1,
    upperTrigram: 1,
    lowerTrigram: 1,
    chinese: "乾为天",
    vietnamese: "Càn Vi Thiên",
    meaning: "刚健中正",
    image: "天行健，君子以自强不息",
  },

  // 2. 坤为地 (Kun) - Earth
  {
    number: 2,
    upperTrigram: 8,
    lowerTrigram: 8,
    chinese: "坤为地",
    vietnamese: "Khôn Vi Địa",
    meaning: "柔顺伸展",
    image: "地势坤，君子以厚德载物",
  },

  // 3. 水雷屯 (Zhun) - Difficulty at the Beginning
  {
    number: 3,
    upperTrigram: 6,
    lowerTrigram: 4,
    chinese: "水雷屯",
    vietnamese: "Thủy Lôi Truân",
    meaning: "起始维艰",
    image: "云雷，屯。君子以经纶",
  },

  // 4. 山水蒙 (Meng) - Youthful Folly
  {
    number: 4,
    upperTrigram: 7,
    lowerTrigram: 6,
    chinese: "山水蒙",
    vietnamese: "Sơn Thủy Mông",
    meaning: "启蒙奋发",
    image: "山下出泉，蒙。君子以果行育德",
  },

  // 5. 水天需 (Xu) - Waiting
  {
    number: 5,
    upperTrigram: 6,
    lowerTrigram: 1,
    chinese: "水天需",
    vietnamese: "Thủy Thiên Nhu",
    meaning: "守正待机",
    image: "云上于天，需。君子以饮食宴乐",
  },

  // 6. 天水讼 (Song) - Conflict
  {
    number: 6,
    upperTrigram: 1,
    lowerTrigram: 6,
    chinese: "天水讼",
    vietnamese: "Thiên Thủy Tụng",
    meaning: "慎争戒讼",
    image: "天与水违行，讼。君子以作事谋始",
  },

  // 7. 地水师 (Shi) - The Army
  {
    number: 7,
    upperTrigram: 8,
    lowerTrigram: 6,
    chinese: "地水师",
    vietnamese: "Địa Thủy Sư",
    meaning: "行险而顺",
    image: "地中有水，师。君子以容民畜众",
  },

  // 8. 水地比 (Bi) - Holding Together
  {
    number: 8,
    upperTrigram: 6,
    lowerTrigram: 8,
    chinese: "水地比",
    vietnamese: "Thủy Địa Tỷ",
    meaning: "诚信团结",
    image: "地上有水，比。先王以建万国，亲诸侯",
  },

  // 9. 风天小畜 (Xiao Xu) - Small Taming
  {
    number: 9,
    upperTrigram: 5,
    lowerTrigram: 1,
    chinese: "风天小畜",
    vietnamese: "Phong Thiên Tiểu Súc",
    meaning: "蓄养待进",
    image: "风行天上，小畜。君子以懿文德",
  },

  // 10. 天泽履 (Lü) - Treading
  {
    number: 10,
    upperTrigram: 1,
    lowerTrigram: 2,
    chinese: "天泽履",
    vietnamese: "Thiên Trạch Lý",
    meaning: "脚踏实地",
    image: "上天下泽，履。君子以辨上下，定民志",
  },

  // 11. 地天泰 (Tai) - Peace
  {
    number: 11,
    upperTrigram: 8,
    lowerTrigram: 1,
    chinese: "地天泰",
    vietnamese: "Địa Thiên Thái",
    meaning: "应时而变",
    image: "天地交，泰。后以财成天地之道，辅相天地之宜",
  },

  // 12. 天地否 (Pi) - Standstill
  {
    number: 12,
    upperTrigram: 1,
    lowerTrigram: 8,
    chinese: "天地否",
    vietnamese: "Thiên Địa Phủ",
    meaning: "不交不通",
    image: "天地不交，否。君子以俭德辟难，不可荣以禄",
  },

  // 13. 天火同人 (Tong Ren) - Fellowship
  {
    number: 13,
    upperTrigram: 1,
    lowerTrigram: 3,
    chinese: "天火同人",
    vietnamese: "Thiên Hỏa Đồng Nhân",
    meaning: "上下和同",
    image: "天与火，同人。君子以类族辨物",
  },

  // 14. 火天大有 (Da You) - Great Possession
  {
    number: 14,
    upperTrigram: 3,
    lowerTrigram: 1,
    chinese: "火天大有",
    vietnamese: "Hỏa Thiên Đại Hữu",
    meaning: "顺天依时",
    image: "火在天上，大有。君子以遏恶扬善，顺天休命",
  },

  // 15. 地山谦 (Qian) - Modesty
  {
    number: 15,
    upperTrigram: 8,
    lowerTrigram: 7,
    chinese: "地山谦",
    vietnamese: "Địa Sơn Khiêm",
    meaning: "内高外低",
    image: "地中有山，谦。君子以裒多益寡，称物平施",
  },

  // 16. 雷地豫 (Yu) - Enthusiasm
  {
    number: 16,
    upperTrigram: 4,
    lowerTrigram: 8,
    chinese: "雷地豫",
    vietnamese: "Lôi Địa Dự",
    meaning: "顺时依势",
    image: "雷出地奋，豫。先王以作乐崇德，殷荐之上帝",
  },

  // 17. 泽雷随 (Sui) - Following
  {
    number: 17,
    upperTrigram: 2,
    lowerTrigram: 4,
    chinese: "泽雷随",
    vietnamese: "Trạch Lôi Tùy",
    meaning: "随时变通",
    image: "泽中有雷，随。君子以向晦入宴息",
  },

  // 18. 山风蛊 (Gu) - Work on the Decayed
  {
    number: 18,
    upperTrigram: 7,
    lowerTrigram: 5,
    chinese: "山风蛊",
    vietnamese: "Sơn Phong Cổ",
    meaning: "振疲起衰",
    image: "山下有风，蛊。君子以振民育德",
  },

  // 19. 地泽临 (Lin) - Approach
  {
    number: 19,
    upperTrigram: 8,
    lowerTrigram: 2,
    chinese: "地泽临",
    vietnamese: "Địa Trạch Lâm",
    meaning: "教民保民",
    image: "泽上有地，临。君子以教思无穷，容保民无疆",
  },

  // 20. 风地观 (Guan) - Contemplation
  {
    number: 20,
    upperTrigram: 5,
    lowerTrigram: 8,
    chinese: "风地观",
    vietnamese: "Phong Địa Quan",
    meaning: "观下瞻上",
    image: "风行地上，观。先王以省方，观民设教",
  },

  // 21. 火雷噬嗑 (Shi He) - Biting Through
  {
    number: 21,
    upperTrigram: 3,
    lowerTrigram: 4,
    chinese: "火雷噬嗑",
    vietnamese: "Hỏa Lôi Thệ Hạp",
    meaning: "刚柔相济",
    image: "雷电，噬嗑。先王以明罚敕法",
  },

  // 22. 山火贲 (Bi) - Grace
  {
    number: 22,
    upperTrigram: 7,
    lowerTrigram: 3,
    chinese: "山火贲",
    vietnamese: "Sơn Hỏa Bí",
    meaning: "饰外扬质",
    image: "山下有火，贲。君子以明庶政，无敢折狱",
  },

  // 23. 山地剥 (Bo) - Splitting Apart
  {
    number: 23,
    upperTrigram: 7,
    lowerTrigram: 8,
    chinese: "山地剥",
    vietnamese: "Sơn Địa Bác",
    meaning: "顺势而止",
    image: "山附于地，剥。上以厚下，安宅",
  },

  // 24. 地雷复 (Fu) - Return
  {
    number: 24,
    upperTrigram: 8,
    lowerTrigram: 4,
    chinese: "地雷复",
    vietnamese: "Địa Lôi Phục",
    meaning: "寓动于顺",
    image: "雷在地中，复。先王以至日闭关，商旅不行",
  },

  // 25. 天雷无妄 (Wu Wang) - Innocence
  {
    number: 25,
    upperTrigram: 1,
    lowerTrigram: 4,
    chinese: "天雷无妄",
    vietnamese: "Thiên Lôi Vô Vọng",
    meaning: "无妄而得",
    image: "天下雷行，物与无妄。先王以茂对时，育万物",
  },

  // 26. 山天大畜 (Da Xu) - Great Taming
  {
    number: 26,
    upperTrigram: 7,
    lowerTrigram: 1,
    chinese: "山天大畜",
    vietnamese: "Sơn Thiên Đại Súc",
    meaning: "止而不止",
    image: "天在山中，大畜。君子以多识前言往行，以畜其德",
  },

  // 27. 山雷颐 (Yi) - Nourishment
  {
    number: 27,
    upperTrigram: 7,
    lowerTrigram: 4,
    chinese: "山雷颐",
    vietnamese: "Sơn Lôi Di",
    meaning: "纯正以养",
    image: "山下有雷，颐。君子以慎言语，节饮食",
  },

  // 28. 泽风大过 (Da Guo) - Great Exceeding
  {
    number: 28,
    upperTrigram: 2,
    lowerTrigram: 5,
    chinese: "泽风大过",
    vietnamese: "Trạch Phong Đại Quá",
    meaning: "非常行动",
    image: "泽灭木，大过。君子以独立不惧，遁世无闷",
  },

  // 29. 坎为水 (Kan) - The Abysmal Water
  {
    number: 29,
    upperTrigram: 6,
    lowerTrigram: 6,
    chinese: "坎为水",
    vietnamese: "Khảm Vi Thủy",
    meaning: "行险用险",
    image: "水洊至，习坎。君子以常德行，习教事",
  },

  // 30. 离为火 (Li) - The Clinging Fire
  {
    number: 30,
    upperTrigram: 3,
    lowerTrigram: 3,
    chinese: "离为火",
    vietnamese: "Ly Vi Hỏa",
    meaning: "附和依托",
    image: "明两作，离。大人以继明照于四方",
  },

  // 31. 泽山咸 (Xian) - Influence
  {
    number: 31,
    upperTrigram: 2,
    lowerTrigram: 7,
    chinese: "泽山咸",
    vietnamese: "Trạch Sơn Hàm",
    meaning: "相互感应",
    image: "山上有泽，咸。君子以虚受人",
  },

  // 32. 雷风恒 (Heng) - Duration
  {
    number: 32,
    upperTrigram: 4,
    lowerTrigram: 5,
    chinese: "雷风恒",
    vietnamese: "Lôi Phong Hằng",
    meaning: "恒心有成",
    image: "雷风，恒。君子以立不易方",
  },

  // 33. 天山遁 (Dun) - Retreat
  {
    number: 33,
    upperTrigram: 1,
    lowerTrigram: 7,
    chinese: "天山遁",
    vietnamese: "Thiên Sơn Độn",
    meaning: "遁世救世",
    image: "天下有山，遁。君子以远小人，不恶而严",
  },

  // 34. 雷天大壮 (Da Zhuang) - Great Power
  {
    number: 34,
    upperTrigram: 4,
    lowerTrigram: 1,
    chinese: "雷天大壮",
    vietnamese: "Lôi Thiên Đại Tráng",
    meaning: "壮勿妄动",
    image: "雷在天上，大壮。君子以非礼弗履",
  },

  // 35. 火地晋 (Jin) - Progress
  {
    number: 35,
    upperTrigram: 3,
    lowerTrigram: 8,
    chinese: "火地晋",
    vietnamese: "Hỏa Địa Tấn",
    meaning: "求进发展",
    image: "明出地上，晋。君子以自昭明德",
  },

  // 36. 地火明夷 (Ming Yi) - Darkening of the Light
  {
    number: 36,
    upperTrigram: 8,
    lowerTrigram: 3,
    chinese: "地火明夷",
    vietnamese: "Địa Hỏa Minh Di",
    meaning: "晦而转明",
    image: "明入地中，明夷。君子以莅众，用晦而明",
  },

  // 37. 风火家人 (Jia Ren) - The Family
  {
    number: 37,
    upperTrigram: 5,
    lowerTrigram: 3,
    chinese: "风火家人",
    vietnamese: "Phong Hỏa Gia Nhân",
    meaning: "诚威治业",
    image: "风自火出，家人。君子以言有物，而行有恒",
  },

  // 38. 火泽睽 (Kui) - Opposition
  {
    number: 38,
    upperTrigram: 3,
    lowerTrigram: 2,
    chinese: "火泽睽",
    vietnamese: "Hỏa Trạch Khuy",
    meaning: "异中求同",
    image: "上火下泽，睽。君子以同而异",
  },

  // 39. 水山蹇 (Jian) - Obstruction
  {
    number: 39,
    upperTrigram: 6,
    lowerTrigram: 7,
    chinese: "水山蹇",
    vietnamese: "Thủy Sơn Kiển",
    meaning: "险阻在前",
    image: "山上有水，蹇。君子以反身修德",
  },

  // 40. 雷水解 (Xie) - Deliverance
  {
    number: 40,
    upperTrigram: 4,
    lowerTrigram: 6,
    chinese: "雷水解",
    vietnamese: "Lôi Thủy Giải",
    meaning: "柔道致治",
    image: "雷雨作，解。君子以赦过宥罪",
  },

  // 41. 山泽损 (Sun) - Decrease
  {
    number: 41,
    upperTrigram: 7,
    lowerTrigram: 2,
    chinese: "山泽损",
    vietnamese: "Sơn Trạch Tổn",
    meaning: "损益制衡",
    image: "山下有泽，损。君子以惩忿窒欲",
  },

  // 42. 风雷益 (Yi) - Increase
  {
    number: 42,
    upperTrigram: 5,
    lowerTrigram: 4,
    chinese: "风雷益",
    vietnamese: "Phong Lôi Ích",
    meaning: "损上益下",
    image: "风雷，益。君子以见善则迁，有过则改",
  },

  // 43. 泽天夬 (Guai) - Breakthrough
  {
    number: 43,
    upperTrigram: 2,
    lowerTrigram: 1,
    chinese: "泽天夬",
    vietnamese: "Trạch Thiên Quải",
    meaning: "决而能和",
    image: "泽上于天，夬。君子以施禄及下，居德则忌",
  },

  // 44. 天风姤 (Gou) - Coming to Meet
  {
    number: 44,
    upperTrigram: 1,
    lowerTrigram: 5,
    chinese: "天风姤",
    vietnamese: "Thiên Phong Cấu",
    meaning: "天下有风",
    image: "天下有风，姤。后以施命诰四方",
  },

  // 45. 泽地萃 (Cui) - Gathering Together
  {
    number: 45,
    upperTrigram: 2,
    lowerTrigram: 8,
    chinese: "泽地萃",
    vietnamese: "Trạch Địa Tụy",
    meaning: "荟萃聚集",
    image: "泽上于地，萃。君子以除戎器，戒不虞",
  },

  // 46. 地风升 (Sheng) - Pushing Upward
  {
    number: 46,
    upperTrigram: 8,
    lowerTrigram: 5,
    chinese: "地风升",
    vietnamese: "Địa Phong Thăng",
    meaning: "柔顺谦虚",
    image: "地中生木，升。君子以顺德，积小以高大",
  },

  // 47. 泽水困 (Kun) - Oppression
  {
    number: 47,
    upperTrigram: 2,
    lowerTrigram: 6,
    chinese: "泽水困",
    vietnamese: "Trạch Thủy Khốn",
    meaning: "困境求通",
    image: "泽无水，困。君子以致命遂志",
  },

  // 48. 水风井 (Jing) - The Well
  {
    number: 48,
    upperTrigram: 6,
    lowerTrigram: 5,
    chinese: "水风井",
    vietnamese: "Thủy Phong Tỉnh",
    meaning: "求贤若渴",
    image: "木上有水，井。君子以劳民劝相",
  },

  // 49. 泽火革 (Ge) - Revolution
  {
    number: 49,
    upperTrigram: 2,
    lowerTrigram: 3,
    chinese: "泽火革",
    vietnamese: "Trạch Hỏa Cách",
    meaning: "顺天应人",
    image: "泽中有火，革。君子以治历明时",
  },

  // 50. 火风鼎 (Ding) - The Cauldron
  {
    number: 50,
    upperTrigram: 3,
    lowerTrigram: 5,
    chinese: "火风鼎",
    vietnamese: "Hỏa Phong Đỉnh",
    meaning: "稳重图变",
    image: "木上有火，鼎。君子以正位凝命",
  },

  // 51. 震为雷 (Zhen) - The Arousing Thunder
  {
    number: 51,
    upperTrigram: 4,
    lowerTrigram: 4,
    chinese: "震为雷",
    vietnamese: "Chấn Vi Lôi",
    meaning: "临危不乱",
    image: "洊雷，震。君子以恐惧修省",
  },

  // 52. 艮为山 (Gen) - Keeping Still Mountain
  {
    number: 52,
    upperTrigram: 7,
    lowerTrigram: 7,
    chinese: "艮为山",
    vietnamese: "Cấn Vi Sơn",
    meaning: "动静适时",
    image: "兼山，艮。君子以思不出其位",
  },

  // 53. 风山渐 (Jian) - Development
  {
    number: 53,
    upperTrigram: 5,
    lowerTrigram: 7,
    chinese: "风山渐",
    vietnamese: "Phong Sơn Tiệm",
    meaning: "渐进蓄德",
    image: "山上有木，渐。君子以居贤德善俗",
  },

  // 54. 雷泽归妹 (Gui Mei) - The Marrying Maiden
  {
    number: 54,
    upperTrigram: 4,
    lowerTrigram: 2,
    chinese: "雷泽归妹",
    vietnamese: "Lôi Trạch Quy Muội",
    meaning: "立家兴业",
    image: "泽上有雷，归妹。君子以永终知敝",
  },

  // 55. 雷火丰 (Feng) - Abundance
  {
    number: 55,
    upperTrigram: 4,
    lowerTrigram: 3,
    chinese: "雷火丰",
    vietnamese: "Lôi Hỏa Phong",
    meaning: "日中则斜",
    image: "雷电皆至，丰。君子以折狱致刑",
  },

  // 56. 火山旅 (Lü) - The Wanderer
  {
    number: 56,
    upperTrigram: 3,
    lowerTrigram: 7,
    chinese: "火山旅",
    vietnamese: "Hỏa Sơn Lữ",
    meaning: "依义顺时",
    image: "山上有火，旅。君子以明慎用刑，而不留狱",
  },

  // 57. 巽为风 (Xun) - The Gentle Wind
  {
    number: 57,
    upperTrigram: 5,
    lowerTrigram: 5,
    chinese: "巽为风",
    vietnamese: "Tốn Vi Phong",
    meaning: "谦逊受益",
    image: "随风，巽。君子以申命行事",
  },

  // 58. 兑为泽 (Dui) - The Joyous Lake
  {
    number: 58,
    upperTrigram: 2,
    lowerTrigram: 2,
    chinese: "兑为泽",
    vietnamese: "Đoài Vi Trạch",
    meaning: "刚内柔外",
    image: "丽泽，兑。君子以朋友讲习",
  },

  // 59. 风水涣 (Huan) - Dispersion
  {
    number: 59,
    upperTrigram: 5,
    lowerTrigram: 6,
    chinese: "风水涣",
    vietnamese: "Phong Thủy Hoán",
    meaning: "拯救涣散",
    image: "风行水上，涣。先王以享于帝，立庙",
  },

  // 60. 水泽节 (Jie) - Limitation
  {
    number: 60,
    upperTrigram: 6,
    lowerTrigram: 2,
    chinese: "水泽节",
    vietnamese: "Thủy Trạch Tiết",
    meaning: "万物有节",
    image: "泽上有水，节。君子以制数度，议德行",
  },

  // 61. 风泽中孚 (Zhong Fu) - Inner Truth
  {
    number: 61,
    upperTrigram: 5,
    lowerTrigram: 2,
    chinese: "风泽中孚",
    vietnamese: "Phong Trạch Trung Phu",
    meaning: "诚信立身",
    image: "泽上有风，中孚。君子以议狱缓死",
  },

  // 62. 雷山小过 (Xiao Guo) - Small Exceeding
  {
    number: 62,
    upperTrigram: 4,
    lowerTrigram: 7,
    chinese: "雷山小过",
    vietnamese: "Lôi Sơn Tiểu Quá",
    meaning: "行动有度",
    image: "山上有雷，小过。君子以行过乎恭，丧过乎哀，用过乎俭",
  },

  // 63. 水火既济 (Ji Ji) - After Completion
  {
    number: 63,
    upperTrigram: 6,
    lowerTrigram: 3,
    chinese: "水火既济",
    vietnamese: "Thủy Hỏa Ký Tế",
    meaning: "盛极将衰",
    image: "水在火上，既济。君子以思患而预防之",
  },

  // 64. 火水未济 (Wei Ji) - Before Completion
  {
    number: 64,
    upperTrigram: 3,
    lowerTrigram: 6,
    chinese: "火水未济",
    vietnamese: "Hỏa Thủy Vị Tế",
    meaning: "事业未竟",
    image: "火在水上，未济。君子以慎辨物居方",
  },
]

// Helper function to get hexagram by trigram combination
export function getHexagramByTrigrams(upper: number, lower: number): HexagramData | undefined {
  return HEXAGRAMS.find((h) => h.upperTrigram === upper && h.lowerTrigram === lower)
}

// Helper function to get hexagram by traditional number
export function getHexagramByNumber(num: number): HexagramData | undefined {
  return HEXAGRAMS.find((h) => h.number === num)
}

// Helper function to get hexagram name
export function getHexagramName(upper: number, lower: number): string {
  const hexagram = getHexagramByTrigrams(upper, lower)
  return hexagram ? hexagram.vietnamese : `Quẻ ${upper}-${lower}`
}
