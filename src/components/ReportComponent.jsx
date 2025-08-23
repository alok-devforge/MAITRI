import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, Camera, User, Send, CheckCircle, X, Play, Square } from 'lucide-react';

// Native Camera component using only browser APIs
const NativeCamera = ({ onCapture, onClose, className }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState(null);
    const [facingMode, setFacingMode] = useState('environment'); // 'user' for front, 'environment' for back

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [facingMode]);

    const startCamera = async () => {
        try {
            setError(null);
            
            // Stop existing stream if any
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            // Request camera access with constraints
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

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // Create image object with metadata
        const capturedImage = {
            id: Date.now(),
            src: dataUrl,
            timestamp: new Date().toLocaleString(),
            width: canvas.width,
            height: canvas.height
        };

        // Call the onCapture callback
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
            {/* Hidden canvas for image capture */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            {/* Camera Header */}
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

            {/* Camera View */}
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

                {/* Capture Button */}
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

                {/* Camera Guidelines */}
                {isReady && (
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Grid lines for better composition */}
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

// Mock database of phone numbers (in a real app, this would come from your backend)
const PHONE_DATABASE = [
    '+1234567890',
    '+1987654321',
    '+1122334455',
    '+1555666777'
];

const BackButton = ({ onClick }) => (
    <button onClick={onClick} className="flex items-center text-slate-600 hover:text-slate-800 transition-colors mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="font-medium">Back to Dashboard</span>
    </button>
);

const ReportComponent = ({ setCurrentRoute }) => {
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [capturedImages, setCapturedImages] = useState([]);
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Camera functions
    const handleCapture = (capturedImage) => {
        setCapturedImages(prev => [...prev, capturedImage]);
        setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, capturedImage]
        }));
        
        // Show success feedback
        console.log('Photo captured successfully!');
    };

    const retakePhoto = (imageId) => {
        setCapturedImages(prev => prev.filter(img => img.id !== imageId));
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter(img => img.id !== imageId)
        }));
    };

    const openCamera = () => {
        setShowCamera(true);
    };

    const closeCamera = () => {
        setShowCamera(false);
    };

    const handleInitialSubmit = () => {
        if (selectedAnimal) {
            setShowForm(true);
        }
    };

    const simulateSMSService = async (phoneNumbers, message) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('SMS sent to:', phoneNumbers);
        console.log('Message:', message);
        return { success: true, sentCount: phoneNumbers.length };
    };

    const handleFormSubmit = async () => {
        if (!isFormValid()) return;
        setIsSubmitting(true);

        try {
            const smsMessage = `🚨 WILDLIFE ALERT 🚨
Animal: ${selectedAnimal}
Location: ${formData.location}
Date/Time: ${formData.date} at ${formData.time}
Reported by: ${formData.reporterName}
Count: ${formData.animalCount}
Behavior: ${formData.behavior || 'Not specified'}
Description: ${formData.description}

Stay alert and follow safety protocols.`;

            const result = await simulateSMSService(PHONE_DATABASE, smsMessage);
            
            if (result.success) {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowForm(false);
                    setShowSuccess(false);
                    setSelectedAnimal(null);
                    setFormData({
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
                    setCapturedImages([]);
                }, 3000);
            }
        } catch (error) {
            console.error('Error sending SMS:', error);
            alert('Failed to send notifications. Please try again.');
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
        return (
            <NativeCamera
                onCapture={handleCapture}
                onClose={closeCamera}
            />
        );
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
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Complete Your Report</h1>
                    <p className="text-slate-600">Animal: <span className="font-semibold text-emerald-600">{selectedAnimal}</span></p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                    {/* Reporter Information */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Reporter Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="reporterName"
                                    value={formData.reporterName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="reporterPhone"
                                    value={formData.reporterPhone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email (Optional)
                                </label>
                                <input
                                    type="email"
                                    name="reporterEmail"
                                    value={formData.reporterEmail}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sighting Details */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                            <MapPin className="w-5 h-5 mr-2" />
                            Sighting Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Near Bandipur National Park, Karnataka"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        Time *
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Number of Animals
                                    </label>
                                    <select
                                        name="animalCount"
                                        value={formData.animalCount}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '10+'].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Behavior
                                    </label>
                                    <select
                                        name="behavior"
                                        value={formData.behavior}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Detailed Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Provide detailed description of the sighting, animal behavior, surroundings, etc."
                            rows="4"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                        />
                    </div>

                    {/* Photo Capture */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            <Camera className="w-4 h-4 inline mr-1" />
                            Photos
                        </label>
                        
                        {/* Camera Button */}
                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={openCamera}
                                className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors flex items-center justify-center space-x-2"
                            >
                                <Camera className="w-5 h-5 text-slate-500" />
                                <span className="text-slate-600">Open Camera to Take Photos</span>
                            </button>

                            {/* Captured Images Display */}
                            {capturedImages.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-slate-700 mb-2">
                                        Captured Photos ({capturedImages.length})
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {capturedImages.map((image) => (
                                            <div key={image.id} className="relative">
                                                <img
                                                    src={image.src}
                                                    alt="Captured wildlife"
                                                    className="w-full h-24 object-cover rounded-lg border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => retakePhoto(image.id)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                                    title="Remove photo"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                                <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded text-center">
                                                    {image.timestamp}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Click to open camera and capture photos of the wildlife sighting
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleFormSubmit}
                            disabled={!isFormValid() || isSubmitting}
                            className={`w-full py-4 rounded-lg font-medium transition-all flex items-center justify-center ${
                                isFormValid() && !isSubmitting
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Sending SMS Notifications...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    Submit Report & Send SMS Alerts
                                </>
                            )}
                        </button>
                        <p className="text-xs text-slate-500 mt-2 text-center">
                            This will send SMS notifications to {PHONE_DATABASE.length} registered contacts
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <BackButton onClick={() => setCurrentRoute('/')} />
            <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Submit Report</h1>
                <p className="text-slate-600">Report wildlife sightings to help our AI system</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-lg font-bold mb-6">What did you see?</h3>

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
            </div>
        </div>
    );
};

export default ReportComponent;