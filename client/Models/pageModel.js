'use strict';

import dayjs from 'dayjs';

function Page(id, title, author, creationDate, publicationDate, blocks, status){
    this.id=id;
    this.title=title;
    this.author=author;
    this.creationDate=dayjs(creationDate);
    this.publicationDate=publicationDate && dayjs(publicationDate);
    this.blocks=blocks;
    this.status=status;
}

export {Page};