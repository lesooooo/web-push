// 서버 구동 시 global 변수로 세팅
function isEmpty(v) {
    return v == null || v == '' || v == undefined || (v.constructor.toString().indexOf('Object') > -1 && Object.keys(v).length == 0) || (Array.isArray(v) && v.length === 0);
}

function ToLower(str) {
    return str ? str.toLowerCase() : '';
}

function SnakeToCamel(str) {
    return str.replace(/\_\w/g, (matched) => matched[1].toUpperCase());
}

function DashToCamel(str) {
    return str.replace(/\-\w/g, (matched) => matched[1].toUpperCase());
}

function SnakeToCamelArr(arr) {
    let l = arr.length;
    let r = [];
    let k = Object.keys(arr[0]);
    for (let i = 0; i < l; i++) {
        let t = {};
        for (let j = 0; j < k.length; j++) {
            t[SnakeToCamel(ToLower(k[j]))] = arr[i][k[j]];
        }
        r.push(t);
    }
    return r;
}

function DashToCamelArr(arr) {
    let l = arr.length;
    let r = [];
    let k = Object.keys(arr[0]);
    for (let i = 0; i < l; i++) {
        let t = {};
        for (let j = 0; j < k.length; j++) {
            t[DashToCamel(ToLower(k[j]))] = arr[i][k[j]];
        }
        r.push(t);
    }
    return r;
}

function GetParams(req) {
    let obj = {
        pureUrl: req.url.indexOf('?') > -1 ? req.url.split('?')[0] : req.url,
        method: req.method,
        clientIp: req.headers['x-real-ip'] || req.connection.remoteAddress,
    };
    return { ...obj, ...req.query, ...req.params, ...req.body, ...req.body.jwt };
}

function ValidateNull(param, arr) {
    let keys = Object.keys(param);
    for (let i = 0; i < arr.length; i++) {
        let t = keys.filter((item) => item == arr[i] && param[item] != '');
        if (t.length == 0) {
            return arr[i];
        }
    }
    return '';
}

function CodeConvert(list, keyName, valueName) {
    let returnObj = {};
    list.forEach((item) => (returnObj[item[keyName]] = item[valueName]));
    return returnObj;
}

function ValidatePagingParam(param) {
    if (isEmpty(param.pageIndex) || isNaN(Number(param.pageIndex))) {
        throw response.fail(400, '필수 파라미터의 데이터 형식이 올바르지 않습니다(pageIndex: ' + (param.pageIndex ? param.pageIndex : 'null') + ')');
    }
    if (isEmpty(param.pageCount) || isNaN(Number(param.pageCount))) {
        throw response.fail(400, '필수 파라미터의 데이터 형식이 올바르지 않습니다(pageCount: ' + (param.pageCount ? param.pageCount : 'null') + ')');
    }
    param.startIndex = param.pageIndex * param.pageCount;
    return param;
}

function CalcPaging(list, pageIndex, pageCount, totalCount) {
    return {
        list: list,
        pageIndex: Number(pageIndex),
        pageTotal: Math.ceil(totalCount[0].total / pageCount),
        totalCount: totalCount[0].total,
    };
}

function findNextId(id) {
    if (id) {
        let prefix = new String(id).match(/[a-zA-Z]*/);
        let numStr = new String(id).split(prefix)[1];
        let zeroCnt = numStr.length;
        return prefix + (Number(numStr) + 1 + '').padStart(zeroCnt, '0');
    } else {
        throw response.fail(500, '서버 에러가 발생했습니다.');
    }
}

function makeListToTree(list, key, value, keyArr, listName) {
    let index = list.findIndex((item) => item[key] == value[key]);
    if (index < 0) {
        let tempObj = {};
        if (!utils.isEmpty(listName)) {
            tempObj[listName] = [];
        }
        for (let i = 0; i < keyArr.length; i++) {
            tempObj[keyArr[i]] = value[keyArr[i]];
        }
        list.push(tempObj);
        index = list.length - 1;
    }
    return index;
}

global.utils = {
    isEmpty,
    replaceAll: (str, a, b) => str.split(a).join(b),
    toLower: ToLower,
    snakeToCamel: SnakeToCamel,
    dashToCamel: DashToCamel,
    snakeToCamelArr: SnakeToCamelArr,
    dashToCamelArr: DashToCamelArr,
    getParams: GetParams,
    parseJwt: (req) => req.get('Authorization'),
    validateNull: ValidateNull,
    removeComma: (str) => Number(str.replace(',', '')),
    pagingData: (data, total, param) => ({ list: data, pageTotal: Math.ceil(total[0].total / param.pageCount), pageIndex: Number(param.pageIndex) }),
    codeConvert: CodeConvert,
    validatePagingParam: ValidatePagingParam,
    calcPaging: CalcPaging,
    increaseCode: (lastCode, char, zeroFill) => char + ('' + (Number(lastCode.split(char)[1]) + 1)).padStart(zeroFill, '0'),
    findNextId,
    makeListToTree,
};
