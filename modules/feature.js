/*
 * The Feature class includes mouseover stuff ?
 */
class Feature extends Muto{
    
    //Feature class constructor
    constructor(){
        super();
    } 
    
    //Load custom feature to menu
    static loadCustomFeatureMenu(){
        for(let element in default_uidata.interface.features.menu){
            let el = default_uidata.interface.features.menu[element];
            if(el.hasOwnProperty('setting') && state.mod.characters[currentChar].settings.leviui.inc.hasOwnProperty(el.setting)){  
                if(state.mod.characters[currentChar].settings.leviui.inc[el.setting].enabled){
                    Feature.createCustomFeatureMenu(element, el);
                }
            }else{
                Feature.createCustomFeatureMenu(element, el);
            }
        }
    }
    
    //Generating the menu
    static createCustomFeatureMenu(element, el){
        Feature.loadCustomFeature(element, el); 
        let layCon = $('.l-ui.layout.svelte-1j9lddf > .container.svelte-1j9lddf').first()[0];
        if(el.hasOwnProperty('btn')){
            let h = Elements.mainMenuHtmlElement("sys"+element, el.btn);
            $(h).insertAfter($(default_uidata.cLib.mainmenu).children().first());
            $(default_uidata.cLib.mainmenu).undelegate("#sys"+element, "click");
            $(default_uidata.cLib.mainmenu).delegate("#sys"+element, "click", function(event) {
                if(el.hasOwnProperty('a') && Feature.hasOwnProperty(el.a)){
                    if($(".cl_"+element)[0]){
                        if($(".cl_"+element).is(":visible")){
                            $(".cl_"+element).hide();
                        }else{
                            $(".cl_"+element).show();
                        }
                    }
                }
            });  
            
            $(layCon).undelegate(".close_feature", "click");
            $(layCon).delegate(".close_feature", "click", function(event) {
                let cl = $(event.currentTarget).closest('.cwindow').data('cl');
                if($("."+cl).is(":visible")){
                    $("."+cl).hide();
                }
            });            
            
            $("#sys"+element).mouseover(function() {
                let l = '<div class="btn border grey customtag">'+el.name+'</div>';
                $(default_uidata.cLib.mainmenu).prepend(l);
            }).mouseout(function() {
                $(default_uidata.cLib.mainmenu).find('.customtag').remove();
            });            
        }                   
    }      
    
    //Load custom features and ui's
    static loadCustomFeature(element, el){
        if(!el.hasOwnProperty('static')){
            let layCon = $('.l-ui.layout.svelte-1j9lddf > .container.svelte-1j9lddf').first()[0];
            $(layCon).append(Elements.windowPanelHtmlElement("cl_"+element, el.name));
        }
        if(el.hasOwnProperty('a') && Feature.hasOwnProperty(el.a)){
            Feature[el.a](element, el);
        }
    }
    
    //Static time converter from seconds
    static timeConverter(num){
        let sec = parseInt(num, 10); // don't forget the second param
        let hours   = Math.floor(sec / 3600);
        let minutes = Math.floor((sec - (hours * 3600)) / 60);
        let seconds = sec - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours + ':' + minutes + ':' + seconds; 
    }
    
    //start up player timer
    static doPlayerTimer(element, el){
        if(typeof $('.cl_customplayertimer .wrapper').find('.cptnum')[0]=="undefined"){
            let ssInterval  = null;
            let l = '<div class="grid buttons marg-top" style="grid-template-columns: 3fr 1fr 1fr;"><div class="btn disabled cptnum" style="color: white;">00:00:00</div><div class="btn grey cptstart">Start</div><div class="btn grey cptreset">Reset</div></div>';
            $('.cl_customplayertimer .wrapper').append(l);  
        }
        
        let i = 1;
        $(".cptstart").click(function (e) {
            if(!ssTimer){ 
                $(".cptstart").text("Pause");
                ssInterval = setInterval(function () {                  
                    $(".cptnum").html(Feature.timeConverter(i));
                    i++;
                }, 1000);                     
                ssTimer = true;
            }else{
                $(".cptstart").text("Start");
                clearInterval(ssInterval);
                ssTimer = false;
            }
        }); 

        $('.cptreset').click(function (e) {
           i = 1;
           $(".cptnum").html(Feature.timeConverter(0));
        }); 
    }
    
