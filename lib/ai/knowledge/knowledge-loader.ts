import fs from "fs"
import path from "path"

export interface KnowledgeChunk {
  id: string
  content: string
  type: "core" | "symptom" | "timing" | "treatment" | "nam-duoc"
  relevantSymptoms?: string[]
  relevantOrgans?: string[]
  servicePackage?: "mai-hoa" | "nam-duoc"
}

let knowledgeChunksCache: KnowledgeChunk[] | null = null
let knowledgeCacheTime = 0
const KNOWLEDGE_CACHE_DURATION = 30 * 60 * 1000 // 30 phút

// Mapping triệu chứng → bộ phận cơ thể
const SYMPTOM_TO_ORGANS: Record<string, string[]> = {
  "đau đầu": ["đầu", "gan", "tim", "thận"],
  "đau mắt": ["mắt", "gan", "tim"],
  "đau gối": ["gối", "gan", "thận", "tỳ"],
  "mất ngủ": ["tim", "thận", "gan"],
  "đau dạ dày": ["dạ dày", "tỳ", "gan"],
  ho: ["phổi"],
  "đau răng": ["răng", "vị", "thận"],
  "chóng mặt": ["đầu", "gan", "thận"],
  "mệt mỏi": ["tỳ", "thận", "gan"],
  sốt: ["tim", "phổi"],
}

// Mapping Ngũ Hành (Five Elements) for Nam Dược
const WU_XING_MAPPING = {
  Thủy: {
    element: "Thủy",
    organs: ["thận", "bàng quang", "tai", "xương", "tóc"],
    taste: "mặn",
    direction: "Bắc",
    season: "Đông",
    climate: "Lạnh",
  },
  Mộc: {
    element: "Mộc",
    organs: ["can", "gan", "mật", "mắt", "gân", "móng"],
    taste: "chua",
    direction: "Đông",
    season: "Xuân",
    climate: "Gió",
  },
  Kim: {
    element: "Kim",
    organs: ["phế", "phổi", "đại tràng", "mũi", "da", "lông"],
    taste: "cay",
    direction: "Tây",
    season: "Thu",
    climate: "Khô",
  },
  Hỏa: {
    element: "Hỏa",
    organs: ["tâm", "tim", "tiểu tràng", "lưỡi", "mạch"],
    taste: "đắng",
    direction: "Nam",
    season: "Hè",
    climate: "Nóng",
  },
  Thổ: {
    element: "Thổ",
    organs: ["tỳ", "vị", "miệng", "môi", "cơ"],
    taste: "ngọt",
    direction: "Trung ương",
    season: "Tứ mùa",
    climate: "Ẩm",
  },
}

