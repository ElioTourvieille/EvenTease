import CardOne from "../components/CardOne";
import CardTwo from "../components/CardTwo";
import CardThree from "../components/CardThree";
import CardFour from "../components/CardFour";
import Breadcrumb from "../components/Breadcrumb";
import {useSelector} from "react-redux";

const Dashboard = () => {
    const {user} = useSelector(state => state.auth)
    const company = user.est_name

    return (
        <>
            <Breadcrumb pageName="Accueil"/>

            <main className="flex flex-col justify-start">
                <div className="mt-20 ml-40">
                    <h1 className="text-3xl font-bold text-gray-800">{company}</h1>
                    <p className="text-gray-500">Bienvenue sur votre tableau de bord</p>
                </div>

                <div className="p-20 flex justify-center flex-wrap gap-x-12 gap-y-20">
                    <CardOne/>
                    <CardTwo/>
                    <CardThree/>
                    <CardFour/>
                </div>
            </main>
        </>
    );
};

export default Dashboard;