module.exports = {
    mongoClient: null,
    app: null,
    database: "musicStore",
    collectionName: "songs",
    init: function (app, dbClient) {
        this.dbClient = dbClient;
        this.app = app;
    },
    getPurchases: async function (filter, options) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const purchasesCollection = database.collection('purchases');
            const purchases = await purchasesCollection.find(filter, options).toArray();
            return purchases;
        } catch (error) {
            throw (error);
        }
    },
    buySong: async function (shop) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const purchasesCollection = database.collection('purchases');
            return await purchasesCollection.insertOne(shop);
        } catch (error) {
            throw (error);
        }
    },
    deleteSong: async function (filter, options) {
        try { await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const songsCollection = database.collection(this.collectionName);
            return await songsCollection.deleteOne(filter, options);
        } catch (error) {
            throw (error);
        }
    },
    updateSong: async function(newSong, filter, options) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const songsCollection = database.collection(this.collectionName);
            const result = await songsCollection.updateOne(filter, {$set: newSong}, options);
            return result;
        } catch (error) {
            throw (error);
        }
    },
    getSongsPg: async function (filter, options, page) {
        try {
            const limit = 4;
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const songsCollection = database.collection(this.collectionName);
            const songsCollectionCount = await songsCollection.count();
            const cursor = songsCollection.find(filter, options).skip((page - 1) * limit).limit(limit);
            const songs = await cursor.toArray();
            return {songs: songs, total: songsCollectionCount};
        } catch (error) {
            throw (error);
        }
    },
    getSongs: async function (filter, options) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const songsCollection = database.collection(this.collectionName);
            const songs = await songsCollection.find(filter, options).toArray();
            return songs;
        } catch (error) {
            throw (error);
        }
    },
    findSong: async function (filter, options) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const songsCollection = database.collection(this.collectionName);
            return await songsCollection.findOne(filter, options);
        } catch (error) {
            throw (error);
        }
    },
    insertSong: function (song, callbackFunction) {
        this.dbClient.connect()
            .then(() => {
                const database = this.dbClient.db(this.database);
                const songsCollection = database.collection(this.collectionName);
                songsCollection.insertOne(song)
                    .then(result => callbackFunction({songId: result.insertedId}))
                    .then(() => this.dbClient.close())
                    .catch(err => callbackFunction({error: err.message}));
            })
            .catch(err => callbackFunction({error: err.message}))
    }
}