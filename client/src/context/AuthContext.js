import React, { useState, useEffect, createContext } from "react";

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  let host = 'http://localhost:3001';
  // host = 'http://192.168.1.147:3001'
  // host = "http://"+require("os").networkInterfaces()['en0'][1].address+":3001"; // comment line if not working on separate window

  useEffect(() => {
    async function checkIfUserIsLoggedIn() {
      try { // really needed so that the Component isn't rendered before the loginCheck is completed
        let response = await fetch(host + "/api/login", { credentials: "include" });

        if (!response.ok) {
          throw new Error("Unauthenticated");
        }

        let fetchedUser = await response.json();
        setUser(fetchedUser);
      } catch (error) {
        setUser(false);
      } finally {
        setLoading(false); // Set loading to false when the check is complete
      }
    }

    checkIfUserIsLoggedIn();
  }, []);

  if (loading) {
    // Render a loading state while the authentication check is in progress
    return <div>Loading...</div>;
  }

  const authenticate = async (username, password) => {
    let response = await fetch(host+"/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });


    if (!response.ok) {
      throw new Error("Login Failed");
    }

    let loggedInUser = await response.json();
    setUser({...loggedInUser, password: null}); // prevent the password from being sent


    return loggedInUser;
  };

  
  const register = async (username, password, name, motto) => {
    let response = await fetch(host+"/api/register", {
      method: "POST",
      body: JSON.stringify({ username, password ,name, motto }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error("Register Failed");
    }
  };

  const signout = async () => {
    let response = await fetch(host+"/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });
    console.log(response)
    if (!response.ok) {
      throw new Error("Logout Failed");
    }

    let body = await response.json();
    setUser(false);

    return body;
  };

  return (
    <Provider
      value={{
        authenticate,
        register,
        signout,
        isAuthenticated: user ? true : false,
        // isAuthenticated: true,
        user
      }}
    >
      {children}
    </Provider>
  );
};

// Create our own hook for accessing the context from any functional component
function useAuth() {
  return React.useContext(AuthContext);
}

export { useAuth, AuthProvider };