define(function(require, exports, module) {
    main.consumes = [
        "Plugin", "ace"
    ];
    main.provides = ["rapture"];
    return main;

    function main(options, imports, register) {
      var Plugin = imports.Plugin;
      var ace = imports.ace;
        
      var plugin = new Plugin("Ajax.org", main.consumes);
        
      var loaded = false;
        
      function load() {
         if (loaded) {return false;}
        
         loaded = true;
        
         ace.defineSyntax({
            id: 'rapture',
            name: 'rapture',
            caption: 'Rapture',
            extensions: 'r|rh'
         });
      }
      
      /***** Lifecycle *****/
        
      plugin.on("load", function() {
         load();
      });
      
      plugin.on("enable", function() {
          
      });
      
      plugin.on("disable", function() {
          
      });
      
      plugin.on("unload", function() {
          loaded = false;
      });
      
      /***** Register and define API *****/
      
      plugin.freezePublicAPI({
          
      });
      
      register(null, {
          rapture: plugin
      });
      
      
        
    }
});