import { useAuth } from "../context/AuthContext";
import { useLocation, Navigate } from "react-router-dom";
import { SharedProvider } from "../context/SharedContext";

function PrivateRoute({ children }) {
  let auth = useAuth();
  let location = useLocation();
  // const {currHabitProvided} = useSharedContext();
  // const {currHabit, setCurrHabit} = currHabitProvided;
  // const {currHabit, setCurrHabit} = useSharedContext();

  if (!auth.isAuthenticated) {
    // console.log("auth not authenticate in Private Route", auth.isAuthenticated, (new Date()).getMilliseconds());
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
//wrap this with Context sharing currHabit
// let comp = 
  // <SharedProvider>
    // children
  // </SharedProvider>
  // ;
  // console.log("wrapped in SharedProvider")
  return children;
}


// const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route {...rest} render={(props) => (
//     auth.isAuthenticated === true
//       ? <Component {...props} />
//       : 
//       // document.location = document.location.origin+'/login'
//       <Navigate to='/login'
//       // {{ 
//       //     // pathname: '/login',
//       //     // state: { from: props.location }  
//       //   }} 
//       />
//   )} />
// );

export default PrivateRoute;
// export default PrivateWrapper;