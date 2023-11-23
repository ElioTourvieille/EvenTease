import createEvent from '../assets/img/events.svg'
import CustomInput from "../components/CustomInput";

const CreateEvent = () => {

    return (
        <main className="w-full flex justify-center">

            <section className="w-1/2 bg-smoke flex flex-col items-center">
                <h1 className="font-bold text-5xl py-12">Créer un event</h1>
                <img className="w-4/5 h-[100%]" src={createEvent} alt="Formulaire Create Event" />
            </section>

            <section className="w-1/2 pb-2 pl-16 pr-10 flex items-center justify-center">
                <form className="w-2/3" onSubmit="">

                    <div className="flex flex-col gap-8">
                        <div className="w-full flex justify-between items-center">
                            <label className="font-medium" htmlFor="title">Titre : </label>
                            <input
                                type="text"
                                className="border border-jet rounded-lg py-2 px-8"
                                name='title'
                            />
                        </div>

                        <div className="w-full flex justify-between items-center">
                            <label className="font-medium" htmlFor="type">Type : </label>
                            <select className="min-w-[250px] border border-jet rounded-lg py-2 px-8 text-center" name="type">
                                <option >Team Building</option>
                                <option >Conférence</option>
                                <option >Apéritif</option>
                                <option >Autres</option>
                            </select>
                        </div>

                        <div className="w-full flex justify-between items-center">
                            <label className="font-medium" htmlFor="access">Accès : </label>
                            <select className="min-w-[250px] border border-jet rounded-lg py-2 px-8 text-center" name="access">
                                <option className="mr-2" >Ouvert à tous</option>
                                <option >Equipe de direction</option>
                                <option >Service concerné</option>
                            </select>
                        </div>

                        <div className="w-full flex justify-between items-center">
                            <label className="font-medium" htmlFor="date">Date : </label>
                            <input
                                type="date"
                                className="min-w-[250px] border border-jet rounded-lg py-2 px-8"
                                name='date'
                            />
                        </div>


                        <div className="w-full flex justify-between items-center mr-4">
                            <label className="font-medium" htmlFor="address">Adress : </label>
                            <input
                                type="text"
                                className="border border-jet rounded-lg py-2 px-6"
                                name='address'
                            />
                        </div>

                        <div className="w-full flex justify-between items-center">
                            <label className="font-medium" htmlFor="est_type">Description : </label>
                            <textarea
                                rows="5"
                                className="border border-jet rounded-lg py-2 px-8"
                                name="description"
                            />
                        </div>

                        <div className="w-full flex justify-end">
                            <div className="w-2/3 text-center border border-azure rounded-lg py-[1rem] px-2 relative cursor-pointer">
                                <h3 className="text-phlox">Ajouter une Photo / Vidéo</h3>
                                <input className="block h-full w-full absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer" type="file" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary px-24 flex justify-center mt-8 mx-auto">
                        Créer
                    </button>

                </form>
            </section>
        </main>
    );
};

export default CreateEvent;