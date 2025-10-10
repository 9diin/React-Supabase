import supabase from "@/lib/supabase";
import { useAuthStore } from "@/stores";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function AuthCallback() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!session?.user) return;

            const user = session.user;

            // UUID 체크
            if (!user.id) return console.error("user.id is empty!");

            try {
                const { data: existing } = await supabase.from("user").select("id").eq("id", user.id).single();

                if (!existing) {
                    await supabase.from("user").insert([
                        {
                            id: user.id,
                            email: user.email,
                            service_agreed: true,
                            privacy_agreed: true,
                            marketing_agreed: false,
                        },
                    ]);
                }
            } catch (error) {
                console.error(error);
            }

            setUser({ id: user.id, email: user.email as string, role: user.role as string });
            navigate("/");
        });

        // 언마운트 시 구독 해제
        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    return <main className="w-full h-full min-h-[720px] flex items-center justify-center">로그인을 진행 중입니다...</main>;
}
