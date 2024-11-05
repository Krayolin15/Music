document.addEventListener('DOMContentLoaded', function() {
    const audioElements = document.querySelectorAll('audio');

    // Function to pause other audio when one is playing
    audioElements.forEach(audio => {
        audio.addEventListener('play', () => {
            audioElements.forEach(otherAudio => {
                if (otherAudio !== audio) {
                    otherAudio.pause();
                }
            });
        });
    });



    // Adding volume control for each audio
    audioElements.forEach((audio, index) => {
        const volumeControl = document.createElement('input');
        volumeControl.type = 'range';
        volumeControl.min = 0;
        volumeControl.max = 1;
        volumeControl.step = 0.1;
        volumeControl.value = audio.volume;
        volumeControl.classList.add('volume-slider');

        audio.parentNode.insertBefore(volumeControl, audio.nextSibling);

        volumeControl.addEventListener('input', () => {
            audio.volume = volumeControl.value;
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const audioElements = document.querySelectorAll('audio');

    // Function to pause other audio when one is playing
    audioElements.forEach(audio => {
        audio.addEventListener('play', () => {
            audioElements.forEach(otherAudio => {
                if (otherAudio !== audio) {
                    otherAudio.pause();
                }
            });
        });
    });

    // Volume Fade Out on Pause
    function fadeOutAudio(audio) {
        const fadeOutInterval = setInterval(() => {
            if (audio.volume > 0.1) {
                audio.volume -= 0.1;
            } else {
                audio.pause();
                audio.volume = 1.0; // Reset volume after pausing
                clearInterval(fadeOutInterval);
            }
        }, 100); // Adjusts every 100ms for a gradual fade
    }

    audioElements.forEach(audio => {
        audio.addEventListener('pause', () => {
            fadeOutAudio(audio);
        });
    });

    // Auto-Pause on Tab Visibility Change
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            audioElements.forEach(audio => {
                if (!audio.paused) {
                    audio.pause();
                    audio.dataset.wasPlaying = true; // Store playing state
                }
            });
        } else {
            // Resume audio if it was playing before visibility change
            audioElements.forEach(audio => {
                if (audio.dataset.wasPlaying) {
                    audio.play();
                    delete audio.dataset.wasPlaying;
                }
            });
        }
    });

    // Enable Looping for all audio elements
    audioElements.forEach(audio => {
        audio.loop = true; // Set each audio to loop
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const audioElements = document.querySelectorAll('audio');
    let playHistory = new Map(); // Track play count and total playtime for each audio

    // Randomized Playback Order
    let randomizedOrder = Array.from(audioElements);
    shuffleArray(randomizedOrder);

    // Start playing the first audio in the randomized order
    let currentIndex = 0;
    playAudio(randomizedOrder[currentIndex]);

    // Function to play an audio element
    function playAudio(audio) {
        audio.play();
        trackPlayCount(audio);

        audio.addEventListener('ended', () => {
            currentIndex = (currentIndex + 1) % randomizedOrder.length;
            crossfadeAudio(audio, randomizedOrder[currentIndex]); // Crossfade to the next audio
        });
    }

    // Crossfade from one audio to another
    function crossfadeAudio(currentAudio, nextAudio) {
        let fadeOutInterval = setInterval(() => {
            if (currentAudio.volume > 0.1) {
                currentAudio.volume -= 0.1;
            } else {
                clearInterval(fadeOutInterval);
                currentAudio.pause();
                currentAudio.volume = 1.0; // Reset volume for next use
            }
        }, 100);

        nextAudio.volume = 0;
        nextAudio.play();
        let fadeInInterval = setInterval(() => {
            if (nextAudio.volume < 1.0) {
                nextAudio.volume += 0.1;
            } else {
                clearInterval(fadeInInterval);
            }
        }, 100);
    }

    // Track play count and playtime for each audio
    function trackPlayCount(audio) {
        if (!playHistory.has(audio)) {
            playHistory.set(audio, { count: 0, totalTime: 0 });
        }

        let startTime = Date.now();
        let data = playHistory.get(audio);
        data.count += 1;

        audio.addEventListener('pause', () => {
            data.totalTime += (Date.now() - startTime) / 1000; // Track playtime in seconds
            playHistory.set(audio, data); // Update play history
        });
    }

    // Automatic Volume Balancing (Simulated based on time of day)
    setInterval(() => {
        const hour = new Date().getHours();
        let targetVolume = hour >= 21 || hour < 8 ? 0.5 : 1.0; // Quieter at night

        audioElements.forEach(audio => {
            audio.volume = targetVolume;
        });
    }, 60000); // Check every minute

    // Shuffle array helper function
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Auto-Save Form Data to Local Storage
    const formElements = document.querySelectorAll('input, textarea, select');
    
    formElements.forEach(element => {
        // Load saved data if exists
        const savedData = localStorage.getItem(element.name);
        if (savedData) {
            element.value = savedData;
        }

        // Save data on input
        element.addEventListener('input', () => {
            localStorage.setItem(element.name, element.value);
        });
    });

    // Inactivity Timeout Warning
    let inactivityTimeout;
    const inactivityLimit = 5 * 60 * 1000; // 5 minutes
    const inactivityWarning = () => alert('You have been inactive for a while. Please continue or you may be logged out.');

    const resetInactivityTimer = () => {
        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(inactivityWarning, inactivityLimit);
    };

    // Reset timer on user activity
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keydown', resetInactivityTimer);
    document.addEventListener('click', resetInactivityTimer);
    resetInactivityTimer(); // Start timer initially

    // Background Theme Switcher Based on Time of Day
    function applyThemeBasedOnTime() {
        const hour = new Date().getHours();
        const darkMode = (hour >= 19 || hour < 7); // Enable dark mode between 7 PM and 7 AM

        if (darkMode) {
            document.documentElement.style.setProperty('--background-color', '#121212');
            document.documentElement.style.setProperty('--text-color', '#ffffff');
        } else {
            document.documentElement.style.setProperty('--background-color', '#ffffff');
            document.documentElement.style.setProperty('--text-color', '#121212');
        }
    }

    applyThemeBasedOnTime(); // Apply theme on load
    setInterval(applyThemeBasedOnTime, 60000); // Check and update theme every minute

    // Page Scroll Position Memory
    const scrollPositionKey = 'scrollPosition';
    
    // Save scroll position before the page unloads
    window.addEventListener('beforeunload', () => {
        localStorage.setItem(scrollPositionKey, window.scrollY);
    });

    // Restore scroll position on page load
    const savedScrollPosition = localStorage.getItem(scrollPositionKey);
    if (savedScrollPosition) {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const audioElement = document.getElementById('audioElement');
    const popup = document.getElementById('popup');
    const yesButton = document.getElementById('yesButton');
    const noButton = document.getElementById('noButton');

    // Show the popup when the user tries to leave the page
    window.onbeforeunload = function(event) {
        if (!audioElement.paused) {
            event.preventDefault();
            event.returnValue = ''; // Trigger the confirmation dialog
            showPopup(); // Show custom popup
            return ''; // For some browsers
        }
    };

    function showPopup() {
        popup.style.display = 'flex'; // Show the popup
    }

    // Handle the Yes button
    yesButton.addEventListener('click', function() {
        popup.style.display = 'none'; // Hide the popup
        // Do nothing; allow the audio to continue
    });

    // Handle the No button
    noButton.addEventListener('click', function() {
        audioElement.pause(); // Pause the audio
        popup.style.display = 'none'; // Hide the popup
        window.onbeforeunload = null; // Clear the unload event
        window.location.href = ''; // Allow navigation away
    });
});
