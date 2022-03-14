module.exports = (myFunc) => (req, res, next) => {
    return Promise.resolve(myFunc(req, res, next)).catch(next)
}