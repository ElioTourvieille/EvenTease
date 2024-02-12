import Breadcrumb from '../components/Breadcrumb';
import {useEffect, useState} from "react";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    return (
        <>
            <Breadcrumb pageName="Calendrier"/>


            <main className="h-full flex flex-col justify-start items-center p-20">
                <h1 className="self-start mb-2 text-2xl font-bold text-gray-800">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h1>

                {/* <!-- ====== Calendar Section Start ====== --> */}
                <div className="w-full max-w-full rounded-sm border border-stroke shadow-default">
                    <table className="w-full">
                        <thead>
                        <tr className="grid grid-cols-7 rounded-t-sm bg-azure text-white">
                            <th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
                                <span className="hidden lg:block"> Lundi </span>
                                <span className="block lg:hidden"> Lun </span>
                            </th>
                            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                                <span className="hidden lg:block"> Mardi </span>
                                <span className="block lg:hidden"> Mar </span>
                            </th>
                            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                                <span className="hidden lg:block"> Mercredi </span>
                                <span className="block lg:hidden"> Mer </span>
                            </th>
                            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                                <span className="hidden lg:block"> Jeudi </span>
                                <span className="block lg:hidden"> Jeu </span>
                            </th>
                            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                                <span className="hidden lg:block"> Vendredi </span>
                                <span className="block lg:hidden"> Ven </span>
                            </th>
                            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                                <span className="hidden lg:block"> Samedi </span>
                                <span className="block lg:hidden"> Sam </span>
                            </th>
                            <th className="flex h-15 items-center justify-center rounded-tr-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
                                <span className="hidden lg:block"> Dimanche </span>
                                <span className="block lg:hidden"> Dim </span>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* <!-- Line 1 --> */}
                        <tr className="grid grid-cols-7">
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  1
                </span>

                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  2
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  3
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  4
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  5
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  6
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  7
                </span>
                            </td>
                        </tr>
                        {/* <!-- Line 1 --> */}
                        {/* <!-- Line 2 --> */}
                        <tr className="grid grid-cols-7">
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  8
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  9
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  10
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  11
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  12
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  13
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  14
                </span>
                            </td>
                        </tr>
                        {/* <!-- Line 2 --> */}
                        {/* <!-- Line 3 --> */}
                        <tr className="grid grid-cols-7">
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  15
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  16
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  17
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  18
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  19
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  20
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  21
                </span>
                            </td>
                        </tr>
                        {/* <!-- Line 3 --> */}
                        {/* <!-- Line 4 --> */}
                        <tr className="grid grid-cols-7">
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  22
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  23
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  24
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  25
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  26
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  27
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  28
                </span>
                            </td>
                        </tr>
                        {/* <!-- Line 4 --> */}
                        {/* <!-- Line 5 --> */}
                        <tr className="grid grid-cols-7">
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  29
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  30
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  31
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  1
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  2
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  3
                </span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black">
                  4
                </span>
                            </td>
                        </tr>
                        {/* <!-- Line 5 --> */}
                        </tbody>
                    </table>
                </div>
                {/* <!-- ====== Calendar Section End ====== --> */}
            </main>
        </>
    );
};

export default Calendar;