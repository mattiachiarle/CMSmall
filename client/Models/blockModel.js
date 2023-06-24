'use strict';

function Block(id, type, content, position){
    this.id=id;
    this.type=type;
    this.content=content;
    this.position=position;
}

const blockChecks = (blocks) => {
    const headers = blocks.filter((b) => b.type=='header');
    const images = blocks.filter((b) => b.type=='image');
    const paragraphs = blocks.filter((b) => b.type=='paragraph');

    if(headers.length==0){
        return false;
    }
    if(images.length==0 && paragraphs.length==0){
        return false;
    }
    const emptyBlock = blocks.filter((b) => (!b.content || (b.type!='image' && b.content.trim()=='')));
    if(emptyBlock.length){
        return false;
    }

    return true;
}

export {Block, blockChecks};