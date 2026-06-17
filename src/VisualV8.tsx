import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {IntroAudio} from './IntroAudio';
import {v8Timeline} from './timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type DepthParticle = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  driftX: number;
  driftY: number;
  delay: number;
};

const createParticles = (
  count: number,
  seedOffset: number,
  sizeBase: number,
  sizeRange: number,
  opacityBase: number,
  opacityRange: number,
  driftBase: number
): DepthParticle[] => {
  return Array.from({length: count}, (_, index) => {
    const seed = index + seedOffset;
    const lane = seed % 13;
    const band = Math.floor(seed / 13);

    return {
      id: index,
      x: 8 + lane * 7.1 + Math.sin(seed * 1.37) * 3.8,
      y: 8 + ((seed * 19 + band * 11) % 84),
      size: sizeBase + (seed % 5) * sizeRange,
      opacity: opacityBase + (seed % 7) * opacityRange,
      driftX: (Math.sin(seed * 0.91) * 0.5 + 0.5) * driftBase,
      driftY: driftBase * 0.45 + (seed % 4) * (driftBase * 0.12),
      delay: seed * 9,
    };
  });
};

const farParticles = createParticles(34, 3, 0.75, 0.12, 0.102, 0.014, 26);
const midParticles = createParticles(24, 47, 1.25, 0.22, 0.148, 0.023, 68);
const nearParticles = createParticles(16, 103, 2.1, 0.42, 0.138, 0.023, 128);

const BackgroundGlow: React.FC<{frame: number}> = ({frame}) => {
  const breath = interpolate(frame, [0, 150, 300], [1, 1.08, 1.03], clamp);
  const drift = interpolate(frame, [0, 300], [-1, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background:
          `radial-gradient(circle at ${50 + drift * 5.4}% ${48 - drift * 2.7}%, rgba(122, 60, 255, 0.23) 0%, rgba(122, 60, 255, 0.11) 20%, transparent 48%), ` +
          `radial-gradient(ellipse at ${38 - drift * 4.2}% 42%, rgba(187, 164, 255, 0.12) 0%, transparent 38%), ` +
          `radial-gradient(ellipse at ${64 + drift * 3.6}% 64%, rgba(42, 16, 102, 0.22) 0%, transparent 46%), ` +
          'linear-gradient(180deg, #05030b 0%, #020106 58%, #000000 100%)',
        transform: `scale(${breath})`,
        transformOrigin: 'center',
      }}
    />
  );
};

const WarmCoreWhisper: React.FC<{frame: number}> = ({frame}) => {
  const opacity = interpolate(
    frame,
    [v8Timeline.warmCoreWhisper.start, 112, v8Timeline.warmCoreWhisper.end, 300],
    [0.05, 0.14, 0.1, 0.07],
    clamp
  );
  const scale = interpolate(frame, [0, 160, 300], [0.94, 1.04, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 50% 52%, rgba(255, 196, 128, 0.5) 0%, rgba(184, 126, 86, 0.2) 13%, rgba(122, 60, 255, 0.08) 26%, transparent 48%)',
        mixBlendMode: 'screen',
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
      }}
    />
  );
};

const FilmGrain: React.FC<{frame: number}> = ({frame}) => {
  const grainFrame = Math.floor(frame / 3);
  const offsetX = (grainFrame % 7) * 17;
  const offsetY = (grainFrame % 11) * 13;

  return (
    <AbsoluteFill
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.1) 0 0.7px, transparent 1.1px), radial-gradient(circle, rgba(122,60,255,0.055) 0 0.55px, transparent 1px)',
        backgroundPosition: `${offsetX}px ${offsetY}px, ${-offsetY}px ${offsetX}px`,
        backgroundSize: '37px 41px, 53px 47px',
        mixBlendMode: 'screen',
        opacity: 0.13,
        pointerEvents: 'none',
      }}
    />
  );
};

