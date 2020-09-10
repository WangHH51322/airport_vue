
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}
/**************交互*************** */
let proxyObj = {};
const CompressionPlugin = require("compression-webpack-plugin");
proxyObj['/ws'] = {
    ws: true,
    target: "ws://localhost:8081"
};
proxyObj['/'] = {
    ws: false,
    target: 'http://localhost:8081',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}


module.exports = {
    lintOnSave: false,
    publicPath: './',
    outputDir: 'dist',
    lintOnSave: true,
    chainWebpack: (config) => {
        config.module
            .rule('')
            .test(/mxClient\.js$/)
            .use('exports-loader')
            .loader('exports-loader?mxClient,mxGraphModel,mxActor,mxShape,mxEventObject,mxGraph,mxPrintPreview,mxEventSource,mxRectangle,mxVertexHandler,mxMouseEvent,mxGraphView,mxImage,mxGeometry,mxRubberband,mxKeyHandler,mxDragSource,mxGraphModel,mxEvent,mxUtils,mxWindow,mxEvent,mxCodec,mxCell,mxConstants,mxPoint,mxGraphHandler,mxCylinder,mxCellRenderer,mxEvent,mxUndoManager')
            .end();
        config.resolve.alias
            .set('@', resolve('src'))
            .set('@assets', resolve('src/assets'));
        // 按这种格式.set('', resolve('')) 自己添加
    },
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            return {
                plugins: [
                    new CompressionPlugin({
                        test: /\.js$|\.html$|\.css/,
                        threshold: 1024,
                        deleteOriginalAssets: false
                    })
                ]
            }
        }
    }
};