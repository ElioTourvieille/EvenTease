import Bg404 from '../assets/img/404Bg.jpg';
import {useSelector} from "react-redux";
import {motion} from "framer-motion";
const Error404 = () => {

    const { user } = useSelector((state) => state.auth);
    const start = {
        initial: {
            opacity: 0,
        },
        animate:{
            opacity: 1,
            transition: {
                duration: 1.2,
                delay:  0.3,
            }
        }
    }

    return (
        <main className="w-full h-[100dvh] flex justify-center items-center">
            <motion.div className="w-1/2 text-center px-8"
                        initial={{x: '-150%',width:'50%'}}
                        animate={{x: "0%", width: '50%'}}
                        transition={{duration: 1.2, ease: "easeInOut"}}>
                <p className="text-xl font-semibold text-azure">Erreur 404</p>
                <h1 className="mt-8 text-6xl font-extrabold tracking-tight text-jet ">Page introuvable</h1>
                <p className="mt-10 text-xl leading-7 text-gray-600">Désolé, impossible de trouver la page que vous cherchez.</p>
                <div className="mt-14 flex items-center justify-center gap-x-6">
                    {
                        user ? (
                            <a href="/main" className="btn-primary">Retour à l'accueil</a>
                        ) : (
                            <a href="/" className="btn-primary">Retour à l'accueil</a>
                        )
                    }

                </div>
            </motion.div>
            <motion.div className=' lg:hidden'
                        variants={start}
                        initial="initial"
                        animate="animate"
            >
                <img src={Bg404} alt="404" className="w-auto h-[100vh] " />
            </motion.div>
        </main>
    );
};

export default Error404;