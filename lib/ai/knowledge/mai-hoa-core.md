/**
 * Engine lập quẻ Mai Hoa Dịch Số theo phương pháp Thiệu Khang Tiết
 * Module 2: Hexagram Generation Engine
 */

import { convertSolar2Lunar, getHourChi } from './lunar-calendar';

/**
 * Tên 8 quẻ đơn (Bát Quái)
 */
export const BAGUA_NAMES = [
  "Khôn", // 0 (nhưng trong công thức khi dư 0 => 8)
  "Càn",  // 1
  "Đoài", // 2
  "Ly",   // 3
  "Chấn", // 4
  "Tốn",  // 5
  "Khảm", // 6
  "Cấn",  // 7
  "Khôn"  // 8
];

/**
 * Ký hiệu quẻ (3 hào)
 */
export const BAGUA_SYMBOLS = [
  "☷", // Khôn 
  "☰", // Càn
  "☱", // Đoài
  "☲", // Ly
  "☳", // Chấn
  "☴", // Tốn
  "☵", // Khảm
  "☶", // Cấn
  "☷"  // Khôn (index 8)
];

/**
 * Cấu trúc hào của 8 quẻ đơn (true = dương, false = âm)
 * Đọc từ dưới lên
 */
export const BAGUA_LINES: Record<number, [boolean, boolean, boolean]> = {
  1: [true, true, true],      // Càn ☰
  2: [true, true, false],     // Đoài ☱
  3: [true, false, true],     // Ly ☲
  4: [true, false, false],    // Chấn ☳
  5: [false, true, true],     // Tốn ☴
  6: [false, true, false],    // Khảm ☵
  7: [false, false, true],    // Cấn ☶
  8: [false, false, false]    // Khôn ☷
};

/**
 * Bảng 64 quẻ theo công thức: upper * 10 + lower
 * Ví dụ: Càn (1) + Đoài (2) = 12 = Thiên Trạch Lý
 */
