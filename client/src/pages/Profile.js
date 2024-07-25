import React, { useEffect, useState } from "react";
import "../index.css"; 
import { useAuth } from "../context/AuthContext";
import { useSharedContext } from "../context/SharedContext";
import { backendAPI } from "../clientDotEnv";
import { Link } from "react-router-dom";
import UploadImage from "../components/UploadImage";

const milliSecsToDays = 1000*60*60*24;
// console.log(JSON.stringify(userHabitsStats))
export default function Profile (props) {
    const {navLinks, setNavLinks} = useSharedContext();
    const [habitInfo, setHabitInfo] = useState(null);
    useEffect(() => {
        fetch(backendAPI+"/api/user/selfProfile", {credentials: "include"}).then(a => a.json()).then(d => {
            console.log("jkl", d);
            setHabitInfo(d);
        });
    }, [navLinks]);
    const [currUser, setCurrUser] = useState(null)
    // const [reloadUser, setReloadUser] = useState(false);
    const [imgUpload, setImgUpload] = useState(false);
    // const currUser = {
    //     imgSrc: 'https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Y3V0ZSUyMGNhdHxlbnwwfHwwfHw%3D&w=1000&q=80',
    //     ...auth.user
    // }
    useEffect(() => {
        (async() => {
            const user = await fetch(backendAPI+"/api/login", {credentials:"include"});
            setCurrUser({
                ...(await user.json())
            })
        })();
    }, []);

    // useEffect(() => {
    //     setTimeout(() => document.querySelector('.profilePicImg').style.background = `url(${backendAPI+"/profileImg?t="+Date.now()})`, 4000); 
    // }, [imgUpload])

    // const reloadProfileImg = () => proi
    const date = (a=new Date()) => new Date(a);
    console.log(currUser)
    return ( habitInfo && 
        <>
        {/* <NavBar /> */}
        <div id="main">
            <div className="container text-start">
            <>
                <div id="about-box">
                    <div id="profilePic">
                        <img async className="profilePicImg" style={{background: `url(${backendAPI+"/profileImg?t="})`}} /*src={backendAPI+"/profileImg"}*/ width="200" height="200" />
                        <button className="editPic" onClick={() => { setImgUpload(!imgUpload); }} id="profileEdit">{!imgUpload ? 'Change pic ✏️' : 'Cancel change'}</button>
                    </div>
                    {imgUpload && <UploadImage />}
                    {/* <img src={currUser.imgSrc} width="200" height="200"/> */}
                    <h1><strong>Name: </strong>{currUser.name}</h1>
                    <h1><strong>Motto:</strong> {currUser.motto}</h1>
                    <h1><strong>Followers:</strong> {currUser.followers?.map(x => x!=='' && <Link to={"/users/"+x}>@{x}, </Link>)}</h1>
                    <h1><strong>Follows:</strong> {currUser.following?.map(x => x!=='' && <Link to={"/users/"+x}>@{x} </Link>)}</h1>
                </div>
                <br />
                <h3><b>Current stats</b></h3>
                <div id="allHabits">
                    <ul id="allList">
                        { habitInfo && navLinks.map(x => {
                            // if(habitInfo.find(y=>y.makeHabit == x.makeHabit)){
                            const habit = habitInfo.find(y=>y.makeHabit == x.makeHabit);
                            let remDays, progress;
                            console.log(habitInfo, "habit", x.makeHabit);

                            let totalDayDiff = (date(habit.dueDate) - date(habit.createDate)) / milliSecsToDays;
                            let currDayCovered = (date() - date(habit.createDate)) / milliSecsToDays;
                            currDayCovered = Math.floor(currDayCovered);
                            let daysDone = habit.daysDone;//habit.notes.filter(y => y.done === true) ? habit.notes.filter(y => y.done === true).length : 0;

                            console.log("log,", totalDayDiff, currDayCovered, daysDone, habit.makeHabit)
                            remDays = totalDayDiff - currDayCovered;
                            progress = Math.floor((daysDone / totalDayDiff) *100);    
                            if(!progress) progress = 0;
                            return (
                            <li key={x.habitId} className={remDays < 0 ? "text-decoration-line-through": ""}>
                                <div id="mkHb"> {x.makeHabit}</div>
                                <span id="progress">Progress: <b>{ progress }% {progress > 30 ? progress > 80? '👏':'🏃':'⚠️'} </b>
                                <div className="progressBar" style={{
                                    background: `linear-gradient(to right, ${progress > 30 ? progress > 80? 'green':'yellow':'red'} 50%, transparent 50%)`
                                }}></div>
                                </span>
                                <span id="daysLeft">Days Remaining: <b>{remDays <0 ? `finished` : `${remDays} days`}</b></span>
                            </li>
                            );
                    // }
                })
                    }
                    </ul>
                </div>
            </>
            </div>
        </div>
        </>
    );
  }
  