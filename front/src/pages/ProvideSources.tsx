import {SubmitHandler, useForm} from "react-hook-form";
import axios from 'axios';
import Timeline from "../components/Timeline.tsx";

export default function ProvideSources() {

    type Inputs = {
        urls: string;
    }

    const {
        register,
        handleSubmit,
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        let urls = data.urls.split('\n').filter(e => e.length > 0);
        axios.post("https://localhost:3000/api/getArticels", {urls}).then(console.log);
    };

    return (
        <div className="w-1/2 mx-auto flex flex-row">
            <div className="w-full flex flex-col gap-10">
                <Timeline index={0} />
                <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-2xl">Provide a list of sources</h1>
                    <textarea className="textarea textarea-bordered min-h-64"
                              placeholder="RSS feed urls..." {...register("urls")}/>
                    <button className="btn" type="submit">Load new articles</button>
                </form>
            </div>
        </div>
    );
}