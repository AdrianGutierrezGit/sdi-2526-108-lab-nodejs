const {ObjectId} = require("mongodb");
module.exports = function(app, favoriteSongsRepository) {

    app.get("/songs/favorites", function (req, res) {
        const filter = {user: req.session.user};
        favoriteSongsRepository.getFavorites(filter, {})
            .then(songs => {
                let totalPrice = songs.reduce((total, song) => total + song.price, 0);
                let result = {
                    songs: songs,
                    totalPrice: totalPrice
                };
                res.render("songs/favorites.twig", result);
            })
            .catch(error => res.status(500).send(error));
    });

    app.post("/songs/favorites/add/:id", function (req, res) {
        const songId = new ObjectId(req.params.id);
        const filter = {songId: songId, user: req.session.user};

        favoriteSongsRepository.getFavorites(filter, {})
            .then(existing => {
                if (existing.length > 0) {
                    return res.redirect("/songs/favorites");
                }
                const favourite = {
                    songId: songId,
                    date: new Date(),
                    price: parseFloat(req.body.price),
                    title: req.body.title,
                    user: req.session.user
                };
                favoriteSongsRepository.insertFavourite(favourite, function (result) {
                    if (result.error) {
                        res.status(500).send(result.error);
                    } else {
                        res.redirect("/songs/favorites");
                    }
                });
            })
            .catch(error => res.status(500).send(error));
    });

    app.get("/songs/favorites/delete/:id", function (req, res) {
        const filter = {songId: new ObjectId(req.params.id)};
        const options = {};
        favoriteSongsRepository.deleteFavourite(filter, options)
            .then(() => res.redirect("/songs/favorites"))
            .catch(error => res.status(500).send(error));
    });

};