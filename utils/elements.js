/*
 * Settings ui element generator
 */
class Elements{
    
    constructor(){
    }   
    
    //Tick / checkbox creator 
    static tickHtmlElement(setting, node){
        let a = "";
        if(setting.inc[node].enabled){
            a = "active"
        }
        let h = '<div class="btn checkbox ticklevicheck '+a+'" data-node="'+node+'"></div>';
        return h;
    }
    
    //Setting textbox element
    static textboxHtmlElement(setting, node){
        let a = "";
        if(setting.inc[node].hasOwnProperty('ia')){
            a = 'data-action="'+setting.inc[node].a+'"';
        }
        let h = '<input type="text" '+a+' class="settings_input_'+node+'">';  
        return h;
    }
    
    //Setting textbox element
    static numberboxHtmlElement(setting, node){
        let a = "";
        if(setting.inc[node].hasOwnProperty('ia')){
            a = 'data-action="'+setting.inc[node].a+'"';     
        }
        let h = '<input type="number" '+a+' class="settings_input_'+node+'" value="'+setting.inc[node].n+'">';  
        return h;
    }
    
    //Setting textbox element right
    static textboxRightHtmlElement(setting, node){
        let h = '<div></div><input type="text" class="settings_input_'+node+'">';  
        return h;
    }
    
    //Html button right side
    static buttonHtmlElement(setting, node){
        let h = '<div class="btn blue" data-action="'+setting.inc[node].a+'">'+setting.inc[node].bn+'</div>';  
        return h;
    }
    
    //button right
    static buttonRightHtmlElement(setting, node){
        let h = '<div></div><div class="btn blue" data-action="'+setting.inc[node].a+'">'+setting.inc[node].bn+'</div>';  
        return h;
    }    
    
    //Html spacer for settings
    static spacerHtmlElement(setting, node){
        let txt = setting.inc[node].name;
        let h = '<div class="textprimary">'+txt+'</div><div></div>';
        return h;
    }
    
    //Html Description for settings
    static descriptionHtmlElement(setting, node){
        let h = '<br><small class="textgrey">'+setting.inc[node].desc+'</small>';
        return h;
    }
    
    //Settings name element
    static settingsNameHtmlElement(setting, node){
        let s = "";
        if(setting.inc[node].hasOwnProperty("desc")){
            s = '<br><small class="textgrey">'+setting.inc[node].desc+'</small>';
        }
        let h = '<div class="divlevidiv'+node+'">'+setting.inc[node].name+s+'</div>';  
        return h;
    }
    
    //Main menu element
    static mainMenuHtmlElement(id, icon){
        let h = '<div id="'+id+'" class="btn border black" style="width: 16px;text-align: center;">'+icon+'</div>';
        return h;
    }
    
    //empty window panel element with header
    static windowPanelHtmlElement(cl, title){
        let h = '<div class="'+cl+' window panel-black cwindow" data-cl="'+cl+'" style="display:none;"><div class="titleframe titleframe_custom"><div class="textprimary title title_custom"><div>'+title+'</div></div><img src="/assets/ui/icons/cross.svg?v=35201089" class="btn black svgicon close_feature" data-feaureid=""></div><div class="slot" style=""><div class="wrapper"></div></div></div>';
        return h;
    }
    
    static smallPanelHtmlElement(cl){
        let h = '<small class="marg-top bar btn black grey svelte-1apx3f3 '+cl+'"><div class="textgreen"></div></small>';
        return h;
    }
}