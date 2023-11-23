import AnimatedText from "../components/AnimatedText";
import EventItem from "../components/EventItem";
import * as events from "events";

const Main = () => {
    return (
        <main className="bg-smoke px-32 py-16">
            <AnimatedText text="Les évènements à venir" />

            <div className="flex justify-start gap-16 my-12">
                <span className="text-lg font-medium cursor-pointer">Tous</span>
                <span className="text-lg font-medium cursor-pointer">Conférence</span>
                <span className="text-lg font-medium cursor-pointer">Team Building</span>
                <span className="text-lg font-medium cursor-pointer">Apéritif</span>
                <span className="text-lg font-medium cursor-pointer">Autres</span>
            </div>

            <section className='flex justify-center mt-16'>
                <EventItem />
                {events.length > 0 ? (
                    <div className='goals'>
                        {events.map((event) => (
                            <EventItem event={event} key={event._id} />
                        ))}
                    </div>
                ) : (
                    <h3 className="text-2xl"></h3>
                )}
            </section>
        </main>
    );
};

export default Main;