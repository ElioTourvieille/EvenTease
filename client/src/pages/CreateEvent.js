import createEvent from '../assets/img/events.svg'

const CreateEvent = () => {

    return (
        <main className="w-full flex justify-center">

            <section className="w-1/2 bg-smoke flex flex-col items-center">
                <h1 className="font-bold text-5xl py-12">Créer un event</h1>
                <img className="w-3/4 h-[100%]" src={createEvent} alt="Formulaire Create Event" />
            </section>

            <section className="w-1/2 pb-10 pl-24 pr-16 flex items-center justify-center">
                <form onSubmit="">

                    <div className="flex flex-col gap-6">
                        <div className="w-full flex flex-row justify-between items-center">
                            <label className="font-medium" htmlFor="title">Titre : </label>
                            <input
                                type="text"
                                className="border border-jet rounded-lg py-2 px-8"
                                name='title'
                            />
                        </div>

                        <div className="w-full flex flex-row justify-between items-center">
                            <label className="font-medium" htmlFor="type">Type : </label>
                            <select className="min-w-[271px] border border-jet rounded-lg py-2 px-8 text-center" name="type">
                                <option >Team Building</option>
                                <option >Conférence</option>
                                <option >Apéritif</option>
                                <option >Autres</option>
                            </select>
                        </div>

                        <div className="w-full flex flex-row justify-between items-center">
                            <label className="font-medium" htmlFor="access">Accès : </label>
                            <select className="min-w-[271px] border border-jet rounded-lg py-2 px-8 text-center" name="access">
                                <option >Ouvert à tous</option>
                                <option >Equipe de direction</option>
                                <option >Service concerné</option>
                            </select>
                        </div>

                        <div className="w-full flex flex-row justify-between items-center">
                            <label className="font-medium" htmlFor="password">Mot de passe : </label>
                            <input
                                type="password"
                                className="border border-jet rounded-lg py-2 px-8"
                                name='password'
                                autoComplete={'on'}
                            />
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="w-full flex flex-row justify-between items-center mr-4">
                                <label className="font-medium" htmlFor="est_name">Nom de l'établissement : </label>
                                <input
                                    type="text"
                                    className="border border-jet rounded-lg py-2 px-6"
                                    name='est_name'
                                />
                            </div>
                            <div className="w-w-full flex flex-row justify-between items-center">
                                <label className="font-medium" htmlFor="est_type">Type d'établissement : </label>
                                <select className="border border-jet rounded-lg py-2 px-8" name="est_type">
                                    <option >Entreprise</option>
                                    <option >Association</option>
                                    <option >Autres</option>
                                </select>
                            </div>
                        </div>

                        <div className="w-full flex items-center justify-between">
                            <label className="font-normal">Cochez si vous êtes un administrateur</label>
                            <input
                                type="checkbox"
                                className="w-[35px] h-[35px] bg-azure rounded-2xl"
                                name='isAdmin'
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary flex justify-center mt-8 mx-auto">
                        Soumettre
                    </button>

                </form>
            </section>
        </main>
    );
};

export default CreateEvent;