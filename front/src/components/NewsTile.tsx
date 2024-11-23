import {useState} from "react";
import ArticleData from "../types/ArticleData.ts";
import "./NewsTile.css";


type NewsTileProps = {
    index: number,
    article: ArticleData,
    callback: (id: number) => void,
};

export default function NewsTile({index, article, callback}: NewsTileProps) {

    const [check, setChecked] = useState(false);

    const handleChange = () => {
        setChecked(!check);
        callback(index);
    }

    return (
        <>
            <label
                className={"m-5 p-5  shadow-xl flex flex-col gap-5 rounded-lg " + (check ? "text-black bg-primary glow-effect" : "bg-base-200")}>
                <input type="checkbox" checked={check} onChange={handleChange} hidden={true}/>
                <h2 className="card-title">
                    {article.metainfo.title}
                </h2>
                <span className="indicator-item badge badge-primary">{article.category}</span>
                <hr/>
                <p>{article.metainfo.content}</p>
            </label>
        </>
    );
}