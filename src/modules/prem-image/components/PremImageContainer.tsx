import clsx from "clsx";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteIconNew from "shared/components/DeleteIconNew";
import DownloadIcon from "shared/components/DownloadIcon";
import usePremImage from "shared/hooks/usePremImage";
import { useMediaQuery } from "usehooks-ts";
import Lightbox from "yet-another-react-lightbox";
import Inline from "yet-another-react-lightbox/plugins/inline";

import type { PremImageContainerProps } from "../types";

import Header from "./Header";
import PremImageLeftSidebar from "./PremImageLeftSidebar";
import PremImagePromptBox from "./PremImagePromptBox";
import PremImageRightSidebar from "./PremImageRightSidebar";

import "yet-another-react-lightbox/styles.css";

const PremImageContainer = ({
  serviceName,
  historyId,
  serviceId,
  serviceType,
}: PremImageContainerProps) => {
  const [rightSidebar, setRightSidebar] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenu] = useState<boolean>(true);
  const responsiveMatches = useMediaQuery("(max-width: 767px)");
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const {
    isPending,
    onSubmit,
    prompt,
    setPrompt,
    currentHistory,
    deleteHistory,
    negativePrompt,
    setNegativePrompt,
    file,
    setFile,
  } = usePremImage(serviceId, serviceType, historyId);

  const onDeleteClick = () => {
    deleteHistory(historyId as string);
    navigate(`/prem-image/${serviceId}/${serviceType}`);
  };

  const handleClickOnImg = (index: number) => {
    setIndex(index);
    setOpen(true);
  };

  const generateImages = useCallback(() => {
    if (!prompt) return;
    onSubmit();
  }, [prompt, onSubmit]);

  const plugins = responsiveMatches ? [Inline] : [];

  return (
    <section>
      <div className="md:flex md:h-screen w-full relative">
        <PremImageLeftSidebar
          hamburgerMenuOpen={hamburgerMenuOpen}
          setHamburgerMenu={setHamburgerMenu}
          serviceId={serviceId}
          serviceType={serviceType}
          historyId={historyId ?? ""}
        />
        <div className="flex flex-1">
          <div className="bg-lines bg-grey-900 relative h-full w-full">
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
                isPending={isPending}
                generateImages={generateImages}
                setFile={setFile}
                file={file}
              />

              <div className="prem-img-services__container">
                {currentHistory && (
                  <div className="ml-auto text-right py-4">
                    <button className="px-2" onClick={onDeleteClick}>
                      <DeleteIconNew />
                    </button>
                  </div>
                )}
                <div className="gallery gap-[13px] max-md:hidden">
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
                        <img src={image} className="w-full" alt="" />
                        <a href={image} download onClick={(e) => e.stopPropagation()}>
                          <DownloadIcon />
                        </a>
                      </div>
                    );
                  })}
                </div>
                {currentHistory !== undefined && (
                  <Lightbox
                    plugins={plugins}
                    inline={{ style: { width: "100%", aspectRatio: "3 / 2" } }}
                    open={open}
                    close={() => setOpen(false)}
                    slides={currentHistory?.images?.map((img) => ({ src: img }))}
                    index={index}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          {rightSidebar && (
            <PremImageRightSidebar isLoading={isPending} setRightSidebar={setRightSidebar} />
          )}
        </div>
      </div>
    </section>
  );
};

export default PremImageContainer;
