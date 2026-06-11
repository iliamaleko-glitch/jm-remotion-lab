import {Composition} from 'remotion';
import {JuicyManiaIntro} from './components/JuicyManiaIntro';
import {JuicyManiaIntroV61} from './JuicyManiaIntroV61';

export const Root = () => {
  return (
    <>
      <Composition
        id="JuicyManiaIntro"
        component={JuicyManiaIntro}
        durationInFrames={300}
        fps={60}
        width={1920}
        height={1080}
      />

      <Composition
        id="JuicyManiaIntroV61"
        component={JuicyManiaIntroV61}
        durationInFrames={300}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
