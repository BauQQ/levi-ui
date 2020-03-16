/*
 * The Api class is for interactions between the script
 * and server.
 */
class Api{
    
    ["url"] = {'item':"./api/item/get", 'clan':"./api/claninfo/info", 'player':"./api/playerinfo/search"};
    
    constructor(){
        
    }    
    
    static Ajax(target, data, callback){
        if(this.url.hasOwnProperty(target)){
            $.ajax({
                type: "POST",
                url: this.url[target],
                data: data,
                contentType:"text/plain;charset=UTF-8",
                dataType: "json",
                success: function(result){
                    callback(result);
                }
            });
        }
    }
}