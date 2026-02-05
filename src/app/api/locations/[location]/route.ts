import { NextRequest, NextResponse } from 'next/server';
import locationsData from '@/data/locations.json';
import { getLocationById, Location } from '@/utils/content';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ location: string }> }
) {
  try {
    const { location } = await params;

    // Find the location by ID
    const locationData = getLocationById(location);

    if (!locationData) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ location: locationData });
  } catch (error) {
    console.error('Error fetching location:', error);
    return NextResponse.json(
      { error: 'Failed to fetch location' },
      { status: 500 }
    );
  }
} 