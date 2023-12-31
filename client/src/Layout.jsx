import { useState, useEffect } from 'react';
import { getWebsiteName, updateWebsiteName } from './API';
import {Navbar, Container, Col, Button, Form, Alert} from 'react-bootstrap'
import {useNavigate, Outlet} from 'react-router-dom'
import { logout } from './API';

function Layout(props){
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        props.setLogged(false);
        props.setUser({});
        props.setViewMode("frontoffice");
        navigate('/frontoffice');
    }

    const handleBackoffice = () => {
        props.setViewMode('backoffice');
        navigate('/backoffice');
    }

    const handleFrontoffice = () => {
        props.setViewMode('frontoffice');
        navigate('/frontoffice');
    }

    const handleWebsiteEdit = () => {
        navigate('/editWebsite');
    }

    useEffect(() => {
        props.setViewMode("frontoffice");
        navigate('/frontoffice');
    },[]);

    return (
        <>
            <header>
                <Navbar variant="dark" bg="primary" sticky="top" className='mb-3'>
                    <Container fluid>
                        <Col className='w-25'>
                        <Navbar.Brand>
                            {props.websiteName? <Button onClick={handleFrontoffice}>{props.websiteName}</Button>:"Loading..."}
                            {props.user && props.user.role == 'admin'?
                            <Button onClick={handleWebsiteEdit}>EDIT NAME</Button>:''
                            }
                        </Navbar.Brand>
                        </Col>
                        <Col className="d-flex justify-content-center">
                        {props.logged?
                            <Navbar.Text className='w-50'>Signed in as: {props.user.username}</Navbar.Text>:''
                        }
                        </Col>
                        <Col className="d-flex justify-content-end w-25">
                        { (props.logged && props.viewMode=='frontoffice')?                 
                        <Button onClick={handleBackoffice}>Backoffice</Button>:''
                        }
                        { (props.logged && props.viewMode=='backoffice')?                 
                        <Button onClick={handleFrontoffice}>Frontoffice</Button>:''
                        }
                        {props.logged?
                        <Button onClick={handleLogout}>Logout</Button>:
                        <Button onClick={() => navigate('/login')}>Login</Button>
                        }
                        </Col>
                    </Container>
                </Navbar>
            </header>
            <main>
                <Container>
                    <Outlet />
                </Container>
            </main>
        </>
    )
}

function EditWebsite(props){

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState(false);
    const [waiting,setWaiting] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    const updateName = (ev) => {
        setName(ev.target.value);
    }

    const handleSave = async () => {
        setWaiting(true);
        if(name.trim()!=''){
            props.setWebsiteName(name);
            await updateWebsiteName(name);
            if(props.viewMode=='frontoffice'){
                navigate('/frontoffice');
            }
            else{
                navigate('/backoffice');
            }
        }
        else{
            setNameError(true);
            setWaiting(false);
        }
    };

    useEffect(() => {
        async function getName(){
            const name = await getWebsiteName();
            setName(name);
            setLoaded(true);
        }
        getName();
    },[]);

    return (<>
        <div className="d-flex justify-content-center">
            <Form className="rounded mt-3 w-50">
                <Form.Group>
                <Form.Label>Website name</Form.Label>
                <Form.Control disabled={!loaded} required={true} value={name} onChange={ev => updateName(ev)} placeholder={"Enter the new website name"}/>
                </Form.Group>
        
                <Button className="mt-3" disabled={waiting} variant="success" onClick={handleSave}>SAVE</Button>{' '}
                <Button className="mt-3" variant="danger" onClick={() => {navigate('/backoffice')}}>CANCEL</Button>
            </Form>
        </div>
        <div className="d-flex justify-content-center">
        {(nameError)?
        <Alert variant='danger' className="mt-3 w-50">
            <p>The new name can't be empty</p>
        </Alert>:''
        }
        </div>
      </>);
}

function ErrorPage(){

    const navigate = useNavigate();

    return (<>
        <h1 className="d-flex justify-content-center mt-3">404: Page not found</h1>
        <Button className="ms-3 mt-3" onClick={() => navigate('/frontoffice')}>BACK TO FRONTOFFICE</Button>
    </>);
}

export {Layout, EditWebsite, ErrorPage};