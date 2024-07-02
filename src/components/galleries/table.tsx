'use client';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';

interface Gallery {
  _id: string;
  name: string;
  description: string;
  email: string;
}

export default function TableComponent() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGallery, setNewGallery] = useState({ name: '', description: '', email: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/galleries');
        if (!response.ok) {
          throw new Error('Failed to fetch galleries');
        }
        const data = await response.json();
        setGalleries(data.galleries);
      } catch (error) {
        console.error('Error fetching galleries:', error);
      }
    };

    fetchData();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGallery({ ...newGallery, [name]: value });
  };

  const handleCopyLink = async (gallery: Gallery) => {
    const url = `${window.location.origin}/galleries/${gallery._id}`;
    await navigator.clipboard.writeText(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form', newGallery); // Debug log

    try {
      const response = await fetch('/api/galleries/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGallery),
      });

      if (!response.ok) {
        throw new Error('Failed to add gallery');
      }

      const data = await response.json();
      console.log('Gallery added:', data); // Debug log
      setGalleries([...galleries, data.body]);
      setNewGallery({ name: '', description: '', email: '' });
      closeModal();
    } catch (error) {
      console.error('Error adding gallery:', error);
    }
  };

  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
                type="button"
                onClick={openModal}
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Gallery
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Description
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {galleries.map((gallery) => (
                  <tr key={gallery._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {gallery.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{gallery.description}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{gallery.email}</td>
                    <td
                      className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleCopyLink(gallery)}>
                        Copy Link<span className="sr-only">, {gallery.name}</span>
                      </button>

                      <button className="text-gray-600 hover:text-gray-900">
                        Edit<span className="sr-only">, {gallery.name}</span>
                      </button>

                      <button className="text-red-600 hover:text-red-900">
                        Delete<span className="sr-only">, {gallery.name}</span>
                      </button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Add Gallery Modal"
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
          <h2 className="text-lg font-bold mb-4">Add New Gallery</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                  type="text"
                  name="name"
                  value={newGallery.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                  type="text"
                  name="description"
                  value={newGallery.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                  type="email"
                  name="email"
                  value={newGallery.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
              />
            </div>
            <div className="flex justify-end">
              <button
                  type="button"
                  onClick={closeModal}
                  className="mr-2 inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Gallery
              </button>
            </div>
          </form>
        </Modal>
      </div>
  );
}
