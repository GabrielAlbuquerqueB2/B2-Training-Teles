const CryptoJs = require('crypto-js')

export function encrypt(data) {
    
    return CryptoJs.AES.encrypt(data, process.env.B1_CRYPTO_SECRET).toString();

};

export function decrypt(data) {

    const bytes  = CryptoJs.AES.decrypt(data, process.env.B1_CRYPTO_SECRET);
    return bytes.toString(CryptoJs.enc.Utf8);
}