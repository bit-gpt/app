import binRed from "assets/images/bin-red.svg";
import bin from "assets/images/bin.svg";
import edit from "assets/images/edit.svg";
import exportData from "assets/images/export-data.svg";
import importData from "assets/images/import-data.svg";
import msg from "assets/images/msg.svg";
import searchIcon from "assets/images/search.svg";
import clsx from "clsx";
import orderBy from "lodash/orderBy";
import WarningModal from "modules/service/components/WarningModal";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NoPrompts from "shared/components/NoPrompts";
import WarningIcon from "shared/components/WarningIcon";
import usePremChatStore from "shared/store/prem-chat";
import type { HamburgerMenuProps } from "shared/types";

import LeftSidebar from "../../../shared/components/LeftSidebar";

const PremChatSidebar = ({
  hamburgerMenuOpen,
  setHamburgerMenu,
  serviceId,
  serviceType,
  historyId,
}: HamburgerMenuProps) => {
  const history = usePremChatStore((state) => state.history);
  const deleteHistory = usePremChatStore((state) => state.deleteHistory);
  const clearHistory = usePremChatStore((state) => state.clearHistory);

  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [openWarningModal, setIsOpenWarningModal] = useState(false);

  const onDeleteClick = (id: string) => {
    deleteHistory(id);
    if (historyId === id) {
      navigate(`/prem-chat/${serviceId}/${serviceType}`);
    }
  };

  const onClearClick = () => {
    clearHistory(serviceId);
  };

  const filteredHistory = history.filter((item) => {
    return item.model === serviceId && item.title.toLowerCase().includes(search.toLowerCase());
  });

  const closeModal = () => {
    setIsOpenWarningModal(false);
  };

  const openModal = () => {
    setIsOpenWarningModal(true);
  };

  const createNewChatClick = () => {
    setHamburgerMenu(true);
    navigate(`/prem-chat/${serviceId}/${serviceType}`);
  };

  return (
    <>
      <LeftSidebar
        hamburgerMenuOpen={hamburgerMenuOpen}
        setHamburgerMenu={setHamburgerMenu}
        serviceId={serviceId}
        serviceType={serviceType}
      >
        <div className="flex md:mt-8 mt-6 mb-6 sidebar__search relative">
          <img
            src={searchIcon}
            alt="search"
            width={18}
            height={18}
            className="absolute left-[20px] md:top-[15px] top-[12px] max-md:max-w-[13px]"
          />
          <input
            className="w-full rounded-md mr-[6px] pr-5 pl-[44px] py-2"
            type="text"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={createNewChatClick}>
            <img className="max-md:max-w-[15px]" src={edit} alt="edit" width={18} height={18} />
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
                  className={clsx({ "bg-grey-900": historyId === item.id })}
                >
                  <Link to={`/prem-chat/${serviceId}/${serviceType}/${item.id}`}>
                    <img src={msg} alt="msg" width={18} height={18} className="mr-3" />
                    <span className="text-white">{item.title}</span>
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
          <div className="border-t border-timberwolf opacity-30 -mx-2 pt-[13px] max-md:hidden"></div>
          {filteredHistory.length > 0 && (
            <li>
              <Link to={`/prem-chat/${serviceId}/${serviceType}`} onClick={onClearClick}>
                <img src={binRed} alt="bin" className="mr-3 max-w-[20px]" />
                <span className="text-white">Clear Chat</span>
              </Link>
            </li>
          )}
          <li>
            <Link to={`/prem-chat/${serviceId}/${serviceType}`} onClick={openModal}>
              <img
                src={exportData}
                alt="exportData"
                width={20}
                height={20}
                className="mr-3 max-w-5"
              />
              <span className="text-white">Export data</span>
            </Link>
          </li>
          <li>
            <Link to={`/prem-chat/${serviceId}/${serviceType}`} onClick={openModal}>
              <img
                src={importData}
                alt="importData"
                width={20}
                height={20}
                className="mr-3 max-w-5"
              />
              <span className="text-white">Import data</span>
            </Link>
          </li>
        </ul>
      </LeftSidebar>
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
