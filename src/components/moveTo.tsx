'use client'

import { useState } from "react";
import { MdOutlineMoveDown } from "react-icons/md";

interface MoveToButtonProps {
  _id: string;
}

export default function MoveToComponent({ _id }: MoveToButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = async () => {
    const url = `${window.location.origin}/api/preview/${_id}`;
    await navigator.clipboard.writeText(url);
    setIsModalOpen(true); // Open the modal when the button is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={handleClick}
      >
        <div className="flex justify-center gap-2">
          <MdOutlineMoveDown size={20} />
        </div>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-md p-6">
            <h2 className="text-xl font-bold mb-4">Link Copied!</h2>
            <p className="mb-4">The link has been copied to your clipboard.</p>
            <button
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
