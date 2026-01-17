import fs from "fs"
import path from "path"

export interface KnowledgeChunk {
  id: string
  content: string
  type: "core" | "symptom" | "timing" | "treatment"
  relevantSymptoms?: string[]
  relevantOrgans?: string[]
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

    const chunks: KnowledgeChunk[] = []

    // Chunk 1: Core logic (luôn cần)
    const coreSection = extractSection(maiHoaCore, "LOGIC CHẨN ĐOÁN CỐT LÕI", "8 QUẺ THUẦN VÀ BỘ PHẬN")
    chunks.push({
      id: "core-logic",
      content: coreSection,
      type: "core",
    })

    chunks.push({
      id: "anthropometric-rules",
      content: anthropometricRules,
      type: "core",
    })

    // Chunk 2: 8 quẻ thuần (chia nhỏ theo quẻ)
    const trigramSections = [
      { name: "Càn", organs: ["đầu", "xương", "phổi", "đại tràng"] },
      { name: "Đoài", organs: ["miệng", "họng", "phổi"] },
      { name: "Ly", organs: ["mắt", "tim", "ruột non"] },
      { name: "Chấn", organs: ["chân", "gan", "mật"] },
      { name: "Tốn", organs: ["tay", "gan", "ruột"] },
      { name: "Khảm", organs: ["tai", "thận", "bàng quang"] },
      { name: "Cấn", organs: ["tay", "mũi", "tỳ", "vì"] },
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
        })
      }
    })

    // Chunk 3: Phân tích theo mùa
    const timingSection = extractSection(maiHoaCore, "PHÂN TÍCH THEO MÙA", "THỜI ĐIỂM HỒI PHỤC")
    chunks.push({
      id: "timing",
      content: timingSection,
      type: "timing",
    })

    // Chunk 4: Phân tích triệu chứng cụ thể
    const symptomSections = ["ĐAU ĐẦU", "ĐAU ĐẦU GỐI", "MẤT NGỦ", "ĐAU DẠ DÀY", "HO KHAN", "ĐAU RĂNG"]

    symptomSections.forEach((symptom) => {
      const section = extractSymptomSection(symptomAnalysis, symptom)
      if (section) {
        chunks.push({
          id: `symptom-${symptom.toLowerCase().replace(/\s+/g, "-")}`,
          content: section,
          type: "symptom",
          relevantSymptoms: [symptom.toLowerCase()],
        })
      }
    })

    knowledgeChunksCache = chunks
    knowledgeCacheTime = now

    return chunks
  } catch (error) {
    console.error("[v0] Failed to parse knowledge base:", error)
    return []
  }
}

export function selectRelevantChunks(
  healthConcern: string,
  affectedOrgans: string[],
  hasAnthropometricData = false,
  maxTokens = 2000,
): string {
  const chunks = parseKnowledgeBase()
  const selected: KnowledgeChunk[] = []

  // Luôn thêm core logic
  const coreChunk = chunks.find((c) => c.id === "core-logic")
  if (coreChunk) selected.push(coreChunk)

  if (hasAnthropometricData) {
    const anthropometricChunk = chunks.find((c) => c.id === "anthropometric-rules")
    if (anthropometricChunk) selected.push(anthropometricChunk)
  }

  // Thêm chunks liên quan đến triệu chứng
  const concernLower = healthConcern.toLowerCase()
  const relevantSymptomKeywords = Object.keys(SYMPTOM_TO_ORGANS).filter((keyword) => concernLower.includes(keyword))

  // Thêm symptom analysis cho triệu chứng cụ thể
  chunks
    .filter(
      (c) =>
        c.type === "symptom" && c.relevantSymptoms?.some((s) => relevantSymptomKeywords.some((k) => s.includes(k))),
    )
    .forEach((c) => selected.push(c))

  // Thêm trigram chunks liên quan đến cơ quan bị ảnh hưởng
  chunks
    .filter(
      (c) => c.type === "core" && c.relevantOrgans?.some((organ) => affectedOrgans.some((a) => a.includes(organ))),
    )
    .forEach((c) => {
      if (!selected.includes(c)) selected.push(c)
    })

  // Thêm timing nếu còn chỗ
  const timingChunk = chunks.find((c) => c.type === "timing")
  if (timingChunk && !selected.includes(timingChunk)) {
    selected.push(timingChunk)
  }

  // Ghép lại và giới hạn độ dài
  let combined = selected.map((c) => c.content).join("\n\n")

  // Estimate ~4 chars per token
  if (combined.length > maxTokens * 4) {
    combined = combined.substring(0, maxTokens * 4) + "\n\n[...phần còn lại đã được rút gọn]"
  }

  return combined
}

// Helper functions
function extractSection(content: string, startMarker: string, endMarker: string): string {
  const startIndex = content.indexOf(startMarker)
  const endIndex = content.indexOf(endMarker, startIndex)

  if (startIndex === -1) return ""
  if (endIndex === -1) return content.substring(startIndex)

  return content.substring(startIndex, endIndex).trim()
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
