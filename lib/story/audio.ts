/**
 * STORY AUDIO — synthesised, not sampled.
 *
 * There are no audio files in this project and none are needed: the score is
 * generated live in the Web Audio graph, and the narration is spoken by the
 * browser's own speech engine. That gives a cinematic bed and a talking
 * narrator with zero bytes of media to download, host or license.
 *
 * Two halves:
 *
 *  1. A small orchestral-ish synth (sub bass, detuned saw pad, plucked arp,
 *     sine lead, noise percussion) run by a lookahead scheduler. Each chapter
 *     supplies a "mood" — key, tempo, chord progression, instrument mix — and
 *     the engine crossfades between them.
 *
 *  2. `speechSynthesis` narration. Its `onboundary` events report the character
 *     index currently being spoken, which drives the caption typewriter, so the
 *     text tracks the voice instead of guessing at it.
 *
 * Everything is constructed inside `unlock()`, which only ever runs from a user
 * gesture, because browsers refuse to start audio any other way.
 */

const MUTE_KEY = "story:muted";
const MUSIC_LEVEL = 0.24;
const DUCKED_LEVEL = 0.075;

type Listener = () => void;

type Mood = {
  bpm: number;
  /** MIDI note of the tonic for the chord voicing. */
  root: number;
  /** Chord shapes as semitone offsets from the tonic. */
  progression: number[][];
  pad: number;
  bass: number;
  arp: number;
  lead: number;
  perc: number;
  /** Base lowpass cutoff for the pad, in Hz. */
  colour: number;
};

/** i - VI - III - VII. The "setting out on a journey" progression. */
const ADVENTURE = [
  [0, 3, 7, 12],
  [-4, 0, 3, 8],
  [3, 7, 10, 15],
  [-2, 2, 5, 10],
];

/** I - V - vi - IV. Warm, resolved, domestic. */
const WARM = [
  [0, 4, 7, 12],
  [7, 11, 14, 19],
  [-3, 0, 4, 9],
  [5, 9, 12, 17],
];

export const MOODS: Record<string, Mood> = {
  // Dawn on the balcony - hopeful, wide, unhurried.
  dawn: { bpm: 82, root: 57, progression: ADVENTURE, pad: 0.9, bass: 0.8, arp: 0.5, lead: 0.55, perc: 0.35, colour: 1300 },
  // The room - close, warm, almost still.
  room: { bpm: 70, root: 53, progression: WARM, pad: 1, bass: 0.6, arp: 0.34, lead: 0.3, perc: 0.12, colour: 900 },
  // The lab - driving, curious, the most "quest" of the four.
  lab: { bpm: 100, root: 50, progression: ADVENTURE, pad: 0.7, bass: 0.95, arp: 1, lead: 0.5, perc: 0.85, colour: 1900 },
  // The platform at dusk - big, resolving, a little wistful.
  dusk: { bpm: 66, root: 48, progression: WARM, pad: 1, bass: 0.75, arp: 0.42, lead: 0.8, perc: 0.2, colour: 1150 },
};

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

const LOOKAHEAD_S = 0.12;
const TICK_MS = 25;
/** Sixteenth notes per bar. */
const STEPS_PER_BAR = 16;

class StoryAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private music: GainNode | null = null;
  private send: GainNode | null = null;
  private noise: AudioBuffer | null = null;

  private timer: number | null = null;
  private step = 0;
  private nextNoteAt = 0;
  private mood: Mood = MOODS.dawn;
  private moodKey = "dawn";

  private voices: SpeechSynthesisVoice[] = [];
  private listeners = new Set<Listener>();

  enabled = false;
  muted = false;
  speechAvailable = false;

  constructor() {
    if (typeof window === "undefined") return;
    this.muted = window.localStorage.getItem(MUTE_KEY) === "1";
    this.speechAvailable = "speechSynthesis" in window;
    if (this.speechAvailable) {
      const load = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
      load();
      window.speechSynthesis.onvoiceschanged = load;
    }
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private emit() {
    this.listeners.forEach((fn) => fn());
  }

  // -- graph ---------------------------------------------------------------

  /** Must be called from a user gesture. */
  async unlock(): Promise<boolean> {
    if (this.enabled) return true;
    try {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctor();
      await ctx.resume();

      const master = ctx.createGain();
      master.gain.value = this.muted ? 0.0001 : 1;
      master.connect(ctx.destination);

      const music = ctx.createGain();
      music.gain.value = MUSIC_LEVEL;
      music.connect(master);

      // Convolution reverb from a procedurally generated impulse. This is what
      // stops the synth sounding like a ringtone and starts it sounding like a
      // room the character is standing in.
      const reverb = ctx.createConvolver();
      reverb.buffer = this.impulse(ctx, 2.6, 2.4);
      const send = ctx.createGain();
      send.gain.value = 0.34;
      send.connect(reverb);
      reverb.connect(master);

      this.ctx = ctx;
      this.master = master;
      this.music = music;
      this.send = send;
      this.noise = this.noiseBuffer(ctx);
      this.enabled = true;

      this.nextNoteAt = ctx.currentTime + 0.08;
      this.step = 0;
      this.timer = window.setInterval(() => this.schedule(), TICK_MS);
      this.emit();
      return true;
    } catch {
      this.enabled = false;
      return false;
    }
  }

  private impulse(ctx: AudioContext, seconds: number, decay: number) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c += 1) {
      const data = buf.getChannelData(c);
      for (let i = 0; i < len; i += 1) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  private noiseBuffer(ctx: AudioContext) {
    const len = Math.floor(ctx.sampleRate * 1.2);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  // -- voices --------------------------------------------------------------

  private env(gain: GainNode, at: number, peak: number, attack: number, dur: number) {
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.linearRampToValueAtTime(peak, at + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  }

  private padVoice(freqs: number[], at: number, dur: number, level: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    const filt = ctx.createBiquadFilter();
    filt.type = "lowpass";
    filt.Q.value = 1.6;
    filt.frequency.setValueAtTime(this.mood.colour * 0.35, at);
    filt.frequency.linearRampToValueAtTime(this.mood.colour, at + dur * 0.55);
    filt.frequency.linearRampToValueAtTime(this.mood.colour * 0.4, at + dur);

    const g = ctx.createGain();
    this.env(g, at, level, dur * 0.4, dur);
    filt.connect(g);
    g.connect(this.music as GainNode);
    g.connect(this.send as GainNode);

    freqs.forEach((f, i) => {
      [1, 1.006, 0.995].forEach((detune, d) => {
        const o = ctx.createOscillator();
        o.type = d === 2 ? "triangle" : "sawtooth";
        o.frequency.value = f * detune;
        o.connect(filt);
        o.start(at + i * 0.012);
        o.stop(at + dur + 0.2);
      });
    });
  }

  private bassVoice(freq: number, at: number, dur: number, level: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.setValueAtTime(freq, at);
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = freq / 2;
    const g = ctx.createGain();
    this.env(g, at, level, 0.02, dur);
    o.connect(g);
    sub.connect(g);
    g.connect(this.music as GainNode);
    o.start(at);
    sub.start(at);
    o.stop(at + dur + 0.05);
    sub.stop(at + dur + 0.05);
  }

  private pluck(freq: number, at: number, level: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = freq;
    const filt = ctx.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.setValueAtTime(4200, at);
    filt.frequency.exponentialRampToValueAtTime(700, at + 0.4);
    const g = ctx.createGain();
    this.env(g, at, level, 0.006, 0.5);
    o.connect(filt);
    filt.connect(g);
    g.connect(this.music as GainNode);
    g.connect(this.send as GainNode);
    o.start(at);
    o.stop(at + 0.6);
  }

  private leadVoice(freq: number, at: number, dur: number, level: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = freq;
    // A little vibrato is the difference between "a note" and "an instrument".
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 5.2;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = freq * 0.006;
    lfo.connect(lfoGain);
    lfoGain.connect(o.frequency);

    const g = ctx.createGain();
    this.env(g, at, level, dur * 0.25, dur);
    o.connect(g);
    g.connect(this.music as GainNode);
    g.connect(this.send as GainNode);
    o.start(at);
    lfo.start(at);
    o.stop(at + dur + 0.1);
    lfo.stop(at + dur + 0.1);
  }

  private percVoice(kind: "kick" | "hat" | "snare", at: number, level: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    if (kind === "kick") {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(140, at);
      o.frequency.exponentialRampToValueAtTime(44, at + 0.14);
      const g = ctx.createGain();
      this.env(g, at, level, 0.004, 0.3);
      o.connect(g);
      g.connect(this.music as GainNode);
      o.start(at);
      o.stop(at + 0.32);
      return;
    }
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const filt = ctx.createBiquadFilter();
    if (kind === "hat") {
      filt.type = "highpass";
      filt.frequency.value = 7200;
    } else {
      filt.type = "bandpass";
      filt.frequency.value = 1750;
      filt.Q.value = 0.8;
    }
    const g = ctx.createGain();
    this.env(g, at, level, 0.002, kind === "hat" ? 0.06 : 0.22);
    src.connect(filt);
    filt.connect(g);
    g.connect(this.music as GainNode);
    if (kind === "snare") g.connect(this.send as GainNode);
    src.start(at);
    src.stop(at + 0.35);
  }

  // -- scheduler -----------------------------------------------------------

  /**
   * Lookahead scheduling: a coarse setInterval decides WHAT plays, but every
   * note is stamped with an exact AudioContext time. Timer jitter therefore
   * never reaches the music. This is the standard fix for JS-driven audio.
   */
  private schedule() {
    const ctx = this.ctx;
    if (!ctx) return;
    const stepDur = 60 / this.mood.bpm / 4;

    while (this.nextNoteAt < ctx.currentTime + LOOKAHEAD_S) {
      this.playStep(this.step, this.nextNoteAt, stepDur);
      this.nextNoteAt += stepDur;
      this.step += 1;
    }
  }

  private playStep(step: number, at: number, stepDur: number) {
    const m = this.mood;
    const bar = Math.floor(step / STEPS_PER_BAR);
    const inBar = step % STEPS_PER_BAR;
    const chord = m.progression[bar % m.progression.length];
    const barDur = stepDur * STEPS_PER_BAR;

    if (inBar === 0) {
      this.padVoice(
        chord.map((s) => midi(m.root + s)),
        at,
        barDur * 0.98,
        0.08 * m.pad,
      );
      this.bassVoice(midi(m.root + chord[0] - 24), at, barDur * 0.5, 0.34 * m.bass);
      if (bar % 2 === 1 && m.lead > 0.2) {
        this.leadVoice(midi(m.root + chord[2] + 12), at + stepDur * 2, barDur * 0.7, 0.06 * m.lead);
      }
    }
    if (inBar === 8) {
      this.bassVoice(midi(m.root + chord[0] - 24), at, barDur * 0.3, 0.24 * m.bass);
    }

    // Arpeggio - climbs and falls across the bar.
    if (m.arp > 0.15 && inBar % 2 === 0) {
      const seq = [0, 1, 2, 3, 2, 1, 3, 2];
      const note = chord[seq[(inBar / 2) % seq.length] % chord.length];
      this.pluck(midi(m.root + note + 12), at, 0.055 * m.arp);
    }

    if (m.perc > 0.1) {
      if (inBar === 0 || inBar === 6 || inBar === 10) this.percVoice("kick", at, 0.3 * m.perc);
      if (inBar === 4 || inBar === 12) this.percVoice("snare", at, 0.14 * m.perc);
      if (inBar % 2 === 1) this.percVoice("hat", at, 0.05 * m.perc);
    }
  }

  /** Crossfade to a chapter's mood. */
  setMood(key: string) {
    if (!this.enabled || key === this.moodKey || !MOODS[key]) return;
    this.moodKey = key;
    const ctx = this.ctx;
    const music = this.music;
    if (!ctx || !music) return;

    const now = ctx.currentTime;
    music.gain.cancelScheduledValues(now);
    music.gain.setValueAtTime(Math.max(music.gain.value, 0.0001), now);
    music.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    window.setTimeout(() => {
      if (!this.ctx || !this.music) return;
      this.mood = MOODS[key];
      // Re-align to a bar so the new key never enters mid-phrase.
      this.step = 0;
      this.nextNoteAt = Math.max(this.nextNoteAt, this.ctx.currentTime + 0.05);
      const t = this.ctx.currentTime;
      this.music.gain.cancelScheduledValues(t);
      this.music.gain.setValueAtTime(0.0001, t);
      this.music.gain.linearRampToValueAtTime(MUSIC_LEVEL, t + 1.1);
    }, 520);
  }

  private duck(on: boolean) {
    if (!this.enabled || !this.ctx || !this.music) return;
    const t = this.ctx.currentTime;
    const g = this.music.gain;
    g.cancelScheduledValues(t);
    g.setValueAtTime(Math.max(g.value, 0.0001), t);
    g.linearRampToValueAtTime(on ? DUCKED_LEVEL : MUSIC_LEVEL, t + 0.45);
  }

  // -- one-shots -----------------------------------------------------------

  sfx(kind: "hover" | "open" | "close" | "blocked" | "unlock" | "step") {
    if (!this.enabled || this.muted || !this.ctx) return;
    const ctx = this.ctx;
    const at = ctx.currentTime + 0.005;
    const tone = (freq: number, dur: number, level: number, type: OscillatorType = "sine") => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.setValueAtTime(freq, at);
      const g = ctx.createGain();
      this.env(g, at, level, 0.005, dur);
      o.connect(g);
      g.connect(this.master as GainNode);
      g.connect(this.send as GainNode);
      o.start(at);
      o.stop(at + dur + 0.05);
    };

    switch (kind) {
      case "hover":
        tone(1180, 0.12, 0.05, "triangle");
        break;
      case "open":
        tone(660, 0.3, 0.09, "triangle");
        tone(990, 0.34, 0.05, "sine");
        break;
      case "close":
        tone(420, 0.18, 0.06, "triangle");
        break;
      case "blocked": {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.setValueAtTime(150, at);
        o.frequency.exponentialRampToValueAtTime(70, at + 0.18);
        const g = ctx.createGain();
        this.env(g, at, 0.11, 0.004, 0.24);
        o.connect(g);
        g.connect(this.master as GainNode);
        o.start(at);
        o.stop(at + 0.3);
        break;
      }
      case "unlock":
        [523, 659, 784, 1047].forEach((f, i) => {
          const o = ctx.createOscillator();
          o.type = "triangle";
          o.frequency.value = f;
          const g = ctx.createGain();
          this.env(g, at + i * 0.07, 0.07, 0.006, 0.5);
          o.connect(g);
          g.connect(this.master as GainNode);
          g.connect(this.send as GainNode);
          o.start(at + i * 0.07);
          o.stop(at + i * 0.07 + 0.6);
        });
        break;
      case "step": {
        const src = ctx.createBufferSource();
        src.buffer = this.noise;
        const filt = ctx.createBiquadFilter();
        filt.type = "bandpass";
        filt.frequency.value = 420;
        filt.Q.value = 1.4;
        const g = ctx.createGain();
        this.env(g, at, 0.035, 0.002, 0.09);
        src.connect(filt);
        filt.connect(g);
        g.connect(this.master as GainNode);
        src.start(at);
        src.stop(at + 0.14);
        break;
      }
    }
  }

  // -- narration -----------------------------------------------------------

  private pickVoice(narrator: boolean) {
    const en = this.voices.filter((v) => v.lang.startsWith("en"));
    if (!en.length) return null;
    // Prefer the fuller "natural"/"Google" voices when the platform has them.
    const nice = en.filter((v) => /natural|google|premium|enhanced/i.test(v.name));
    const pool = nice.length ? nice : en;
    return narrator ? pool[pool.length - 1] : pool[0];
  }

  /**
   * Speak a line. `onBoundary` reports how many characters have been spoken,
   * which drives the caption typewriter so the text tracks the voice instead of
   * racing it. Returns false when speech is unavailable, and the caller falls
   * back to a reading-speed timer.
   */
  speak(
    text: string,
    narrator: boolean,
    handlers: { onBoundary?: (charIndex: number) => void; onEnd?: () => void },
  ): boolean {
    if (!this.speechAvailable || this.muted || !this.enabled) return false;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const voice = this.pickVoice(narrator);
      if (voice) u.voice = voice;
      u.lang = voice?.lang ?? "en-US";
      u.rate = narrator ? 0.92 : 0.98;
      u.pitch = narrator ? 0.82 : 1.06;
      u.volume = 1;
      u.onboundary = (e) => handlers.onBoundary?.(e.charIndex);
      u.onend = () => {
        this.duck(false);
        handlers.onEnd?.();
      };
      u.onerror = () => {
        this.duck(false);
        handlers.onEnd?.();
      };
      this.duck(true);
      window.speechSynthesis.speak(u);
      return true;
    } catch {
      this.duck(false);
      return false;
    }
  }

  cancelSpeech() {
    if (!this.speechAvailable) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* nothing to do */
    }
    this.duck(false);
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
    }
    if (this.master && this.ctx) {
      const t = this.ctx.currentTime;
      const g = this.master.gain;
      g.cancelScheduledValues(t);
      g.setValueAtTime(Math.max(g.value, 0.0001), t);
      g.linearRampToValueAtTime(muted ? 0.0001 : 1, t + 0.3);
    }
    if (muted) this.cancelSpeech();
    this.emit();
  }

  dispose() {
    this.cancelSpeech();
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
    this.ctx?.close().catch(() => {});
    this.ctx = null;
    this.enabled = false;
  }
}

/** Module-level singleton - one audio graph for the whole story. */
export const narrationBus = new StoryAudio();
