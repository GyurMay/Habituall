import { useEffect, useRef } from "react";
import Calendar from "react-calendar";

const CalendarComp = props => {
    const {calendarStyle, createDate, dueDate } = props;
    const [calendarVal, calendarChange] = props.calendarState;
    // const [calendarStyle, setCalendarStyle] = props.calendarStyle;
    const ref = useRef(null);
  
    const stickify = () => {
      const calendarDiv = ref.current;
      const makeBreakBox = document.querySelector("#makeBreakBox");
      
      if (!calendarDiv || !makeBreakBox) return;
  
      console.log(window.scrollY, ";;", calendarDiv.offsetTop);
  
      const makeBreakBoxBottom = makeBreakBox.offsetTop + makeBreakBox.getBoundingClientRect().height + 50;
  
      if (window.scrollY >= makeBreakBoxBottom) {
        calendarDiv.classList.add('sticky');
      } else {
        calendarDiv.classList.remove('sticky');
      }
    };
  
    useEffect(() => {
      window.addEventListener('scroll', stickify);
  
      return () => {
        window.removeEventListener('scroll', stickify);
      };
    }, []);
  
    useEffect(() => {
      const makeBreakBox = document.querySelector("#makeBreakBox");
      if (makeBreakBox) {
        ref.current.style.top = makeBreakBox.offsetTop + makeBreakBox.getBoundingClientRect().height + 50 + 'px';
      }
    }, [calendarVal, createDate, dueDate]); 
  
    return (
    <>
    <div ref={ref} className="calendar" style={{top: document.querySelector("#makeBreakBox")?.offsetTop + document.querySelector("#makeBreakBox")?.getBoundingClientRect().height + 50+'px'}}>
      <style>
        {calendarStyle}
      </style>
      <Calendar onChange={calendarChange} value={[createDate, dueDate]}/>
      
    <div className="calendarInfo">
      Whats this? 💭 💭<br />
      <span style={{color:'green'}}>[12]</span> - marked done with a note <br />
      <span style={{color:'red'}}>[12]</span> - marked not done with a note
    </div>
    </div>
    </>
    )
  }
  
  export {CalendarComp}