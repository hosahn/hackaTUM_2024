import {SubmitHandler, useForm} from "react-hook-form";
import axios from 'axios';
import Timeline from "../components/Timeline.tsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

export default function ProvideSources() {

    const navigate = useNavigate();

    type Inputs = {
        urls: string;
    }

    const {
        register,
        handleSubmit,
    } = useForm<Inputs>();

    /*
    https://rss.app/feeds/MLuDKqkwFtd2tuMr.xml
https://www.autobild.de/rss/22590661.xml
     */

    const [loading, setLoading] = useState(false);
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        let urls = data.urls.split('\n').filter(e => e.length > 0);
        setLoading(true);
        axios.post("http://localhost:3000/api/getArticles", {urls}).then(response => {
            console.log(response.data);
            localStorage.setItem('articles', JSON.stringify(response.data));
            console.log(response.data);
            navigate("/selectTopics", {replace: true});
        });
    };

    return (
        <div className="w-3/4 mx-auto flex flex-row">
            <div className="w-full flex flex-col gap-10">
                <Timeline index={0}/>
                <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-2xl">Provide a list of sources</h1>
                    <textarea className="textarea textarea-bordered min-h-64"
                              placeholder="RSS feed urls..." {...register("urls")}/>
                    <button className="btn btn-primary text-white" type="submit" disabled={loading}>
                        {loading ? (<span className="loading loading-spinner loading-sm"></span>) : (<></>)}
                        Load new articles
                    </button>
                </form>
            </div>
        </div>
    );
}