
exports.paginaInicial = (req, res) => {
    res.render('index', {
        titulo: `Este será o <span style= 'color: red;'>titulo da pagina</span>`,
        numeros: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    });
    return;


}
exports.recebiOformulario = (req, res) => {
    res.send(req.body);
    return;
}
