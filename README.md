# Math Fun - Progressive Web App & Android App

Math Fun is an interactive educational application designed to help children with learning disabilities master multiplication and division concepts.

## Project Structure

This repository contains both:

1. **PWA (Progressive Web App)** - Web application with offline capabilities
2. **Android Wrapper** - Native Android app that embeds the PWA content

## Progressive Web App Features

- **Offline Support**: Service worker caching for offline access
- **Responsive Design**: Works on all screen sizes
- **Interactive Lessons**: Using Concrete-Representational-Abstract method
- **Games**: Fun activities to practice multiplication and division
- **Progress Tracking**: Local storage to save learning progress
- **Accessibility**: Settings for font sizes, contrast, animations

### PWA Development

To work with the PWA:

1. Serve the app using a local development server
2. Open in Chrome for PWA testing
3. Use Chrome DevTools Application tab to debug Service Worker

## Android App Features

- Embeds the PWA in a WebView
- Full JavaScript support
- Adds native Android features
- Splash screen and app icon
- Handles offline mode

### Android Development

To build the Android app:

1. Open the `android` folder in Android Studio
2. Update the WebView URL in `MainActivity.kt` to point to your PWA
3. Build and deploy using standard Android development workflow

## Future Enhancements

- Push notifications
- Native file access
- Camera integration
- More interactive games
- Online multiplayer capabilities
- Teacher dashboard

## Getting Started

1. Clone this repository
2. For web development, use any HTTP server to serve the files
3. For Android development, open the android folder in Android Studio

## License

[Insert license information here]
