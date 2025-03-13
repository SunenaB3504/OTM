package com.mathfun.app

import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.webkit.JavascriptInterface
import android.widget.Toast

/**
 * Interface for communication between JavaScript and Android native code.
 * This allows the web application to access native device features.
 */
class WebAppInterface(private val context: Context) {
    
    /**
     * Shows a toast message
     * @param message The message to display
     */
    @JavascriptInterface
    fun showToast(message: String) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }
    
    /**
     * Provides haptic feedback (vibration)
     * @param duration Length of vibration in milliseconds
     */
    @JavascriptInterface
    fun vibrate(duration: Long) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
            val vibrator = vibratorManager.defaultVibrator
            vibrator.vibrate(VibrationEffect.createOneShot(duration, VibrationEffect.DEFAULT_AMPLITUDE))
        } else {
            @Suppress("DEPRECATION")
            val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(VibrationEffect.createOneShot(duration, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                vibrator.vibrate(duration)
            }
        }
    }
    
    /**
     * Checks if the device is online
     * @return true if the device has internet connectivity
     */
    @JavascriptInterface
    fun isOnline(): Boolean {
        // Implementation would check network connectivity
        // For example using ConnectivityManager
        return true // Placeholder
    }
    
    /**
     * Share content using Android's share functionality
     * @param title Share dialog title
     * @param text Text to share
     */
    @JavascriptInterface
    fun shareContent(title: String, text: String) {
        val intent = Intent().apply {
            action = Intent.ACTION_SEND
            type = "text/plain"
            putExtra(Intent.EXTRA_SUBJECT, title)
            putExtra(Intent.EXTRA_TEXT, text)
        }
        context.startActivity(Intent.createChooser(intent, title))
    }
    
    // Future enhancements:
    // - Access device camera
    // - Save/load files
    // - Trigger native notifications
    // - Access device location
    // - Store data securely
}
