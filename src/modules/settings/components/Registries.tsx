import { useMutation, useQuery } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import MinusArrow from "shared/components/MinusArrow";
import PlusArrow from "shared/components/PlusArrow";
import PrimaryButton from "shared/components/PrimaryButton";
import Spinner from "shared/components/Spinner";

import addRegistry from "../api/addRegistry";
import fetchRegistries from "../api/fetchRegistries";

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
      },
    );
  };

  const registries = response?.data || [];

  return (
    <form className="mt-[42px]" onSubmit={onSubmit}>
      <div className="flex">
        <label className="text-white mr-2 backend-url md:text-lg text-[11px] mt-2">
          Registries
        </label>
        <div className="flex w-full">
          <div className="text-right w-full">
            {isLoading && (
              <div className="flex justify-center mb-5">
                <Spinner className="h-10 w-10" />
              </div>
            )}

            {registries.map((registry, index) => {
              return (
                <div key={index} className="flex">
                  <input
                    className="form-control maxMd:!py-2 maxMd:text-[10px] mb-4"
                    type="text"
                    defaultValue={registry.url}
                    readOnly
                  />
                  <button className="w-[50px] h-[45px] maxMd:hidden" type="button">
                    <MinusArrow />
                  </button>
                </div>
              );
            })}
            <div className="flex">
              <input
                className="form-control maxMd:!py-2 maxMd:text-[10px]"
                type="url"
                value={registryUrl}
                onChange={(e) => setRegistryUrl(e.target.value)}
                required
              />
              <button className="w-[50px] h-[45px] maxMd:hidden" type="button">
                <PlusArrow />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="text-right mt-[44px] mr-[45px]">
        <PrimaryButton
          className="!px-9 maxMd:text-[12px] maxMd:absolute left-0 right-0 bottom-0 maxMd:max-w-[322px] maxMd:mx-auto maxMd:py-1 maxMd:h-[36px]"
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
