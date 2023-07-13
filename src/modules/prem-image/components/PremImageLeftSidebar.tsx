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
import { useMediaQuery } from "usehooks-ts";

const PremImageLeftSidebar = ({ setHamburgerMenu }: HamburgerMenuProps) => {
  const navigate = useNavigate();
  const { serviceId, historyId } = useParams();
  const responsiveMatches = useMediaQuery("(max-width: 767px)");
  const { history } = usePremImageStore(
    (state) => ({
      history: state.history,
    }),
    shallow
  );

  const onCloseClick = () => {
    navigate("/");
  };

  const scrollToTop = () => {
    {
      responsiveMatches && setHamburgerMenu(true);
    }
    document
      .querySelector(".prem-img-promptbox")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
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
        <div className="prem-image-sidebar custom-scroll">
          <ul className="md:flex-grow scrollbar-none w-full">
            {orderBy(history, "timestamp", "desc").map((item) => {
              return (
                <li
                  onClick={scrollToTop}
                  key={item.id}
                  className={clsx({ "md:bg-darkjunglegreen bg-[#1A1E23]": historyId === item.id })}
                >
                  <Link to={`/prem-image/${serviceId}/${item.id}`}>
                    <div className="flex w-full">
                      <div>
                        <span className="text-white">
                          {format(parseISO(item.timestamp), "LLLL dd, hh:mm a")}
                        </span>
                        <div className="flex flex-wrap gap-[2px] mt-[11px]">
                          {item.images?.map((image, index) => {
                            return <img key={index} src={image} className="w-8 h-8" />;
                          })}
                        </div>
                      </div>
                      <span className="text-[#58595E] text-end">
                        {item.images.length}&nbsp;images
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PremImageLeftSidebar;
