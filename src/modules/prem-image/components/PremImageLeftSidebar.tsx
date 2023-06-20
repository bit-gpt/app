import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "assets/images/logo.svg";
import leftArrow from "assets/images/arrow.svg";
import cross from "assets/images/cross.svg";
import WarningModal from "modules/service/components/WarningModal";
import WarningIcon from "shared/components/WarningIcon";
import { HamburgerMenuProps } from "shared/types";
import { shallow } from "zustand/shallow";
import usePremImageStore from "shared/store/prem-image";
import { reverse } from "lodash";
import clsx from "clsx";

const PremImageLeftSidebar = ({ setHamburgerMenu }: HamburgerMenuProps) => {
  const navigate = useNavigate();
  const [openWarningModal, setIsOpenWarningModal] = useState(false);
  const { history } = usePremImageStore(
    (state) => ({
      history: state.history,
    }),
    shallow
  );

  const onCloseClick = () => {
    navigate("/");
  };

  const closeModal = () => {
    setIsOpenWarningModal(false);
  };

  const chatId = null;
  return (
    <>
      <div className="md:pt-7 pt-[22px] pb-[10px] flex-col px-2 flex md:h-screen sidebar md:!w-[259px]">
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
        <div className="overflow-y-auto custom-scroll overflow-x-hidden flex flex-col">
          <ul className="md:flex-grow scrollbar-none w-full">
            {reverse(history).map((item) => {
              return (
                <li
                  key={item.id}
                  className={clsx({ "md:bg-darkjunglegreen bg-[#1A1E23]": chatId === item.id })}
                >
                  <span className="text-white">{item.timestamp}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <WarningModal
        description="Import / Export is not available yet"
        title="Coming Soon"
        isOpen={openWarningModal}
        onCancel={closeModal}
        onOk={closeModal}
        icon={<WarningIcon />}
      />
    </>
  );
};

export default PremImageLeftSidebar;