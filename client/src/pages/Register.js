import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {reset, register} from '../features/auth/authSlice';

/*Assets*/
import registerImg from '../assets/img/sign-up.png';
import Spinner from "../components/Spinner";

const Register = () => {

    const [formData, setFormData] = useState({
        last_name: '',
        first_name: '',
        email: '',
        password: '',
        est_name: '',
        est_type: '',
        user_type: 'user',
    })

    const { last_name, first_name, email, password, est_name, est_type, user_type } = formData
    const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        console.log(isSuccess, isError, message, user)
        if(isSuccess) {
            toast.success('Bienvenue ! ' + user.first_name + ' ' + user.last_name)
            navigate('/main')
        }

        if(isError) {
            toast.error(message)
        }
        if(user) {
            navigate('/')
        }
        dispatch(reset())

    }, [user, isSuccess, isError, message, navigate, dispatch])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const onClick = () => {
        setFormData((prevState) => ({
            ...prevState,
            user_type: prevState.user_type === 'user' ? 'admin' : 'user'
        }));

    };

    const onSubmit = (e) => {
        e.preventDefault()

        const userData = {
              last_name,
              first_name,
              email,
              password,
              est_name,
              user_type
            }
            dispatch(register(userData))
        }

    if (isLoading) {
        return <Spinner />
    }

    return (
        <main className="w-full flex justify-center">

            <section className="w-1/2 bg-smoke flex flex-col items-center">
                <h1 className="font-bold text-5xl py-12">Créer un compte</h1>
                <img className="w-3/4 h-[100%]" src={registerImg} alt="Formulaire Join Us" />
            </section>

            <section className="w-1/2 pb-10 pl-24 pr-16 flex justify-center">
                <form onSubmit={onSubmit}>
                    <h2 className="font-bold text-azure text-2xl py-10">Informations personnelles :</h2>

                <div className="flex flex-col gap-6">
                    <div className="w-full flex flex-row justify-between items-center">
                        <label className="font-medium" htmlFor="last_name">Nom : </label>
                        <input
                            type="text"
                            className="border border-jet rounded-lg py-2 px-8"
                            name='last_name'
                            value={last_name}
                            onChange={onChange}
                        />
                    </div>

                    <div className="w-full flex flex-row justify-between items-center">
                        <label className="font-medium" htmlFor="first_name">Prénom : </label>
                        <input
                            type="text"
                            className="border border-jet rounded-lg py-2 px-8"
                            name='first_name'
                            value={first_name}
                            onChange={onChange}
                        />
                    </div>

                    <div className="w-full flex flex-row justify-between items-center">
                        <label className="font-medium" htmlFor="email">Email : </label>
                        <input
                            type="email"
                            className="border border-jet rounded-lg py-2 px-8"
                            name='email'
                            value={email}
                            onChange={onChange}
                        />
                    </div>

                    <div className="w-full flex flex-row justify-between items-center">
                        <label className="font-medium" htmlFor="password">Mot de passe : </label>
                        <input
                            type="password"
                            className="border border-jet rounded-lg py-2 px-8"
                            name='password'
                            autoComplete={'on'}
                            value={password}
                            onChange={onChange}
                        />
                    </div>

                    <h2 className="font-bold text-azure text-2xl py-6">Informations sur l'établissement :</h2>
                    <div className="flex flex-col gap-6">
                        <div className="w-full flex flex-row justify-between items-center mr-4">
                            <label className="font-medium" htmlFor="est_name">Nom de l'établissement : </label>
                            <input
                                type="text"
                                className="border border-jet rounded-lg py-2 px-6"
                                name='est_name'
                                value={est_name}
                                onChange={onChange}
                            />
                        </div>
                        <div className="w-w-full flex flex-row justify-between items-center">
                            <label className="font-medium" htmlFor="est_type">Type d'établissement : </label>
                            <select className="border border-jet rounded-lg py-2 px-8" name="est_type">
                                <option value={est_type}>Entreprise</option>
                                <option value={est_type}>Association</option>
                                <option value={est_type}>Autres</option>
                            </select>
                        </div>
                    </div>

                    <div className="w-full flex items-center justify-between">
                        <label className="font-normal">Cochez si vous êtes un administrateur</label>
                        <input
                            type="checkbox"
                            className="w-[35px] h-[35px] bg-azure rounded-2xl"
                            name='isAdmin'
                            value={user_type}
                            onClick={onClick}
                            onChange={onChange}
                        />
                    </div>
                </div>

                    <button type="submit" className="btn-primary flex justify-center mt-8 mx-auto">
                        Soumettre
                    </button>

                </form>
            </section>
        </main>
    );
};

export default Register;