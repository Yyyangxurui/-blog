const crypyo = require ('crypto')

//返回加密成功的数据
module.exports = function (password, key = "This is a YXR blog") {
    const hmac = crypyo.createHmac("sha256",key)
    hmac.update(password)
    const passwordhmac = hmac.digest("hex")
    return passwordhmac
}