export function getDefaultData() {
    return {
        GroupCode: '',
        CardName: '',
        AliasName: '', 
        FederalTaxID: '',
        Phone1: '',
        Phone2: '',
        Cellular: '',
        EmailAddress: '',
        ChannelBP: '',
        CardType: '',
        Series: '',
        BPFiscalTaxIDCollection: [
            {
                CNAECode: -1,
                TaxId1: '',
                TaxId4: '',
                TaxId5: ''
            }
        ]
        
    }
}

export function getDefaultAddress() {
    return {
        AddressName: '',
        AddressType: '',
        TypeOfAddress: '',
        Street: '',
        StreetNo: '',
        ZipCode: '',
        Block: '',
        City: '',
        County: '',
        CountyCode: '',
        State: '',
        U_TX_IE: ''
    }
}

export function getDefaultContact() {
    return {
        Name: '',
        FirstName: '',
        E_Mail: '',
        Phone1: '',
        Active: 'Y'
    }
}

export function createBusinessPartnerModel(data) {

    const addresses = mapAddresses(data.BPAddresses || [])
    const contacts = mapContacts(data.ContactEmployees || [])
    const fiscalCollection = mapFiscalTaxCollection(data.BPFiscalTaxIDCollection, data.FederalTaxID)
    
    const result = {
        CardName: data.CardName,
        AliasName: data.AliasName,
        CardType: data.CardType || 'cCustomer',
        Series: data.Series,
        FederalTaxID: data.FederalTaxID,
        Phone1: data.Phone1,
        Phone2: data.Phone2,
        Cellular: data.Cellular,
        EmailAddress: data.EmailAddress,
    }
    
    if (fiscalCollection.length > 0) {
        result.BPFiscalTaxIDCollection = fiscalCollection
    }
    if (contacts.length > 0) {
        result.ContactEmployees = contacts
    }
    if (addresses.length > 0) {
        result.BPAddresses = addresses
    }
    
    return removeEmptyFields(result)
}

export function editBusinessPartnerModel(data) {

    console.log('=== DEBUG: editBusinessPartnerModel ===')
    console.log('BPFiscalTaxIDCollection ANTES do mapeamento:', JSON.stringify(data.BPFiscalTaxIDCollection, null, 2))
    console.log('BPAddresses:', JSON.stringify(data.BPAddresses, null, 2))

    const contacts = mapContacts(data.ContactEmployees || [])
    
    // Sincroniza o U_TX_IE dos endereços de entrega com o BPFiscalTaxIDCollection
    let fiscalCollection = Array.isArray(data.BPFiscalTaxIDCollection) ? [...data.BPFiscalTaxIDCollection] : [];
    
    // Para cada endereço de entrega com U_TX_IE, atualiza/cria o registro no BPFiscalTaxIDCollection
    const entregas = (data.BPAddresses || []).filter(addr => addr.AddressType === 'bo_ShipTo')
    entregas.forEach(endereco => {
        if (endereco.U_TX_IE && endereco.U_TX_IE.trim()) {
            // Busca registro existente para este endereço
            let fiscalEntry = fiscalCollection.find(f => 
                f.Address === endereco.AddressName && f.AddrType === 'bo_ShipTo'
            )
            
            if (fiscalEntry) {
                fiscalEntry.TaxId1 = endereco.U_TX_IE
            } else {
                // Cria novo registro
                fiscalCollection.push({
                    Address: endereco.AddressName,
                    AddrType: 'bo_ShipTo',
                    TaxId1: endereco.U_TX_IE
                })
            }
        }
    })
        // Propaga TaxId1 de BPAddresses[x].BPFiscalTaxIDCollection para o array principal
        if (!Array.isArray(fiscalCollection)) {
            fiscalCollection = [];
        }
        (Array.isArray(data.BPAddresses) ? data.BPAddresses : []).forEach(address => {
            if (address.AddressType === 'bo_ShipTo' && Array.isArray(address.BPFiscalTaxIDCollection)) {
                const addressId = address.AddressName;
                const taxId1Value = address.BPFiscalTaxIDCollection.find(e => e.TaxId1 && e.TaxId1.trim() !== '')?.TaxId1;
                if (addressId && taxId1Value) {
                    let idx = fiscalCollection.findIndex(f => f.Address === addressId);
                    if (idx === -1) {
                        fiscalCollection.push({
                            Address: addressId,
                            AddrType: 'bo_ShipTo',
                            TaxId1: taxId1Value
                        });
                    } else {
                        fiscalCollection[idx] = {
                            ...fiscalCollection[idx],
                            TaxId1: taxId1Value,
                            AddrType: 'bo_ShipTo',
                            Address: addressId
                        };
                    }
                }
            }
        });
    
    const mappedFiscalCollection = mapFiscalTaxCollection(fiscalCollection, data.FederalTaxID, data.CardCode)

    console.log('BPFiscalTaxIDCollection DEPOIS do mapeamento:', JSON.stringify(mappedFiscalCollection, null, 2))

    const result = {
        CardName: data.CardName,
        AliasName: data.AliasName,
        FederalTaxID: data.FederalTaxID, 
        Phone1: data.Phone1,
        Phone2: data.Phone2,
        Cellular: data.Cellular,
        EmailAddress: data.EmailAddress,
    }
    
    if (mappedFiscalCollection.length > 0) {
        result.BPFiscalTaxIDCollection = mappedFiscalCollection
    }
    if (contacts.length > 0) {
        result.ContactEmployees = contacts
    }
    
    if (Array.isArray(data.BPAddresses) && data.BPAddresses.length > 0) {
        result.BPAddresses = mapAddresses(data.BPAddresses)
    }

    if (data.GroupCode && parseInt(data.GroupCode) > 0) {
        result.GroupCode = parseInt(data.GroupCode)
    }

    return removeEmptyFields(result)
}

