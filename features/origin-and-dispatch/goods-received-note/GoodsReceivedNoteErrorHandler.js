function isNullOrEmpty(field) {
    return field === '' || field === null || !field
}

export function checkRequiredFields(data) {

    let messages = []

    if (isNullOrEmpty(data.U_B2AG_Date)) {
        messages.push('O campo Data é obrigatório')
    }
    if ( isNullOrEmpty(data.U_B2AG_Time) ) {
        messages.push('O campo Hora é obrigatório')
    }
    if ( isNullOrEmpty(data.U_B2AG_Crop) ) {
        messages.push('O campo Safra é obrigatório')
    }
    if ( isNullOrEmpty(data.U_B2AG_Cultivation) ) {
        messages.push('O campo Cultura é obrigatório')
    }
    if ( isNullOrEmpty(data.U_B2AG_Driver) ) {
        messages.push('O campo Motorista é obrigatório')
    }
    if ( isNullOrEmpty(data.U_B2AG_DriverDocument) ) {
        messages.push('O campo CPF Motorista é obrigatório')
    }
    if ( isNullOrEmpty(data.U_B2AG_LicensePlate) ) {
        messages.push('O campo Placa é obrigatório')
    }
    if ( isNullOrEmpty(data.U_B2AG_PlateFederalUnit) ) {
        messages.push('O campo UF é obrigatório')
    }
    if ( isNullOrEmpty(data.U_B2AG_GrossWeight) ) {
        messages.push('O campo Peso Bruto é obrigatório')
    }

    return messages
}