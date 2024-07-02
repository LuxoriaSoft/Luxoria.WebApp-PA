'use client';

import { useState, useEffect } from 'react';
import { MdOutlineMoveDown } from 'react-icons/md';
import Modal from 'react-modal';

interface Gallery {
  _id: string;
  name: string;
}

interface MoveToButtonProps {
  _id: string;
}

export default function MoveToComponent({ _id }: MoveToButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [selectedGallery, setSelectedGallery] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await fetch('/api/galleries');
        const data = await response.json();
        setGalleries(data.galleries);
      } catch (error) {
        console.error('Error fetching galleries:', error);
      }
    };

    fetchGalleries();
  }, []);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAssignGallery = async () => {
    if (!selectedGallery) return;
    try {
      const response = await fetch('/api/galleries/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageId: _id, galleryId: selectedGallery }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error data:', errorData);
        throw new Error('Failed to assign gallery');
      }

      // Handle success (e.g., show a success message or close the modal)
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error assigning gallery:', error);
    }
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

        <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            contentLabel="Assign Image to Gallery Modal"
            ariaHideApp={false}
            style={{
              overlay: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
              },
              content: {
                position: 'relative',
                top: 'auto',
                left: 'auto',
                right: 'auto',
                bottom: 'auto',
                border: 'none',
                background: 'white',
                overflow: 'visible',
                padding: '20px',
                width: '400px',
                maxHeight: '80%',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
              },
            }}
        >
          <h2 className="text-xl font-bold mb-4">Assign Image to Gallery</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Select Gallery</label>
            <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={selectedGallery ?? ''}
                onChange={(e) => setSelectedGallery(e.target.value)}
            >
              <option value="" disabled>Select a gallery</option>
              {galleries.map((gallery) => (
                  <option key={gallery._id} value={gallery._id}>
                    {gallery.name}
                  </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
                className="mr-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleAssignGallery}
            >
              Assign
            </button>
          </div>
        </Modal>
      </>
  );
}
