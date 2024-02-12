import {useDispatch} from "react-redux";
import {useState} from "react";
import {deleteEvent} from "../features/events/eventsSlice";

const PopupAlert = ( {event} ) => {
    const dispatch = useDispatch()

    const [showModal, setShowModal] = useState(false)

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDelete = () => {
        dispatch(deleteEvent(event._id));
        handleCloseModal();
    };

    return (
        <div>
            <button onClick={handleShowModal} className="mr-2 bg-red-500 text-white px-4 py-2 rounded">Supprimer
            </button>
            {showModal && (
                <div
                    className="fixed inset-0 z-30 overflow-y-auto flex items-center justify-center min-h-screen p-4 text-center">
                    <div className="fixed inset-0 bg-gray-500 opacity-30"/>
                    <div
                        className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left text-lg align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                        <div className="flex flex-col justify-end">
                            <span onClick={handleCloseModal} className="self-end text-xl cursor-pointer font-bold p-2 rounded-sm hover:bg-platinum">X</span>
                            <h2>Êtes-vous sûr de vouloir supprimer cet événement ?</h2>
                            <div className="flex gap-x-3">
                                <button onClick={handleDelete}
                                        className="self-end mt-4 p-2 rounded-md font-bold text-md uppercase hover:bg-azure hover:text-white">Oui
                                </button>
                                <button onClick={handleCloseModal}
                                        className="self-end mt-4 p-2 rounded-md font-bold text-md uppercase hover:bg-azure hover:text-white">non
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default PopupAlert