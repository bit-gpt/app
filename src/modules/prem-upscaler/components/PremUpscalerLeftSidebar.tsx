import clsx from "clsx";
import { orderBy } from "lodash";
import { Link, useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "shared/components/DeleteIcon";
import NoPrompts from "shared/components/NoPrompts";
import usePremUpscalerStore from "shared/store/prem-upscaler";
import type { HamburgerMenuProps } from "shared/types";
import { useMediaQuery } from "usehooks-ts";
import { shallow } from "zustand/shallow";

import LeftSidebar from "../../../shared/components/LeftSidebar";

const PremUpscalerLeftSidebar = ({ setHamburgerMenu }: HamburgerMenuProps) => {
  const navigate = useNavigate();
  const { serviceId, serviceType, historyId } = useParams();
  const responsiveMatches = useMediaQuery("(max-width: 767px)");
  const { history, deleteHistory } = usePremUpscalerStore(
    (state) => ({
      history: state.history,
      deleteHistory: state.deleteHistory,
    }),
    shallow,
  );

  const onDeleteClick = (id: string) => {
    deleteHistory(id);
    if (historyId === id) {
      navigate(`/prem-upscaler/${serviceId}/${serviceType}`);
    }
  };

  return (
    <LeftSidebar setHamburgerMenu={setHamburgerMenu}>
      {history.length === 0 && <NoPrompts text="No Images" />}
      <div className="mt-10 overflow-y-auto custom-scroll">
        <ul className="md:flex-grow scrollbar-none w-full">
          {orderBy(history, "timestamp", "desc").map((item) => {
            return (
              <li
                onClick={() => responsiveMatches && setHamburgerMenu(true)}
                key={item.id}
                className={clsx({ "bg-grey-900": historyId === item.id })}
              >
                <Link to={`/prem-upscaler/${serviceId}/${item.id}`}>
                  <span className="text-white">{item.name}</span>
                </Link>
                <button onClick={() => onDeleteClick(item.id)}>
                  <DeleteIcon />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </LeftSidebar>
  );
};

export default PremUpscalerLeftSidebar;
