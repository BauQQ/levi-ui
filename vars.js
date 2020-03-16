/*
 * Levi UI Mod 2.x.x - Hordes.io
 */

// Jquery Constants + noConflict
const $ = window.jQuery;    
const jQuery = window.jQuery;
jQuery.noConflict();


// Mod Constants 
const devs = ["luffas","saltyalex"];
//Local storage key
const storage_key = localStorage.key("levi-ui-two-custom-luffa-key-dev");  
//version number
const _version = "2.1.0";

//Mutos array
let mutos = {};
//current data state
let state = null;
//ignored item types
let iItemTypes = ["rune","misc","book","mount"];
//current character thats logged in
let currentChar = "";
//Last settings panel
let lastPanel = null;
//Mouse position
let mousePos = {x:0, y:0};
//Last target 
let lastTarget = {name:"", key:0};
//Last item called
let lastItemFromApi = null;
//Skill cooldown timers
let skillCooldown = {};
//StopWatch Pause
let ssTimer = false;
//stopwatch interval
let ssInterval = null;
//Party layout  
let currentParty = {};
//Localclock var
let local_clock = null;
