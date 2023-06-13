import AppContainer from "shared/components/AppContainer";
import SystemResources from "./SystemResources";
import GPUResources from "./GPUResources";
import AdvancedSettings from "./AdvancedSettings";

const Settings = () => {
  return (
    <AppContainer>
      <div className="max-md:pb-12 max-md:relative max-md:h-[95%]">
        <div className="mask-heading md:mb-14 mb-6 md:-mx-6 xl:-mx-10">
          <h2 className="!mt-10">Settings</h2>
        </div>
        <div className="lg:max-w-[80%] mx-auto settings">
          <SystemResources />
        </div>
        <div className="lg:max-w-[80%] mx-auto settings max-md:hidden">
          <GPUResources />
        </div>
        <div className="lg:max-w-[80%] mx-auto settings">
          <AdvancedSettings />
        </div>
      </div>
    </AppContainer>
  );
};

export default Settings;
