import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://sknimloxbgrojobvygov.supabase.co';
const supabaseAnonKey = 'sb_publishable_2m45IONW1yTXgin4LIWcnw_Mjv7wF10';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const createUser = async () => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'gorette@smartstockpro.com',
      password: 'Admin@Smart',
      options: {
        data: {
          full_name: 'Gorette Mulundamo',
          business_name: 'Fidelity Stores',
        },
      },
    });

    if (error) {
      console.error('Error creating user:', error.message);
      return;
    }

    console.log('User created successfully!');
    console.log('User ID:', data.user.id);
    console.log('Email:', data.user.email);
    console.log('Full Name:', data.user.user_metadata.full_name);
    console.log('Business Name:', data.user.user_metadata.business_name);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

createUser();