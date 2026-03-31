const {ObjectId} = require("mongodb");
module.exports = function (app, commentsRepository) {
    app.post('/comments/:song_id', function (req, res) {
        if (!req.session.user) {
            return res.send("Error: debes estar logueado para añadir un comentario.");
        }

        const comment = {
            songId: new ObjectId(req.params.song_id),
            text: req.body.text,
            author: req.session.user
        };

        commentsRepository.insertComment(comment, function (result) {
            if (result.error) {
                res.status(500).send(result.error);
            } else {
                res.redirect("/songs/" + req.params.song_id);
            }
        });
    });
};