import { useState } from "react";
import PremImageLeftSidebar from "./PremImageLeftSidebar";
import Header from "./Header";
import clsx from "clsx";
import PremImageRightSidebar from "./PremImageRightSidebar";
import PrimaryButton from "shared/components/PrimaryButton";
import usePremImage from "shared/hooks/usePremImage";
import DownloadIcon from "shared/components/DownloadIcon";
import DeleteIconNew from "shared/components/DeleteIconNew";

const PremImageContainer = () => {
  const [rightSidebar, setRightSidebar] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenu] = useState<boolean>(true);

  const { isLoading, onSubmit, prompt, setPrompt, images, n } = usePremImage();

  const generateImages = () => {
    console.log("generate images");
    if (!prompt) return;
    onSubmit();
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
            <div className="main-content h-full z-10 overflow-y-auto custom-scroll relative prem-img-services">
              <Header
                hamburgerMenuOpen={hamburgerMenuOpen}
                setHamburgerMenu={setHamburgerMenu}
                title={"Stable Diffusion 1.5"}
                setRightSidebar={setRightSidebar}
                rightSidebar={rightSidebar}
              />
              <div className="md:m-[50px] m-[25px] grid md:grid-cols-2 md:gap-10 gap-4">
                <div className="flex flex-col">
                  <span className="bg-darkcharcoal py-2 px-[14px] text-spanishgray font-proximaNova-regular w-[129px] rounded-tl rounded-tr">
                    Prompt
                  </span>
                  <textarea
                    className="py-2 px-4 text-ghostwhite rounded custom-scroll"
                    onChange={(e) => setPrompt(e.target.value)}
                    value={prompt}
                  ></textarea>
                </div>
                <div className="mt-auto">
                  <PrimaryButton
                    className="lg:!px-12 !px-6 !py-2 !text-sm"
                    onClick={generateImages}
                    disabled={isLoading || !prompt}
                  >
                    {isLoading ? `Generating ${n} Images` : `Generate Image`}
                  </PrimaryButton>
                </div>
              </div>
              <div className="prem-img-services__container">
                <div className="py-[30px] flex">
                  <PrimaryButton
                    className="!px-12 !py-2 !text-sm"
                    onClick={generateImages}
                    disabled={isLoading || !prompt}
                  >
                    {isLoading ? `Generating ${n} Images` : `Generate Image`}
                  </PrimaryButton>
                  <div className="ml-auto flex gap-6">
                    <button>
                      <DownloadIcon />
                    </button>
                    <button>
                      <DeleteIconNew />
                    </button>
                    <select>
                      <option>Matrix View</option>
                      <option>Matrix</option>
                      <option>Matrix View</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-[13px]">
                  {images.map((image, index) => {
                    return (
                      <div key={index}>
                        <img src={image.url} className="w-full" />
                      </div>
                    );
                  })}
                </div>
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
