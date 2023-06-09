'use strict';

function Block(id, type, content, pageId, position){
    this.id=id;
    this.type=type;
    this.content=content;
    this.pageId=pageId;
    this.position=position;
}

exports.Block = Block;