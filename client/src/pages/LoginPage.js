import { useAuth } from '../context/AuthContext.js';
// import auth from '../services/auth.js';
import {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// let error = false;
import "../Login.css";



export default function LoginPage(props){
  const [error, setError] = useState(false);
  const loggedOut = false;
  // const [motto, setMotto] = useState('');

  // useEffect(() => {
  //   if(!register){
  //     return <RegisterComp />;
  //   }
  // }, [register])

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  

  const from = location.state?.from?.pathname || "/";
  if(auth.isAuthenticated) navigate(from)
  async function handleSubmit(e){
    e.preventDefault();
    const [username, password] = [document.querySelector('#username').value, document.querySelector('#password').value];
    // const [username, password] = ["dorjee","hi"]
    // username = 'dorjee';
    // password ='hi';
    try{
        await auth.authenticate(username, password);
        navigate(from);
    }catch(err) {
        // this.setState({ failed: true });
        setError(true);
      };
    
  }
  const registerUser = async (e) => {
    e.preventDefault();
    const [username, password, name, motto] = [document.querySelector('#r_username').value ,document.querySelector('#r_password').value, document.querySelector('#r_name').value, document.querySelector('#r_motto').value];
    if(username.trim() == '' || password.trim() == '' || name.trim() == '' || motto.trim() == '')
      {
        alert('fill all the boxes');
        return;
      }
    try{
        await auth.register(username, password, name, motto);
        navigate(from);
    }catch(err) {
        // this.setState({ failed: true });
        setError(true);
      };
  };

  function ErrorAlert(props){
    return (
      <div class='alert alert-danger' style={{background: ''}}>{props.details}</div>
    )
    }

  const S_LoginComp = props => {

    return (
<>
{error && <ErrorAlert details={"Login failed"} />}
{loggedOut && <ErrorAlert details={"Log in to view page"} />}    

<div className='login-area'>
  <div className='banner'>Habituall 🌙 ☀️</div>
	<div class="main">  	
  <input type="checkbox" id="chk" aria-hidden="true" />
    <div class="signup">
      <form onSubmit={handleSubmit}>
      <label for="chk" aria-hidden="true">Login</label>
        <input type="text" id="username" name="username" placeholder="Username" required="" />
        <input type="password" id="password" name="password" placeholder="Password" required="" />
        <button>Login</button>
      </form>
    </div>

    <div class="login">
      
      <form onSubmit={registerUser}>
        <label for="chk" aria-hidden="true">Sign up</label>
        <input type="text" id="r_name" name="name" placeholder="Name" required="" />
        <input type="text" id="r_username" name="username" placeholder="Username" required="" />
        <input type="motto" id="r_motto" name='motto' placeholder="About your profile" />
        <input type="password" id="r_password" name='password' placeholder="Enter your password" required="" />
        <button>Sign up</button>
      </form>
    </div>
  </div>
</div>
</>
)
  }

  

  return <S_LoginComp />
};