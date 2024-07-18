import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import habitService from "../services/habitService";
import styledComponents from "./styleComponents";
import { useAuth } from "../context/AuthContext";

const UserProfile = props => {
    const [user, setUser] = useState(null);
    const [userHabits, setUserHabits] = useState(null);
    const [error, setError] = useState('')
    const [followStatus, setFollowStatus] = useState(null);
    // const [habits, setHabits] = useState(null);
    const params = useParams();
    const auth = useAuth();
    const meUser = auth.user;
    // console.log("name,", myName)
    const username = params.username;
    const userphoto = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';

    // setError("nope")
    // console.log(error, "diverror");

    useEffect(() => {
        const fetchUser = async () => {
            const resp = await habitService.getProfileInfo(username);
            if(!resp.ok){
                setError("nothing found");
                setUser(null)
                return;
            }
            const profileInfo = await resp.json();
            setUser(profileInfo.userInfo);
            console.log("tag,", profileInfo.userInfo.followers, meUser.username)
            setFollowStatus(profileInfo.userInfo.followers.includes(meUser.username))
            // setInterval(() => console.log(user, "user::"));
            setUserHabits(profileInfo.habits[0].habits);
            console.log("userhabits", profileInfo.habits[0].habits)
        };
        fetchUser();
    }, [params.username]);

    // useEffect(() => {
    //   const getFollowStatus = async() => {

    //   }
    // }, [followStatus])

    const toggleFollow = () => {
      const toggleFollowReq = async() => {
        const resp = await habitService.toggleFollow(user.username, followStatus);
        console.log("toggleFollow resp", await resp.json());
        if(resp){
          setFollowStatus(!followStatus);
        }
      } 
      toggleFollowReq();
    }
    
    const UserHabitCard = props => {
      return (
    <div className="card border-light mb-3" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card-header" style={styledComponents.cardHeaderStyle}>
        <h4 className="mb-0">Habits</h4>
      </div>
      <ul className="list-group list-group-flush">
        {userHabits?.map((h, index) => (
          <li key={index} className="list-group-item" style={styledComponents.listGroupItemStyle}>
            <Link to={`/users/${user.username}/habits/${h.makeHabit}`} className="text-decoration-none" style={styledComponents.linkStyle}>
              {h.makeHabit}
            </Link>
          </li>
        ))}
      </ul>
    </div>
      );
    };

    const FollowButton = props => {
      const btn =  (
        <>
          <div id="followBtn">
              <button type="submit" className="border border-black bg-primary p-2 text-white rounded" onClick={() => toggleFollow()}>
                {followStatus === true ? 'Unfollow' : 'Follow'}
              </button>
            </div>
        </>
      );

      return btn;
    }

    return (
        user != null ?  
        <>
    <div className="searchProfile container my-5">
      {/* User Profile Card */}
      <div className="card border-light mb-3" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card-header" style={styledComponents.cardHeaderStyle}>
          <h4 className="mb-0">User Profile</h4>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-auto">
              <img src={userphoto} alt="User Photo" className="img-fluid rounded-circle border border-dark" style={{ width: '100px', height: '100px' }} />
            </div>
            <div className="col">
              <h5 className="card-title" style={styledComponents.cardBodyTitleStyle}>{user.name}</h5>
              <p className="card-text" style={styledComponents.cardTextStyle}>Username: {user.username}</p>
              <p className="card-text" style={styledComponents.cardTextStyle}>Motto: {user.motto}</p>
            </div>
          </div>
        </div>
      </div>

     <UserHabitCard />
     <FollowButton />
    </div>
    </>
    :
    <>
        <div className="error text-danger">{error}</div>
    </>
    );
}


export default UserProfile;