    //Start up friendslist
    static doFriendslist(element, el){
        //Generate default interface empty
        let l = '<div class="grid buttons marg-top" style="grid-template-columns: 2fr 3fr;"><div class="btn addBTN" style="color: white; height: 20px;"><div class="addplus">+</div><div class="addfriend">Add Friend</div></div><input type="text" class="filter_friends" placeholder="Filter" /></div><div class="grid marg-top" style="grid-template-columns: 1fr;"><div class="border_line acc-list" style="color: white; height: 280px; grid-template-columns: 1fr; padding: 3px;"><div class="acc-header border_line btn"><span class="arrow"></span><span class="friends_span">Favorites</span></div><div class="acc-body cl_friendslist_favorites"><p>test</p></div><div class="acc-header border_line btn"><span class="arrow"></span><span class="friends_span">Friends</span><span class="friends_total">4/18<span></div><div class="acc-body cl_friendslist_friends" style="grid-template-columns: 1fr;"></div></div></div>';
        $('.cl_friendslist .wrapper').append(l);
        $('.cl_friendslist .acc-list').each(function(){
            let acc = $(this);
            $(acc).find('.acc-header').on('click', function(){
                $(acc).find('.arrow').removeClass('down');
                $(acc).find('.acc-body').slideUp();
                if(!$(this).next().is(':visible')){
                    $(this).find('span.arrow').addClass('down');
                    $(this).next().slideDown();
                }
            });
        });
        
        $(".cl_friendslist").undelegate('.addBTN', "click");
        $(".cl_friendslist").delegate('.addBTN', "click", function(event) {              
            let h = Elements.windowPanelHtmlElement("doAddfriendButtonFrame", "Add Friend");
            $('.layout').prepend(h);              
            
            if(!$('.doAddfriendButtonFrame').find('.add_friends_inp')[0]){
                let hi = '<div class="grid buttons marg-top" style="grid-template-columns: 3fr 1fr;"><input type="text" class="add_friends_inp" placeholder="Username.." /><div class="btn grey add_user_by_name">Add</div></div>';
                $('.doAddfriendButtonFrame .wrapper').append(hi); 
                $('.doAddfriendButtonFrame').css({'z-index':9, 'top':'40%','left':'40%', 'position':'absolute'});
                $('.doAddfriendButtonFrame').show();            
            }            
            
            $(".doAddfriendButtonFrame").undelegate(".add_user_by_name", "click");
            $(".doAddfriendButtonFrame").delegate(".add_user_by_name", "click", function(event) {  
                let unameI = $('.add_friends_inp').val();
                Api.Ajax("player", JSON.stringify({name:name,order:"name"}), function(data){                    
                    for(let user of data){
                        if(unameI.toLowerCase()===user.name.toLowerCase()){
                            Chat.addFriendByName(user.name);
                            $('.doAddfriendButtonFrame').remove();
                        }else{
                            $('.add_friends_inp').val("");
                            $('.add_friends_inp').attr('placeholder', 'User not found..')
                        }
                    }
                });
                //New ajax function implemented
//                Feature.getUsersByName(unameI, function(data){                    
//                    for(let user of data){
//                        if(unameI.toLowerCase()===user.name.toLowerCase()){
//                            Chat.addFriendByName(user.name);
//                            $('.doAddfriendButtonFrame').remove();
//                        }else{
//                            $('.add_friends_inp').val("");
//                            $('.add_friends_inp').attr('placeholder', 'User not found..')
//                        }
//                    }
//                });
                
            });
            
            $(".doAddfriendButtonFrame").undelegate(".close_feature", "click");
            $(".doAddfriendButtonFrame").delegate(".close_feature", "click", function(event) { 
                $('.doAddfriendButtonFrame').remove();
            });
        });
        
        Feature.loadFriendsOnList();
        //Generate the interface
    }
    
    //Load friendlist    
    static loadFriendsOnList(){        
        //Generate friends list
        $('.cl_friendslist .cl_friendslist_friends').html("");
        
        let n = 0;
        for(let user in state.userlistings.friends){
            n++;
            let li = '<div class="border_line user" data-name="'+user+'"><i class="material-icons md-light md-inactive md-18" style="margin: 3px; float: left;">person</i><span class="name">'+user+'</span></div>';
            $('.cl_friendslist .cl_friendslist_friends').append(li);
        }
        $('.cl_friendslist .friends_total').text(n+"/"+n);
        
        
        //Search function in friendlist
        $('.cl_friendslist .filter_friends').off('propertychange input');
        $('.cl_friendslist .filter_friends').on('propertychange input', function(event){
            let val = $('.cl_friendslist .filter_friends').val().toLowerCase();
            $(".cl_friendslist .cl_friendslist_friends .name").filter(function() {
                $(this).closest('.user').toggle($(this).text().toLowerCase().indexOf(val) > -1);
            });
        });
        
        $(".cl_friendslist").undelegate(".user", "mousedown");
        $(".cl_friendslist").delegate(".user", "mousedown", function(event) {  
            if(event.which===3){
                Feature.getFriendMenu(event);
            }
        });  
    }
    
