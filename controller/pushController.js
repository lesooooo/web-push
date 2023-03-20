var http = require('http');
var url = require('url');
var fs = require('fs');
var webpush=require('web-push');
const service = require('../service/deiceService.js');
module.exports = (router) => {

    
    //push, 구독화면 html
    router.get('/push/test', (req, res, next) => {
        asyncWrapper.controller(req,next,async (param) => {
            fs.readFile('public/index.html', (err, data) => {
                if (err) {
                  return console.error(err);
                }
                res.writeHead(200, {'Content-Type':'text/html'});
                res.end(data, 'utf-8')
            });
        });
    });
    router.get('/push/test/sw', (req, res, next) => {
        asyncWrapper.controller(req,next,async (param) => {
            fs.readFile('public/firebase-messaging-sw.js', (err, data) => {
                if (err) {
                  return console.error(err);
                }
                res.writeHead(200, {'Content-Type':'text/javascript'});
                res.end(data, 'utf-8')
            });
        });
    });
    router.get('/push/test2', (req, res, next) => {
        asyncWrapper.controller(req,next,async (param) => {
            fs.readFile('public/client.html', (err, data) => {
                if (err) {
                  return console.error(err);
                }
                res.writeHead(200, {'Content-Type':'text/html'});
                res.end(data, 'utf-8')
            });
        });
    });
    //http://localhost:3300/api/push/test/firebase-messaging-sw.js
    // /push/test/firebase-messaging-sw.js
    router.get('/firebase-messaging-sw.js', (req, res, next) => {
        asyncWrapper.controller(req,next,async (param) => {
            fs.readFile('public/firebase-messaging-sw.js', (err, data) => {
                if (err) {
                  return console.error(err);
                }
                res.writeHead(200, {'Content-Type':'text/javascript'});
                res.end(data, 'utf-8')
            });
        });
    });
}