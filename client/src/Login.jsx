import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col, Alert } from "react-bootstrap";
import { login, getWebsiteName } from "./API";

function Login(props){

    const [websiteName, setWebsiteName] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [wrong,setWrong] = useState('');
    const navigate = useNavigate();

    const updateUsername = (ev) => {
        setUsername(ev.target.value);
    }
    const updatePassword = (ev) => {
        setPassword(ev.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        let correct = true;
        setWrong('');
        const re = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
        if(!re.test(username)){
            setUsernameError(true);
            correct=false;
        }
        else{
            setUsernameError(false);
        }
        if(password==''){
            setPasswordError(true);
            correct=false;
        }
        else{
            setPasswordError(false);
        }

        try{
            if(correct){
                const user = await login(username,password);
                props.setLogged(true);
                props.setUser(user);
                navigate('/frontoffice');
            }
        }
        catch(err){
            setWrong(err.message);
        }
        
    };

    useEffect(() => {
        async function getName(){
            const name = await getWebsiteName();
            setWebsiteName(name);
        }
        getName();
    },[]);

    return (<>
        <h1 className="d-flex justify-content-center mt-3">{websiteName? websiteName+ ': Login':"Loading..."}</h1>
        <div className="d-flex justify-content-center">
        <Form className="rounded mt-3 w-50" onSubmit={handleSubmit}>
        <Form.Group className="ms-3">
          <Form.Label>Username</Form.Label>
          <Form.Control required={true} value={username} onChange={ev => updateUsername(ev)} placeholder={"Enter email"}/>
        </Form.Group>
  
        <Form.Group className="ms-3 mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} required={true} onChange={ev => updatePassword(ev)} placeholder={"Enter password"}/>
        </Form.Group>
  
        <Button className="mb-3 ms-3" variant="primary" type="submit">Login</Button>
        </Form>
        </div>
        <div className="d-flex justify-content-center">
        {(usernameError || passwordError)?
        <Alert variant='danger' className="ms-3 w-50">
            <p>You must solve the following error(s):</p>
            {usernameError? <p>The email doesn't respect the correct format</p>:''}
            {passwordError? <p>The password field can't be empty</p>:''}
        </Alert>:''
        }
        {wrong? <Alert variant='danger' className='ms-3  w-50'>{wrong}</Alert>:''}
        </div>
      </>);
}

export {Login};