module.exports = function (app) {
    app.get('/authors/add', function (req, res) {
        res.render("authors/add.twig");
    });

    app.post('/authors/add', function (req, res) {
        let name = (req.body.name == null || req.body.name === "") ? "no enviado en la petición." : req.body.name;
        let group = (req.body.group == null || req.body.group === "") ? "no enviado en la petición." : req.body.group;
        let rol = (req.body.rol == null || req.body.rol === "") ? "no enviado en la petición." : req.body.rol;

        let response = "Autor agregado: " + name + "<br>"
            + " grupo: " + group + "<br>"
            + " rol: " + rol;

        res.send(response);
    });

    app.get('/authors', function (req, res) {
        let authorsList = [
            { name: "Adrián Gutiérrez", group: "Rib", rol: "cantante" },
            { name: "Fernando Remis", group: "Ven", rol: "trompetista" },
            { name: "Hugo Carbajales", group: "Veg", rol: "saxofonista" }
        ];

        res.render("authors/authors.twig", { authors: authorsList });
    });

    app.get('/author*', function (req, res) {
        res.redirect('/authors');
    });



};