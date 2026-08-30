import { NextResponse } from 'next/server';
import { getAllMenuItems, saveMenuItem, deleteMenuItem } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

/**
 * GET /api/menu
 * Public endpoint to fetch all menu items from DB.
 */
export async function GET() {
  try {
    const items = await getAllMenuItems();
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error('GET /api/menu error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/menu
 * Secured endpoint (Admin only) to add/save a menu item.
 */
export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return NextResponse.json({ error: 'Unauthorized. Admin permission required.' }, { status: 403 });
    }

    const body = await request.json();
    if (!body.name || typeof body.price !== 'number' || !body.category) {
      return NextResponse.json({ error: 'Name, price, and category are required fields.' }, { status: 400 });
    }

    const id = body.id || `item_${Date.now()}`;
    const newItem = await saveMenuItem({
      id,
      name: body.name,
      price: body.price,
      description: body.description || '',
      category: body.category,
      subCategory: body.subCategory || '',
      isVeg: body.isVeg ?? true,
      image: body.image || '',
      available: body.available ?? true,
    });

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/menu error:', error);
    return NextResponse.json({ error: 'Failed to save menu item.' }, { status: 500 });
  }
}

/**
 * DELETE /api/menu?id=XYZ
 * Secured endpoint (Admin only) to remove a menu item.
 */
export async function DELETE(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin permission required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required.' }, { status: 400 });
    }

    const success = await deleteMenuItem(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    console.error('DELETE /api/menu error:', error);
    return NextResponse.json({ error: 'Failed to delete menu item.' }, { status: 500 });
  }
}
