import teamBuild from "../assets/img/teamBuilding.jpg"
import { IoIosPeople } from "react-icons/io";
import {BiCalendarCheck} from "react-icons/bi";
import { FaMapMarkerAlt } from "react-icons/fa";
import {useState} from "react";

const EventItem = ({ event, est_name }) => {

    const userEvents = event.est_name === est_name

    const [displayPopup, setDisplayPopup] = useState(false)

    const handlePopup = () => {
        setDisplayPopup(!displayPopup)
    }

    const ClosePopup = () => {
        setDisplayPopup(false)
    }

    if (userEvents) {
        return (

            <div className="flex flex-row justify-between w-[90%] h-auto border border-phlox rounded-lg p-10 bg-white ">
                <div className="w-1/2 flex flex-col gap-y-4 items-start ml-10">
                    <h3 className="text-azure text-xl font-semibold">{event.title}</h3>
                    <p className="">{event.type}</p>
                    <span className="flex items-center gap-x-8"><IoIosPeople className="text-azure text-2xl"/><p
                        className="text-lg">{event.invitation}</p> </span>
                    <span className="flex items-center gap-x-8"><BiCalendarCheck className="text-azure text-2xl"/><p
                        className="text-lg">{event.date}</p></span>
                    <span className="flex items-center gap-x-8"><FaMapMarkerAlt className="text-azure text-2xl"/><p
                        className="text-lg">{event.address}</p></span>

                    <div className="flex flex-row gap-x-12 mt-6">
                        <div className="border-gradient">
                            <button onClick={handlePopup}
                                  className="btn-secondary">Plus d'infos</button>
                        </div>
                        <button className="btn-primary">Participer</button>
                    </div>
                </div>
                <img className="w-[45%]" src={teamBuild} alt=""/>

                {displayPopup && (
                    <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-500 opacity-90">
                        <div className="absolute lf inset-0 border border-phlox bg-smoke">
                            <img className="w-[45%]" src={teamBuild} alt=""/>
                            <div className="flex flex-col gap-y-4 items-start ml-10">
                                <h3 className="text-azure text-xl font-semibold">{event.title}</h3>
                                <p className="">{event.type}</p>
                                <span className="flex items-center gap-x-8"><IoIosPeople className="text-azure text-2xl"/><p
                                    className="text-lg">{event.invitation}</p> </span><span className="flex items-center gap-x-8"><BiCalendarCheck className="text-azure text-2xl"/><p
                                className="text-lg">{event.date}</p></span>
                                <span className="flex items-center gap-x-8"><FaMapMarkerAlt className="text-azure text-2xl"/><p
                                    className="text-lg">{event.address}</p></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>)
    } else {
        return (
            <h3 className="text-2xl my-16">Aucun évènement pour le moment</h3>
        )}
}

export default EventItem;