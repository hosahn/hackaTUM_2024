import Timeline from "../components/Timeline.tsx";

export default function SelectInterestingTopics() {
    return (
        <div className="w-1/2 mx-auto flex flex-row">
            <div className="w-full flex flex-col gap-10">
                <Timeline index={1} />

            </div>
        </div>
    );
}
