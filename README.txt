Here the first version of the p5 "Microphone Input Handler"

index.html => for first User input, so chrome doesn't gets sad

audio.html => main html file for your sketches

mic_Input_Analyzer.js => gathers input and creates output


how to access output? => window.soundValues

soundValues.spectrum = Returns an array of amplitude values (between 0 and 255) across the frequency spectrum.
soundValues.waveform = Returns an array of amplitude values (between -1.0 and +1.0)
soundValues.bass = Average of amplitudes in bass spectrum
soundValues.mid = Average of amplitudes in mid spectrum
soundValues.treble = Average of amplitudes in high spectrum
soundValues.amp = Mic Input Amplitude
soundValues.ampAverage = Mic mapped to average room noise which calculates every 5 seconds new 
