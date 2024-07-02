'use client';

import { useState } from 'react';
import Image from 'next/image';
import DeleteButton from '@/components/deleteButton';
import DownloadButton from '@/components/downloadButton';
import Modal from 'react-modal';
import ShareButton from "@/components/shareButton";
import MoveToComponent from "@/components/moveTo";

interface CardComponentProps {
  _id: string;
  name: string;
}

export default function CardComponent({ _id, name } : CardComponentProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const openModal = () : void  => {
        setIsModalOpen(true);
    };

    const closeModal = () : void => {
        setIsModalOpen(false);
    };

    return (
        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:px-6">
                {name}
            </div>
            <div className="relative h-96" onClick={openModal}>
                <Image
                    src={`/api/preview/${_id}`}
                    alt={name}
                    objectFit="contain"
                    layout="fill"
                />
            </div>

            <div className="px-4 py-4 sm:px-6 flex items-center justify-center gap-x-2">
                <DownloadButton _id={_id} />
                <DeleteButton _id={_id} />
                <ShareButton _id={_id} />
                <MoveToComponent _id={_id} />
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
                        width: '80%',
                        height: '80%',
                        maxWidth: 'none',
                        maxHeight: 'none',
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
                            src={`/api/preview/${_id}`}
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
