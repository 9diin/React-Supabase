import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores";
import supabase from "@/lib/supabase";

export default function AuthCallback() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!session?.user) {
                console.error("세션에 사용자 정보가 없습니다.");
                return;
            }

            const user = session.user;

            if (!user.id) {
                console.error("유효한 user.id가 없습니다. insert 중단");
                return;
            }

            try {
                // 로그로 세션/ID 확인
                console.log("세션 정보:", session);
                console.log("유저 ID:", user.id);

                // 이미 존재하는지 확인 (선택 사항)
                const { error: selectError } = await supabase.from("user").select("id").eq("id", user.id).maybeSingle();

                if (selectError) {
                    console.error("USER 테이블 조회 중 에러:", selectError.message);
                }

                // insert 또는 upsert (중복 PK 방지)
                const { error: upsertError } = await supabase
                    .from("user")
                    .upsert(
                        {
                            id: user.id,
                            email: user.email || "알 수 없는 사용자",
                            service_agreed: true,
                            privacy_agreed: true,
                            marketing_agreed: false,
                        },
                        { onConflict: "id" } // 중복 시 insert 무시
                    )
                    .select(); // insert 후 새 row 반환

                if (upsertError) {
                    console.error("USER 테이블 삽입/업서트 중 에러:", upsertError.message);
                    return;
                }

                // Zustand 상태 업데이트
                setUser({
                    id: user.id,
                    email: user.email || "알 수 없는 사용자",
                    role: user.role || "",
                });

                navigate("/"); // 로그인 완료 후 홈 이동
            } catch (error) {
                console.error("AuthCallback 처리 중 에러:", error);
            }
        });

        // 언마운트 시 구독 해지
        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return <main className="w-full h-full min-h-[720px] flex items-center justify-center">로그인을 진행 중입니다.</main>;
}
