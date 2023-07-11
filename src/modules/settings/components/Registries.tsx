import { useMutation, useQuery } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import PrimaryButton from "shared/components/PrimaryButton";
import fetchRegistries from "../api/fetchRegistries";
import addRegistry from "../api/addRegistry";
import Spinner from "shared/components/Spinner";
import { toast } from "react-toastify";

const Registries = () => {
  const [registryUrl, setRegistryUrl] = useState("");

  const { isLoading, data: response, refetch } = useQuery(["registries"], fetchRegistries);

  const { mutate, isLoading: isSubmitting } = useMutation(addRegistry);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate(
      { url: registryUrl },
      {
        onSuccess: () => {
          setRegistryUrl("");
          refetch();
          toast.success("Registry added successfully");
        },
        onError: () => {
          toast.error("Something went wrong while adding registry");
        },
      }
    );
  };

  const registries = response?.data || [];

  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-center">
        <label className="text-white mr-2 backend-url md:text-lg text-[11px]">Registries</label>
        <div className="flex w-full">
          <div className="text-right w-full">
            {isLoading && (
              <div className="flex justify-center mb-5">
                <Spinner className="h-10 w-10" />
              </div>
            )}
            {registries.map((registry, index) => {
              return (
                <input
                  key={index}
                  className="form-control max-md:!py-2 max-md:text-[10px] mb-4"
                  type="text"
                  defaultValue={registry.url}
                  readOnly
                />
              );
            })}
            <input
              className="form-control max-md:!py-2 max-md:text-[10px]"
              type="url"
              value={registryUrl}
              onChange={(e) => setRegistryUrl(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      <div className="text-right mt-[44px] mr-[45px]">
        <PrimaryButton
          className="!px-9 max-md:text-[12px] max-md:absolute left-0 right-0 bottom-0 max-md:max-w-[322px] max-md:mx-auto max-md:py-1 max-md:h-[36px]"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Add Registry"}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default Registries;
