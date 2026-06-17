import {Composition} from 'remotion';
import {JuicyManiaIntro} from './components/JuicyManiaIntro';
import {JuicyManiaIntroV61} from './JuicyManiaIntroV61';
import {JuicyManiaIntroV8} from './VisualV8';
import {V8_DURATION_IN_FRAMES, V8_FPS, V8_HEIGHT, V8_WIDTH} from './timeline';

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

      <Composition
        id="JuicyManiaIntroV8"
        component={JuicyManiaIntroV8}
        durationInFrames={V8_DURATION_IN_FRAMES}
        fps={V8_FPS}
        width={V8_WIDTH}
        height={V8_HEIGHT}
      />
    </>
  );
};
