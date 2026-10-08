import { NextRequest, NextResponse } from 'next/server';

// Mock shipments data
const mockShipments = [
  {
    id: '1',
    trackingNumber: 'OPS-2024-001234',
    status: 'in_transit',
    senderName: 'John Doe',
    recipientName: 'Jane Smith',
    itemValue: 250,
    createdAt: '2024-10-05',
  },
  {
    id: '2',
    trackingNumber: 'OPS-2024-001233',
    status: 'delivered',
    senderName: 'ABC Corp',
    recipientName: 'XYZ Inc',
    itemValue: 1500,
    createdAt: '2024-10-04',
  },
];

// GET /api/shipments - List shipments with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Mock filtering logic
    let filtered = [...mockShipments];

    if (status && status !== 'all') {
      filtered = filtered.filter((s) => s.status === status);
    }

    if (search) {
      filtered = filtered.filter(
        (s) =>
          s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
          s.senderName.toLowerCase().includes(search.toLowerCase()) ||
          s.recipientName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const limit = 50;
    const skip = (page - 1) * limit;
    const paginated = filtered.slice(skip, skip + limit);

    return NextResponse.json(
      {
        data: paginated,
        total: filtered.length,
        page,
        limit,
        pages: Math.ceil(filtered.length / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get shipments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipments' },
      { status: 500 }
    );
  }
}

// POST /api/shipments - Create new shipment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = [
      'senderName',
      'senderEmail',
      'senderPhone',
      'recipientName',
      'recipientPhone',
      'itemDescription',
      'itemValue',
      'itemWeight',
    ];

    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Generate tracking number
    const trackingNumber = `OPS-${new Date().getFullYear()}-${Math.random().toString().slice(2, 8).padStart(6, '0')}`;

    // Mock save (replace with Prisma)
    const newShipment = {
      id: Math.random().toString(),
      trackingNumber,
      status: 'registered',
      ...body,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Shipment registered successfully',
        data: newShipment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create shipment error:', error);
    return NextResponse.json(
      { error: 'Failed to create shipment' },
      { status: 500 }
    );
  }
}
