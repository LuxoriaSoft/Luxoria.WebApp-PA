'use client';

import React, { useState, useEffect } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

interface LikeButtonProps {
    _id: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ _id }) => {
    const [liked, setLiked] = useState<boolean>(false);

    useEffect(() => {
        // Vérifiez si l'image est déjà likée lorsque le composant est monté
        const checkIfLiked = async () => {
            const res = await fetch(`/api/like/${_id}`);
            if (res.ok) {
                const { isLiked } = await res.json();
                setLiked(isLiked);
            } else {
                console.error('Failed to check like status');
            }
        };

        checkIfLiked();
    }, [_id]);

    const handleLike = async () => {
        const method = liked ? 'DELETE' : 'POST';
        const res = await fetch(`/api/like/${_id}`, {
            method,
        });

        if (res.ok) {
            setLiked(!liked);
        } else {
            console.error('Failed to like/unlike image');
        }
    };

    return (
        <button onClick={handleLike} className="text-2xl">
            {liked ? (
                <AiFillHeart className="text-red-500" />
            ) : (
                <AiOutlineHeart className="text-black" />
            )}
        </button>
    );
};

export default LikeButton;
