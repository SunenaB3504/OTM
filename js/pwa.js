/**
 * Math Fun - PWA JavaScript
 * Handles service worker registration and PWA functionality
 */

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

// Variable to store deferred prompt for app installation
let deferredPrompt;

// Listen for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default browser install prompt
    e.preventDefault();
    
    // Store the event for later use
    deferredPrompt = e;
    
    // Show our custom install button
    showInstallButton();
});

// Function to show the install button
function showInstallButton() {
    const installButton = document.getElementById('install-button');
    
    if (installButton) {
        // Show the button only if it exists and we have a deferred prompt
        installButton.style.display = 'block';
        
        installButton.addEventListener('click', async () => {
            // If there's no deferred prompt, exit
            if (!deferredPrompt) return;
            
            // Show the install prompt
            deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to install prompt: ${outcome}`);
            
            // We've used the prompt, so we can't use it again
            deferredPrompt = null;
            
            // Hide the install button
            installButton.style.display = 'none';
        });
    }
}

// Listen for app installed event
window.addEventListener('appinstalled', (e) => {
    console.log('PWA was installed');
    
    // Hide the install button after successful installation
    const installButton = document.getElementById('install-button');
    if (installButton) {
        installButton.style.display = 'none';
    }
});

// Check if the app is launched in standalone mode (PWA installed)
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    console.log('App is running as installed PWA');
    // You can add specific behavior for when the app is running as an installed PWA
}

// Check online status
function updateOnlineStatus() {
    const status = navigator.onLine ? 'online' : 'offline';
    console.log(`App is ${status}`);
    
    // Display notification to user
    if (status === 'offline') {
        showOfflineToast();
    } else {
        hideOfflineToast();
    }
}

// Create an offline toast notification
function showOfflineToast() {
    // Check if toast already exists
    if (document.getElementById('offline-toast')) return;
    
    const toast = document.createElement('div');
    toast.id = 'offline-toast';
    toast.className = 'offline-toast';
    toast.innerHTML = '<i class="fas fa-wifi-slash"></i> You are offline. Some features may be limited.';
    
    document.body.appendChild(toast);
    
    // Show toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
}

// Hide the offline toast
function hideOfflineToast() {
    const toast = document.getElementById('offline-toast');
    if (toast) {
        toast.classList.remove('show');
        
        // Remove after animation completes
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
}

// Register online/offline event listeners
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Check status immediately
updateOnlineStatus();

// Handle background sync for future implementation
async function registerBackgroundSync() {
    // Check if service worker and background sync are supported
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        try {
            // Get service worker registration
            const registration = await navigator.serviceWorker.ready;
            
            // Register background sync
            await registration.sync.register('sync-progress');
            console.log('Background sync registered!');
        } catch (err) {
            console.log('Background sync registration failed:', err);
        }
    }
}

// Future implementation: Register for push notifications
async function registerPushNotifications() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('YOUR_PUBLIC_VAPID_KEY_HERE')
            });
            
            console.log('Push notification subscription:', subscription);
            
            // Send subscription to server (future implementation)
            // await saveSubscription(subscription);
        } catch (err) {
            console.log('Push notification subscription failed:', err);
        }
    }
}

// Helper function to convert base64 to Uint8Array for push notifications
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
}

// Add CSS for offline toast to the document
const style = document.createElement('style');
style.textContent = `
    .offline-toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        transition: transform 0.3s ease-in-out;
    }
    
    .offline-toast.show {
        transform: translateX(-50%) translateY(0);
    }
    
    .install-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: var(--accent-color);
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
    }
    
    .install-banner button {
        padding: 8px 16px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: var(--border-radius);
        cursor: pointer;
    }
`;
document.head.appendChild(style);
