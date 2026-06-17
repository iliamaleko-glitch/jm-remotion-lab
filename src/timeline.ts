export const V8_WIDTH = 1920;
export const V8_HEIGHT = 1080;
export const V8_FPS = 60;
export const V8_DURATION_IN_FRAMES = 300;

export const v8Timeline = {
  backgroundGlow: {
    start: 0,
    end: V8_DURATION_IN_FRAMES,
  },
  warmCoreWhisper: {
    start: 0,
    end: 180,
  },
  filmGrain: {
    start: 0,
    end: V8_DURATION_IN_FRAMES,
    cadenceInFrames: 3,
  },
  vignette: {
    start: 0,
    end: V8_DURATION_IN_FRAMES,
  },
  depthParticles: {
    start: 0,
    end: V8_DURATION_IN_FRAMES,
  },
} as const;
