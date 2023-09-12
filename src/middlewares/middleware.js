exports.middlewareGlobal = (req,res,next) => {
    res.locals.variavelLocal = 'Este o valor da variavel local';
    next();
}
exports.outroMiddleware = (req,res,next) => {
    next();
}