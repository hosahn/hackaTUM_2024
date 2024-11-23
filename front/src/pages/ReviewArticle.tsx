import Timeline from "../components/Timeline.tsx";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

type GeneratedArticle = {
    title: string,
    subheadline: string,
    lead: string,
    body: string,
}

export default function ReviewArticle() {

    const data: GeneratedArticle = JSON.parse(localStorage.getItem("article-text") ?? "{\"title\": \"\", \"subheadline\": \"\", \"lead\":\"\", \"body\":\"\"}") ;
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1309964378484773007/iG-As_uGChsI9ILLw3-hQfB1qoJnoXyO3fb4BBnX9NRd27g6739ZBJlH3l4Ejr8njxLm';

    /*
    {
                    image: {
                        url: 'https://meedia.oberauer-cloud.com/news_detail_slider/uploads/news/67f4946f-37fc-42d0-98db-7d3d22c6a06f.jpg'
                    },
                },
                {
                    title: data.title,
                    description: data.lead,
                },
                {
                    title: data.subheadline,
                    description: data.body,
                }
     */

    const handlePublish = () => {
        setLoading(true);
        console.log(1);
        axios.post(DISCORD_WEBHOOK, {
            embeds: [{
                title: data.title,
                description: data.lead,
                image: {
                    url: 'https://meedia.oberauer-cloud.com/news_detail_slider/uploads/news/67f4946f-37fc-42d0-98db-7d3d22c6a06f.jpg'
                }
            },{
                title: data.subheadline,
                description: data.body,
            }]
        }).then(() => navigate("/finish", {replace: true}));
    }

    return (
        <div className="w-3/4 mx-auto flex flex-row">
            <div className="w-full flex max-h-[75vh] flex-col gap-7">
                <Timeline index={2}/>
                <div className="mockup-browser bg-base-300  border">
                    <div className="mockup-browser-toolbar">
                        <div className="input">https://headlinehunter.ai</div>
                    </div>
                    <div className="bg-base-200 flex flex-col px-4 py-4 h-full max-h-[75vh] overflow-y-scroll gap-5">
                        <h1 className="text-3xl font-bold">{data.title}</h1>
                        <p>{(new Date(Date.now())).toDateString()}, Garching</p>
                        <p>{data.lead}</p>
                        <img src={"https://meedia.oberauer-cloud.com/news_detail_slider/uploads/news/67f4946f-37fc-42d0-98db-7d3d22c6a06f.jpg"} alt={"loading..."} />
                        <h2 className="text-xl font-bold">{data.subheadline}</h2>
                        <p>{data.body}</p>
                        <br />
                        <br />
                    </div>
                </div>
                <button className="btn btn-primary text-white" type="submit" disabled={loading} onClick={handlePublish}>
                    {loading ? (<span className="loading loading-spinner loading-sm"></span>) : (<></>)}
                    Publish Article
                </button>
            </div>
        </div>
    );
}