const DepthParticleLayer: React.FC<{
  particles: DepthParticle[];
  frame: number;
  travelFrames: number;
  parallax: number;
  blur: number;
  layerOpacity: number;
}> = ({particles, frame, travelFrames, parallax, blur, layerOpacity}) => {
  return (
    <AbsoluteFill style={{filter: `blur(${blur}px)`, opacity: layerOpacity}}>
      {particles.map((particle) => {
        const travel = ((frame + particle.delay) % travelFrames) / travelFrames;
        const x = (travel - 0.5) * particle.driftX * parallax;
        const y = -travel * particle.driftY;
        const shimmer = interpolate(travel, [0, 0.28, 0.76, 1], [0.25, 1, 0.72, 0.2], clamp);

        return (
          <span
            key={particle.id}
            style={{
              background: 'rgba(247, 242, 255, 0.74)',
              borderRadius: '999px',
              boxShadow: '0 0 10px rgba(122, 60, 255, 0.22)',
              display: 'block',
              height: particle.size,
              left: `${particle.x}%`,
              opacity: particle.opacity * shimmer,
              position: 'absolute',
              top: `${particle.y}%`,
              transform: `translate3d(${x}px, ${y}px, 0)`,
              width: particle.size,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const DepthParticles: React.FC<{frame: number}> = ({frame}) => {
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <DepthParticleLayer
        particles={farParticles}
        frame={frame}
        travelFrames={260}
        parallax={0.45}
        blur={0}
        layerOpacity={0.7}
      />
      <DepthParticleLayer
        particles={midParticles}
        frame={frame}
        travelFrames={210}
        parallax={0.72}
        blur={0.25}
        layerOpacity={0.76}
      />
      <DepthParticleLayer
        particles={nearParticles}
        frame={frame}
        travelFrames={170}
        parallax={1}
        blur={1.2}
        layerOpacity={0.64}
      />
    </AbsoluteFill>
  );
};


const KeyholeArtifact: React.FC<{frame: number}> = ({frame}) => {
  const reveal = interpolate(frame, [60, 96], [0, 1], clamp);
  const lockPulse = interpolate(frame, [124, 134, 150], [0, 1, 0], clamp);
  const breath = interpolate(frame, [0, 150, 300], [0.985, 1.012, 0.998], clamp);
  const toothShift = Math.floor(frame / 18) % 5;
  const slowPresence = (Math.sin((frame / 300) * Math.PI * 2) + 1) / 2;
  const revealFocus = interpolate(frame, [62, 92, 132], [0, 1, 0], clamp);
  const materialScale = breath + lockPulse * 0.034 + slowPresence * 0.005;
  const pulseReflection = 0.11 + lockPulse * 0.2 + revealFocus * 0.08 + slowPresence * 0.04;

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        opacity: reveal,
        pointerEvents: 'none',
      }}
    >
      <svg
        width="238"
        height="360"
        viewBox="0 0 238 360"
        aria-label="JM keyhole artifact"
        style={{
          filter:
            'drop-shadow(0 46px 70px rgba(0, 0, 0, 0.64)) drop-shadow(0 0 22px rgba(122, 60, 255, 0.08))',
          transform: `translateY(${interpolate(reveal, [0, 1], [16, 0], clamp)}px) scale(${materialScale})`,
          transformOrigin: '50% 48%',
        }}
      >
        <defs>
          <linearGradient id="artifactGraphite" x1="48" x2="190" y1="20" y2="342">
            <stop offset="0" stopColor="#302b36" />
            <stop offset="0.22" stopColor="#17131d" />
            <stop offset="0.58" stopColor="#09070c" />
            <stop offset="1" stopColor="#020106" />
          </linearGradient>
          <linearGradient id="artifactEdge" x1="54" x2="184" y1="28" y2="330">
            <stop offset="0" stopColor="rgba(238, 232, 255, 0.34)" />
            <stop offset="0.22" stopColor="rgba(122, 60, 255, 0.27)" />
            <stop offset="0.54" stopColor="rgba(255, 255, 255, 0.055)" />
            <stop offset="1" stopColor="rgba(0, 0, 0, 0.68)" />
          </linearGradient>
          <linearGradient id="innerGraphite" x1="78" x2="160" y1="48" y2="302">
            <stop offset="0" stopColor="#0c0a10" />
            <stop offset="0.5" stopColor="#030205" />
            <stop offset="1" stopColor="#000000" />
          </linearGradient>
          <linearGradient id="engravedChannel" x1="119" x2="119" y1="38" y2="318">
            <stop offset="0" stopColor="rgba(187, 164, 255, 0.34)" />
            <stop offset="0.48" stopColor="rgba(122, 60, 255, 0.28)" />
            <stop offset="1" stopColor="rgba(42, 16, 102, 0.12)" />
          </linearGradient>
          <radialGradient id="violetReflection" cx="50%" cy="38%" r="62%">
            <stop offset="0" stopColor={`rgba(122, 60, 255, ${pulseReflection})`} />
            <stop offset="0.48" stopColor="rgba(122, 60, 255, 0.055)" />
            <stop offset="1" stopColor="rgba(122, 60, 255, 0)" />
          </radialGradient>
          <filter id="materialTooth" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.82"
              numOctaves="3"
              seed={31 + toothShift}
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0.64 0 0 0 0 0.6 0 0 0 0 0.72 0 0 0 0.18 0"
            />
          </filter>
          <filter id="innerInsetShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="7"
              stdDeviation="7"
              floodColor="#000000"
              floodOpacity="0.78"
            />
          </filter>
          <clipPath id="artifactClip">
            <path d="M119 12C72.06 12 34 50.06 34 97C34 126.63 49.16 152.72 72.14 167.92L44 326C42.08 336.78 50.37 347 61.32 347H176.68C187.63 347 195.92 336.78 194 326L165.86 167.92C188.84 152.72 204 126.63 204 97C204 50.06 165.94 12 119 12Z" />
          </clipPath>
        </defs>

        <ellipse cx="119" cy="194" rx="88" ry="162" fill="rgba(0, 0, 0, 0.32)" />
        <path
          d="M119 12C72.06 12 34 50.06 34 97C34 126.63 49.16 152.72 72.14 167.92L44 326C42.08 336.78 50.37 347 61.32 347H176.68C187.63 347 195.92 336.78 194 326L165.86 167.92C188.84 152.72 204 126.63 204 97C204 50.06 165.94 12 119 12Z"
          fill="url(#artifactGraphite)"
        />
        <g clipPath="url(#artifactClip)">
          <rect x="20" y="0" width="198" height="360" filter="url(#materialTooth)" opacity="0.24" />
          <path
            d="M119 24C78.1 24 45 57.14 45 98C45 123.76 58.12 146.48 78.04 159.68L51.8 322C50.7 328.78 56 335 62.84 335H175.16C182 335 187.3 328.78 186.2 322L159.96 159.68C179.88 146.48 193 123.76 193 98C193 57.14 159.9 24 119 24Z"
            fill="none"
            stroke="rgba(0, 0, 0, 0.58)"
            strokeWidth="10"
            opacity="0.76"
          />
          <path
            d="M119 39C86.4 39 60 65.44 60 98C60 118.58 70.46 136.66 86.4 147.18L64.6 315H173.4L151.6 147.18C167.54 136.66 178 118.58 178 98C178 65.44 151.6 39 119 39Z"
            fill="url(#innerGraphite)"
            filter="url(#innerInsetShadow)"
          />
          <path
            d="M119 54C94.84 54 75.2 73.62 75.2 97.8C75.2 113.74 83.74 127.84 96.42 135.56L81.8 294H156.2L141.58 135.56C154.26 127.84 162.8 113.74 162.8 97.8C162.8 73.62 143.16 54 119 54Z"
            fill="rgba(0, 0, 0, 0.5)"
            stroke="rgba(0, 0, 0, 0.72)"
            strokeWidth="8"
          />
          <path
            d="M119 42C88.2 42 63.3 66.92 63.3 97.72C63.3 117.08 73.16 134.18 88.1 144.1L67.8 316H170.2L149.9 144.1C164.84 134.18 174.7 117.08 174.7 97.72C174.7 66.92 149.8 42 119 42Z"
            fill="none"
            stroke="rgba(0, 0, 0, 0.58)"
            strokeWidth="5.2"
          />
          <path
            d="M119 42C88.2 42 63.3 66.92 63.3 97.72C63.3 117.08 73.16 134.18 88.1 144.1L67.8 316H170.2L149.9 144.1C164.84 134.18 174.7 117.08 174.7 97.72C174.7 66.92 149.8 42 119 42Z"
            fill="none"
            stroke="url(#engravedChannel)"
            strokeWidth="2.2"
            opacity={0.6 + lockPulse * 0.24 + revealFocus * 0.1 + slowPresence * 0.05}
          />
          <path
            d="M119 31C83.2 31 54.3 59.9 54.3 95.7C54.3 118.38 65.72 138.14 83.3 149.74L58.8 327H179.2L154.7 149.74C172.28 138.14 183.7 118.38 183.7 95.7C183.7 59.9 154.8 31 119 31Z"
            fill="none"
            stroke="url(#artifactEdge)"
            strokeWidth="1.55"
            opacity={0.78 + revealFocus * 0.08}
          />
          <path
            d="M79.8 79C86.6 54.4 104.1 41.8 129.4 44.6"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeLinecap="round"
            strokeWidth="1.15"
          />
          <path
            d="M157.8 154.5L176 318.2"
            fill="none"
            stroke="rgba(0, 0, 0, 0.58)"
            strokeLinecap="round"
            strokeWidth="1.7"
          />
          <path
            d="M61.6 310.8C78.2 315.6 104 318 139 315.6"
            fill="none"
            stroke="rgba(255, 255, 255, 0.045)"
            strokeLinecap="round"
            strokeWidth="1"
          />
          <path
            d="M119 25C82 25 52 55.04 52 92.06C52 116.2 64.88 137.34 84.06 149L61 315H177L153.94 149C173.12 137.34 186 116.2 186 92.06C186 55.04 156 25 119 25Z"
            fill="url(#violetReflection)"
            opacity="0.72"
          />
        </g>
        <path
          d="M119 12C72.06 12 34 50.06 34 97C34 126.63 49.16 152.72 72.14 167.92L44 326C42.08 336.78 50.37 347 61.32 347H176.68C187.63 347 195.92 336.78 194 326L165.86 167.92C188.84 152.72 204 126.63 204 97C204 50.06 165.94 12 119 12Z"
          fill="none"
          stroke="rgba(187, 164, 255, 0.18)"
          strokeWidth="1.1"
        />
      </svg>
    </AbsoluteFill>
  );
};

const Vignette: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse at center, transparent 0%, transparent 44%, rgba(0,0,0,0.42) 72%, rgba(0,0,0,0.9) 100%)',
        pointerEvents: 'none',
      }}
    />
  );
};

const VisualV8: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: '#020106', overflow: 'hidden'}}>
      <BackgroundGlow frame={frame} />
      <WarmCoreWhisper frame={frame} />
      <DepthParticles frame={frame} />
      <KeyholeArtifact frame={frame} />
      <FilmGrain frame={frame} />
      <Vignette />
    </AbsoluteFill>
  );
};

export const JuicyManiaIntroV8: React.FC = () => {
  return (
    <AbsoluteFill>
      <VisualV8 />
      <IntroAudio />
    </AbsoluteFill>
  );
};

export default VisualV8;
