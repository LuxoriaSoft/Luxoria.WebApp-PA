'use client'
import { MdOutlineFeedback } from "react-icons/md";
import Modal from "react-modal";
import React, { useState } from "react";

interface FeedbackButtonProps {
  _id: string;
}

const AddFeedbackComponent = ({ _id } : FeedbackButtonProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const title = (e.currentTarget.elements.namedItem("title") as HTMLInputElement).value;
    const description = (e.currentTarget.elements.namedItem("description") as HTMLInputElement).value;

    console.log(title, description);
  }

  return (
    <div>
      <form className="relative mt-4" onClick={handleSubmit}>
        <div
          className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
          <label htmlFor="title" className="sr-only">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="block w-full border-0 pt-2.5 text-lg font-medium placeholder:text-gray-400 focus:ring-0"
            placeholder="Title"
          />
          <label htmlFor="description" className="sr-only">
            Description
          </label>
          <textarea
            rows={2}
            name="description"
            id="description"
            className="block w-full resize-none border-0 py-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Write a description..."
            defaultValue={''}
          />
        </div>
        <div className="flex items-center justify-between space-x-3 border-t border-gray-200 px-2 py-2 sm:px-3">
          <div className="flex">
          </div>
          <div className="flex-shrink-0">
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function FeedbackButton({_id}: FeedbackButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className={"rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"}
        onClick={openModal}
      >
        <div className={"flex justify-center gap-2"}>
          <MdOutlineFeedback size={20}/>
        </div>
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Feedback Modal"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-4 rounded-md shadow-md w-7/12">
          <div className={"text-center"}>
            <h3 className={"text-lg font-semibold mb-4"}>Feedback</h3>

            <div id={"history"}>
            </div>

            <div className={"bottom-0"}>
              <AddFeedbackComponent _id={_id} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default FeedbackButton;
