import clsx from "clsx";
import { format, parseISO } from "date-fns";
import { orderBy } from "lodash";
import { Link } from "react-router-dom";
import NoPrompts from "shared/components/NoPrompts";
import usePremImageStore from "shared/store/prem-image";
import { useMediaQuery } from "usehooks-ts";
import { shallow } from "zustand/shallow";

import LeftSidebar from "../../../shared/components/LeftSidebar";
import type { HamburgerMenuProps } from "../../../shared/types";

const PremImageLeftSidebar = ({
  hamburgerMenuOpen,
  setHamburgerMenu,
  serviceId,
  serviceType,
  historyId,
}: HamburgerMenuProps) => {
  const responsiveMatches = useMediaQuery("(max-width: 767px)");
  const { history } = usePremImageStore(
    (state) => ({
      history: state.history,
    }),
    shallow,
  );

  const scrollToTop = () => {
    responsiveMatches && setHamburgerMenu(true);
    document
      .querySelector(".prem-img-promptbox")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <LeftSidebar
      hamburgerMenuOpen={hamburgerMenuOpen}
      setHamburgerMenu={setHamburgerMenu}
      serviceId={serviceId}
      serviceType={serviceType}
    >
      {history.length === 0 && <NoPrompts text="No Image" />}
      <div className="prem-image-sidebar custom-scroll">
        <ul className="md:flex-grow scrollbar-none w-full">
          {orderBy(history, "timestamp", "desc").map((item) => {
            return (
              <li
                onClick={scrollToTop}
                key={item.id}
                className={clsx({ "bg-grey-900": historyId === item.id })}
              >
                <Link to={`/prem-image/${serviceId}/${item.id}`}>
                  <div className="flex w-full">
                    <div>
                      <span className="text-white">
                        {format(parseISO(item.timestamp), "LLLL dd, hh:mm a")}
                      </span>
                      <div className="flex flex-wrap gap-[2px] mt-[11px]">
                        {item.images?.map((image, index) => {
                          return <img key={index} src={image} className="w-8 h-8" alt="" />;
                        })}
                      </div>
                    </div>
                    <span className="text-grey-600 text-end">{item.images.length}&nbsp;images</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </LeftSidebar>
  );
};

export default PremImageLeftSidebar;
