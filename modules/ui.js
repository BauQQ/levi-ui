/*
 * The Ui class is for everything related to movement
 * editings that isn't setting.
 */
class Ui extends Muto{
    
    //Chat class constructor
    constructor(){
        super();
    }
    
    //Default hook - don't use
    static hook(mutations){
        for (let mutation of mutations) {
            for(let node of mutation.addedNodes){
//                console.log(node);
            }            
        }
    }
    
    //Player party hook
    static playerPartyFrameHook(mutations){
        for(let mutation of mutations){
            if(mutation.type==="attributes"){   
                let node = mutation.target;
                let name = $(node).closest('.grid.left.svelte-1rrmvqb').data('pnu');
                if($(node).hasClass('bghealth')){
                    if(currentParty.hasOwnProperty(name)){
                         $(node).addClass(currentParty[name].gradient);
                    }else{                       
                        let r = Character.getCharacterType($(node).closest('.partyframes').find('.iconcontainer img.icon').attr('src'));
                        $(node).addClass(default_colordata[r.key].gradient); 
                    }
                    break;
                    return;
                }
            }           
        }
    }
    
    //Party hook enabler
    static enablePlayerPartyFrameHooker(node, pnu){
        var objConfig = {childList: false, subtree : false, attributes: true, attributeFilter: ['class'], characterData : false};
        Muto.create("party_"+pnu, Ui.playerPartyFrameHook, $(node).find('.progressBar'), objConfig);   
    }
    
    //Hook destroyer for party
    static deactivatePlayerPartyHooker(pnu){
        Muto.destroy("party_"+pnu);
    }
    
    //Party frame tidy hook
    static partyFrameHook(mutations){
        for (let mutation of mutations){ 
            for(let node of mutation.addedNodes){             
                if($(node).hasClass(default_uidata.cLib.partyMemClass)){    
                    let name = $(node).find(".bar .left").text();
                    node.setAttribute("data-pnu", name);    
                    if(currentParty.hasOwnProperty(name)){
                        $(node).find(".bar .bghealth").addClass(currentParty[name].gradient);
                    }else{                        
                        let r = Character.getCharacterType($(node).find('.iconcontainer img.icon').attr('src'));
                        $(node).find(".bar .bghealth").addClass(default_colordata[r.key].gradient);
                        currentParty[name] = {};
                        currentParty[name].gradient = default_colordata[r.key].gradient;
                    }                      
                    Ui.enablePlayerPartyFrameHooker(node, name);
                }
            }
            for(let node of mutation.removedNodes){
                if(typeof $(node).data('pnu')!== "undefined"){
                    let pnu = $(node).data('pnu');
                    if(currentParty.hasOwnProperty(pnu)){
                        delete currentParty[name];
                    }
                    Ui.deactivatePlayerPartyHooker(pnu);
                }
            }            
        }
    }
    
    //Partyframe row customizer
    static partyFrameRows(){
        if(state.mod.characters[currentChar].settings.leviui.inc.hasOwnProperty('partyframerow')){
            let r = state.mod.characters[currentChar].settings.leviui.inc.partyframerow.n;
            if(parseInt(r)>0){
                 $("."+default_uidata.cLib.partyFrameClass).css("grid-template-columns", "repeat("+r+", auto)");
            }           
        }
    }
    
    //Party frame tidy plate
    static partyFrameTidy(){
        let el = $("."+default_uidata.cLib.partyFrameClass);
        for(let node of $(el).children()){
            let name = $(node).find(".bar .left").text();
            node.setAttribute("data-pnu", name);
            if(currentParty.hasOwnProperty(name)){                 
                $(node).find(".bar .bghealth").addClass(currentParty[name].gradient);
            }else{                 
                let r = Character.getCharacterType($(node).find('.iconcontainer img.icon').attr('src'));
                $(node).find(".bar .bghealth").addClass(default_colordata[r.key].gradient); 
                currentParty[name] = {};
                currentParty[name].gradient = default_colordata[r.key].gradient;
            }
            Ui.enablePlayerPartyFrameHooker(node, name);
        }
    }    
    
    //Tidy target color changer
    static targetTidyChange(key){
        $("#"+default_uidata.cLib.ufTargetId+" .bar .bgmana").addClass("mana_gradient");
        let bar = $("#"+default_uidata.cLib.ufTargetId+" .bars").children().first().children().first();
        let name = $(bar).children().first().text();
        if(name!=lastTarget.name){
            $(bar).removeClass(default_colordata[lastTarget.key].gradient);
            $(bar).addClass(default_colordata[key].gradient);  
            lastTarget.name = name;
            lastTarget.key = key;
        }
    }
    