    //On rightclick get menu for friendlist
    static getFriendMenu(event){
        let name = $(event.target).closest('.user').data('name');
        
        var Elem = $(".cl_friendslist").offset();
        var rX = event.pageX - Elem.left-50;
        var rY = event.pageY - Elem.top-10;
        if(!$(".cl_friendslist .chatRightMenu")[0]){
            var menu = '<div class="panel context border grey chatRightMenu" style="display:none;" data-name="'+name+'"><div class="choice" data-action="cpinvite">Party invite</div><div class="choice" data-action="ccopyname">Copy Name</div><div class="choice" data-action="cwhisper">Whisper</div><div class="choice" data-action="cremoveuser">Remove Friend</div></div>';    
            $(".cl_friendslist").prepend(menu);
        }
        $(".cl_friendslist .chatRightMenu").data("name", name);
        $(".cl_friendslist .chatRightMenu").css({'top':rY,'left':rX, 'position':'absolute'});
        $(".cl_friendslist .chatRightMenu").show();            
        $(".cl_friendslist .chatRightMenu").mouseleave(function(){
            $(this).delay(300).animate({
               'opacity': 0 
            }, 400);
            $(this).delay(1000).remove();
        });
      
        $(".cl_friendslist").undelegate(".choice", "click");
        $(".cl_friendslist").delegate(".choice", "click", function(event) {
            $('.cl_friendslist .chatRightMenu').hide();
            Chat.nameMenu(event);
        }); 
    }
    
    // Setup the basic skill cooldown div/overlay
    static runSkillCooldown(){
        let nodes = $("#"+default_uidata.cLib.skillbarId+" .overlay:not(.offCd)");
        $.each(nodes, function( i, node ){ 
            $(node).addClass('cdin');
            if(!$(node).find('.levi-cd-time')[0]){
                $(node).append('<div class="levi-cd-time"></div>'); 
                let id = $(node).parent().attr('id');
                // Rewrite to fit storage better
                skillCooldown[id] = {};  
                skillCooldown[id].initCDT = null;
                skillCooldown[id].initCDPL = null;
                skillCooldown[id].laCDT = null;
                skillCooldown[id].laCDPL = null;
                skillCooldown[id].c = 0;
                skillCooldown[id].ch = 1000;
                var objConfig = {childList: true, subtree : true, attributes: true, characterData : true};
                Muto.create("skillcd_"+id, Feature.skillCooldown, "#"+id, objConfig);
            }           
        });
    }
    
    //Deal with the step mutation for the cd
    //Thanks to Sakurasou for the original idea
    static skillCooldown(mutations){
        $.each(mutations,function( i, v ){
            let n = v.target;
            if($(n).hasClass('offCd') || typeof n.step !== 'number')return;
                let id = $(n).parent().attr('id');
                if(typeof id === "undefined")return;
                let entry = skillCooldown[id];
                
                if(!entry.hasOwnProperty('initCDPL') && n.step >= entry.laCDPL){  
                    entry.initCDT = null;
                    entry.initCDPL = null;
                    entry.laCDT = null;
                    entry.laCDPL = null; 
                    entry.c = 0;
                    entry.ch = 0;
                }
                
                if(!entry.initCDT){                    
                    entry.initCDT = Date.now();
                    entry.initCDPL = n.step;
                }                
                
                entry.laCDT = Date.now();
                entry.laCDPL = n.step;
                entry.c++;
                
                if(entry.c  % 3){
                    let clock = Feature.calculateCD(entry);
                    if(clock<skillCooldown[id].ch && isFinite(clock)){
                        skillCooldown[id].ch = clock;
                        if(parseInt(clock)<=0){
                            clock = "";
                        }
                        $('#'+id).find('.levi-cd-time').html(clock);
                    }
                }
        });
    }
    
