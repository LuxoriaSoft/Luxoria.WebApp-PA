import { NextRequest, NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/services/database.service';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest): Promise<void | Response> {
    try {
        const { imageId, galleryId } = await request.json();
        console.log(imageId);
        console.log(galleryId);

        if (!imageId || !galleryId) {
            console.error('Invalid input:', { imageId, galleryId });
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const db = await getDbInstance();
        const imagesCollection = db.collection('fs.files');

        const imageObjectId = new ObjectId(imageId);
        const galleryObjectId = new ObjectId(galleryId);

        console.log('Updating image with ID:', imageObjectId, 'Assigning to gallery ID:', galleryObjectId);

        // Update the image with the selected gallery ID in metadata
        const result = await imagesCollection.updateOne(
            { _id: imageObjectId },
            { $set: { "metadata.relatedToGallery": galleryObjectId } }
        );

        if (result.modifiedCount === 0) {
            console.error('No documents were modified');
            throw new Error('Failed to assign gallery');
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error assigning gallery:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
