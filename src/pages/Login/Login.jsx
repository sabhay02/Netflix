import React, { useState } from 'react';
import './Login.css';
import logo from '../../assets/logo.png';
import {login,signup} from "../../firebase"
import netflix_spinner from '../../assets/netflix_spinner.gif';

const Login = () => {
   const [signState,setsignState]=useState('Sign In')
    const [loading,setLoading]=useState(false)
 const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const user_auth = async (event) => {
    event.preventDefault();
            setLoading(true);
    if (signState === "Sign In") {
        await login(email, password);
    } else {
        await signup(name, email, password);
    }
     setLoading(false);
}

const demoLogin = async () => {
  setLoading(true);
  await signup("Demo User", "demo@netflix.com", "demo123456");
  setLoading(false);
};

    return (
         loading ? (
                <div className="login-spinner">
                    <img src={netflix_spinner} alt="Loading..." />
                </div>
            ):
        <div className='login'>
            <img src={logo} className='login-logo' alt="Company Logo" />
            <div className="login-form">
                <h1>{signState}</h1>
                
                {/* Demo Login Section */}
                <div className="demo-section">
                    <button 
                        type="button" 
                        className="demo-button"
                        onClick={demoLogin}
                    >
                        🎬 Demo Login (For Recruiters)
                    </button>
                    <p className="demo-text">
                        Quick access for recruiters and employers - no signup required!
                    </p>
                </div>

                <div className="divider">
                    <span>OR</span>
                </div>

                <form>
                    {signState=="Sign Up"?                    <input value={name} onChange={(e)=>{setName(e.target.value)}} type="text" placeholder='Your name' />:<></>
}
                    <input  value={email} onChange={(e)=>{setEmail(e.target.value)}}  type="email" placeholder='Email' />
                    <input  value={password} onChange={(e)=>{setPassword(e.target.value)}}  type="password" placeholder='Password' />
                    <button onClick={user_auth} type="submit">{signState}</button>
                    <div className="form-help">
                        <div className="remember">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <a href="/help">Need help?</a>
                    </div>
                </form>
                <div className="login-options">
        {signState=="Sign In"?<p className="login-text">New to Netflix? <span onClick={()=>setsignState("Sign Up")}  className="signup-link">Sign up now</span></p>:  <p className="login-text">Already have an account? <span onClick={()=>setsignState("Sign In")}   className="login-link">Sign in</span></p>}           

</div>
            </div>
        </div>
    );
};

export default Login;
