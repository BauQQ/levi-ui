/*
 * The Mod class is our startup class,
 * everything with initialization etc.
 * goes throught there
 */
class Mod{
    constructor(){
        
    }    
    
    static initialization(mutations){  
        let f = false;        
        for (let mutation of mutations) {
            if(mutation.removedNodes.length>0){ 
                for(let node of mutation.removedNodes){
                    if($(node).hasClass(default_uidata.cLib.initClass)){       
                        $(default_uidata.cLib.chatId).addClass(default_uidata.cLib.chatClass); 
                        Character.storeCharacterData(Character.getCharacterName());
                        currentChar = Character.getCharacterName(); 
                        if(ssInterval!=null){
                            clearInterval(ssInterval);
                            ssInterval = null;  
                            ssTimer = false;
                        }                     
                        if(!state.mod.characters[currentChar].hasOwnProperty('ui')){
                            state.mod.characters[currentChar].ui = default_uidata.interface.elements;     
                            Stateless.saveStorage();
                        }
                        
                        if(!state.mod.characters[currentChar].hasOwnProperty('settings')){
                            state.mod.characters[currentChar].settings = default_settings;     
                            Stateless.saveStorage();
                        }  
                        Feature.run();
                        
                        //Chat stuff
                        Chat.inject(" is running version "+state.mod.version);
                        Chat.delegators();
                        
                        //Settings stuff
                        Settings.show();
                        Settings.delegators();
                        
                        Ui.run();
                        
                        //This muto is used for some of the chat features. Mainly user blocking 
                        var objConfig = {childList: true, subtree : false, attributes: false, characterData : false};
                        Muto.create("chat", Chat.hook, '.'+default_uidata.cLib.chatClass, objConfig);
                        
                        Muto.destroy("init");
                        f = true;
                        break;
                    }
                }
                if(f){
                    break;
                }
            }
        }
    }
    
    run(){
        var objConfig = {childList: true, subtree: true, attributes: false, characterData: false};                
        Muto.create("init", Mod.initialization, 'body', objConfig);
        
        $("html").undelegate("body", "DOMNodeInserted");
        $("html").delegate("body", "DOMNodeInserted", function(event){
            if(event.target.tagName =='DIV' && $(event.target).hasClass(default_uidata.cLib.initClass)){  
                //Startup Levi UI mod. 
                var objConfig = {childList: true, subtree: true, attributes: false, characterData: false};                
                Muto.create("init", Mod.initialization, 'body', objConfig);
            }
        });
    }
}