import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {updateEvent} from "../features/events/eventsSlice";

const PopupDialogEvent = ({event}) => {
    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const dispatch = useDispatch()

    // Create a local state for the form inputs
    const [title, setTitle] = useState(event.title)
    const [type, setType] = useState(event.type)
    const [date, setDate] = useState(event.date)
    const [time, setTime] = useState(event.time)
    const [address, setAddress] = useState(event.address)
    const [description, setDescription] = useState(event.description)

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateEvent({title, type, date, time, address, description})); // Dispatch with new values
    };

    return (
        <>
            <button onClick={handleClickOpen}
                    className="mr-2 bg-azure text-white px-4 py-2 rounded">Modifier
            </button>
            {open && (
                <div className="fixed inset-0 z-30 overflow-y-auto flex items-center justify-center min-h-screen p-4 text-center">
                    <div className="fixed inset-0 bg-gray-500 opacity-30"/>
                    <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Modifier les informations</h2>
                            <button className="font-bold p-2 rounded-sm hover:bg-platinum" onClick={handleClose}>X</button>
                        </div>
                        <div className="flex flex-col justify-between h-full">
                            <form onSubmit={handleSubmit}>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Titre</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-phlox focus:border-phlox sm:text-sm"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <input
                                        type="text"
                                        name="type"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-phlox focus:border-phlox sm:text-sm"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        type="date"
                                        name="Date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-phlox focus:border-phlox sm:text-sm"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Horaire</label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-phlox focus:border-phlox sm:text-sm"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Adresse</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-phlox focus:border-phlox sm:text-sm"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-phlox focus:border-phlox sm:text-sm"
                                    />
                                </div>
                            </form>
                            <button
                                className="self-end mt-4 p-2 rounded-md font-bold text-md uppercase hover:bg-azure hover:text-white"
                                onClick={handleSubmit}>Modifier
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PopupDialogEvent;