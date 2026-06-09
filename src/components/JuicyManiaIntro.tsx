import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import './juicymania-intro.css';

const PURPLE = '#7A3CFF';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Keyhole = ({progress, pulse}: {progress: number; pulse: number}) => {
  const glow = interpolate(pulse, [0, 1], [0.35, 1], clamp);

  return (
    <div
      className="keyhole-shell"
      style={{
        opacity: progress,
        filter: `drop-shadow(0 0 ${28 + glow * 34}px rgba(122, 60, 255, ${0.2 + glow * 0.32}))`,
        transform: `scale(${0.92 + progress * 0.08})`,
      }}
    >
      <svg
        className="keyhole-outline"
        width="238"
        height="360"
        viewBox="0 0 238 360"
        aria-label="JuicyMania keyhole outline"
      >
        <path
          d="M119 12C72.06 12 34 50.06 34 97C34 126.63 49.16 152.72 72.14 167.92L44 326C42.08 336.78 50.37 347 61.32 347H176.68C187.63 347 195.92 336.78 194 326L165.86 167.92C188.84 152.72 204 126.63 204 97C204 50.06 165.94 12 119 12Z"
          fill="none"
          stroke="url(#keyholeGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          style={{
            strokeDasharray: 1,
            strokeDashoffset: 1 - progress,
          }}
        />
        <defs>
          <linearGradient id="keyholeGradient" x1="119" x2="119" y1="12" y2="347">
            <stop offset="0%" stopColor="#E8DEFF" />
            <stop offset="42%" stopColor={PURPLE} />
            <stop offset="100%" stopColor="#2C145F" />
          </linearGradient>
        </defs>
      </svg>
      <div
        className="keyhole-inner-glow"
        style={{opacity: 0.14 + glow * 0.28}}
      />
    </div>
  );
};

export const JuicyManiaIntro = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const emergence = interpolate(frame, [0, 70], [0, 1], clamp);
  const keyholeReveal = interpolate(frame, [56, 126], [0, 1], clamp);
  const pulse = (Math.sin((frame / fps) * Math.PI * 1.18) + 1) / 2;

  const cameraPush = spring({
    frame: frame - 150,
    fps,
    config: {
      damping: 34,
      stiffness: 28,
      mass: 2.1,
    },
    durationInFrames: 104,
  });

  const cameraScale = interpolate(cameraPush, [0, 1], [1, 4.35], clamp);
  const keyholeFade = interpolate(frame, [224, 252], [1, 0], clamp);
  const burst = interpolate(frame, [232, 244, 265], [0, 1, 0], clamp);
  const titleIn = interpolate(frame, [246, 282], [0, 1], clamp);
  const titleDrift = interpolate(frame, [246, 300], [24, 0], clamp);

  return (
    <AbsoluteFill className="jm-stage">
      <div
        className="ambient-vignette"
        style={{opacity: 0.16 + emergence * 0.74}}
      />
      <div
        className="purple-horizon"
        style={{
          opacity: emergence * interpolate(frame, [190, 250], [1, 0.42], clamp),
          transform: `translate(-50%, -50%) scale(${0.82 + emergence * 0.32 + cameraPush * 0.58})`,
        }}
      />
      <div
        className="cinematic-field"
        style={{
          transform: `scale(${cameraScale})`,
          opacity: keyholeFade,
        }}
      >
        <Keyhole progress={keyholeReveal} pulse={pulse} />
      </div>
      <div
        className="light-burst"
        style={{
          opacity: burst,
          transform: `translate(-50%, -50%) scale(${0.22 + burst * 1.38})`,
        }}
      />
      <div
        className="title-lockup"
        style={{
          opacity: titleIn,
          transform: `translateY(${titleDrift}px)`,
          filter: `blur(${interpolate(titleIn, [0, 1], [10, 0], clamp)}px)`,
        }}
      >
        <div className="eyebrow-line" />
        <h1>JUICYMANIA</h1>
        <p>ACCESS IS EARNED</p>
      </div>
    </AbsoluteFill>
  );
};
