class Muto extends Stateless{
    
    //Mutation Observer class constructor
    constructor(){
        super();
    }
    
    //Mutation observer creator
    static create(key, callback, selector, config){
        Muto.destroy(key);
        var node = $(selector)[0];
        if(node!='undefined' && node!=null && !mutos.hasOwnProperty(key)){
            mutos[key] = new MutationObserver(callback);
            mutos[key].observe(node, config);
        }
    }    
    
    //Mutation observer destroyer
    static destroy(key){
        if(mutos.hasOwnProperty(key)){
            mutos[key].disconnect();
            delete mutos[key];
        }
    }
}