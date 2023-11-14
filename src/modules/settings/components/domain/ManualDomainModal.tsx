import { AxiosError } from "axios";
import { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";

import Cross from "../../../../assets/images/cross.svg";
import apiDnsd from "../../../../shared/api/dnsd";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiDnsd().post("dns", { domain: domainName });
      toast.success(
        `Domain added successfully. You can now access Prem App at https://${domainName}`,
      );
    } catch (error) {
      if (error instanceof AxiosError && error.code === "ERR_NETWORK") {
        console.error("Cannot connect to dns service");
        toast.error("Cannot connect to dns service", { toastId: "dns-service-error" });
      } else {
        console.error("Response Data:", (error as any).response.data.error);
        toast.error((error as any).response.data.error, { toastId: "dns-service-error" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDomainNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomainName(e.target.value);
  };

  return (
    <Modal className="modal" isOpen={isOpen}>
      <div className="modal__content gradient-border w-4/5">
        <div className="flex justify-between items-center my-5">
          <h2 className="text-lg max-md:text-xl">{title}</h2>
          <button onClick={() => setIsManualDomainModalOpen(false)}>
            <img src={Cross} alt="cross" className="h-6 w-6" />
          </button>
        </div>
        <div className="hr" />
        <form onSubmit={onSubmit} className="flex flex-col h-full pb-6 gap-8 md:gap-4">
          <div className="flex max-md:flex-col gap-8 md:gap-4 items-center">
            <input
              className="form-control"
              value={domainName}
              onChange={onDomainNameChange}
              placeholder="Enter your domain name"
            />
          </div>
          <div className="flex justify-end mt-6">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ManualDomainModal;