    //Tidyplates - target
    static targetTidy(mutations){
        if($("#"+default_uidata.cLib.ufTargetId)[0]){
            if(state.mod.characters[currentChar].ui!==null && state.mod.characters[currentChar].hasOwnProperty('ui') && state.mod.characters[currentChar].ui.hasOwnProperty('targethp') && state.mod.characters[currentChar].ui.targethp.e){
                $(state.mod.characters[currentChar].ui.targethp.c).css({position:"absolute", 
                    top: state.mod.characters[currentChar].ui.targethp.top+'px', 
                    left: state.mod.characters[currentChar].ui.targethp.left+'px'})
            }
            let r = Character.getCharacterType($("#"+default_uidata.cLib.ufTargetId+" .iconcontainer img.icon").attr('src'));            
            Ui.targetTidyChange(r.key);                     
        }
    }
    
    //Tidyplates - Player
    static playerTidy(){
        if($("#"+default_uidata.cLib.ufPlayerId+" .iconcontainer")[0]){
            let r = Character.getCharacterType($("#"+default_uidata.cLib.ufPlayerId+" .iconcontainer img.icon").attr('src'));
            $("#"+default_uidata.cLib.ufPlayerId+" .bar .bghealth").addClass(default_colordata[r.key].gradient);            
            $("#"+default_uidata.cLib.ufPlayerId+" .bar .bgmana").addClass("mana_gradient");
        }
    }
    
    //Resize function for the skillbar
    static skillbarResize(){
        let i = Math.floor($("#"+default_uidata.cLib.skillbarId).children().length/2);
        $("#"+default_uidata.cLib.skillbarId).css("grid-template-columns", "repeat("+i+", auto)");
    }
    
    //Quicklinks display or not
    static quicklinksDisplay(){
        if(state.mod.characters[currentChar].settings.leviui.inc.quicklinks.enabled){  
            $('.'+default_uidata.cLib.quicklinksClass).show();
        }else{
            $('.'+default_uidata.cLib.quicklinksClass).hide();            
        }
    }
          
    //Map resize function, check about position later.
    static mapResize(){
        let el = $('.'+default_uidata.cLib.mapClass);
        state.mod.characters[currentChar].settings.leviui.inc.map.left = $(el).offset().left;
        state.mod.characters[currentChar].settings.leviui.inc.map.top = $(el).offset().top;
        Stateless.saveStorage();
        let canvas = $(default_uidata.cLib.minimapCanvas)[0];        
        let resizeObserver = new ResizeObserver(() =>{  
                if(canvas.height>200 || canvas.width>200){
                    $(el).css({width:canvas.width, height:canvas.height});
                    if(state.mod.characters[currentChar].settings.leviui.inc.map.enabled){  
                        let nt = Math.max(0,(($(window).height() - $(el).height()) / 2 ) + $(window).scrollTop());
                        let nl = Math.max(0,(($(window).width() - $(el).width()) / 2 ) + $(window).scrollLeft());                       
                        $(el).offset({top:nt, left:nl});
                    }
                    
                    if(state.mod.characters[currentChar].settings.leviui.inc.roundmap.enabled){                    
                        $(el).css('border-radius', '0px');
                        $(canvas).css('border-radius', '0px');
                    }
                }else{   
                    $(el).css({width:canvas.width, height:canvas.height});
                    if(state.mod.characters[currentChar].settings.leviui.inc.map.enabled){  
                        $(el).offset({top:state.mod.characters[currentChar].settings.leviui.inc.map.top, left:state.mod.characters[currentChar].settings.leviui.inc.map.left});
                    }
                    if(state.mod.characters[currentChar].settings.leviui.inc.roundmap.enabled){ 
                        $(el).css('border-radius', '100px');
                        $(canvas).css('border-radius', '100px');
                    }
                }
        });        
        resizeObserver.observe(document.querySelector(default_uidata.cLib.minimapCanvas));
    }  
    
    //Internal tidy target plates runner
    static targetTidyRun(mutations){         
        let objConfig = {childList: false, subtree : true, attributes: true, characterData : true};
        if(mutations!==null){
            for (let mutation of mutations) {
                for(let node of mutation.addedNodes){
                    if($(node).is("#"+default_uidata.cLib.ufTargetId)){    
                        Ui.targetTidy(null);
                        Muto.create("targetTidyWatcher", Ui.targetTidy, "#"+default_uidata.cLib.ufTargetId+" .left", objConfig); 
                    }
                }    

                for(let node of mutation.removedNodes){
                    if($(node).is("#"+default_uidata.cLib.ufTargetId)){
                        Muto.destroy("targetTidyWatcher");
                    }
                }
            }
        }else{
            if($("#"+default_uidata.cLib.ufTargetId)[0]){
                Ui.targetTidy(null);
                Muto.create("targetTidyWatcher", Ui.targetTidy, "#"+default_uidata.cLib.ufTargetId+" .left", objConfig); 
            }
        }         
    }
    
