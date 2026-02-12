export default function escapeUnicode(str) {
    return str.replace(/[^\0-~]/g, function (ch) {
        return "\\u" + ("0000" + ch.charCodeAt().toString(16)).slice(-4);
    })
}