export function parseKnowledgeBase(): KnowledgeChunk[] {
  const now = Date.now()

  // Sử dụng cache nếu còn hiệu lực
  if (knowledgeChunksCache && now - knowledgeCacheTime < KNOWLEDGE_CACHE_DURATION) {
    return knowledgeChunksCache
  }

  try {
    const knowledgePath = path.join(process.cwd(), "lib/ai/knowledge")
    const maiHoaCore = fs.readFileSync(path.join(knowledgePath, "mai-hoa-core.md"), "utf-8")
    const symptomAnalysis = fs.readFileSync(path.join(knowledgePath, "symptom-analysis.md"), "utf-8")
    const anthropometricRules = fs.readFileSync(path.join(knowledgePath, "anthropometric-rules.md"), "utf-8")
    const namDuocThanHieu = fs.readFileSync(path.join(knowledgePath, "nam-duoc-than-hieu.md"), "utf-8")
    const batTrachMinhCanh = fs.readFileSync(path.join(knowledgePath, "bat-trach-minh-canh.md"), "utf-8")
    const khaiHuyetCamNang = fs.readFileSync(path.join(knowledgePath, "khai-huyet-cam-nang.md"), "utf-8")

    const chunks: KnowledgeChunk[] = []

    // Chunk 1: Core logic (luôn cần) - Mai Hoa
    const coreSection = extractSection(maiHoaCore, "LOGIC CHẨN ĐOÁN CỐT LÕI", "8 QUẺ THUẦN VÀ BỘ PHẬN")
    chunks.push({
      id: "core-logic",
      content: coreSection,
      type: "core",
      servicePackage: "mai-hoa",
    })

    chunks.push({
      id: "anthropometric-rules",
      content: anthropometricRules,
      type: "core",
      servicePackage: "mai-hoa",
    })

    const namDuocWuXing = [
      { element: "Thủy", organs: ["thận", "bàng quang", "tai"], marker: "## I. HÀNH THỦY" },
      { element: "Mộc", organs: ["can", "mật", "mắt", "gân"], marker: "## II. HÀNH MỘC" },
      { element: "Kim", organs: ["phế", "đại tràng", "mũi", "da"], marker: "## III. HÀNH KIM" },
      { element: "Hỏa", organs: ["tâm", "tim", "tiểu tràng", "lưỡi"], marker: "## IV. HÀNH HỎA" },
      { element: "Thổ", organs: ["tỳ", "vị", "miệng"], marker: "## V. HÀNH THỔ" },
    ]

    namDuocWuXing.forEach((wuxing) => {
      const section = extractSectionByMarker(namDuocThanHieu, wuxing.marker)
      if (section) {
        chunks.push({
          id: `nam-duoc-${wuxing.element.toLowerCase()}`,
          content: section,
          type: "nam-duoc",
          relevantOrgans: wuxing.organs,
          servicePackage: "nam-duoc",
        })
      }
    })

    const herbCatalog = extractSection(namDuocThanHieu, "DANH MỤC THUỐC NAM", "## I. HÀNH THỦY")
    if (herbCatalog) {
      chunks.push({
        id: "nam-duoc-catalog",
        content: herbCatalog,
        type: "nam-duoc",
        servicePackage: "nam-duoc",
      })
    }

    // Chunk 2: 8 quẻ thuần (chia nhỏ theo quẻ) - Mai Hoa
    const trigramSections = [
      { name: "Càn", organs: ["đầu", "xương", "phổi", "đại tràng"] },
      { name: "Đoài", organs: ["miệng", "họng", "phổi"] },
      { name: "Ly", organs: ["mắt", "tim", "ruột non"] },
      { name: "Chấn", organs: ["chân", "gan", "mật"] },
      { name: "Tốn", organs: ["tay", "gan", "ruột"] },
      { name: "Khảm", organs: ["tai", "thận", "bàng quang"] },
      { name: "Cấn", organs: ["tay", "mũi", "tỳ", "vị"] },
      { name: "Khôn", organs: ["bụng", "tỳ", "dạ dày"] },
    ]

    trigramSections.forEach((trigram) => {
      const section = extractTrigramSection(maiHoaCore, trigram.name)
      if (section) {
        chunks.push({
          id: `trigram-${trigram.name}`,
          content: section,
          type: "core",
          relevantOrgans: trigram.organs,
          servicePackage: "mai-hoa",
        })
      }
    })

    // Chunk 3: Phân tích theo mùa - Mai Hoa
    const timingSection = extractSection(maiHoaCore, "PHÂN TÍCH THEO MÙA", "THỜI ĐIỂM HỒI PHỤC")
    chunks.push({
      id: "timing",
      content: timingSection,
      type: "timing",
      servicePackage: "mai-hoa",
    })

    // Chunk 4: Phân tích triệu chứng cụ thể - Mai Hoa
    const symptomSections = ["ĐAU ĐẦU", "ĐAU ĐẦU GỐI", "MẤT NGỦ", "ĐAU DẠ DÀY", "HO KHAN", "ĐAU RĂNG"]

    symptomSections.forEach((symptom) => {
      const section = extractSymptomSection(symptomAnalysis, symptom)
      if (section) {
        chunks.push({
          id: `symptom-${symptom.toLowerCase().replace(/\s+/g, "-")}`,
          content: section,
          type: "symptom",
          relevantSymptoms: [symptom.toLowerCase()],
          servicePackage: "mai-hoa",
        })
      }
    })

    // Chunk: Bát Trạch Minh Cảnh knowledge for numerology
    const batTrachCore = extractSection(batTrachMinhCanh, "LOGIC BÁT TRẠCH", "MA TRẬN 8x8")
    if (batTrachCore) {
      chunks.push({
        id: "bat-trach-core",
        content: batTrachCore,
        type: "treatment",
        servicePackage: "numerology" as any,
      })
    }

    // Chunk: Khai Huyệt knowledge for acupressure
    const khaiHuyetCore = extractSection(khaiHuyetCamNang, "LOGIC CHỌN HUYỆT", "MA TRẬN ÁNH XẠ")
    if (khaiHuyetCore) {
      chunks.push({
        id: "khai-huyet-core",
        content: khaiHuyetCore,
        type: "treatment",
        servicePackage: "khai-huyet" as any,
      })
    }

    knowledgeChunksCache = chunks
    knowledgeCacheTime = now

    console.log(
      `[v0] Knowledge base parsed: ${chunks.length} chunks (${chunks.filter((c) => c.servicePackage === "nam-duoc").length} Nam Dược, ${chunks.filter((c) => (c as any).servicePackage === "numerology").length} Bát Trạch, ${chunks.filter((c) => (c as any).servicePackage === "khai-huyet").length} Khai Huyệt)`,
    )

    return chunks
  } catch (error) {
    console.error("[v0] Failed to parse knowledge base:", error)
    return []
  }
}