    // Cooldown calculation 
    static calculateCD(entry){
        let cInterval = entry.laCDT - entry.initCDT;
        let pTime = entry.initCDPL - entry.laCDPL;
        let parSecs = cInterval / pTime / 1000;
        let num = Math.floor((parSecs * entry.laCDPL) *1)/1;
        
        return num;
    }
    
    //Get items by id - calling api
    static getItemById(id){
        $.ajax({
            type: "POST",
            url: "./api/item/get",
            data: JSON.stringify({ids:[id]}),
            contentType:"text/plain;charset=UTF-8",
            dataType: "json",
            success: function(data){
                lastItemFromApi = data[0];
            }
        });
    }
    
    //Get user by username  and do callback
    static getUsersByName(name, callback){
         $.ajax({
            type: "POST",
            url: "./api/playerinfo/search",
            data: JSON.stringify({name:name,order:"name"}),
            contentType:"text/plain;charset=UTF-8",
            dataType: "json",
            success: function(data){
                callback(data);
            }
        });
    }
    
    //Run item linking
    static runItemLink(){   
        if(!state.mod.characters[currentChar].hasOwnProperty('bag')){
            Ui.regenerateNewBag();
        }
        $(default_uidata.cLib.inventoryO).undelegate(".slotcontainer div.slot", "mouseover");
        $(default_uidata.cLib.inventoryO).delegate(".slotcontainer div.slot", "mouseover", function(event) {
            if(event.target.id.includes('bag')){
                if($(default_uidata.cLib.inventoryO).find('.slotdescription').length){   
                    let item = $(default_uidata.cLib.inventoryO).find('.slotdescription')[0];
                    let packs = $(item).children().children();  
                    
                    let bagslot = {};
                    bagslot.name = $(packs[0]).find('.slottitle').text();
                    bagslot.id = $(packs[0]).find('small.textgrey').html().split(' ').pop();
                    bagslot.lvl = $(packs[2]).find('.textgreen:contains("Requires")').html().split(' ').pop();
                    Api.Ajax("item",JSON.stringify({ids:[bagslot.id]}), function(result){
                        lastItemFromApi = result[0];
                    })
                    //Feature.getItemById(bagslot.id);
                    bagslot.ignore = false;
                    for(let ig of iItemTypes){
                        if($(packs[0]).find('.type').text().trim().includes(ig)){
                            bagslot.ignore = true;
                        }
                    }                        
                    if(!bagslot.ignore){                    
                        bagslot.rarity = $(packs[0]).find('.type').text().split(' ').pop();
                        let txt = $(packs[1]).text();
                        let statArgs = [];
                        statArgs.push(txt.substr(0,txt.indexOf('+')));
                        statArgs.push(txt.substr(txt.indexOf('+')+1));
                        if(statArgs[0].includes("Damage")){
                            bagslot.dmg = statArgs[0].split('Damage').shift().trim();
                            bagslot.stats = statArgs[1];
                        }else{
                            bagslot.stats = statArgs[1];
                        }
                    }
                    state.mod.characters[currentChar].bag[event.target.id].item = bagslot;
                }
            }
        });
        Feature.inventoryRightclick();        
    }
    
    //Inventory rightclick
    static inventoryRightclick(){
        $(default_uidata.cLib.inventoryO).undelegate(".slotcontainer div.slot", "mousedown");
        $(default_uidata.cLib.inventoryO).delegate(".slotcontainer div.slot", "mousedown", function(event) {             
            if(event.which===3){
                 let tar = event.currentTarget;
                 let bid = $(tar).attr("id");
                 setTimeout(function(){
                    let el = $(default_uidata.cLib.inventoryItemOM)[0];                    
                    if(bid.includes('bag')){   
                        $(el).append(Feature.generateSlotMenu(bid));
                        $(el).undelegate(".choice", "click");
                        $(el).delegate(".choice", "click", function(event) {  
                            let action = $(event.currentTarget).data("action");
                            switch(action){
                                case "link":  
                                    Chat.send(Feature.itemString(event));
                                    break;
                                case "copy":              
                                    Chat.copy(Feature.itemString(event));
                                    break;
                                case "lock":              
                                    Ui.lockInventorySlot(bid);
                                    break;
                                case "unlock":              
                                    Ui.unlockInventorySlot(bid);
                                    break;
                            }
                            $(el).hide();
                        });                         
                    }
                }, 100);
                
            }
        });
    }
    
