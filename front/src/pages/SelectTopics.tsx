import Timeline from "../components/Timeline.tsx";
import NewsTile from "../components/NewsTile.tsx";
import ArticleData from "../types/ArticleData.ts";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import FilterChipList from "../components/FilterChipList.tsx";
import {useState} from "react";

type SourceResponse = {
    categories: string[],
    data: ArticleData[],
}

export default function SelectTopics() {

    const navigate = useNavigate();

    let data: SourceResponse = JSON.parse(localStorage.getItem('articles') ?? JSON.stringify({
        categories: [],
        data: []
    }));

    let [articles, setArticles] = useState<ArticleData[]>(data.data);

    let [selection, setSelection] = useState<number[]>([]);
    const handleSelectionChange = (index: number) => {
        let result = selection.indexOf(index);
        if (result !== -1) {
            selection.splice(result, 1);
        } else {
            selection.push(index);
        }
        setSelection(selection);
    };

    let [filterKeywords, setFilterKeywords] = useState<string[]>([]);
    const handleFilterChange = (keywords: string[]) => {
        setFilterKeywords(keywords);
        setArticles(data.data.filter(a => (filterKeywords.length == 0 ? true : keywords.map(k => k.toLowerCase()).indexOf(a.category) !== -1)));
    }


    const submitData = () => {
        let urls = selection.map(i => data.data[i].metainfo.link);
        console.log(urls);
        axios.get("http://localhost:3000/api/debug").then(e => {
            console.log(e.data);
            localStorage.setItem("article-text", e.data);
            navigate("reviewArticle");
        });
        /*
        axios.post("http://localhost:3000/api/generateArticle" , {urls}).then(e => {
            console.log(e.data);
            navigate("reviewArticle");
        });
        */
    };

    return (
        <div className="w-3/4 mx-auto flex flex-row">
            <div className="w-full flex max-h-[75vh] flex-col gap-7">
                <Timeline index={2}/>
                <FilterChipList keywords={data.categories} callback={handleFilterChange}/>
                <div className="grid grid-cols-2 gap-2 overflow-x-scroll">
                    {
                        articles.map(
                            (article, index) => (<NewsTile key={index} index={index} article={article} callback={handleSelectionChange}/>)
                        )
                    }
                </div>
                <button className="btn btn-primary text-white" onClick={submitData}>Generate article</button>
            </div>
        </div>
    );
}
