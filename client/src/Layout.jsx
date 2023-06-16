import { useState, useEffect } from 'react';
import { getWebsiteName } from './API';
import {Navbar, Container, Row, Col, Button} from 'react-bootstrap'
import {useNavigate, Outlet} from 'react-router-dom'
import { logout } from './API';

function Layout(props){
    const navigate = useNavigate();

    const [websiteName, setWebsiteName] = useState('');

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
        //TBD
    }

    useEffect(() => {
        async function getName(){
            const name = await getWebsiteName();
            setWebsiteName(name);
        }
        getName();
        props.setViewMode("frontoffice");
        navigate('/frontoffice');
    },[]);

    return (
        <>
            <header>
                <Navbar variant="dark" bg="primary" sticky="top" expand="lg" className='mb-3'>
                    <Container fluid>
                        <Col xs={2}>
                        <Navbar.Brand>
                            {websiteName? <Button onClick={handleFrontoffice}>{websiteName}</Button>:"Loading..."}
                            {props.user && props.user.role == 'admin'?
                            <> <Button onClick={handleWebsiteEdit}>EDIT NAME</Button></>:
                            ''
                            }
                        </Navbar.Brand>
                        </Col>
                        <Col xs={8} className="d-flex justify-content-center">{
                            props.logged?
                            <Navbar.Text>Signed in as: {props.user.username}</Navbar.Text>:''
                        }
                        </Col>
                        <Col xs={2} className="d-flex justify-content-end">
                        {  (props.logged && props.viewMode=='frontoffice')?                 
                        <Button onClick={handleBackoffice}>Backoffice</Button>:''
                        }
                        {  (props.logged && props.viewMode=='backoffice')?                 
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

export {Layout};