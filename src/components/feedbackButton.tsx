'use client'
import { MdOutlineFeedback } from "react-icons/md";
import Modal from "react-modal";
import React, { useEffect, useState, useRef } from "react";

interface FeedbackButtonProps {
  _id: string;
  pictureName: string;
}

interface Comment {
  _id: string;
  title: string;
  content: string;
  postedAt: Date;
}

const fetchComments = async (_id: string): Promise<Comment[]> => {
  const res = await fetch(`/api/galleries/comment/${_id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch comments');
  }
  return res.json();
}

interface AddFeedbackProps {
  _id: string;
  appendFeedbacks: (comments: Comment[]) => void;
}

const AddFeedbackComponent = ({ _id, appendFeedbacks }: AddFeedbackProps) => {
  const [submitButtonEnabled, setSubmitButtonEnabled] = useState<boolean>(true);

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    setSubmitButtonEnabled(false);
    e.preventDefault();
    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;

    if (!title) {
      setSubmitButtonEnabled(true);
      return;
    }

    const res = await fetch(`/api/galleries/comment/${_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, content: description })
    });

    if (res.ok) {
      const newComments = await fetchComments(_id);
      appendFeedbacks(newComments);

      if (titleRef.current) titleRef.current.value = '';
      if (descriptionRef.current) descriptionRef.current.value = '';
    }

    setSubmitButtonEnabled(true);
  }

  return (
    <div>
      <form className="relative mt-4" onSubmit={handleSubmit}>
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
            ref={titleRef}
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
            ref={descriptionRef}
          />
        </div>
        <div className="flex items-center justify-between space-x-3 border-t border-gray-200 px-2 py-2 sm:px-3">
          <div className="flex">
          </div>
          <div className="flex-shrink-0">
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={!submitButtonEnabled}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const FeedbackContent = ({ title, content, postedAt }: Comment) => {
  const sentAt = new Date(postedAt);
  const formattedDate = sentAt.toLocaleString('fr-FR');

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-lg text-start">
      <div className="px-4 py-5 sm:px-6 flex flex-col">
        <div className={"text-lg font-medium"}>
          {title}
        </div>
        <div className={"text-sm text-gray-900"}>
          {content}
        </div>
        <div className={"text-end text-gray-400 text-xs"}>
          {formattedDate}
        </div>
      </div>
    </div>
  )
}

function FeedbackButton({ _id, pictureName }: FeedbackButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchComments(_id).then((data) => {
      setComments(data);
    }).catch((error) => {
      console.error('Error fetching comments:', error);
    });
  }, [_id]);

  return (
    <>
      <button
        className={"rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"}
        onClick={openModal}
      >
        <div className={"flex justify-center gap-2"}>
          <MdOutlineFeedback size={20} />
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
            <h3 className={"text-lg font-semibold mb-4"}>Feedback - {pictureName}</h3>

            <div id={"history"} className="max-h-96 overflow-y-auto">
              {comments.map((comment) => (
                <FeedbackContent key={comment._id} {...comment} />
              ))}
            </div>

            <div className={"bottom-0"}>
              <AddFeedbackComponent _id={_id} appendFeedbacks={setComments}/>
            </div>

            <button
              onClick={closeModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default FeedbackButton;
