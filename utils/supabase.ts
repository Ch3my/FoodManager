import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = ""
let supabaseAnonKey = ""

if (process.env.EXPO_PUBLIC_SUPABASE_URL) {
  supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
}
if (process.env.EXPO_PUBLIC_SUPABASE_ANONKEY) {
  supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANONKEY;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});