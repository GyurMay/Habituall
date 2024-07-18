import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { backendAPI } from "../clientDotEnv";
import habitService from "../services/habitService";


export default function HabitFormPage(props){

  const params = useParams();
  const auth = useAuth();  

  const [mh, setMh] = useState(params.makeHabit);
  const [bh, setBh] = useState("");
    // useState
  const [fdd, setFdd] = useState("");
  const [habitError, setHabitError] = useState(false);

  useEffect(() => {
    setMh(params.makeHabit); setBh(""); setFdd("");
  }, [params])
  
  const handleChange = (event) => {
    setBh(document.querySelector("#fbh").value);
    setMh(document.querySelector("#fmh").value);
    setFdd(document.querySelector("#fdd").value);
  }
  let host = backendAPI;

  // host = 'http://192.168.1.147:3001' // comment if workign on same pc
  // host = "http://"+require("os").networkInterfaces()['en0'][1].address+":3001"; // comment line if not working on separate window
  const navigate = useNavigate();
  const createHabit = async (jsonObj) => {
    //makeRequest
    try{

      const response = await habitService.createNewHabit(jsonObj);
      // console.log("resp", response);

      if(!response.ok){
        setHabitError(true);
        throw new Error("Can't create Habit");
      }
      // setNavLink()
      navigate('/habits/'+jsonObj.makeHabit);
    }catch(e){
      console.log(e)
    }
  }
function handleSubmit(event){
    event.preventDefault();
    if(mh === '' || bh === '' || fdd === '') return

    // let daysRemaining = parseInt((((new Date(fdd)) - new Date())) / 1000 / 60/ 60 / 24) + 1;
    // const date = new Date(fdd);
    // console.log(date, "dates  ")
    // let lastId = document.querySelector('#navHabitList').lastElementChild.previousElementSibling.previousElementSibling.id.slice(1);
    // let habitId = parseInt(lastId) + 1;
    // console.log(habitId, mh, bh, daysRemaining)
    const habitObj = {
          makeHabit: mh,
          breakHabit: bh,
          dueDate: fdd.replaceAll('-', ' '),
          createDate: (new Date()).toDateString()
    }
    console.log(habitObj);

    createHabit(habitObj);
    // let currLatestId = 103;

    //make request to DB/backend and refresh
    // makeDbRequest(mh, bh, fdd, parseInt(currLatestId));
    //document.location.href = `http://${document.location.host}`;
}

    return (
        <>
        <div id="main">
            <div id="container" className="text-center">
                <div id="createForm" className="text-4xl">
                    <h1><strong>Create a New Habit</strong></h1><br />
                    {habitError && (<p className="text-danger">error: cant create habit</p>)}
                    <h3>Make Habit: <input id="fmh" name="makeHabit" className="border-2 border-b-gray-700" value={mh} onChange={handleChange}></input></h3>
                    <h3>Break Habit: <input id="fbh" name="breakHabit" className="border-2 border-b-gray-700" onChange={handleChange}></input></h3>
                    <h3>Get done by: <input id="fdd" name="dueDate" type="date" onChange={handleChange}></input></h3>
                    {/* { (document.querySelector("#fmh").value.length > 0) && (document.querySelector("#fbh").value.length > 0) && (document.querySelector("#fdd").value.length > 0) && ( */}
                    <button className="btn btn-success" onClick={handleSubmit}> SAVE </button>
                    {/* )} */}

                </div>
            </div>  
        </div>
        </>
    )
};