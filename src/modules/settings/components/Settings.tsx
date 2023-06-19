import AppContainer from "shared/components/AppContainer";
import SystemResources from "./SystemResources";
import GPUResources from "./GPUResources";
import AdvancedSettings from "./AdvancedSettings";
import UseScrollToTop from "shared/hooks/useScrollToTop";

const Settings = () => {
  return (
    <AppContainer>
      <UseScrollToTop />
      <div className="mask-heading md:mb-14 mb-8 md:-mx-6 xl:-mx-10">
        <h2 className="!mt-10">Settings</h2>
      </div>
      <div className="lg:max-w-[80%] mx-auto settings">
        <SystemResources />
      </div>
      <div className="lg:max-w-[80%] mx-auto settings mt-16">
        <GPUResources />
      </div>
      <div className="lg:max-w-[80%] mx-auto settings">
        <AdvancedSettings />
      </div>
    </AppContainer>
  );
};

export default Settings;
