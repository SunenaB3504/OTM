package com.mathfun.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import android.view.View
import android.widget.ProgressBar
import android.widget.Toast
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    
    // Website URL - replace with your actual domain when deployed
    private val websiteUrl = "https://mathfun.example.com" // For development, use: "http://10.0.2.2:8080"

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        // Handle splash screen transition
        installSplashScreen()
        
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Initialize views
        webView = findViewById(R.id.webview)
        progressBar = findViewById(R.id.progress_bar)
        
        // Configure WebView settings
        webView.settings.apply {
            javaScriptEnabled = true // Enable JavaScript
            domStorageEnabled = true // Enable DOM storage (localStorage)
            databaseEnabled = true // Enable database
            setGeolocationEnabled(true) // Enable geolocation if needed
            setSupportZoom(true) // Support zoom gestures
            builtInZoomControls = true // Use built-in zoom mechanisms
            displayZoomControls = false // Hide zoom controls
            loadWithOverviewMode = true // Load pages in overview mode
            useWideViewPort = true // Use wide viewport
            
            // Allow WebView to load files from assets directory
            allowFileAccess = true
            
            // These settings below are for advanced use cases:
            // allowFileAccessFromFileURLs = true
            // allowUniversalAccessFromFileURLs = true
        }
        
        // Set a WebViewClient to handle page navigation within the app
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                // Let the WebView handle the URL
                return false
            }
            
            override fun onPageFinished(view: WebView?, url: String?) {
                // Hide the progress bar when the page finishes loading
                progressBar.visibility = View.GONE
            }
            
            override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                super.onReceivedError(view, request, error)
                // Handle errors - you could load a custom error page
                Toast.makeText(this@MainActivity, "Error loading page, please check your connection", Toast.LENGTH_SHORT).show()
            }
        }
        
        // Set a WebChromeClient for more features like JavaScript dialogs if needed
        /*
        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progressBar.progress = newProgress
            }
            
            // Handle other features like geolocation permissions, fullscreen video, etc.
        }
        */
        
        // Load the web app
        webView.loadUrl(websiteUrl)
    }
    
    // Handle back button presses to navigate within the WebView if possible
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
    
    // Clean up resources and save WebView state
    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }
    
    override fun onRestoreInstanceState(savedInstanceState: Bundle) {
        super.onRestoreInstanceState(savedInstanceState)
        webView.restoreState(savedInstanceState)
    }
    
    // Handle lifecycle events
    override fun onPause() {
        super.onPause()
        webView.onPause()
    }
    
    override fun onResume() {
        super.onResume()
        webView.onResume()
    }
    
    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
    
    // Future enhancements:
    // 1. Add offline support with caching
    // 2. Implement push notifications with Firebase Cloud Messaging
    // 3. Add native features like camera access
    // 4. Implement deep linking
    // 5. Add file downloading capabilities
    // 6. Implement share functionality
}
