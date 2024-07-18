import React, { useEffect, useState } from "react";
import "../index.css"; 
import TrashIcon from "./icons/TrashIcon";
import { Link, json, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthButton from "../components/AuthButton";
import { backendAPI } from "../clientDotEnv";
import { useSharedContext } from "../context/SharedContext";
import habitService from "../services/habitService";
// import habitService from "../../services/habitService";

// backendAPI = a.backendAPI;
// const habitDB = [
//     [100, "Jog everyday", "Daily junk food"],
//     [101, "50 pushups daily", "idling away time"],
//     [102, "3 miles running", "improve cardio endurance"]
//     ];

let auth;
let host = backendAPI;

const ExpandMenuBtn = (props) => {
    return (
        <div id="hamburger-expand-btn" onClick={() => openNav()} className="position-absolute start-0">
            <svg width="60px" height="60px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="#000" d="M32 96v64h448V96H32zm0 128v64h448v-64H32zm0 128v64h448v-64H32z" /></svg>
        </div>
    );
};

function openNav() { document.getElementById("mySidenav").style.width = "300px"; document.getElementById("main").style.marginLeft = "300px"; }
function closeNav() { document.getElementById("main").style.marginLeft = "0"; document.getElementById("mySidenav").style.width = "0"; if(document.querySelector("#new-in-val") != undefined){     document.querySelector("#new-in-val").remove(); } }

const NavBarInside = (props) => {
    // const [navOpened, setNavOpened] = useState(false);
    const navigate = useNavigate();
    const [navError, setNavError] = useState(false);
    // const [navLinks, setNavLinks] = useState([]);
    const {navLinks, setNavLinks} = useSharedContext();
    // const {currHabit, setCurrHabit} = useSharedContext();
    const [currHabit, setCurrHabit] = useState({});
    

     window.onkeydown = (e) => {
        if(e.key === "Enter" && document.querySelector('#new-in-val') !== null){
            console.log('creating /create/' + document.querySelector("#new-in-val").value);
            navigate('/create/' + document.querySelector("#new-in-val").value);
            document.querySelector('#new-in-val').remove();
        }   
      }
      const makeHabit = parseInt(document.location.href.split("/habits/")[1] || 100) // !== undefined ? document.location.href.split("/habits/")[1] : '100');


    //move to shared context
    //   useEffect(() => {
    //     let habits = [];
    //     fetch(host+'/api/habits', {credentials: "include"})
    //         .then(a => {

    //             if(!a.ok){
    //                 setNavError(true); 
    //                 return
    //             }
    //             return a.json();
    //         })
    //         .then(jsonObj => {
    //             /**
    //              * response looks like this:
    //              * {
    //              * message: "docs fetched",
    //              * _id: "",
    //              * habits: {habits: [{..}, {..}], userId: "" }
    //              * }
    //              */
    //             habits = [...jsonObj.habits.habits];
    //             setNavLinks(habits);
    //             console.log(navLinks, "userDB2");
    //         })
    //         .catch(e => {
    //             throw new Error(e);
    //         });
    //         console.log(habits,"habits..")
    // }, []); //commented

    //   useEffect(() => {
    //     setCurrHabit(navLinks.find(x => x.makeHabit === makeHabit) ? navLinks.find(x => x.makeHabit === makeHabit) : []);
    //     console.log("uf", navLinks)
    // }, [navLinks]);
    
console.log(navLinks, "navLinks after useEffect()")
  useEffect(() => {
    setCurrHabit(navLinks.find(x => x.makeHabit === makeHabit) ? navLinks.find(x => x.makeHabit === makeHabit) : ['null']);
    console.log("sc", currHabit, navLinks)
  }, [navLinks]);

//   useEffect(() => {
//     // setCurrHabit()
//     setCurrHabit(currHabit)
//   },[navLinks]);
//   console.log("useParams", useParams())

    // console.log("navlink1",(navLinks),"currHabit", currHabit);

    const [newHabitInput, setNewHabitInput] = useState(false);

    const ProfileLink = (props) => {
        return (
            // {{console.log(document.location.pathname)}
        <div className={'navList ' + props.active} onClick={() => setCurrHabit(0)}>
            <Link to='/profile' >Profile</Link>
        </div>
        );
    }

    useEffect(() => {
        openNav();
    }, []);


    useEffect(() => {
        console.log("cf", currHabit);
    }, [currHabit])
    // const userDB = {};

    // const habitDB = [];
    // userDB.habits.forEach(x => {
    //         habitDB.push([x.makeHabit,
    //                     x.makeHabit,
    //                     x.breakHabit]);
    //     });
 
    function addNewTask(){
        if(document.querySelector('#new-in-val') !== null)
            document.querySelector('#new-in-val').focus();
        else if(!newHabitInput){
            let ina = document.createElement("input");
            ina.id = "new-in-val";
            ina.placeholder = "new name here";
            document.querySelector("#navHabitList").insertBefore(ina, document.querySelector("#navHabitList").children[document.querySelector("#navHabitList").childElementCount - 1]);
            ina.focus();
            setNewHabitInput(true);
        }
        setNewHabitInput(false)
    }
    const deleteHabit = (makeHabit) => {
        console.log("deleteHabit", " here")
        const newNavLinks = [...navLinks];
        newNavLinks.splice(newNavLinks.findIndex(x => x.makeHabit === makeHabit), 1);
        
        const makeDeleteRequest = async () => {
            const resp = await habitService.deleteHabit(makeHabit); // update the array without the current one
            
            if(!resp.ok) return;
            if(resp.ok){
            console.log("resp.ok", newNavLinks)
            setNavLinks(newNavLinks);
            }
        }
        makeDeleteRequest();
    }
    const FeedLink = props => {
        return (
            <div className={"navList " + ((document.location.pathname === '/' ? "active currHabit" : '')) }>
                <Link key="feed" to="/">Feed</Link>
            </div> 
        );
    }
    return (
        !navError ? 
        <>
        <div id="mySidenav" className="sidenav">
            <button className="addBtn" onClick={() => addNewTask()}>+</button>
            <button className="closebtn" onClick={() => closeNav()}>&times;</button>
            <div id="navHabitList">
            <FeedLink />
                {
                    navLinks.map(h => (h[0] !== 'null' && (
                        //if not current habit then class=inactive else class="active currHabit"
                        // console.log(h[0]) ||
                        // (<script>{console.log(currHabit.makeHabit ,"hbi")}</script>)+
                        <div id={h.makeHabit} className={"navList " + ((decodeURIComponent(document.location.pathname).includes(h.makeHabit) ? "active currHabit" : '')) }>
                            <Link key={h.makeHabit} to={"/habits/"+h.makeHabit} onClick={() => setCurrHabit(h)}>
                                {h.makeHabit}
                            </Link> {/*if 22 is set to 0 then the a[href] for profile will be /profile */}
                            <TrashIcon onClick={() => deleteHabit(h.makeHabit)} key={h.makeHabit+"-del"} />
                        </div>
                        )
                    ))
                }
                <ProfileLink active={document.location.pathname === "/profile" ? 'active currHabit' : ''} />
                <AuthButton />
            </div>
        </div>
        <ExpandMenuBtn />
        </>
        :
        <div className="text-red">Error: Couldnt load list</div>
        );
  };
  const NavBar = (props) => {

    auth = useAuth();
    if(!auth.isAuthenticated){
        return <></>
    }

    // console.log("authenticated in navbar", auth.isAuthenticated, (new Date()).getMilliseconds());
    return  (<NavBarInside />)
}
// openNav();
  export {NavBar, ExpandMenuBtn};