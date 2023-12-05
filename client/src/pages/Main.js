import AnimatedText from "../components/AnimatedText";
import EventItem from "../components/EventItem";

import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {getAllEvents, reset} from "../features/events/eventsSlice";
import FilterBar from "../components/FilterBar";

const Main = () => {

    const dispatch = useDispatch();
    const { events, isLoading, isListing, isError, message } = useSelector((state) => state.events)
    const { user } = useSelector((state) => state.auth);

    // Create a state to store the active filter
    const [activeFilter, setActiveFilter] = useState('Tous')

    useEffect(() => {
        if(isError) {
            toast.error(message)
        } else {
            if (Array.isArray(events) && events.length === 0) {
                dispatch(getAllEvents())
            }
        }
    }, [events, isError, message, isListing, dispatch]);

    const handleFilter = (filter) => {
        setActiveFilter(filter)
    }

    //Create a new array of events filtered by the active filter
    const filteredEvents = events.filter((event) => {
        return activeFilter === 'Tous' || event.type === activeFilter;
    })

    return (
        <main className="bg-smoke px-32 py-16">
            <AnimatedText text="Les évènements à venir" />

            <FilterBar activeFilter={activeFilter} onFilterClick={handleFilter}/>

            <section className='flex justify-center mt-16'>
                {filteredEvents.length > 0 ? (
                    <div className="flex flex-col gap-y-12">
                        {filteredEvents.map((event) => (
                            <EventItem event={event} key={event._id} user={user} est_name={user.est_name} />
                        ))}
                    </div>
                ) : null}
            </section>
        </main>
    );
};

export default Main;