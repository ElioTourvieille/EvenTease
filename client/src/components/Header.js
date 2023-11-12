import logo from "../../src/assets/img/eventease-logo.png";
import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";

const CustomLink = ({ to, title, className = "", href }) => {
    const location = useLocation();
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // Compare the actual route with value of "to"
        setIsActive(location.pathname === to);
    }, [location.pathname, to]);

    return (
        <Link href={href} to={to} className={`${className} relative group`}>
        {title}
        <span className={`
        h-[2px] inline-block bg-azure
        absolute left-0 -bottom-1.5
        group-hover:w-full transition-[width] ease duration-300
        ${isActive ? 'w-full' : 'w-0'} transition-[width] ease duration-300
        `}
        >&nbsp;</span>
        </Link>
    );
}

const Header = () => {
    return (
        <header className="font-semibold text-lg text-azure px-8">
            <nav className="w-full flex justify-between p-12">
                <img className="w-1/5 h-auto" src={logo} alt={'logo'} title="Accueil"/>
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