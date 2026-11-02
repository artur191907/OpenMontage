import { Composition, Still } from "remotion";
import { Cover, CoverProps } from "./parts/Cover";
import { Scene, calculateMetadata, SceneProps } from "./Composition";

export const Root: React.FC = () => (
  <>
  <Composition
    id="BezLiftaPilot"
    component={Scene}
    durationInFrames={384}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{ durationSec: 12.8, lines: [], sfx: [], beats: { b1: [0, 3.4], b2: [3.4, 8.3], b3: [8.3, 12.8] } } as SceneProps}
    calculateMetadata={calculateMetadata}
  />
  <Still id="Cover" component={Cover} width={1080} height={1920} defaultProps={{ episode: 1, title: "ИНСТРУКЦИЯ" } as CoverProps} />
  </>
);
