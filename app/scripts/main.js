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

/* eslint-env browser, es6 */
'use strict';
const applicationServerPublicKey = 'BHIih--ltfoiLIRx79NMu0Hs5qv4rB45XgyQk2MWlDJCWzdKgGZZXhakFkCD1G-PGdjG_TyoluxjGUoZUlCti2M';
//공개키 - fcm vapid key 사용자한테 이 키 받아와서 사용하는 듯

const pushButton = document.querySelector('.js-push-btn');//button 정보 저장

let isSubscribed = false;//구독여부 확인
let swRegistration = null;// sw 설치여부 확인

function urlB64ToUint8Array(base64String) {// encoding, replace
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {//sw, pushManager 설치 확인
  console.log('Service Worker and Push are supported');//둘다 설치 o일때

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}


function initializeUI() {//유저 확인, 구독 여부 확인
  pushButton.addEventListener('click', function() {//pushButton listener
    pushButton.disabled = true;//pushButton 비활성화
    if (isSubscribed) {//구독한 사람일때 구독 취소(구취 구현 x)
      // TODO: Unsubscribe user
    } else {
      subscribeUser();//구독
    }
  });

  function subscribeUser() {//유저 구독 처리
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);//서버키 인코딩, 저장
    swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey//푸시매니저에 사용자 key 정보저장
    })
    .then(function(subscription) {
      console.log('User is subscribed.');
  
      updateSubscriptionOnServer(subscription);//구독자정보 서버에 업뎃
  
      isSubscribed = true;
  
      updateBtn();
    })
    .catch(function(error) {
      console.error('Failed to subscribe the user: ', error);
      updateBtn();
    });
  }

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()//구독 정보 가져오기
  .then(function(subscription) {//어디서 받아오는거ㄴ지..pushManager api 인듯?
    isSubscribed = !(subscription === null);//구독정보 없지 않을때(있을때) true 반환

    updateSubscriptionOnServer(subscription);//구독정보 업뎃

    if (isSubscribed) {//콘솔에 구독 여부 반환
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

function updateBtn() {//버튼 text 바뀌는건데 구취 안만들어서 거의 의미없음
  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

navigator.serviceWorker.register('sw.js')
.then(function(swReg) {
  console.log('Service Worker is registered', swReg);

  swRegistration = swReg;
  initializeUI();
})

// swRegistration.pushManager.subscribe({
//   userVisibleOnly: true,
//   applicationServerKey: applicationServerKey
// })
// .then(function(subscription) {
//   console.log('User is subscribed.');

//   updateSubscriptionOnServer(subscription);

//   isSubscribed = true;

//   updateBtn();

// })
// .catch(function(err) {
//   console.log('Failed to subscribe the user: ', err);
//   updateBtn();
// });

function updateSubscriptionOnServer(subscription) {//구독 정보 서버에 업뎃
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');//<pre> class 내용 end-point 
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');//<section> class

  if (subscription) {//구독자일때 보이기
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}