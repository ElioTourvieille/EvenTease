// Components
import AnimatedText from "../components/AnimatedText";
import EventItem from "../components/EventItem";
import Spinner from "../components/Spinner";

import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {getAllEvents} from "../features/events/eventsSlice";
import FilterBar from "../components/FilterBar";

const Main = () => {

    const dispatch = useDispatch();
    const { events, isListing, isLoading, isError, message } = useSelector((state) => state.events)
    const { user } = useSelector((state) => state.auth);

    // Create a state to store the filtered events
    const [filteredEvents, setFilteredEvents] = useState([])

    // Create a state to store the active filter
    const [activeFilter, setActiveFilter] = useState('Tous')

    useEffect(() => {
        if(isError) {
            toast.error(message)
        } else {
            if(!isListing) {
                dispatch(getAllEvents())
            } else {
            if (!events || events.length === 0) {
                toast.info("Aucun évènement à venir")
            } else {
                setFilteredEvents(events.filter((event) => {
                    return activeFilter === 'Tous' || event.type === activeFilter;
                }))
            }
        }
    }}, [events, isError, message, isListing, dispatch, activeFilter]);

    const handleFilter = (filter) => {
        setActiveFilter(filter)
    }

    return (
        <main className="flex flex-col items-center bg-smoke px-32 py-16">
            <AnimatedText text="Les évènements à venir" />

            <FilterBar activeFilter={activeFilter} onFilterClick={handleFilter}/>

            {isLoading && <Spinner />}

            <section className='w-full flex justify-center mt-16'>
                {filteredEvents.length > 0 ? (
                    <div className="w-[85%] flex flex-col gap-y-12">
                        {filteredEvents.map((event) => (
                            <EventItem event={event} key={event._id} user={user} est_name={user.est_name} />
                        ))}
                    </div>
                ) :  <h3 className="text-2xl my-16">Aucun évènement pour le moment</h3>}
            </section>
        </main>
    );
};

export default Main;