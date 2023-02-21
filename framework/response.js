function response(result, code, data, message) {
    return {
        responseType: 'custom',
        result : result,
        code: code,
        data: data,
        message: message
    }
}

const tnmResponse = {
    success: (data) => response(1, 200, (data ? data : {}), 'success'),
    create: (data) => response(1, 201, (data ? data : {}), 'success'),
    upsert: (data) => {
        if(data.affectedRows == 0) {
            return response(0, 400, {}, 'Invalid parameter');
        } else {
            let result = data.affectedRows == Number(data.info.split('Records: ')[1].split('  Duplicates:')[0]) ? 201 : 200;
            return response(1, result, {}, 'success')
        }
    },
    fail: (code, message) => response(0, code, {}, (message ? message : ''))
}

// 서버 구동 시 global 변수로 세팅
global.response = tnmResponse;