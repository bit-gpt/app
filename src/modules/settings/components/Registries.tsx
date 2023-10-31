import { useMutation, useQuery } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import MinusArrow from "shared/components/MinusArrow";
import PlusArrow from "shared/components/PlusArrow";
import PrimaryButton from "shared/components/PrimaryButton";
import Spinner from "shared/components/Spinner";

import addRegistry from "../api/addRegistry";
import deleteRegistry from "../api/deleteRegistry";
import fetchRegistries from "../api/fetchRegistries";

const Registries = () => {
  const [registryUrl, setRegistryUrl] = useState("");

  const {
    isLoading,
    data: response,
    refetch,
  } = useQuery({ queryKey: ["registries"], queryFn: fetchRegistries });

  const { mutate: mutateAddRegistry, isPending: isPendingAddRegistry } = useMutation({
    mutationFn: addRegistry,
  });
  const { mutate: mutateDeleteRegistry } = useMutation({ mutationFn: deleteRegistry });

  const registries = response?.data || [];

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutateAddRegistry(
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

  const handleDelete = (url: string) => {
    mutateDeleteRegistry(
      { url },
      {
        onSuccess: () => {
          refetch();
          toast.success("Registry deleted successfully");
        },
        onError: () => {
          toast.error("Something went wrong while deleting registry");
        },
      },
    );
  };

  return (
    <form className="mt-10" onSubmit={onSubmit}>
      <div className="flex">
        <label className="text-grey-300 mr-2 backend-url md:text-lg mt-2">Registries</label>
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
                    className="form-control mb-4"
                    type="text"
                    defaultValue={registry.url}
                    readOnly
                  />
                  <button
                    className="w-8 ml-4"
                    type="button"
                    onClick={() => handleDelete(registries[index].url)}
                  >
                    <MinusArrow />
                  </button>
                </div>
              );
            })}
            <div className="flex">
              <input
                className="form-control"
                type="url"
                value={registryUrl}
                onChange={(e) => setRegistryUrl(e.target.value)}
                required
              />
              <button className="w-8 ml-4" type="button">
                <PlusArrow />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="text-right mt-[44px] mr-[45px]">
        <PrimaryButton type="submit" disabled={isPendingAddRegistry}>
          {isPendingAddRegistry ? "Updating..." : "Add Registry"}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default Registries;
