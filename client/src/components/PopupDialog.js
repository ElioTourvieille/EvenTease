import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {updateUser} from "../features/auth/authSlice";

const PopupDialog = () => {
    const {user} = useSelector(state => state.auth)
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const dispatch = useDispatch()

    // Create a local state for the form inputs
    const [email, setEmail] = useState(user.email)
    const [password, setPassword] = useState(user.password)

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUser({email, password})); // Dispatch with new values
    };

    return (
        <>
            <button onClick={handleClickOpen}
                    className="relative -top-14 cursor-pointer text-phlox text-lg hover:font-bold hover:scale-105">Modifier
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
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-phlox focus:border-phlox sm:text-sm"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    autoComplete="password"
                                    value="********"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-phlox focus:border-phlox sm:text-sm"
                                />
                            </div>
                        </form>
                        <button className="self-end mt-4 p-2 rounded-md font-bold text-md uppercase hover:bg-azure hover:text-white" onClick={handleSubmit}>Modifier</button>
                    </div>
                </div>
                </div>
            )}
        </>
    );
};

export default PopupDialog;
