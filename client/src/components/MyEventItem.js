import PopupAlert from "./PopupAlert";
import PopupDialogEvent from "./PopupDialogEvent";

const MyEventItem = ({ event, user }) => {

    return (
        <div className="flex justify-between items-center rounded-lg border border-stroke border-phlox bg-white py-6 px-12 shadow-lg">
            <div>
                <h2 className="text-xl font-bold">{event.title}</h2>
                <p>{event.address}</p>
                <p>{event.date}</p>
            </div>
            <div className="flex ">
                <PopupDialogEvent event={event} kex={event._id}/>
                <PopupAlert event={event} key={event._id} user={user} />
            </div>
        </div>
    );
};

export default MyEventItem;