    //Menu generator for rightclick
    static generateSlotMenu(bid){
        let l = "";
        if(state.mod.characters[currentChar].bag.hasOwnProperty(bid) && state.mod.characters[currentChar].bag[bid].item.hasOwnProperty('ignore') && !state.mod.characters[currentChar].bag[bid].item.ignore){     
            l += '<div class="choice itemlink" data-action="link" data-id="'+bid+'">Link in Chat</div>'                           
            +'<div class="choice itemlink" data-action="copy" data-id="'+bid+'">Copy item</div>';         
        }
        
        if(!state.mod.characters[currentChar].bag[bid].locked){
             l += '<div class="choice" data-action="lock" data-id="'+bid+'">Lock</div>';
        }else{
             l += '<div class="choice" data-action="unlock" data-id="'+bid+'">Unlock</div>';
        }
        return l;
    }
    
    //Generate string for copy and link item
    static itemString(event){
        let id = $(event.currentTarget).data("id");
        let slot = state.mod.characters[currentChar].bag[id].item;
        let T = "";
        if(slot.id==lastItemFromApi.id){
            let tier = lastItemFromApi.tier+1;
            T = "T"+tier;
        }
        let dmg = "";
        if(slot.hasOwnProperty("dmg")){
            dmg = " Dmg: "+slot.dmg+" |";
        }
        let name = "";
        let upgrade = "";
        if(slot.name.includes("+")){            
            let prename = slot.name.split("+");
            name = prename.shift();
            upgrade = " | +"+prename.pop();
        }else{
            name = slot.name;
        }
        
        let linkString = T+" "+name+" - Lv. "+slot.lvl+" - "+slot.rarity+""+upgrade+ " |"+dmg+" "+slot.stats.replace(/\+/g, '-');
        return linkString
    }
    
    //New draggable setup
    static sortDraggable(node, id, incd){        
        if($(node).find('.titleframe')[0]){
            if(incd){
                Feature.draggable(node, $(node).find('.titleframe')[0], id, true);                
            }else{
                Feature.undraggable($(node).find('.titleframe')[0]);
            }
        }else{
            if(incd){
                Feature.draggable(node, node, id, false);
            }else{
                Feature.undraggable(node);
            }
        }
    }
    
    //Draggable ui
    static draggable(parent, node, id, header){
        let pel = null
        let el = null; 
        $(node).on('mousedown', function(e){
            if(header){
                pel = $(node).css("cursor","move");
                el = $(parent).addClass("drag");                  
                $(parent).css('z-index', 1);
                $(parent).siblings('div').css('z-index', 0);
            }else{                
                el = $(this).addClass("drag").css("cursor","move"); 
                $(node).css('z-index', 1);
                $(node).siblings('div').css('z-index', 0);    
            }
            $(el).css({position:"absolute"});
            let height = el.outerHeight();
            let width = el.outerWidth();
            let y = el.offset().top + height - e.pageY,
            x = el.offset().left + width - e.pageX;
            $(document.body).on('mousemove', function(e){
                    let itop = e.pageY + y - height;
                    let ileft = e.pageX + x - width;
                    if(el.hasClass("drag")){
                            el.offset({top: itop,left: ileft});
                            state.mod.characters[currentChar].ui[id].e = true;
                            state.mod.characters[currentChar].ui[id].top = $(el).position().top;
                            state.mod.characters[currentChar].ui[id].left = $(el).position().left;
                            Stateless.saveStorage();
                    }
            }).on('mouseup', function(e){
                if(header){                    
                    el.removeClass("drag");
                    $(pel).css("cursor","default");
                }else{
                    el.removeClass("drag").css("cursor","default");
                }
            });
        });
    }
    
    //Local clock feature
    static doLocalClock(element, el){
        let layCon = $('.l-ui.layout.svelte-1j9lddf > .container.svelte-1j9lddf').first()[0];
        let h = Elements.smallPanelHtmlElement("cl_"+element);
        $(layCon).prepend(h);
        $('.cl_localclock .textgreen').css({'font-size':"15px"});
        clearInterval(local_clock);
        local_clock = setInterval(function () {  
            let date = new Date();
            $('.cl_localclock .textgreen').html(date.getHours() + ":" +date.getMinutes());
        }, 1000);  
    }
    
    //Undraggable ui
    static undraggable(node){
        $(node).off('mousedown');
        $(node).off('mouseup');
        $(document.body).off("mousemove");        
    }
    
