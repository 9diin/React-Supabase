import { useEffect } from "react";
import supabase from "@/lib/supabase";
// 필요한 경우, 토스트 메시지 라이브러리 (예: react-hot-toast) 임포트

export default function AuthCallback() {
    // ⚠️ 경고: 실제 앱에서는 이 동의 정보들을 사용자에게 받는 UI 단계를 거쳐야 합니다.
    // OAuth 리디렉트 콜백 단계에서는 이 정보들을 사용자에게 받을 수 없으므로,
    // 이 예시에서는 임시로 'true' 또는 기본값으로 처리합니다.
    const serviceAgreed = true;
    const privacyAgreed = true;
    const marketingAgreed = false; // 마케팅 동의는 기본적으로 false로 설정하는 것이 일반적

    useEffect(() => {
        const handleAuthCallback = async () => {
            // 1. 현재 사용자 세션 정보 가져오기
            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();

            if (sessionError || !session) {
                // 세션 가져오기 오류 또는 세션이 없는 경우 처리
                console.error("세션 가져오기 오류:", sessionError);
                // toast.error("로그인 처리 중 오류가 발생했습니다.");
                // 로그인 페이지 또는 오류 페이지로 리디렉션
                window.location.replace("/login");
                return;
            }

            const user = session.user;

            // 2. public.user 테이블에서 사용자 존재 여부 확인
            const { data: userData, error: fetchError } = await supabase.from("user").select("id").eq("id", user.id).single();

            if (fetchError && fetchError.code !== "PGRST116") {
                // PGRST116: 'Row Not Found' 오류 코드
                // 다른 DB 조회 오류 발생
                console.error("사용자 정보 조회 오류:", fetchError);
                // toast.error("사용자 정보 확인 중 오류가 발생했습니다.");
                return;
            }

            // 3. 사용자 정보가 public.user 테이블에 존재하지 않는 경우에만 삽입
            if (!userData) {
                // OAuth를 통해 얻은 user 객체에서 이메일 정보 가져오기
                const userEmail = user.email || user.user_metadata.email;

                if (!userEmail) {
                    console.error("사용자 이메일 정보를 찾을 수 없습니다.");
                    // toast.error("이메일 정보가 없어 가입 처리에 실패했습니다.");
                    return;
                }

                // public.user 테이블에 데이터 삽입
                const { error: insertError } = await supabase.from("user").insert([
                    {
                        id: user.id,
                        email: userEmail, // OAuth로 받은 이메일 사용
                        service_agreed: serviceAgreed,
                        privacy_agreed: privacyAgreed,
                        marketing_agreed: marketingAgreed,
                    },
                ]);
                // .select(); // 삽입 후 데이터를 가져올 필요가 없다면 생략 가능

                if (insertError) {
                    console.error("public.user 테이블 삽입 오류:", insertError);
                    // toast.error("사용자 정보 저장 중 오류가 발생했습니다.");
                    return;
                }

                // toast.success("회원가입이 완료되었습니다!");
            } else {
                // 사용자 정보가 이미 존재하는 경우
                // toast.success("로그인 성공!");
            }

            // 4. 모든 처리가 완료되면 메인 페이지 또는 대시보드로 리디렉션
            window.location.replace("/"); // 예시: 메인 페이지로 이동
        };

        handleAuthCallback();
    }, []);

    return (
        <main className="w-full h-full min-h-[720px] flex items-center justify-center">
            <p>로그인을 진행 중입니다. 잠시만 기다려주세요...</p>
            {/* 로딩 스피너 등을 추가할 수 있습니다. */}
        </main>
    );
}
