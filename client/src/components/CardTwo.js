import {useEffect, useState} from "react";
import { MdEventAvailable } from "react-icons/md";
import eventsService from "../features/events/eventsService";
const CardTwo = () => {
    const [eventCount, setEventCount] = useState(0);

    useEffect(() => {
        eventsService.getEventCount()
            .then(data => setEventCount(data.count))
    }, [])

    return (
        <div className="w-2/5 flex justify-evenly rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-lg">
            <div className="flex flex-col gap-y-4 items-center">
                <span className="rounded-full bg-smoke p-4">
                    <MdEventAvailable className="text-3xl text-azure" />
                </span>
                <h3 className="text-title-sm font-bold text-dark">Nombre d'évènements</h3>
            </div>

            <div className="flex items-center">
                <h4 className="text-3xl font-bold text-black">
                    {eventCount}0
                </h4>
            </div>

        </div>
    );
};
export default CardTwo;