    //Start up draggable ui
    static runDraggable(){  
        if(!state.mod.characters[currentChar].hasOwnProperty('ui')){            
            state.mod.characters[currentChar].ui = default_uidata.interface.elements;
            Stateless.saveStorage();
        }
        for(let element in state.mod.characters[currentChar].ui){
            let target = $(state.mod.characters[currentChar].ui[element].c);
            if(state.mod.characters[currentChar].ui[element].e){
                $(target).css({position:"absolute", top: state.mod.characters[currentChar].ui[element].top+'px', left: state.mod.characters[currentChar].ui[element].left+'px'})
            }
            if(state.mod.characters[currentChar].ui[element].hasOwnProperty('p') && state.mod.characters[currentChar].ui[element].p){
                Feature.sortDraggable(target, element, true);
            }else{
                if(!state.mod.characters[currentChar].settings.leviui.inc.lock.enabled){
                    Feature.sortDraggable(target, element, true);
                }else{
                    Feature.sortDraggable(target, element, false);
                }
            }
        }
    }
   
    //Mouse over ability use on partyframe
    static mouseoverAbilityPartyUse(){        
        if(state.mod.characters[currentChar].settings.leviui.inc.mouseoverparty.enabled){
            let elm = document.elementFromPoint(mousePos.x, mousePos.y);
            if($(elm).closest(".grid.left.svelte-1rrmvqb")[0]){
                $(elm).closest(".grid.left.svelte-1rrmvqb")[0].click();                
            }
        }
    }
    
    //Party select with key
    static selectPartyMemberOnKey(key){        
        let el = $(default_uidata.cLib.partyFrameClassEx).children();
        if($(el)[key]){
            $(el)[key].click();
        }
    }
    
    //Party Selector with key event
    static selectPartyWithKey(event){
        if(state.mod.characters[currentChar].settings.leviui.inc.shiftselectparty.enabled){
            switch(event.originalEvent.which){
                case 49:
                    Feature.selectPartyMemberOnKey(0);
                    break;
                case 50:
                    Feature.selectPartyMemberOnKey(1);
                    break;
                case 51:
                    Feature.selectPartyMemberOnKey(2);
                    break;
                case 52:
                    Feature.selectPartyMemberOnKey(3);
                    break;
                case 53:
                    Feature.selectPartyMemberOnKey(4);
                    break;
                case 54:
                    Feature.selectPartyMemberOnKey(5);
                    break;
                case 55:
                    Feature.selectPartyMemberOnKey(6);
                    break;
                case 56:
                    Feature.selectPartyMemberOnKey(7);
                    break;
                case 57:
                    Feature.selectPartyMemberOnKey(8);
                    break;
            }
        }
    }
    
    //Mouseover Delegator for feature on key 0-9
    static mouseoverDelegator(){
        $("html").mouseover(function(event){
            mousePos.x = event.pageX;
            mousePos.y = event.pageY;
        });       
        
        let keys = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
        $(document).undelegate("html", "keydown");
        $(document).delegate("html", "keydown", function(event) {
            if(event.originalEvent.shiftKey){
                Feature.selectPartyWithKey(event);
            }else{
                if(keys.includes(event.originalEvent.which)){
                    Feature.mouseoverAbilityPartyUse();
                }
            }
        });
    } 
    
    //Export ui
    static exportUi(){
        let uistring = btoa(JSON.stringify(state.mod.characters[currentChar].ui));
        Chat.copy(uistring);
        Chat.inject(" UI was exported to clipholder");
    }
    
    //Import ui
    static importUi(uistring){
        state.mod.characters[currentChar].ui = JSON.parse(atob(uistring));    
        Stateless.saveStorage();
        Chat.inject(" UI has been imported");
    }    
    
    //Internal runner outside of Constructor. Domino effected functions
    static run(){
        Feature.loadCustomFeatureMenu();
        Feature.mouseoverDelegator();
        if(state.mod.characters[currentChar].settings.leviui.inc.itemlink.enabled){  
            Feature.runItemLink();
        }  
        
        if(state.mod.characters[currentChar].settings.leviui.inc.skillcooldown.enabled){ 
            var objConfig = {childList: true, subtree : true, attributes: true, characterData : false};
            Muto.create("skillbar", Feature.runSkillCooldown, "#"+default_uidata.cLib.skillbarId, objConfig);
        } 
        Feature.runDraggable();
    }
}