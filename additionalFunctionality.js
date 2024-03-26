// additionalFunctionality.js

// 自定义中间件示例
function customMiddleware(req, res, next) {
    console.log('自定义中间件被调用');
    next();
}

// 自定义路由处理程序示例
function customRouteHandler(req, res) {
    res.send('自定义路由处理程序被调用');
}

module.exports = {
    customMiddleware,
    customRouteHandler
};