function removeAccents(str) {
    if (!str) return str
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function removeEmptyFields(obj) {
    const result = {}
    Object.keys(obj).forEach(key => {
        const value = obj[key]
        if (value !== '' && value !== null && value !== undefined) {
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    result[key] = value
                }
            } else {
                result[key] = value
            }
        }
    })
    return result
}

function mapAddresses(addresses) {
    return addresses.map(address => {
        const countyValue = address.CountyCode || address.ibge || address.County
        
        const mapped = {
            AddressName: removeAccents(address.AddressName),
            AddressType: address.AddressType,
            TypeOfAddress: removeAccents((address.TypeOfAddress || 'RUA').toUpperCase()),
            Street: removeAccents(address.Street),
            StreetNo: address.StreetNo,
            Block: removeAccents(address.Block),
            ZipCode: address.ZipCode ? address.ZipCode.replace(/\D/g, '') : '',
            City: removeAccents(address.City),
            County: countyValue,
            State: address.State,
            Country: 'BR',
        }
        
        if (address.U_TX_IE && address.U_TX_IE.trim()) {
            mapped.U_TX_IE = address.U_TX_IE
        }
        
        Object.keys(mapped).forEach(key => {
            if (mapped[key] === '' || mapped[key] === null || mapped[key] === undefined) {
                delete mapped[key]
            }
        })
        
        return mapped
    }).filter(addr => addr.Street && addr.City && addr.AddressName)
}

function mapContacts(contacts) {
    if (!contacts || contacts.length === 0) return []
    
    return contacts
        .filter(contact => contact.Name && contact.Name.trim())
        .map(contact => {
            const mapped = {
                Name: contact.Name.trim(),
                FirstName: contact.FirstName ? contact.FirstName.trim() : undefined,
                LastName: contact.LastName,
                E_Mail: contact.E_Mail,
                Phone1: contact.Phone1,
                MobilePhone: contact.MobilePhone,
                Position: contact.Position,
                Remarks1: contact.Remarks1
            }
            
            Object.keys(mapped).forEach(key => {
                if (mapped[key] === '' || mapped[key] === null || mapped[key] === undefined) {
                    delete mapped[key]
                }
            })
            
            return mapped
        })
}

function mapFiscalTaxCollection(fiscalTaxCollection, federalTaxID, cardCode) {
    console.log('=== DEBUG: mapFiscalTaxCollection ===')
    console.log('Entrada - fiscalTaxCollection:', JSON.stringify(fiscalTaxCollection, null, 2))
    console.log('Entrada - federalTaxID:', federalTaxID)
    console.log('Entrada - cardCode:', cardCode)

    let collection = Array.isArray(fiscalTaxCollection) ? [...fiscalTaxCollection] : []
    
    collection = collection.map(item => {
        const newItem = {}
        
        // Verifica se é registro de Cobrança (bo_BillTo) - Cobrança NÃO tem IE
        const isCobranca = item.AddrType === 'bo_BillTo' || 
                          (item.Address && item.Address.toUpperCase() === 'COBRANCA')
        
        // Address é obrigatório
        if (item.Address !== undefined) {
            newItem.Address = item.Address
        }
        
        // AddrType: mantém para endereços específicos (ENTREGA = bo_ShipTo, COBRANCA = bo_BillTo)
        // Dados Gerais (Address vazio) NÃO tem AddrType
        if (item.Address && item.Address !== '') {
            if (item.AddrType === 'bo_ShipTo' || item.AddrType === 'bo_BillTo') {
                newItem.AddrType = item.AddrType
            }
        }
        
        // BPCode é obrigatório para o SAP identificar o registro
        if (cardCode) {
            newItem.BPCode = cardCode
        } else if (item.BPCode) {
            newItem.BPCode = item.BPCode
        }
        
        if (item.CNAECode && item.CNAECode !== -1) {
            newItem.CNAECode = item.CNAECode
        }
        
        // TaxId1 (IE): inclui para Dados Gerais e Entrega, mas NÃO para Cobrança
        if (!isCobranca && item.TaxId1 && item.TaxId1.trim() !== '') {
            newItem.TaxId1 = item.TaxId1
        }
        
        if (item.TaxId5 && item.TaxId5.trim() !== '') {
            newItem.TaxId5 = item.TaxId5
        }
        
        if (federalTaxID) {
            const cleanDoc = federalTaxID.replace(/\D/g, '')
            if (cleanDoc.length === 14) {
                newItem.TaxId0 = federalTaxID
            } else if (cleanDoc.length === 11) {
                newItem.TaxId4 = federalTaxID
            }
        }
        
        return newItem
    }).filter(item => Object.keys(item).length > 0)
    
    console.log('Saída - collection mapeada:', JSON.stringify(collection, null, 2))
    
    return collection
}
