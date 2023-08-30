import { AxiosError } from "axios";
import { useState } from "react";
import Modal from "react-modal";

import Cross from "../../../../assets/images/cross.svg";
import api from "../../../../shared/api/v1";

interface ManualDomainModalProps {
  isOpen: boolean;
  title?: string;
  setIsManualDomainModalOpen: (isOpen: boolean) => void;
}

const ManualDomainModal = ({
  isOpen,
  title = "Manual Domain",
  setIsManualDomainModalOpen,
}: ManualDomainModalProps) => {
  const [domainName, setDomainName] = useState("");
  const [serverIP, setServerIP] = useState("");
  const [email, setEmail] = useState("");
  const [nodeName, setNodeName] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api().post("dns", {
        ip: serverIP,
        domain: domainName,
        email: email,
        node_name: nodeName,
      });
    } catch (error) {
      if (error instanceof AxiosError && error.code === "ERR_NETWORK") {
        console.error("Cannot connect to dns service");
      } else {
        console.log("Response Data:", (error as any).response.data.error);
      }
    }
  };

  const onDomainNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomainName(e.target.value);
  };

  const onServerIPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServerIP(e.target.value);
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onNodeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeName(e.target.value);
  };

  return (
    <Modal className="modal" isOpen={isOpen}>
      <div className="modal__content gradient-border w-4/5">
        <div className="flex justify-between item-center my-5">
          <h2 className="text-lg max-md:text-xl mb-2 max-md:mb-4">{title}</h2>
          <button onClick={() => setIsManualDomainModalOpen(false)}>
            <img src={Cross} alt="cross" className="h-6 w-6" />
          </button>
        </div>
        <div className="hr" />
        <form onSubmit={onSubmit}>
          <div className="flex max-md:flex-col gap-4 items-center mb-4">
            <input
              className="form-control max-md:!py-2 max-md:text-[10px]"
              value={domainName}
              onChange={onDomainNameChange}
              placeholder="Enter your domain name"
            />
            <input
              className="form-control max-md:!py-2 max-md:text-[10px]"
              value={serverIP}
              onChange={onServerIPChange}
              placeholder="Enter your server IP"
            />
          </div>
          <div className="flex max-md:flex-col gap-4 items-center mb-4">
            <input
              className="form-control max-md:!py-2 max-md:text-[10px]"
              value={email}
              onChange={onEmailChange}
              placeholder="Enter your email"
            />
            <input
              className="form-control max-md:!py-2 max-md:text-[10px]"
              value={nodeName}
              onChange={onNodeNameChange}
              placeholder="Enter your node name"
            />
          </div>
          <div className="flex justify-end mt-6">
            <button type="submit" className="btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ManualDomainModal;
