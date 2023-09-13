import LeftArrowIcon from "shared/components/LeftArrowIcon";
import RangeSlider from "shared/components/RangeSlider";
import usePremChatStore from "shared/store/prem-chat";
import { shallow } from "zustand/shallow";

import type { ChatRightSidebarProps } from "../types";

const RightSidebar = ({
  setRightSidebar,
  resetPromptTemplate,
  resetChatServiceUrl,
}: ChatRightSidebarProps) => {
  const {
    temperature,
    setTemperature,
    max_tokens,
    setMaxTokens,
    top_p,
    setTopP,
    frequency_penalty,
    setFrequencyPenalty,
    n,
    setN,
    presence_penalty,
    setPresencePenalty,
    promptTemplate,
    setPromptTemplate,
    setChatServiceUrl,
    chatServiceUrl,
  } = usePremChatStore(
    (state) => ({
      temperature: state.temperature,
      setTemperature: state.setTemperature,
      max_tokens: state.max_tokens,
      setMaxTokens: state.setMaxTokens,
      top_p: state.top_p,
      setTopP: state.setTopP,
      frequency_penalty: state.frequency_penalty,
      setFrequencyPenalty: state.setFrequencyPenalty,
      n: state.n,
      setN: state.setN,
      presence_penalty: state.presence_penalty,
      setPresencePenalty: state.setPresencePenalty,
      promptTemplate: state.promptTemplate,
      setPromptTemplate: state.setPromptTemplate,
      setChatServiceUrl: state.setChatServiceUrl,
      chatServiceUrl: state.chatServiceUrl,
    }),
    shallow,
  );

  return (
    <div className="prem-chat-right-sidebar">
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
            <span>Temperature</span>
            <span>{temperature}</span>
          </p>
          <RangeSlider
            className="range-slider__bar"
            value={[0, temperature]}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
            min={0}
            max={1}
            step={0.1}
            onInput={(value: number[]) => setTemperature(value[1])}
          />
        </li>

        <li>
          <p>
            <span>Top P</span>
            <span>{top_p}</span>
          </p>
          <RangeSlider
            className="range-slider__bar"
            value={[0, top_p]}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
            min={0}
            max={1}
            step={0.05}
            onInput={(value: number[]) => setTopP(value[1])}
          />
        </li>
        <li>
          <p>
            <span>Max new tokens</span>
            <span>{max_tokens}</span>
          </p>
          <RangeSlider
            className="range-slider__bar"
            value={[0, max_tokens]}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
            min={0}
            max={512}
            step={1}
            onInput={(value: number[]) => setMaxTokens(value[1])}
          />
        </li>

        <li>
          <p>
            <span>N</span>
            <span>{n}</span>
          </p>
          <RangeSlider
            className="range-slider__bar"
            value={[0, n]}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
            min={1}
            max={10}
            step={1}
            onInput={(value: number[]) => setN(value[1])}
          />
        </li>

        <li>
          <p>
            <span>Presence Penalty</span>
            <span>{presence_penalty}</span>
          </p>
          <RangeSlider
            className="range-slider__bar"
            value={[0, presence_penalty]}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
            min={0}
            max={1}
            step={0.1}
            onInput={(value: number[]) => setPresencePenalty(value[1])}
          />
        </li>

        <li>
          <p>
            <span>Frequency Penalty</span>
            <span>{frequency_penalty}</span>
          </p>
          <RangeSlider
            className="range-slider__bar"
            value={[0, frequency_penalty]}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
            min={0}
            max={1}
            step={0.1}
            onInput={(value: number[]) => setFrequencyPenalty(value[1])}
          />
        </li>

        <li>
          <p>
            <span>Prompt Template</span>
            <button className="text-grey-400" onClick={resetPromptTemplate}>
              Reset
            </button>
          </p>
          <p className="w-full">
            <textarea
              className="w-full rounded p-2 text-white"
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
              rows={5}
            ></textarea>
          </p>
        </li>

        <li>
          <p className="!mb-[18px]">
            <span>Chat Service URL</span>
            <button className="text-grey-400" onClick={resetChatServiceUrl}>
              Reset
            </button>
          </p>
          <p className="w-full">
            <textarea
              className="w-full rounded p-2 text-white z-10"
              value={chatServiceUrl}
              onChange={(e) => setChatServiceUrl(e.target.value)}
              rows={2}
            />
          </p>
        </li>
      </ul>
    </div>
  );
};

export default RightSidebar;
