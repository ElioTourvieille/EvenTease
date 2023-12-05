import newEvent from '../assets/img/events.svg'
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {createEvent, reset} from "../features/events/eventsSlice";

const CreateEvent = () => {

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        address: '',
        description: '',
        picture: '',
    })
    const [type, setType] = useState('Team Building')
    const [invitation, setInvitation] = useState('Ouvert à tous')

    const { user } = useSelector((state) => state.auth)

    const { title, date, address, description, picture } = formData
    const { events, isLoading, isSuccess, isError, message } = useSelector((state) => state.events)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        console.log(isSuccess, isError, message)
        if(isSuccess) {
            toast.success(`L'évènement "${title}" a bien été créé.` )
            navigate('/main')
        }
        if(isError) {
            toast.error(message)
        }
        dispatch(reset())

    }, [events, isSuccess, isError, message, navigate, dispatch])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const onInvitChange = (e) => {
            setInvitation(e.target.value);
    }

    const onTypeChange = (e) => {
        setType(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if (!title || !date || !address || !description) {
            toast.error("Veuillez remplir tous les champs.")
            return
        }

        const eventData = {
            title,
            type,
            invitation,
            date,
            address,
            description,
            picture: picture ? picture : null,
            user: user._id,
            est_name: user.est_name,
        }

        dispatch(createEvent(eventData))
    }

    return (
        <main className="w-full flex justify-center">

            <section className="w-1/2 bg-smoke flex flex-col items-center">
                <h1 className="font-bold text-5xl py-12">Créer un event</h1>
                <img className="w-4/5 h-[100%]" src={newEvent} alt="Formulaire Create Event" />
            </section>

            <section className="w-1/2 pb-2 pl-16 pr-10 flex items-center justify-center">
                <form className="w-2/3" onSubmit={onSubmit}>

                    <div className="flex flex-col gap-8">
                        <div className="w-full flex justify-between items-center">
                            <label className="font-medium" htmlFor="title">Titre : </label>
                            <input
                                type="text"
                                className="max-w-[250px] border border-jet rounded-lg py-2 px-8"
                                name='title'
                                value={title}
                                onChange={onChange}
                            />
                        </div>

                        <div className="w-full flex justify-between items-center">
                            <label className="font-medium" htmlFor="type">Type : </label>
                            <select className="min-w-[250px] border border-jet rounded-lg py-2 px-8 text-center"
                                    name="type"
                                    value={type}
                                    onChange={onTypeChange}
                            >
                                <option value="Team Building">Team Building</option>
                                <option value="Conférence">Conférence</option>
                                <option value="Apéritif">Apéritif</option>
                                <option value="Autres">Autres</option>
                            </select>
                        </div>

                        <div className="w-full flex justify-between items-center">
                            <label className="font-medium" htmlFor="invitation">Accès : </label>
                            <select className="min-w-[250px] border border-jet rounded-lg py-2 px-8 text-center"
                                    name="invitation"
                                    value={invitation}
                                    onChange={onInvitChange}
                            >
                                <option className="mr-2" value="Ouvert à tous">Ouvert à tous</option>
                                <option value="Equipe de direction">Equipe de direction</option>
                                <option value="Service concerné" >Service concerné</option>
                            </select>
                        </div>

                        <div className="w-full flex justify-between items-center">
                            <label className="font-medium" htmlFor="date">Date : </label>
                            <input
                                type="date"
                                className="min-w-[250px] border border-jet rounded-lg py-2 px-8"
                                name='date'
                                value={date}
                                onChange={onChange}
                            />
                        </div>

                        <div className="w-full flex justify-between items-center mr-4">
                            <label className="font-medium" htmlFor="address">Adresse : </label>
                            <input
                                type="text"
                                className="border border-jet rounded-lg py-2 px-6"
                                name='address'
                                value={address}
                                onChange={onChange}
                            />
                        </div>

                        <div className="w-full flex justify-between items-start">
                            <label className="font-medium" htmlFor="est_type">Description : </label>
                            <textarea
                                rows="5"
                                className="border border-jet rounded-lg py-2 px-8"
                                name="description"
                                value={description}
                                onChange={onChange}
                            />
                        </div>

                        <div className="w-full flex justify-end hover:scale-105 ease-in">
                            <div className="w-2/3 text-center border border-azure rounded-lg py-[1rem] px-2 relative cursor-pointer">
                                <h3 className="text-phlox">Ajouter une Photo / Vidéo</h3>
                                <input className="block h-full w-full absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer" type="file"
                                        name="file"
                                        value={picture}
                                        onChange={onChange}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary flex justify-end px-24 mt-8">
                        Créer
                    </button>

                </form>
            </section>
        </main>
    );
};

export default CreateEvent;