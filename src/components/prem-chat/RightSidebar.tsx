import React, { useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import usePremChatStore from "../../shared/store/prem-chat";
import { shallow } from "zustand/shallow";
import { LeftArrow } from "../../shared/Icon";

const RightSidebar = ({ setRightSidebar }: any) => {
  const [isActive, setIsActive] = useState(false);
  const [selected, setIsSelected] = useState("k50");

  const {
    temperature,
    setTemperature,
    max_tokens,
    setMaxTokens,
    top_p,
    setTopP,
    frequency_penalty,
    setFrequencyPenalty,
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
    }),
    shallow
  );

  return (
    <div className="bg-darkgunmetal flex-col px-4 flex h-screen w-[260px]">
      <div className="sidebar-toggle__btn !mt-5 !ml-3">
        <button
          onClick={() => setRightSidebar(false)}
          className="bg-Onyx px-[8.4px] mr-3 -ml-[6px] py-[10px] rounded-md"
        >
          <LeftArrow />
        </button>
        <span>Close Sidebar</span>
      </div>

      <div className="mb-[18px] mt-[42px]">
        <p className="text-spanishgray text-base font-proximaNova-regular mb-[18px]">
          Preset
        </p>

        <div className="dropdown">
          <div
            onClick={(e) => {
              setIsActive(!isActive);
            }}
            className="text-white text-base font-proximaNova-regular flex items-center justify-between"
          >
            {selected}
            <svg
              width="7"
              height="10"
              viewBox="0 0 7 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 9.25L5.125 5.125L1 1"
                stroke="white"
                strokeWidth="1.76786"
              />
            </svg>
          </div>
          <div
            className="dropdown-content"
            style={{ display: isActive ? "block" : "none" }}
          >
            <div
              onClick={(e) => {
                const target = e.target as HTMLElement;
                setIsSelected(target.textContent || "");
                setIsActive(!isActive);
              }}
              className="item"
            >
              k50
            </div>
            <div
              className="item"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                setIsSelected(target.textContent || "");
                setIsActive(!isActive);
              }}
            >
              k50-Creative
            </div>
            <div
              className="item"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                setIsSelected(target.textContent || "");
                setIsActive(!isActive);
              }}
            >
              k50-Precise
            </div>
          </div>
        </div>
      </div>
      <div className="border border-timberwolf -mx-4 opacity-30" />
      <ul className="my-[18px] right-sidebar__list overflow-y-auto scrollbar-none">
        <li>
          <p>
            <span>Temperature</span>
            <span>{temperature}</span>
          </p>
          <RangeSlider
            className="single-thumb"
            value={[0, temperature]}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
            min={0}
            max={2}
            step={0.1}
            onInput={(value: number[]) => setTemperature(value[1])}
          />
        </li>
        <li>
          <p>
            <span>Max new tokens</span>
            <span>{max_tokens}</span>
          </p>
          <RangeSlider
            className="single-thumb"
            value={[0, max_tokens]}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
            min={10}
            max={2000}
            step={10}
            onInput={(value: number[]) => setMaxTokens(value[1])}
          />
        </li>
        <li>
          <p>
            <span>Top P</span>
            <span>{top_p}</span>
          </p>
          <RangeSlider
            className="single-thumb"
            value={[0, top_p]}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
            min={0}
            max={1}
            step={0.1}
            onInput={(value: number[]) => setTopP(value[1])}
          />
        </li>
        <li>
          <p>
            <span>Repetition Penalty</span>
            <span>{frequency_penalty}</span>
          </p>
          <RangeSlider
            className="single-thumb"
            value={[-2, frequency_penalty]}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
            min={-2}
            max={2}
            step={0.1}
            onInput={(value: number[]) => setFrequencyPenalty(value[1])}
          />
        </li>
        <li>
          <p>
            <span>Top K</span>
            <span>0.75</span>
          </p>
          <RangeSlider
            className="single-thumb"
            defaultValue={[0, 50]}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
          />
        </li>
        <li>
          <p>
            <span>Typical P</span>
            <span>0.75</span>
          </p>
          <RangeSlider
            className="single-thumb"
            defaultValue={[0, 50]}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
          />
        </li>
      </ul>
    </div>
  );
};

export default RightSidebar;
