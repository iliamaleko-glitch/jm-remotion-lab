import {Composition} from 'remotion';
import {JuicyManiaIntro} from './components/JuicyManiaIntro';

export const Root = () => {
  return (
    <Composition
      id="JuicyManiaIntro"
      component={JuicyManiaIntro}
      durationInFrames={840}
      fps={60}
      width={1920}
      height={1080}
    />
  );
};
