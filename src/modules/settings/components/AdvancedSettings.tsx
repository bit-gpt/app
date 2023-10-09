import BackendUrl from "./BackendUrl";
import Registries from "./Registries";
import Domains from "./domain/Domains";

const AdvancedSettings = () => {
  return (
    <div className="mt-8 md:mb-14 mb-8">
      <h2 className="text-white mb-4 text-lg">Advanced</h2>
      <BackendUrl />
      <Registries />
      {"__TAURI__" in window ? null : <Domains />}
    </div>
  );
};

export default AdvancedSettings;
