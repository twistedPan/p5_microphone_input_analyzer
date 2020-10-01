var osc;
var fft;
var mic;

var mic_AverageAmp = 0;
var micValsum = 0;
var volumeText = 0;
var t_counter = 0;

var test = false;
var amplitudes_Saved = false;
var gotAverage = false;
var recordingRoom = false;

var savedMicValues = [];

let soundValues = {
    spectrum: 0,
    waveform: 0,
    bass: 0,
    bass_Range: [],
    mid: 0,
    mid_Range: [],
    treble: 0,
    treble_Range: [],
    amp: 0,
    ampAverage: 0,
}; 

//===============================================================================
//  ------------------------------- SETUP ---------------------------------
//===============================================================================
function setup() {
    //createCanvas(400, 300);
    noCanvas();
    frameRate(60)
    noStroke();
    mic = new p5.AudioIn()
    mic.start();

    fft = new p5.FFT();
    fft.setInput(mic);
}

//===============================================================================
//  ------------------------------- DRAW ---------------------------------
//===============================================================================
function draw() {
    background(4,4,8);
    //stroke(255);
    //strokeWeight(1)
    //fill(255);

    var s = second();
    var vol = mic.getLevel();
    var volEx = vol*10_000;

    var spectrum = fft.analyze();
    var waveform = fft.waveform();
    var bass = fft.getEnergy( "bass" );
    var treble = fft.getEnergy( "treble" );
    var mid = fft.getEnergy( "mid" );     
    var custom = fft.getEnergy( 100, 200 );


    // get mic amplitudes of n frames
    getRoomNoise(volEx,s);

    // calc the average mic amplitude
    if(amplitudes_Saved && !gotAverage) getAverageAmp();


    // create map for no sound(micAverageAmp) and full sound(??? 500) from -n to n
    var micMap = map(volEx, mic_AverageAmp, 500, 0, 500);

    var mapTrebleC = map(treble, 0,255, 0,40);
    var mapMidC = map(mid, 0,255, 0,40);
    var mapBassC = map(bass, 0,255, 0,40);

    soundValues.spectrum = spectrum;
    soundValues.waveform = waveform;
    soundValues.bass = bass;
    soundValues.mid = mid;
    soundValues.treble = treble;
    soundValues.amp = vol;
    soundValues.ampAverage = micMap;


    // Visualize input
    fill(255,0,0)
    rect(width-100, height-10,15,-mapBassC)
    fill(0,255,0)
    rect(width-80, height-10,15,-mapMidC)
    fill(0,0,255)
    rect(width-60, height-10,15,-mapTrebleC)


    // Waveform
    stroke(255,0,0,29); // red
    noFill();
    beginShape();
    strokeWeight(4);
    for (var i = 0; i< waveform.length; i++){
        var x = map(i, 0,waveform.length, 0,width);
        var y = map(waveform[i], -1,1, 0,height);
        vertex(x,y);
    }
    endShape();
    noStroke();


    if (keyIsDown(73)) { // i = info
        if (keyIsDown(79)) console.log("V = Mic Input Volume * n \nM = Map \nA = AverageAMP"); // ?
        if (keyIsDown(86)) console.log("Audio In Ex:",volEx); // V
        if (keyIsDown(77)) console.log("micMap:",micMap); // M
        if (keyIsDown(65)) console.log("Average Amp",mic_AverageAmp) // A
    }

    
    window.soundValues = soundValues;

} // END OF DRAW


//===============================================================================
//  ------------------------------- FUNCTIONS ---------------------------------
//===============================================================================

function timeIt() {
    t_counter++;
}
setInterval(timeIt, 1000);

// records every 5 seconds for 1second the room noise
function getRoomNoise(micInput) {

    // start recording room noise
    if (t_counter == 0) {
        recordingRoom = true;
        amplitudes_Saved = false;
        gotAverage = false;
    }

    // reset counter every 5 secs 
    if (t_counter >= 5){
        //console.log("Amps saved")
        t_counter = 0;
    }

    // record room for 1 sec
    if (recordingRoom && t_counter <= 1) {
        saveRoomNoise(micInput);
    }
    else // stop recording after 1 sec
    {
        amplitudes_Saved = true;
        recordingRoom = false;
    }
}

function saveRoomNoise(micInput) {
    savedMicValues.push(micInput);
}

function getAverageAmp() {
    micValsum = 0;
    for (var i = 0; i < savedMicValues.length; i++) 
        micValsum += savedMicValues[i];
    
    mic_AverageAmp = micValsum / savedMicValues.length;
    
    gotAverage = true;
    //console.log("Average Amp",mic_AverageAmp)
}


// ----------------- HELPER FUNCTIONS -----------------------------------
Number.prototype.fl = function(){return Math.floor(this)}
Array.prototype.rngValue = function(){return this[Math.floor(Math.random() * this.length)]}
function rndTo(nr,decimals) {return Math.floor(nr*decimals)/100;}