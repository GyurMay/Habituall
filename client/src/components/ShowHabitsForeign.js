import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import habitService from "../services/habitService";
import CommentElem from "./CommentElem";
import { CalendarComp, HabitNote, calendarStyleAppend } from "../pages/ShowHabitPage";

const DEFAULT_HABIT_ID = 100;
let currDate = new Date().toDateString();

const Tick = (props) => {
  return (
  <div className="habitDone mb-1 w-[40px]">
    <div className={"flex h-[40px] items-center justify-center rounded-full bg-lime-500" + " " + (props.done ? "border-4 border-black" : "")}>
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" className="">
        <path d="M 20.292969 5.2929688 L 9 16.585938 L 4.7070312 12.292969 L 3.2929688 13.707031 L 9 19.414062 L 21.707031 6.7070312 L 20.292969 5.2929688 z"></path>
      </svg>
    </div>
    </div>
    );
  };

const ShowHabitsForeign = props => {
  const params = useParams();
//   const [currHabit, setCurrHabit] = useState({ makeHabit: '1' });
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(false);
  const [makeHabit, setMakeHabit] = useState('');
  const [dates, setDates] = useState(null);
  
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

  const convertToCalendarDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  let calendarStyle = ``;
  


  useEffect(() => {
    const fetchHabit = async () => {
    //   const habit = await habitService.loadHabit(params.id);
    //   setCurrHabit(habit);
    };

    const fetchNotes = async () => {
      const resp = await habitService.getForeignNotes(params.username, params.makeHabit);
      if(!resp.ok) setError(true);
      const notes = await resp.json();
      console.log("notes foreign", notes);
      notes[0].notes = notes[0].notes.filter(x => x.date !== currDate);
      console.log(notes[0].notes[2], "filtered filter")

      setNotes(notes[0].notes); 
      setMakeHabit(notes[0].makeHabit);
      setDates({createDate: notes[0].createDate, dueDate: notes[0].dueDate});
    };

    fetchNotes();
  }, [params.makeHabit, params.username]);

  // const HabitNote = (props) => {
  //   const {note, owner} = props;

  //   return (
  //   <div className="habitNote text-md flex h-[45px] w-full resize-none items-end justify-start border-b-2 border-b-gray-200">
  //     {note.note}
  //   </div>
  //   );
  // };
  
  const HabitElem = props => {

    const {habit} = props;

    return (
    <div id={habit.noteId} className={props.className +" m-4 mt-8 flex h-auto flex-row rounded-md border-2 p-2 "+(habit.done?"habitDone":"habitMissed")}>
      <div className="w-5/6">
        <div className="habitDate border-l-black border-4 font-bold flex h-[45px] items-center justify-center border-transparent text-center align-middle">
          {habit.date}
        </div>
        <HabitNote note={habit} />
      </div>

      {/* side of the note */}
      <div className="flex w-1/6 flex-col items-center justify-center border-0 border-black">
              <div className="habitDone">
                <Tick done={habit.done} />  
              </div>
              <div className={"habitMissed right-9 top-[50px] flex h-[40px] w-[40px] items-center justify-center rounded-full bg-red-400"+ " " + (habit.done == false ? "border-4 border-black" : "")}>x</div>
      </div>
    </div>
    );
  };
  return (
    <>
      <div className="container">
        <div id="makeBreakBox">
          <div id="username" className="fw-bold p-10 border rounded border-dark-3"><Link to={`/users/${params.username}`}>Habituall by @{params.username}</Link></div>
          <h2> <strong className="text-success"> MAKE:</strong> {makeHabit} </h2> 
          <h2>{dates?.createDate} - {dates?.dueDate}</h2>
          {/* <h2><strong className="text-danger">BREAK:</strong> {currHabit.breakHabit}</h2> */}
          {/* <h2>Complete by: {new Date(currHabict.dueDate).toDateString()}</h2> */}
        </div>
        <div className="habitNotesContainer">
          {notes?.map(note => {
            calendarStyle += calendarStyleAppend(note);
            return (
            <>
            {/* <div className="theNote"> */}
              <HabitElem className={`habitNote ${calendarVal.toDateString() === note.date ? 'selected' :''}`} key={note.noteId} habit={note} />
            {/* </div> */}
              <CommentElem key={note.noteId} noteId={note.noteId}/>
            </>
            );
            })
          }
            {/* <h1><strong>{Math.floor(((new Date(currHabit.dueDate)) - (new Date())) / (1000 * 60 * 60 * 24))}</strong> days left</h1> */}
            <CalendarComp createDate={dates?.createDate} dueDate={dates?.dueDate} calendarStyle={calendarStyle} calendarState={[calendarVal, calendarChange]} />

        </div>
      </div>
    </>
  );
};

export default ShowHabitsForeign;
