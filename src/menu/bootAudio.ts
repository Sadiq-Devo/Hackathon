// Synthesized retro PC boot sound via Web Audio API.
// CRT thunk + ascending startup chime + sustained PSU hum.

let ctxSingleton: AudioContext | null = null

function getContext (): AudioContext {
  if (!ctxSingleton) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctxSingleton = new Ctor()
  }
  if (ctxSingleton.state === 'suspended') void ctxSingleton.resume()
  return ctxSingleton
}

export function playBootSound () {
  const ctx = getContext()
  const now = ctx.currentTime
  const master = ctx.createGain()
  master.gain.value = 0.7
  master.connect(ctx.destination)

  // 1. CRT power thunk — short low-frequency burst
  const thunk = ctx.createOscillator()
  const thunkGain = ctx.createGain()
  thunk.type = 'square'
  thunk.frequency.setValueAtTime(80, now)
  thunk.frequency.exponentialRampToValueAtTime(40, now + 0.08)
  thunkGain.gain.setValueAtTime(0.45, now)
  thunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
  thunk.connect(thunkGain).connect(master)
  thunk.start(now)
  thunk.stop(now + 0.13)

  // 2. Ascending boot chime — F major arpeggio (F4, A4, C5, F5)
  const notes = [349.23, 440.0, 523.25, 698.46]
  notes.forEach((freq, i) => {
    const start = now + 0.18 + i * 0.085
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(0.18, start + 0.025)
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55)
    osc.connect(gain).connect(master)
    osc.start(start)
    osc.stop(start + 0.6)
  })

  // 3. Sustained CRT/PSU hum that fades in then out
  const hum = ctx.createOscillator()
  const humGain = ctx.createGain()
  hum.type = 'sawtooth'
  hum.frequency.value = 95
  humGain.gain.setValueAtTime(0, now)
  humGain.gain.linearRampToValueAtTime(0.035, now + 0.5)
  humGain.gain.linearRampToValueAtTime(0.025, now + 1.4)
  humGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0)
  hum.connect(humGain).connect(master)
  hum.start(now)
  hum.stop(now + 2.1)
}

export function playClickSound () {
  const ctx = getContext()
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(1500, now)
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.04)
  gain.gain.setValueAtTime(0.12, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
  osc.connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.06)
}