export const HEXAGRAM_64: Record<number, { name: string; chinese: string; meaning: string }> = {
  // Nhóm 1: Càn Thượng (1)
  11: { name: "Thuần Càn", chinese: "乾", meaning: "Đầu, phổi, xương - Năng lượng dương cực thịnh" },
  12: { name: "Thiên Trạch Lý", chinese: "天澤履", meaning: "Tranh chấp, viêm nhiễm" },
  13: { name: "Thiên Hỏa Đồng Nhân", chinese: "天火同人", meaning: "Cộng đồng, tim phế" },
  14: { name: "Thiên Lôi Vô Vọng", chinese: "天雷无妄", meaning: "Không vọng, gan phổi" },
  15: { name: "Thiên Phong Cấu", chinese: "天風姤", meaning: "Gặp gỡ, phong hàn" },
  16: { name: "Thiên Thủy Tụng", chinese: "天水訟", meaning: "Tranh tụng, phổi thận" },
  17: { name: "Thiên Sơn Độn", chinese: "天山遯", meaning: "Ẩn náu, phổi tỳ" },
  18: { name: "Thiên Địa Bĩ", chinese: "天地否", meaning: "Tắc nghẽn, phế tỳ" },
  
  // Nhóm 2: Đoài Thượng (2)
  21: { name: "Trạch Thiên Quải", chinese: "澤天夬", meaning: "Quyết đoán, đột phá" },
  22: { name: "Thuần Đoài", chinese: "兌", meaning: "Phổi, miệng - Kim thuộc tính" },
  23: { name: "Trạch Hỏa Cách", chinese: "澤火革", meaning: "Cách mạng, biến đổi đột ngột" },
  24: { name: "Trạch Lôi Tuỳ", chinese: "澤雷隨", meaning: "Theo đuổi, mất máu" },
  25: { name: "Trạch Phong Đại Quá", chinese: "澤風大過", meaning: "Quá độ, suy yếu nghiêm trọng" },
  26: { name: "Trạch Thủy Khốn", chinese: "澤水困", meaning: "Khốn đốn, thận hư" },
  27: { name: "Trạch Sơn Hàm", chinese: "澤山咸", meaning: "Nhai, dạ dày" },
  28: { name: "Trạch Địa Tụy", chinese: "澤地萃", meaning: "Tụ tập, u bướu" },
  
  // Nhóm 3: Ly Thượng (3)
  31: { name: "Hỏa Thiên Đại Hữu", chinese: "火天大有", meaning: "Đại hữu, phổi tim" },
  32: { name: "Hỏa Trạch Khuê", chinese: "火澤睽", meaning: "Xa cách, bất đồng" },
  33: { name: "Thuần Ly", chinese: "離", meaning: "Hỏa - Tim, mắt" },
  34: { name: "Hỏa Lôi Phệ Hạp", chinese: "火雷噬嗑", meaning: "Nhai cắn, dạ dày gan" },
  35: { name: "Hỏa Phong Đỉnh", chinese: "火風鼎", meaning: "Cái vạc, tỳ gan" },
  36: { name: "Hỏa Thủy Vị Tế", chinese: "火水未濟", meaning: "Chưa hoàn thành, tim thận" },
  37: { name: "Hỏa Sơn Lữ", chinese: "火山旅", meaning: "Du lịch, tỳ tim" },
  38: { name: "Hỏa Địa Tấn", chinese: "火地晉", meaning: "Tiến lên, tiêu hóa kém" },
  
  // Nhóm 4: Chấn Thượng (4)
  41: { name: "Lôi Thiên Đại Tráng", chinese: "雷天大壯", meaning: "Đại tráng, gan phổi" },
  42: { name: "Lôi Trạch Quy Muội", chinese: "雷澤歸妹", meaning: "Về nhà, hôn nhân - phụ khoa" },
  43: { name: "Lôi Hỏa Phong", chinese: "雷火豐", meaning: "Phong phú, huyết khí tốt" },
  44: { name: "Thuần Chấn", chinese: "震", meaning: "Lôi - Gan, chấn động" },
  45: { name: "Lôi Phong Hằng", chinese: "雷風恒", meaning: "Thường hằng, gan mật ổn định" },
  46: { name: "Lôi Thủy Giải", chinese: "雷水解", meaning: "Giải thoát, gan thận" },
  47: { name: "Lôi Sơn Tiểu Quá", chinese: "雷山小過", meaning: "Nhỏ vượt, gan tỳ" },
  48: { name: "Lôi Địa Dự", chinese: "雷地豫", meaning: "An nhàn, lạc quan - Khí huyết thông suốt" },
  
  // Nhóm 5: Tốn Thượng (5)
  51: { name: "Phong Thiên Tiểu Súc", chinese: "風天小畜", meaning: "Tiểu súc, phong hàn" },
  52: { name: "Phong Trạch Trung Phu", chinese: "風澤中孚", meaning: "Trung thành, phổi gan" },
  53: { name: "Phong Hỏa Gia Nhân", chinese: "風火家人", meaning: "Gia đình, nội tạng" },
  54: { name: "Phong Lôi Ích", chinese: "風雷益", meaning: "Lợi ích, tăng cường" },
  55: { name: "Thuần Tốn", chinese: "巽", meaning: "Phong - Gan mật, gió" },
  56: { name: "Phong Thủy Hoán", chinese: "風水渙", meaning: "Tán loạn, khí huyết rối" },
  57: { name: "Phong Sơn Tiệm", chinese: "風山漸", meaning: "Tiệm tiến, từ từ cải thiện" },
  58: { name: "Phong Địa Quán", chinese: "風地觀", meaning: "Quan sát, chậm tiến triển" },
  
  // Nhóm 6: Khảm Thượng (6)
  61: { name: "Thủy Thiên Nhu", chinese: "水天需", meaning: "Chờ đợi, phổi thận" },
  62: { name: "Thủy Trạch Tiết", chinese: "水澤節", meaning: "Tiết chế, thận phế" },
  63: { name: "Thủy Hỏa Ký Tế", chinese: "水火既濟", meaning: "Đã hoàn thành, thận tim cân bằng" },
  64: { name: "Thủy Lôi Truân", chinese: "水雷屯", meaning: "Gian nan, thận gan" },
  65: { name: "Thủy Phong Tỉnh", chinese: "水風井", meaning: "Giếng nước, thận gan" },
  66: { name: "Thuần Khảm", chinese: "坎", meaning: "Thủy - Thận, tiết niệu" },
  67: { name: "Thủy Sơn Kiển", chinese: "水山蹇", meaning: "Khập khiễng, thận tỳ" },
  68: { name: "Thủy Địa Tỷ", chinese: "水地比", meaning: "So sánh, phù thũng" },
  
  // Nhóm 7: Cấn Thượng (7)
  71: { name: "Sơn Thiên Đại Súc", chinese: "山天大畜", meaning: "Đại súc, tỳ phổi" },
  72: { name: "Sơn Trạch Tổn", chinese: "山澤損", meaning: "Tổn thất, tỳ phế" },
  73: { name: "Sơn Hỏa Bí", chinese: "山火賁", meaning: "Trang trí, tỳ tim" },
  74: { name: "Sơn Lôi Di", chinese: "山雷頤", meaning: "Nuôi dưỡng, dạ dày gan" },
  75: { name: "Sơn Phong Cổ", chinese: "山風蠱", meaning: "Rối loạn, tỳ gan" },
  76: { name: "Sơn Thủy Mông", chinese: "山水蒙", meaning: "Mù mờ, tỳ thận" },
  77: { name: "Cấn", chinese: "艮", meaning: "Sơn - Dạ dày, lưng" },
  78: { name: "Sơn Địa Bác", chinese: "山地剝", meaning: "Bóc lột, tiêu hóa kém" },
  
  // Nhóm 8: Khôn Thượng (8)
  81: { name: "Địa Thiên Thái", chinese: "地天泰", meaning: "Thái hòa, tỳ phổi cân bằng" },
  82: { name: "Địa Trạch Lâm", chinese: "地澤臨", meaning: "Đến gần, tỳ phế" },
  83: { name: "Địa Hỏa Minh Di", chinese: "地火明夷", meaning: "Ánh sáng bị tổn, tỳ tim" },
  84: { name: "Địa Lôi Phục", chinese: "地雷復", meaning: "Phục hồi, tỳ gan" },
  85: { name: "Địa Phong Thăng", chinese: "地風升", meaning: "Thăng tiến, tỳ gan tốt" },
  86: { name: "Địa Thủy Sư", chinese: "地水師", meaning: "Quân đội, tỳ thận" },
  87: { name: "Địa Sơn Khiêm", chinese: "地山謙", meaning: "Khiêm tốn, tỳ vị" },
  88: { name: "Thuần Khôn", chinese: "坤", meaning: "Địa - Lá lách, bụng, tiêu hóa" }
};

