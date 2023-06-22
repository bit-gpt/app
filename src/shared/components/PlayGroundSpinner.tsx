import AppContainer from "./AppContainer";
import Spinner from "./Spinner";

const PlayGroundSpinner = () => {
  return (
    <AppContainer>
      <div className="flex items-center h-full justify-center mt-5">
        <Spinner className="h-10 w-10" />
      </div>
    </AppContainer>
  );
};

export default PlayGroundSpinner;
