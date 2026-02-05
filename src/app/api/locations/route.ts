import { NextResponse } from 'next/server';
import { getAllLocations } from '@/utils/content';

export async function GET() {
  try {
    // Get all locations using the helper that handles nested state/city structure
    const allLocations = getAllLocations();

    // Extract only the necessary fields for the service areas component
    const locations = allLocations.map(location => ({
      id: location.id,
      name: location.name,
      state: location.state
    }));

    return NextResponse.json({ locations });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}
