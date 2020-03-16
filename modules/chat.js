/*
 * The Chat class is for chat stuff only.
 * This will include extra features
 */
class Chat extends Muto{
    
    //Chat class constructor
    constructor(){
        super();
    }
    
    //Static muto hook - for friend and blocklist
    static hook(mutations){    
        let b = false;
        for (let mutation of mutations) {
            for(let node of mutation.addedNodes){
                let n = $(node).find(".name");
                if(!$(node).find(".textGM")[0]){                
                    if($(n)[0]){
                        let name = n.text();
                        if(typeof state.userlistings.fblocked !== 'undefined' && state.userlistings.fblocked.length > 0){
                            for(let buser of state.userlistings.fblocked){
                                if(buser===name){
                                    $(node).hide();
                                    b = true;
                                    break;
                                }
                            }
                        }else{
                            b = true;
                            break;
                        }                    
                    }
                    if(!b){
                        let na = $(node).find(".textwhisper");
                        if($(na)[0]){
                            let ta = $(na).find('.textf1');
                            let name = ta.text().split(' ').pop();
                            if(typeof state.userlistings.fblocked !== 'undefined' && state.userlistings.fblocked.length > 0){
                                for(let buser of state.userlistings.fblocked){
                                    if(buser===name){
                                        $(node).hide();
                                        b = true;
                                        break;
                                    }
                                }
                            }else{
                                b = true;
                                break;
                            } 
                        }  
                    }
                }
                if(b){
                   break;
                }
            }
            if(b){
                break;
            }
        }
    }  
    
    //Jquery Delegation of chat clicking
    static delegators(){ 
        
       $("body").undelegate("."+default_uidata.cLib.chatClass, "mousedown");
       $("body").delegate("."+default_uidata.cLib.chatClass, "mousedown", function(event) {          
          Chat.nameClickEvent(event);
        });  
        
        $("."+default_uidata.cLib.chatClas).undelegate(".choice", "click");
        $("."+default_uidata.cLib.chatClass).delegate(".choice", "click", function(event) {
            Chat.nameMenu(event);
        }); 
    }
    
    //Mouse clickevent handler
    static nameClickEvent(event){
        switch (event.which) {
            case 1:
                //Left
                break;
            case 2:
                //Middle
                break;
            case 3:
                //right
                Chat.rightClickMenu(event);
                break;
            default:
                //strange Mouse
        }
    }
    
    //extract the name
    static getName(event){
        let m = false;
        let name = "";
        for(let node of event.target.children){
            var n = $(node).find(".name");
            if($(n)[0]){
                var t = $(node);  
                var meX = event.clientX + document.body.scrollLeft;
                var meY = event.clientY + document.body.scrollTop;
                if (meX >= t.offset().left && meX <= t.offset().left + t.width() && meY >= t.offset().top && meY <= t.offset().top + t.height()) {
                  if($(n)){
                        name = n.text();
                        if(name.trim()!=""){
                            m = true;
                            break;
                        }                    
                    }
                }
            }
            var na = $(node).find(".textwhisper");
            if($(na)[0]){
                var t = $(node);  
                var meX = event.clientX + document.body.scrollLeft;
                var meY = event.clientY + document.body.scrollTop;
                if (meX >= t.offset().left && meX <= t.offset().left + t.width() && meY >= t.offset().top && meY <= t.offset().top + t.height()) {
                  if($(n)){
                        let ta = $(na).find('.textf1');
                        name = ta.text().split(' ').pop();
                        if(name.trim()!=""){
                            m = true;
                            break;
                        }                    
                    }
                }
            }
        }     
        
        return name;
    }
    
    //Create and show menu
    static rightClickMenu(event){
        let name = Chat.getName(event);
        if(name.trim()!=""){
            var chatElem = $("."+default_uidata.cLib.chatClass).offset();
            var rX = event.pageX - chatElem.left-50;
            var rY = event.pageY - chatElem.top-10;
            if(!$(".chatRightMenu")[0]){
                var menu = '<div class="panel context border grey chatRightMenu" style="display:none;" data-name="'+name+'"><div class="choice" data-action="cpinvite">Party invite</div><div class="choice" data-action="ccopyname">Copy Name</div><div class="choice" data-action="cwhisper">Whisper</div><div class="choice" data-action="cignoreuser">Block User</div><div class="choice" data-action="cadduser">Add Friend</div></div>'; 
                $("."+default_uidata.cLib.chatClass).prepend(menu);
            }
            $(".chatRightMenu").attr("data-name", name);
            $(".chatRightMenu").css({'top':rY,'left':rX, 'position':'absolute'});
            $(".chatRightMenu").show();            
            $(".chatRightMenu").mouseleave(function(){
                $(this).delay(300).animate({
                   'opacity': 0 
                }, 400);
                $(this).delay(1000).remove();
            });
        }else{
            return false;
        }
    }
    
