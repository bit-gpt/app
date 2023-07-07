import PrimaryButton from "shared/components/PrimaryButton";
import { PremAudioRecordTabsProps } from "../types";

const PremRecordTabs = ({ activeTab }: Partial<PremAudioRecordTabsProps>) => {
  return (
    <>
      {activeTab === 1 && (
        <>
          <div className="prem-audio-box bg-darkcharcoal">
            <p className="mb-[18px] text-spanishgray">Record an audio from your microphone</p>
            <div className="border-2 border-lavendergray rounded-lg h-[162px] flex justify-center items-center flex-col">
              <PrimaryButton className="px-4 flex items-center !py-2 !h-[38px] !text-sm">
                <p className="pr-4 font-proximaNova-regular">Start recording</p>
                {/* <div className="pl-4 btn-primary--addon">
              <img src={uploadIcon} alt="msg" width={14} height={14} />
            </div> */}
              </PrimaryButton>
            </div>
            <div className="gradient-border relative mt-5">
              <p>Prem.AI Speech File</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PremRecordTabs;
