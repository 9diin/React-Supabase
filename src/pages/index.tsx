import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores";
import { AppDraftsDialog, AppSidebar } from "../components/common";
import { SkeletonHotTopic, SkeletonNewTopic } from "../components/skeleton";
import { Button } from "../components/ui";
import { CircleSmall, NotebookPen, PencilLine } from "lucide-react";
import { toast } from "sonner";
import supabase from "@/lib/supabase";

function App() {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    // 나만의 토픽 생성 버튼 클릭 시
    const handleRoute = async () => {
        if (!user.id || !user.email || !user.role) {
            toast.warning("토픽 작성은 로그인 후 가능합니다.");
            return;
        }

        // RLS Policy 설정할 때, auth.uid() = author
        const { data, error } = await supabase
            .from("topic")
            .insert([
                {
                    status: null,
                    title: null,
                    content: null,
                    category: null,
                    thumbnail: null,
                    author: user.id,
                },
            ])
            .select();

        if (error) {
            toast.error(error.message);
            return;
        }

        if (data) {
            toast.success("토픽을 생성하였습니다.");
            navigate(`/topics/${data[0].id}/create`);
        }
    };

    return (
        <main className="w-full h-full min-h-[720px] flex p-6 gap-6">
            <div className="fixed right-1/2 bottom-10 translate-x-1/2 z-20 flex items-center gap-2">
                <Button variant={"destructive"} className="!py-5 !px-6 rounded-full" onClick={handleRoute}>
                    <PencilLine />
                    나만의 토픽 작성
                </Button>
                <AppDraftsDialog>
                    <div className="relative">
                        <Button variant={"outline"} className="w-10 h-10 rounded-full">
                            <NotebookPen />
                        </Button>
                        <CircleSmall size={14} className="absolute top-0 right-0 text-red-500" fill="#EF4444" />
                    </div>
                </AppDraftsDialog>
            </div>
            {/* 카테고리 사이드바 */}
            <AppSidebar />
            {/* 토픽 콘텐츠 */}
            <section className="flex-1 flex flex-col gap-12">
                {/* 핫 토픽 */}
                <div className="w-full flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <img src="/assets/gifs/gif-001.gif" alt="@IMG" className="w-7 h-7" />
                            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">HOT 토픽</h4>
                        </div>
                        <p className="md:text-base text-muted-foreground">지금 가장 주목받는 주제들을 살펴보고, 다양한 관점의 인사이트를 얻어보세요.</p>
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                        <SkeletonHotTopic />
                        <SkeletonHotTopic />
                        <SkeletonHotTopic />
                        <SkeletonHotTopic />
                    </div>
                </div>
                {/* NEW 토픽 */}
                <div className="w-full flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <img src="/assets/gifs/gif-002.gif" alt="@IMG" className="w-7 h-7" />
                            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">NEW 토픽</h4>
                        </div>
                        <p className="md:text-base text-muted-foreground">새로운 시선으로, 새로운 이야기를 시작하세요. 지금 바로 당신만의 토픽을 작성해보세요.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <SkeletonNewTopic />
                        <SkeletonNewTopic />
                        <SkeletonNewTopic />
                        <SkeletonNewTopic />
                    </div>
                </div>
            </section>
        </main>
    );
}

export default App;
