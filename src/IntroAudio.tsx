import React from 'react';
import {Audio, Sequence, staticFile, interpolate, useVideoConfig} from 'remotion';

type ClipEnvelope = {
  id: string;
  src: string;
  startSec: number;
  durationSec: number;
  trimBeforeSec: number;
  envelope: Array<[number, number]>;
};

const CLIPS: ClipEnvelope[] = [
  {
    id: 'atmosphere',
    src: 'audio/atmosphere-air.wav',
    startSec: 0.0,
    durationSec: 5.0,
    trimBeforeSec: 0,
    envelope: [
      [0.0, 0.0],
      [0.05, 0.14],
      [0.44, 0.22],
      [0.55, 0.18],
      [0.92, 0.18],
      [1.0, 0.0],
    ],
  },
  {
    id: 'sub-swell',
    src: 'audio/sub-swell.wav',
    startSec: 0.0,
    durationSec: 5.0,
    trimBeforeSec: 0,
    envelope: [
      [0.0, 0.0],
      [0.04, 0.12],
      [0.44, 0.2],
      [0.52, 0.18],
      [0.74, 0.14],
      [0.8, 0.22],
      [0.86, 0.18],
      [1.0, 0.0],
    ],
  },
  {
    id: 'lock-velvety',
    src: 'audio/lock-velvety.wav',
    startSec: 2.216,
    durationSec: 1.2,
    trimBeforeSec: 0,
    envelope: [[0, 0], [0.04, 0.85], [0.45, 0.5], [1, 0]],
  },
  {
    id: 'lock-precise',
    src: 'audio/lock-precise.wav',
    startSec: 2.25,
    durationSec: 0.8,
    trimBeforeSec: 0,
    envelope: [[0, 0], [0.03, 0.5], [0.35, 0.16], [1, 0]],
  },
  {
    id: 'riser',
    src: 'audio/riser.wav',
    startSec: 3.5,
    durationSec: 0.85,
    trimBeforeSec: 0.18,
    envelope: [[0, 0], [0.62, 0.5], [0.8, 0.35], [1, 0]],
  },
  {
    id: 'bloom',
    src: 'audio/bloom.wav',
    startSec: 3.993,
    durationSec: 1.0,
    trimBeforeSec: 0,
    envelope: [[0, 0], [0.05, 2.3], [0.5, 1.4], [1, 0]],
  },
  {
    id: 'shimmer',
    src: 'audio/shimmer.wav',
    startSec: 4.2,
    durationSec: 0.8,
    trimBeforeSec: 0.95,
    envelope: [[0, 0], [0.18, 0.55], [0.65, 0.4], [1, 0]],
  },
];

const buildVolume = (
  envelope: Array<[number, number]>,
  durationInFrames: number
) => {
  const inputRange = envelope.map(([p]) => p * (durationInFrames - 1));
  const outputRange = envelope.map(([, g]) => g);

  return (frame: number) =>
    interpolate(frame, inputRange, outputRange, {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
};

export const IntroAudio: React.FC = () => {
  const {fps, durationInFrames: compDuration} = useVideoConfig();

  return (
    <>
      {CLIPS.map((clip) => {
        const from = Math.round(clip.startSec * fps);
        const rawDuration = Math.round(clip.durationSec * fps);
        const duration = Math.min(rawDuration, compDuration - from);

        if (duration <= 0) {
          return null;
        }

        const trimBefore = Math.round(clip.trimBeforeSec * fps);
        const volume = buildVolume(clip.envelope, duration);

        return (
          <Sequence key={clip.id} from={from} durationInFrames={duration}>
            <Audio src={staticFile(clip.src)} startFrom={trimBefore} volume={volume} />
          </Sequence>
        );
      })}
    </>
  );
};

export default IntroAudio;



