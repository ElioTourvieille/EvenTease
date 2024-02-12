import {useEffect, useState} from 'react';
import logo from "../assets/img/eventease-logo.png";
import {login, reset} from "../features/auth/authSlice";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const Login = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const { email, password } = formData
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user, isSuccess, isError, message } = useSelector(state => state.auth)

    useEffect(() => {
        if(isError) {
            toast.error(message)
        }
        if(isSuccess) {
            toast.success('Bienvenue ' + user.first_name + ' ' + user.last_name)
            navigate('/main')
        }
        if(user) {
            navigate('/main')
        }
        dispatch(reset())
    }, [user, isSuccess, isError, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()

        const userData = {
            email,
            password,
        }
        dispatch(login(userData))
    }

    return (
        <main className="flex flex-col items-center py-12">
            <img className="w-1/5 h-auto rounded-2xl" src={logo} alt={'logo'} title="Accueil"/>
            <h1 className="font-extrabold text-4xl py-8">Se connecter à EvenTease</h1>
            <div className="border-secondary">
               <form onSubmit={onSubmit}
                     className="w-full flex flex-col bg-smoke rounded gap-8 py-12 px-24">

                   <div className="w-full flex flex-col justify-between items-left">
                       <label className="font-bold text-xl mb-2" htmlFor="email">Adresse Mail</label>
                       <input
                           type="email"
                           className="border border-jet rounded-lg py-2 px-8"
                           name='email'
                           value={email}
                           onChange={onChange}
                       />
                   </div>

                   <div className="w-full flex flex-col justify-between items-left">
                       <label className="font-bold text-xl mb-2" htmlFor="password">Mot de passe</label>
                       <input
                           type="password"
                           className="border border-jet rounded-lg py-2 px-8"
                           name='password'
                           value={password}
                           onChange={onChange}
                       />
                   </div>

                   <button type="submit" className="btn-primary flex justify-center mx-auto">
                       Connexion
                   </button>
               </form>
            </div>

            <div>
                    <p className="text-md text-center mt-8">
                    Pas encore de compte ? <a href="/register" className="text-azure">Inscrivez-vous</a>
                </p>
            </div>
        </main>
    );
};

export default Login;