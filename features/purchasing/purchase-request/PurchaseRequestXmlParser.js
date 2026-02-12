function getTagValue(parent, tagName) {
    const el = parent.getElementsByTagName(tagName)[0]
    return el ? el.textContent.trim() : ''
}

export function parseNFeXml(xmlString) {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml')

    const parseError = xmlDoc.getElementsByTagName('parsererror')
    if (parseError.length > 0) {
        throw new Error('Erro ao ler o XML: arquivo com formato inválido.')
    }

    let infNFe = xmlDoc.getElementsByTagName('infNFe')[0]
    if (!infNFe) {
        throw new Error('XML inválido: tag <infNFe> não encontrada. Verifique se é um XML de NF-e válido.')
    }

    const emit = infNFe.getElementsByTagName('emit')[0]
    if (!emit) {
        throw new Error('XML inválido: tag <emit> (emitente) não encontrada.')
    }

    const emitente = {
        cnpj: getTagValue(emit, 'CNPJ'),
        nome: getTagValue(emit, 'xNome'),
        fantasia: getTagValue(emit, 'xFant')
    }

    if (!emitente.cnpj) {
        throw new Error('XML inválido: CNPJ do emitente não encontrado.')
    }

    const ide = infNFe.getElementsByTagName('ide')[0]
    const nNF = ide ? getTagValue(ide, 'nNF') : ''

    const detElements = infNFe.getElementsByTagName('det')
    if (detElements.length === 0) {
        throw new Error('XML inválido: nenhum item encontrado (tag <det>).')
    }

    const itens = []
    for (let i = 0; i < detElements.length; i++) {
        const det = detElements[i]
        const prod = det.getElementsByTagName('prod')[0]
        if (!prod) continue

        itens.push({
            nItem: det.getAttribute('nItem') || String(i + 1),
            cProd: getTagValue(prod, 'cProd'),
            xProd: getTagValue(prod, 'xProd'),
            NCM: getTagValue(prod, 'NCM'),
            qCom: parseFloat(getTagValue(prod, 'qCom')) || 0,
            vUnCom: parseFloat(getTagValue(prod, 'vUnCom')) || 0,
            uCom: getTagValue(prod, 'uCom'),
        })
    }

    return {
        emitente,
        nNF,
        itens
    }
}

export function matchXmlItemsWithCatalog(xmlItems, catalogNumbers) {
    const lines = []
    const unmatchedItems = []

    for (const xmlItem of xmlItems) {
        const catalogMatch = catalogNumbers.find(
            cat => cat.vendorItemCode === xmlItem.cProd
        )

        if (catalogMatch) {
            lines.push({
                Item: {
                    id: catalogMatch.sapItemCode,
                    label: catalogMatch.sapItemName || catalogMatch.sapItemCode
                },
                FreeText: '',
                Quantity: xmlItem.qCom,
                UnitPrice: xmlItem.vUnCom,
                WarehouseCode: '',
                VendorItemCode: xmlItem.cProd,
                XmlDescription: xmlItem.xProd,
                matched: true
            })
        } else {
            lines.push({
                Item: '',
                FreeText: '',
                Quantity: xmlItem.qCom,
                UnitPrice: xmlItem.vUnCom,
                WarehouseCode: '',
                VendorItemCode: xmlItem.cProd,
                XmlDescription: xmlItem.xProd,
                matched: false
            })
            unmatchedItems.push(xmlItem)
        }
    }

    return { lines, unmatchedItems }
}
