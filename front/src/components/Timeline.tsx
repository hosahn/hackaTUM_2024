import {IoIosArrowDroprightCircle, IoIosCheckmarkCircle, IoMdRadioButtonOff} from "react-icons/io";
import {Link} from "react-router-dom";

type TimelineProps = {
    index: number;
}

export default function Timeline(props: TimelineProps) {
    const steps = ["Provide Sources", "Select Topics", "Review Article", "Published!"];
    const links = ["/", "/selectTopics", "/reviewArticle", "/finish"];


    return (
        <div className="mx-auto">
            <ul className="timeline">
                {
                    steps.map((step, index) =>
                        (<li key={index}>
                                {index > 0 ? (<hr className="bg-white"/>) : (<></>)}
                                <div className="timeline-start">{index + 1}</div>
                                <div className="timeline-middle">
                                    { props.index === (steps.length - 1) ? (<IoIosCheckmarkCircle fill="currentColor" size="2rem"/>) :
                                        index < props.index ? (<IoIosCheckmarkCircle fill="currentColor" size="2rem"/>) :
                                            index > props.index ? (<IoMdRadioButtonOff fill="currentColor" size="2rem"/>) :
                                                (
                                        <IoIosArrowDroprightCircle fill="currentColor" size="2rem"/>)}
                                </div>
                                {
                                    (index < props.index) ? (<Link to={links[index]} className="timeline-end timeline-box">{step}</Link>) : (<div className="timeline-end timeline-box">{step}</div>)
                                }
                                {index < (steps.length - 1) ? (<hr className="bg-white"/>) : (<></>)}
                            </li>
                        ))
                }
            </ul>
        </div>
    );

}