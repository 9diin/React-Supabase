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
                console.error("유저 ID가 없습니다.");
                return;
            }

            try {
                // 🔹 upsert 사용: 이미 존재하면 insert 무시
                const { data, error } = await supabase
                    .from("user")
                    .upsert(
                        {
                            id: user.id,
                            email: user.email || "알 수 없는 사용자",
                            service_agreed: true,
                            privacy_agreed: true,
                            marketing_agreed: false,
                        },
                        { onConflict: "id" } // id가 이미 있으면 insert 무시
                    )
                    .select(); // 새 row 반환

                if (error) {
                    console.error("USER 테이블 삽입/업서트 중 에러:", error.message);
                    return;
                }

                console.log("업서트 결과:", data);

                // Zustand 상태 업데이트
                setUser({
                    id: user.id,
                    email: user.email || "알 수 없는 사용자",
                    role: user.role || "",
                });

                // navigate도 정상적으로 동작
                navigate("/");
            } catch (err) {
                console.error("AuthCallback 처리 중 에러:", err);
            }
        });

        // 언마운트 시 구독 해지
        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return <main className="w-full h-full min-h-[720px] flex items-center justify-center">로그인을 진행 중입니다.</main>;
}
