import {Link} from "react-router-dom";
import teamBuild from "../assets/img/teamBuilding.jpg"
import { IoIosPeople } from "react-icons/io";
import {BiCalendarCheck} from "react-icons/bi";
import { FaMapMarkerAlt } from "react-icons/fa";

const EventItem = () => {
    return (
        <div className="flex flex-row justify-between w-[90%] h-auto border border-phlox rounded-lg p-10 bg-white ">
            <div className="w-1/2 flex flex-col gap-y-4 items-start ml-10">
                <h3 className="text-azure text-xl font-semibold">Séance sport collectif</h3>
                <p className="">Team Building</p>
                <span className="flex items-center gap-x-8"><IoIosPeople className="text-azure text-2xl"/><p className="text-lg">Ouvert à tous</p> </span>
                <span className="flex items-center gap-x-8"><BiCalendarCheck className="text-azure text-2xl" /><p className="text-lg">30.10.2023 à 10h</p></span>
                <span className="flex items-center gap-x-8"><FaMapMarkerAlt className="text-azure text-2xl" /><p className="text-lg">Satigny</p></span>

                <div className="flex flex-row gap-x-12 mt-6">
                    <div className="border-gradient">
                        <Link to="/login" className="btn-secondary">Plus d'infos</Link>
                    </div>
                    <button className="btn-primary">Participer</button>
                </div>
            </div>
            <img className="w-[45%]" src={teamBuild} alt="" />
        </div>
    );
};

export default EventItem;