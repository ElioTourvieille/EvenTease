import teamBuild from "../assets/img/teamBuilding.jpg"
import {IoIosPeople} from "react-icons/io";
import {BiCalendarCheck} from "react-icons/bi";
import {FaMapMarkerAlt} from "react-icons/fa";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {participateInEvent, unsubscribeFromEvent} from "../features/events/eventsSlice";
import {toast} from "react-toastify";

const EventItem = ({user, event, est_name}) => {

    const dispatch = useDispatch();
    const userEvents = event.est_name === est_name
    const [displayPopup, setDisplayPopup] = useState(false)
    const [isParticipating, setIsParticipating] = useState(event.participants.includes(user._id))

    const handlePopup = () => {
        setDisplayPopup(!displayPopup)
    }

    const ClosePopup = () => {
        setDisplayPopup(false)
    }

    useEffect(() => {
        setIsParticipating(event.participants.includes(user._id))
    }, [event.participants, user._id])

    const handleSubscribe = () => {
        try {
            dispatch(participateInEvent(event._id))
            setIsParticipating(true)
            toast.success(`Vous êtes inscrit à l'événement ${event.title}`)
        } catch (error) {
            toast.error(`Une erreur est survenue: ${error}`)
        }
    }

    const handleUnsubscribe = () => {
        try {
            dispatch(unsubscribeFromEvent(event._id))
            setIsParticipating(false)
            toast.success(`Vous êtes désinscrit de l'événement ${event.title}`)
        } catch (error) {
            toast.error("Une erreur est survenue")
        }
    }

    return (
        <>
            {userEvents && (
                <div
                    className="flex flex-row justify-between w-full h-auto border border-phlox rounded-lg p-10 bg-white ">
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
                                        className="btn-secondary">Plus d'infos
                                </button>
                            </div>
                            {isParticipating ? (
                                <button onClick={handleUnsubscribe}
                                        className="btn-primary opacity-60">Se désinscrire</button>
                            ) : (
                                <button onClick={handleSubscribe}
                                        className="btn-primary">Participer</button>
                            )}

                        </div>
                    </div>
                    <img className="w-[45%]" src={teamBuild} alt=""/>

                    {displayPopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                            <div
                                className="w-[70%] h-[80%] absolute flex items-center justify-center rounded-2xl border border-phlox bg-smoke">
                                <button onClick={ClosePopup}
                                        className="absolute top-4 right-6 text-azure text-3xl font-semibold">X
                                </button>
                                <div className="w-[60%] h-[80%] flex flex-col items-start ml-auto">
                                    <img className="w-4/5 flex-shrink-0" src={teamBuild} alt=""/>
                                    <h3 className="w-4/5 text-azure text-xl font-semibold my-4">Description</h3>
                                    <p className="w-4/5 before:bg-platinum before:content-[''] before:flex before:self-center before:flex-auto before:h-0.5 before:mr-8"
                                    >{event.description}</p>
                                </div>

                                <div
                                    className="h-[80%] flex flex-col gap-y-4 justify-start items-start bg-white border-2 border-phlox rounded-2xl py-8 pl-12 mr-8">
                                    <h3 className="text-azure text-xl font-semibold">{event.title}</h3>
                                    <p className="">{event.type}</p>
                                    <span className="flex items-center gap-x-8"><IoIosPeople
                                        className="text-azure text-2xl"/><p
                                        className="text-lg">{event.invitation}</p> </span><span
                                    className="flex items-center gap-x-8"><BiCalendarCheck
                                    className="text-azure text-2xl"/><p
                                    className="text-lg">{event.date}</p></span>
                                    <span className="flex items-center gap-x-8 mb-5"><FaMapMarkerAlt
                                        className="text-azure text-2xl"/><p
                                        className="text-lg">{event.address}</p></span>
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11049.068067113838!2d6.1450985!3d46.1852449!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c7adbb23cb62b%3A0x9d7cd44468ec73a7!2sSAE%20Institute%20Gen%C3%A8ve!5e0!3m2!1sfr!2sch!4v1701876950624!5m2!1sfr!2sch"
                                        width="80%" allowFullScreen="" loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"></iframe>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default EventItem;