import { useEffect } from "react";

const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

export default useScrollToTop;
