import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
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

    const handleSubmit = async () => {

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
        <Form className="block-example rounded mb-0 form-padding justify-content-center">
        <Col xs={6}>
        <Form.Group className="ms-3">
          <Form.Label>Username</Form.Label>
          <Form.Control required={true} value={username} onChange={ev => updateUsername(ev)} placeholder={"Enter email"}/>
        </Form.Group>
  
        <Form.Group className="ms-3 mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} required={true} onChange={ev => updatePassword(ev)} placeholder={"Enter passsord"}/>
        </Form.Group>
        </Col>
  
        <Button className="mb-3 ms-3" variant="primary" onClick={handleSubmit}>Login</Button>
        {(usernameError||passwordError)? <div className='ms-3'>ERROR</div>:''}
        {wrong? <div className='ms-3'>{wrong}</div>:''}
      </Form>
      </>);
}

export {Login};