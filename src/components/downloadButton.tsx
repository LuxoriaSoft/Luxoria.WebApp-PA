'use client'
import { IoCloudDownloadOutline } from "react-icons/io5";

interface DownloadButtonProps {
  _id: string;
}

export default function DownloadButton({_id} : DownloadButtonProps) {

  const handleClick = async () => {
    window.open(`/api/download/${_id}`, "_blank");
  }

  return (
    <button
      className={"rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"}
      onClick={handleClick}
    >
      <div className={"flex justify-center gap-2"}>
        <IoCloudDownloadOutline size={20}/>
      </div>
    </button>
  );
}