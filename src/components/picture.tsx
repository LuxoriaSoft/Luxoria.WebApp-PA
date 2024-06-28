'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import DeleteButton from '@/components/deleteButton';
import DownloadButton from '@/components/downloadButton';
import Modal from 'react-modal';
import ShareButton from "@/components/shareButton";

export default function CardComponent({ _id, name }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:px-6">
                {name}
            </div>
            <div className="relative h-96" onClick={openModal}>
                <Image
                    src={`/api/preview?_id=${_id}`}
                    alt={name}
                    objectFit="contain"
                    layout="fill"
                />
            </div>

            <div className="px-4 py-4 sm:px-6 flex items-center justify-center gap-x-2">
                <DownloadButton _id={_id} />
                <DeleteButton _id={_id} />
                <ShareButton _id={_id} />
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Image Modal"
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
                        background: 'none',
                        overflow: 'visible',
                        padding: '0',
                        width: '80%', // Largeur de la modale à 80% de la fenêtre
                        height: '80%', // Hauteur de la modale à 80% de la fenêtre
                        maxWidth: 'none', // Pas de largeur maximale
                        maxHeight: 'none', // Pas de hauteur maximale
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
                    },
                }}
            >
                <div className="bg-white p-4 rounded-lg w-full h-full">
                    <button
                        onClick={closeModal}
                        className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-500 rounded-full p-2 z-50"
                    >
                        Close
                    </button>
                    <div className="relative w-full h-full">
                        <Image
                            src={`/api/preview?_id=${_id}`}
                            alt={name}
                            objectFit="contain"
                            layout="fill"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
