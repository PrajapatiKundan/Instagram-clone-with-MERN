import React, {useContext} from 'react';
import { Link, useHistory } from 'react-router-dom'
import {UserContext} from '../App'

const Navbar = () => {
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const renderList = () => {
        if(state){
            return ([
                <li className="nav-item active" key="3">
                    <Link className="nav-link" to="/profile">Profile</Link>
                </li>,
                <li className="nav-item active" key="4">
                    <Link className="nav-link" to="/createpost">Create Post</Link>
                </li>,
                <li className="nav-item active" key="5">
                    <button 
                        className="btn btn-sm btn-outline-light" 
                        style={{ marginTop:"4px"}}
                        onClick={ () => {
                            localStorage.clear()
                            dispatch({type:"CLEAR"})
                            history.push("/signin")
                        } }    
                    >Log out</button>
                </li>
            ])
        }else{
            return ([
                <li className="nav-item active" key="1">
                    <Link className="nav-link" to="/signin">Login</Link>
                </li>,
                <li className="nav-item active" key="2">
                    <Link className="nav-link" to="/signup">SignUp</Link>
                </li>
            ])
        }
    }
    return (
        
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary"> 
          <Link className="navbar-brand" to={state ? "/":"/signin"}>Insta-clone</Link>        
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
              <ul className="navbar-nav ml-auto">
                { renderList()}
                
              </ul>
            
          </div>
      </nav>
    )
}

export default Navbar

//Link tag instead of <a> tag is used for single page application