/**
 * Interface kết quả lập quẻ
 */
export interface MaiHuaResult {
  // Input đã chuẩn hóa
  solarDate: { day: number; month: number; year: number; hour: number };
  lunarDate: { day: number; month: number; year: number; hour: number; isLeap: boolean };
  
  // Quẻ
  upperTrigram: number;      // Quẻ Thượng (1-8)
  lowerTrigram: number;      // Quẻ Hạ (1-8)
  movingLine: number;        // Hào động (1-6)
  
  // Quẻ Chủ (Bản quái)
  mainHexagram: {
    upper: number;
    lower: number;
    name: string;
    symbol: string;
    lines: boolean[];        // 6 hào từ dưới lên
  };
  
  // Quẻ Biến
  changedHexagram: {
    upper: number;
    lower: number;
    name: string;
    symbol: string;
    lines: boolean[];
  };
  
  // Quẻ Hổ (Mutual/Intermediate)
  mutualHexagram: {
    upper: number;
    lower: number;
    name: string;
    symbol: string;
    lines: boolean[];
  };
  
  // Diễn giải y lý
  interpretation: {
    mainMeaning: string;
    changedMeaning: string;
    health: string;
  };
}

/**
 * Lấy 6 hào của một quẻ hoàn chỉnh
 */
function getHexagramLines(upper: number, lower: number): boolean[] {
  const lowerLines = BAGUA_LINES[lower];
  const upperLines = BAGUA_LINES[upper];
  return [...lowerLines, ...upperLines];
}

