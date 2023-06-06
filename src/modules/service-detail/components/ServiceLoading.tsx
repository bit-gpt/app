import AppContainer from "shared/components/AppContainer";
import Spinner from "shared/components/Spinner";

const ServiceLoading = () => {
  return (
    <AppContainer>
      <div className="flex h-full items-center justify-center mt-5">
        <Spinner className="h-10 w-10" />
      </div>
    </AppContainer>
  );
};

export default ServiceLoading;
