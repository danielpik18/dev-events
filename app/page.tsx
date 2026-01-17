import ExploreButton from "@/components/ExploreButton";
import EventCard from "@/components/EventCard";

const events = [
    {
        title: "Event 1",
        image: "/images/event1.png",
        slug: "slug-1",
        location: "location-1",
        date: "date-1",
        time: "time-1"
    },
    {
        title: "Event 2",
        image: "/images/event2.png",
        slug: "slug-2",
        location: "location-2",
        date: "date-2",
        time: "time-2"
    },
]

const Page = () => {
    return (
        <section>
            <h1 className="text-center">The Hub For Every Dev<br/>Event You Can&#39;t Miss</h1>
            <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All In One Place!</p>

            <ExploreButton/>

            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>
                <ul className="events list-none">
                    {
                        events.map(event => (
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
