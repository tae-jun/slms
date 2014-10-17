var lights = require('../mongo/lights');

function index(req, res) {
    lights.findAll(req, res);
}
exports.index = index;

exports.new = function (req, res) {
    res.send('new');
};

function create(req, res) {
    res.send('create');
}
exports.create = create;

function show(req, res) {
    res.send('show');
}
exports.show = show;

function edit(req, res) {
    res.send('edit');
}
exports.edit = edit;

function update(req, res) {
    res.send('update');
}
exports.update = update;

function destroy(req, res) {
    res.send('destroy');
}
exports.destroy = destroy;
//# sourceMappingURL=db.js.map
