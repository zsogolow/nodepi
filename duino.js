function Duino(id, type, action, extra) {
    this.id = id;
    this.type = type;
    this.action = action;
    this.extra = extra;
}

Duino.prototype = {
    id: {},
    type: {},
    action: {},
    extra: {},
}

module.exports = Duino;