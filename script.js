// initialize app
document.addEventListener('DOMContentLoaded', function() {
    const textArea = document.getElementById("textToConvert");
    const convertBtn = document.getElementById("convertBtn");
    const stopBtn = document.getElementById("stopBtn");
    const errorMessage = document.getElementById("errorMessage");
    const voiceSelector = document.getElementById("voiceSelector");
    const statusIndicator = document.getElementById("statusIndicator");
    
    // Web Speech API
    const speechSynth = window.speechSynthesis;
    let voices = [];
    
    // function to populate the voice selector
    function populateVoiceList() {
        voices = speechSynth.getVoices();
        
        // clear existing options and add default option
        voiceSelector.innerHTML = '<option value="">Default Voice</option>';
        
        // adding each available voice
        voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelector.appendChild(option);
        });
    }
    
    // voice loading in some browsers
    if (speechSynth.onvoiceschanged !== undefined) {
        speechSynth.onvoiceschanged = populateVoiceList;
    }
    
    // populate voice list
    populateVoiceList();
    
    // function to convert 'text to speech'
    function playSpeech() {
        const enteredText = textArea.value;
        
        if (!enteredText.trim().length) {
            errorMessage.textContent = "Please enter some text to convert to speech";
            return;
        }
        
        speechSynth.cancel();
        errorMessage.textContent = "";
        
        // creating a new speech utterance
        const utterance = new SpeechSynthesisUtterance(enteredText);

        if (voiceSelector.value !== "") {
            utterance.voice = voices[parseInt(voiceSelector.value)];
        }
        
        // indicator during speech
        statusIndicator.classList.add('active');
        
        utterance.onend = function() {
            statusIndicator.classList.remove('active');
        };
        
        // handle speech error
        utterance.onerror = function() {
            errorMessage.textContent = "An error occurred while playing speech";
            statusIndicator.classList.remove('active');
        };

        speechSynth.speak(utterance);
    }
    
    // function for stopping speech
    function stopSpeech() {
        speechSynth.cancel();
        statusIndicator.classList.remove('active');
    }
    
    convertBtn.addEventListener('click', playSpeech);
    stopBtn.addEventListener('click', stopSpeech);
    
    // keyboard shortcut 'Ctrl + Enter' to trigger speech
    textArea.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            playSpeech();
        }
    });
});
