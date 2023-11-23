import logo from "../assets/img/eventease-logo.png";
import CustomLink from "./CustomLink";
import {LuBellRing} from "react-icons/lu";
import Avatar from "./Avatar";
import {useSelector} from "react-redux";

const NavBar = () => {

    const user = useSelector((state) => state.auth.user);

    console.log(user)

    return (
        <header className="font-semibold text-lg text-azure px-8">
            <nav className="w-full flex justify-between p-12">
                <img className="w-1/5 h-auto" src={logo} alt={'logo'} title="Accueil"/>
                <div className="flex justify-center items-center gap-12 pr-12">
                    <CustomLink to='/main' title="Accueil"/>
                    {user.user_type === 'admin' ? (
                        <>
                        <CustomLink to='/create' title="Créer un event" />
                        <CustomLink to='/manage' title="Gérer mes events" />
                        </>
                    ) : (
                        <CustomLink to='/myevent' title="Mes events" />
                    )}
                    <LuBellRing className="text-black font-bold text-2xl cursor-pointer"/>
                    <Avatar />
                </div>
            </nav>
        </header>
    );
};

export default NavBar;