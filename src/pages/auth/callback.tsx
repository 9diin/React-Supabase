import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores";
import supabase from "@/lib/supabase";

export default function AuthCallback() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        async function handleAuth() {
            try {
                // 1️⃣ 현재 로그인한 사용자 정보 가져오기
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();
                if (userError) {
                    console.error("사용자 정보 가져오기 실패:", userError);
                    return;
                }

                if (!user) {
                    console.error("로그인된 사용자가 없습니다.");
                    return;
                }

                if (!user.id) {
                    console.error("유저 ID가 없습니다.");
                    return;
                }

                // 2️⃣ Upsert: user 테이블에 사용자 정보 삽입/업데이트
                const { data, error: upsertError } = await supabase
                    .from("user")
                    .insert({
                        id: user.id,
                        email: user.email || "알 수 없는 사용자",
                        service_agreed: true,
                        privacy_agreed: true,
                        marketing_agreed: false,
                    })
                    .select();

                if (upsertError) {
                    console.error("USER 테이블 업서트 중 에러:", upsertError);
                    return;
                }

                console.log("업서트 결과:", data);

                // 3️⃣ Zustand 상태 업데이트
                setUser({
                    id: user.id,
                    email: user.email || "알 수 없는 사용자",
                    role: user.role || "",
                });

                // 4️⃣ navigate
                // navigate("/");
            } catch (err) {
                console.error("AuthCallback 처리 중 에러:", err);
            }
        }

        handleAuth();

        // 5️⃣ 선택적: 로그인 상태 변화 구독 (로그 확인용)
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("onAuthStateChange 콜백:", _event, session);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [navigate, setUser]);

    return <main className="w-full h-full min-h-[720px] flex items-center justify-center">로그인을 진행 중입니다.</main>;
}
