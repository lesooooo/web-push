global.tnmError = (code, message) => {
    throw response.fail(code, message);
}