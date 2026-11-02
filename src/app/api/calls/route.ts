import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const calls = store.getCalls();
  return NextResponse.json(calls);
}
