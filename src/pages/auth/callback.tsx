import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores";
import supabase from "@/lib/supabase";

export default function AuthCallback() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            console.log("[onAuthStateChange] 세션:", session);

            if (!session?.user) {
                console.warn("세션에 사용자 정보가 없습니다.");
                return;
            }

            const user = session.user;

            if (!user.id) {
                console.warn("유저 ID가 없습니다.");
                return;
            }

            try {
                const { data: existing, error: selectError } = await supabase.from("users").select("id").eq("id", user.id).single();

                console.log("기존 유저 확인:", existing, selectError);

                if (!existing) {
                    const { error: insertError } = await supabase.from("users").insert([
                        {
                            id: user.id,
                            email: user.email,
                            service_agreed: true,
                            privacy_agreed: true,
                            marketing_agreed: false,
                        },
                    ]);

                    if (insertError) {
                        console.error("삽입 중 에러:", insertError);
                        return;
                    }

                    console.log("신규 유저 삽입 완료");
                }

                setUser({ id: user.id, email: user.email, role: user.role || "" });
                navigate("/");
            } catch (error) {
                console.error("예외 발생:", error);
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return <main className="w-full h-full min-h-[720px] flex items-center justify-center">로그인을 진행 중입니다.</main>;
}
