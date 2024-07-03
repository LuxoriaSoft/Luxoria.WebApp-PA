import { NextRequest, NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/services/database.service';
import { ObjectId } from 'mongodb';

const validateObjectId = (id: string) => {
    return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
};

export async function GET(request: NextRequest, context : any) {

    const { params } = context;
    const id = params._id;

    if (!validateObjectId(id)) {
        console.error('Invalid ID format:', id);
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    try {
        const db = await getDbInstance();
        const file = await db.collection('fs.files').findOne({ _id: new ObjectId(id) });
        if (!file) {
            console.error('File not found:', id);
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }
        const isLiked = file.metadata?.isLiked || false;
        return NextResponse.json({ isLiked });
    } catch (error) {
        console.error('Failed to fetch like status:', error);
        return NextResponse.json({ error: 'Failed to fetch like status' }, { status: 500 });
    }
}

export async function POST(request: NextRequest,  context : any) {
    const { params } = context;
    const id = params._id;

    if (!validateObjectId(id)) {
        console.error('Invalid ID format:', id);
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    try {
        const db = await getDbInstance();
        const result = await db.collection('fs.files').updateOne(
            { _id: new ObjectId(id) },
            { $set: { 'metadata.isLiked': true } }
        );

        if (result.matchedCount === 0) {
            console.error('File not found or already liked:', id);
            return NextResponse.json({ error: 'File not found or already liked' }, { status: 404 });
        }

        return NextResponse.json({ success: 'Image liked' });
    } catch (error) {
        console.error('Failed to like image:', error);
        return NextResponse.json({ error: 'Failed to like image' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest,  context : any) {
    const { params } = context;
    const id = params._id;

    if (!validateObjectId(id)) {
        console.error('Invalid ID format:', id);
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    try {
        const db = await getDbInstance();
        const result = await db.collection('fs.files').updateOne(
            { _id: new ObjectId(id) },
            { $set: { 'metadata.isLiked': false } }
        );

        if (result.matchedCount === 0) {
            console.error('File not found or already unliked:', id);
            return NextResponse.json({ error: 'File not found or already unliked' }, { status: 404 });
        }

        return NextResponse.json({ success: 'Image unliked' });
    } catch (error) {
        console.error('Failed to unlike image:', error);
        return NextResponse.json({ error: 'Failed to unlike image' }, { status: 500 });
    }
}
