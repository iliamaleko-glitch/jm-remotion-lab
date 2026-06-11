import React from 'react';
import {AbsoluteFill} from 'remotion';
import {JuicyManiaIntro} from './components/JuicyManiaIntro';
import {IntroAudio} from './IntroAudio';

export const JuicyManiaIntroV61: React.FC = () => {
  return (
    <AbsoluteFill>
      <JuicyManiaIntro />
      <IntroAudio />
    </AbsoluteFill>
  );
};

export default JuicyManiaIntroV61;
