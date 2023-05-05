import React, { useState } from "react";
import leftArrow from "../../assets/images/left-arrow.svg";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

const RightSidebar = ({ setRightSidebar }: any) => {
  const [isActive, setIsActive] = useState(false);
  const [selected, setIsSelected] = useState("k50");

  return (
    <div className="bg-darkgunmetal flex-col px-4 flex h-screen w-[260px]">
      <div className="sidebar-toggle__btn !mt-5 !ml-3">
        <button
          onClick={() => setRightSidebar(false)}
          className="bg-Onyx px-[8.4px] mr-3 -ml-[6px] py-[10px] rounded-md"
        >
          <img src={leftArrow} alt="leftArrow" width={16} height={16} />
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
                setIsSelected(e.target.textContent);
                setIsActive(!isActive);
              }}
              className="item"
            >
              k50
            </div>
            <div
              className="item"
              onClick={(e) => {
                setIsSelected(e.target.textContent);
                setIsActive(!isActive);
              }}
            >
              k50-Creative
            </div>
            <div
              className="item"
              onClick={(e) => {
                setIsSelected(e.target.textContent);
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
            <span>0.75</span>
          </p>
          <RangeSlider
            // className="single-thumb"
            defaultValue={[0, 50]}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
          />
        </li>
        <li>
          <p>
            <span>Max new tokens</span>
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
            <span>Top P</span>
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
            <span>Repetition Penalty</span>
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
