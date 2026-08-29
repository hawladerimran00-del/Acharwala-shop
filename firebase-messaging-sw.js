importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCYv4oW83jo9ZVcJbyXjasnqdA9h3pttyw",
  authDomain: "achar-wala.firebaseapp.com",
  projectId: "achar-wala",
  storageBucket: "achar-wala.firebasestorage.app",
  messagingSenderId: "83891655859",
  appId: "1:83891655859:web:024651eb1f328afe714cc6"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const n = (payload && payload.notification) || {};
  self.registration.showNotification(n.title || '🛒 নতুন অর্ডার!', {
    body: n.body || '',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: { url: '/admin.html' }
  });
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/admin.html';
  event.waitUntil(clients.openWindow(url));
});