    //Block user in chat by name - Users registered can't be ignored
    static blockUserByName(name){
        let ignorable = true;
        for(let user of devs){
            if(user.toLowerCase()===name.toLowerCase()){
                ignorable = false;
                Chat.inject(" im unable to ignore a GM.");
            }
        }
        if(ignorable && !state.userlistings.fblocked.includes(name)){            
            state.userlistings.fblocked.push(name);
            Stateless.saveStorage();
            Chat.inject(": ignoring "+name);
        }
    }
    
    //Unblock user in chat by name
    static unblockUserByName(name){
        if(typeof state.userlistings.fblocked !== 'undefined' && state.userlistings.fblocked.length > 0){
             for (let i=0; i<state.userlistings.fblocked.length; i++){
                 if(state.userlistings.fblocked[i]===name){
                     delete state.userlistings.fblocked[i];
                     Stateless.saveStorage();
                     break;
                 }
             }                   
        }
    }
    
    //Add friend via chat
    static addFriendByName(name){
        if(!state.userlistings.friends.hasOwnProperty(name) && name!==currentChar){
            state.userlistings.friends[name] = {otherChars:[], online:false};
            Stateless.saveStorage();            
            Feature.loadFriendsOnList();
        }else{
            Chat.inject("Can't add "+name);
        }
    }
    
    // Remove friend by name
    static removeFriendByName(name){
        if(state.userlistings.friends.hasOwnProperty(name)){
            delete state.userlistings.friends[name];
            Stateless.saveStorage();            
            Feature.loadFriendsOnList();
        }
    }
    
    //Menu options
    static nameMenu(event){
        let name = $(event.target).parent().data('name');
        switch($(event.target).data('action')){
            case "cwhisper":
                Chat.whisper("/"+name+" ");
                break;
            case "cpinvite":
                Chat.send("/partyinvite "+name);
                break;
            case "cignoreuser":
                Chat.blockUserByName(name);
                break;
            case "ccopyname":
                Chat.copy(name);
                break;
            case "cadduser":
                Chat.addFriendByName(name);
                break;
            case "cremoveuser":
                Chat.removeFriendByName(name);
                break;
            default:
                break;
        }
    }
    
    //Get current time
    static time(){
        var n = new Date($.now());
        var h = n.getHours();
        var m = n.getMinutes();
        if(h<10){
           h = "0"+n.getHours();
        }
        if(m<10){
           m = "0"+n.getMinutes();
        }
        return h+":"+m;
    } 
    
    //Default send to chat
    static send(m){
        this.trigger(document.body, 'keydown',{bubbles: true, cancelable: true, keyCode: 13});
        
        var input = document.querySelector("#chatinput input");
        input.value = m; 
        
        this.trigger(input, 'input', {bubbles: true, cancelable: true});  
        this.trigger(input, 'keydown', {bubbles: true, cancelable: true,  keyCode: 13});     
    }
    
    //Activate whisper to player
    static whisper(m){
        this.trigger(document.body, 'keydown',{bubbles: true, cancelable: true, keyCode: 13});
        
        var input = document.querySelector("#chatinput input");
        input.value = m; 
        
        this.trigger(input, 'input', {bubbles: true, cancelable: true});    
    }
    
    //Inject code into chat
    static inject(text){
        var ime = Chat.time();
        var l = '<article class="line svelte-1vrlsr3"><div class="linewrap svelte-1vrlsr3"><span class="time svelte-1vrlsr3">'+ime+'</span><span class="textsub content svelte-1vrlsr3"><span class="capitalize channel svelte-1vrlsr3">Levi UI</span> </span><span class="textsub svelte-1vrlsr3"> '+text+' </span></div></article>';
        $("."+default_uidata.cLib.chatClass).append(l);
    }
    
    //Custom chat triggering key
    static trigger(element, type, properties){
        var event = new KeyboardEvent(type, properties);
        element.dispatchEvent(event);   
    }
    
    //Force text to clipboard
    static copy(t){
        var c = document.createElement("input");
        c.setAttribute("value", t);
        document.body.appendChild(c);
        c.select();
        document.execCommand("copy");
        document.body.removeChild(c);
        c = null;
    }       
}
