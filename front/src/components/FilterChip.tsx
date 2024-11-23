import {useState} from "react";

type FilterChipProps = {
    keyword: string,
    callback: (keyword: string) => void,
};

export default function FilterChip({keyword, callback}: FilterChipProps) {

    const [check, setChecked] = useState(false);

    const handleChange = () => {
        setChecked(!check);
        callback(keyword);
    };

    return (
        <label>
            <input type="checkbox"
                   checked={check}
                   onChange={handleChange}
                   hidden={true}
            />
            <div className={"btn  " + (check ? "btn-primary text-black" : "")} >
                {keyword}
            </div>
        </label>
    );
}