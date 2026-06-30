// Web Audio API Synthesizer for Retro Party Game Sounds
class SoundManager {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      // Support standard and older browsers
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    // Resume context if suspended (common browser security measure)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a standard retro clock tick
  playTick() {
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Play a higher pitch countdown beep
  playCountdownBeep(high = false) {
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(high ? 1200 : 600, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (high ? 0.4 : 0.25));
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + (high ? 0.45 : 0.3));
  }

  // Play a pleasant double-blip correct ding
  playCorrect() {
    this.init();
    if (!this.ctx) return;

    const playTone = (freq: number, delay: number, duration: number) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
      
      gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration + 0.05);
    };

    // Nice arpeggio (C5 then E5)
    playTone(523.25, 0, 0.15); // C5
    playTone(659.25, 0.08, 0.3); // E5
  }

  // Play a buzzer sound for skipped words
  playSkip() {
    this.init();
    if (!this.ctx) return;
    
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc1.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.25);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(153, this.ctx.currentTime);
    osc2.frequency.linearRampToValueAtTime(103, this.ctx.currentTime + 0.25);
    
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.26);
    osc2.stop(this.ctx.currentTime + 0.26);
  }

  // Play a dramatic mafia-style heavy sweep when time is up or turn ends
  playTimeUp() {
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const noise = this.ctx.createOscillator(); // we use a square for texture
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(55, this.ctx.currentTime + 0.8);

    noise.type = 'square';
    noise.frequency.setValueAtTime(110, this.ctx.currentTime);
    noise.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.8);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.9);
    
    osc.connect(gain);
    noise.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    noise.start();
    osc.stop(this.ctx.currentTime + 1.0);
    noise.stop(this.ctx.currentTime + 1.0);
  }

  // Play a beautiful metallic victory gong
  playVictory() {
    this.init();
    if (!this.ctx) return;

    const playTone = (freq: number, dur: number, vol: number) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + dur + 0.05);
    };

    // Major Chord chime
    playTone(261.63, 1.5, 0.15); // C4
    playTone(329.63, 1.5, 0.12); // E4
    playTone(392.00, 1.5, 0.12); // G4
    playTone(523.25, 2.0, 0.10); // C5
  }
}

export const sounds = new SoundManager();
