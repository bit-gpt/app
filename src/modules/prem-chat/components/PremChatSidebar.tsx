import leftArrow from "assets/images/arrow.svg";
import binRed from "assets/images/bin-red.svg";
import bin from "assets/images/bin.svg";
import cross from "assets/images/cross.svg";
import edit from "assets/images/edit.svg";
import exportData from "assets/images/export-data.svg";
import importData from "assets/images/import-data.svg";
import Logo from "assets/images/logo.svg";
import msg from "assets/images/msg.svg";
import searchIcon from "assets/images/search.svg";
import clsx from "clsx";
import orderBy from "lodash/orderBy";
import WarningModal from "modules/service/components/WarningModal";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NoPrompts from "shared/components/NoPrompts";
import WarningIcon from "shared/components/WarningIcon";
import usePremChatStore from "shared/store/prem-chat";
import type { HamburgerMenuProps } from "shared/types";
import { shallow } from "zustand/shallow";

const PremChatSidebar = ({ setHamburgerMenu }: HamburgerMenuProps) => {
  // TODO: shallow will only check for reference equality, not deep equality
  const { history, deleteHistory, clearHistory } = usePremChatStore(
    (state) => ({
      history: state.history,
      deleteHistory: state.deleteHistory,
      clearHistory: state.clearHistory,
    }),
    shallow,
  );

  const [search, setSearch] = useState("");

  const { chatId, serviceId } = useParams();
  const navigate = useNavigate();
  const [openWarningModal, setIsOpenWarningModal] = useState(false);

  const onDeleteClick = (id: string) => {
    deleteHistory(id);
    if (chatId === id) {
      navigate(`/prem-chat/${serviceId}`);
    }
  };

  const onClearClick = () => {
    clearHistory();
  };

  const filteredHistory = history.filter((item) => {
    return item.title.toLowerCase().includes(search.toLowerCase());
  });

  const onCloseClick = () => {
    navigate("/");
  };

  const closeModal = () => {
    setIsOpenWarningModal(false);
  };

  const openModal = () => {
    setIsOpenWarningModal(true);
  };

  const createNewChatClick = () => {
    setHamburgerMenu(true);
    navigate(`/prem-chat/${serviceId}`);
  };

  return (
    <>
      <div className="md:pt-7 pt-[22px] pb-[10px] flex-col px-2 flex md:h-screen sidebar md:!w-[259px]">
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
        <div className="flex md:mt-8 mt-6 mb-6 sidebar__search relative">
          <img
            src={searchIcon}
            alt="search"
            width={18}
            height={18}
            className="absolute left-[20px] md:top-[15px] top-[12px] maxMd:max-w-[13px]"
          />
          <input
            className="w-full rounded-md mr-[6px] pr-5 pl-[44px] py-2"
            type="text"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={createNewChatClick}>
            <img className="maxMd:max-w-[15px]" src={edit} alt="edit" width={18} height={18} />
          </button>
        </div>
        <div className="overflow-y-auto overflow-x-hidden flex flex-col flex-grow">
          {history.length === 0 && <NoPrompts text="No Chat" />}
          <ul className="md:flex-grow scrollbar-none w-full">
            {orderBy(filteredHistory, "timestamp", "desc").map((item) => {
              return (
                <li
                  onClick={() => setHamburgerMenu(true)}
                  key={item.id}
                  className={clsx({ "md:bg-darkjunglegreen bg-[#1A1E23]": chatId === item.id })}
                >
                  <Link to={`/prem-chat/${serviceId}/${item.id}`}>
                    <img src={msg} alt="msg" width={18} height={18} className="mr-3" />
                    <span>{item.title}</span>
                  </Link>
                  <button onClick={() => onDeleteClick(item.id)}>
                    <img src={bin} alt="bin" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <ul>
          <div className="border-t border-timberwolf opacity-30 -mx-2 pt-[13px] maxMd:hidden"></div>
          {filteredHistory.length > 0 && (
            <li>
              <Link to={`/prem-chat/${serviceId}`} onClick={onClearClick}>
                <img src={binRed} alt="bin" className="mr-3 max-w-[20px]" />
                <span>Clear Chat</span>
              </Link>
            </li>
          )}
          <li>
            <Link to={`/prem-chat/${serviceId}`} onClick={openModal}>
              <img
                src={exportData}
                alt="exportData"
                width={20}
                height={20}
                className="mr-3 max-w-[20px]"
              />
              <span>Export data</span>
            </Link>
          </li>
          <li>
            <Link to={`/prem-chat/${serviceId}`} onClick={openModal}>
              <img
                src={importData}
                alt="importData"
                width={20}
                height={20}
                className="mr-3 max-w-[20px]"
              />
              <span>Import data</span>
            </Link>
          </li>
        </ul>
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

export default PremChatSidebar;
