global.asyncWrapper = {
    controller: (req, next, callback, notNullParams) => {
        let param = utils.getParams(req);

        if (notNullParams) {
            let isNull = utils.validateNull(param, notNullParams);
            if (isNull) {
                next(response.fail(400, '필수 파라미터가 존재하지 않습니다(' + isNull + ')'));
                return false;
            }
        }

        callback(param).catch((e) => {
            next(e);
        });
    },

    service: async (callback, autoCommit) => {
        let db = require('../utils/db.js');
        let instance = db.getInstance();
        if (autoCommit) instance.setTransaction(false);

        let result = await callback(instance).catch((e) => {
            instance.rollback();
            throw e;
        });

        if (instance.getTransaction()) instance.commit();

        return result;
    },
};
