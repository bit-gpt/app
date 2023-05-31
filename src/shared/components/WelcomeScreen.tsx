import Header from "./Header";

type WelcomeScreenProps = {
  close: () => void;
};

const WelcomeScreen = ({ close }: WelcomeScreenProps) => {
  return (
    <section className="docker-not-detected flex flex-wrap bg-lines relative">
      <Header />
      <div className="flex items-center w-full modal-height">
        <div className="docker-modal-wrap mx-auto md:max-w-[600px] max-w-[350px] w-full rounded-xl">
          <div className="docker-not-detected__modal rounded-xl p-[18px]">
            <div className="text-center">
              <h1>Prem AI</h1>
              <h2>AI that you own</h2>
              <button className="bg-tulip p-2 rounded" onClick={close}>
                Let's go
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeScreen;
