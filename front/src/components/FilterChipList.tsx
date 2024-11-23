import {useState} from "react";
import FilterChip from "./FilterChip.tsx";

type FilterChipListProps = {
    keywords: string[],
    callback: (keywords: string[]) => void,
};

export default function FilterChipList({keywords, callback}: FilterChipListProps) {

    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

    const handleChange = (keyword: string) => {
        let result = selectedKeywords.indexOf(keyword);
        if (result !== -1) {
            selectedKeywords.splice(result, 1);
        } else {
            selectedKeywords.push(keyword);
        }
        setSelectedKeywords(selectedKeywords);
        callback(selectedKeywords ?? []);
    };

    return (
        <div className="flex flex-row gap-5 mx-auto">
            {keywords.map((keyword, index) => (<FilterChip key={index} keyword={keyword} callback={handleChange} />))}
        </div>
    );
}