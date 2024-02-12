import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout, reset} from "../features/auth/authSlice";
import {useEffect, useRef, useState} from "react";

const Avatar = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector(state => state.auth)
    const [displayDropdown, setDisplayDropdown] = useState(false)

    // Set first letter of first and last name to uppercase
    const firstLetterName = user.first_name.charAt(0).toUpperCase()
    const lastLetterName = user.last_name.charAt(0).toUpperCase()
    const dropdownRef = useRef(null)
    const buttonRef = useRef(null)

    const handleDropdown = () => {
        setDisplayDropdown(!displayDropdown)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                event.target !== buttonRef.current
            ) {
                setDisplayDropdown(false);
            }
        };

        // Add the event listener when the component is mounted
        document.addEventListener("click", handleClickOutside);

        // Clean up the event listener when the component is unmounted
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [setDisplayDropdown]);


    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }

    return (
        <>
            <button ref={buttonRef}
                onClick={handleDropdown}
                    className='w-10 h-10 ml-4 bg-azure text-white flex items-center justify-center rounded-full text-lg font-bold border border-solid border-transparent'
            >{firstLetterName}{lastLetterName}</button>
            {displayDropdown && (
                <div ref={dropdownRef}
                    className='absolute top-24 right-16 w-40 h-auto bg-white rounded-lg shadow-lg'>
                    <Link to='/profile' className='block w-full text-center px-3 py-3 hover:bg-azure hover:text-white'>Mon
                        profil</Link>
                    <button onClick={onLogout}
                            className='block w-full px-3 py-3 hover:bg-azure hover:text-white'>Déconnexion
                    </button>
                </div>
            )}
        </>
    );
};

export default Avatar;