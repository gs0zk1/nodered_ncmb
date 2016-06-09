module.exports = function(RED) {
    "use strict";
     var NCMB = require("ncmb");

    function NCMBDataStore(config) {

        RED.nodes.createNode(this,config);
        this.appkey = config.appkey;
        this.clikey = config.clikey;
        this.classname = config.classname;
        this.fieldname = config.fieldname;
        this.sendpush = config.sendpush;
        this.sendtimeopen = config.sendtimeopen;
        this.sendtimeclose = config.sendtimeclose;

        var node = this;

        this.on('input', function(msg) {
            //(0) NCMB初期化
            var ncmb = new NCMB(this.appkey, this.clikey);

            //(1) NCMBに開閉データを保存
            var NCMBClass = ncmb.DataStore(this.classname);
            var ncmbClass = new NCMBClass();
            ncmbClass.set(this.fieldname, msg.payload);
            ncmbClass.save();

　　　　　　　//(２) NCMBにプッシュ通知を登録
            if(this.sendpush == "yes") {
              var push = new ncmb.Push();
              if( (this.sendtimeopen == true) && (msg.payload = "0" )) {
                  if (this.sendtimeopen == true) {
                      push.set("immediateDeliveryFlag", true)
                          .set("message", "Door is opened now")
                          .set("target", ["ios", "android"]);
                      push.send();
                  } else if ( (this.sendtimeclose == true) && (msg.payload = "1")) {
                      push.set("immediateDeliveryFlag", true)
                          .set("message", "Door is closed now")
                          .set("target", ["ios", "android"]);
                      push.send();
                  }
              }
            }
            node.send(msg);
        });
    }

    RED.nodes.registerType("ncmbds",NCMBDataStore);
}
