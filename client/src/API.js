import dayjs from 'dayjs';

const url = 'http://localhost:3000';

import { Page } from "../Models/pageModel";
import { Block } from "../Models/blockModel";

async function login(username, password){
    try{
        const response = await fetch(url+'/api/login',{
            credentials: 'include',
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                "username": username,
                "password" : password,
            })
        })
        if(response.ok){
            return await response.json();
        }
        else{
            if(response.status==401){
                throw new Error("Wrong username or password");
            }
            else{
                const message = await response.text();
                throw new Error(message);
            }
        }
    } catch(error){
        throw new Error(error.message);
    }
}

async function logout(){
    try{
        const response = await fetch(url+'/api/logout',{
            credentials: 'include',
            method : 'POST',
        })
        if(response.ok){
            return true;
        }
        else{
            const message = await response.text();
            throw new Error(message);
        }
    } catch(error){
        throw new Error(error.message);
    }
}

async function getSession(){
    try{
        const response = await fetch(url+'/api/session',{
            credentials: 'include',
            method : 'GET',
        })
        if(response.ok){
            const user = await response.json();
            return user;
        }
        else{
            return null;
        }
    } catch(error){
        throw new Error(error.message);
    }
}

async function getPublicPages(){
    try{
        const response = await fetch(url+'/api/pages/frontoffice',{
            method : 'GET',
        })
        if(response.ok){
            const pages = await response.json();
            pages.forEach((p) => {
                p.blocks = p.blocks.map((b) => new Block(b.id,b.type,b.content,b.position));
                p.blocks.sort((a,b) => a.position - b.position);
            });
            return pages.map((p) => new Page(p.id,p.title,p.author,p.creationDate,p.publicationDate,p.blocks,"published"));
        }
        else{
            const message = await response.text();
            throw new Error(message);
        }
    } catch(error){
        throw new Error(error.message);
    }
}

async function getAllPages(){
    try{
        const response = await fetch(url+'/api/pages/backoffice',{
            credentials: 'include',
            method : 'GET',
        })
        if(response.ok){
            const pages = await response.json();
            pages.forEach((p) => {
                p.blocks = p.blocks.map((b) => new Block(b.id,b.type,b.content,b.position))
                p.blocks.sort((a,b) => a.position - b.position);
            });
            return pages.map((p) => {
                let status;
                if(!p.publicationDate){
                    status="draft";
                }
                else if(p.publicationDate > dayjs().format('YYYY-MM-DD')){
                    status='scheduled';
                }
                else{
                    status="published";
                }
                return new Page(p.id,p.title,p.author,p.creationDate,p.publicationDate,p.blocks,status)
            });
        }
        else{
            const message = await response.text();
            throw new Error(message);
        }
    } catch(error){
        throw new Error(error.message);
    }
}

async function getPage(pageid){
    try{
        const response = await fetch(url+`/api/pages/${pageid}/view`,{
            credentials: 'include',
            method : 'GET',
        })
        if(response.ok){
            const page = await response.json();
            page.blocks = page.blocks.map((b) => new Block(b.id,b.type,b.content,b.position));
            page.blocks.sort((a,b) => a.position - b.position);
            let status;
            if(!page.publicationDate){
                status="draft";
            }
            else if(page.publicationDate > dayjs().format('YYYY-MM-DD')){
                status='scheduled';
            }
            else{
                status="published";
            }
            return new Page(page.id,page.title,page.author,page.creationDate,page.publicationDate,page.blocks,status);
        }
        else{
            const message = await response.text();
            throw new Error(message);
        }
    } catch(error){
        throw new Error(error.message);
    }
}

async function addPage(title,publicationDate,blocks){
    try{
        const response = await fetch(url+'/api/pages',{
            credentials: 'include',
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                "title": title,
                "publicationDate" : publicationDate,
                "blocks": blocks
            })
        })
        if(response.ok){
            return true;
        }
        else{
            const message = await response.text();
            throw new Error(message);
        }
    } catch(error){
        throw new Error(error.message);
    }
}

async function editPage(pageid, title, author, publicationDate, blocks, addedBlocks, updatedBlocks, deletedBlocks){
    try{
        const response = await fetch(url+`/api/pages/${pageid}`,{
            credentials: 'include',
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                "title": title,
                "author": author,
                "publicationDate" : publicationDate,
                "blocks" : blocks,
                "addedBlocks" : addedBlocks,
                "updatedBlocks": updatedBlocks,
                "deletedBlocks": deletedBlocks
            })
        })
        if(response.ok){
            return true;
        }
        else{
            const message = await response.text();
            throw new Error(message);
        }
    } catch(error){
        throw new Error(error.message);
    }
}

async function deletePage(pageid){
    try{
        const response = await fetch(url+`/api/pages/${pageid}`,{
            credentials: 'include',
            method : 'DELETE'
        })
        if(response.ok){
            return true;
        }
        else{
            const message = await response.text();
            throw new Error(message);
        }
    } catch(error){
        throw new Error(error.message);
    }
}

async function getWebsiteName(){
    try{
        const response = await fetch(url+'/api/website',{
            method : 'GET',
        })
        if(response.ok){
            const result = await response.json();
            return result.name;
        }
        else{
            const message = await response.text();
            throw new Error(message);
        }
    } catch(error){
        throw new Error(error.message);
    }
}

async function updateWebsiteName(name){
    try{
        const response = await fetch(url+`/api/website`,{
            credentials: 'include',
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                "name": name
            })
        })
        if(response.ok){
            return true;
        }
        else{
            const message = await response.text();
            throw new Error(message);
        }
    } catch(error){
        throw new Error(error.message);
    }
}

async function getUsers(){
    try{
        const response = await fetch(url+`/api/users`,{
            credentials: 'include',
            method : 'GET'
        })
        if(response.ok){
            let users = await response.json();
            users = users.map((u)=>u.username);
            return users;
        }
        else{
            const message = await response.text();
            throw new Error(message);
        }
    } catch(error){
        throw new Error(error.message);
    }
}

export {login, logout, getSession, getPublicPages, getAllPages, getPage, addPage, editPage, deletePage, getWebsiteName, updateWebsiteName, getUsers};