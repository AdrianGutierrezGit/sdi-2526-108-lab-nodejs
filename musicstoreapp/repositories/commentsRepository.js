module.exports = {
    mongoClient: null,
    app: null,
    database: "musicStore",
    collectionName: "comments",
    init: function (app, dbClient) {
        this.dbClient = dbClient;
        this.app = app;
    },
    getComments: async function (filter, options) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const commentsCollection = database.collection(this.collectionName);
            return await commentsCollection.find(filter, options).toArray();
        } catch (error) {
            throw (error);
        }
    },
    insertComment: function (comment, callbackFunction) {
        this.dbClient.connect()
            .then(() => {
                const database = this.dbClient.db(this.database);
                const commentsCollection = database.collection(this.collectionName);
                commentsCollection.insertOne(comment)
                    .then(result => callbackFunction({songId: result.insertedId}))
                    .then(() => this.dbClient.close())
                    .catch(err => callbackFunction({error: err.message}));
            })
            .catch(err => callbackFunction({error: err.message}))
    }
};