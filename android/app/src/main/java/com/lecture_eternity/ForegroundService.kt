package com.lecture_eternity;

import android.app.*
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

class ForegroundService : Service() {

    override fun onCreate() {
        super.onCreate()
        startForegroundService()
    }

    private fun startForegroundService() {
        val channelId = "foreground_service_channel"
        val channelName = "Foreground Service"

        // Create Notification Channel for Foreground Service
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_LOW)
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }

        // Build Notification
        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("App is Running")
            .setContentText("Ensuring notifications arrive.")
            .setSmallIcon(R.mipmap.ic_launcher)
            .build()

        startForeground(1, notification) // Start Foreground Service
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }
}
