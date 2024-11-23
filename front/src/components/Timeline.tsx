import {IoIosArrowDroprightCircle, IoIosCheckmarkCircle, IoMdRadioButtonOff} from "react-icons/io";

type TimelineProps = {
    index: number;
}

export default function Timeline(props: TimelineProps) {
    const steps = ["Provide Sources", "Select Topics", "Review Article", "Select Image", "Publish Article"];
    return (
        <div className="mx-auto">
            <ul className="timeline">
                {
                    steps.map((step, index) =>
                        (<li>
                                {index > 0 ? (<hr className="bg-white"/>) : (<></>)}
                                <div className="timeline-start">{index + 1}</div>
                                <div className="timeline-middle">
                                    {index < props.index ? (<IoIosCheckmarkCircle fill="currentColor"
                                                                                  size="2rem"/>) : index > props.index ? (
                                        <IoMdRadioButtonOff fill="currentColor" size="2rem"/>) : (
                                        <IoIosArrowDroprightCircle fill="currentColor" size="2rem"/>)}
                                </div>
                                <div className="timeline-end timeline-box">{step}</div>
                                {index < (steps.length - 1) ? (<hr className="bg-white"/>) : (<></>)}
                            </li>
                        )
                    )
                }
            </ul>
        </div>
    );

}