import Timeline from "../components/Timeline.tsx";
import NewsTile from "../components/NewsTile.tsx";
import ArticleData from "../types/ArticleData.ts";
import axios from 'axios';
import {useNavigate} from "react-router-dom";

export default function SelectInterestingTopics() {

    const navigate = useNavigate();

    let data: ArticleData[] = JSON.parse(localStorage.getItem('articles') ?? "[]");
    let selection: number[] = [];

    const handleSelectionChange = (index: number) => {
        let result = selection.find(data => data == index);
        if (result !== undefined) {
            selection.splice(result, 1);
        } else {
            selection.push(index);
        }
    };

    const submitData = () => {
        let urls = selection.map(i => data[i].metainfo.link);
        console.log(urls);
        axios.post("http://localhost:3000/api/generateArticle" , {urls}).then(e => {
            console.log(e.data);
            navigate("reviewArticle");
        });
    };

    return (
        <div className="w-3/4 mx-auto flex flex-row">
            <div className="w-full flex max-h-[75vh] flex-col gap-7">
                <Timeline index={1}/>
                <div className="grid grid-cols-2 gap-2 overflow-x-scroll">
                    {data.map((article, index) => (
                        <NewsTile index={index} article={article} callback={handleSelectionChange}/>))}
                </div>
                <button className="btn btn-primary text-white" onClick={submitData}>Generate article</button>
            </div>
        </div>
    );
}
