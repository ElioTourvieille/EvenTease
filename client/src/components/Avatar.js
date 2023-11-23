import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout, reset} from "../features/auth/authSlice";
const Avatar = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector(state => state.auth)

    const firstLetterName = user.first_name.charAt(0).toUpperCase()
    const lastLetterName = user.last_name.charAt(0).toUpperCase()

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }

    return (
        <>
            <Link onClick={onLogout} to="/"
                  className='w-10 h-10 ml-4 bg-azure text-white flex items-center justify-center rounded-full text-lg font-bold border border-solid border-transparent'
            >{firstLetterName}{lastLetterName}</Link>
        </>
    );
};

export default Avatar;