import LeftArrowIcon from "shared/components/LeftArrowIcon";
import RangeSlider from "shared/components/RangeSlider";
import usePremUpscalerStore from "shared/store/prem-upscaler";
import type { RightSidebarProps } from "shared/types";
import { shallow } from "zustand/shallow";

const PremUpscalerRightSidebar = ({ setRightSidebar }: RightSidebarProps) => {
  const {
    prompt,
    setPrompt,
    guidance_scale,
    num_inference_steps,
    setGuidanceScale,
    setNumInferenceSteps,
  } = usePremUpscalerStore(
    (state) => ({
      prompt: state.prompt,
      guidance_scale: state.guidance_scale,
      num_inference_steps: state.num_inference_steps,
      setPrompt: state.setPrompt,
      setGuidanceScale: state.setGuidanceScale,
      setNumInferenceSteps: state.setNumInferenceSteps,
    }),
    shallow,
  );

  return (
    <div className="prem-chat-right-sidebar prem-image--right-sidebar">
      <div className="sidebar-toggle__btn !mt-5 !ml-0">
        <button
          onClick={() => setRightSidebar(false)}
          className="bg-Onyx px-[8.4px] mr-3 py-[10px] rounded-md"
        >
          <LeftArrowIcon className="rotate-180" />
        </button>
        <span className="text-grey-300">Close Sidebar</span>
      </div>
      <div className="-mx-4 opacity-30" />
      <ul className="mb-[18px] mt-[42px] right-sidebar__list overflow-y-auto scrollbar-none">
        <li>
          <p>
            <span>Guidance Scale</span>
            <span>{guidance_scale}</span>
          </p>
          <RangeSlider
            className="range-slider__bar"
            value={[0, guidance_scale]}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
            min={0}
            max={50}
            step={0.5}
            onInput={(value: number[]) => setGuidanceScale(value[1])}
          />
        </li>
        <li>
          <p>
            <span>Num Inference Steps</span>
            <span>{num_inference_steps}</span>
          </p>
          <RangeSlider
            className="range-slider__bar"
            value={[0, num_inference_steps]}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
            min={1}
            max={200}
            step={1}
            onInput={(value: number[]) => setNumInferenceSteps(value[1])}
          />
        </li>
        <li>
          <p className="!mb-[18px]">
            <span>Prompt</span>
          </p>
          <p className="w-full">
            <textarea
              className="w-full rounded p-1"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
            ></textarea>
          </p>
        </li>
      </ul>
    </div>
  );
};

export default PremUpscalerRightSidebar;
