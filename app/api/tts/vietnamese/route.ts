import { NextRequest, NextResponse } from "next/server"

// Declare global __api_key provided by v0 runtime
declare global {
  var __api_key: string | undefined
}

// Gemini TTS endpoint - using model gemini-2.5-flash-preview-tts
const GEMINI_TTS_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent"

export async function POST(request: NextRequest) {
  try {
    const { numbers, type = "numbers" } = await request.json()

    if (!numbers || !Array.isArray(numbers)) {
      return NextResponse.json({ error: "Invalid numbers array" }, { status: 400 })
    }

    // Convert numbers to Vietnamese words
    const numberMap: Record<string, string> = {
      "0": "Không",
      "1": "Một",
      "2": "Hai",
      "3": "Ba",
      "4": "Bốn",
      "5": "Năm",
      "6": "Sáu",
      "7": "Bảy",
      "8": "Tám",
      "9": "Chín",
    }

    const vietnameseNumbers = numbers.map((num) => numberMap[num] || num)

    // Format text based on type
    let textToRead: string
    if (type === "guided") {
      // Guided meditation intro with the numbers
      textToRead = `Thả lỏng. Niệm theo chuông. ${vietnameseNumbers.join(". ")}. Hãy để âm thanh chữa lành tâm hồn bạn.`
    } else {
      // Simple number reading
      textToRead = vietnameseNumbers.join(". ") + ". Hãy tập trung vào hơi thở."
    }

    console.log("[v0] Generating Gemini TTS for:", textToRead)

    // Get API key - hardcoded as provided by user
    const apiKey = "AIzaSyCV7ggoECGQQnucF2qjv2dxr5KfgUCBS-E"

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured." },
        { status: 500 }
      )
    }

    // Call Gemini TTS API with Aoede voice (female, warm, slow - perfect for meditation)
    const response = await fetch(`${GEMINI_TTS_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Say in a peaceful, gentle female Vietnamese voice: ${textToRead}`
          }]
        }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Aoede" // Female, warm, slow voice - perfect for meditation
              }
            }
          }
        }
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] Gemini TTS error:", error)
      return NextResponse.json(
        { error: `Gemini TTS failed: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Extract audio data from Gemini response
    const audioData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData

    if (!audioData || !audioData.data) {
      console.error("[v0] No audio data received:", data)
      return NextResponse.json({ error: "No audio data received from TTS API" }, { status: 500 })
    }

    // Return base64 PCM audio data (will be converted to WAV on client)
    return NextResponse.json({
      audioData: audioData.data,
      mimeType: audioData.mimeType || "audio/pcm",
      success: true,
    })
  } catch (error) {
    console.error("[v0] TTS API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
