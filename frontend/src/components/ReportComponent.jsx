import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, Camera, User, Send, CheckCircle, X, Play, Square, Mic, MicOff, Trash2, Volume2, SkipForward } from 'lucide-react';

// Native Camera component using only browser APIs
const NativeCamera = ({ onCapture, onClose, className }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState(null);
    const [facingMode, setFacingMode] = useState('environment');

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [facingMode]);

    const startCamera = async () => {
        try {
            setError(null);
            
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const constraints = {
                video: {
                    width: { ideal: 1280, max: 1920 },
                    height: { ideal: 720, max: 1080 },
                    facingMode: facingMode,
                    aspectRatio: { ideal: 16/9 }
                },
                audio: false
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setStream(mediaStream);
                
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play().then(() => {
                        setIsReady(true);
                    }).catch(e => {
                        console.error('Error playing video:', e);
                        setError('Failed to start video playback');
                    });
                };
            }
        } catch (err) {
            console.error('Camera access error:', err);
            if (err.name === 'NotAllowedError') {
                setError('Camera access denied. Please allow camera permissions and try again.');
            } else if (err.name === 'NotFoundError') {
                setError('No camera found on this device.');
            } else if (err.name === 'NotSupportedError') {
                setError('Camera not supported on this device.');
            } else {
                setError('Unable to access camera. Please try again.');
            }
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => {
                track.stop();
            });
            setStream(null);
        }
        setIsReady(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !isReady) {
            console.error('Video not ready for capture');
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current || document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        const capturedImage = {
            id: Date.now(),
            src: dataUrl,
            timestamp: new Date().toLocaleString(),
            width: canvas.width,
            height: canvas.height
        };

        if (onCapture) {
            onCapture(capturedImage);
        }
    };

    const switchCamera = () => {
        const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
        setFacingMode(newFacingMode);
        setIsReady(false);
    };

    const handleClose = () => {
        stopCamera();
        if (onClose) {
            onClose();
        }
    };

    if (error) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 m-4 max-w-sm">
                    <div className="text-center">
                        <Camera className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Camera Error</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <div className="space-y-2">
                            <button
                                onClick={startCamera}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={handleClose}
                                className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            <div className="flex justify-between items-center p-4 bg-black text-white">
                <button
                    onClick={handleClose}
                    className="flex items-center text-white hover:text-gray-300 transition-colors"
                >
                    <X className="w-6 h-6 mr-2" />
                    Close
                </button>
                <h2 className="text-lg font-semibold">Camera</h2>
                <button
                    onClick={switchCamera}
                    className="text-white hover:text-gray-300 transition-colors text-sm"
                >
                    {facingMode === 'environment' ? 'Front' : 'Back'}
                </button>
            </div>

            <div className="flex-1 relative overflow-hidden">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                />
                
                {!isReady && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                        <div className="text-center text-white">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                            <p>Starting camera...</p>
                        </div>
                    </div>
                )}

                {isReady && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                        <button
                            onClick={capturePhoto}
                            className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 hover:border-gray-400 transition-all shadow-lg flex items-center justify-center"
                            title="Take a photo"
                        >
                            <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-400"></div>
                        </button>
                        <p className="text-white text-sm text-center mt-2">Tap to Capture</p>
                    </div>
                )}

                {isReady && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-4">
                            <div className="w-full h-full border border-white border-opacity-30">
                                <div className="absolute top-1/3 left-0 right-0 border-t border-white border-opacity-20"></div>
                                <div className="absolute top-2/3 left-0 right-0 border-t border-white border-opacity-20"></div>
                                <div className="absolute left-1/3 top-0 bottom-0 border-l border-white border-opacity-20"></div>
                                <div className="absolute left-2/3 top-0 bottom-0 border-l border-white border-opacity-20"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Configuration - Update these based on your setup
// API Configuration - Use environment variable for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const PHONE_DATABASE = ['+919123605369']; // Should match your backend

const BackButton = ({ onClick }) => (
    <button onClick={onClick} className="flex items-center text-slate-600 hover:text-slate-800 transition-colors mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="font-medium">Back to Dashboard</span>
    </button>
);

// Voice Mode Interface Component
const VoiceModeInterface = ({ 
    voiceStep, 
    voiceSteps, 
    currentVoiceField, 
    isListening, 
    selectedAnimal, 
    formData, 
    skipVoiceStep, 
    exitVoiceMode,
    askCurrentQuestion,
    startVoiceRecording,
    stopVoiceRecording,
    nextVoiceStep,
    testMicrophone,
    speechRecognition,
    liveTranscript,
    finalTranscript,
    saveCurrentVoiceInput,
    locationData,
    locationLoading,
    locationError,
    getCurrentLocation
}) => {
    const currentStep = voiceSteps[voiceStep];
    const progress = ((voiceStep + 1) / voiceSteps.length) * 100;
    
    // Check if current step has an answer
    const hasAnswer = () => {
        if (currentStep?.field === 'animalType') {
            return selectedAnimal && selectedAnimal.trim() !== '';
        }
        return formData[currentStep?.field] && formData[currentStep?.field].trim() !== '';
    };

    return (
        <div className="space-y-6">
            {/* Microphone Test Section */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-yellow-800 mb-1">Microphone Test</h4>
                        <p className="text-sm text-yellow-700">
                            If voice recording isn't working, test your microphone first.
                        </p>
                    </div>
                    <button
                        onClick={testMicrophone}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all text-sm"
                    >
                        Test Mic
                    </button>
                </div>
                <div className="mt-2 text-xs text-yellow-600">
                    Status: Speech Recognition {speechRecognition ? '✅ Available' : '❌ Not Available'}
                </div>
            </div>

            {/* Location Auto-Fill Section - Only show for location question */}
            {currentStep?.field === 'location' && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-blue-800">📍 Auto-Fill Location</h4>
                        <button
                            onClick={getCurrentLocation}
                            disabled={locationLoading}
                            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                                locationLoading 
                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {locationLoading ? 'Getting Location...' : 'Get GPS Location'}
                        </button>
                    </div>
                    
                    {locationLoading && (
                        <div className="flex items-center text-blue-700 text-sm">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                            Requesting location permission and getting coordinates...
                        </div>
                    )}
                    
                    {locationError && (
                        <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm">
                            <strong>Location Error:</strong> {locationError}
                            <br />
                            <span className="text-xs">You can still manually speak your location instead.</span>
                        </div>
                    )}
                    
                    {locationData && (
                        <div className="bg-green-50 border border-green-200 rounded p-3">
                            <div className="text-green-800 text-sm">
                                <strong>✓ Location Captured:</strong>
                                <br />
                                <span className="font-medium">{locationData.address}</span>
                                <br />
                                <span className="text-xs text-green-600">
                                    Coordinates: {locationData.latitude}, {locationData.longitude}
                                    {locationData.accuracy && ` (±${Math.round(locationData.accuracy)}m)`}
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    saveCurrentVoiceInput();
                                    nextVoiceStep();
                                }}
                                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm"
                            >
                                Use This Location & Continue
                            </button>
                        </div>
                    )}
                    
                    <div className="mt-3 text-xs text-blue-600">
                        <strong>Note:</strong> We'll automatically get your location, or you can speak it manually using the voice controls below.
                    </div>
                </div>
            )}

            {/* Speech Display Box */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 min-h-32">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-800">What you're saying:</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                        isListening ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                        {isListening ? 'Listening...' : 'Not listening'}
                    </span>
                </div>
                
                <div className="bg-gray-50 border rounded p-3 min-h-20">
                    {liveTranscript ? (
                        <p className="text-gray-800 whitespace-pre-wrap">
                            {liveTranscript}
                            {isListening && <span className="animate-pulse">|</span>}
                        </p>
                    ) : (
                        <p className="text-gray-400 italic">
                            {isListening ? 'Start speaking...' : 'Click "Start Recording" to begin speaking'}
                        </p>
                    )}
                </div>
                
                {finalTranscript && !isListening && (
                    <div className="mt-3 flex justify-between items-center">
                        <div className="text-sm text-green-700">
                            ✓ Speech captured successfully
                        </div>
                        <button
                            onClick={() => {
                                saveCurrentVoiceInput();
                                nextVoiceStep();
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                        >
                            Use This Answer & Continue
                        </button>
                    </div>
                )}
            </div>

            {/* Current Question */}
            <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Current Question */}
            <div className="text-center p-6 bg-blue-50 rounded-lg">
                <h4 className="text-lg font-bold text-blue-800 mb-2">
                    Question {voiceStep + 1} of {voiceSteps.length}
                </h4>
                <p className="text-blue-700 mb-4">
                    {currentStep?.question || "Processing..."}
                </p>
                
                {/* Manual Voice Controls */}
                <div className="flex justify-center space-x-4">
                    {!isListening ? (
                        <button
                            onClick={startVoiceRecording}
                            disabled={currentStep?.field === 'location' && locationData}
                            className={`px-6 py-3 rounded-lg transition-all flex items-center font-medium ${
                                currentStep?.field === 'location' && locationData
                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                        >
                            <Mic className="w-5 h-5 mr-2" />
                            {currentStep?.field === 'location' && locationData ? 'Location Auto-Filled' : 'Start Recording'}
                        </button>
                    ) : (
                        <button
                            onClick={stopVoiceRecording}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center font-medium"
                        >
                            <MicOff className="w-5 h-5 mr-2" />
                            Stop Recording
                        </button>
                    )}
                    
                    {/* Debug Button */}
                    <button
                        onClick={() => {
                            console.log('Debug button clicked');
                            console.log('Speech recognition available:', !!speechRecognition);
                            console.log('Current listening state:', isListening);
                            console.log('Voice mode active:', voiceMode);
                            console.log('Current voice field:', currentVoiceField);
                            console.log('Current voice step:', voiceStep);
                            console.log('Location data:', locationData);
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all text-sm"
                    >
                        Debug
                    </button>
                </div>
            </div>

            {/* Current Answer Display */}
            {selectedAnimal && currentStep?.field === 'animalType' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800"><strong>Animal:</strong> {selectedAnimal}</p>
                </div>
            )}
            
            {formData[currentStep?.field] && currentStep?.field !== 'animalType' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800"><strong>Your Answer:</strong> {formData[currentStep?.field]}</p>
                </div>
            )}

            {/* Listening Indicator */}
            {isListening && (
                <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                        <Mic className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-red-700 font-medium">Recording... Speak clearly and click "Stop Recording" when done</p>
                </div>
            )}

            {/* Navigation Controls */}
            <div className="flex justify-center space-x-4">
                {!currentStep?.required && (
                    <button
                        onClick={skipVoiceStep}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all flex items-center"
                    >
                        <SkipForward className="w-4 h-4 mr-2" />
                        Skip Question
                    </button>
                )}
                
                {finalTranscript && !isListening && (
                    <button
                        onClick={() => {
                            setLiveTranscript('');
                            setFinalTranscript('');
                        }}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all"
                    >
                        Clear & Retry
                    </button>
                )}
                
                <button
                    onClick={exitVoiceMode}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                    Exit Voice Mode
                </button>
            </div>

            {/* Instructions */}
            <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">
                    <strong>How to use Voice Mode:</strong>
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                    <li>1. Read the question above</li>
                    <li>2. Click "Start Recording" and speak your answer</li>
                    <li>3. Click "Stop Recording" when finished</li>
                    <li>4. Review your text in the box above</li>
                    <li>5. Click "Use This Answer & Continue" to proceed</li>
                </ul>
            </div>
        </div>
    );
};

const ReportComponent = ({ setCurrentRoute }) => {
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [capturedImages, setCapturedImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [debugInfo, setDebugInfo] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [backendStatus, setBackendStatus] = useState({ online: false, checked: false });
    const [formData, setFormData] = useState({
        reporterName: '',
        reporterPhone: '',
        reporterEmail: '',
        location: '',
        date: '',
        time: '',
        description: '',
        animalCount: '1',
        behavior: '',
        photos: []
    });

    // Speech recognition state
    const [isListening, setIsListening] = useState(false);
    const [speechRecognition, setSpeechRecognition] = useState(null);
    const [speechSupported, setSpeechSupported] = useState(false);
    const [liveTranscript, setLiveTranscript] = useState(''); // For real-time display
    const [finalTranscript, setFinalTranscript] = useState(''); // For final captured text
    
    // GPS location state
    const [locationData, setLocationData] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [locationPermission, setLocationPermission] = useState('prompt'); // 'granted', 'denied', 'prompt'
    
    // Voice mode state
    const [voiceMode, setVoiceMode] = useState(false);
    const [voiceStep, setVoiceStep] = useState(0);
    const [speechSynthesis, setSpeechSynthesis] = useState(null);
    const [currentVoiceField, setCurrentVoiceField] = useState('');
    
    const voiceSteps = [
        { field: 'animalType', question: "What animal did you see? For example, say elephant, tiger, bear, or any other animal.", required: true },
        { field: 'reporterName', question: "What is your name?", required: true },
        { field: 'location', question: "Where did you see the animal? Please mention the location or area name.", required: true },
        { field: 'description', question: "Please describe what you saw. Include details about the animal's behavior and surroundings.", required: true },
        { field: 'reporterPhone', question: "What is your phone number for emergency contact?", required: false }
    ];

    // Initialize speech recognition and synthesis on component mount
    useEffect(() => {
        console.log('Initializing speech recognition...');
        
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            console.log('Speech recognition API is available');
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'en-US';
            recognition.maxAlternatives = 1;
            
            recognition.onstart = () => {
                console.log('Speech recognition started');
                setIsListening(true);
                setLiveTranscript('');
                setFinalTranscript('');
            };
            
            recognition.onresult = (event) => {
                console.log('Speech recognition result received:', event);
                let finalText = '';
                let interimText = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    console.log(`Result ${i}:`, transcript, 'isFinal:', event.results[i].isFinal);
                    
                    if (event.results[i].isFinal) {
                        finalText += transcript;
                    } else {
                        interimText += transcript;
                    }
                }
                
                // Update live transcript for real-time display
                const combinedText = finalTranscript + finalText + interimText;
                setLiveTranscript(combinedText);
                
                // Only update final transcript when we have final results
                if (finalText) {
                    const newFinalTranscript = finalTranscript + finalText;
                    setFinalTranscript(newFinalTranscript);
                    console.log('Final transcript updated:', newFinalTranscript);
                }
            };
            
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error, event);
                setIsListening(false);
                
                let errorMessage = 'Speech recognition error: ';
                switch(event.error) {
                    case 'no-speech':
                        errorMessage += 'No speech was detected. Please try speaking again.';
                        break;
                    case 'audio-capture':
                        errorMessage += 'Audio capture failed. Please check your microphone connection.';
                        break;
                    case 'not-allowed':
                        errorMessage += 'Microphone permission denied. Please allow microphone access and refresh the page.';
                        break;
                    case 'network':
                        errorMessage += 'Network error occurred. Please check your internet connection.';
                        break;
                    default:
                        errorMessage += `${event.error}. Please try again.`;
                }
                
                console.error('Error message:', errorMessage);
                alert(errorMessage);
            };
            
            recognition.onend = () => {
                setIsListening(false);
                console.log('Speech recognition ended');
                
                // Removed auto-advance - now manual control only
            };
            
            setSpeechRecognition(recognition);
            setSpeechSupported(true);
            console.log('Speech recognition initialized successfully');
        } else {
            setSpeechSupported(false);
            console.log('Speech recognition not supported in this browser');
        }

        // Initialize Speech Synthesis
        if ('speechSynthesis' in window) {
            console.log('Speech synthesis available');
            setSpeechSynthesis(window.speechSynthesis);
        } else {
            console.log('Speech synthesis not available');
        }
    }, []); // Keep empty dependency array for initialization

    // Speech recognition functions
    const startListening = () => {
        if (speechRecognition && !isListening) {
            try {
                speechRecognition.start();
            } catch (error) {
                console.error('Error starting speech recognition:', error);
                alert('Could not start speech recognition. Please try again.');
            }
        }
    };

    const stopListening = () => {
        if (speechRecognition && isListening) {
            speechRecognition.stop();
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const clearDescription = () => {
        setFormData(prev => ({
            ...prev,
            description: ''
        }));
    };

    // Voice mode functions
    const speak = (text) => {
        if (speechSynthesis && 'speechSynthesis' in window) {
            // Cancel any ongoing speech
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;
            speechSynthesis.speak(utterance);
        }
    };

    const testMicrophone = async () => {
        console.log('Testing microphone access...');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log('Microphone access granted:', stream);
            alert('Microphone access granted! You can now use voice features.');
            // Stop the stream
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            console.error('Microphone access denied:', error);
            alert('Microphone access denied. Please allow microphone permissions and refresh the page.');
        }
    };

    // GPS Location functions
    const getCurrentLocation = () => {
        setLocationLoading(true);
        setLocationError(null);
        
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by this browser.');
            setLocationLoading(false);
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000 // Cache for 1 minute
        };

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                console.log('GPS position received:', position);
                const { latitude, longitude } = position.coords;
                
                try {
                    // Try to get readable address using reverse geocoding
                    const address = await reverseGeocode(latitude, longitude);
                    
                    const locationInfo = {
                        latitude: latitude.toFixed(6),
                        longitude: longitude.toFixed(6),
                        accuracy: position.coords.accuracy,
                        address: address,
                        timestamp: new Date().toISOString()
                    };
                    
                    setLocationData(locationInfo);
                    setLocationPermission('granted');
                    
                    // Auto-fill location in form
                    const locationString = address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                    setFormData(prev => ({
                        ...prev,
                        location: locationString
                    }));
                    
                    console.log('Location data:', locationInfo);
                } catch (error) {
                    console.error('Error processing location:', error);
                    // Use coordinates if reverse geocoding fails
                    const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                    setFormData(prev => ({
                        ...prev,
                        location: locationString
                    }));
                    setLocationData({
                        latitude: latitude.toFixed(6),
                        longitude: longitude.toFixed(6),
                        accuracy: position.coords.accuracy,
                        address: 'Address lookup failed',
                        timestamp: new Date().toISOString()
                    });
                }
                
                setLocationLoading(false);
            },
            (error) => {
                console.error('GPS error:', error);
                setLocationLoading(false);
                setLocationPermission('denied');
                
                let errorMessage = 'Location access failed: ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Permission denied. Please allow location access and try again.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out. Please try again.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred.';
                        break;
                }
                
                setLocationError(errorMessage);
            },
            options
        );
    };

    // Simple reverse geocoding using a free service
    const reverseGeocode = async (lat, lon) => {
        try {
            // Using OpenStreetMap Nominatim API (free, no API key required)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'MAITRI Wildlife Reporting System'
                    }
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                console.log('Reverse geocoding result:', data);
                
                // Extract meaningful address components
                const address = data.address || {};
                const parts = [];
                
                if (address.village || address.town || address.city) {
                    parts.push(address.village || address.town || address.city);
                }
                if (address.state_district || address.county) {
                    parts.push(address.state_district || address.county);
                }
                if (address.state) {
                    parts.push(address.state);
                }
                if (address.country) {
                    parts.push(address.country);
                }
                
                return parts.length > 0 ? parts.join(', ') : data.display_name;
            }
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
        }
        
        return null; // Return null if geocoding fails
    };

    const startVoiceMode = () => {
        setVoiceMode(true);
        setVoiceStep(0);
        
        // Set defaults for voice mode
        const now = new Date();
        setFormData(prev => ({
            ...prev,
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().slice(0, 5),
            animalCount: '1',
            behavior: 'Unknown',
            reporterEmail: ''
        }));
        
        // Removed audio greeting - now silent
        setTimeout(() => askCurrentQuestion(), 1000);
    };

    const exitVoiceMode = () => {
        setVoiceMode(false);
        setVoiceStep(0);
        setCurrentVoiceField('');
        if (speechSynthesis) speechSynthesis.cancel();
        if (speechRecognition && isListening) speechRecognition.stop();
    };

    const askCurrentQuestion = () => {
        if (voiceStep < voiceSteps.length) {
            const step = voiceSteps[voiceStep];
            setCurrentVoiceField(step.field);
            
            // Clear text box when asking a new question
            setLiveTranscript('');
            setFinalTranscript('');
            
            // Auto-trigger GPS for location question
            if (step.field === 'location' && !locationData) {
                console.log('Auto-requesting GPS location for location question');
                getCurrentLocation();
            }
        } else {
            completeVoiceMode();
        }
    };

    const handleVoiceInput = (transcript) => {
        const step = voiceSteps[voiceStep];
        
        if (step.field === 'animalType') {
            setSelectedAnimal(transcript);
        } else {
            setFormData(prev => ({
                ...prev,
                [step.field]: transcript
            }));
        }
        
        speak(`Got it. You said: ${transcript}.`);
    };

    const startVoiceRecording = () => {
        console.log('startVoiceRecording called');
        console.log('speechRecognition:', speechRecognition);
        console.log('isListening:', isListening);
        console.log('voiceMode:', voiceMode);
        
        if (speechRecognition && !isListening && voiceMode) {
            try {
                console.log('Starting speech recognition...');
                speechRecognition.start();
            } catch (error) {
                console.error('Error starting speech recognition:', error);
                alert('Could not start speech recognition. Please try again.');
            }
        } else {
            console.log('Cannot start recording:', {
                speechRecognition: !!speechRecognition,
                isListening,
                voiceMode
            });
        }
    };

    const stopVoiceRecording = () => {
        console.log('stopVoiceRecording called');
        if (speechRecognition && isListening) {
            console.log('Stopping speech recognition...');
            speechRecognition.stop();
        }
    };

    const saveCurrentVoiceInput = () => {
        if (finalTranscript.trim()) {
            const step = voiceSteps[voiceStep];
            if (step) {
                if (step.field === 'animalType') {
                    setSelectedAnimal(finalTranscript.trim());
                } else {
                    setFormData(prev => ({
                        ...prev,
                        [step.field]: finalTranscript.trim()
                    }));
                }
                console.log(`Saved ${step.field} with:`, finalTranscript.trim());
            }
        }
    };

    const nextVoiceStep = () => {
        // Clear the text box when moving to next question
        setLiveTranscript('');
        setFinalTranscript('');
        
        if (voiceStep < voiceSteps.length - 1) {
            setVoiceStep(voiceStep + 1);
            setTimeout(() => askCurrentQuestion(), 2000);
        } else {
            completeVoiceMode();
        }
    };

    const skipVoiceStep = () => {
        const step = voiceSteps[voiceStep];
        if (!step.required) {
            // Removed audio confirmation - now silent
            nextVoiceStep();
        }
    };

    const completeVoiceMode = () => {
        // Removed audio completion message - now silent
        setVoiceMode(false);
        setCurrentVoiceField('');
        setShowForm(true);
    };

    // Check backend connectivity on component mount
    useEffect(() => {
        checkBackendStatus();
    }, []);

    const checkBackendStatus = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/test`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setBackendStatus({ 
                    online: true, 
                    checked: true, 
                    message: data.message,
                    twilioConfigured: data.twilioConfigured 
                });
                console.log('✅ Backend is online:', data);
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('❌ Backend connection failed:', error);
            setBackendStatus({ 
                online: false, 
                checked: true, 
                error: error.message 
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCapture = (capturedImage) => {
        setCapturedImages(prev => [...prev, capturedImage]);
        setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, capturedImage]
        }));
        console.log('Photo captured successfully!');
    };

    const retakePhoto = (imageId) => {
        setCapturedImages(prev => prev.filter(img => img.id !== imageId));
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter(img => img.id !== imageId)
        }));
    };

    const openCamera = () => setShowCamera(true);
    const closeCamera = () => setShowCamera(false);
    const handleInitialSubmit = () => {
        if (selectedAnimal) {
            setShowForm(true);
        }
    };

    // Updated SMS function with proper error handling
    const sendSMSAlert = async (messageContent) => {
        const timestamp = new Date().toISOString();
        setDebugInfo(`[${timestamp}] 🚀 Starting SMS send process...`);
        
        try {
            // Check if backend is online first
            if (!backendStatus.online) {
                throw new Error('Backend server is not available. Please ensure server is running on port 5000.');
            }

            const requestUrl = `${API_BASE_URL}/send-sms`;
            const requestBody = { message: messageContent };
            
            setDebugInfo(prev => prev + `\n[${timestamp}] 📡 Sending request to: ${requestUrl}`);
            setDebugInfo(prev => prev + `\n[${timestamp}] 📝 Request body: ${JSON.stringify(requestBody, null, 2)}`);

            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            setDebugInfo(prev => prev + `\n[${timestamp}] 📥 Response received - Status: ${response.status}`);
            setDebugInfo(prev => prev + `\n[${timestamp}] 📥 Response OK: ${response.ok}`);

            // Get response text first
            const responseText = await response.text();
            setDebugInfo(prev => prev + `\n[${timestamp}] 📄 Raw response: ${responseText}`);

            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error(`Invalid JSON response: ${responseText}`);
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${responseData.error || responseData.message || 'Unknown error'}`);
            }

            setDebugInfo(prev => prev + `\n[${timestamp}] ✅ Response Data: ${JSON.stringify(responseData, null, 2)}`);
            
            return responseData;

        } catch (error) {
            const errorTimestamp = new Date().toISOString();
            const errorMessage = error.message || 'Unknown error occurred';
            
            setDebugInfo(prev => prev + `\n[${errorTimestamp}] ❌ SMS Error: ${errorMessage}`);
            
            if (error.name === 'TypeError' && errorMessage.includes('Failed to fetch')) {
                setDebugInfo(prev => prev + `\n[${errorTimestamp}] 🔗 Network Error: Cannot connect to backend server`);
                setDebugInfo(prev => prev + `\n[${errorTimestamp}] 💡 Make sure your backend server is running on ${API_BASE_URL}`);
            }
            
            console.error('SMS sending error:', error);
            
            return {
                success: false,
                error: errorMessage,
                details: error.toString()
            };
        }
    };

    // Updated form submission with better error handling
    const handleFormSubmit = async () => {
  if (!isFormValid()) return; // don't submit if form invalid

  setIsSubmitting(true);
  try {
    const response = await fetch(`${API_BASE_URL}/send-sms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: formData.description, // 👈 send the textarea content
      }),
    });

    const data = await response.json();
    if (data.success) {
      alert("SMS sent successfully!");
      setFormData({ ...formData, description: "" }); // clear description
    } else {
      alert("Failed to send SMS: " + data.error);
    }
  } catch (err) {
    console.error("Error sending SMS:", err);
    alert("Something went wrong while sending SMS");
  } finally {
    setIsSubmitting(false);
  }
};


    const isFormValid = () => {
        return formData.reporterName && 
               formData.reporterPhone && 
               formData.location && 
               formData.date && 
               formData.time && 
               formData.description;
    };

    if (showCamera) {
        return <NativeCamera onCapture={handleCapture} onClose={closeCamera} />;
    }

    if (showSuccess) {
        return (
            <div className="space-y-6">
                <BackButton onClick={() => setCurrentRoute('/')} />
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Report Submitted Successfully!</h2>
                    <p className="text-slate-600 mb-4">
                        SMS notifications have been sent to {PHONE_DATABASE.length} registered contacts.
                    </p>
                    <p className="text-sm text-slate-500">
                        Redirecting to dashboard in a few seconds...
                    </p>
                </div>
            </div>
        );
    }

    if (showForm) {
        return (
            <div className="space-y-6">
                <BackButton onClick={() => setShowForm(false)} />
                
                {/* Backend Status Indicator */}
                {backendStatus.checked && (
                    <div className={`p-4 rounded-lg border ${
                        backendStatus.online 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                    }`}>
                        <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                                backendStatus.online ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            <span className={`text-sm font-medium ${
                                backendStatus.online ? 'text-green-800' : 'text-red-800'
                            }`}>
                                Backend Status: {backendStatus.online ? 'Online' : 'Offline'}
                            </span>
                        </div>
                        {!backendStatus.online && (
                            <p className="text-red-600 text-sm mt-1">
                                Please ensure your backend server is running on {API_BASE_URL}
                            </p>
                        )}
                        {backendStatus.online && backendStatus.twilioConfigured === false && (
                            <p className="text-yellow-600 text-sm mt-1">
                                ⚠️ Twilio credentials not configured in backend
                            </p>
                        )}
                    </div>
                )}

                {/* Error Display */}
                {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-bold text-red-800 text-sm mb-2">Submission Error:</h4>
                        <p className="text-red-600 text-sm">{submitError}</p>
                    </div>
                )}
                
                {/* Debug Info Panel - Remove this in production */}
                {debugInfo && (
                    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                        <h4 className="font-bold text-sm mb-2">Debug Information:</h4>
                        <pre className="text-xs whitespace-pre-wrap overflow-x-auto bg-white p-2 rounded border max-h-40 overflow-y-auto">
                            {debugInfo}
                        </pre>
                    </div>
                )}

                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-3">Complete Your Report</h1>
                    <div className="flex items-center space-x-2">
                        <div className="px-3 py-1 bg-emerald-100 rounded-full">
                            <span className="text-emerald-700 font-medium text-sm">Animal: {selectedAnimal}</span>
                        </div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-slate-600 text-sm">Quick reporting form</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-white via-slate-50/30 to-white rounded-2xl shadow-xl p-8 space-y-8 border border-slate-200/50 backdrop-blur-sm">
                    {/* Reporter Information */}
                    <div className="bg-gradient-to-r from-emerald-50/50 to-white p-6 rounded-xl border border-emerald-100/50">
                        <h3 className="text-xl font-bold mb-5 flex items-center text-slate-800">
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg mr-3 shadow-lg">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            Reporter Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="reporterName"
                                    value={formData.reporterName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md group-hover:border-slate-300"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            <div className="group">
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="reporterPhone"
                                    value={formData.reporterPhone}
                                    onChange={handleInputChange}
                                    placeholder="+91XXXXXXXXXX"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md group-hover:border-slate-300"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2 group">
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Email (Optional)
                                </label>
                                <input
                                    type="email"
                                    name="reporterEmail"
                                    value={formData.reporterEmail}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md group-hover:border-slate-300"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sighting Details */}
                    <div className="bg-gradient-to-r from-blue-50/50 to-white p-6 rounded-xl border border-blue-100/50">
                        <h3 className="text-xl font-bold mb-5 flex items-center text-slate-800">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mr-3 shadow-lg">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            Sighting Details
                        </h3>
                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Location *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Near Bandipur National Park, Karnataka"
                                        className="w-full px-4 py-3 pr-14 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md group-hover:border-slate-300"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={getCurrentLocation}
                                        disabled={locationLoading}
                                        className={`absolute right-3 top-3 p-2 rounded-lg transition-all duration-300 ${
                                            locationLoading
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                                        }`}
                                        title={locationLoading ? 'Getting location...' : 'Get current location'}
                                    >
                                        {locationLoading ? (
                                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <MapPin className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {locationData && (
                                    <div className="mt-2 flex items-center text-green-600">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        <span className="text-sm font-medium">Location auto-filled from GPS</span>
                                    </div>
                                )}
                                {locationError && (
                                    <div className="mt-2 flex items-center text-red-600">
                                        <X className="w-4 h-4 mr-1" />
                                        <span className="text-sm">{locationError}</span>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md group-hover:border-slate-300"
                                        required
                                    />
                                </div>
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        <Clock className="w-4 h-4 inline mr-2" />
                                        Time *
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md group-hover:border-slate-300"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        Number of Animals
                                    </label>
                                    <select
                                        name="animalCount"
                                        value={formData.animalCount}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md group-hover:border-slate-300"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '10+'].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        Behavior
                                    </label>
                                    <select
                                        name="behavior"
                                        value={formData.behavior}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md group-hover:border-slate-300"
                                    >
                                        <option value="">Select behavior</option>
                                        <option value="Calm/Peaceful">Calm/Peaceful</option>
                                        <option value="Aggressive">Aggressive</option>
                                        <option value="Feeding">Feeding</option>
                                        <option value="With young">With young</option>
                                        <option value="Crossing road">Crossing road</option>
                                        <option value="Near human settlement">Near human settlement</option>
                                        <option value="Injured">Injured</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="bg-gradient-to-r from-purple-50/50 to-white p-6 rounded-xl border border-purple-100/50">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Detailed Description *
                        </label>
                        <div className="relative group">
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Provide detailed description of the sighting, animal behavior, surroundings, etc. You can type or use the microphone button to speak."
                                rows="5"
                                className="w-full px-4 py-3 pr-24 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md group-hover:border-slate-300 resize-none"
                                required
                            />
                            <div className="absolute right-3 top-3 flex space-x-2">
                                {formData.description && (
                                    <button
                                        type="button"
                                        onClick={clearDescription}
                                        className="p-2 rounded-lg bg-gradient-to-r from-slate-500 to-slate-600 text-white hover:from-slate-600 hover:to-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                        title="Clear description"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                {speechSupported && (
                                    <button
                                        type="button"
                                        onClick={toggleListening}
                                        className={`p-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                            isListening 
                                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700' 
                                                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700'
                                        }`}
                                        title={isListening ? 'Stop recording' : 'Start voice input'}
                                    >
                                        {isListening ? (
                                            <MicOff className="w-4 h-4" />
                                        ) : (
                                            <Mic className="w-4 h-4" />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                            <div>
                                {speechSupported && isListening && (
                                    <div className="flex items-center bg-emerald-100 px-3 py-1 rounded-full">
                                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                                        <span className="text-emerald-700 text-sm font-medium">Listening... Speak clearly</span>
                                    </div>
                                )}
                                {!speechSupported && (
                                    <p className="text-sm text-slate-500">
                                        Voice input not supported in this browser. Please type your description.
                                    </p>
                                )}
                            </div>
                            <div className="text-sm text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                                {formData.description.length} characters
                            </div>
                        </div>
                        {speechSupported && (
                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs text-blue-700 font-medium mb-1">Voice Input Instructions:</p>
                                <ul className="text-xs text-blue-600 space-y-1">
                                    <li>• Click the microphone button to start/stop recording</li>
                                    <li>• Speak clearly and at a normal pace</li>
                                    <li>• Make sure your browser has microphone permission</li>
                                    <li>• You can combine typing and speaking for best results</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Photo Capture */}
                    <div className="bg-gradient-to-r from-amber-50/50 to-white p-6 rounded-xl border border-amber-100/50">
                        <label className="block text-sm font-semibold text-slate-700 mb-4">
                            <div className="flex items-center">
                                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg mr-3 shadow-lg">
                                    <Camera className="w-4 h-4 text-white" />
                                </div>
                                Photos
                            </div>
                        </label>
                        
                        <div className="space-y-6">
                            <button
                                type="button"
                                onClick={openCamera}
                                className="w-full px-6 py-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center space-x-3 group bg-white shadow-sm hover:shadow-lg transform hover:-translate-y-1"
                            >
                                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Camera className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-slate-700 font-medium group-hover:text-emerald-700 transition-colors duration-300">Open Camera to Take Photos</span>
                            </button>

                            {capturedImages.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-sm font-semibold text-slate-700">
                                            Captured Photos ({capturedImages.length})
                                        </p>
                                        <div className="px-3 py-1 bg-emerald-100 rounded-full">
                                            <span className="text-emerald-700 text-xs font-medium">Ready to submit</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {capturedImages.map((image) => (
                                            <div key={image.id} className="relative group">
                                                <img
                                                    src={image.src}
                                                    alt="Captured wildlife"
                                                    className="w-full h-32 object-cover rounded-xl border-2 border-slate-200 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => retakePhoto(image.id)}
                                                    className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full flex items-center justify-center text-xs hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                                                    title="Remove photo"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                                <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg text-center">
                                                    {image.timestamp}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 mt-3 bg-slate-50 p-3 rounded-lg">
                            📸 Click to open camera and capture photos of the wildlife sighting. High-quality images help our AI system better identify and track wildlife patterns.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-6 rounded-xl border border-emerald-100/50 mt-6">
                        <button
                            type="button"
                            onClick={handleFormSubmit}
                            disabled={!isFormValid() || isSubmitting || !backendStatus.online}
                            className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 transform flex items-center justify-center shadow-lg ${
                                isFormValid() && !isSubmitting && backendStatus.online
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white hover:scale-105 hover:shadow-xl'
                                    : 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-600 cursor-not-allowed shadow-sm'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    <span>Sending SMS Notifications...</span>
                                </>
                            ) : !backendStatus.online ? (
                                <>
                                    <div className="p-1 bg-white/20 rounded-lg mr-3">
                                        <X className="w-5 h-5" />
                                    </div>
                                    <span>Backend Offline - Cannot Submit</span>
                                </>
                            ) : (
                                <>
                                    <div className="p-1 bg-white/20 rounded-lg mr-3">
                                        <Send className="w-5 h-5" />
                                    </div>
                                    <span>Submit Report & Send SMS Alerts</span>
                                </>
                            )}
                        </button>

                        <div className="mt-4 space-y-2">
                            <p className="text-sm text-slate-600 text-center bg-white/70 p-3 rounded-lg">
                                📱 This will send SMS notifications to {PHONE_DATABASE.length} registered contacts
                            </p>

                            {!backendStatus.online && (
                                <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg border border-red-200">
                                    🔧 Please start your backend server on {API_BASE_URL} to enable SMS functionality
                                </p>
                            )}
                            
                            <p className="text-sm text-emerald-700 text-center bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                                🌿 Your report helps protect local wildlife and contributes to conservation efforts
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <BackButton onClick={() => setCurrentRoute('/')} />
            
            {/* Backend Status Indicator */}
            {backendStatus.checked && (
                <div className={`p-3 rounded-lg border ${
                    backendStatus.online 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-yellow-50 border-yellow-200'
                }`}>
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                            backendStatus.online ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className={`text-sm ${
                            backendStatus.online ? 'text-green-800' : 'text-yellow-800'
                        }`}>
                            {backendStatus.online 
                                ? 'SMS service is online and ready' 
                                : 'SMS service is offline - reports will be saved locally'
                            }
                        </span>
                        <button
                            onClick={checkBackendStatus}
                            className="ml-auto text-xs px-2 py-1 rounded bg-white border hover:bg-gray-50"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            )}

            <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Submit Report</h1>
                <p className="text-slate-600">Report wildlife sightings to help our AI system</p>
            </div>

            {/* Voice Mode Information Banner */}
            {speechSupported && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <Mic className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-800 mb-1">Voice Mode Available</h4>
                            <p className="text-sm text-blue-700 mb-2">
                                Use voice mode for hands-free reporting! You control when to record:
                            </p>
                            <ul className="text-xs text-blue-600 space-y-1">
                                <li>• Click "Start Recording" when ready to speak</li>
                                <li>• Answer questions about animal, location, and description</li>
                                <li>• Click "Stop Recording" when done speaking</li>
                                <li>• Click "Next" to move to the next question</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">What did you see?</h3>
                    {speechSupported && (
                        <button
                            onClick={startVoiceMode}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                        >
                            <Mic className="w-4 h-4 mr-2" />
                            Use Voice Mode
                        </button>
                    )}
                </div>

                {!voiceMode ? (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {['Elephant', 'Tiger', 'Sloth Bear', 'Leopard', 'Wild Boar', 'Gaur', 'Deer', 'Monkey', 'Rhino'].map((animal) => {
                                const emojis = {
                                    Elephant: '🐘',
                                    Tiger: '🐅',
                                    'Sloth Bear': '🐻',
                                    Leopard: '🐆',
                                    'Wild Boar': '🐗',
                                    Gaur: '🐃',
                                    Deer: '🦌',
                                    Monkey: '🐒',
                                    Rhino: '🦏',
                                };

                                return (
                                    <button
                                        key={animal}
                                        onClick={() => setSelectedAnimal(animal)}
                                        className={`p-4 rounded-lg border-2 transition-all ${
                                            selectedAnimal === animal
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="text-2xl mb-2">{emojis[animal]}</div>
                                        <p className="font-medium">{animal}</p>
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={handleInitialSubmit}
                            disabled={!selectedAnimal}
                            className={`w-full py-4 rounded-lg font-medium transition-all ${
                                selectedAnimal
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            Continue to Report Details
                        </button>
                    </>
                ) : (
                    <VoiceModeInterface 
                        voiceStep={voiceStep}
                        voiceSteps={voiceSteps}
                        currentVoiceField={currentVoiceField}
                        isListening={isListening}
                        selectedAnimal={selectedAnimal}
                        formData={formData}
                        skipVoiceStep={skipVoiceStep}
                        exitVoiceMode={exitVoiceMode}
                        askCurrentQuestion={askCurrentQuestion}
                        startVoiceRecording={startVoiceRecording}
                        stopVoiceRecording={stopVoiceRecording}
                        nextVoiceStep={nextVoiceStep}
                        testMicrophone={testMicrophone}
                        speechRecognition={speechRecognition}
                        liveTranscript={liveTranscript}
                        finalTranscript={finalTranscript}
                        saveCurrentVoiceInput={saveCurrentVoiceInput}
                        locationData={locationData}
                        locationLoading={locationLoading}
                        locationError={locationError}
                        getCurrentLocation={getCurrentLocation}
                    />
                )}
            </div>
        </div>
    );
};

export default ReportComponent;
