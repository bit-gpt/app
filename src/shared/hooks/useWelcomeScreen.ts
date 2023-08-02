import { useCallback, useState } from "react";

const useWelcomeScreen = (): any => {
  const [displayWelcomeScreen, setDisplayWelcomeScreen] = useState(true);

  const closeWelcomeScreen = useCallback(() => {
    setDisplayWelcomeScreen(false);
  }, [setDisplayWelcomeScreen]);

  return { displayWelcomeScreen, setDisplayWelcomeScreen, closeWelcomeScreen };
};

export default useWelcomeScreen;
