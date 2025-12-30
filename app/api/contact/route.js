import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // 1. Insert into Supabase 'inquiries' table
    const { data, error } = await supabase
      .from('inquiries')
      .insert([
        { 
          name, 
          email, 
          phone, 
          subject, 
          message,
          source: 'contact_form'
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Here you could also trigger an email notification using a service like Resend
    // For now, we'll just return success since it's saved in the DB
    
    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



