import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores";
import supabase from "@/lib/supabase";

export default function AuthCallback() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const [alreadyNavigated, setAlreadyNavigated] = useState(false);

    useEffect(() => {
        // onAuthStateChange 구독을 통해 세션 처리 완료 시점을 기다립니다.
        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("onAuthStateChange 콜백:", event, session);

            // 1️⃣ 'SIGNED_IN' 이벤트와 유효한 세션이 있을 때만 로직 실행
            if (event === "SIGNED_IN" && session && session.user) {
                const user = session.user;

                try {
                    // 2️⃣ Upsert: user 테이블에 사용자 정보 삽입/업데이트
                    const { data, error: upsertError } = await supabase
                        .from("user")
                        .upsert(
                            {
                                id: user.id,
                                email: user.email || "알 수 없는 사용자",
                                service_agreed: true,
                                privacy_agreed: true,
                                marketing_agreed: false,
                            },
                            { onConflict: "id" } // id가 이미 존재하면 update
                        )
                        .select();

                    if (upsertError) {
                        // RLS 문제가 있다면 여기서 에러가 발생합니다.
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

                    // 4️⃣ 안전하게 navigate 제어 및 중복 호출 방지
                    if (!alreadyNavigated) {
                        navigate("/");
                        setAlreadyNavigated(true);
                    }
                } catch (err) {
                    console.error("AuthCallback Upsert 처리 중 에러:", err);
                }
            } else if (event === "SIGNED_OUT") {
                // 로그아웃 이벤트가 발생하면 홈페이지로 돌려보내는 등의 처리 가능
                // navigate('/login');
            }
        });

        // 클린업 함수: 구독 해제
        return () => {
            listener.subscription.unsubscribe();
        };
    }, [navigate, setUser, alreadyNavigated]);

    return <main className="w-full h-full min-h-[720px] flex items-center justify-center">로그인을 진행 중입니다.</main>;
}
