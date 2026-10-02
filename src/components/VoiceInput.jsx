import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square } from 'lucide-react';

export default function VoiceInput({ onTranscription }) {
  const [isListening, setIsListening] = useState(false);
  const [supportSpeech, setSupportSpeech] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if SpeechRecognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupportSpeech(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN'; // Works reasonably well for Hinglish

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onTranscription(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [onTranscription]);

  const toggleListening = () => {
    if (!supportSpeech) {
      alert("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!supportSpeech) {
    return (
      <button 
        type="button" 
        className="btn btn-voice" 
        onClick={toggleListening}
        title="Speech Recognition not supported"
      >
        <Mic size={18} /> Speak Order
      </button>
    );
  }

  return (
    <button 
      type="button" 
      className={`btn btn-voice ${isListening ? 'listening' : ''}`}
      onClick={toggleListening}
    >
      {isListening ? (
        <>
          <Square size={18} /> Stop Listening...
        </>
      ) : (
        <>
          <Mic size={18} /> Speak Order
        </>
      )}
    </button>
  );
}
