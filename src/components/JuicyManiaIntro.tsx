import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import './juicymania-intro.css';

const PURPLE = '#7A3CFF';
const PURPLE_SOFT = '#BBA4FF';
const PURPLE_DEEP = '#2A1066';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const particles = Array.from({length: 30}, (_, index) => {
  const lane = index % 10;
  const depth = Math.floor(index / 10);

  return {
    id: index,
    x: 24 + lane * 6 + Math.sin(index * 1.7) * 8,
    y: 16 + ((index * 23) % 70),
    size: 1 + (index % 3) * 0.55,
    delay: index * 5,
    drift: 22 + depth * 12 + (index % 4) * 5,
    opacity: 0.08 + (index % 5) * 0.025,
  };
});

const Keyhole = ({
  progress,
  pulse,
  tension,
  threshold,
  worldShift,
}: {
  progress: number;
  pulse: number;
  tension: number;
  threshold: number;
  worldShift: number;
}) => {
  const glow = interpolate(pulse, [0, 1], [0.35, 1], clamp);
  const tensionGlow = interpolate(tension, [0, 1], [0, 1], clamp);

  return (
    <div
      className="keyhole-shell"
      style={{
        opacity: progress,
        filter: `drop-shadow(0 0 ${22 + glow * 18 + tensionGlow * 30}px rgba(122, 60, 255, ${0.2 + glow * 0.18 + tensionGlow * 0.22}))`,
        transform: `scale(${0.92 + progress * 0.08 + tensionGlow * 0.035})`,
      }}
    >
      <div className="keyhole-window">
        <div
          className="behind-world depth-back"
          style={{
            opacity: progress * (0.48 + tension * 0.22),
            transform: `translate3d(${-22 + worldShift * 34}px, ${12 - tension * 18}px, 0) scale(${1.04 + threshold * 0.32})`,
          }}
        />
        <div
          className="behind-world depth-mid"
          style={{
            opacity: progress * (0.38 + tension * 0.3),
            transform: `translate3d(${18 - worldShift * 42}px, ${-18 + tension * 22}px, 0) scale(${1.03 + threshold * 0.42})`,
          }}
        />
        <div
          className="living-light"
          style={{
            opacity: progress * (0.26 + tension * 0.38),
            transform: `translate3d(${-42 + worldShift * 84}px, ${-72 + pulse * 118}px, 0) rotate(${18 + worldShift * 8}deg)`,
          }}
        />
        <div
          className="threshold-shimmer"
          style={{
            opacity: progress * interpolate(tension, [0, 1], [0.08, 0.34], clamp),
            transform: `translateY(${24 - pulse * 48}px)`,
          }}
        />
      </div>
      <svg
        className="keyhole-outline"
        width="238"
        height="360"
        viewBox="0 0 238 360"
        aria-label="JuicyMania keyhole outline"
      >
        <path
          d="M119 12C72.06 12 34 50.06 34 97C34 126.63 49.16 152.72 72.14 167.92L44 326C42.08 336.78 50.37 347 61.32 347H176.68C187.63 347 195.92 336.78 194 326L165.86 167.92C188.84 152.72 204 126.63 204 97C204 50.06 165.94 12 119 12Z"
          fill="rgba(2, 1, 6, 0.32)"
          stroke="url(#keyholeGradient)"
          strokeWidth="6.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          style={{
            strokeDasharray: 1,
            strokeDashoffset: 1 - progress,
          }}
        />
        <path
          d="M119 35C84.21 35 56 63.21 56 98C56 119.88 67.16 139.15 84.1 150.44L61.7 324H176.3L153.9 150.44C170.84 139.15 182 119.88 182 98C182 63.21 153.79 35 119 35Z"
          fill="none"
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="1.6"
          strokeLinecap="round"
          pathLength="1"
          style={{
            opacity: progress * (0.24 + pulse * 0.22 + tension * 0.32),
            strokeDasharray: '0.08 0.92',
            strokeDashoffset: -worldShift,
          }}
        />
        <defs>
          <linearGradient id="keyholeGradient" x1="119" x2="119" y1="12" y2="347">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="34%" stopColor={PURPLE_SOFT} />
            <stop offset="62%" stopColor={PURPLE} />
            <stop offset="100%" stopColor={PURPLE_DEEP} />
          </linearGradient>
        </defs>
      </svg>
      <div
        className="keyhole-inner-glow"
        style={{
          opacity: 0.12 + glow * 0.18 + tension * 0.26,
          transform: `translate(-50%, -50%) scale(${1 + tension * 0.28 + threshold * 0.55})`,
        }}
      />
    </div>
  );
};

