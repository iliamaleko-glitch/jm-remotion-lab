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
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const dust = Array.from({length: 18}, (_, index) => ({
  id: index,
  x: 28 + ((index * 17) % 46) + Math.sin(index * 1.91) * 6,
  y: 18 + ((index * 31) % 62),
  size: 0.7 + (index % 3) * 0.38,
  delay: index * 19,
  drift: 8 + (index % 5) * 6,
  depth: 0.56 + (index % 4) * 0.14,
  opacity: 0.045 + (index % 4) * 0.014,
}));

const KeyholeGateway = ({
  reveal,
  awakening,
  approach,
  crossing,
  pulse,
  worldTime,
}: {
  reveal: number;
  awakening: number;
  approach: number;
  crossing: number;
  pulse: number;
  worldTime: number;
}) => {
  const rimAlive = interpolate(awakening, [0, 1], [0.16, 0.62], clamp);
  const rimOpacity = interpolate(crossing, [0.66, 1], [1, 0], clamp);
  const apertureScale = 0.94 + reveal * 0.04 + awakening * 0.05 + crossing * 2.65;

  return (
    <div
      className="gateway"
      style={{
        opacity: reveal * rimOpacity,
        transform: `translate3d(0, ${interpolate(approach, [0, 1], [10, -18], clamp)}px, ${crossing * 260}px) rotateX(${-approach * 1.2}deg)`,
        filter: `drop-shadow(0 0 ${18 + rimAlive * 86}px rgba(122, 60, 255, ${0.16 + rimAlive * 0.38}))`,
      }}
    >
      <div
        className="aperture"
        style={{transform: `scale(${apertureScale})`}}
      >
        <div
          className="world world-far"
          style={{
            opacity: reveal * (0.16 + awakening * 0.42 + approach * 0.1),
            transform: `translate3d(${-26 + worldTime * 52}px, ${18 - awakening * 24}px, -260px) scale(${1.05 + approach * 0.34 + crossing * 1.8})`,
          }}
        />
        <div
          className="world world-middle"
          style={{
            opacity: reveal * (0.12 + awakening * 0.34 + approach * 0.14),
            transform: `translate3d(${26 - worldTime * 68}px, ${-20 + pulse * 34}px, -120px) scale(${1.02 + approach * 0.46 + crossing * 1.5})`,
          }}
        />
        <div
          className="world world-near"
          style={{
            opacity: reveal * (0.08 + awakening * 0.3 + approach * 0.18),
            transform: `translate3d(${-86 + worldTime * 150}px, ${-52 + pulse * 96}px, 0) rotate(${12 - worldTime * 9}deg) scale(${1 + approach * 0.34 + crossing * 0.92})`,
          }}
        />
        <div
          className="inner-breath"
          style={{
            opacity: reveal * (0.08 + pulse * 0.12 + awakening * 0.26 + approach * 0.18),
            transform: `translate(-50%, -50%) scale(${0.8 + pulse * 0.22 + approach * 0.4 + crossing * 1.2})`,
          }}
        />
      </div>

      <svg
        className="keyhole-rim"
        width="312"
        height="464"
        viewBox="0 0 312 464"
        aria-label="JuicyMania gateway keyhole"
      >
        <path
          d="M156 22C98.56 22 52 68.56 52 126C52 162.37 70.67 194.36 98.95 212.95L63.53 418.52C61.22 431.93 71.55 444 85.16 444H226.84C240.45 444 250.78 431.93 248.47 418.52L213.05 212.95C241.33 194.36 260 162.37 260 126C260 68.56 213.44 22 156 22Z"
          fill="rgba(1, 1, 4, 0.62)"
          stroke="url(#rimGradient)"
          strokeWidth="5.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          style={{
            opacity: rimOpacity * (0.28 + reveal * 0.72),
            strokeDasharray: 1,
            strokeDashoffset: 1 - reveal,
          }}
        />
        <path
          d="M156 58C114.58 58 81 91.58 81 133C81 158.62 93.83 181.25 113.42 194.79L85.92 414H226.08L198.58 194.79C218.17 181.25 231 158.62 231 133C231 91.58 197.42 58 156 58Z"
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1.2"
          pathLength="1"
          style={{
            opacity: rimOpacity * reveal * (0.08 + awakening * 0.42 + pulse * 0.12),
            strokeDasharray: '0.052 0.948',
            strokeDashoffset: -worldTime * 1.1,
          }}
        />
        <path
          d="M156 22C98.56 22 52 68.56 52 126C52 162.37 70.67 194.36 98.95 212.95L63.53 418.52C61.22 431.93 71.55 444 85.16 444H226.84C240.45 444 250.78 431.93 248.47 418.52L213.05 212.95C241.33 194.36 260 162.37 260 126C260 68.56 213.44 22 156 22Z"
          fill="none"
          stroke="rgba(247, 242, 255, 0.46)"
          strokeWidth="1"
          pathLength="1"
          style={{
            opacity: rimOpacity * interpolate(reveal, [0, 1], [0, 0.42], clamp),
            strokeDasharray: '0.12 0.11 0.025 0.2 0.08 0.465',
            strokeDashoffset: 0.74 - reveal * 0.38 - worldTime * 0.06,
          }}
        />
        <defs>
          <linearGradient id="rimGradient" x1="156" x2="156" y1="22" y2="444">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="34%" stopColor={PURPLE} />
            <stop offset="100%" stopColor="#1E0C4C" />
          </linearGradient>
        </defs>
      </svg>
      <div
        className="rim-halo"
        style={{
          opacity: rimOpacity * reveal * (0.08 + awakening * 0.22 + pulse * 0.08),
          transform: `translate(-50%, -50%) scale(${0.86 + awakening * 0.28 + approach * 0.52 + crossing * 2.4})`,
        }}
      />
    </div>
  );
};

