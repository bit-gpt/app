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
  const Card = ({ img, text, id }: { img: string; text: string; id: string }) => (
    <button
      id={id}
      className="flex flex-col align-center rounded-lg border-2 border-[#37373a] bg-charlestongreen w-1/3 max-sm:w-2/3 p-4"
      onClick={(ev) => {
        const button = (ev.target as Element).closest("button");
        if (button?.id === "domain-manual") {
          setIsAddDomainModalOpen(false);
          setIsManualDomainModalOpen(true);
        }
      }}
    >
      <img className="h-[50px] mb-6" src={img} alt={text} />
      <div className="flex justify-center">{text}</div>
    </button>
  );

  return (
    <Modal className="modal" isOpen={isOpen}>
      <div className="modal__content gradient-border w-4/5">
        <div className="flex justify-between item-center my-5">
          <h2 className="text-lg max-md:text-xl">{title}</h2>
          <button onClick={() => setIsAddDomainModalOpen(false)}>
            <img src={Cross} alt="cross" className="h-6 w-6" />
          </button>
        </div>
        <div className="hr" />
        <div className="flex gap-4 max-sm:flex-col max-sm:items-center">
          <Card id="go-daddy" img={GoDaddy} text="Go Daddy" />
          <Card id="amazon" img={Cloudflare} text="Cloudflare" />
          <Card id="aws" img={AWS} text="AWS Route 53" />
        </div>

        <div className="my-6 flex justify-between items-center">
          <div className="border-t-2 border-light w-[47%]"></div>
          <div className="text-grey-300 text-opacity-40">OR</div>
          <div className="border-t-2 border-light w-[47%]"></div>
        </div>

        <div className="flex justify-center">
          <Card id="domain-manual" img={DomainManual} text="Enter Domain" />
        </div>
      </div>
    </Modal>
  );
};

export default AddDomainModal;
