const path = require('path');
const buildFolder = path.resolve(__dirname, 'dist');

module.exports = {
    devServer: {
        contentBase: buildFolder,
        port: 9100,
        hot: true
    }
}