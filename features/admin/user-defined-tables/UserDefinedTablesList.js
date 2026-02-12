// TableType:
//  - bott_MasterData
//  - bott_MasterDataLines
//  - bott_Document
//  - bott_DocumentLines
//  - bott_NoObjectAutoIncrement
//  - bott_NoObject

import getTranslation from '../../../locales/getTranslation'

export default function getTables() {

    const t = getTranslation()

    return [
        {
            // PARAMETROS GERAIS B2AG
            TableName: 'B2AG_OPMS',
            TableDescription: t["db.udt.B2AG_OPMS"],
            TableType: 'bott_MasterData', 
        },
        {
            // SAFRA
            TableName: 'B2AG_CROP',
            TableDescription: t["db.udt.B2AG_CROP"],
            TableType: 'bott_MasterData', 
        },
        {
            // POSTOMET
            TableName: 'B2AG_OWST',
            TableDescription: t["db.udt.B2AG_OWST"],
            TableType: 'bott_MasterData',
        },
        {
            // ELE_CLIM
            TableName: 'B2AG_WST1',
            TableDescription: t["db.udt.B2AG_WST1"],
            TableType: 'bott_MasterDataLines',
        },
        {
            // CULTURA
            TableName: 'B2AG_OCLT',
            TableDescription: t["db.udt.B2AG_OCLT"],
            TableType: 'bott_MasterData',
        },
        {
            // CULT_ANALISES
            TableName: 'B2AG_CLT1',
            TableDescription: t["db.udt.B2AG_CLT1"],
            TableType: 'bott_MasterDataLines',
        },
        {
            // TIPO_ANALISE
            TableName: 'B2AG_OANL',
            TableDescription: t["db.udt.B2AG_OANL"],
            TableType: 'bott_MasterData',
        },
        {
            // T_ANALISES_LINHAS
            TableName: 'B2AG_ANL1',
            TableDescription: t["db.udt.B2AG_ANL1"],
            TableType: 'bott_MasterDataLines',
        },
        {
            // OPE_AGRI
            TableName: 'B2AG_OAOP',
            TableDescription: t["db.udt.B2AG_OAOP"],
            TableType: 'bott_MasterData',
        },
        {
            // AP_CLIM
            TableName: 'B2AG_OWSN',
            TableDescription: t["db.udt.B2AG_OWSN"],
            TableType: 'bott_Document',
        },
        {
            // AP_CLIM_LIN
            TableName: 'B2AG_WSN1',
            TableDescription: t["db.udt.B2AG_WSN1"],
            TableType: 'bott_DocumentLines',
        },
        {
            // UN_PROD
            TableName: 'B2AG_OPDU',
            TableDescription: t["db.udt.B2AG_OPDU"],
            TableType: 'bott_MasterData',
        },
        {
            // TALHOES
            TableName: 'B2AG_PDU1',
            TableDescription: t["db.udt.B2AG_PDU1"],
            TableType: 'bott_MasterDataLines',
        },
        {
            // B2ROMANEIO
            TableName: 'B2AG_OPKL',
            TableDescription: t["db.udt.B2AG_OPKL"],
            TableType: 'bott_Document',
        },
        {
            // B2ROMANEIO - DETALHES
            TableName: 'B2AG_PKL1',
            TableDescription: t["db.udt.B2AG_PKL1"],
            TableType: 'bott_DocumentLines',
        },
        {
            // B2ROMANEIO - ANALISES
            TableName: 'B2AG_PKL2',
            TableDescription: t["db.udt.B2AG_PKL2"],
            TableType: 'bott_DocumentLines',
        },
        {
            // ROMANEIO DE VENDA
            TableName: 'B2AG_OSPK',
            TableDescription: t["db.udt.B2AG_OSPK"],
            TableType: 'bott_Document',
        },
        {
            // ROMANEIO DE VENDA - DETALHES
            TableName: 'B2AG_SPK1',
            TableDescription: t["db.udt.B2AG_SPK1"],
            TableType: 'bott_DocumentLines',
        },
        {
            // COMBINACAO IMPOSTOS RETIDOS
            TableName: 'B2AG_OWHT',
            TableDescription: t["db.udt.B2AG_OWHT"],
            TableType: 'bott_MasterData',
        },
        {
            // COMBINACAO IMPOSTOS RETIDOS - DETALHES
            TableName: 'B2AG_WHT1',
            TableDescription: t["db.udt.B2AG_WHT1"],
            TableType: 'bott_MasterDataLines',
        },
        {
            // ORDEM DE TRANSFERENCIA
            TableName: 'B2AG_OTFO',
            TableDescription: t["db.udt.B2AG_OTFO"],
            TableType: 'bott_Document',
        },
        {
            // ORDEM DE TRANSFERENCIA - REMETENTE
            TableName: 'B2AG_TFO1',
            TableDescription: t["db.udt.B2AG_TFO1"],
            TableType: 'bott_DocumentLines',
        },
        {
            // ORDEM DE TRANSFERENCIA - DESTINATÁRIO
            TableName: 'B2AG_TFO2',
            TableDescription: t["db.udt.B2AG_TFO2"],
            TableType: 'bott_DocumentLines',
        },
        {
            // RECEBIMENTO DE GRAOS
            TableName: 'B2AG_OGNR',
            TableDescription: t["db.udt.B2AG_OGNR"],
            TableType: 'bott_Document',
        },
        {
            // RECEBIMENTO DE GRAOS
            TableName: 'B2AG_OSDL',
            TableDescription: t["db.udt.B2AG_OSDL"],
            TableType: 'bott_Document',
        },
        {
            // RECEBIMENTO DE GRAOS - DETALHES
            TableName: 'B2AG_SDL1',
            TableDescription: t["db.udt.B2AG_SDL1"],
            TableType: 'bott_DocumentLines',
        },
        {
            // RECEBIMENTO DE GRAOS - ANALISES
            TableName: 'B2AG_SDL2',
            TableDescription: t["db.udt.B2AG_SDL2"],
            TableType: 'bott_DocumentLines',
        },
        {
            // CONTRATO DE BENEFICIAMENTO
            TableName: 'B2AG_OGPC',
            TableDescription: t["db.udt.B2AG_OGPC"],
            TableType: 'bott_Document',
        },
        {
            // CONTRATO DE BENEFICIAMENTO - ITENS
            TableName: 'B2AG_GPC1',
            TableDescription: t["db.udt.B2AG_GPC1"],
            TableType: 'bott_DocumentLines',
        },
        {
            // CHECKIN DE EMBARQUE
            TableName: 'B2AG_OBCI',
            TableDescription: t["db.udt.B2AG_OBCI"],
            TableType: 'bott_Document',
        },
        {
            // ORDEM DE EMBARQUE
            TableName: 'B2AG_OBOD',
            TableDescription: t["db.udt.B2AG_OBOD"],
            TableType: 'bott_Document',
        },
        {
            // ROMANEIO DE VENDA - DETALHES
            TableName: 'B2AG_BOD1',
            TableDescription: t["db.udt.B2AG_BOD1"],
            TableType: 'bott_DocumentLines',
        },
        {
            // ANALISE_PRODUCAO
            TableName: 'B2AG_OPAN',
            TableDescription: t["db.udt.B2AG_OPAN"],
            TableType: 'bott_Document',
        },
        {
            // REGISTRO DE PLANTIO
            TableName: 'B2AG_OPRC',
            TableDescription: t["db.udt.B2AG_OPRC"],
            TableType: 'bott_Document',
        },
        {
            // REGISTRO DE PLANTIO - LINHAS
            TableName: 'B2AG_PRC1',
            TableDescription: t["db.udt.B2AG_PRC1"],
            TableType: 'bott_DocumentLines',
        },
        {
            // ORIGINACAO - RECEBIMENTO DE GRAOS
            TableName: 'B2AG_OGRN',
            TableDescription: t["db.udt.B2AG_OGRN"],
            TableType: 'bott_Document',
        },
        {
            // ORIGINACAO - RECEBIMENTO DE GRAOS - DETALHES
            TableName: 'B2AG_GRN1',
            TableDescription: t["db.udt.B2AG_GRN1"],
            TableType: 'bott_DocumentLines',
        },
        {
            // ORIGINACAO - RECEBIMENTO DE GRAOS - ANALISES
            TableName: 'B2AG_GRN2',
            TableDescription: t["db.udt.B2AG_GRN2"],
            TableType: 'bott_DocumentLines',
        },
        {
            // SEMENTEIRA - TESTE DE CANTEIRO
            TableName: 'B2AG_OTSR',
            TableDescription: t["db.udt.B2AG_OTSR"],
            TableType: 'bott_Document',
        },
        {
            // SEMENTEIRA - TESTE DE CANTEIRO DETALHES
            TableName: 'B2AG_TSR1',
            TableDescription: t["db.udt.B2AG_TSR1"],
            TableType: 'bott_DocumentLines',
        },
    ]
}