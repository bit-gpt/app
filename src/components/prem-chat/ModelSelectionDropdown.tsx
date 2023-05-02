import { useQuery } from "@tanstack/react-query";
import { fetchModels } from "../../shared/api";
import usePremChatStore, { PremChatStore } from "../../shared/store/prem-chat";
import { shallow } from "zustand/shallow";

type Model = {
  id: string;
  name: string;
};

const ModelSelectionDropdown = () => {
  const { model, setModel } = usePremChatStore(
    (state) => ({ model: state.model, setModel: state.setModel }),
    shallow
  );
  const { isLoading, data: response } = useQuery(["fetchModels"], fetchModels);

  const onModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setModel(event.target.value);
  };

  if (isLoading) {
    return <div>Fetching Models...</div>;
  }

  return (
    <select onChange={onModelChange} value={model}>
      <option value="">Select a Model</option>
      {response?.data?.data?.map((model: Model) => (
        <option key={model.id} value={model.id}>
          {model.id}
        </option>
      ))}
    </select>
  );
};
export default ModelSelectionDropdown;
