'use strict';

function Page(id, title, creatorId, creatorName, creationDate, publicationDate){
    this.id=id;
    this.title=title;
    this.creatorId=creatorId;
    this.creatorName=creatorName;
    this.creationDate=creationDate;
    this.publicationDate=publicationDate;
}

exports.Page = Page;