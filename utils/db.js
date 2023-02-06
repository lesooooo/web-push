const mybatisMapper = require('mybatis-mapper');

module.exports = {

    getInstance: () => {
        function Instance() {
            let conn = null;
            let transaction = true;

            function logQuery(level, mapper, id, param, query, diff, result) {
                let str = 'Query Information';
                str += '\n    [MAPPER_NAME] ' + mapper + '  [QUERY_ID] ' + id + ' [TIME] ' + diff + ' ms';
                str += '\n    [PARAM] ' + JSON.stringify(param ? param : '');
                str += '\n    [QUERY] ' + utils.replaceAll(query, '\n', '\n            ');
                str += '\n    [RESULT] ' + JSON.stringify(result) + '\n';
                logger[level](str);
            }

            this.setTransaction = (val) => transaction = val;
            this.getTransaction = () => transaction
            this.execute = async function(mapper, id, param) {
                let start = new Date();
                let query, result, diff;
                try {
                    if((transaction && conn == null) || !transaction) {
                        conn = await dbConnector.getConnection();
                        await conn.beginTransaction();
                    }

//                    let format = {indent: '    '};
                    query = mybatisMapper.getStatement(mapper, id, param);
//                    query = mybatisMapper.getStatement(mapper, id, param, format);

                    let result = await conn.query(query);
                    result = result[0];
                    diff = (new Date()).getTime() - start.getTime();

                    if(diff >= SERVER_CONFIG.LOG.QUERY_OVER_TIME) {
                        logQuery('error', mapper, id, param, query, diff, result)
                    } else {
                        if(SERVER_CONFIG.LOG.QUERY) {
                            logQuery('debug', mapper, id, param, query, diff, result)
                        }
                    }

                    if(!transaction)
                        this.commit();

                    return result;
                } catch(e) {
                    console.error('[error in query] ', mapper, id, '\n', query, '\n[//error in query]\n');
                    if(conn != null)
                        await conn.rollback();
                    console.log(e);
                    throw e;
                }
            }
            this.findOne = async function(mapper, id, param) {
                try {
                    let result = await this.execute(mapper, id, param);
                    if(result.length == 1) {
                        return result[0];
                    } else if(result.length == 0) {
                        return {};
                    } else {
                        throw tnmError(500, 'More than 1 records found');
                    }
                } catch(e) {
                    throw e;
                }
            }
            this.commit = async () => {
                try {
                    if(conn != null) {
                        await conn.commit();
                        conn.release();
                        conn = null;
                    }
                    transaction = true;
                } catch(e) {
                    if(conn != null)
                        conn.release();
                    conn = null;
                    throw e;
                }
            }
            this.rollback = async () => {
                try {
                    if(conn != null) {
                        await conn.rollback();
                        conn.release();
                    }
                    transaction = true;
                    conn = null;
                } catch(e) {
                    if(conn != null)
                        conn.release();
                    conn = null;
                    throw e;
                }
            }
            this.release = () => {
                if(conn != null)
                    conn.release();
                conn = null;
            }
        }
        return new Instance();
    }

}