/*
 * The Character class is for small utils,
 * concerning the character and small data.
 */
class Character{    
    constuctor(){
        
    }
    
    //Get character type/class from image node
    static getCharacterType(srcs){
        let key = "5";
        if(srcs.includes('mobpower')){
            key = "5";
        }else{
            let lsr = srcs.split("/").pop();
            key = lsr.charAt(0);
        }
        let text = default_colordata[key].name;
        return {key:parseInt(key),type:text};
    }
    
     //Get characters name for storage
    static getCharacterName(){
        let n = $("body").find('#ufplayer').find(default_uidata.cLib.charNameClass);
        let name = $(n[0]).text();
        return name;
    }
    
     //Get characters level for storage
    static getMyLevel(){
        let lvl = 0;
        let n = $("body").find(default_uidata.cLib.charNameClass);
        for(let node of n){
            if(node.innerText.includes("Lv.")){                
                lvl = node.innerText.split(" ").pop();
                break;
            }
        }        
        return parseInt(lvl);
    }
    
    //Get faction from image node
    static getFaction(srcs){
        let lsr = srcs.split("/").pop();
        let key = lsr.charAt(0);
        let faction = "monster";
        switch(parseInt(key)){
            case 0:
                faction = "vanguard";
                break;
            case 1:
                faction = "bloodlust";
                break;
            case 2:
                faction = "monster";
                break;
        }
        return {key:parseInt(key),faction:faction};
    }
    
    //Add new character to storage.
    static storeCharacterData(name){
        if(state.mod.characters.hasOwnProperty(name)===false){            
            state.mod.characters[name] = {};
            state.mod.characters[name].class = Character.getCharacterType($("#"+default_uidata.cLib.ufPlayerId).find(".iconcontainer img.icon").attr('src'));
            state.mod.characters[name].lvl = Character.getMyLevel();    
        }else{
            state.mod.characters[name].lvl = Character.getMyLevel();
        }
        currentChar = name;
        Stateless.saveStorage();
    }
    
}