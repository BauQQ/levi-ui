/*
 * Custom settings system has been requested
 * and will be implemented in this class
 */
class Settings extends Muto{
    
    //Settings class constructor
    constructor(){
        super();
    }
    
    //default hook for muto
    static hook(){
        
    }

    //Reset the ui through settings - TODO
    static doResetUi(){
        //Todo - after ui editor
        state.mod.characters[currentChar].ui = default_uidata.interface.elements;     
        Stateless.saveStorage();
        window.location.reload();
    }
    
    //Fully rest Levi UI
    static doResetLevi(){
       Stateless.resetTodefault();
       Stateless.saveStorage();
       window.location.reload();
    }
    
    //Remove ignored user from the list
    static removeIgnoredUser(event){
        let name = $(event.target).data("name");
        $(event.target).remove();
        $(".div_ignoreBTN_"+name).remove();       
        Chat.unblockUserByName(name);
    }
    
    //Delegation for ignore button
    static ignoreButtonDeligation(panel){
        $($(panel)[0]).undelegate(".ignoreBTN", "click");
        $($(panel)[0]).delegate(".ignoreBTN", "click", function(event) {
            Settings.removeIgnoredUser(event);
        });      
    }
    
    //Button action ins settings delegation
    static buttonDeligation(panel, node, setting){
        $($(panel)[0]).undelegate("div[data-action='"+setting.inc[node].a+"']", "click");
        $($(panel)[0]).delegate("div[data-action='"+setting.inc[node].a+"']", "click", function(event) {
            Settings[setting.inc[node].a](event);
        });      
    }
    
    //Input reactive delegation
    static inputDeligation(panel, node, setting){
        $("[data-action='"+setting.inc[node].a+"']").off('input propertychange paste');
        $("[data-action='"+setting.inc[node].a+"']").on('input propertychange paste', function(event) {
            Settings[setting.inc[node].a](event, node);
        });      
    }
    
    //Get all blocked users
    static getBlockedUsers(){
        let panel = $('.'+default_uidata.cLib.leviSettingBase).find('.settings');
        $(panel).empty();           
        let del = false;
        if(typeof state.userlistings.fblocked !== 'undefined' && state.userlistings.fblocked.length > 0){
            for(let buser of state.userlistings.fblocked){
                if(buser){                         
                    let h = '<div class="div_ignoreBTN_'+buser+'">'+buser+'</div><div class="btn purp ignoreBTN" data-name="'+buser+'">Unblock</div>';        
                    $(panel).append(h); 
                    del = true;
                }
            }
        }
        
        if(del){
            Settings.ignoreButtonDeligation(panel);            
        }else{            
           let h = '<div>Nothing here</div>';        
           $(panel).append(h); 
        }
    }   
    
    //React to the setting change action for quicklinks
    static quicklinksAction(){
        Ui.quicklinksDisplay();
    }
    
    //React to the setting change action for lock ui
    static lockUiAction(){
        Feature.runDraggable();
    }
    
    //React to the setting change action for lock ui
    static roundmapAction(){
        Ui.roundMap();
    }
    
    //Export feature action
    static exportUiAction(){
        Feature.exportUi();
    }
    
    //import feature action
    static importUiAction(){
        let inp = $('.settings_input_import').val();        
        Feature.importUi(inp);
    }
    
    //Save party frame row changes
    static doSavePartyFrameRow(event){
        let inp = parseInt($(event.target).val());
        if(inp!==null && !isNaN(inp) && typeof inp == 'number'){
            state.mod.characters[currentChar].settings.leviui.inc.partyframerow.n = inp;
            Stateless.saveStorage();  
            Ui.partyFrameRows();
        }        
    }
    
    //Handler for when ticking has been done
    static settingTickHandler(node){
        let data = $(node).data('node');        
        if($(node).hasClass('active')){
            state.mod.characters[currentChar].settings.leviui.inc[data].enabled = false;
            $(node).removeClass('active');
        }else{
            state.mod.characters[currentChar].settings.leviui.inc[data].enabled = true;
            $(node).addClass('active');
        }
        if(state.mod.characters[currentChar].settings.leviui.inc[data].hasOwnProperty('a')){
            let a = state.mod.characters[currentChar].settings.leviui.inc[data].a;
            Settings[a]();
        }
        Stateless.saveStorage();
    }
    
