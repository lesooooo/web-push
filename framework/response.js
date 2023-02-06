function response(code, data, message) {
    return {
        responseType: 'custom',
        code: code,
        data: data,
        message: message
    }
}

const tnmResponse = {
    success: (data) => response(200, (data ? data : {}), 'success'),
    create: (data) => response(201, (data ? data : {}), 'success'),
    upsert: (data) => {
        if(data.affectedRows == 0) {
            return response(400, {}, 'Invalid parameter');
        } else {
            let result = data.affectedRows == Number(data.info.split('Records: ')[1].split('  Duplicates:')[0]) ? 201 : 200;
            return response(result, {}, 'success')
        }
    },
    fail: (code, message) => response(code, {}, (message ? message : ''))
}

// 서버 구동 시 global 변수로 세팅
global.response = tnmResponse;