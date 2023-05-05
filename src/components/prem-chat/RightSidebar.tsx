import React from "react";
import leftArrow from "../../assets/images/left-arrow.svg";

const RightSidebar = () => {
  return (
    <div className="bg-darkgunmetal flex-col px-4 flex h-screen">
      <div className="sidebar-toggle__btn !mt-5 !ml-3">
        <button
          // onClick={() => setSidebarToggle(!sidebarToggle)}
          className="bg-Onyx px-[8.4px] mr-3 -ml-[6px] py-[10px] rounded-md"
        >
          <img src={leftArrow} alt="leftArrow" width={16} height={16} />
        </button>
        <span>Close Sidebar</span>
      </div>
      <div className="my-[18px]">
        <p className="text-spanishgray text-base font-proximaNova-regular mb-[18px]">
          Preset
        </p>
        <p className="flex items-center justify-between text-white text-base font-proximaNova-regular">
          k50
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
              stroke-width="1.76786"
            />
          </svg>
        </p>
      </div>
      <ul className="my-[18px] right-sidebar__list">
        <li>
          <p>
            <span>Temperature</span>
            <span>0.75</span>
          </p>
          <div className="progress-bar">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: "45%" }}
            ></div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default RightSidebar;