/**
 * Đổi một hào (dương <-> âm)
 */
function flipLine(lines: boolean[], position: number): boolean[] {
  const newLines = [...lines];
  newLines[position - 1] = !newLines[position - 1];
  return newLines;
}

/**
 * Chuyển 6 hào thành 2 quẻ đơn
 */
function linesToTrigrams(lines: boolean[]): { upper: number; lower: number } {
  const lowerLines: [boolean, boolean, boolean] = [lines[0], lines[1], lines[2]];
  const upperLines: [boolean, boolean, boolean] = [lines[3], lines[4], lines[5]];
  
  let lower = 0;
  let upper = 0;
  
  // Tìm quẻ khớp
  for (let i = 1; i <= 8; i++) {
    const l = BAGUA_LINES[i];
    if (l[0] === lowerLines[0] && l[1] === lowerLines[1] && l[2] === lowerLines[2]) {
      lower = i;
    }
    if (l[0] === upperLines[0] && l[1] === upperLines[1] && l[2] === upperLines[2]) {
      upper = i;
    }
  }
  
  return { upper, lower };
}

/**
 * Lấy tên và ý nghĩa quẻ
 */
function getHexagramInfo(upper: number, lower: number): { name: string; chinese: string; meaning: string } {
  const key = upper * 10 + lower;
  const info = HEXAGRAM_64[key];
  if (!info) {
    return { name: "Không xác định", chinese: "", meaning: "" };
  }
  return info;
}

/**
 * Tính Quẻ Hổ (Mutual Hexagram)
 * Lấy hào 2,3,4 làm Hổ Hạ và hào 3,4,5 làm Hổ Thượng
 */
function getMutualHexagram(lines: boolean[]): { upper: number; lower: number } {
  const mutualLower: [boolean, boolean, boolean] = [lines[1], lines[2], lines[3]];
  const mutualUpper: [boolean, boolean, boolean] = [lines[2], lines[3], lines[4]];
  
  let lower = 0;
  let upper = 0;
  
  for (let i = 1; i <= 8; i++) {
    const l = BAGUA_LINES[i];
    if (l[0] === mutualLower[0] && l[1] === mutualLower[1] && l[2] === mutualLower[2]) {
      lower = i;
    }
    if (l[0] === mutualUpper[0] && l[1] === mutualUpper[1] && l[2] === mutualUpper[2]) {
      upper = i;
    }
  }
  
  return { upper, lower };
}

/**
 * Hàm chính: Lập quẻ Mai Hoa từ ngày dương lịch
 * 
 * @param day - Ngày (1-31)
 * @param month - Tháng (1-12)
 * @param year - Năm
 * @param hour - Giờ (0-23)
 * @returns Kết quả lập quẻ đầy đủ
 */
