import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import PrimaryButton from "shared/components/PrimaryButton";
import usePremAudio from "shared/hooks/usePremAudio";
import PremImageLeftSidebar from "./PremAudioLeftSidebar";
import Header from "./Header";
import PremImageRightSidebar from "./PremAudioRightSidebar";
import { PremAudioContainerProps } from "../types";

const PremAudioContainer = ({ serviceName, historyId, serviceId }: PremAudioContainerProps) => {
  const [rightSidebar, setRightSidebar] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenu] = useState<boolean>(true);

  const { isLoading, onSubmit, file, setFile, currentHistory } = usePremAudio(serviceId, historyId);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: {
    'audio/*': ['.mp3', '.wav']
  } });

  const generateTranscriptions = () => {
    if (!file) return;
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
            <div className="main-content h-full z-10 overflow-y-auto custom-scroll relative prem-img-services min-h-screen">
              <Header
                hamburgerMenuOpen={hamburgerMenuOpen}
                setHamburgerMenu={setHamburgerMenu}
                title={serviceName}
                setRightSidebar={setRightSidebar}
                rightSidebar={rightSidebar}
              />

              <div className="m-2 p-10 border-2" {...getRootProps()}>
                <input type="file" {...getInputProps()} />
                <p className="text-white p-5">
                  Drag 'n' drop some files here, or click to select files
                </p>
              </div>
              <div className="m-2">
                <PrimaryButton
                  className={clsx("!px-12 !py-2 !text-sm", {
                    "opacity-50": !file,
                    "animate-fill-effect": isLoading,
                  })}
                  onClick={generateTranscriptions}
                  disabled={isLoading || !file}
                >
                  Submit
                </PrimaryButton>
              </div>

              <div className="m-2 text-white">{currentHistory?.transcriptions}</div>
            </div>
          </div>
        </div>
        <div>{rightSidebar && <PremImageRightSidebar setRightSidebar={setRightSidebar} />}</div>
      </div>
    </section>
  );
};

export default PremAudioContainer;
