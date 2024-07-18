import { Link } from "react-router-dom";

const FeedPost = props => {
    const habit = props.habit;
    const fpIs = "flex-1 align-content-center"; //feedpost inside style

    const dueDate = new Date(habit.habit.dueDate).toDateString();
    const createDate = new Date(habit.habit.createDate).toDateString();
    return (
        <div className="feedpost flex w-100 p-[10px] h-[10em] rounded text-white mb-4" style={{background: `linear-gradient(45deg, rgb(103, 34, 66), rgb(30, 23, 17))` }}>
            <div className={`makeHabit ${fpIs} fw-bold`}>
                <Link to={`/users/${habit.username}`}>
                    @{habit.username}
                </Link>
            </div>
            <div className={`dueDate ${fpIs}`}>
            made habit: 
                <Link to={`/users/${habit.username}/habits/${habit.habit.makeHabit}`}>
                    {' ' +habit.habit.makeHabit}
                </Link>
            </div>
            <div className={`username ${fpIs}`}>
                    {<div className="startDate">{createDate}</div>} - {<div className="endDate">{dueDate}</div>}
            </div>
        </div>
    )
}
export default FeedPost;
