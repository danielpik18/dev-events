'use client'

import Image from "next/image";

const ExploreButton = () => {
    return (
        <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={() => console.log("Button!")}>
            <a href="#events">Explore Events</a>
            <Image src="/icons/arrow-down.svg" alt="Explore Events" width={24} height={24} />
        </button>
    )
}
export default ExploreButton
