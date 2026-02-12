export default function getTodayDate() {
    
    const date = new Date()
    const isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
    return isoDateTime.slice(0, 10)
}