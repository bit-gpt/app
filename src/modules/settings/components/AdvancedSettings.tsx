import BackendUrl from "./BackendUrl";
import Registries from "./Registries";

const AdvancedSettings = () => {
  return (
    <div className="md:mb-14 mb-8">
      <h2 className="md:!mt-10 mt-10 text-brightgray md:mb-[37px] mb-2 md:text-lg text-sm">
        Advanced
      </h2>
      <BackendUrl />
      <Registries />
    </div>
  );
};

export default AdvancedSettings;
