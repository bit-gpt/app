import LeftArrowIcon from "shared/components/LeftArrowIcon";
import RangeSlider from "shared/components/RangeSlider";
import usePremImageStore from "shared/store/prem-image";
import type { RightSidebarProps } from "shared/types";
import { shallow } from "zustand/shallow";

const PremImageRightSidebar = ({ setRightSidebar, isLoading }: RightSidebarProps) => {
  const { n, setN, seed, setSeed } = usePremImageStore(
    (state) => ({
      n: state.n,
      setN: state.setN,
      seed: state.seed,
      setSeed: state.setSeed,
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
            <span>Image Count</span>
            <span>{n}</span>
          </p>
          <RangeSlider
            className="range-slider__bar"
            value={[0, n]}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
            min={1}
            max={4}
            step={1}
            onInput={(value: number[]) => setN(value[1])}
            disabled={isLoading}
          />
        </li>
        <li>
          <p>
            <span>Seed</span>
            <input
              name="seed"
              type="number"
              min={0}
              max={1000000}
              value={seed}
              onChange={(e) => setSeed(+e.target.value)}
            />
          </p>
        </li>
      </ul>
    </div>
  );
};

export default PremImageRightSidebar;