    //Simple round map
    static roundMap(){
        let el = $('.'+default_uidata.cLib.mapClass);
        let canvas = $(el).find('canvas');
        if(state.mod.characters[currentChar].settings.leviui.inc.roundmap.enabled){ 
            $(el).css('border-radius', '100px');
            $(canvas).css('border-radius', '100px');
        }else{
            $(el).css('border-radius', '0px');
            $(canvas).css('border-radius', '0px');
        }
    }
    
    //Ui window muto hook
    static windowHook(mutations){
        let found = false;
        for (let mutation of mutations) {
            for(let node of mutation.addedNodes){
                if(state.mod.characters[currentChar].hasOwnProperty('ui')){
                    for(let element in state.mod.characters[currentChar].ui){
                        if(state.mod.characters[currentChar].ui[element].hasOwnProperty('cr') && state.mod.characters[currentChar].ui[element].cr){                            
                            let cArg = state.mod.characters[currentChar].ui[element].c.split('.');
                            let elFound = false;
                            for(let cls of cArg){
                                if($(node).hasClass(cls)){
                                    elFound = true;
                                }else{
                                    elFound = false;
                                }
                            }
                            
                            if(elFound){
                                if(state.mod.characters[currentChar].ui[element].hasOwnProperty('a') && state.mod.characters[currentChar].ui[element].a!==null){
                                    let a = state.mod.characters[currentChar].ui[element].a;
                                    Ui[a]();
                                }
                                found = true;
                                break;
                            }
                            
                        }
                    }
                }
                if(found){
                    break;
                }
            }
            if(found){
                break;
            }
        }
        if(found){            
            Feature.runDraggable();
            return;
        }
    }
    
    //Regenerate new virtual bag for character
    static regenerateNewBag(){
        state.mod.characters[currentChar].bag = {};
        let slotcontainer = $($(default_uidata.cLib.inventoryO)[0]).find('.slotcontainer').children();
        for(let slot of slotcontainer){
            state.mod.characters[currentChar].bag[slot.id] = {locked:false, item:{}};           
        }
    }
    
    //Lock bag slots.
    static runSlotBlocker(){
        if(!state.mod.characters[currentChar].hasOwnProperty('bag')){
            Ui.regenerateNewBag();
        }   
        
        for(let slot in state.mod.characters[currentChar].bag){
            let st = state.mod.characters[currentChar].bag[slot];
            if(st.locked){
                Ui.lockInventorySlot(slot);
            }
        }
        
        var objConfig = {childList: false, subtree : false, attributes: true, characterData : false};
        Muto.create("inventoryReactHook", Ui.inventoryReactionHook, default_uidata.cLib.inventoryO, objConfig);
    }
    
    static inventoryReactionHook(mutations){
        if($(default_uidata.cLib.inventoryO).is(":visible")){   
            for(let slot in state.mod.characters[currentChar].bag){
                let st = state.mod.characters[currentChar].bag[slot];
                if(st.locked){
                    Ui.lockInventorySlot(slot);
                }
            }
        }
    }
    
    //Inventory lock slot
    static lockInventorySlot(bid){
        if(!state.mod.characters[currentChar].bag[bid].locked){            
            state.mod.characters[currentChar].bag[bid].locked = true;
            Stateless.saveStorage();
        }          
        let sp = $("#"+bid).position();
        if($("#"+bid).parent().find(".lockedInvSlot[data-slot='"+bid+"']")[0]){
            if($(default_uidata.cLib.inventoryO).is(":visible")){      
                $("#"+bid).parent().find(".lockedInvSlot[data-slot='"+bid+"']").css({top:sp.top,left:sp.left});
            }
        }else{            
            let l = '<div class="lockedInvSlot" style="left:'+sp.left+'px; top:'+sp.top+'px;" data-slot="'+bid+'"></div>';
            $("#"+bid).parent().prepend(l);  
        }        
        $(default_uidata.cLib.inventoryO).undelegate(".lockedInvSlot", "mousedown");
        $(default_uidata.cLib.inventoryO).delegate(".lockedInvSlot", "mousedown", function(event) {
              if(event.which===3){
                  Ui.generateUnlockMenu(event);
              }
        });
    }
    
    //Inventory unlock slot
    static unlockInventorySlot(bid){  
        state.mod.characters[currentChar].bag[bid].locked = false;
        Stateless.saveStorage();
        $("#"+bid).parent().find(".lockedInvSlot[data-slot='"+bid+"']").remove();        
    }
    
