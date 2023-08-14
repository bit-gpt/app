import BackendUrl from "./BackendUrl";
import Registries from "./Registries";
import Domains from "./domain/Domains";

const AdvancedSettings = () => {
  return (
    <div className="md:mb-14 mb-8">
      <h2 className="md:!mt-10 mt-10 text-grey-300 md:mb-[37px] mb-2 md:text-lg text-sm">
        Advanced
      </h2>
      <BackendUrl />
      <Registries />
      <Domains />
    </div>
  );
};

export default AdvancedSettings;
