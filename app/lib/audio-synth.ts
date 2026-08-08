/**
 * Web Audio API synthesizer for ambient soundscapes (heartbeats, breathing, ui clicks)
 * No external MP3 files needed; completely self-contained & lightweight.
 */
class AnatomyAudioSynth {
  private ctx: AudioContext | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private activeInterval: number | null = null;
  private isMuted = true;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAmbient();
    }
    return this.isMuted;
  }

  public get muted(): boolean {
    return this.isMuted;
  }

  public playHeartbeat(bpm = 72) {
    this.init();
    if (this.isMuted || !this.ctx) return;
    this.stopAmbient();

    const intervalMs = (60 / bpm) * 1000;
    const triggerBeat = () => {
      if (this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      // Lub
      this.synthThump(now, 70, 0.12, 0.8);
      // Dub
      this.synthThump(now + 0.14, 55, 0.1, 0.6);
    };

    triggerBeat();
    this.activeInterval = window.setInterval(triggerBeat, intervalMs);
  }

  private synthThump(time: number, freq: number, duration: number, volume: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + duration);

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  public playBreathing() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    this.stopAmbient();

    const cycleMs = 4000;
    const triggerBreathe = () => {
      if (this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      // Inhale
      this.synthNoise(now, 1.8, 0.15, "lowpass");
      // Exhale
      this.synthNoise(now + 2.0, 1.8, 0.12, "bandpass");
    };

    triggerBreathe();
    this.activeInterval = window.setInterval(triggerBreathe, cycleMs);
  }

  private synthNoise(time: number, duration: number, volume: number, filterType: BiquadFilterType) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(300, time);
    filter.frequency.exponentialRampToValueAtTime(800, time + duration * 0.5);
    filter.frequency.exponentialRampToValueAtTime(200, time + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(volume, time + duration * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(time);
    noise.stop(time + duration);
  }

  public playClick() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  public stopAmbient() {
    if (this.activeInterval !== null) {
      clearInterval(this.activeInterval);
      this.activeInterval = null;
    }
  }

  public speakText(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel(); // Stop prior speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

export const audioSynth = new AnatomyAudioSynth();