    //Checking the INC property
    static checkINC(setting){
        let panel = $('.'+default_uidata.cLib.leviSettingBase).find('.settings');
        if(setting!='undefined' && setting!=null){
            if(setting.hasOwnProperty("inc")){
                for(let node in setting.inc){
                    if(Array.isArray(setting.inc[node].f)){
                        for(let entry in setting.inc[node].f){
                            if(ElementGenerator.hasOwnProperty(setting.inc[node].f[entry])){      
                                $(panel).append(ElementGenerator[setting.inc[node].f[entry]](setting, node));
                            }
                            if(setting.inc[node].hasOwnProperty('bn')){
                                Settings.buttonDeligation(panel, node, setting);
                            }
                            if(setting.inc[node].hasOwnProperty('ia')){
                                Settings.inputDeligation(panel, node, setting);
                            }
                        }
                    }else{
                        if(ElementGenerator.hasOwnProperty(setting.inc[node].f)){
                            $(panel).append(ElementGenerator[setting.inc[node].f](setting, node));
                        }
                    }
                }
                
            }            
            Settings.tickDelegators();
        }
    }
    
    //Checking the F property
    static checkFCm(setting){
        if(setting!='undefined' && setting!=null){
            if(setting.hasOwnProperty("f") && !Array.isArray(setting.f)){
                let fnc = setting.f;     
                Settings[fnc]();
            }
        }
    }
    
    //Generate Menu
    static menu(){
        for(let pnl in state.mod.characters[currentChar].settings){
            let BTN = '<div class="choice ">'+state.mod.characters[currentChar].settings[pnl].name+'</div>';
            $($(default_uidata.cLib.settingsMenu)[0]).append(BTN);
        }        
        Settings.menuDelegators();
        Settings.generateBasePanels();
    }    
    
    //Generate base panel for settings
    static generateBasePanels(){
        if(!$('.'+default_uidata.cLib.leviSettingBase).length){
             let h = '<div class="menu panel-black '+default_uidata.cLib.leviSettingBase+'" style="display:none;"><h3 class="textprimary">Levi UI</h3><div class="settings"></div></div>'
            $(default_uidata.cLib.settingsBase).append(h);
        }
    }
    
    //Generate current panel
    static panel(event, pnl, r){
        let panel = $(default_uidata.cLib.settingsPanel)[0];
        let leviPanel = $('.'+default_uidata.cLib.leviSettingBase)[0];     
        let setting = state.mod.characters[currentChar].settings[pnl];
        if(r===1){            
            Settings.handleMenuActive(event.target);
            let spanel = $('.'+default_uidata.cLib.leviSettingBase).find('.settings');
            $(spanel).empty(); 
            
            $(panel).hide();
            $(leviPanel).show();
            
            $(leviPanel).find('.textprimary:first-child').text(setting.name);
            Settings.checkFCm(setting);
            Settings.checkINC(setting);
            
            lastPanel=pnl;
        }else if(r===2){
            Settings.checkFCm(setting);
        }else{            
            Settings.handleMenuActive(event.target);
            for(let spnl in state.mod.characters[currentChar].settings){
                if(lastPanel===spnl){
                    $(leviPanel).hide();
                    $(panel).show();
                }
            }
        }
    }
    
    //Menu swapping
    static handleMenuActive(target){        
        $('.choice.active').removeClass('active');
        $(target).addClass("active");
    }
    
    //Butten handler
    static buttonHandle(event){
        let p = event.target.innerText.replace(/\s/g, '').toLowerCase();
        if(state.mod.characters[currentChar].settings.hasOwnProperty(p)){
            Settings.panel(event, p, state.mod.characters[currentChar].settings[p].pnlr);
        }else{
            Settings.panel(event, p, 3);
        }
    }
    
    //Show / enable levi settings
    static show(){        
        if($(default_uidata.cLib.settingsWindow)[0]){  
            Settings.menu();
        }
    }
    
    //Tick Delegator
    static tickDelegators(){   
        $('.layout').undelegate(".ticklevicheck", "click");
        $('.layout').delegate(".ticklevicheck", "click", function(event) {
            Settings.settingTickHandler(event.target);
        });  
    }
    
    //Menu button delegator
    static menuDelegators(){   
        $($(default_uidata.cLib.settingsMenu)[0]).undelegate(".choice", "click");
        $($(default_uidata.cLib.settingsMenu)[0]).delegate(".choice", "click", function(event) {
            Settings.buttonHandle(event);
        });  
    }
    
    //Enable syscog button
    static delegators(){
        $("body").undelegate(default_uidata.cLib.settingBTN, "click");
        $("body").delegate(default_uidata.cLib.settingBTN, "click", function(event) {
            Settings.show();
        }); 
        Settings.menuDelegators();
    }
}
