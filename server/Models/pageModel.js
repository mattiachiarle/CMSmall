'use strict';

function Page(id, title, creatorId, creatorName, creationDate, publicationDate){
    this.id=id;
    this.title=title;
    this.creatorId=creatorId;
    this.creatorName=creatorName;
    this.creationDate=creationDate;
    this.publicationDate=publicationDate;
}

const getCompletePage =  (page, blocks) => {
    try{
        blocks = blocks.map((b) => ({
            id:b.id,
            type:b.type,
            content:b.content,
            position:b.position
        }));
        return ({
            id:page.id,
            title:page.title,
            author:page.creatorUsername,
            creationDate:page.creationDate,
            publicationDate:page.publicationDate,
            blocks:blocks
        })
    }
    catch(error){
        throw error;
    }
}

const checkPage = (blocks) => {
    let countHeader=0;
    let countParagraph=0;
    let countImage=0;
    let error = false;
    let wrongPosition = false;
    let prev = -1;

    blocks.sort((a,b) => a.position - b.position);

    for(const b of blocks){
        if(b.type=='header'){
            countHeader++;
        }
        if(b.type=='paragraph'){
            countParagraph++;
        }
        if(b.type=='image'){
            countImage++;
        }
        if(b.type!='image' && b.content.trim()==''){
            error=true;
        }
        if(b.type=='image' && b.content<1 || b.content>4){
            error=true;
        }
        if(prev==-1){
            prev=b.position;
        }
        else{
            if(prev!=b.position-1){
                wrongPosition=true;
            }
            prev=b.position;
        }
    }

    if(error){
        return {correct:false, cause:"You can't create an empty block"}
    }
    if(countHeader==0){
        return {correct:false, cause:"The page must have at least one header"}
    }
    if(countImage==0 && countParagraph==0){
        return {correct:false, cause:"The page must have at least one image or one paragraph"}
    }
    if(wrongPosition){
        return {correct:false, cause:"The positions of the blocks are not correct"}
    }

    return {correct: true}
}

exports.Page = Page;
exports.getCompletePage = getCompletePage;
exports.checkPage = checkPage;