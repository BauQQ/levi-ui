/* The stateless class, is the only class to 
 * interact directly with localStorage
 * on assigned item key
 * This class contains the structure test at function: super_test();
 * */

class Stateless {  
    
    ['state'] = null;
    //Stateless class constructor
    constructor() {        
        var app = $.parseJSON(localStorage.getItem(storage_key));
        //console.log(app); // Remove before forking
        if (app === null || !app.hasOwnProperty('mod')){
            state = default_data;
            localStorage.setItem(storage_key, JSON.stringify(state));
        }else{
            this.state = $.parseJSON(localStorage.getItem(storage_key));
            state = this.state;
        }
        this.checkStorageVersion();
    }
    
    //Check datastrings version, update if needed.
    checkStorageVersion(){
        if(state.mod.version!=_version){
            this.updateDefault(default_data.mod);       
        }
    }
    
    //Return storage
    getStorage() {        
        return this.state;
    }

    //Set state storage
    setStorage(json) {
        state = json;
    }
    
    //Save data to local storage
    static saveStorage() {
        localStorage.setItem(storage_key, JSON.stringify(state));
    }
    
    //Load data from local storage
    loadStorage(){
        this.state = $.parseJSON(localStorage.getItem(storage_key));
        state = this.state;
    }
    
    //Overwrite saved data with new version data.
    updateDefault(data) {
        state.mod = data;
        localStorage.setItem(storage_key, JSON.stringify(state));
    }
    
    //Reset Levi UI completely
    static resetTodefault() {
        state.mod = default_data.mod;
        localStorage.setItem(storage_key, JSON.stringify(state));
    }
    
    //super extends class test
}