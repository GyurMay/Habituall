import { useEffect, useState } from "react";
import FeedPost from "../components/FeedPost";
import habitService from "../services/habitService";

export default function Feed(props){
    const [feed, setFeed] = useState(null);

    useEffect(() => {
        const getFeed = async () => {
            const resp = await habitService.getFeed();
            const data = await resp.json();
            setFeed(data?.allHabits[0]?.combinedHabits.sort(x => new Date(x.habit.createDate).getTime()));
        }
        getFeed();
    }, []);

    return (
        <>
            {
            feed?.map(habit => <FeedPost habit={habit} />)
            }
        </>
    )
};