/**
 * Smart Reranking với keyword matching
 */
function calculateRelevanceScore(chunk: KnowledgeChunk, keywords: string[], affectedOrgans: string[]): number {
  let score = 0
  const content = chunk.content.toLowerCase()

  // +10 điểm cho mỗi keyword match
  keywords.forEach((kw) => {
    if (content.includes(kw)) score += 10
  })

  // +5 điểm cho mỗi organ match
  if (chunk.relevantOrgans) {
    chunk.relevantOrgans.forEach((organ) => {
      if (affectedOrgans.some((a) => a.includes(organ))) {
        score += 5
      }
    })
  }

  // +15 điểm nếu là symptom analysis chunk và match với triệu chứng
  if (chunk.type === "symptom" && chunk.relevantSymptoms) {
    chunk.relevantSymptoms.forEach((symptom) => {
      if (keywords.some((kw) => symptom.includes(kw))) {
        score += 15
      }
    })
  }

  return score
}

export function selectRelevantChunks(
  healthConcern: string,
  affectedOrgans: string[],
  hasAnthropometricData = false,
  maxTokens = 1000,
  servicePackage: "mai-hoa" | "nam-duoc" | "khai-huyet" | "both" = "mai-hoa",
): string {
  const chunks = parseKnowledgeBase()
  const selected: KnowledgeChunk[] = []

  // Extract keywords từ healthConcern
  const concernLower = healthConcern.toLowerCase()
  const keywords = Object.keys(SYMPTOM_TO_ORGANS).filter((keyword) => concernLower.includes(keyword))

  const filteredChunks = chunks.filter((c) => {
    if (servicePackage === "both") return true
    return !c.servicePackage || c.servicePackage === servicePackage
  })

  // === SMART RERANKING: Tính điểm relevance cho tất cả chunks ===
  const scoredChunks = filteredChunks
    .map((chunk) => ({
      chunk,
      score: calculateRelevanceScore(chunk, keywords, affectedOrgans),
    }))
    .sort((a, b) => b.score - a.score) // Sắp xếp theo điểm cao xuống thấp

  console.log(
    `[v0] Reranking: Top 5 chunks - ${scoredChunks
      .slice(0, 5)
      .map((s) => `${s.chunk.id}:${s.score}`)
      .join(", ")}`,
  )

  if (servicePackage === "nam-duoc" || servicePackage === "both") {
    // Luôn thêm catalog (không cần rerank)
    const catalogChunk = filteredChunks.find((c) => c.id === "nam-duoc-catalog")
    if (catalogChunk) {
      const summarizedCatalog = summarizeHerbCatalog(catalogChunk.content)
      selected.push({
        ...catalogChunk,
        content: summarizedCatalog,
      })
    }

    // Chỉ lấy top 2 chunks có điểm cao nhất cho Nam Dược
    scoredChunks
      .filter((s) => s.chunk.type === "nam-duoc" && s.chunk.id !== "nam-duoc-catalog" && s.score > 0)
      .slice(0, 2)
      .forEach((s) => selected.push(s.chunk))
  }

  if (servicePackage === "mai-hoa" || servicePackage === "both") {
    // Luôn thêm core logic
    const coreChunk = filteredChunks.find((c) => c.id === "core-logic")
    if (coreChunk) selected.push(coreChunk)

    if (hasAnthropometricData) {
      const anthropometricChunk = filteredChunks.find((c) => c.id === "anthropometric-rules")
      if (anthropometricChunk) selected.push(anthropometricChunk)
    }

    // Lấy top 3 chunks có điểm cao nhất (symptom + trigram)
    scoredChunks
      .filter(
        (s) =>
          s.chunk.servicePackage === "mai-hoa" &&
          s.chunk.id !== "core-logic" &&
          s.chunk.id !== "anthropometric-rules" &&
          s.score > 0,
      )
      .slice(0, 3)
      .forEach((s) => {
        if (!selected.includes(s.chunk)) {
          selected.push(s.chunk)
        }
      })

    // Thêm timing nếu còn chỗ và chưa có 5 chunks
    if (selected.length < 5) {
      const timingChunk = filteredChunks.find((c) => c.type === "timing")
      if (timingChunk && !selected.includes(timingChunk)) {
        selected.push(timingChunk)
      }
    }
  }

  if (servicePackage === "khai-huyet") {
    // Lấy top 3 chunks có điểm cao nhất cho Khai Huyệt
    scoredChunks
      .filter((s) => s.chunk.servicePackage === "khai-huyet" && s.score > 0)
      .slice(0, 3)
      .forEach((s) => selected.push(s.chunk))
  }

  let combined = selected.map((c) => c.content).join("\n\n")

  const estimatedTokens = combined.length / 3
  if (estimatedTokens > maxTokens) {
    // Tính toán chính xác số ký tự cần giữ lại
    const targetLength = maxTokens * 3
    combined = combined.substring(0, targetLength) + "\n\n[...đã rút gọn để tiết kiệm token]"
  }

  console.log(
    `[v0] Knowledge chunks selected: ${selected.length} chunks, estimated tokens: ${Math.ceil(combined.length / 3)}, package: ${servicePackage}`,
  )

  return combined
}