export const JuicyManiaIntro = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const emergence = interpolate(frame, [0, 64], [0, 1], clamp);
  const keyholeReveal = interpolate(frame, [42, 113], [0, 1], clamp);
  const livingPulse = (Math.sin((frame / fps) * Math.PI * 1.05) + 1) / 2;
  const worldShift = frame / 288;

  const tension = interpolate(frame, [110, 193], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.22, 0, 0.12, 1),
  });

  const breath = spring({
    frame: frame - 84,
    fps,
    config: {
      damping: 42,
      stiffness: 22,
      mass: 2.6,
    },
    durationInFrames: 106,
  });

  const threshold = interpolate(frame, [184, 214], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.7, 0, 1, 1),
  });

  const cameraScale = interpolate(threshold, [0, 1], [1 + breath * 0.08, 12.4], clamp);
  const cameraY = interpolate(tension, [0, 1], [0, -22], clamp);
  const fieldOpacity = interpolate(frame, [212, 230], [1, 0], clamp);
  const bloom = interpolate(frame, [207, 217, 237], [0, 1, 0], {
    ...clamp,
    easing: Easing.bezier(0.12, 0, 0.22, 1),
  });
  const crossingWash = interpolate(frame, [214, 234], [0, 1], clamp);
  const titleIn = interpolate(frame, [216, 240], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 0.84, 0.38, 1),
  });
  const titleDrift = interpolate(frame, [216, 288], [22, 0], clamp);

  return (
    <AbsoluteFill className="jm-stage">
      <div
        className="ambient-vignette"
        style={{
          opacity: 0.12 + emergence * 0.68 + tension * 0.16,
          transform: `scale(${1 + threshold * 0.48})`,
        }}
      />
      <div
        className="atmosphere-layer atmosphere-back"
        style={{
          opacity: emergence * 0.38,
          transform: `translate3d(${worldShift * -38}px, ${tension * -18}px, 0) scale(${1 + threshold * 0.32})`,
        }}
      />
      <div
        className="atmosphere-layer atmosphere-front"
        style={{
          opacity: emergence * (0.2 + tension * 0.18),
          transform: `translate3d(${worldShift * 52}px, ${tension * 16}px, 0) scale(${1 + threshold * 0.62})`,
        }}
      />
      <div
        className="particle-field"
        style={{opacity: interpolate(frame, [28, 94, 232, 252], [0, 0.62, 0.72, 0], clamp)}}
      >
        {particles.map((particle) => {
          const travel = ((frame + particle.delay) % 150) / 150;
          const zScale = 0.65 + travel * 0.75 + threshold * 1.8;

          return (
            <span
              key={particle.id}
              className="atmosphere-particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                opacity: particle.opacity * (0.4 + tension * 0.8),
                transform: `translate3d(${(travel - 0.5) * particle.drift}px, ${travel * -58}px, 0) scale(${zScale})`,
              }}
            />
          );
        })}
      </div>
      <div
        className="purple-horizon"
        style={{
          opacity: emergence * interpolate(frame, [193, 226], [0.72, 0.12], clamp),
          transform: `translate(-50%, -50%) scale(${0.82 + emergence * 0.28 + tension * 0.22 + threshold * 1.25})`,
        }}
      />
      <div
        className="cinematic-field"
        style={{
          transform: `translateY(${cameraY}px) scale(${cameraScale})`,
          opacity: fieldOpacity,
        }}
      >
        <Keyhole
          progress={keyholeReveal}
          pulse={livingPulse}
          tension={tension}
          threshold={threshold}
          worldShift={worldShift}
        />
      </div>
      <div
        className="threshold-bloom"
        style={{
          opacity: bloom,
          transform: `translate(-50%, -50%) scale(${0.18 + bloom * 2.25 + threshold * 1.6})`,
        }}
      />
      <div
        className="crossing-wash"
        style={{opacity: crossingWash * interpolate(frame, [240, 288], [0.82, 0.16], clamp)}}
      />
      <div
        className="title-lockup"
        style={{
          opacity: titleIn,
          transform: `translateY(${titleDrift}px) scale(${0.985 + titleIn * 0.015})`,
          filter: `blur(${interpolate(titleIn, [0, 1], [7, 0], clamp)}px)`,
        }}
      >
        <div className="drop-card">
          <div className="drop-kicker">DROP #001</div>
          <h1><span>CLEMENCE</span><span>AUDIARD</span></h1>
          <p>ACCESS IS EARNED</p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
