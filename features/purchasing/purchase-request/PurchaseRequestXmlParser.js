import { XMLParser } from 'fast-xml-parser'

export function parseXmlContent(xmlString) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        removeNSPrefix: true,
        parseTagValue: false
    })
    const parsed = parser.parse(xmlString)

    const nfeProc = parsed.nfeProc || parsed
    const NFe = nfeProc.NFe || nfeProc
    const infNFe = NFe.infNFe
    if (!infNFe) {
        throw new Error('XML inválido: tag <infNFe> não encontrada.')
    }

    const emit = infNFe.emit
    if (!emit) {
        throw new Error('XML inválido: tag <emit> (emitente) não encontrada.')
    }

    const cnpj = String(emit.CNPJ || '')
    if (!cnpj) {
        throw new Error('XML inválido: CNPJ do emitente não encontrado.')
    }

    const nNF = String(infNFe.ide?.nNF || '')

    let detArray = infNFe.det
    if (!detArray) {
        throw new Error('XML inválido: nenhum item encontrado (tag <det>).')
    }
    if (!Array.isArray(detArray)) {
        detArray = [detArray]
    }

    const itens = detArray.map((det, i) => {
        const prod = det.prod
        if (!prod) return null
        return {
            nItem: det['@_nItem'] || String(i + 1),
            cProd: String(prod.cProd || ''),
            xProd: String(prod.xProd || ''),
            NCM: String(prod.NCM || ''),
            qCom: parseFloat(prod.qCom) || 0,
            vUnCom: parseFloat(prod.vUnCom) || 0,
            uCom: String(prod.uCom || '')
        }
    }).filter(Boolean)

    return { cnpj, nomeEmitente: emit.xNome || '', fantasiaEmitente: emit.xFant || '', nNF, itens }
}
