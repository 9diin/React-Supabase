import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        // 1. 세션의 지속성(Persistence)을 명시적으로 설정합니다.
        // 기본값은 true(localStorage)이지만, 명시하면 더 확실합니다.
        persistSession: true,

        // 2. 세션을 저장할 스토리지 타입을 명시합니다.
        // 기본값은 localStorage이지만, Next.js나 특정 환경에서 문제가 될 경우
        // Cookies 등으로 변경할 수 있습니다. (현재 환경에 따라 localStorage가 적절합니다.)
        storage: localStorage,

        // 3. OAuth 리디렉션 처리 방식을 명시합니다.
        // AuthCallback에서 세션을 읽는 데 실패하는 경우 이 옵션을 확인해야 합니다.
        // 현재 사용 중인 URL 해시 방식(#)이 아닌 경로(Path) 방식을 사용하려면 'path'로 설정합니다.
        // 하지만 기존 코드는 해시 방식에 맞춰져 있으므로 'hash'가 기본이며 적절합니다.
        // browser: 'hash',
    },
});

export default supabase;
