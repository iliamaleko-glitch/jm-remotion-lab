
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

const farParticles = createParticles(38, 3, 0.62, 0.1, 0.04, 0.006, 11);
const midParticles = createParticles(28, 47, 1.35, 0.24, 0.09, 0.014, 34);
const nearParticles = createParticles(20, 103, 2.75, 0.56, 0.085, 0.016, 58);

const BackgroundGlow: React.FC<{frame: number}> = ({frame}) => {
  const breath = interpolate(frame, [0, 150, 300], [1, 1.035, 1.012], clamp);
  const drift = interpolate(frame, [0, 300], [-1, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background:
          `radial-gradient(circle at ${50 + drift * 1.6}% ${48 - drift * 0.8}%, rgba(122, 60, 255, 0.22) 0%, rgba(122, 60, 255, 0.1) 20%, transparent 48%), ` +
          `radial-gradient(ellipse at ${38 - drift * 1.2}% 42%, rgba(187, 164, 255, 0.11) 0%, transparent 38%), ` +
          `radial-gradient(ellipse at ${64 + drift}% 64%, rgba(42, 16, 102, 0.2) 0%, transparent 46%), ` +
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
              background: 'rgba(247, 242, 255, 0.78)',
              borderRadius: '999px',
              boxShadow: `0 0 ${8 + particle.size * 3}px rgba(122, 60, 255, ${0.16 + particle.size * 0.035})`,
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
        travelFrames={285}
        parallax={0.32}
        blur={0.15}
        layerOpacity={0.44}
      />
      <DepthParticleLayer
        particles={midParticles}
        frame={frame}
        travelFrames={205}
        parallax={0.86}
        blur={0.35}
        layerOpacity={0.7}
      />
      <DepthParticleLayer
        particles={nearParticles}
        frame={frame}
        travelFrames={145}
        parallax={1.38}
        blur={1.65}
        layerOpacity={0.62}
      />
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

const KeyholeArtifact: React.FC<{frame: number}> = ({frame}) => {
  const reveal = interpolate(frame, [24, 64, 104], [0, 0.55, 1], clamp);
  const settle = interpolate(frame, [96, 132, 210], [1.07, 1, 0.985], clamp);
  const driftY = interpolate(frame, [0, 132, 300], [10, 0, -6], clamp);
  const pulse = interpolate(frame, [96, 116, 142], [0, 1, 0], clamp);
  const rimPulse = interpolate(frame, [86, 108, 136], [0, 1, 0], clamp);
  const glow = 0.28 + pulse * 0.42;

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        transform: `translateY(${driftY}px) scale(${settle})`,
        opacity: reveal,
      }}
    >
      <svg
        width="310"
        height="430"
        viewBox="0 0 310 430"
        style={{
          filter: `drop-shadow(0 0 ${24 + pulse * 26}px rgba(122, 60, 255, ${glow})) drop-shadow(0 18px 34px rgba(0, 0, 0, 0.58))`,
          overflow: 'visible',
        }}
      >
        <defs>
          <radialGradient id="v8-keyhole-inner" cx="50%" cy="38%" r="68%">
            <stop offset="0%" stopColor="rgba(255,246,232,0.44)" />
            <stop offset="26%" stopColor="rgba(122,60,255,0.38)" />
            <stop offset="72%" stopColor="rgba(28,10,52,0.18)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          <linearGradient id="v8-keyhole-edge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="38%" stopColor="rgba(186,142,255,0.82)" />
            <stop offset="70%" stopColor="rgba(122,60,255,0.52)" />
            <stop offset="100%" stopColor="rgba(18,8,36,0.9)" />
          </linearGradient>
        </defs>

        <path
          d="M155 42
             C103 42 64 82 64 133
             C64 168 82 199 111 216
             L86 358
             C83 375 96 390 113 390
             H197
             C214 390 227 375 224 358
             L199 216
             C228 199 246 168 246 133
             C246 82 207 42 155 42Z"
          fill="url(#v8-keyhole-inner)"
          opacity={0.86}
        />

        <path
          d="M155 42
             C103 42 64 82 64 133
             C64 168 82 199 111 216
             L86 358
             C83 375 96 390 113 390
             H197
             C214 390 227 375 224 358
             L199 216
             C228 199 246 168 246 133
             C246 82 207 42 155 42Z"
          fill="none"
          stroke="url(#v8-keyhole-edge)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.94 + rimPulse * 0.06}
        />

        <path
          d="M155 56
             C110 56 78 90 78 133
             C78 162 93 188 118 202"
          fill="none"
          stroke="rgba(255,246,232,0.68)"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity={0.62 + pulse * 0.26}
        />
      </svg>
    </AbsoluteFill>
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