/**
 * Meditation Bell Sound Generator using Web Audio API
 * Creates a peaceful bell sound using F# (370 Hz) frequency with harmonics
 */

export class MeditationBell {
  private audioContext: AudioContext | null = null

  constructor() {
    // Initialize AudioContext only when needed
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  /**
   * Play meditation bell sound
   * @param volume - Volume level (0-1)
   */
  async play(volume: number = 0.3): Promise<void> {
    if (!this.audioContext) return

    const now = this.audioContext.currentTime

    // Create gain node for volume control
    const gainNode = this.audioContext.createGain()
    gainNode.connect(this.audioContext.destination)

    // F# (Fa thăng) base frequency - used in singing bowls
    const baseFrequency = 370 // Hz

    // Create multiple harmonics for richer bell sound
    const harmonics = [
      { freq: baseFrequency, gain: 1.0 },       // Fundamental
      { freq: baseFrequency * 2, gain: 0.4 },   // 2nd harmonic
      { freq: baseFrequency * 3, gain: 0.2 },   // 3rd harmonic
      { freq: baseFrequency * 4.2, gain: 0.15 }, // Inharmonic (bell characteristic)
      { freq: baseFrequency * 5.4, gain: 0.1 },  // Inharmonic
    ]

    // Create oscillators for each harmonic
    harmonics.forEach((harmonic, index) => {
      const oscillator = this.audioContext!.createOscillator()
      const harmonicGain = this.audioContext!.createGain()

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(harmonic.freq, now)

      // Attack-Decay-Sustain-Release envelope
      harmonicGain.gain.setValueAtTime(0, now)
      harmonicGain.gain.linearRampToValueAtTime(
        harmonic.gain * volume,
        now + 0.01 // Fast attack
      )
      harmonicGain.gain.exponentialRampToValueAtTime(
        harmonic.gain * volume * 0.3,
        now + 0.3 // Decay
      )
      harmonicGain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 3.0 // Long release for bell resonance
      )

      oscillator.connect(harmonicGain)
      harmonicGain.connect(gainNode)

      oscillator.start(now)
      oscillator.stop(now + 3.0)
    })

    // Wait for sound to complete
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 3000)
    })
  }

  /**
   * Play opening bell (slightly longer and louder)
   */
  async playOpening(): Promise<void> {
    return this.play(0.5)
  }

  /**
   * Play tap bell (shorter and softer)
   */
  async playTap(): Promise<void> {
    return this.play(0.2)
  }

  /**
   * Play completion bell (celebratory)
   */
  async playCompletion(): Promise<void> {
    if (!this.audioContext) return

    // Play three bells in sequence for celebration
    await this.play(0.4)
    await new Promise((resolve) => setTimeout(resolve, 500))
    await this.play(0.4)
    await new Promise((resolve) => setTimeout(resolve, 500))
    await this.play(0.5)
  }

  /**
   * Clean up audio context
   */
  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }
}

// Singleton instance
let bellInstance: MeditationBell | null = null

export function getMeditationBell(): MeditationBell {
  if (!bellInstance) {
    bellInstance = new MeditationBell()
  }
  return bellInstance
}
