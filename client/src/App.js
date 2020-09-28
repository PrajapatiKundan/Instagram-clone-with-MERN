import React, {useEffect, createContext, useReducer, useContext} from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Navbar from './components/navbar'
import Home from './components/screens/home'
import SignIn from './components/screens/signin'
import SignUp from './components/screens/signup'
import Profile from './components/screens/profile'
import CreatePost from './components/screens/createpost'
import UserProfile from './components/screens/user_profile'
import SubscribedUserPosts from './components/screens/subscribed_users_posts'
import './App.css'
import { reducer, initialState} from './reducers/userReducer'

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  
  useEffect(()=>{
    console.log("User Effect render")
    const user = JSON.parse(localStorage.getItem("user"))
    
    if(user){
      dispatch({type:"USER", payload:user})//After this line value of state in UserContext = user data stored in local Storage
    }else{
      history.push("/signin")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


  return (
    <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/signin" exact>
          <SignIn />
        </Route>
        <Route path="/signup" exact>
          <SignUp />
        </Route>
        <Route path="/profile" exact>
          <Profile />
        </Route>
        <Route path="/createpost" exact>
          <CreatePost />
        </Route>
        <Route path="/profile/:userId" exact>
          <UserProfile />
        </Route>
        <Route path="/subscribeduserposts" exact>
          <SubscribedUserPosts />
        </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
