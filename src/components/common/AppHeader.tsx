import { NavLink, useNavigate } from "react-router";
import { useAuthStore } from "@/stores";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

function AppHeader() {
    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);
    const reset = useAuthStore((state) => state.reset);

    const handleLogout = async () => {
        try {
            await reset(); // Zustand + Supabase 모두 로그아웃

            toast.success("로그아웃 되었습니다.");
            navigate("/sign-in");
        } catch (error) {
            console.error(error);
            toast.error("로그아웃 중 오류가 발생했습니다.");
        }
    };

    return (
        <header className="fixed top-0 z-20 w-full flex items-center justify-center bg-[#121212]">
            <div className="w-full max-w-[1328px] flex items-center justify-between px-6 py-3">
                {/* 로고 & 네비게이션 메뉴 UI */}
                <div className="flex items-center gap-5">
                    <img src="https://github.com/9diin.png" alt="@LOGO" className="w-6 h-6 cursor-pointer" />
                    <div className="flex items-center gap-5">
                        <NavLink to={"/"} className="font-semibold">
                            토픽 인사이트
                        </NavLink>
                        <Separator orientation="vertical" className="!h-4" />
                        <NavLink to={"/portfolio"} className="font-semibold">
                            포트폴리오
                        </NavLink>
                    </div>
                </div>

                {user ? (
                    <div className="flex items-center gap-5">
                        <span>{user.email}</span>
                        <Separator orientation="vertical" className="!h-4" />
                        <span onClick={handleLogout} className="cursor-pointer">
                            로그아웃
                        </span>
                    </div>
                ) : (
                    <NavLink to={"/sign-in"}>로그인</NavLink>
                )}
            </div>
        </header>
    );
}

export { AppHeader };
