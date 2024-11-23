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

        let filteredArticles = data.data.filter(a => {
            if (keywords.length == 0) {
                return true;
            } else {
                for(let keyword of keywords) {
                    for(let topic of a.category.split(", ")) {
                        console.log(a.metainfo.title + " - " + topic + " = " + keyword.toLowerCase() + " -> " + (topic === keyword.toLowerCase()))
                        if (topic === keyword.toLowerCase()) return true;
                    }
                }
                return false;
            }
        });
        console.log(filteredArticles);
        setArticles(filteredArticles);
    }

    const [loading, setLoading] = useState(false);
    const submitData = () => {
        let urls = selection.map(i => data.data[i].metainfo.link);

        let topics_aggregated = selection.map(i => data.data[i].category.split(", ").map(s => s.toLowerCase())).flat();
        let keywords: string[] = [];

        for(let t of topics_aggregated) {
            if(keywords.indexOf(t) < 0) {
                keywords.push(t);
            }
        }

        let word_count = 500;
        console.log(keywords);

        setLoading(true);
        axios.post("http://localhost:3000/api/generateArticle", {
            urls,
            keywords,
            word_count,
        })
            .then(e => {
                localStorage.setItem("article-text", JSON.stringify(e.data));
                navigate("/reviewArticle", {replace: true});
            });
        /*
        axios.post("http://localhost:3000/api/generateArticle" , {urls}).then(e => {
            console.log(e.data);
            navigate("reviewArticle");
        });
        */
    };

    return (
        <div className="w-11/12 mx-auto flex flex-row">
            <div className="w-full flex max-h-[85vh] flex-col gap-7">
                <Timeline index={1}/>
                <FilterChipList keywords={data.categories} callback={handleFilterChange}/>
                <div className="grid grid-cols-2 gap-2 overflow-x-scroll">
                    {
                        articles.map(
                            (article, index) => (<NewsTile key={index} index={index} article={article}
                                                           callback={handleSelectionChange}/>)
                        )
                    }
                </div>
                <button className="btn btn-primary text-white" onClick={submitData} disabled={loading}>
                    {loading ? (<span className="loading loading-spinner loading-sm"></span>) : (<></>)}
                    Generate article
                </button>
            </div>
        </div>
    );
}
