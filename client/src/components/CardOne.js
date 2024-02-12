import { LuUsers } from "react-icons/lu";
import {useEffect, useState} from "react";
import authService from "../features/auth/authService";
const CardOne = () => {
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        authService.getUserCount()
        .then(data => setUserCount(data.count))
    }, [])

    return (
        <div className="w-2/5 flex justify-evenly rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-lg">
            <div className="flex flex-col gap-y-4 items-center">
                <span className="rounded-full bg-smoke p-4">
                    <LuUsers className="text-3xl text-azure" />
                </span>
                <h3 className="text-title-sm font-bold text-dark">Nombre d'utilisateurs</h3>
            </div>

                <div className="flex items-center">
                    <h4 className="text-3xl font-bold text-black">
                        {`${userCount*10} `}
                    </h4>
                </div>

        </div>
    );
};

export default CardOne;
