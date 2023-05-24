import AppContainer from "shared/components/AppContainer";
import SettingsForm from "./SettingsForm";
import Resources from "./Resources";

const Settings = () => {
  return (
    <AppContainer>
      <div className="mask-heading mb-14">
        <h2>Settings</h2>
      </div>
      <div className="lg:max-w-[80%] mx-auto settings">
        <Resources />
        <SettingsForm />
      </div>
    </AppContainer>
  );
};

export default Settings;
