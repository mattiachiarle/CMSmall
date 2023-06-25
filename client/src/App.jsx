import { useState, useEffect  } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout, EditWebsite, ErrorPage } from './Layout';
import { ShowPublicPages, ShowAllPages, ViewPage, AddPage, EditPage } from './Pages';
import { Login } from './Login';
import { getSession, getWebsiteName } from './API';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'

function App() {

  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState({});
  const [viewMode, setViewMode] = useState('');
  const [websiteName, setWebsiteName] = useState('');

  useEffect(() => {
    async function setup(){
      const name = await getWebsiteName();
      setWebsiteName(name);
      const user = await getSession();
      if(user){
        setLogged(true);
        setUser(user);
      }
    }
    setup();
  },[]);

  return (<>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout logged={logged} setLogged={setLogged} user={user} setUser={setUser} viewMode={viewMode} setViewMode={setViewMode} websiteName={websiteName}/>}>
            <Route path="frontoffice" element={<ShowPublicPages/>} />
            <Route path="backoffice" element={<ShowAllPages user={user}/>} />
            <Route path="pages/:pageid" element={<ViewPage/>} />
            <Route path="add" element={<AddPage/>} />
            <Route path="editPage/:pageid" element={<EditPage user={user}/>} />
            <Route path="editWebsite" element={<EditWebsite setWebsiteName={setWebsiteName} viewMode={viewMode}/>} />
          </Route>
          <Route path="/login" element={<Login setLogged={setLogged} setUser={setUser}/>} />
          <Route path="*" element={<ErrorPage/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
