const service = require('../service/deiceService.js');
const uservice = require('../service/userService.js');
module.exports = (router) => {
    //[test1] test get method
    router.get('/test', (req, res, next) => {
       asyncWrapper.controller(req, next, async (param) => {
           let result = { a: [1, 2, 3], b: { bb: 1, bbb: 2 } };
           res.send(response.success(result));
       });
   });

    //로그인
    router.post('/users/login', (req, res, next) => {
        asyncWrapper.controller(
            req,
            next,
            async (param) => {
            
                let result = await uservice.login(param);//tokenSet 
                result.api="http:///abcd.abcd";
                result.push="http://abcde.abcde";
                res.send(response.success(result));
            }
        );
    });

    //로그인 실패
   router.post('/users/login/fail', (req, res, next) => {
    asyncWrapper.controller(req, next, async (param) => {
        res.send(response.fail("500", ""));
        });
    });
   
    //토큰 갱신
    router.put('/users/token/refresh', (req, res, next) => {
        asyncWrapper.controller(
            req,
            next,
            async (param) => {
                let result = await uservice.refreshToken(param);//newTokenSet
                res.send(response.success(result));
            }
        );
    });

//    //  현장 목록 조회
//    router.get('/sites/:start_idx/:count', (req, res, next) => {
//        asyncWrapper.controller(req, next, async (param) => {
//         let result=await service.findSites(param);
//            res.send(response.success(result));
//        });
//    });
   //  현장 목록 조회
   router.get('/sites/:start_idx/:count', (req, res, next) => {
    asyncWrapper.controller(req, next, async (param) => {
        let rslt = [
            {
                id : 'site123', 
                is_fixed : 1, 
                name : '공장1'
            } , 
            {
                id : 'site012', 
                is_fixed : 1, 
                name : '공장2'
            }, 
            {
                id : 'site013', 
                is_fixed : 0, 
                name : '휴대1'
            }
        ];
        let result=await service.findSites(param, rslt);
        res.send(response.success(result));
    });
});

   //  현장 목록 조회 실패
   router.get('/sites/:start_idx/:count/fail', (req, res, next) => {
    asyncWrapper.controller(req, next, async (param) => {       
        res.send(response.fail("500", ""));
    });
});
   //장비상태 조회
   router.get('/:site_id/device/state', (req, res, next) => {
       asyncWrapper.controller(req, next, async (param) => {
           let result = {
              lte : 1, 
              lte_speed : 1, 
              bridge : 1
           };
           res.send(response.success(result));
       });
   });
   //장비상태 조회 실패
   router.get('/:site_id/device/state/fail', (req, res, next) => {
    asyncWrapper.controller(req, next, async (param) => {       
        res.send(response.fail("500", ""));
    });
});

   //누적된 작업중 이상상황 발생 조회//보류
   router.get('/:site_id/works/state', (req, res, next) => {
       asyncWrapper.controller(req, next, async (param) => {
           let result =[
               {
                   id : 'cnt1', 
                   name : '누적된 산소 농도 이상 경고', 
                   count : 1
               }, 
               {
                   id : 'cnt2', 
                   name : '누적된 가스누출 이상 경고', 
                   count  : 0
               }, 
               {
                   id : 'cnt3', 
                   name : '누적된 온/습도 이상 경고', 
                   count  : 3
               }, 
               {
                   id : 'cnt4', 
                   name : '누적된 작업자 이상 경고', 
                   count  : 2
               }, 
               {
                   id : 'cnt5', 
                   name : '누적된 화재 발생 경고', 
                   count  : 0
               }, 
               {
                   id : 'cnt6', 
                   name : '누적된 안전장비 미착용 경고', 
                   count  : 4
               }
              ];
           res.send(response.success(result));
       });
   });

   //누적된 작업중 이상상황 발생 조회 실패
   router.get('/:site_id/works/state/fail', (req, res, next) => {
    asyncWrapper.controller(req, next, async (param) => {
        res.send(response.fail("500", ""));
    });
});

   //  설비 목록 조회
   router.get('/:site_id/facilities/:start_idx/:count', (req, res, next) => {
       asyncWrapper.controller(req, next, async (param) => {
           let rslt = [
                   {
                       id : 'fclty1', 
                       grade : 0, 
                       max_grade : '1'
                   } , 
                   {
                       id : 'fclty2', 
                       grade : 1, 
                       max_grade : '1'
                   }, 
                   {
                       id : 'fclty3', 
                       grade : 0, 
                       max_grade : '1'
                   }, 
                   {
                       id : 'fclty4', 
                       grade : 0, 
                       max_grade : '1'
                   }, 
                   {
                       id : 'fclty5', 
                       grade : 1, 
                       max_grade : '1'
                   }, 
                   {
                       id : 'fclty6', 
                       grade : 1, 
                       max_grade : '1'
                   }
               ];
            let result=await service.findSites(param, rslt);
           res.send(response.success(result));
       });
   });

   //  설비 목록 조회 실패
   router.get('/:site_id/facilities/:start_idx/:count/fail', (req, res, next) => {
    asyncWrapper.controller(req, next, async (param) => {
        res.send(response.fail("500", ""));
    });
});
//  센서 목록 조회//
router.get('/:site_id/sensors/:start_idx/:count', (req, res, next) => {
   asyncWrapper.controller(req, next, async (param) => {
       let rslt = [
               {
                   id : 'snsr123',
                   min : -50, 
                   max : 50, 
                   current : 23, 
                   name : '온도', 
                   unit : 'C',  
                   grade : 0, 
                   max_grade : '1'
               } , 
               {
                   id : 'snsr012',
                   min : 0, 
                   max : 100, 
                   current : 50, 
                   name : '습도', 
                   unit : '%',  
                   grade : 0, 
                   max_grade : '1'
               }
           ];
       let result=await service.findSites(param, rslt);
            res.send(response.success(result));
   });
});

//  센서 목록 조회 실패
router.get('/:site_id/sensors/:start_idx/:count/fail', (req, res, next) => {
    asyncWrapper.controller(req, next, async (param) => {
        res.send(response.fail("500", ""));
    });
 });

//  작업공간 상태 목록 조회
router.get('/:site_id/state/:period', (req, res, next) => {
   asyncWrapper.controller(req, next, async (param) => {
       let result = [
               {
                   id : 'stat1', 
                   name : '작업자 이상',
                   grade : 1, 
                   max_grade : '3', 
                   alarm_id : "alarm123"
               } , 
               {
                   id : 'stat2',
                   name : '화재', 
                   grade : 0, 
                   max_grade : '1',
                   alarm_id : "alarm012"
               } , 
               {
                   id : 'stat3',
                   name : '안전장비 미착용', 
                   grade : 2, 
                   max_grade : '3',
                   alarm_id : "alarm013"
               }
           ];
       res.send(response.success(result));
   });
});

//  작업공간 상태 목록 실패
router.get('/:site_id/state/:period/fail', (req, res, next) => {
    asyncWrapper.controller(req, next, async (param) => {
 
        res.send(response.fail("500", ""));
    });
 });

//  작업공간 상태 처리 조회
router.get('/site/solve/:state_id/:proc', (req, res, next) => {
   asyncWrapper.controller(req, next, async (param) => {
       let result = {
           rlst : 1
       };
       res.send(response.success(result));
   });
});

//  작업공간 상태 처리 조회 실패
router.get('/site/solve/:state_id/:proc/fail', (req, res, next) => {
    asyncWrapper.controller(req, next, async (param) => {
        res.send(response.fail("500", ""));
    });
 });

//  실시간 영상 주소목록 조회
router.get('/:site_id/cams/:start_idx/:count', (req, res, next) => {
   asyncWrapper.controller(req, next, async (param) => {
       let rslt =  ['https://abc.abc/abc', 'https://abc.abc/abcd'];
       let result=await service.findSites(param, rslt);
            res.send(response.success(result));
   });
});

//  실시간 영상 주소목록 조회 실패
router.get('/:site_id/cams/:start_idx/:count/fail', (req, res, next) => {
    asyncWrapper.controller(req, next, async (param) => {
        res.send(response.fail("500", ""));
    });
 });

//  영상재생
router.get('/video/:scene_mark_id', (req, res, next) => {
   asyncWrapper.controller(req, next, async (param) => {
       let result = {
           video_url : "https://abcd.abcd/abcd"
       };
       res.send(response.success(result));
   });
});

//  영상재생 실패
router.get('/video/:scene_mark_id/fail', (req, res, next) => {
    asyncWrapper.controller(req, next, async (param) => {
        res.send(response.fail("500", ""));
    });
 });
 //  알람 정보 요청
router.get('/alarm/:alarm_id', (req, res, next) => {
    asyncWrapper.controller(req, next, async (param) => {
        let result = {
                site_id : "site1", 
                facility_id : "fclty1", 
                warn_type : "0", 
                warn_grade : "0", 
                warn_date : "1.6785E+12", 
                rec_url : "https://abc.abc/abc"
        };
        res.send(response.success(result));
    });
 });
  //  알람 정보 요청 실패
router.get('/alarm/:alarm_id/fail', (req, res, next) => {
    asyncWrapper.controller(req, next, async (param) => {
        res.send(response.fail("500", ""));
    });
 });
}