// firebase-messaging-sw.js
// এই ফাইল root-এ থাকতে হবে (index.html এর পাশে)

importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCYv4oW83jo9ZVcJbyXjasnqdA9h3pttyw',
  authDomain: 'achar-wala.firebaseapp.com',
  projectId: 'achar-wala',
  storageBucket: 'achar-wala.firebasestorage.app',
  messagingSenderId: '83891655859',
  appId: '1:83891655859:web:024651eb1f328afe714cc6'
});

const messaging = firebase.messaging();

// Background message handler — এটা app বন্ধ থাকলে কাজ করে
messaging.onBackgroundMessage(function(payload) {
  console.log('Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'নতুন অর্ডার!';
  const notificationOptions = {
    body: payload.notification?.body || 'নতুন অর্ডার এসেছে',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [300, 100, 300, 100, 300],
    tag: 'acharwala-order-' + Date.now(),
    requireInteraction: true,  // notification auto-dismiss হবে না
    data: payload.data || {},
    actions: [
      { action: 'view', title: 'দেখুন' },
      { action: 'dismiss', title: 'বাতিল' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click handler
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'dismiss') return;

  // App খুলুন অথবা focus করুন
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        for (const client of clientList) {
          if (client.url.includes('admin.html') && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/admin.html');
        }
      })
  );
});
