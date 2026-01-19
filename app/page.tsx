import ExploreButton from "@/components/ExploreButton";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
//import {events} from "@/lib/constants";

const Page = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`, {cache: 'no-store'});
    const data = await response.json();
    const events = data.data;

    return (
        <section>
            <h1 className="text-center">The Hub For Every Dev<br/>Event You Can&#39;t Miss</h1>
            <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All In One Place!</p>

            <ExploreButton/>

            <div className="mt-20 space-y-7" id="events">
                <h3>Featured Events</h3>
                <ul className="events list-none">
                    {
                        events && events.length > 0 && events.map((event: IEvent) => (
                            <li key={event.title}>
                                <EventCard  {...event} />
                            </li>
                        ))
                    }
                </ul>
            </div>
        </section>
    )
}
export default Page
