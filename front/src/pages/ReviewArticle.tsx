import Timeline from "../components/Timeline.tsx";

export default function ReviewArticle() {
    return (
        <div className="w-3/4 mx-auto flex flex-row">
            <div className="w-full flex max-h-[75vh] flex-col gap-7">
                <Timeline index={2}/>
                <div className="mockup-browser bg-base-300 border">
                    <div className="mockup-browser-toolbar">
                        <div className="input">https://headlinehunter.ai</div>
                    </div>
                    <div className="bg-base-200 flex flex-col px-4 py-4 h-[75vh] max-h-[75vh] overflow-y-scroll">
                        Hello!
                    </div>
                </div>
            </div>
            <button>Proceed to publish article</button>
        </div>
    );
}