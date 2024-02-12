import { LiaPercentageSolid } from "react-icons/lia";
import {useState} from "react";

const CardThree = () => {
    const [participationRate] = useState(40);

    return (
        <div className="w-2/5 flex justify-evenly rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-lg">
            <div className="flex flex-col gap-y-4 items-center">
                <span className="rounded-full bg-smoke p-4">
                    <LiaPercentageSolid className="text-3xl text-azure" />
                </span>
                <h3 className="text-title-sm font-bold text-dark">Taux de participation</h3>
            </div>

            <div className="flex items-center">
                <h4 className="text-3xl font-bold text-black">
                    {participationRate}%
                </h4>
            </div>

        </div>
    );
};
export default CardThree;
