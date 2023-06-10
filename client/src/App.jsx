import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './Layout';

import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState({});
  const [viewMode, setViewMode] = useState('');

  return (<>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout logged={logged} setLogged={setLogged} user={user} setUser={setUser} viewMode={viewMode} setViewMode={setViewMode}/>}>
            {/* <Route path="frontoffice" element={<ShowPublicPages />} />
            <Route path="backoffice" element={<ShowAllPages />} />
            <Route path="view/:pageid" element={<ViewPage/>} />
            <Route path="add" element={<AddPage/>} />
            <Route path="editPage/:pageid" element={<EditPage/>} />
            <Route path="editWebsite" element={<EditWebsite/>} /> */}
          </Route>
          {/* <Route path="/login" element={<Login/>} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
