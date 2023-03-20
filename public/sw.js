

self.addEventListener('push', function(e){
  var options={
    body : 'body'
  };

e.waitUntil(
  self.registration.showNotification('test', options)//내용, body
  );
});
self.addEventListener('notificationclick', function(e) {//푸시 클릭시 링크 연결
      console.log('[Service Worker] Notification click received.');
    
      e.notification.close();
    
      e.waitUntil(
        clients.openWindow('http://naver.com')//링크
      );
    });