import AppContainer from "shared/components/AppContainer";
import SystemResources from "./SystemResources";
import GPUResources from "./GPUResources";

const Settings = () => {
  return (
    <AppContainer>
      <div className="mask-heading mb-14">
        <h2 className="!mt-5">Settings</h2>
      </div>
      <div className="lg:max-w-[80%] mx-auto settings">
        <SystemResources />
      </div>
      <div className="lg:max-w-[80%] mx-auto settings">
        <GPUResources />
      </div>
    </AppContainer>
  );
};

export default Settings;
