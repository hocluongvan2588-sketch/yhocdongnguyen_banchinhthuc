/**
 * Script để test AI diagnosis system
 * Chạy: npx tsx scripts/test-ai-diagnosis.ts
 */

import { diagnoseWithAI } from "../lib/ai/diagnosis-with-ai"

async function testDiagnosis() {
  console.log("🧪 Testing AI Diagnosis System...\n")

  const testCases = [
    {
      name: "Đau đầu gối",
      params: {
        upperTrigram: 1, // Càn
        lowerTrigram: 6, // Khảm
        movingLine: 3,
        healthConcern: "đau đầu gối khi lên xuống cầu thang",
        currentMonth: 2,
        transformedUpper: 1,
        transformedLower: 5,
      },
    },
    {
      name: "Đau đầu",
      params: {
        upperTrigram: 3, // Ly
        lowerTrigram: 4, // Chấn
        movingLine: 5,
        healthConcern: "đau đầu và chóng mặt",
        currentMonth: 6,
        transformedUpper: 2,
        transformedLower: 4,
      },
    },
  ]

  for (const testCase of testCases) {
    console.log(`\n${"=".repeat(60)}`)
    console.log(`Test Case: ${testCase.name}`)
    console.log("=".repeat(60))

    try {
      const result = await diagnoseWithAI(testCase.params)

      console.log(`\n✅ Used AI: ${result.usedAI}`)
      console.log(`\n📝 Summary:\n${result.aiInterpretation.summary}`)
      console.log(`\n🔬 Mechanism:\n${result.aiInterpretation.mechanism.substring(0, 200)}...`)
      console.log(`\n💊 Immediate Advice:\n${result.aiInterpretation.immediateAdvice.substring(0, 200)}...`)

      // Kiểm tra fallback
      if (!result.usedAI) {
        console.log("\n⚠️  Warning: AI failed, used fallback logic")
      }
    } catch (error) {
      console.error(`\n❌ Error:`, error)
    }
  }

  console.log(`\n${"=".repeat(60)}`)
  console.log("✨ Test completed!")
  console.log("=".repeat(60))
}

testDiagnosis()