export function getElementFromOrgans(affectedOrgans: string[]): string[] {
  const elements: Set<string> = new Set()

  Object.entries(WU_XING_MAPPING).forEach(([element, data]) => {
    if (data.organs.some((organ) => affectedOrgans.some((a) => a.includes(organ)))) {
      elements.add(element)
    }
  })

  return Array.from(elements)
}

// Helper functions
function extractSection(content: string, startMarker: string, endMarker: string): string {
  const startIndex = content.indexOf(startMarker)
  const endIndex = content.indexOf(endMarker, startIndex)

  if (startIndex === -1) return ""
  if (endIndex === -1) return content.substring(startIndex)

  return content.substring(startIndex, endIndex).trim()
}

function extractSectionByMarker(content: string, marker: string): string {
  const regex = new RegExp(
    `${marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?(?=##\\s+[IVX]+\\.\\s+HÀNH|$)`,
    "i",
  )
  const match = content.match(regex)
  return match ? match[0].trim() : ""
}

function extractTrigramSection(content: string, trigramName: string): string {
  const regex = new RegExp(`###\\s*\\d+\\.\\s*Quẻ ${trigramName}[\\s\\S]*?(?=###|$)`, "i")
  const match = content.match(regex)
  return match ? match[0].trim() : ""
}

function extractSymptomSection(content: string, symptomName: string): string {
  const regex = new RegExp(`##\\s*${symptomName}[\\s\\S]*?(?=##|$)`, "i")
  const match = content.match(regex)
  return match ? match[0].trim() : ""
}

function summarizeHerbCatalog(catalogContent: string): string {
  // Chỉ giữ lại: Mã thuốc, Tên, Công dụng chính (bỏ chi tiết)
  const lines = catalogContent.split("\n")
  const summarized: string[] = []

  lines.forEach((line) => {
    // Giữ header
    if (line.startsWith("#") || line.startsWith("**Mã") || line.startsWith("**Tên") || line.trim() === "") {
      summarized.push(line)
    }
    // Chỉ giữ dòng chứa mã thuốc và công dụng ngắn gọn
    else if (line.match(/^[TMKHFTH]\d{3}/)) {
      const parts = line.split(":")
      if (parts.length >= 2) {
        // Cắt bớt mô tả dài, chỉ giữ 100 ký tự đầu
        const shortDesc = parts.slice(1).join(":").trim().substring(0, 100) + "..."
        summarized.push(`${parts[0]}: ${shortDesc}`)
      }
    }
  })

  return summarized.join("\n")
}
