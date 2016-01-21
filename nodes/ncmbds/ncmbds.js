module.exports = function(RED) {
    "use strict";
     var NCMB = require("ncmb");

    function NCMBDataStore(config) {

        RED.nodes.createNode(this,config);
        this.appkey = config.appkey;
        this.clikey = config.clikey;
        this.classname = config.classname;
        this.fieldname = config.fieldname;
        var node = this;

        this.on('input', function(msg) {
            var ncmb = new NCMB(this.appkey, this.clikey);
            var NCMBClass = ncmb.DataStore(this.classname);
            var ncmbClass = new NCMBClass();
            ncmbClass.set(this.fieldname, msg.payload);
            ncmbClass.save();
            node.send(msg);
        });
    }

    RED.nodes.registerType("ncmbds",NCMBDataStore);
}
