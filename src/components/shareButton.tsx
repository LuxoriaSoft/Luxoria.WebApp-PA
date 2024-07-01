'use client'

import {FaShare} from "react-icons/fa";

interface ShareButtonProps {
  _id: string;
}

export default function ShareButton({_id} : ShareButtonProps) {

  const handleClick = async () => {
    const url = `${window.location.origin}/api/preview/${_id}`;
    await navigator.clipboard.writeText(url);
  }

  return (
    <button
      className={"rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"}
      onClick={handleClick}
    >
      <div className={"flex justify-center gap-2"}>
        <FaShare size={20}/>
      </div>
    </button>
  );
}