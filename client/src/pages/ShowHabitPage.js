import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { useSharedContext } from "../context/SharedContext";
import habitService from "../services/habitService";
import TrashIcon from "../components/icons/TrashIcon";
import CommentElem from "../components/CommentElem";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { CalendarComp } from "../components/CalendarComp";


const DEFAULT_HABIT_ID = 100;
let currDate = new Date();
currDate = currDate.toDateString();
const randomString = length => Array.from({length}, () => Math.random().toString(36).charAt(2)).join('');

const Tick = (props) => {
  return (
  <div className="habitDone mb-1 w-[40px]">
    <div className={"flex h-[40px] items-center justify-center rounded-full bg-lime-500" + " " + (props.done ? "note_status" : "")}>
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" className="">
        <path d="M 20.292969 5.2929688 L 9 16.585938 L 4.7070312 12.292969 L 3.2929688 13.707031 L 9 19.414062 L 21.707031 6.7070312 L 20.292969 5.2929688 z"></path>
      </svg>
    </div>
    </div>
    );
  };

const calendarStyleAppend = (note) => {
    
    const convertToCalendarDate = (dateStr) => {
      const date = new Date(dateStr);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }

    const calendarStyle = `[aria-label="${convertToCalendarDate(note.date)}"] { 
      color: ${note.done ? 'green' : 'red'};
      border: 3px solid ${note.done ? 'green' : 'red'};
    }`;
    return calendarStyle;
};

