/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, serviceworker, es6 */

'use strict';
self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  
    const title = '웹푸시 알림';
    const options = {
      body: '푸시알림 내용',
      icon: 'images/icon.png',
      badge: 'images/badge.png'//푸시알림 내용
    };
  
    event.waitUntil(self.registration.showNotification(title, options));
  });

  self.addEventListener('notificationclick', function(event) {//푸시 클릭시 링크 연결
    console.log('[Service Worker] Notification click received.');
  
    event.notification.close();
  
    event.waitUntil(
      clients.openWindow('https://naver.com/')//링크
    );
  });