export const JuicyManiaIntro = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const voidLift = interpolate(frame, [0, 120], [0, 1], clamp);
  const reveal = interpolate(frame, [120, 240], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.2, 0, 0.22, 1),
  });
  const awakening = interpolate(frame, [240, 420], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 0, 0.18, 1),
  });
  const approach = interpolate(frame, [420, 600], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.32, 0, 0.22, 1),
  });
  const crossing = interpolate(frame, [600, 705], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.78, 0, 1, 1),
  });
  const arrival = interpolate(frame, [690, 780], [0, 1], clamp);
  const titleIn = interpolate(frame, [735, 820], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.18, 0.88, 0.34, 1),
  });
  const bloom = interpolate(frame, [682, 708, 756], [0, 1, 0], {
    ...clamp,
    easing: Easing.bezier(0.08, 0, 0.22, 1),
  });

  const pulse = (Math.sin((frame / fps) * Math.PI * 0.82) + 1) / 2;
  const breath = spring({
    frame: frame - 270,
    fps,
    config: {damping: 54, stiffness: 16, mass: 3},
    durationInFrames: 220,
  });
  const worldTime = frame / 840;
  const cameraZ = interpolate(approach, [0, 1], [0, 280], clamp) + interpolate(crossing, [0, 1], [0, 1880], clamp);
  const cameraScale = interpolate(approach, [0, 1], [1 + breath * 0.025, 1.34], clamp) + interpolate(crossing, [0, 1], [0, 7.4], clamp);
  const outsideOpacity = interpolate(crossing, [0.5, 0.92], [1, 0], clamp);

  return (
    <AbsoluteFill className="jm-stage">
      <div
        className="void-room"
        style={{
          opacity: outsideOpacity,
          transform: `translate3d(0, ${-approach * 18}px, ${-cameraZ * 0.05}px) scale(${1 + crossing * 0.38})`,
        }}
      />
      <div
        className="void-reflection reflection-back"
        style={{
          opacity: voidLift * (0.12 + reveal * 0.18 + awakening * 0.12) * outsideOpacity,
          transform: `translate3d(${-worldTime * 38}px, ${-approach * 18}px, 0) scale(${1 + crossing * 0.42})`,
        }}
      />
      <div
        className="void-reflection reflection-near"
        style={{
          opacity: voidLift * (0.08 + reveal * 0.12 + awakening * 0.12) * outsideOpacity,
          transform: `translate3d(${worldTime * 50}px, ${approach * 14}px, 0) scale(${1 + crossing * 0.76})`,
        }}
      />
      <div
        className="dust-field"
        style={{opacity: interpolate(frame, [28, 126, 650, 710], [0, 0.32, 0.34, 0], clamp)}}
      >
        {dust.map((particle) => {
          const travel = ((frame + particle.delay) % 260) / 260;

          return (
            <span
              key={particle.id}
              className="dust"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                opacity: particle.opacity * (0.45 + reveal * 0.45 + awakening * 0.42),
                transform: `translate3d(${(travel - 0.5) * particle.drift}px, ${travel * -42}px, ${travel * 120 * particle.depth}px) scale(${0.62 + travel * 0.42 + crossing * 0.72})`,
              }}
            />
          );
        })}
      </div>

      <div
        className="camera-rig"
        style={{
          transform: `translate3d(0, ${interpolate(approach, [0, 1], [0, -12], clamp)}px, ${cameraZ}px) scale(${cameraScale})`,
        }}
      >
        <KeyholeGateway
          reveal={reveal}
          awakening={awakening}
          approach={approach}
          crossing={crossing}
          pulse={pulse}
          worldTime={worldTime}
        />
      </div>

      <div
        className="threshold-edge"
        style={{
          opacity: interpolate(crossing, [0.18, 0.58, 1], [0, 0.74, 0], clamp),
          transform: `translate(-50%, -50%) scale(${0.55 + crossing * 2.55})`,
        }}
      />

      <div
        className="inner-sanctum"
        style={{
          opacity: arrival,
          transform: `scale(${1.18 - arrival * 0.18}) translateY(${(1 - arrival) * 34}px)`,
        }}
      >
        <div
          className="sanctum-depth sanctum-back"
          style={{transform: `translate3d(${-28 + arrival * 28}px, ${-10 + arrival * 10}px, 0)`}}
        />
        <div
          className="sanctum-depth sanctum-light"
          style={{transform: `translate3d(${34 - arrival * 34}px, ${18 - arrival * 18}px, 0)`}}
        />
      </div>

      <div
        className="threshold-bloom"
        style={{
          opacity: bloom,
          transform: `translate(-50%, -50%) scale(${0.28 + bloom * 2.7 + crossing * 0.8})`,
        }}
      />

      <div
        className="title-lockup"
        style={{
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0, 1], [30, 0], clamp)}px) scale(${0.986 + titleIn * 0.014})`,
          filter: `blur(${interpolate(titleIn, [0, 1], [12, 0], clamp)}px)`,
        }}
      >
        <div className="eyebrow-line" />
        <h1>JUICYMANIA</h1>
        <p>ACCESS IS EARNED</p>
      </div>
    </AbsoluteFill>
  );
};
