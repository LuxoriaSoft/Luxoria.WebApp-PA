'use client'

import React, { useState } from 'react';
import Modal from 'react-modal';
import { MdDeleteOutline } from "react-icons/md";

interface DeleteButtonProps {
  _id: string;
  func?: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ _id, func }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    const res = await fetch(`/api/delete?_id=${_id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      console.log("Deleted successfully!");
      if (func) {
        func();
      }
    } else {
      alert("Error during deletion!");
    }
    setShowModal(false);
  };

  const handleConfirm = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
      <>
        <button
            className={"rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"}
            onClick={handleConfirm}
        >
          <div className={"flex justify-center gap-2"}>
            <MdDeleteOutline size={20} />
          </div>
        </button>

        <Modal
            isOpen={showModal}
            onRequestClose={handleCancel}
            contentLabel="Confirmation de Suppression"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete the image ?</h2>
            <div className="flex justify-end gap-2">
              <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
                  onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </>
  );
};

export default DeleteButton;
