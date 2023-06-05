import PrimaryButton from "shared/components/PrimaryButton";
import Logo from "assets/images/brand-logo.svg";
import { WelcomeScreenProps } from "../types";

const WelcomeScreen = ({ close }: WelcomeScreenProps) => {
  return (
    <section className="bg-darkjunglegreen bg-lines relative">
      <div className="welcome-logo">
        <img src={Logo} alt="logo" />
      </div>
      <div className="mx-auto text-center welcome-container">
        <div className="mask-heading">
          <h2 className="md:!text-[55px] !text-[40px] !leading-[70px] !mt-0 font-[ProximaNova-bold]">
            Prem AI
          </h2>
        </div>
        <h2 className="md:text-[35px] text-[25px] mb-10 tracking-[3.5px] capitalize font-semibold text-white">
          AI that you own
        </h2>
        <PrimaryButton className="!px-12" onClick={close}>
          Open
        </PrimaryButton>
      </div>
    </section>
  );
};

export default WelcomeScreen;
