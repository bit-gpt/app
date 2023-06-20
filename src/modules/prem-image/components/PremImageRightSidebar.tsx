import { shallow } from "zustand/shallow";
import LeftArrowIcon from "shared/components/LeftArrowIcon";
import { PremImageSize, RightSidebarProps } from "shared/types";
import usePremImageStore from "shared/store/prem-image";
import RangeSlider from "shared/components/RangeSlider";

const PremImageRightSidebar = ({ setRightSidebar }: RightSidebarProps) => {
  const { n, setN, size, setSize } = usePremImageStore(
    (state) => ({
      n: state.n,
      setN: state.setN,
      size: state.size,
      setSize: state.setSize,
    }),
    shallow
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
        <span>Close Sidebar</span>
      </div>
      <div className="-mx-4 opacity-30" />
      <ul className="mb-[18px] mt-[42px] right-sidebar__list overflow-y-auto scrollbar-none">
        <li>
          <p>
            <span>Image Count</span>
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
            <span>Size</span>
            <select value={size} onChange={(e) => setSize(e.target.value as PremImageSize)}>
              <option value="256x256">256x256</option>
              <option value="512x512">512x512</option>
              <option value="1024x1024">1024x1024</option>
            </select>
          </p>
        </li>
      </ul>
    </div>
  );
};

export default PremImageRightSidebar;
