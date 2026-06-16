import Breadcrumb from '../components/Breadcrumb';
import {useState} from "react";

const MONTH_NAMES = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const DAY_NAMES = [
    { long: "Lundi",    short: "Lun" },
    { long: "Mardi",    short: "Mar" },
    { long: "Mercredi", short: "Mer" },
    { long: "Jeudi",    short: "Jeu" },
    { long: "Vendredi", short: "Ven" },
    { long: "Samedi",   short: "Sam" },
    { long: "Dimanche", short: "Dim" },
];

const buildCalendarRows = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    // JS: 0=Sun, 1=Mon... — convertir en offset lundi-first
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [
        ...Array(offset).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);

    const rows = [];
    for (let i = 0; i < cells.length; i += 7) {
        rows.push(cells.slice(i, i + 7));
    }
    return rows;
};

const Calendar = () => {
    const [currentDate] = useState(new Date());

    const year  = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    const isToday = (day) =>
        day !== null &&
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

    const rows = buildCalendarRows(year, month);

    return (
        <>
            <Breadcrumb pageName="Calendrier"/>

            <main className="h-full flex flex-col justify-start items-center p-20">
                <h1 className="self-start mb-2 text-2xl font-bold text-gray-800">
                    {MONTH_NAMES[month]} {year}
                </h1>

                <div className="w-full max-w-full rounded-sm border border-stroke shadow-default">
                    <table className="w-full">
                        <thead>
                        <tr className="grid grid-cols-7 rounded-t-sm bg-azure text-white">
                            {DAY_NAMES.map((day, i) => (
                                <th
                                    key={day.long}
                                    className={`flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5
                                        ${i === 0 ? 'rounded-tl-sm' : ''}
                                        ${i === 6 ? 'rounded-tr-sm' : ''}`}
                                >
                                    <span className="hidden lg:block">{day.long}</span>
                                    <span className="block lg:hidden">{day.short}</span>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="grid grid-cols-7">
                                {row.map((day, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray md:h-25 md:p-6 xl:h-31
                                            ${isToday(day) ? 'bg-blue-50' : ''}`}
                                    >
                                        {day && (
                                            <span className={`font-medium ${isToday(day) ? 'text-azure font-bold' : 'text-black'}`}>
                                                {day}
                                            </span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    );
};

export default Calendar;
