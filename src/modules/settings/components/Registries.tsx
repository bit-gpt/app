import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import MinusArrow from "shared/components/MinusArrow";
import PrimaryButton from "shared/components/PrimaryButton";
import Spinner from "shared/components/Spinner";

import useAddRegistry from "../../../shared/hooks/useAddRegistry";
import useDeleteRegistry from "../../../shared/hooks/useDeleteRegistry";
import useFetchRegistries from "../../../shared/hooks/useFetchRegistries";
import useResetDefaultRegistry from "../../../shared/hooks/useResetDefaultRegistry";

const Registries = () => {
  const [registryUrl, setRegistryUrl] = useState("");
  const { mutate: addRegistry, isPending: isAddRegistryPending } = useAddRegistry();
  const { mutate: deleteRegistry } = useDeleteRegistry();
  const { mutateAsync: resetDefaultRegistry } = useResetDefaultRegistry();
  const {
    data: registries,
    refetch: refetchRegistries,
    isLoading: isFetchRegistriesLoading,
  } = useFetchRegistries();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    addRegistry(
      { url: registryUrl },
      {
        onSuccess: async () => {
          setRegistryUrl("");
          await refetchRegistries();
          toast.success("Registry added successfully", { toastId: "add-registry-success" });
        },
        onError: (err) => {
          console.error("err", err);
          toast.error("Something went wrong while adding registry", {
            toastId: "add-registry-error",
          });
        },
      },
    );
  };

  const handleDelete = (url: string) => {
    deleteRegistry(
      { url },
      {
        onSuccess: async () => {
          await refetchRegistries();
          toast.success("Registry deleted successfully", { toastId: "delete-registry-success" });
        },
        onError: () => {
          toast.error("Something went wrong while deleting registry", {
            toastId: "delete-registry-error",
          });
        },
      },
    );
  };

  const handleRegistryDefaultReset = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    try {
      await resetDefaultRegistry();
      await refetchRegistries();
      toast.success("Registry reset successful", { toastId: "delete-reset-success" });
    } catch (err) {
      console.error("err", err);
      toast.error("Something went wrong while resetting registry", {
        toastId: "delete-reset-error",
      });
    }
  };

  return (
    <form className="mt-10" onSubmit={onSubmit}>
      <div className="flex flex-wrap">
        <h2 className="text-grey-300 w-1/3 md:text-lg mb-2">Registries</h2>
        <div className="flex w-full md:w-2/3">
          <div className="text-right w-full">
            {isFetchRegistriesLoading && (
              <div className="flex justify-center mb-5">
                <Spinner className="h-10 w-10" />
              </div>
            )}

            {registries?.map((registry, index) => {
              return (
                <div key={`${registry.url}_${index}`} className="flex">
                  <input
                    className="form-control mb-4"
                    type="text"
                    defaultValue={registry.url}
                    readOnly
                  />
                  <button
                    className="w-8 ml-4"
                    type="button"
                    onClick={() => handleDelete(registry.url)}
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
              <div className="w-8 ml-4" />
            </div>
          </div>
        </div>
      </div>
      <div className="text-right mt-[44px] mr-[45px]">
        <PrimaryButton onClick={handleRegistryDefaultReset} className="mr-2">
          Reset
        </PrimaryButton>
        <PrimaryButton type="submit" disabled={isAddRegistryPending}>
          {isAddRegistryPending ? "Updating..." : "Add Registry"}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default Registries;
