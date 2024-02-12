import {useEffect, } from 'react';
import Breadcrumb from "../components/Breadcrumb";
import Spinner from "../components/Spinner";
import {useDispatch, useSelector} from "react-redux";
import {getAllEvents} from "../features/events/eventsSlice";
import MyEventItem from "../components/MyEventItem";

const MyEvents = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { events, isLoading } = useSelector((state) => state.events)

    useEffect(() => {
        dispatch(getAllEvents());
    }, [dispatch]);

    const myEvents = events.filter((event) => event.est_name === user.est_name);

    return (
        <div>

            <Breadcrumb pageName="Mes Events"/>

            <main className="flex flex-col justify-center items-center p-6">

                {isLoading && <Spinner />}

                <section className='w-3/4 flex justify-center mt-16'>
                    {myEvents && myEvents.length > 0 ? (
                        <div className="w-[85%] flex flex-col gap-y-12">
                            {myEvents.map((event) => (
                                <MyEventItem event={event} key={event._id} user={user}  />
                            ))}
                        </div>
                    ) :  <h3 className="text-2xl my-16">Aucun évènement pour le moment</h3>}
                </section>
            </main>
        </div>
    );
};

export default MyEvents;