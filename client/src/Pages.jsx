import { addPage, deletePage, editPage, getAllPages, getPage, getPublicPages, getUsers } from "./API";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Table, Button, Form, Row, Col, Dropdown, Alert, Image } from "react-bootstrap";
import { Block, blockChecks } from "../Models/blockModel";

import dayjs from 'dayjs';

function ShowPublicPages() {

    const [loaded, setLoaded] = useState(false);
    const [pages, setPages] = useState([]);

    useEffect(() => {
        async function getPages(){
            let pages = await getPublicPages();
            pages.sort((p1,p2) =>  p1.publicationDate.diff(p2.publicationDate));
            setPages(pages);
            setLoaded(true);
        }
        getPages();
    },[])

    return (<>
        <h1>Frontoffice</h1>
        <Table>
            <tbody>
                <tr>
                    <th>
                        Page name
                    </th>
                    <th>
                        Author
                    </th>
                    <th>
                        Publication date
                    </th>
                </tr>
                {loaded? pages.map(p => <PageRow key={p.id} page={p}/>):<tr><td>Loading...</td></tr>}
            </tbody>
        </Table>
    </>
    )
}

function PageRow(props){

    return (<><tr>
        <td><Link to={`/pages/${props.page.id}`}>{props.page.title}</Link></td>
        <td>{props.page.author}</td>
        <td>{props.page.publicationDate.format('DD/MM/YYYY')}</td>
    </tr></>)
}

function ShowAllPages(props) {

    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);
    const [pages, setPages] = useState([]);

    const handleAdd = () => {
        navigate('/add');
    }

    const handleDelete = async (id) => {
        setPages((oldPages) => oldPages.filter((p) => p.id!=id));
        await deletePage(id);
        const pages = await getAllPages();
        setPages(pages);
    }

    useEffect(() => {
        async function getPages(){
            const pages = await getAllPages();
            setPages(pages);
            setLoaded(true);
        }
        getPages();
    },[])

    return (<>
        <h1>Backoffice</h1>
        <Table>
            <tbody>
                <tr>
                    <th>
                        Page name
                    </th>
                    <th>
                        Author
                    </th>
                    <th>
                        Creation date
                    </th>
                    <th>
                        Publication date
                    </th>
                    <th>
                        Status
                    </th>
                    <th>
                        {" "}
                    </th>
                    <th>
                        {" "}
                    </th>
                </tr>
                {loaded? pages.map(p => <LoggedPageRow key={p.id} page={p} user={props.user} handleDelete={handleDelete}/>):<tr><td>Loading...</td></tr>}
            </tbody>
        </Table>
        <div className="d-flex justify-content-end justify-content-bottom">
            <Button variant="primary" onClick={handleAdd}>
                +
            </Button>
        </div>
    </>
    )
}

function LoggedPageRow(props){

    const navigate = useNavigate();

    const handleEdit = (page) => {
        const editedPage = {...page,publicationDate: page.publicationDate && page.publicationDate.format('YYYY-MM-DD')}
        navigate(`/editPage/${page.id}`,{state: editedPage});
    }

    const handleDelete = (id) => {
        props.handleDelete(id);
    }

    return (<><tr>
        <td>{props.page.title}</td>
        <td>{props.page.author}</td>
        <td>{props.page.creationDate.format('DD/MM/YYYY')}</td>
        <td>{props.page.publicationDate? props.page.publicationDate.format('DD/MM/YYYY'):''}</td>
        <td>{props.page.status}</td>
        {(props.page.author==props.user.username || props.user.role=='admin')?<>
            <td><Button variant="warning" onClick={() => handleEdit(props.page)}>
                <i className="bi bi-pencil"></i>
            </Button></td>
            <td><Button variant="danger" onClick={() => handleDelete(props.page.id)}>
                <i className="bi bi-trash"></i>
            </Button></td>    
        </>:<><td> </td><td> </td></>}
    </tr></>)
}

