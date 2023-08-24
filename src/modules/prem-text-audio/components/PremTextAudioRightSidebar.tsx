import LeftArrowIcon from "shared/components/LeftArrowIcon";
import type { RightSidebarProps } from "shared/types";

const PremTextAudioRightSidebar = ({ setRightSidebar }: RightSidebarProps) => {
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
    </div>
  );
};

export default PremTextAudioRightSidebar;
