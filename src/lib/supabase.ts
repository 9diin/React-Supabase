import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true, // ✅ 세션을 로컬에 저장
        autoRefreshToken: true, // ✅ 만료 전에 토큰 자동 갱신
        detectSessionInUrl: true, // ✅ OAuth 리디렉션 URL 자동 처리
    },
});

export default supabase;
