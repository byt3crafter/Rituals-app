import * as Speech from 'expo-speech';

export const speak = (text: string) => {
  Speech.isSpeakingAsync().then(isSpeaking => {
    if(!isSpeaking) {
        Speech.speak(text, {
            // language: 'en-US',
            // pitch: 1.0,
            // rate: 1.0,
        });
    }
  }).catch(e => console.warn("Could not speak:", e));
};
