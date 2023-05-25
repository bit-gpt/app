import DeleteIcon from "shared/components/DeleteIcon"
import PlayIcon from "shared/components/PlayIcon"

const ServiceControls = () => {
    return  <div className="flex ml-auto">
    <button className="bg-brightgray rounded-3xl px-6 py-[10px] text-sm mr-4">
      Play &nbsp; &#8594;
    </button>
    <button className="px-2">
      <PlayIcon />
    </button>
    <button className="px-2">
      <DeleteIcon />
    </button>
  </div>
}


export default ServiceControls;