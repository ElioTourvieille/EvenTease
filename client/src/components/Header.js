import logo from "../../src/assets/img/eventease-logo.png";
import CustomLink from "./CustomLink";

const Header = () => {
    return (
        <header className="font-semibold text-lg text-azure px-8">
            <nav className="w-full flex justify-between p-12">
                <img className="w-1/5 h-auto rounded-2xl" src={logo} alt={'logo'} title="Accueil"/>
                <div className="flex items-center pr-12">
                    <CustomLink to='/' title="Accueil" className="mr-4" />
                    <CustomLink to='/login' title="Connexion" className="mx-4"/>
                    <CustomLink to='/register' title="Inscription" className="ml-4"/>
                </div>
            </nav>
        </header>
    );
};

export default Header;