export function calculateMaiHua(
  day: number,
  month: number,
  year: number,
  hour: number
): MaiHuaResult {
  // Module 1: Chuẩn hóa dữ liệu đầu vào
  let lunar = convertSolar2Lunar(day, month, year);
  const hourChi = getHourChi(hour);
  
  // QUY TẮC QUAN TRỌNG: Sau 23h đêm (Giờ Tý) được tính là ngày hôm sau
  // Giờ Tý (23h-01h sáng) thuộc về ngày mới trong Dịch học
  if (hour >= 23) {
    // Chuyển sang ngày hôm sau
    const nextDay = new Date(year, month - 1, day);
    nextDay.setDate(nextDay.getDate() + 1);
    lunar = convertSolar2Lunar(nextDay.getDate(), nextDay.getMonth() + 1, nextDay.getFullYear());
    
    console.log('[v0] Hour >= 23, advancing to next lunar day:', {
      originalDay: day,
      newDay: lunar.day,
      hour,
      hourChi: 'Tý'
    });
  }
  
  // Công thức lấy số năm: (năm + 8) % 12 => Địa chi năm
  // Ất Tỵ: Chi = Tỵ = 5 (Tý=0,Sửu=1,Dần=2,Mão=3,Thìn=4,Tỵ=5...)
  // Cộng thêm 1 để có 1-12: 5+1=6 ✓
  const yearChi = (lunar.year + 8) % 12; // 0-11: Tý đến Hợi
  const Y = yearChi + 1; // 1-12 (nhưng sẽ dùng để tính mod 8)
  const M = lunar.month;
  const D = lunar.day;
  const H = hourChi + 1; // Chi giờ (1-12)
  
  console.log('[v0] Mai Hoa Calculation Input:', { Y, M, D, H, lunarYear: lunar.year, yearChi });
  
  // Module 2: Engine lập quẻ
  
  // 2.1: Xác định Quẻ Thượng và Quẻ Hạ
  let upperValue = (Y + M + D) % 8;
  if (upperValue === 0) upperValue = 8;
  
  let lowerValue = (Y + M + D + H) % 8;
  if (lowerValue === 0) lowerValue = 8;
  
  // 2.2: Xác định Hào động
  let movingLineValue = (Y + M + D + H) % 6;
  if (movingLineValue === 0) movingLineValue = 6;
  
  console.log('[v0] Mai Hoa Trigrams:', { 
    sum1: Y + M + D, 
    upperValue, 
    upperName: BAGUA_NAMES[upperValue],
    sum2: Y + M + D + H, 
    lowerValue,
    lowerName: BAGUA_NAMES[lowerValue],
    movingLineValue 
  });
  
  // Tạo Quẻ Chủ
  const mainLines = getHexagramLines(upperValue, lowerValue);
  const mainInfo = getHexagramInfo(upperValue, lowerValue);
  
  // Tạo Quẻ Biến (đổi hào động)
  const changedLines = flipLine(mainLines, movingLineValue);
  const changedTrigrams = linesToTrigrams(changedLines);
  const changedInfo = getHexagramInfo(changedTrigrams.upper, changedTrigrams.lower);
  
  // 2.3: Tính Quẻ Hổ
  const mutualTrigrams = getMutualHexagram(mainLines);
  const mutualLines = getHexagramLines(mutualTrigrams.upper, mutualTrigrams.lower);
  const mutualInfo = getHexagramInfo(mutualTrigrams.upper, mutualTrigrams.lower);
  
  // Diễn giải y lý cơ bản
  const interpretation = {
    mainMeaning: mainInfo.meaning || "Trạng thái hiện tại của cơ thể",
    changedMeaning: changedInfo.meaning || "Xu hướng diễn biến của bệnh",
    health: `Quẻ chủ ${mainInfo.name} cho thấy tình trạng sức khỏe liên quan đến ${mainInfo.meaning}. Hào động ở vị trí ${movingLineValue} và quẻ biến ${changedInfo.name} cho thấy xu hướng ${changedInfo.meaning}.`
  };
  
  return {
    solarDate: { day, month, year, hour },
    lunarDate: {
      day: lunar.day,
      month: lunar.month,
      year: lunar.year,
      hour: hourChi,
      isLeap: lunar.isLeap
    },
    upperTrigram: upperValue,
    lowerTrigram: lowerValue,
    movingLine: movingLineValue,
    mainHexagram: {
      upper: upperValue,
      lower: lowerValue,
      name: mainInfo.name,
      symbol: `${BAGUA_SYMBOLS[upperValue]}${BAGUA_SYMBOLS[lowerValue]}`,
      lines: mainLines
    },
    changedHexagram: {
      upper: changedTrigrams.upper,
      lower: changedTrigrams.lower,
      name: changedInfo.name,
      symbol: `${BAGUA_SYMBOLS[changedTrigrams.upper]}${BAGUA_SYMBOLS[changedTrigrams.lower]}`,
      lines: changedLines
    },
    mutualHexagram: {
      upper: mutualTrigrams.upper,
      lower: mutualTrigrams.lower,
      name: mutualInfo.name,
      symbol: `${BAGUA_SYMBOLS[mutualTrigrams.upper]}${BAGUA_SYMBOLS[mutualTrigrams.lower]}`,
      lines: mutualLines
    },
    interpretation
  };
}
