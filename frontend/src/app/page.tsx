"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const EventMap = dynamic(() => import("../components/EventMap"), {
  ssr: false,
});

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://your-render-url/api/events")
    .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>EventPulse</h1>
      <EventMap events={events} />
    </div>
  );
}