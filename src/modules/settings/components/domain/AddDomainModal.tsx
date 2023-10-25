import clsx from "clsx";
import Modal from "react-modal";

import AWS from "../../../../assets/images/aws-route53.svg";
import Cloudflare from "../../../../assets/images/cloudflare.svg";
import Cross from "../../../../assets/images/cross.svg";
import DomainManual from "../../../../assets/images/domain-manual.svg";
import GoDaddy from "../../../../assets/images/go-daddy.svg";

interface AddDomainModalProps {
  isOpen: boolean;
  title?: string;
  setIsAddDomainModalOpen: (isOpen: boolean) => void;
  setIsManualDomainModalOpen: (isOpen: boolean) => void;
}

const AddDomainModal = ({
  isOpen,
  title = "Add Your Domain",
  setIsAddDomainModalOpen,
  setIsManualDomainModalOpen,
}: AddDomainModalProps) => {
  const DomainCard = ({
    img,
    text,
    id,
    disabled = false,
  }: {
    img: string;
    text: string;
    id: string;
    disabled?: boolean;
  }) => (
    <button
      id={id}
      className={clsx(
        "flex align-center rounded-lg border-2 border-[#37373a] bg-charlestongreen w-1/3 max-sm:w-2/3 p-4",
        {
          "justify-between cursor-not-allowed": disabled,
          "justify-center": !disabled,
        },
      )}
      onClick={(ev) => {
        const button = (ev.target as Element).closest("button");
        if (button?.id === "domain-manual") {
          setIsAddDomainModalOpen(false);
          setIsManualDomainModalOpen(true);
        }
      }}
    >
      <div className="flex flex-col justify-center">
        <img className="h-[50px] mb-6" src={img} alt={text} />
        <div>{text}</div>
      </div>
      {disabled ? <div className="ml-2 text-grey-400 font-bold">Coming soon</div> : null}
    </button>
  );

  return (
    <Modal className="modal" isOpen={isOpen}>
      <div className="modal__content gradient-border w-4/5">
        <div className="flex justify-between items-center my-5">
          <h2 className="text-lg max-md:text-xl">{title}</h2>
          <button onClick={() => setIsAddDomainModalOpen(false)}>
            <img src={Cross} alt="cross" className="h-6 w-6" />
          </button>
        </div>
        <div className="hr" />
        <div className="flex flex-col h-full pb-6 max-md:justify-around">
          <div className="flex gap-4 max-sm:flex-col max-sm:items-center">
            <DomainCard id="go-daddy" img={GoDaddy} text="Go Daddy" disabled={true} />
            <DomainCard id="amazon" img={Cloudflare} text="Cloudflare" disabled={true} />
            <DomainCard id="aws" img={AWS} text="AWS Route 53" disabled={true} />
          </div>
          <div className="my-6 flex justify-between items-center">
            <div className="border-t-2 border-light w-[47%]"></div>
            <div className="text-grey-300 text-opacity-40">OR</div>
            <div className="border-t-2 border-light w-[47%]"></div>
          </div>
          <div className="flex justify-center">
            <DomainCard id="domain-manual" img={DomainManual} text="Enter Domain" />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddDomainModal;
