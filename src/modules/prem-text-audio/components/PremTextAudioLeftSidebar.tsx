import leftArrow from "assets/images/arrow.svg";
import cross from "assets/images/cross.svg";
import Logo from "assets/images/logo.svg";
import clsx from "clsx";
import { orderBy } from "lodash";
import { Link, useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "shared/components/DeleteIcon";
import NoPrompts from "shared/components/NoPrompts";
import usePremTextAudioStore from "shared/store/prem-text-audio";
import type { HamburgerMenuProps } from "shared/types";
import { shallow } from "zustand/shallow";

const PremTextAudioLeftSidebar = ({ setHamburgerMenu }: HamburgerMenuProps) => {
  const navigate = useNavigate();
  const { serviceId, historyId } = useParams();
  const { history, deleteHistory } = usePremTextAudioStore(
    (state) => ({
      history: state.history,
      deleteHistory: state.deleteHistory,
    }),
    shallow,
  );

  const onCloseClick = () => {
    navigate("/");
  };

  const onDeleteClick = (id: string) => {
    deleteHistory(id);
    if (historyId === id) {
      navigate(`/prem-text-audio/${serviceId}`);
    }
  };

  return (
    <>
      <div className="md:pt-7 !bg-darkgunmetal pt-[22px] pb-[10px] flex-col px-2 flex md:h-screen sidebar md:!w-[259px]">
        <div className="flex maxMd:flex-wrap md:gap-4">
          <button className="mx-2" onClick={onCloseClick}>
            <img src={leftArrow} alt="left-arrow" className="maxMd:max-w-[15px]" />
          </button>
          <img className="sidebar__logo" src={Logo} alt="logo" />
          <button
            onClick={() => setHamburgerMenu(true)}
            className="w-[30px] md:hidden z-[11] fixed right-[14px] top-[24px]"
          >
            <img src={cross} alt="cross" width={22} height={22} className="mx-auto" />
          </button>
        </div>
        {history.length === 0 && <NoPrompts text="No Audio" />}
        <div className="mt-10 overflow-y-auto custom-scroll">
          <ul className="md:flex-grow scrollbar-none w-full">
            {orderBy(history, "timestamp", "desc").map((item) => {
              return (
                <li
                  key={item.id}
                  className={clsx({ "md:bg-darkjunglegreen bg-[#1A1E23]": historyId === item.id })}
                >
                  <Link to={`/prem-text-audio/${serviceId}/${item.id}`}>
                    <span className="text-white" title={item.prompt}>
                      {item.file}
                    </span>
                  </Link>
                  <button onClick={() => onDeleteClick(item.id)}>
                    <DeleteIcon />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PremTextAudioLeftSidebar;
