import { AppFooter, AppHeader, AppSidebar } from "./components/common";
import { SkeletonHotTopic, SkeletonNewTopic } from "./components/skeleton";
import { ThemeProvider } from "./components/theme-provider";
import { Skeleton } from "./components/ui";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="page">
                <AppHeader />
                <div className="container">
                    <main className="w-full h-full min-h-[720px] flex p-6 gap-6">
                        {/* 카테고리 사이드바 */}
                        <AppSidebar />
                        {/* 토픽 콘텐츠 */}
                        <section className="flex-1 flex flex-col gap-12">
                            {/* 핫 토픽 */}
                            <div className="w-full flex flex-col gap-6">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <img src="/assets/fire.gif" alt="@IMG" className="w-7 h-7" />
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
                                        <img src="/assets/writing-hand.gif" alt="@IMG" className="w-7 h-7" />
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
                </div>
                <AppFooter />
            </div>
        </ThemeProvider>
    );
}

export default App;
