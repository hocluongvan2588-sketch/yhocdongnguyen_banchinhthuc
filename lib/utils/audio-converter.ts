/**
 * Convert PCM audio data to WAV format for browser playback
 * PCM is raw audio data without headers - browsers need WAV format with proper headers
 */
export function pcmToWav(pcmBase64: string, sampleRate = 24000, numChannels = 1): Blob {
  // Decode base64 to binary
  const pcmData = Uint8Array.from(atob(pcmBase64), (c) => c.charCodeAt(0))

  const dataLength = pcmData.length
  const buffer = new ArrayBuffer(44 + dataLength)
  const view = new DataView(buffer)

  // WAV Header (44 bytes total)
  // Reference: http://soundfile.sapp.org/doc/WaveFormat/

  // RIFF chunk descriptor
  writeString(view, 0, "RIFF") // ChunkID
  view.setUint32(4, 36 + dataLength, true) // ChunkSize
  writeString(view, 8, "WAVE") // Format

  // fmt sub-chunk
  writeString(view, 12, "fmt ") // Subchunk1ID
  view.setUint32(16, 16, true) // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true) // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true) // NumChannels
  view.setUint32(24, sampleRate, true) // SampleRate
  view.setUint32(28, sampleRate * numChannels * 2, true) // ByteRate
  view.setUint16(32, numChannels * 2, true) // BlockAlign
  view.setUint16(34, 16, true) // BitsPerSample

  // data sub-chunk
  writeString(view, 36, "data") // Subchunk2ID
  view.setUint32(40, dataLength, true) // Subchunk2Size

  // Write PCM data
  const wavData = new Uint8Array(buffer)
  wavData.set(pcmData, 44)

  return new Blob([wavData], { type: "audio/wav" })
}

/**
 * Helper function to write string to DataView
 */
function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}

/**
 * Play audio blob in browser
 */
export function playAudio(blob: Blob): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)

    audio.onended = () => {
      URL.revokeObjectURL(url) // Clean up
      resolve()
    }

    audio.onerror = (error) => {
      URL.revokeObjectURL(url)
      reject(error)
    }

    audio.play().catch(reject)
  })
}