function ViewPage(){

    const { pageid } = useParams();
    const navigate = useNavigate();

    const [page, setPage] = useState(null);

    useEffect(() => {
        async function showPage(id){
            try{
                const page = await getPage(id);
                setPage(page);
            }
            catch(err){
                // fake url, used just to go to the error page
                navigate('/error');
            }
        }
        showPage(pageid);
    },[])

    return (<>
        <Row>
            <Col>
                <h1 className="pageTitle">{page? page.title:'Loading...'}</h1>
            </Col>
            <Col className="d-flex justify-content-end mt-2">
                <h2 className="pageAuthor">{page? "Author: " + page.author:''}</h2>
            </Col>
        </Row>
        <p className="date mt-1">{page? "Creation date: "+page.creationDate.format('DD/MM/YYYY'):''}</p>
        <p className="date">{page? "Publication date: "+page.publicationDate.format('DD/MM/YYYY'):''}</p>
        {page? page.blocks.map((b) => <ShowBlock key={b.id} block={b}/>):''}
        <Button className='mt-2 mb-2' onClick={() => navigate('/frontoffice')}>BACK</Button>
    </>);
}

function ShowBlock(props){

    const [image, setImage] = useState(null);

    useEffect(() => {
        if(props.block.type=='image'){
            setImage(`/img/image${props.block.content}.png`);
        }
    },[props.block.type,props.block.content])

    return(<div className="mt-3 mb-3">
    {(image && props.block.type=='image')? <Image src={image} alt="image" width={300} rounded/> : ''}
    {props.block.type=='header'? <h3>{props.block.content}</h3> : ''}
    {props.block.type=='paragraph'? <p className="paragraph">{props.block.content}</p> : ''}
    </div>);

}

