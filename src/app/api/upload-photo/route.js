import { NextResponse } from 'next/server';
import connectToDB from '../../../../lib/mongodb';
import Photo from '../../../../models/Photo';

export async function POST(req) {
  const { image,userName,carrier } = await req.json();

  if (!image) return NextResponse.json({ error: 'No image provided' }, { status: 400 });

  await connectToDB();
  const saved = await Photo.create({ image,userName,carrier });

  return NextResponse.json({ success: true, id: saved._id });
}


//get images

export async function GET() {
  try {
    await connectToDB();
    const photos = await Photo.find({}).sort({ createdAt: -1 }); // optional: latest first
    return NextResponse.json({ success: true, photos });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch photos' }, { status: 500 });
  }
}