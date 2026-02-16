export function normalizeCatalogCode(value) {
    if (value === null || value === undefined) return ''
    let normalized = String(value)
    normalized = normalized.replace(/[\u200B\u200C\u200D\uFEFF\u00A0]/g, '')
    normalized = normalized.replace(/\s+/g, '')
    normalized = normalized.replace(/^0+/, '')
    if (normalized === '') return '0'
    return normalized
}
