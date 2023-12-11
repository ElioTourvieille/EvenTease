import {Link} from "react-router-dom";
import {Bounce, Fade, Slide} from "react-awesome-reveal";

// Components
import AnimatedText from "../components/AnimatedText";

//Assets
import mainImg from "../assets/img/celebration.png";

// Icons
import {LuBellRing} from "react-icons/lu";
import {BiCalendarCheck, BiMailSend} from "react-icons/bi";
import {IoPeopleSharp} from "react-icons/io5";
const Home = () => {

    return (
        <main>
            <section className="flex justify-evenly my-16 px-8 py-10">
                <Fade duration="1000">
                <img src={mainImg} alt="Image principale de célébration" className='w-full h-auto outline-none xl:inline-block sm:hidden xs:hidden'
                     loading="eager"/>
                </Fade>
                <div className="flex flex-col justify-center items-center text-center">
                    <AnimatedText text="Célébrez avec EventEase !"/>
                    <Bounce direction="right" triggerOnce duration="1200">
                    <p className="font-normal text-2xl max-w-xl my-10">
                        Votre plateforme pour organiser tous vos évènements !
                    </p>
                    <div className="flex justify-center items-center gap-16">
                        <div className="border-gradient">
                            <Link to="/login" className="btn-secondary">Se connecter</Link>
                        </div>
                        <Link to="/register" className="btn-primary w-[185px] h-[56px]">S' inscrire</Link>
                    </div>
                    </Bounce>
                </div>
            </section>

            <section id="about" className="w-full flex flex-col items-center mt-24 px-8 py-28 bg-platinum">
                 <div className="w-3/4 flex flex-col gap-10 mb-12">
                     <h2 className="w-1/5 flex font-bold text-phlox text-2xl
                before:bg-phlox before:content-[''] before:flex before:self-center before:flex-auto before:h-0.5
                before:mr-8
                ">A propos</h2>
                     <Slide direction="left" triggerOnce>
                    <div className="flex flex-row justify-between items-center py-10 border-b-2 border-azure">
                        <h3 className="w-2/5 font-semibold text-azure text-left text-3xl uppercase leading-loose">
                            La plateforme professionnellle pour la gestion et l'organisation d'évènements
                        </h3>
                        <p className="w-2/5 font-medium text-xl leading-8">
                            Simplifiez l'organisation de vos différents évènements que ce soit
                            anniversaire, pot de départ ou encore séminaire d'entreprise.
                            Grâce à notre plateforme en ligne, vous pouvez facilement créer de
                            nouveaux events, les gérer et inviter vos contacts.
                        </p>
                    </div>
                    </Slide>
                </div>

                <Slide direction="right" triggerOnce>
                <div className="w-full flex gap-36 justify-center flex-wrap mt-12">

                    <div className="w-[30%] border-secondary">
                        <span className="w-full h-full flex flex-col justify-center bg-white rounded-lg px-6">
                            <div className="w-full flex justify-between pr-8 mb-10">
                                <h4 className="text-phlox text-2xl font-semibold">
                                    Création d'events
                                </h4>
                                <BiCalendarCheck className="text-phlox text-3xl" />
                            </div>
                            <p className="">Créez simplement et rapidement votre
                                évènement grâce à notre plateforme
                                très intuitive. Ensuite gérer les via votre
                                espace perso, ajouter des images ou vidéos.</p>
                        </span>
                    </div>

                    <div className="w-[30%] border-secondary">
                       <span className="w-full h-full flex flex-col justify-center bg-white rounded-lg px-6 py-10">
                            <div className="w-full flex justify-between pr-8 mb-10">
                                <h4 className="text-phlox text-2xl font-semibold">
                                    Notifications
                                </h4>
                                <LuBellRing className="text-phlox text-3xl" />
                            </div>
                            <p className="">Restez informer des différents évènements
                                à venir grâce aux notifications présentes
                                sur la plateforme avec un système de rappel
                                à la connexion ou lors de changements.</p>
                        </span>
                    </div>

                    <div className="w-[30%] border-secondary">
                        <span className="w-full h-full flex flex-col justify-center bg-white rounded-lg px-6">
                            <div className="w-full flex justify-between pr-8 mb-10">
                                <h4 className="text-phlox text-2xl font-semibold">
                                    Participants
                                </h4>
                                <BiMailSend className="text-phlox text-4xl" />
                            </div>
                            <p className="">Inviter tous les participants sans effort avec
                                notre système d'invitation intégré.
                                Conserver un oeil sur le nombre de
                                participants des events passés ou à venir.  </p>
                        </span>
                    </div>

                    <div className="w-[30%] border-secondary">
                        <span className="w-full h-full flex flex-col justify-center bg-white rounded-lg px-6 py-10">
                            <div className="w-full flex justify-between pr-8 mb-10">
                                <h4 className="text-phlox text-2xl font-semibold">
                                    Admin Dashboard
                                </h4>
                                <IoPeopleSharp className="text-phlox text-3xl" />
                            </div>
                            <p className="">Définissez le type d'accès pour chaque
                                utilisateur (admin ou user).
                                Retrouver toutes les informations grâce à
                                votre Dashboard administrateur .  </p>
                        </span>
                    </div>

                </div>
                </Slide>
            </section>
        </main>
    );
};

export default Home;