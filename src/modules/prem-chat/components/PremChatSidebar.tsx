import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import orderBy from "lodash/orderBy";
import { shallow } from "zustand/shallow";
import usePremChatStore from "shared/store/prem-chat";
import Logo from "assets/images/logo.svg";
import brandLogo from "assets/images/brand-logo.svg";
import cross from "assets/images/arrow.svg";
import edit from "assets/images/edit.svg";
import msg from "assets/images/msg.svg";
import searchIcon from "assets/images/search.svg";
import exportData from "assets/images/export-data.svg";
import importData from "assets/images/import-data.svg";

const PremChatSidebar = () => {
  const { history, deleteHistory, clearHistory } = usePremChatStore(
    (state) => ({
      history: state.history,
      deleteHistory: state.deleteHistory,
      clearHistory: state.clearHistory,
    }),
    shallow
  );

  const [search, setSearch] = useState("");
  const [sidebarToggle, setSidebarToggle] = useState(false);

  const { chatId, serviceId } = useParams();
  const navigate = useNavigate();

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

  return (
    <div className="pt-[18px] pb-[10px] flex-col px-2 flex h-screen sidebar md:!w-[259px]">
      <div className={clsx(sidebarToggle ? "flex-col flex" : "flex max-md:flex-wrap max-md:gap-4")}>
        <button className={clsx(sidebarToggle ? "mx-auto my-5" : "mx-2")} onClick={onCloseClick}>
          <img src={cross} alt="cross-logo" />
        </button>
        <img className="sidebar__logo max-md:hidden" src={Logo} alt="logo" />
        <img className={clsx(!sidebarToggle && "md:hidden")} src={brandLogo} alt="brandLogo" />
      </div>
      <div className="flex mt-8 sidebar__search relative">
        <img
          src={searchIcon}
          alt="search"
          width={18}
          height={18}
          className="absolute left-[20px] top-[15px]"
        />
        <input
          className="h-[50px] w-full rounded-md mr-[6px] pr-5 pl-[44px] py-2"
          type="text"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => navigate(`/prem-chat/${serviceId}`)}>
          <img src={edit} alt="edit" width={18} height={18} />
        </button>
      </div>

      <ul className="my-6 overflow-y-auto flex-grow scrollbar-none">
        {orderBy(filteredHistory, "timestamp", "desc").map((item) => {
          return (
            <li key={item.id} className={clsx({ "bg-darkjunglegreen": chatId === item.id })}>
              <Link to={`/prem-chat/${serviceId}/${item.id}`}>
                <img
                  src={msg}
                  alt="msg"
                  width={18}
                  height={18}
                  className={clsx(!sidebarToggle && "mr-3")}
                />
                <span>{item.title}</span>
              </Link>
              <button onClick={() => onDeleteClick(item.id)}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.20703 4.61902H3.67793H15.4451"
                    stroke="white"
                    strokeWidth="1.4709"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.974 4.61917V14.9155C13.974 15.3056 13.8191 15.6797 13.5432 15.9555C13.2674 16.2314 12.8932 16.3864 12.5031 16.3864H5.14863C4.75853 16.3864 4.3844 16.2314 4.10855 15.9555C3.8327 15.6797 3.67773 15.3056 3.67773 14.9155V4.61917M5.88408 4.61917V3.14827C5.88408 2.75816 6.03905 2.38403 6.3149 2.10818C6.59075 1.83234 6.96488 1.67737 7.35498 1.67737H10.2968C10.6869 1.67737 11.061 1.83234 11.3369 2.10818C11.6127 2.38403 11.7677 2.75816 11.7677 3.14827V4.61917"
                    stroke="white"
                    strokeWidth="1.4709"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.35352 8.29639V12.7091"
                    stroke="white"
                    strokeWidth="1.4709"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.2969 8.29639V12.7091"
                    stroke="white"
                    strokeWidth="1.4709"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>
      <ul>
        <div className="border-t border-timberwolf opacity-30 -mx-2 pt-[13px]"></div>
        {filteredHistory.length > 0 && (
          <li>
            <Link to={`/prem-chat/${serviceId}`} onClick={onClearClick}>
              <svg
                className={clsx(!sidebarToggle && "mr-3 max-w-[20px]")}
                width="20"
                height="20"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.20703 4.61902H3.67793H15.4451"
                  stroke="#D45118"
                  strokeWidth="1.4709"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.974 4.61917V14.9155C13.974 15.3056 13.8191 15.6797 13.5432 15.9555C13.2674 16.2314 12.8932 16.3864 12.5031 16.3864H5.14863C4.75853 16.3864 4.3844 16.2314 4.10855 15.9555C3.8327 15.6797 3.67773 15.3056 3.67773 14.9155V4.61917M5.88408 4.61917V3.14827C5.88408 2.75816 6.03905 2.38403 6.3149 2.10818C6.59075 1.83234 6.96488 1.67737 7.35498 1.67737H10.2968C10.6869 1.67737 11.061 1.83234 11.3369 2.10818C11.6127 2.38403 11.7677 2.75816 11.7677 3.14827V4.61917"
                  stroke="#D45118"
                  strokeWidth="1.4709"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.35352 8.29639V12.7091"
                  stroke="#D45118"
                  strokeWidth="1.4709"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.2969 8.29639V12.7091"
                  stroke="#D45118"
                  strokeWidth="1.4709"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Clear Chat</span>
            </Link>
          </li>
        )}
        <li>
          <Link to={`/prem-chat/${serviceId}`}>
            <img
              src={exportData}
              alt="exportData"
              width={20}
              height={20}
              className={clsx(!sidebarToggle && "mr-3 max-w-[20px]")}
            />

            <span>Export data</span>
          </Link>
        </li>
        <li>
          <Link to={`/prem-chat/${serviceId}`}>
            <img
              src={importData}
              alt="importData"
              width={20}
              height={20}
              className={clsx(!sidebarToggle && "mr-3 max-w-[20px]")}
            />
            <span>Import data</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default PremChatSidebar;
