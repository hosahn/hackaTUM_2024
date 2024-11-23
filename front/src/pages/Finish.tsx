import Timeline from "../components/Timeline.tsx";
import logo from "../../public/finish.gif";
import {useNavigate} from "react-router-dom";

export default function Finish() {

    const navigate = useNavigate();

    const handlePublish = () => {
        //navigate("/insights", {replace: true});
    }

    return (
        <div className="w-3/4 mx-auto flex flex-row">
            <div className="max-w-xl mx-auto flex flex-col gap-10">
                <Timeline index={3}/>
                <img src={logo} alt="loading..."/>
                <button className="btn btn-primary" onClick={handlePublish}>See Insights</button>
            </div>
        </div>

    );
}