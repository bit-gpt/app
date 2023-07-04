import { useState } from "react";
import PremImageLeftSidebar from "./PremImageLeftSidebar";
import Header from "./Header";
import clsx from "clsx";
import PremImageRightSidebar from "./PremImageRightSidebar";
import PrimaryButton from "shared/components/PrimaryButton";
import usePremImage from "shared/hooks/usePremImage";
import DownloadIcon from "shared/components/DownloadIcon";
import DeleteIconNew from "shared/components/DeleteIconNew";
import { useNavigate } from "react-router-dom";
import PremImagePromptBox from "./PremImagePromptBox";
import { PremImageContainerProps } from "../types";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const PremImageContainer = ({ serviceName, historyId, serviceId }: PremImageContainerProps) => {
  const [rightSidebar, setRightSidebar] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenu] = useState<boolean>(true);

  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const {
    isLoading,
    onSubmit,
    prompt,
    setPrompt,
    currentHistory,
    n,
    deleteHistory,
    negativePrompt,
    setNegativePrompt,
  } = usePremImage(serviceId, historyId);

  const generateImages = () => {
    if (!prompt) return;
    onSubmit();
  };

  const onDeleteClick = () => {
    deleteHistory(historyId as string);
    navigate(`/prem-image/${serviceId}`);
  };

  const handleClickOnImg = (index: number) => {
    setIndex(index);
    setOpen(true);
  };

  return (
    <section>
      <div className="md:flex md:h-screen w-full relative">
        <div
          className={clsx("prem-chat-sidebar md:relative", hamburgerMenuOpen && "max-md:hidden")}
        >
          <PremImageLeftSidebar setHamburgerMenu={setHamburgerMenu} />
        </div>
        <div className="flex flex-1">
          <div className="bg-lines bg-darkjunglegreen relative h-full w-full">
            <div className="main-content h-full z-10 overflow-y-auto custom-scroll relative prem-img-services min-h-screen">
              <Header
                hamburgerMenuOpen={hamburgerMenuOpen}
                setHamburgerMenu={setHamburgerMenu}
                title={serviceName}
                setRightSidebar={setRightSidebar}
                rightSidebar={rightSidebar}
              />
              <PremImagePromptBox
                prompt={prompt}
                setPrompt={setPrompt}
                negativePrompt={negativePrompt}
                setNegativePrompt={setNegativePrompt}
              />
              <div className="prem-img-services__container">
                <div className="py-[30px] flex flex-wrap max-md:gap-2">
                  <PrimaryButton
                    className={clsx("!px-12 !py-2 !text-sm", {
                      "opacity-50": !prompt,
                      "animate-fill-effect": isLoading,
                    })}
                    onClick={generateImages}
                    disabled={isLoading || !prompt}
                  >
                    {isLoading ? `Generating ${n} Images` : `Generate Image`}
                  </PrimaryButton>
                  {currentHistory && (
                    <div className="ml-auto flex gap-4">
                      <button className="px-2" onClick={onDeleteClick}>
                        <DeleteIconNew />
                      </button>
                    </div>
                  )}
                </div>
                <div className="gallery gap-[13px]">
                  {currentHistory?.images.map((image, index: number) => {
                    return (
                      <div
                        onClick={() => handleClickOnImg(index)}
                        data-cols={index}
                        className={clsx("relative prem-img__box", {
                          [`gridcol${index + 1}`]: index > 0,
                        })}
                        key={index}
                      >
                        <img src={image} className="w-full  " />
                        <a href={image} download>
                          <DownloadIcon />
                        </a>
                      </div>
                    );
                  })}
                </div>
                <Lightbox
                  open={open}
                  close={() => setOpen(false)}
                  slides={currentHistory?.images.map((img) => ({ src: img }))}
                  index={index}
                />
              </div>
            </div>
          </div>
        </div>
        <div>{rightSidebar && <PremImageRightSidebar setRightSidebar={setRightSidebar} />}</div>
      </div>
    </section>
  );
};

export default PremImageContainer;
