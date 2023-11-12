import Bg404 from '../assets/img/404Bg.jpg';
const Error404 = () => {
    return (
        <main className="w-full h-[100vh] flex justify-center items-center">
            <div className="w-1/2 text-center px-8">
                <p className="text-xl font-semibold text-azure">Erreur 404</p>
                <h1 className="mt-8 text-6xl font-extrabold tracking-tight text-jet ">Page introuvable</h1>
                <p className="mt-10 text-xl leading-7 text-gray-600">Désolé, impossible de trouver la page que vous cherchez.</p>
                <div className="mt-14 flex items-center justify-center gap-x-6">
                    <a href="/" className="btn-primary">Retour à l'accueil</a>
                </div>
            </div>
            <img src={Bg404} alt="404" className="w-auto h-[100vh] lg:inline-block md:hidden sm:hidden " />
        </main>
    );
};

export default Error404;