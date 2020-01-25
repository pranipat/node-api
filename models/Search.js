'use strict';

const COLLECTION = process.env.DB_SEARCH_COLLECTION_NAME || 'oscarNominee';

class Search {

    constructor(req,res) {
       this.Collection = req.app.locals.db.collection(COLLECTION);
    }

    findByYear(year) {
        return new Promise((resolve,reject) => {
            this.Collection.find({"year":parseInt(year)}).toArray((err, result) => {
              if (err) {
                reject(err);
              } 
              resolve(result);
            })
        });
    }

}

module.exports = Search;