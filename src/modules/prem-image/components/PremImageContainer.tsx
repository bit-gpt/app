import { useState } from "react";
import PremImageLeftSidebar from "./PremImageLeftSidebar";
import Header from "./Header";
import clsx from "clsx";
import PremImageRightSidebar from "./PremImageRightSidebar";
import PrimaryButton from "shared/components/PrimaryButton";
import usePremImage from "shared/hooks/usePremImage";

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
            <div className="main-content h-full z-10 relative max-h-full overflow-hidden ">
              <Header
                hamburgerMenuOpen={hamburgerMenuOpen}
                setHamburgerMenu={setHamburgerMenu}
                title={"Stable Diffusion 1.5"}
                setRightSidebar={setRightSidebar}
                rightSidebar={rightSidebar}
              />
              <div className="m-10 flex flex-col ">
                <textarea
                  className="p-2 rounded"
                  onChange={(e) => setPrompt(e.target.value)}
                  value={prompt}
                ></textarea>
                <div className="mt-3">
                  <PrimaryButton
                    className="!rounded-[14px] !px-5 !py-0 !text-[10px] !h-[30px] flex items-center"
                    onClick={generateImages}
                    disabled={isLoading || !prompt}
                  >
                    {isLoading ? `Generating ${n} Images` : `Generate Image`}
                  </PrimaryButton>
                </div>
              </div>
              <div className="flex flex-wrap">
                {images.map((image, index) => {
                  return (
                    <div key={index} className="m-10">
                      <img src={image.url} />
                    </div>
                  );
                })}
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
