import logo from "../../src/assets/img/eventease-logo.png";

const NavBar = () => {
    return (
        <header>
            <img className="w-1/5 h-auto p-8" src={logo} alt={'logo'}/>
        </header>
    );
};

export default NavBar;