    // generate inventory menu on mouse rightclick
    static generateUnlockMenu(event){
            let bid = $(event.target).data('slot');
            var invtElem = $(default_uidata.cLib.inventoryO).offset();
            var rX = event.pageX - invtElem.left;
            var rY = event.pageY - invtElem.top;
            if(!$(".inventoryLockedRightMenu")[0]){
                var menu = '<div class="panel context border grey inventoryLockedRightMenu" style="z-index:11;"><div class="choice" data-action="unlock" data-slot="'+bid+'">Unlock</div></div>';
                $(default_uidata.cLib.inventoryO).prepend(menu);
            }
            
            $(".inventoryLockedRightMenu").css({'top':rY,'left':rX, 'position':'absolute'});
            $(".inventoryLockedRightMenu").show();            
            $(".inventoryLockedRightMenu").mouseleave(function(){
                $(this).delay(300).animate({
                   'opacity': 0 
                }, 400);
                $(this).delay(1000).remove();
            });
            
            $(default_uidata.cLib.inventoryO).undelegate(".choice", "click");
            $(default_uidata.cLib.inventoryO).delegate(".choice", "click", function(event) {
                $(".inventoryLockedRightMenu").hide();
                let action = $(event.currentTarget).data('action');
                let slot = $(event.currentTarget).data('slot');
                switch(action){
                    case "unlock":              
                        Ui.unlockInventorySlot(slot);
                        break;
                }
            }); 
    }
    
    //Stash all gold
    static onOpenStash(){
        let l = '<button class="btn green formatted stashAll" style="margin-left: 8px;">All</button>';
        let stash = $(state.mod.characters[currentChar].ui.stash.c)[0];
        
        $(stash).find('div.marg-top.formelements.svelte-1tde6tk input.navbtn.formatted').attr('id', 'stashinput');
        let button = $(stash).find('div.marg-top.formelements.svelte-1tde6tk div.btn.green.formatted');
        $(button).removeClass('disabled');        
        $(stash).find('div.marg-top.formelements.svelte-1tde6tk').append(l);
        
        $($(stash)[0]).undelegate(".stashAll", "click");
        $($(stash)[0]).delegate(".stashAll", "click", function(event) { 
            let num = 0;
            if($(button).text()=="Withdraw"){
                num = parseInt($(stash).find('div.formelements.svelte-1tde6tk .navbtn.panel-black.border.black.gold.svelte-1tde6tk').last().text().replace(/\s/g,''));
            }else{
                num = $(default_uidata.cLib.inventoryO).find('.panel-black.gold.svelte-1lsjq6i').first().text().replace(/\s/g,'');
            }
            let input = document.querySelector("#stashinput");       
            input.value = num; 
            
            Chat.trigger(input, 'keydown',{bubbles: true, cancelable: true, keyCode: 8});     
            Chat.trigger(input, 'input', {bubbles: true, cancelable: true}); 
            $(button).click();
        });  
    }
    
    //Minimap zoom
    static runMinimapZoom(){
        let canvas = $(default_uidata.cLib.minimapCanvas)[0];
        //TODO
    }
    
    
    //Internal runner outside of Constructor. Domino effected functions
    static run(){       
        Ui.runSlotBlocker();
        Ui.mapResize();
        Ui.runMinimapZoom();
        Ui.quicklinksDisplay();
        if(state.mod.characters[currentChar].settings.leviui.inc.classcolorchange.enabled){            
            Ui.playerTidy();        
            Ui.partyFrameTidy(); 
            
            if($("#"+default_uidata.cLib.ufTargetId)[0]){
                Ui.targetTidy(null);
                Ui.targetTidyRun(null);                
            }
            var objConfig = {childList: true, subtree : false, attributes: false, characterData : false};
            Muto.create("uftarget", Ui.targetTidyRun, '.actionbarcontainer .targetframes', objConfig);
            
            var objConfig = {childList: true, subtree : false, attributes: false, characterData : false};
            Muto.create("party", Ui.partyFrameHook, '.'+default_uidata.cLib.partyFrameClass, objConfig); 
        }
        
        Ui.skillbarResize();
        
        Ui.partyFrameRows();
        if(state.mod.characters[currentChar].settings.leviui.inc.roundmap.enabled){ 
            Ui.roundMap();
        }
        
        let layCon = $('.l-ui.layout.svelte-1j9lddf > .container.svelte-1j9lddf').first()[0];
        $(layCon).addClass('conTarget');
        
        var objConfig = {childList: true, subtree : true, attributes: false, characterData : false};
        Muto.create("windowHook", Ui.windowHook, '.layout .conTarget', objConfig);
        
    }
}
