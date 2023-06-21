import { Link, useNavigate, useParams } from "react-router-dom";
import Logo from "assets/images/logo.svg";
import leftArrow from "assets/images/arrow.svg";
import cross from "assets/images/cross.svg";
import { HamburgerMenuProps } from "shared/types";
import { shallow } from "zustand/shallow";
import usePremImageStore from "shared/store/prem-image";
import { orderBy } from "lodash";
import clsx from "clsx";
import { format, parseISO } from "date-fns";
import LeftArrowIcon from "shared/components/LeftArrowIcon";

const PremImageLeftSidebar = ({ setHamburgerMenu }: HamburgerMenuProps) => {
  const navigate = useNavigate();
  const { historyId } = useParams();
  const { history } = usePremImageStore(
    (state) => ({
      history: state.history,
    }),
    shallow
  );

  const onCloseClick = () => {
    navigate("/");
  };

  return (
    <>
      <div className="md:pt-7 !bg-darkgunmetal pt-[22px] pb-[10px] flex-col px-2 flex md:h-screen sidebar md:!w-[259px]">
        <div className="flex max-md:flex-wrap md:gap-4">
          <button className="mx-2" onClick={onCloseClick}>
            <img src={leftArrow} alt="left-arrow" className="max-md:max-w-[15px]" />
          </button>
          <img className="sidebar__logo" src={Logo} alt="logo" />
          <button
            onClick={() => setHamburgerMenu(true)}
            className="w-[30px] md:hidden z-[11] fixed right-[14px] top-[24px]"
          >
            <img src={cross} alt="cross" width={22} height={22} className="mx-auto" />
          </button>
        </div>
        <div className="prem-image-sidebar custom-scroll">
          <ul className="md:flex-grow scrollbar-none w-full">
            {orderBy(history, "timestamp", "desc").map((item) => {
              return (
                <li
                  key={item.id}
                  className={clsx({ "md:bg-darkjunglegreen bg-[#1A1E23]": historyId === item.id })}
                >
                  <Link to={`/prem-image/${item.id}`}>
                    <span className="text-white">
                      {format(parseISO(item.timestamp), "LLLL dd, hh:mm a")}
                    </span>
                    <div className="flex flex-wrap gap-[2px] mt-[11px]">
                      {item.images?.map((image, index) => {
                        return <img key={index} src={image} className="w-8 h-8" />;
                      })}
                    </div>
                  </Link>
                  <span className="text-[#58595E]">{item.images.length}&nbsp;images</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="sidebar-toggle__btn !mt-5 !-mx-2 px-5 border-t pt-4 pb-2 close-sidebar">
          <button onClick={onCloseClick} className="bg-Onyx px-[8.4px] mr-3 py-[10px] rounded-md">
            <LeftArrowIcon />
          </button>
          <span>Close Sidebar</span>
        </div>
      </div>
    </>
  );
};

export default PremImageLeftSidebar;