const HabitNote = props => {
  const {note, owner, experimental, submitNote} = props;
  const [customDate, setCustomDate] = props.customDate || [null, null];
  let noteDate = note.date;
  return (
    new Date().toDateString() !== noteDate ?
    <>
      <div className="habitNote_text text-md flex h-[45px] w-full resize-none items-end justify-start border-b-2 border-b-gray-200 focus:outline-none">
        {note.note}
      </div>  
    </>
    :
    <>
      <textarea id="textarea" placeholder="any note for today?" className="habitNote text-md flex h-[45px] w-full resize-none items-end justify-start border-dashed border-b-2 border-b-black focus:outline-none" defaultValue={note.note} ></textarea>
      {experimental && <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} />}
      <button onClick={submitNote} className="btn btn-primary mt-2 flex">SAVE</button>
    </>
  )
};


 function ShowHabitPage(props){
  const navigate = useNavigate();
  const params = useParams();
  const [currNote, setCurrNote] = useState('')
  const {navLinks, setNavLinks} = useSharedContext();
  let newNote = {
    "date": (new Date()).toDateString(),
    "note":"",
    "done": undefined
  };
  const [noteObj, setNoteObj] = useState(newNote);
  const [calendarStyle, setCalendarStyle] = useState(``);
  
  const [notes, setNotes] = useState([]);
  const [reloadNotes, setReloadNotes] = useState(false);
  const [todayNoteExist, setTodayNoteExist] = useState(false);

  const [currHabit, setCurrHabit] = useState({makeHabit:'1'});
  
  
  const [customDate, setCustomDate] = useState("");

  const [calendarVal, calendarChange] = useState(new Date());


  useEffect(() => {
    const date = calendarVal.toDateString();
    let dateIsLogged = false;
    notes.forEach(x => {
      if(x.date === date) dateIsLogged = true;
    });
    if(!dateIsLogged) return;
    document.location.href = ('#'+date);
    return () => {};
  }, [calendarVal]);


  useEffect(() => {
    console.log(navLinks, "navlink 1")
    let currhb = navLinks.find(x => x.makeHabit == params.id)?navLinks.find(x => x.makeHabit == params.id): [] ;
    setCurrHabit(currhb);
    console.log("params.id changed", params.id, currHabit)
  }, [navLinks, params.id]);
  
  useEffect(() => {  //loadNote upon navbar habit being clicked
    const fetchNotes = async() => {
      const notes = await habitService.loadNotes(currHabit.makeHabit);
      // console.log(notes, "notes fethced 2")
      const notes2 = await notes.json();
      console.log("notes fetched 2", notes2)
      if(notes2[0]){
        setNotes(notes2[0].notes);
        setTodaysNote(notes2[0].notes); //not a state
      }
    };
    fetchNotes();

    console.log(currHabit, "currHabit makeHabit changed", notes);
    const setTodaysNote = (notes) => {
      let todaysNoteUndefined = notes?.find(x => (new Date(x.date)).toDateString() === currDate) === undefined;
      if(todaysNoteUndefined){
        setNoteObj(newNote);
        setNotes(notes => [...notes, newNote])
        return;
      }
      console.log("notes exists, setting todays note", notes, todaysNoteUndefined)

      setTodayNoteExist(true);
      //else set the found note as todays note
      setNoteObj( //find if todays note if exist, else create new empty note el
        notes.find(x => (new Date(x.date)).toDateString() === currDate)
      );
    };

    return () => {
      setReloadNotes(false)
    }
  }, [currHabit.makeHabit, reloadNotes]);

  
let c = 0;

// useEffect(() => {
//   console.log(noteObj, "new habit uf", c++)
// }, [noteObj.note, noteObj.tick]);

const [saveStatus, setSaveStatus] = useState(false);
const logDay = (state, habitDate) => {
  if(habitDate !== currDate) return
  let markedDone = state === "tick"; 
  saveNote();
 
  // if(props.id == "today") habit = noteObj; 

  const saveStatus = () => {
    if(noteObj.done === undefined || noteObj.done && !markedDone || !noteObj.done && markedDone){
      setNoteObj(noteObj => ({ ...noteObj, "done": markedDone}));
    }else if(noteObj.done !== undefined && (noteObj.done && markedDone) || (!noteObj.done && state !== "tick")){
      setNoteObj(noteObj => ({...noteObj, "done" : undefined}))
    }
  }
  saveStatus();
};

const updateNoteDB = async () => {

  //this is the client side logic
  // const currNoteInx = currHabit.notes.findIndex(x => x.date === noteObj.date);
  // const newHabit = currHabit;
  // if(currNoteInx == -1){
  //   newHabit.notes.push(noteObj);
  // }else{
  //   newHabit.notes[currNoteInx] = noteObj;
  // }
  // console.log("new Habit will be", currHabit.notes[currNoteInx], newHabit);
  // console.log("new habit navlink", navLinks )  
  // habitService.updateHabit(currHabit.habitId, newHabit); //calling server logic
  console.log("noteObj updating", noteObj);
  if(customDate !== "") noteObj.date = new Date(customDate).toDateString();
  const resp = await habitService.createNote(noteObj, currHabit.makeHabit)
  if(resp.ok){
    setReloadNotes(true)
    return;
  }
  console.error(resp, "note not created")
}


const saveNote = () => {
  setNoteObj(noteObj => ({...noteObj, "note": document.querySelector('#textarea').value}));
  console.log("new Habit saveNOte", noteObj);
}
const submitNote = () => {
  saveNote();
  setSaveStatus(true);
}

useEffect(() => {
  if(saveStatus){
    updateNoteDB();
  }
  return () => {
    setSaveStatus(false);
    console.log("cleanup called", saveStatus)
  }
}, [saveStatus]);

const experimental = false;  

const deleteNote = async (makeHabit, noteId) => {

  const resp = await habitService.deleteNote(makeHabit, noteId);
  if(resp.ok /*&& resp.json().modifiedCount == */){
    console.log("note deleted", noteId);
    // setNotes(notes => ...notes);
    setReloadNotes(true);

  }
}


const HabitElem = props => {

  let habit = props.habit;
  // const {className} = props;
  const todaysNote = props.id == "today";
  let today = false;
  if(todaysNote){
    habit = noteObj;
    today=true;
  }

  console.log(habit, "habitelem habit", currHabit.makeHabit)

  return (
    <>
  <div id={habit.date} className={props.className + ` ${today ? 'text-white':''} ` +" m-4 mt-8 flex h-auto flex-row rounded-md border-2 p-2 "+(habit.done ? "habitDone" : "habitMissed")}>
    <div className="w-5/6">
        <div className="habitDate border-l-black border-4  font-bold flex h-[45px] items-center justify-center border-transparent text-center align-middle">
          {habit.date}
        </div>
        <HabitNote submitNote={submitNote} customDate={[customDate, setCustomDate]} experimental={experimental} note={habit}/>
    </div>

  {/*stands to the side*/}
    <div className="flex w-1/6 flex-col items-center justify-center border-0 border-black">
      {(!todaysNote && <TrashIcon onClick={() => deleteNote(currHabit.makeHabit, habit.noteId)} />)} 
      <div className="habitDone" id={'tick'+habit.date} onClick = {() => logDay('tick', habit.date)} >
        <Tick done={habit.done} />
      </div>
      <div id={'cross'+habit.date} onClick={() => logDay('cross', habit.date)} className={"habitMissed right-9 top-[50px] flex h-[40px] w-[40px] items-center justify-center rounded-full bg-red-400"+ " " + (habit.done == false ? "note_status" : "")}>
        x
      </div>
      </div>
      
  {props.children}
  </div>
  </>
  );
};

let calstyle= '';
const daysRemaining = (Math.floor(((new Date(currHabit.dueDate)) - (new Date()))/ (1000 * 60 * 60 * 24)));

  return (   
  (
    currHabit &&
    <>
    <div className = "container">
    <div id="makeBreakBox">
        <h2> <strong className="text-success"> MAKE:</strong> {currHabit.makeHabit} </h2> 
        <h2> <strong className="text-danger"> BREAK:</strong> {currHabit.breakHabit} </h2>
        <h2>{new Date(currHabit.createDate).toDateString()} - {new Date(currHabit.dueDate).toDateString()}</h2>
    </div>
    <div className="habitNotesContainer">
    
    {
      
    notes.map(note => 
      {
        calstyle += (calendarStyleAppend(note))
        console.log(calstyle, "calst");
      
      return ((note.date !== noteObj.date) ? ((
        <>
          <HabitElem className={`habitNote ${calendarVal.toDateString() === note.date ? 'selected' :''}`} habit={note}> 
          </HabitElem>
          <CommentElem key={note.noteId} noteId={note.noteId} />
        </>
        )
      )
        : ((daysRemaining > 0) && <HabitElem habit={noteObj} id="today"/>)
    )}
    )
  }
  {
    // /**if no notes at all */
    // if(notes.length == 0 && daysRemaining > 0) ? <div>jpt</div> : <></>)
    notes.length == 0 && daysRemaining > 0 && <HabitElem habit={noteObj} id="today" />
  }
  <CalendarComp createDate={currHabit.createDate} dueDate={currHabit.dueDate} calendarStyle={calstyle} calendarState={[calendarVal, calendarChange]} />
  {
  (daysRemaining>0 ? <h1><strong>{daysRemaining}</strong> days left</h1>: <h1>due passed</h1>)
  }        
</div>
</div>
</>
  )
    
    )
};  

export {ShowHabitPage, HabitNote, CalendarComp, calendarStyleAppend};