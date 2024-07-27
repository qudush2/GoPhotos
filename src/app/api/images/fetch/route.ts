import { NextResponse } from 'next/server';
import { getImages } from '@/src/utils/fetchImages';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get('folderId');

  if (!folderId) {
    return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
  }

  try {
    const images = await getImages(folderId);
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}