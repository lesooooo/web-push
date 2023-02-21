module.exports = {
    // findSiteDevices: function (param) {
    //     return asyncWrapper.service(async (db) => {
    //         let result = await db.execute('deviceMapper', 'findSiteDevices', param);
    //         let totalCnt = await db.execute('commonMapper', 'findTotalCnt');
    //         return utils.calcPaging(result, param.pageIndex, param.pageCount, totalCnt);
    //     });
    // },
    findSites: function (param, result) {
        return asyncWrapper.service(async (db) => {
            let totalCnt=6; 
            return utils.calcPaging(result, param.start_idx, param.count, totalCnt);
        });
    },
};