function AddPage() {

    const [title, setTitle] = useState('');
    const [publicationDate, setPublicationDate] = useState('');
    const [blocks, setBlocks] = useState([]);
    const [waiting, setWaiting] = useState(false);
    const [titleErr, setTitleErr] = useState(false);
    const [blocksErr, setBlocksErr] = useState(false);
    const [dataErr, setDataErr] = useState(false);
    const [blockId, setBlockId] = useState(0);//fake id, since the real one will be placed by the db
    
    const navigate = useNavigate();

    const updateTitle = (ev) => {
        setTitle(ev.target.value);
    }

    const updatePublicationDate = (ev) => {
        setPublicationDate(ev.target.value);
    }

    const handleAddBlock = (type) => {
        setBlocks((oldBlocks) => [...oldBlocks, new Block(blockId,type,'',blocks.length+1)]);
        setBlockId((oldId)=>oldId+1);
    }

    const moveUp = (pos) => {
        if(pos==1){
            return;
        }
        setBlocks((oldBlocks) => {
            const newBlocks = oldBlocks.map((b) => {
                if(b.position==pos){
                    return new Block(b.id,b.type,b.content,b.position-1);
                }
                if(b.position==pos-1){
                    return new Block(b.id,b.type,b.content,b.position+1);
                }
                return b;
            });
            newBlocks.sort((a,b) => a.position - b.position);
            return newBlocks;
        });
    }

    const moveDown = (pos) => {
        if(pos==blocks.length){
            return;
        }
        setBlocks((oldBlocks) => {
            const newBlocks = oldBlocks.map((b) => {
                if(b.position==pos){
                    return new Block(b.id,b.type,b.content,b.position+1);
                }
                if(b.position==pos+1){
                    return new Block(b.id,b.type,b.content,b.position-1);
                }
                return b;
            });
            newBlocks.sort((a,b) => a.position - b.position);
            return newBlocks;
        });
    }

    const removeBlock = (id) => {
        setBlocks((oldBlocks) => {
            const removedBlock = oldBlocks.filter((b) => b.id==id);
            const removedPosition = removedBlock[0].position;
            const newBlocks = oldBlocks.map((b) => b.position > removedPosition? new Block(b.id,b.type,b.content,b.position-1):b);
            return newBlocks.filter((b) => b.id!=id);
        })
    }

    const updateBlockContent = (id, content) => {
        setBlocks((oldBlocks) => oldBlocks.map((b) => b.id==id? new Block(b.id,b.type,content,b.position):b))
    }

    const handleAdd = async (title, publicationDate, blocks) => {
        setWaiting(true);
        const dataCheck = !publicationDate || publicationDate>=dayjs().format('YYYY-MM-DD');
        const blockValidation = blockChecks(blocks);
        if (title.trim() == '' || !blockValidation || !dataCheck) {
            setWaiting(false);
            if(title.trim()==''){
                setTitleErr(true);
            }
            else{
                setTitleErr(false);
            }
            if(!blockValidation){
                setBlocksErr(true);
            }
            else{
                setBlocksErr(false);
            }
            if(!dataCheck){
                setDataErr(true);
            }
            else{
                setDataErr(false);
            }
        }
        else {
            await addPage(title,publicationDate,blocks);            
            navigate('/backoffice');
            setWaiting(false);
        }
    }

    return (
        <>
        <Form>
            <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control value={title} onChange={(ev) => (updateTitle(ev))} type="text" name="title" placeholder='Enter title' />
            </Form.Group>
            <Form.Group controlId='publicationDate'>
                <Form.Label>Publication date</Form.Label>
                <Form.Control value={publicationDate} onChange={(ev) => (updatePublicationDate(ev))} type="date" name="date" placeholder='Enter date' />
            </Form.Group>
            {blocks.map((b) => <AddedBlock key={b.id} block={b} moveUp={moveUp} moveDown={moveDown} maxPosition={blocks.length} removeBlock={removeBlock} updateBlockContent={updateBlockContent}/>)}
        </Form>
        <Row>
        <Dropdown className = 'mt-3 mb-3'>
            <Dropdown.Toggle variant="success" id="add-block">
                New block
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleAddBlock('header')}>Header</Dropdown.Item>
                <Dropdown.Item onClick={() => handleAddBlock('image')}>Image</Dropdown.Item>
                <Dropdown.Item onClick={() => handleAddBlock('paragraph')}>Paragraph</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </Row>
        {(titleErr || blocksErr || dataErr)?
        <Alert variant='danger'>
            <p>Before submitting you must solve the following error(s):</p>
            {titleErr? <p>Title can't be empty</p>:''}
            {blocksErr? <p>You must include at least one header and at least one between image and paragraph. Be sure that none of the provided blocks is empty</p>:''}
            {dataErr? <p>If present, the publication date can't be earlier than today</p>:''}
        </Alert>:''
        }
        <Row className="d-flex justify-content-end justify-content-bottom mb-2">
        <Col xs={3}>
        <Button disabled={waiting} variant="success" onClick={() => {handleAdd(title, publicationDate, blocks);}}>ADD</Button>{' '}
        <Button variant="danger" onClick={() => {navigate('/backoffice')}}>CANCEL</Button>
        </Col>
        </Row>
        </>);

}

function AddedBlock(props){
    const [content, setContent] = useState(props.block.content); //Useful for edit, while for add it will always be ''
    const [image,setImage] = useState(props.block.content? props.block.content:0);

    const updateContent = (ev) => {
        setContent(ev.target.value);
        props.updateBlockContent(props.block.id,ev.target.value);
    }

    const handleImageChange = (id) => {
        setImage(id);
        props.updateBlockContent(props.block.id,id);
    }

    return(<>
    <Row>
    <Col xs={9}>
    {props.block.type=='header'?
        <Form.Group controlId="header">
            <Form.Label>Header</Form.Label>
            <Form.Control value={content} onChange={(ev) => (updateContent(ev))} type="text" name="header" placeholder='Enter header' />
        </Form.Group>:''
    }
    {props.block.type=='image'?
        <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>
            <Row>
                <Col>
                    <Form.Check
                        inline
                        checked={image==1}
                        label="1"
                        name={`image-${props.block.id}`}
                        type="radio"
                        id={`image-1`}
                        onChange={() => handleImageChange(1)}
                    />
                    <img src={'/img/image1.png'} alt="image1" width="200"/>
                </Col>
                <Col>
                    <Form.Check
                        inline
                        checked={image==2}
                        label="2"
                        name={`image-${props.block.id}`}
                        type="radio"
                        id={`image-2`}
                        onChange={() => handleImageChange(2)}
                    />
                    <img src={'/img/image2.png'} alt="image2" width="200"/>
                </Col>
            </Row>
            <Row className="mt-2">
                <Col>
                    <Form.Check
                    inline
                    checked={image==3}
                    label="3"
                    name={`image-${props.block.id}`}
                    type="radio"
                    id={`image-3`}
                    onChange={() => handleImageChange(3)}
                    />
                    <img src={'/img/image3.png'} alt="image3" width="200"/>
                </Col>
                <Col>
                    <Form.Check
                    inline
                    checked={image==4}
                    label="4"
                    name={`image-${props.block.id}`}
                    type="radio"
                    id={`image-4`}
                    onChange={() => handleImageChange(4)}
                    />
                    <img src={'/img/image4.png'} alt="image4" width="200"/>
                </Col>
            </Row>
        </Form.Group>:''
    }
    {props.block.type=='paragraph'?
        <Form.Group controlId="paragraph">
            <Form.Label>Paragraph</Form.Label>
            <Form.Control as="textarea" value={content} onChange={(ev) => (updateContent(ev))} type="text" name="paragraph" placeholder='Enter paragraph' />
        </Form.Group>:''
    }
    </Col>
    <Col>
    { props.block.position!=1?
    <Button onClick={() => props.moveUp(props.block.position)} className="mt-3">
        <i className="bi bi-arrow-up"></i>
    </Button>:''
    }
    { props.block.position!=props.maxPosition?
    <Button onClick={() => props.moveDown(props.block.position)} className="mt-3">
        <i className="bi bi-arrow-down"></i>
    </Button>:''
    }
    <Button variant="danger" onClick={() => props.removeBlock(props.block.id)} className="mt-3">
        <i className="bi bi-trash"></i>
    </Button>
    </Col>
    </Row>
    
    </>);
}

function EditPage(props) {

    const location = useLocation();
    const {pageid} = useParams();

    const [title, setTitle] = useState('');
    const [author,setAuthor] = useState('');
    const [publicationDate, setPublicationDate] = useState('');
    const [blocks,setBlocks] = useState([]);
    const [waiting,setWaiting] = useState(false);
    const [titleErr, setTitleErr] = useState(false);
    const [blocksErr, setBlocksErr] = useState(false);
    const [dataErr, setDataErr] = useState(false);
    const [blockId, setBlockId] = useState(0);//again fake id
    const [addedBlocks, setAddedBlocks] = useState([]);
    const [updatedBlocks, setUpdatedBlocks] = useState([]);
    const [deletedBlocks, setDeletedBlocks] = useState([]);
    const [users,setUsers] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        if(location.state){
            const page = location.state;
            setTitle(page.title);
            setAuthor(page.author);
            if(page.publicationDate){
                setPublicationDate(page.publicationDate);
            }
            setBlocks(page.blocks);
            const newId = Math.max(...page.blocks.map((b) => b.id)) + 1;
            setBlockId(newId);
        }
        async function getAllUsers(){
            const users = await getUsers();
            setUsers(users);
        }
        if(props.user.role=='admin'){
            getAllUsers();
        }
    },[])

    const updateTitle = (ev) => {
        setTitle(ev.target.value);
    }

    const updateAuthor = (author) => {
        setAuthor(author);
    }

    const updatePublicationDate = (ev) => {
        setPublicationDate(ev.target.value);
    }

    const handleAddBlock = (type) => {
        const addedBlock = new Block(blockId,type,'',blocks.length+1);
        setBlocks((oldBlocks) => [...oldBlocks, addedBlock]);
        setAddedBlocks((oldBlocks) => [...oldBlocks,blockId]);
        setBlockId((oldId)=>oldId+1);
    }

    const moveUp = (pos) => {
        if(pos==1){
            return;
        }
        const up = blocks.filter((b) => b.position==pos);
        const down = blocks.filter((b) => b.position==pos-1);
        setBlocks((oldBlocks) => {
            const newBlocks = oldBlocks.map((b) => {
                if(b.position==pos){
                    return new Block(b.id,b.type,b.content,b.position-1);
                }
                if(b.position==pos-1){
                    return new Block(b.id,b.type,b.content,b.position+1);
                }
                return b;
            });
            newBlocks.sort((a,b) => a.position - b.position);
            return newBlocks;
        });
        const upEdited = updatedBlocks.filter((i) => i == up[0].id);
        const upAdded = addedBlocks.filter((i) => i == up[0].id);
        const downEdited = updatedBlocks.filter((i) => i == down[0].id);
        const downAdded = addedBlocks.filter((i) => i == down[0].id);
        if(upEdited.length==0 && upAdded.length==0){//modified but not yet in updated+added
            setUpdatedBlocks((oldBlocks) => [...oldBlocks,up[0].id])
        }
        if(downEdited.length==0 && downAdded.length==0){
            setUpdatedBlocks((oldBlocks) => [...oldBlocks,down[0].id])
        }
    }

    const moveDown = (pos) => {
        if(pos==blocks.length){
            return;
        }
        const up = blocks.filter((b) => b.position==pos+1);
        const down = blocks.filter((b) => b.position==pos);
        setBlocks((oldBlocks) => {
            const newBlocks = oldBlocks.map((b) => {
                if(b.position==pos){
                    return new Block(b.id,b.type,b.content,b.position+1);
                }
                if(b.position==pos+1){
                    return new Block(b.id,b.type,b.content,b.position-1);
                }
                return b;
            });
            newBlocks.sort((a,b) => a.position - b.position);
            return newBlocks;
        });
        const upEdited = updatedBlocks.filter((i) => i == up[0].id);
        const upAdded = addedBlocks.filter((i) => i == up[0].id);
        const downEdited = updatedBlocks.filter((i) => i == down[0].id);
        const downAdded = addedBlocks.filter((i) => i == down[0].id);
        if(upEdited.length==0 && upAdded.length==0){//modified but not yet in updated+added
            setUpdatedBlocks((oldBlocks) => [...oldBlocks,up[0].id])
        }
        if(downEdited.length==0 && downAdded.length==0){
            setUpdatedBlocks((oldBlocks) => [...oldBlocks,down[0].id])
        }
    }

    const removeBlock = (id) => {
        setBlocks((oldBlocks) => {
            const removedBlock = oldBlocks.filter((b) => b.id==id);
            const removedPosition = removedBlock[0].position;
            const newBlocks = oldBlocks.map((b) => b.position > removedPosition? new Block(b.id,b.type,b.content,b.position-1):b);
            return newBlocks.filter((b) => b.id!=id);
        });
        const newBlock = addedBlocks.filter((i) => i==id);
        if(newBlock.length!=0){
            setAddedBlocks((oldBlocks) => oldBlocks.filter((i) => i!=id));
        }
        else{
            setDeletedBlocks((oldBlocks) => [...oldBlocks,id]);
            const updatedBlock = updatedBlocks.filter((i) => i==id);
            if(updatedBlock.length!=0){
                setUpdatedBlocks((oldBlocks) => oldBlocks.filter((i) => i!=id));
            }
        }
    }

    const updateBlockContent = (id, content) => {
        setBlocks((oldBlocks) => oldBlocks.map((b) => b.id==id? new Block(b.id,b.type,content,b.position):b))
        const updatedBlock = updatedBlocks.filter((i) => i==id);
        const addedBlock = addedBlocks.filter((i) => i==id);
        if(updatedBlock.length == 0 && addedBlock.length==0){
            setUpdatedBlocks((oldBlocks) => [...oldBlocks,id])
        }//else=it was already added to updatedBlocks or addedBlocks, so we don't do anything
    }

    const handleEdit = async (title, author, publicationDate, blocks, addedBlocks, updatedBlocks, deletedBlocks) => {
        setWaiting(true);
        const dataCheck = (!publicationDate || location.state.publicationDate==publicationDate || publicationDate>=dayjs().format('YYYY-MM-DD'));
        const blockValidation = blockChecks(blocks);

        if (title.trim() == '' || !blockValidation || !dataCheck) {
            setWaiting(false);
            if(title.trim()==''){
                setTitleErr(true);
            }
            else{
              setTitleErr(false);
            }
            if(!blockValidation){
                setBlocksErr(true);
            }
            else{
                setBlocksErr(false);
            }
            if(!dataCheck){
                setDataErr(true);
            }
            else{
                setDataErr(false);
            }
        }
        else {
            await editPage(pageid,title,author,publicationDate,blocks,addedBlocks,updatedBlocks,deletedBlocks);            
            navigate('/backoffice');
            setWaiting(false);
        }
    }

    return (
        <>
        <Form>
            <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control value={title} onChange={(ev) => (updateTitle(ev))} type="text" name="title" placeholder='Enter title' />
            </Form.Group>
            {props.user.role=='admin'?
                <Form.Group controlId="author" className="mt-2 mb-2">
                <Form.Label>Author</Form.Label>
                <Dropdown>
                    <Dropdown.Toggle variant="secondary">
                    {author}
                    </Dropdown.Toggle>  
                    <Dropdown.Menu>
                    {users? users.map((u) => <Dropdown.Item key={u} onClick={() => updateAuthor(u)}>{u}</Dropdown.Item>):''}
                    </Dropdown.Menu>
                </Dropdown></Form.Group>:''
            }
            <Form.Group controlId='publicationDate'>
                <Form.Label>Publication date</Form.Label>
                <Form.Control value={publicationDate} onChange={(ev) => (updatePublicationDate(ev))} type="date" name="date" placeholder='Enter date' />
            </Form.Group>
            {blocks.map((b) => <AddedBlock key={b.id} block={b} moveUp={moveUp} moveDown={moveDown} maxPosition={blocks.length} removeBlock={removeBlock} updateBlockContent={updateBlockContent}/>)}
        </Form>
        <Row>
        <Dropdown className = 'mt-3 mb-3'>
            <Dropdown.Toggle variant="success" id="add-block">
                New block
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleAddBlock('header')}>Header</Dropdown.Item>
                <Dropdown.Item onClick={() => handleAddBlock('image')}>Image</Dropdown.Item>
                <Dropdown.Item onClick={() => handleAddBlock('paragraph')}>Paragraph</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </Row>
        {(titleErr || blocksErr || dataErr)?
        <Alert variant='danger'>
            <p>Before submitting you must solve the following error(s):</p>
            {titleErr? <p>Title can't be empty</p>:''}
            {blocksErr? <p>You must include at least one header and at least one between image and paragraph. Be sure that none of the provided blocks is empty</p>:''}
            {dataErr? <p>If modified, the publication date can't be earlier than today</p>:''}
        </Alert>:''
        }
        <Row className="d-flex justify-content-end justify-content-bottom mb-2">
            <Col xs={4}>
                <Button disabled={waiting} variant="success" onClick={() => {handleEdit(title,author,publicationDate,blocks,addedBlocks,updatedBlocks,deletedBlocks);}}>SAVE</Button>{' '}
                <Button variant="danger" onClick={() => {navigate('/backoffice')}}>CANCEL</Button>
            </Col>
        </Row>
        </>);
}


export {ShowPublicPages, ShowAllPages, ViewPage, AddPage, EditPage};