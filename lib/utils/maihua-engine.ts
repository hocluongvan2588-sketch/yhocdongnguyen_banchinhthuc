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
 * Bảng tra số Hoàng Đế cho Địa Chi
 * Tý=1, Sửu=2, Dần=3, Mão=4, Thìn=5, Tỵ=6,
 * Ngọ=7, Mùi=8, Thân=9, Dậu=10, Tuất=11, Hợi=12
 */
export const DI_CHI_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * Bảng 64 quẻ (index bằng upper * 10 + lower)
 * Format: "Tên quẻ|Ý nghĩa y lý"
 */
export const HEXAGRAM_64 = {
  11: "Càn|Đầu, phổi, xương - Năng lượng dương cực thịnh",
  12: "Thiên Trạch Lý|Tranh chấp, viêm nhiễm",
  13: "Thiên Hỏa Đồng Nhân|Cộng đồng, tim phế",
  14: "Thiên Lôi Vô Vọng|Không vọng, gan phổi",
  15: "Thiên Phong Cấu|Gặp gỡ, phong hàn",
  16: "Thiên Thủy Tụng|Tranh tụng, phổi thận",
  17: "Thiên Sơn Độn|Ẩn náu, phổi tỳ",
  18: "Thiên Địa Bĩ|Tắc nghẽn, phế tỳ",
  
  21: "Trạch Thiên Quải|Quyết đoán, đột phá",
  22: "Đoài|Phổi, miệng - Kim thuộc tính",
  23: "Trạch Hỏa Cách|Cách mạng, biến đổi đột ngột",
  24: "Trạch Lôi Tuỳ|Theo đuổi, mất máu",
  25: "Trạch Phong Đại Quá|Quá độ, suy yếu nghiêm trọng",
  26: "Trạch Thủy Khốn|Khốn đốn, thận hư",
  27: "Trạch Sơn Hàm|Nhai, dạ dày",
  28: "Trạch Địa Tụy|Tụ tập, u bướu",
  
  31: "Sơn Trạch Tổn|Tổn thất, tỳ phế",
  32: "Sơn Hỏa Bí|Trang trí, tỳ tim",
  33: "Ly|Hỏa - Tim, mắt",
  34: "Sơn Lôi Di|Nuôi dưỡng, dạ dày gan",
  35: "Sơn Phong Cổ|Rối loạn, tỳ gan",
  36: "Sơn Thủy Mông|Mù mờ, tỳ thận",
  37: "Cấn|Sơn - Dạ dày, lưng",
  38: "Sơn Địa Bác|Bóc lột, tiêu hóa kém",
  
  41: "Thiên Lôi Vô Vọng|Không vọng, gan phổi",
  42: "Lôi Trạch Quy Muội|Về nhà, hôn nhân - phụ khoa",
  43: "Lôi Hỏa Phong|Phong phú, huyết khí tốt",
  44: "Chấn|Lôi - Gan, chấn động",
  45: "Lôi Phong Hằng|Thường hằng, gan mật ổn định",
  46: "Lôi Thủy Giải|Giải thoát, gan thận",
  47: "Lôi Sơn Tiểu Quá|Nhỏ vượt, gan tỳ",
  48: "Lôi Địa Dự|An nhàn, lạc quan - Khí huyết thông suốt",
  
  51: "Thiên Phong Cấu|Gặp gỡ, phong hàn",
  52: "Phong Trạch Trung Phu|Trung thành, phổi gan",
  53: "Phong Hỏa Gia Nhân|Gia đình, nội tạng",
  54: "Phong Lôi Ích|Lợi ích, tăng cường",
  55: "Tốn|Phong - Gan mật, gió",
  56: "Phong Thủy Hoán|Tán loạn, khí huyết rối",
  57: "Phong Sơn Tiệm|Tiệm tiến, từ từ cải thiện",
  58: "Phong Địa Quán|Quan sát, chậm tiến triển",
  
  61: "Thiên Thủy Tụng|Tranh tụng, phổi thận",
  62: "Thủy Trạch Tiết|Tiết chế, thận phế",
  63: "Thủy Hỏa Ký Tế|Đã hoàn thành, thận tim cân bằng",
  64: "Thủy Lôi Truân|Gian nan, thận gan",
  65: "Thủy Phong Tỉnh|Giếng nước, thận gan",
  66: "Khảm|Thủy - Thận, tiết niệu",
  67: "Thủy Sơn Kiển|Khập khiễng, thận tỳ",
  68: "Thủy Địa Tỷ|So sánh, phù thũng",
  
  71: "Thiên Sơn Độn|Ẩn náu, phổi tỳ",
  72: "Sơn Trạch Tổn|Tổn thất, tỳ phế",
  73: "Sơn Hỏa Bí|Trang trí, tỳ tim",
  74: "Sơn Lôi Di|Nuôi dưỡng, dạ dày gan",
  75: "Sơn Phong Cổ|Rối loạn, tỳ gan",
  76: "Sơn Thủy Mông|Mù mờ, tỳ thận",
  77: "Cấn|Sơn - Dạ dày, lưng",
  78: "Sơn Địa Bác|Bóc lột, tiêu hóa kém",
  
  81: "Thiên Địa Bĩ|Tắc nghẽn, phế tỳ",
  82: "Địa Trạch Lâm|Đến gần, tỳ phế",
  83: "Địa Hỏa Minh Di|Ánh sáng bị tổn, tỳ tim",
  84: "Địa Lôi Phục|Phục hồi, tỳ gan",
  85: "Địa Phong Thăng|Thăng tiến, tỳ gan tốt",
  86: "Địa Thủy Sư|Quân đội, tỳ thận",
  87: "Địa Sơn Khiêm|Khiêm tốn, tỳ vị",
  88: "Khôn|Địa - Lá lách, bụng, tiêu hóa"
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
  // position: 1-6, nhưng mảng bắt đầu từ 0
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
function getHexagramInfo(upper: number, lower: number): { name: string; meaning: string } {
  const key = upper * 10 + lower;
  const info = HEXAGRAM_64[key as keyof typeof HEXAGRAM_64] || "Chưa có thông tin|";
  const [name, meaning] = info.split("|");
  return { name, meaning };
}

/**
 * Tính Quẻ Hổ (Mutual Hexagram)
 * Lấy hào 2,3,4 làm Hổ Hạ và hào 3,4,5 làm Hổ Thượng
 * Chú ý: lines[0] = hào 1 (dưới cùng), lines[5] = hào 6 (trên cùng)
 */
function getMutualHexagram(lines: boolean[]): { upper: number; lower: number } {
  // Hào 2,3,4 làm Hạ quẻ Hổ
  const mutualLower: [boolean, boolean, boolean] = [lines[1], lines[2], lines[3]];
  // Hào 3,4,5 làm Thượng quẻ Hổ
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
 * Tính Địa Chi của năm (0-11: Tý đến Hợi)
 */
function getYearDiChi(year: number): number {
  // Công thức: (năm - 4) % 12
  // Lý do: Năm Giáp Tý là năm 4, nên lấy năm - 4
  let result = (year - 4) % 12;
  if (result < 0) result += 12; // Xử lý số âm
  return result;
}

/**
 * Xác định ngày Âm lịch chính xác theo giờ Dịch học
 * Quy tắc: 0h-1h sáng thuộc ngày mới, 23h-24h vẫn thuộc ngày cũ
 */
function getLunarDateForDichHoc(
  solarDay: number,
  solarMonth: number,
  solarYear: number,
  hour: number
): { day: number; month: number; year: number; isLeap: boolean } {
  let targetDay = solarDay;
  let targetMonth = solarMonth;
  let targetYear = solarYear;
  
  // Trong Dịch học: 0h-1h sáng đã thuộc ngày mới
  if (hour >= 0 && hour < 1) {
    // Chuyển sang ngày hôm sau
    const nextDay = new Date(solarYear, solarMonth - 1, solarDay);
    nextDay.setDate(nextDay.getDate() + 1);
    targetDay = nextDay.getDate();
    targetMonth = nextDay.getMonth() + 1;
    targetYear = nextDay.getFullYear();
    console.log(`[MaiHua] Giờ ${hour}h thuộc ngày mới: ${targetDay}/${targetMonth}/${targetYear}`);
  } else {
    console.log(`[MaiHua] Giờ ${hour}h thuộc ngày hiện tại: ${solarDay}/${solarMonth}/${solarYear}`);
  }
  
  return convertSolar2Lunar(targetDay, targetMonth, targetYear);
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
  console.log(`[MaiHua] Input: ${day}/${month}/${year} ${hour}h`);
  
  // 1. Xác định ngày Âm lịch theo giờ Dịch học
  const lunar = getLunarDateForDichHoc(day, month, year, hour);
  const hourChi = getHourChi(hour);
  
  console.log(`[MaiHua] Lunar date: ${lunar.day}/${lunar.month}/${lunar.year} (${lunar.isLeap ? 'leap' : 'normal'})`);
  console.log(`[MaiHua] Hour Chi: ${hourChi} (hour: ${hour})`);
  
  // 2. Tính các số theo công thức Thiệu Khang Tiết
  
  // a) Số năm (Y): Lấy số Hoàng Đế của Địa Chi năm
  const yearDiChi = getYearDiChi(lunar.year);
  const Y = DI_CHI_NUMBERS[yearDiChi];
  
  // b) Số tháng (M): Tháng Âm lịch
  const M = lunar.month;
  
  // c) Số ngày (D): Ngày Âm lịch
  const D = lunar.day;
  
  // d) Số giờ (H): Lấy số Hoàng Đế của Địa Chi giờ + 1
  const H = hourChi + 1; // hourChi từ 0-11, cần 1-12
  
  console.log(`[MaiHua] Numbers: Y=${Y} (DiChi=${yearDiChi}), M=${M}, D=${D}, H=${H}`);
  
  // 3. Tính Quẻ Thượng và Quẻ Hạ
  let upperValue = (Y + M + D) % 8;
  if (upperValue === 0) upperValue = 8;
  
  let lowerValue = (Y + M + D + H) % 8;
  if (lowerValue === 0) lowerValue = 8;
  
  // 4. Tính Hào động
  let movingLineValue = (Y + M + D + H) % 6;
  if (movingLineValue === 0) movingLineValue = 6;
  
  console.log(`[MaiHua] Trigrams: Upper=${upperValue}(${BAGUA_NAMES[upperValue]}), Lower=${lowerValue}(${BAGUA_NAMES[lowerValue]})`);
  console.log(`[MaiHua] Moving line: ${movingLineValue}`);
  
  // 5. Tạo Quẻ Chủ (Bản quái)
  const mainLines = getHexagramLines(upperValue, lowerValue);
  const mainInfo = getHexagramInfo(upperValue, lowerValue);
  
  // 6. Tạo Quẻ Biến (đổi hào động)
  const changedLines = flipLine(mainLines, movingLineValue);
  const changedTrigrams = linesToTrigrams(changedLines);
  const changedInfo = getHexagramInfo(changedTrigrams.upper, changedTrigrams.lower);
  
  // 7. Tính Quẻ Hổ (Tương quái)
  const mutualTrigrams = getMutualHexagram(mainLines);
  const mutualLines = getHexagramLines(mutualTrigrams.upper, mutualTrigrams.lower);
  const mutualInfo = getHexagramInfo(mutualTrigrams.upper, mutualTrigrams.lower);
  
  console.log(`[MaiHua] Main hexagram: ${mainInfo.name}`);
  console.log(`[MaiHua] Changed hexagram: ${changedInfo.name}`);
  console.log(`[MaiHua] Mutual hexagram: ${mutualInfo.name}`);
  
  // 8. Diễn giải y lý
  const interpretation = {
    mainMeaning: mainInfo.meaning || "Trạng thái hiện tại của cơ thể",
    changedMeaning: changedInfo.meaning || "Xu hướng diễn biến của bệnh",
    health: `Quẻ chủ ${mainInfo.name} cho thấy: ${mainInfo.meaning}. Hào động ở vị trí ${movingLineValue} biến thành quẻ ${changedInfo.name}, biểu thị xu hướng ${changedInfo.meaning}. Quẻ hổ ${mutualInfo.name} cho thấy tình trạng tiềm ẩn.`
  };
  
  // 9. Tạo kết quả
  const result: MaiHuaResult = {
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
  
  return result;
}

/**
 * Hàm helper: Hiển thị quẻ dạng text
 */
export function displayHexagram(result: MaiHuaResult): string {
  const { mainHexagram, changedHexagram, mutualHexagram, movingLine } = result;
  
  let display = `QUẺ MAI HOA DỊCH SỐ\n`;
  display += `Ngày: ${result.solarDate.day}/${result.solarDate.month}/${result.solarDate.year} ${result.solarDate.hour}h\n`;
  display += `Âm lịch: ${result.lunarDate.day}/${result.lunarDate.month}/${result.lunarDate.year} ${result.lunarDate.isLeap ? '(nhuận)' : ''}\n\n`;
  
  display += `1. QUẺ CHỦ (Bản quái): ${mainHexagram.name}\n`;
  display += `   ${mainHexagram.symbol}\n`;
  display += `   Hào từ dưới lên:\n`;
  mainHexagram.lines.forEach((line, index) => {
    const lineNum = index + 1;
    const lineSymbol = line ? '⚊ Dương' : '⚋ Âm';
    const moving = lineNum === movingLine ? ' ← ĐỘNG' : '';
    display += `   Hào ${lineNum}: ${lineSymbol}${moving}\n`;
  });
  display += `   Ý nghĩa: ${result.interpretation.mainMeaning}\n\n`;
  
  display += `2. QUẺ BIẾN (Chi quái): ${changedHexagram.name}\n`;
  display += `   ${changedHexagram.symbol}\n`;
  display += `   Hào động: ${movingLine}\n`;
  display += `   Ý nghĩa: ${result.interpretation.changedMeaning}\n\n`;
  
  display += `3. QUẺ HỔ (Tương quái): ${mutualHexagram.name}\n`;
  display += `   ${mutualHexagram.symbol}\n\n`;
  
  display += `4. TỔNG KẾT Y LÝ:\n`;
  display += `   ${result.interpretation.health}\n`;
  
  return display;
}

/**
 * Test với ví dụ cụ thể
 */
export function testMaiHuaExample(): MaiHuaResult {
  // Test với ngày 15/3/2025 10:30 (giờ Tỵ)
  return calculateMaiHua(15, 3, 2025, 10);
}