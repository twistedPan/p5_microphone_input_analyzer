let osc;
let fft;
let mic;

let mic_AverageAmp = 0;
let micValsum = 0;
let volumeText = 0;
let t_counter = 0;

let test = false;
let amplitudes_Saved = false;
let gotAverage = false;
let recordingRoom = false;

let savedMicValues = [];

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
    //createCanvas(300, 300);
    noCanvas();
    frameRate(60);
    textSize(20);
    mic = new p5.AudioIn();
    mic.start();

    fft = new p5.FFT();
    fft.setInput(mic);
}

//===============================================================================
//  ------------------------------- DRAW ---------------------------------
//===============================================================================
function draw() {
    background(4,4,8,80);
    //stroke(255);
    //strokeWeight(1)
    //fill(255);

    let s = second();
    let vol = mic.getLevel();
    let volEx = vol*10_000;

    let spectrum = fft.analyze();
    let waveform = fft.waveform();
    let bass = fft.getEnergy( "bass" );
    let treble = fft.getEnergy( "treble" );
    let mid = fft.getEnergy( "mid" );
    let custom = fft.getEnergy( 100, 200 );


    // get mic amplitudes of n frames
    getRoomNoise(volEx,s);

    // calc the average mic amplitude
    fill(255);
    stroke(255);
    if(amplitudes_Saved && !gotAverage) {
        getAverageAmp();
        text("Average amp saved", 50,50);
    }
    text("Average Amp = " + rndTo(mic_AverageAmp,2), 50,100)
    text("Mic Input Vol = " + rndTo(volEx,2), 50,150)

    // create map for no sound(micAverageAmp) and full sound(??? 500) from -n to n
    let micMap = map(volEx, mic_AverageAmp, 500, 0, 500);

    let mapTrebleC = map(treble, 0,255, 0,40);
    let mapMidC = map(mid, 0,255, 0,40);
    let mapBassC = map(bass, 0,255, 0,40);

    soundValues.spectrum = spectrum;
    soundValues.waveform = waveform;
    soundValues.bass = bass;
    soundValues.mid = mid;
    soundValues.treble = treble;
    soundValues.amp = vol;
    soundValues.ampAverage = micMap;


    // Visualize input
    noStroke();
    fill(255,0,0)
    rect(width-100, height-10,15,-mapBassC*2)
    fill(0,255,0)
    rect(width-80, height-10,15,-mapMidC*2)
    fill(0,0,255)
    rect(width-60, height-10,15,-mapTrebleC*2)

/*
    // Waveform
    stroke(255,0,0,29); // red
    noFill();
    beginShape();
    strokeWeight(4);
    for (let i = 0; i< waveform.length; i++){
        let x = map(i, 0,waveform.length, 0,width);
        let y = map(waveform[i], -1,1, 0,height);
        vertex(x,y);
    }
    endShape();
    noStroke();
*/
/*
    if (keyIsDown(73)) { // i = info
        if (keyIsDown(79)) console.log("V = Mic Input Volume * n \nM = Map \nA = AverageAMP"); // ?
        if (keyIsDown(86)) console.log("Audio In Ex:",volEx); // V
        if (keyIsDown(77)) console.log("micMap:",micMap); // M
        if (keyIsDown(65)) console.log("Average Amp",mic_AverageAmp) // A
    }
*/

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
    for (let i = 0; i < savedMicValues.length; i++)
        micValsum += savedMicValues[i];

    mic_AverageAmp = micValsum / savedMicValues.length;

    gotAverage = true;
    //console.log("Average Amp",mic_AverageAmp)
}


// ----------------- HELPER FUNCTIONS -----------------------------------
function rndTo(nr,decimals) {return Math.floor(nr*decimals)/100;}
