const SUPABASE_URL =
    "https://hnrfpscygohyjhrebjpi.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_So1-vKh_FRJFuBAI-peIfA_25RLmd7F";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

console.log("Supabase client loaded:", supabaseClient);