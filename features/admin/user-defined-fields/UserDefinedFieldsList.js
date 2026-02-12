import getTranslation from '../../../locales/getTranslation'

// Example field:
// {
//     "Description": "UDF01",
//     "Name": "Anexo",
//     "SubType": "st_Address",
//     "TableName": "OITM",
//     "Type": "db_Alpha",
//     "Size": null (Em campos db_Alpha)
// "ValidValuesMD": [
//     {
//         "Value": "0",
//         "Description": "Itens"
//     },
//     {
//         "Value": "1",
//         "Description": "Mão-de-obra"
//     },
//     {
//         "Value": "2",
//         "Description": "Viagens"
//     }
// ] (Em caso de opções válidas)
// },

// Types:
// db_Alpha (Selecionar "Size")
//  - st_None
//  - st_Address (Anexo)
// db_Date
// db_Numeric
//  - st_None
//  - st_Time
// db_Memo
//  SubTypes:
//  - st_None
//  - st_Link
// db_Float
//  SubTypes:
//  - st_Price
//  - st_Sum
//  - st_Rate
//  - st_Measurement
//  - st_Quantity
//  - st_Percentage


export default function getFields() {

    const t = getTranslation()

    return [
        // OWOR
        {
            Name: 'B2AG_Category',
            Description: t["db.udf.category"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OWOR',
            Size: 15,
        },
        {
            Name: 'B2AG_Strainer',
            Description: t["db.udf.strainer"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: 'OWOR'
        },
        {
            Name: 'B2AG_BagQuantity',
            Description: t["db.udf.bag-quantity"],
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: 'OWOR'
        },
        {
            Name: 'B2AG_ReceivingMoisture',
            Description: t["db.udf.receiving-moisture"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: 'OWOR',
            Size: null
        },
        {
            Name: 'B2AG_BaggingMoisture',
            Description: t["db.udf.bagging-moisture"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: 'OWOR',
            Size: null
        },
        {
            Name: 'B2AG_FarmOfOrigin',
            Description: t["db.udf.farm-of-origin"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OWOR',
            Size: 100
        },
        {
            Name: 'B2AG_PlotOfOrigin',
            Description: t["db.udf.plot-of-origin"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OWOR',
            Size: 25
        },
        {
            Name: 'B2AG_HarvestDate',
            Description: t["db.udf.harvest-date"],
            Type: 'db_Date',
            SubType: 'st_None',
            TableName: 'OWOR',
            Size: null
        },
        {
            Name: 'B2AG_DryingDate',
            Description: t["db.udf.drying-date"],
            Type: 'db_Date',
            SubType: 'st_None',
            TableName: 'OWOR',
            Size: null
        },
        {
            Name: 'B2AG_BaggingDate',
            Description: t["db.udf.bagging-date"],
            Type: 'db_Date',
            SubType: 'st_None',
            TableName: 'OWOR',
            Size: null
        },
        {
            Name: 'B2AG_BagWeight',
            Description: t["db.udf.bag-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: 'OWOR',
            Size: null
        },
        {
            Name: 'B2AG_SPU',
            Description: t["db.udf.spu"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OWOR',
            Size: 50
        },
        {
            Name: 'B2AG_Batch',
            Description: t["db.udf.batch"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OWOR',
            Size: 36,
        },
        {
            Name: 'B2AG_Crop',
            Description: t["db.udf.Crop"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OWOR',
            Size: 30,
        },
        {
            Name: 'B2AG_BatchBag',
            Description: t["db.udf.batch-bag"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OWOR',
            Size: 36,
        },
        {
            Name: 'B2AG_ProcessingContract',
            Description: t["db.udf.processing-contract"],
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: 'OWOR',
        },
        {
            //B2ObjectType
            Name: "B2AG_B2ObjectType",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.B2ObjectType"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "OWOR",
            EditSize: 30,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        //OBTN

        {
            Name: 'B2AG_Category',
            Description: t["db.udf.category"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OBTN',
            Size: 15,
        },
        {
            Name: 'B2AG_Strainer',
            Description: t["db.udf.strainer"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: 'OBTN'
        },
        {
            Name: 'B2AG_BagWeight',
            Description: t["db.udf.bag-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: 'OBTN',
            Size: null
        },
        {
            Name: 'B2AG_TermConformity',
            Description: t["db.udf.term-of-conformity"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OBTN',
            Size: 10,
        },
        {
            Name: 'B2AG_Germination',
            Description: t["db.udf.germination"],
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: 'OBTN'
        },
        {
            Name: 'B2AG_Purity',
            Description: t["db.udf.purity"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: 'OBTN',
            Size: null
        },
        {
            Name: 'B2AG_ValidityTest',
            Description: t["db.udf.validity-test"],
            Type: 'db_Date',
            SubType: 'st_None',
            TableName: 'OBTN',
            Size: null
        },
        {
            Name: 'B2AG_DateTest',
            Description: t["db.udf.date-test"],
            Type: 'db_Date',
            SubType: 'st_None',
            TableName: 'OBTN',
            Size: null
        },
        {
            Name: 'B2AG_Crop',
            Description: t["db.udf.Crop"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OBTN',
            Size: 30,
        },
        {
            Name: 'B2AG_PMS',
            Description: t["db.udf.pms"],
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: 'OBTN'
        },

        //   RDR1
        {
            Name: 'B2AG_Category',
            Description: t["db.udf.category"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'RDR1',
            Size: 15,
        },
        {
            Name: 'B2AG_Strainer',
            Description: t["db.udf.strainer"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: 'RDR1'
        },
        {
            Name: 'B2AG_BagQuantity',
            Description: t["db.udf.bag-quantity"],
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: 'RDR1'
        },
        {
            Name: 'B2AG_BagPrice',
            Description: t["db.udf.bag-price"],
            Type: 'db_Float',
            SubType: 'st_Price',
            TableName: 'RDR1'
        },
        {
            Name: 'B2AG_BatchDetails',
            Description: 'Detalhes do Lote',
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'RDR1',
            Size: 254,
        },
        {
            Name: 'B2AG_LineNumOrder',
            Description: 'Linha Pedido Base',
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: 'RDR1'
        },{
            Name: 'B2AG_OrderEntry',
            Description: 'Pedido Base',
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: 'RDR1'
        },
         
        //POR1
        {
            Name: 'B2AG_Batch',
            Description: t["db.udf.batch"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'POR1',
            Size: 36,
        },

        // Agri

        // B2AG_CROP 
        {
            // Status
            Name: "B2AG_Status",
            Type: "db_Alpha",
            Size: 10,
            Description: t["db.udf.Status"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_CROP",
            FieldID: 3,
            EditSize: 10,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: [
                {
                    Value: "A",
                    Description: "Em Andamento"
                },
                {
                    Value: "F",
                    Description: "Finalizado"
                }
            ]
        },
        {
            // DataIni
            Name: "B2AG_InitialDate",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.InitialDate"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_CROP",
            FieldID: 1,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // DataFin
            Name: "B2AG_FinalDate",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.FinalDate"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_CROP",
            FieldID: 2,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        // B2AG_OWST
        {
            Name: 'B2AG_ProductionUnitCode',
            Description: t["db.udf.ProductionUnitCode"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OWST',
            Size: 50,
        },


        // B2AG_WST1
        {
            // Elemento
            Name: "B2AG_Element",
            Type: "db_Alpha",
            Size: 25,
            Description: t["db.udf.Element"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_WST1",
            FieldID: 0,
            EditSize: 25,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // UM
            Name: "B2AG_UnitOfMeasurement",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.UnitOfMeasurement"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_WST1",
            FieldID: 1,
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        // B2AG_OCLT
        {
            // ItemCode
            Name: "B2AG_ItemCode",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.ItemCode"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OCLT",
            FieldID: 3,
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: "ulItems",
            ValidValuesMD: []
        },
        {
            // UnProdutividade
            Name: "B2AG_ProductivityMeasurementUnit",
            Type: "db_Alpha",
            Size: 30,
            Description: t["db.udf.ProductivityMeasurementUnit"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OCLT",
            FieldID: 2,
            EditSize: 30,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Perene
            Name: "B2AG_Perennial",
            Type: "db_Alpha",
            Size: 10,
            Description: t["db.udf.Perennial"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OCLT",
            FieldID: 1,
            EditSize: 10,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: [
                {
                    Value: "S",
                    Description: "SIM"
                },
                {
                    Value: "N",
                    Description: "NÃO"
                }
            ]
        },

        // B2AG_CLT1
        {
            // Description
            Name: "B2AG_Code",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.Code"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_CLT1",
            FieldID: 3,
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Description
            Name: "B2AG_Description",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.Description"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_CLT1",
            FieldID: 3,
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        // B2AG_OANL
        {
            // Cultura
            Name: "B2AG_Cultivation",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.Cultivation"],
            SubType: "st_None",
            LinkedTable: "CULTURA",
            DefaultValue: null,
            TableName: "@B2AG_OANL",
            FieldID: 0,
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        // B2AG_ANL1
        {
            // AnaliseDe
            Name: "B2AG_AnalisysFrom",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.AnalisysFrom"],
            SubType: "st_Sum",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_ANL1",
            FieldID: 0,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // AnaliseAte
            Name: "B2AG_AnalisysTo",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.AnalisysTo"],
            SubType: "st_Sum",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_ANL1",
            FieldID: 1,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Desconto
            Name: "B2AG_Discount",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.Discount"],
            SubType: "st_Percentage",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_ANL1",
            FieldID: 2,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        // B2AG_OAOP
        {
            // Status
            Name: "B2AG_Status",
            Type: "db_Alpha",
            Size: 10,
            Description: t["db.udf.Status"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OAOP",
            FieldID: 0,
            EditSize: 10,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: [
                {
                    Value: "A",
                    Description: "Ativo"
                },
                {
                    Value: "I",
                    Description: "Inativo"
                }
            ]
        },

        // B2AG_OWSN
        {
            // Data
            Name: "B2AG_RegisterDate",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.RegisterDate"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OWSN",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // PostoID
            Name: "B2AG_PostId",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.PostId"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OWSN",
            FieldID: 2,
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Obs
            Name: "B2AG_Comments",
            Type: "db_Alpha",
            Size: 254,
            Description: t["db.udf.Comments"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OWSN",
            FieldID: 1,
            EditSize: 254,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },


        // B2AG_WSN1
        {
            // Elemento
            Name: "B2AG_Element",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.Element"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_WSN1",
            FieldID: 0,
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Valor
            Name: "B2AG_Value",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.Value"],
            SubType: "st_Quantity",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_WSN1",
            FieldID: 1,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        // B2AG_PDU1
        {
            // TalhaoCode
            Name: "B2AG_Code",
            Type: "db_Alpha",
            Size: 15,
            Description: t["db.udf.FieldCode"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_PDU1",
            FieldID: 4,
            EditSize: 15,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Area
            Name: "B2AG_AreaHa",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.AreaHa"],
            SubType: "st_Measurement",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_PDU1",
            FieldID: 0,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // BPLId
            Name: "B2AG_BPLId",
            Type: "db_Alpha",
            Size: 3,
            Description: t["db.udf.BPLId"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_PDU1",
            FieldID: 3,
            EditSize: 3,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Produtor
            Name: "B2AG_Producer",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.Producer"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_PDU1",
            FieldID: 1,
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // PostoMeteorologico
            Name: "B2AG_WeatherStation",
            Type: "db_Alpha",
            Size: 30,
            Description: t["db.udf.WeatherStation"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_PDU1",
            FieldID: 6,
            EditSize: 30,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Ativo
            Name: "B2AG_Active",
            Type: "db_Alpha",
            Size: 10,
            Description: t["db.udf.Active"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_PDU1",
            FieldID: 2,
            EditSize: 10,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: [
                {
                    Value: "A",
                    Description: "Ativo"
                },
                {
                    Value: "I",
                    Description: "Inativo"
                }
            ]
        },

        // B2AG_OPKL
        {
            // Data
            Name: "B2AG_Date",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.Date"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPKL",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Data
            Name: "B2AG_Time",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.Time"],
            SubType: "st_Time",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPKL",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // UnProdCode
            Name: "B2AG_ProductionUnitCode",
            Type: "db_Numeric",
            Description: t["db.udf.ProductionUnitCode"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPKL",
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            //B2TransId
            Name: "B2AG_B2TransId",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.B2TransId"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPKL",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            //B2ObjectType
            Name: "B2AG_B2ObjectType",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.B2ObjectType"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPKL",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Peso Tara
            Name: 'B2AG_TareWeight',
            Description: t["db.udf.tare-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OPKL',
            Size: null
        },
        {
            // Peso Bruto
            Name: 'B2AG_GrossWeight',
            Description: t["db.udf.gross-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OPKL',
            Size: null
        },
        {
            // Peso Neto
            Name: 'B2AG_NetWeight',
            Description: t["db.udf.net-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OPKL',
            Size: null
        },
        {
            // Peso Liquido
            Name: 'B2AG_LiquidWeight',
            Description: t["db.udf.liquid-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OPKL',
            Size: null
        },
        {
            // Peso Embalagem
            Name: 'B2AG_PackingWeight',
            Description: t["db.udf.packing-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OPKL',
            Size: null
        },
        {
            // Desconto Kg
            Name: 'B2AG_DiscountKg',
            Description: t["db.udf.discount-kg"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OPKL',
            Size: null
        },
        {
            // Motorista
            Name: "B2AG_Driver",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.driver"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPKL",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // CPF Motorista
            Name: "B2AG_DriverDocument",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.driver-document"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPKL",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Placa
            Name: "B2AG_LicensePlate",
            Type: "db_Alpha",
            Size: 8,
            Description: t["db.udf.LicensePlate"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPKL",
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // UFPlaca
            Name: "B2AG_PlateFederalUnit",
            Type: "db_Alpha",
            Size: 10,
            Description: t["db.udf.PlateFederalUnit"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPKL",
            EditSize: 10,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Transportadora
            Name: "B2AG_ShippingCompany",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.ShippingCompany"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPKL",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Observações
            Name: "B2AG_Comments",
            Type: "db_Alpha",
            Size: 254,
            Description: t["db.udf.Comments"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPKL",
            EditSize: 254,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // ItemCode
            Name: "B2AG_Cultivation",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.Cultivation"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPKL",
            FieldID: 3,
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Lote
            Name: "B2AG_Batch",
            Type: "db_Alpha",
            Size: 30,
            Description: t["db.udf.batch"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPKL",
            EditSize: 30,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // CCG
            Name: "B2AG_CCG",
            Type: "db_Alpha",
            Size: 30,
            Description: t["db.udf.ccg"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPKL",
            EditSize: 30,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Numero do Ticket
            Name: 'B2AG_TicketNumber',
            Description: t["db.udf.ticket-number"],
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: '@B2AG_OPKL'
        },
        {
            // Safra
            Name: "B2AG_Crop",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.Crop"],
            SubType: "st_None",
            TableName: "@B2AG_OPKL",
        },
        {
            // Filial
            Name: "B2AG_BPLId",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.BPLId"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPKL",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Deposito Destino
            Name: "B2AG_DestinationWhs",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.B2AG_DestinationWhs"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPKL",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Local de Entrega
            Name: "B2AG_DeliveryPlace",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.B2AG_DeliveryPlace"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPKL",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },


        // B2AG_PKL1
        {
            // Variedade
            Name: "B2AG_Variety",
            Type: "db_Alpha",
            Size: 100,
            Description: t["db.udf.variety"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_PKL1",
            EditSize: 100,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Talhao
            Name: "B2AG_Field",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.field"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_PKL1",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Quantidade
            Name: "B2AG_Quantity",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.Quantity"],
            SubType: "st_Quantity",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_PKL1",
            FieldID: 1,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        // B2AG_PKL2
        {
            // Codigo
            Name: "B2AG_Code",
            Type: "db_Alpha",
            Size: 100,
            Description: t["db.udf.Code"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_PKL2",
            EditSize: 100,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Descrição
            Name: "B2AG_Description",
            Type: "db_Alpha",
            Size: 100,
            Description: t["db.udf.Description"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_PKL2",
            EditSize: 100,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Valor
            Name: "B2AG_Value",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.Value"],
            SubType: "st_Percentage",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_PKL2",
            FieldID: 2,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Quantidade
            Name: "B2AG_Quantity",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.Quantity"],
            SubType: "st_Quantity",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_PKL2",
            FieldID: 1,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            Name: 'B2AG_BusinessPartner',
            Description: t["db.udf.BusinessPartner"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OWHS',
            Size: 15,
        },
        {
            Name: 'B2AG_AgriOperation',
            Type: 'db_Alpha',
            Size: 10,
            Description: t["db.udf.AgriOperation"],
            SubType: 'st_None',
            DefaultValue: 'A',
            TableName: 'OWHS',
            FieldID: 6,
            EditSize: 10,
            Mandatory: 'tNO',
            ValidValuesMD: [
                {
                    Value: 'A',
                    Description: 'Ativo'
                },
                {
                    Value: 'I',
                    Description: 'Inativo'
                }
            ]
        },
        {
            Name: 'B2AG_CustomerAddressId',
            Description: t["db.udf.customer-address-id"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OWHS',
            Size: 50,
        },

        // B2AG_OSPK
        {
            // Data
            Name: "B2AG_Date",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.Date"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSPK",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Time
            Name: "B2AG_Time",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.Time"],
            SubType: "st_Time",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSPK",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            Name: 'B2AG_Order',
            Description: t["db.udf.order"],
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: '@B2AG_OSPK'
        },
        {
            Name: 'B2AG_AddDesc',
            Description: t["db.udf.AddDesc"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OSPK',
            Size: 20,
        },
        {
            Name: "B2AG_Driver",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.driver"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSPK",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {

            Name: "B2AG_LicensePlate",
            Type: "db_Alpha",
            Size: 8,
            Description: t["db.udf.LicensePlate"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSPK",
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            Name: "B2AG_PlateFederalUnit",
            Type: "db_Alpha",
            Size: 10,
            Description: t["db.udf.PlateFederalUnit"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSPK",
            EditSize: 10,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            Name: "B2AG_ShippingCompany",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.ShippingCompany"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSPK",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            Name: 'B2AG_TareWeight',
            Description: t["db.udf.tare-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OSPK',
            Size: null
        },
        {
            Name: 'B2AG_GrossWeight',
            Description: t["db.udf.gross-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OSPK',
            Size: null
        },
        {
            Name: 'B2AG_PackingWeight',
            Description: t["db.udf.packing-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OSPK',
            Size: null
        },
        {
            Name: 'B2AG_LiquidWeight',
            Description: t["db.udf.liquid-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OSPK',
            Size: null
        },
        {
            Name: "B2AG_Comments",
            Type: "db_Alpha",
            Size: 254,
            Description: t["db.udf.Comments"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSPK",
            FieldID: 1,
            EditSize: 254,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            Name: 'B2AG_Invoice',
            Description: t["db.udf.invoice"],
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: '@B2AG_OSPK'
        },
        {
            // Peso Tara Final
            Name: 'B2AG_TareWeightFinal',
            Description: t["db.udf.tare-weight-final"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OSPK',
            Size: null
        },
        {
            // Peso Bruto Final
            Name: 'B2AG_GrossWeightFinal',
            Description: t["db.udf.gross-weight-final"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OSPK',
            Size: null
        },
        {
            // Peso Liquido Final
            Name: 'B2AG_LiquidWeightFinal',
            Description: t["db.udf.liquid-weight-final"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OSPK',
            Size: null
        },
        {
            // Safra
            Name: "B2AG_Crop",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.Crop"],
            SubType: "st_None",
            TableName: "@B2AG_OSPK",
        },
        {
            Name: 'B2AG_Batch',
            Description: t["db.udf.batch"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: "@B2AG_OSPK",
            Size: 36,
        },

        // B2AG_PKL2
        {
            // Codigo
            Name: "B2AG_Code",
            Type: "db_Alpha",
            Size: 100,
            Description: t["db.udf.Code"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_SPK1",
            EditSize: 100,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Descrição
            Name: "B2AG_Description",
            Type: "db_Alpha",
            Size: 100,
            Description: t["db.udf.Description"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_SPK1",
            EditSize: 100,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Valor
            Name: "B2AG_Value",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.Value"],
            SubType: "st_Percentage",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_SPK1",
            FieldID: 2,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Valor Final
            Name: "B2AG_ValueFinal",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.Value-Final"],
            SubType: "st_Percentage",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_SPK1",
            FieldID: 2,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        //B2AG_WHT1

        {
            Name: "B2AG_WTCode",
            Type: "db_Alpha",
            Size: 10,
            Description: t["db.udf.Code"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_WHT1",
            FieldID: 0,
            EditSize: 10,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            Name: "B2AG_WTBase",
            Type: "db_Alpha",
            Size: 10,
            Description: t["db.udf.Base"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_WHT1",
            FieldID: 0,
            EditSize: 10,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: [
                {
                    Value: "QTD",
                    Description: "Quantidade"
                },
                {
                    Value: "VLR",
                    Description: "Valor Total"
                }
            ]
        },

        //ORDR
        {
            Name: "B2AG_WTCode",
            Type: "db_Alpha",
            Size: 50,
            Description: "Combinação IRF",
            SubType: "st_None",
            LinkedTable: "B2AG_OWHT",
            DefaultValue: null,
            TableName: "ORDR",
            FieldID: 96,
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        //OWHT
        {
            Name: 'B2AG_Pauta',
            Description: t["db.udf.pauta"],
            Type: 'db_Float',
            SubType: 'st_Price',
            TableName: 'OWHT'
        },

        //OBPL
        {
            Name: 'B2AG_CND',
            Description: t["db.udf.cnd"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OBPL',
            Size: 25,
        },
        {
            Name: 'B2AG_Authentication',
            Description: t["db.udf.authentication"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OBPL',
            Size: 25,
        },
        {
            Name: 'B2AG_DocDueDate',
            Description: t["db.udf.doc-due-date"],
            Type: 'db_Date',
            SubType: 'st_None',
            TableName: 'OBPL',
            Size: null
        },
        {
            Name: 'B2AG_APIKey',
            Description: t["db.udf.api-key"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OBPL',
            Size: 100,
        },
        {
            Name: 'B2AG_APISecret',
            Description: t["db.udf.api-secret"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OBPL',
            Size: 100,
        },
        {
            Name: 'B2AG_WhsField',
            Description: t["db.udf.warehouse-field"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OBPL',
            Size: 25,
        },
        {
            Name: 'B2AG_WhsDropShip',
            Description: t["db.udf.warehouse-dropship"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OBPL',
            Size: 25,
        },
        {
            Name: 'B2AG_CustomerAddressId',
            Description: t["db.udf.customer-address-id"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OBPL',
            Size: 25,
        },
        {
            Name: 'B2AG_SupplierAddressId',
            Description: t["db.udf.supplier-address-id"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OBPL',
            Size: 25,
        },

        //CRD1
        {
            Name: 'B2AG_CND',
            Description: t["db.udf.cnd"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'CRD1',
            Size: 25,
        },
        {
            Name: 'B2AG_Authentication',
            Description: t["db.udf.authentication"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'CRD1',
            Size: 25,
        },
        {
            Name: 'B2AG_DocDueDate',
            Description: t["db.udf.doc-due-date"],
            Type: 'db_Date',
            SubType: 'st_None',
            TableName: 'CRD1',
            Size: null
        },

        //OPDN
        {
            // Data
            Name: "B2AG_Time",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.Time"],
            SubType: "st_Time",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "OPDN",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Motorista
            Name: "B2AG_Driver",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.driver"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "OPDN",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            Name: 'B2AG_TareWeight',
            Description: t["db.udf.tare-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: 'OPDN',
            Size: null
        },
        {
            Name: 'B2AG_GrossWeight',
            Description: t["db.udf.gross-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: 'OPDN',
            Size: null
        },
        {
            Name: 'B2AG_LiquidWeight',
            Description: t["db.udf.liquid-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: 'OPDN',
            Size: null
        },
        {
            Name: 'B2AG_ObjectEntry',
            Description: t["db.udf.object-entry"],
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: 'OPDN'
        },
        {
            Name: "B2AG_WhsExit",
            Type: "db_Alpha",
            Size: 10,
            Description: "Saída de Almoxarifado",
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: "N",
            TableName: "OPDN",
            FieldID: 121,
            EditSize: 10,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: [
                {
                    Value: "N",
                    Description: "Não aplicável"
                },
                {
                    Value: "Y",
                    Description: "Aplicável"
                },
                {
                    Value: "B",
                    Description: "Baixado"
                }
            ]
        },

        //OITM
        {
            Name: 'B2AG_CultivationCode',
            Description: t["db.udf.cultivation-code"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OITM',
            Size: 25,
        },
        {
            Name: 'B2AG_VarietyDescription',
            Description: t["db.udf.variety-description"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OITM',
            Size: 100,
        },

        //OINV
        {
            //Safra
            Name: 'B2AG_Crop',
            Description: t["db.udf.Crop"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OINV',
            Size: 30,
        },
        {
            //B2ObjectType
            Name: "B2AG_B2ObjectType",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.B2ObjectType"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "OINV",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        //OJDT
        {
            //Safra
            Name: 'B2AG_Crop',
            Description: t["db.udf.Crop"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OJDT',
            Size: 30,
        },

        //B2AG_OTFO
        {
            //Descrição
            Name: 'B2AG_Description',
            Description: t["db.udf.Description"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OTFO',
            Size: 100,
        },
        {
            //Data
            Name: 'B2AG_Date',
            Description: t["db.udf.Date"],
            Type: 'db_Date',
            SubType: 'st_None',
            TableName: '@B2AG_OTFO',
            Size: null
        },
        {
            //Filial de Origem
            Name: 'B2AG_OriginBranch',
            Description: t["db.udf.origin-branch"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OTFO',
            Size: 100,
        },
        {
            //Filial de Destino
            Name: 'B2AG_DestinationBranch',
            Description: t["db.udf.destination-branch"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OTFO',
            Size: 100,
        },
        {
            //Incoterms
            Name: 'B2AG_Incoterms',
            Description: t["db.udf.incoterms"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OTFO',
            Size: 30,
        },
        {
            //Safra
            Name: 'B2AG_Crop',
            Description: t["db.udf.Crop"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OTFO',
            Size: 30,
        },
        {
            //Tipo de Remessa
            Name: 'B2AG_DeliveryType',
            Description: t["db.udf.delivery-type"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OTFO',
            Size: 30,
        },

        //B2AG_TFO1
        {
            //Código do Item
            Name: 'B2AG_ItemCode',
            Description: t["db.udf.ItemCode"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_TFO1',
            Size: 50,
        },
        {
            //Descrição do Item
            Name: 'B2AG_ItemName',
            Description: t["db.udf.ItemName"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_TFO1',
            Size: 50,
        },
        {
            Name: 'B2AG_Batch',
            Description: t["db.udf.batch"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_TFO1',
            Size: 36,
        },
        {
            // Quantidade
            Name: "B2AG_Quantity",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.Quantity"],
            SubType: "st_Quantity",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_TFO1",
            FieldID: 1,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            //Depósito
            Name: 'B2AG_Warehouse',
            Description: t["db.udf.warehouse"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_TFO1',
            Size: 8,
        },
        {
            //Utilização
            Name: 'B2AG_Usage',
            Description: t["db.udf.usage"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_TFO1',
            Size: 50,
        },
        {
            //Codigo Imposto
            Name: 'B2AG_TaxCode',
            Description: t["db.udf.tax-code"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_TFO1',
            Size: 8,
        },
        {
            //Info Contribuinte
            Name: 'B2AG_OpeningRemarks',
            Description: t["db.udf.opening-remarks"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_TFO1',
            Size: 250,
        },
        {
            //Info Fisco
            Name: 'B2AG_ClosingRemarks',
            Description: t["db.udf.closing-remarks"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_TFO1',
            Size: 250,
        },
        {
            //Base de Preco
            Name: 'B2AG_BasePrice',
            Description: t["db.udf.base-price"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_TFO1',
            Size: 10,
        },
        {
            Name: 'B2AG_Pauta',
            Description: t["db.udf.pauta"],
            Type: 'db_Float',
            SubType: 'st_Price',
            TableName: '@B2AG_TFO1'
        },

        //B2AG_TFO2
        {
            //Código do Item
            Name: 'B2AG_ItemCode',
            Description: t["db.udf.ItemCode"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_TFO2',
            Size: 50,
        },
        {
            //Descrição do Item
            Name: 'B2AG_ItemName',
            Description: t["db.udf.ItemName"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_TFO2',
            Size: 50,
        },
        {
            Name: 'B2AG_Batch',
            Description: t["db.udf.batch"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_TFO2',
            Size: 36,
        },
        {
            // Quantidade
            Name: "B2AG_Quantity",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.Quantity"],
            SubType: "st_Quantity",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_TFO2",
            FieldID: 1,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            //Depósito
            Name: 'B2AG_Warehouse',
            Description: t["db.udf.warehouse"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_TFO2',
            Size: 8,
        },
        {
            //Utilização
            Name: 'B2AG_Usage',
            Description: t["db.udf.usage"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_TFO2',
            Size: 50,
        },
        {
            //Codigo Imposto
            Name: 'B2AG_TaxCode',
            Description: t["db.udf.tax-code"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_TFO2',
            Size: 8,
        },
        {
            //Info Contribuinte
            Name: 'B2AG_OpeningRemarks',
            Description: t["db.udf.opening-remarks"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_TFO2',
            Size: 250,
        },
        {
            //Info Fisco
            Name: 'B2AG_ClosingRemarks',
            Description: t["db.udf.closing-remarks"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_TFO2',
            Size: 250,
        },

        // OIGE
        {
            //Equipamento
            Name: 'B2AG_Equipment',
            Description: t["db.udf.equipment"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OIGE',
            Size: 100,
        },
        {
            //Odomentro
            Name: 'B2AG_Odometer',
            Description: t["db.udf.bag-odometer"],
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: 'OIGE'
        },
        {
            //Equipamento
            Name: 'B2AG_Operator',
            Description: t["db.udf.operator"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'OIGE',
            Size: 100,
        },
        {
            // Cultura
            Name: "B2AG_Cultivation",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.Cultivation"],
            SubType: "st_None",
            LinkedTable: "CULTURA",
            DefaultValue: null,
            TableName: "OIGE",
        },
        {
            // DataIni
            Name: "B2AG_InitialDate",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.InitialDate"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "OIGE",
            FieldID: 1,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // InitialTime
            Name: "B2AG_InitialTime",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.InitialTime"],
            SubType: "st_Time",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "OIGE",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // DataFin
            Name: "B2AG_FinalDate",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.FinalDate"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "OIGE",
            FieldID: 2,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // FinalTime
            Name: "B2AG_FinalTime",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.FinalTime"],
            SubType: "st_Time",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "OIGE",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            //AgriOperation
            Name: "B2AG_AgriOperation",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.AgriOperation"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "OIGE",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Area Realizada
            Name: "B2AG_PerformedArea",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.PerformedArea"],
            SubType: "st_Measurement",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "OIGE",
            FieldID: 0,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        //B2AG_OGNR
        {
            // Data
            Name: "B2AG_Date",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.Date"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGNR",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Time
            Name: "B2AG_Time",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.Time"],
            SubType: "st_Time",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGNR",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            //Depósito
            Name: 'B2AG_Warehouse',
            Description: t["db.udf.warehouse"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OGNR',
            Size: 8,
        },
        {
            //B2ObjectType
            Name: "B2AG_B2ObjectType",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.B2ObjectType"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGNR",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        //IGE1
        {
            // Variedade
            Name: "B2AG_Variety",
            Type: "db_Alpha",
            Size: 100,
            Description: t["db.udf.variety"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "IGE1",
            EditSize: 100,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Talhao
            Name: "B2AG_Field",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.field"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "IGE1",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        // ODLN
        {
            //Tipo de Remessa
            Name: 'B2AG_DeliveryType',
            Description: t["db.udf.delivery-type"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: 'ODLN',
            Size: 30,
        },
        {
            //B2TransId
            Name: "B2AG_B2TransId",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.B2TransId"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "ODLN",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        // B2AG_OSDL
        {
            // Data
            Name: "B2AG_Date",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.Date"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSDL",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Time
            Name: "B2AG_Time",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.Time"],
            SubType: "st_Time",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSDL",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            //Contrato
            Name: "B2AG_Contract",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.Contract"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSDL",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // UnProdCode
            Name: "B2AG_ProductionUnitCode",
            Type: "db_Numeric",
            Description: t["db.udf.ProductionUnitCode"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSDL",
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            //B2TransId
            Name: "B2AG_B2TransId",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.B2TransId"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSDL",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            //B2ObjectType
            Name: "B2AG_B2ObjectType",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.B2ObjectType"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSDL",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Peso Tara
            Name: 'B2AG_TareWeight',
            Description: t["db.udf.tare-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OSDL',
            Size: null
        },
        {
            // Peso Bruto
            Name: 'B2AG_GrossWeight',
            Description: t["db.udf.gross-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OSDL',
            Size: null
        },
        {
            // Peso Neto
            Name: 'B2AG_NetWeight',
            Description: t["db.udf.net-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OSDL',
            Size: null
        },
        {
            // Peso Liquido
            Name: 'B2AG_LiquidWeight',
            Description: t["db.udf.liquid-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OSDL',
            Size: null
        },
        {
            // Peso Embalagem
            Name: 'B2AG_PackingWeight',
            Description: t["db.udf.packing-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OSDL',
            Size: null
        },
        {
            // Desconto Kg
            Name: 'B2AG_DiscountKg',
            Description: t["db.udf.discount-kg"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OSDL',
            Size: null
        },
        {
            // Motorista
            Name: "B2AG_Driver",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.driver"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSDL",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // CPF Motorista
            Name: "B2AG_DriverDocument",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.driver-document"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSDL",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Placa
            Name: "B2AG_LicensePlate",
            Type: "db_Alpha",
            Size: 8,
            Description: t["db.udf.LicensePlate"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSDL",
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // UFPlaca
            Name: "B2AG_PlateFederalUnit",
            Type: "db_Alpha",
            Size: 10,
            Description: t["db.udf.PlateFederalUnit"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSDL",
            EditSize: 10,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Transportadora
            Name: "B2AG_ShippingCompany",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.ShippingCompany"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSDL",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Observações
            Name: "B2AG_Comments",
            Type: "db_Alpha",
            Size: 254,
            Description: t["db.udf.Comments"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSDL",
            EditSize: 254,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // ItemCode
            Name: "B2AG_Cultivation",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.Cultivation"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSDL",
            FieldID: 3,
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Lote
            Name: "B2AG_Batch",
            Type: "db_Alpha",
            Size: 30,
            Description: t["db.udf.batch"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSDL",
            EditSize: 30,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // CCG
            Name: "B2AG_CCG",
            Type: "db_Alpha",
            Size: 30,
            Description: t["db.udf.ccg"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSDL",
            EditSize: 30,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Numero do Ticket
            Name: 'B2AG_TicketNumber',
            Description: t["db.udf.ticket-number"],
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: '@B2AG_OSDL'
        },
        {
            // Safra
            Name: "B2AG_Crop",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.Crop"],
            SubType: "st_None",
            TableName: "@B2AG_OSDL",
        },
        {
            // Filial
            Name: "B2AG_BPLId",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.BPLId"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSDL",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Deposito Destino
            Name: "B2AG_DestinationWhs",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.B2AG_DestinationWhs"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSDL",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Local de Entrega
            Name: "B2AG_DeliveryPlace",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.B2AG_DeliveryPlace"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OSDL",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },


        // B2AG_SDL1
        {
            // Variedade
            Name: "B2AG_Variety",
            Type: "db_Alpha",
            Size: 100,
            Description: t["db.udf.variety"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_SDL1",
            EditSize: 100,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Talhao
            Name: "B2AG_Field",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.field"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_SDL1",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Quantidade
            Name: "B2AG_Quantity",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.Quantity"],
            SubType: "st_Quantity",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_SDL1",
            FieldID: 1,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        // B2AG_SDL2
        {
            // Codigo
            Name: "B2AG_Code",
            Type: "db_Alpha",
            Size: 100,
            Description: t["db.udf.Code"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_SDL2",
            EditSize: 100,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Descrição
            Name: "B2AG_Description",
            Type: "db_Alpha",
            Size: 100,
            Description: t["db.udf.Description"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_SDL2",
            EditSize: 100,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Valor
            Name: "B2AG_Value",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.Value"],
            SubType: "st_Percentage",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_SDL2",
            FieldID: 2,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Quantidade
            Name: "B2AG_Quantity",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.Quantity"],
            SubType: "st_Quantity",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_SDL2",
            FieldID: 1,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        //B2AG_OGPC
        {
            //Descrição
            Name: 'B2AG_Description',
            Description: t["db.udf.Description"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OGPC',
            Size: 100,
        },
        {
            //Data
            Name: 'B2AG_Date',
            Description: t["db.udf.Date"],
            Type: 'db_Date',
            SubType: 'st_None',
            TableName: '@B2AG_OGPC',
            Size: null
        },
        {
            //Filial
            Name: 'B2AG_Branch',
            Description: t["db.udf.branch"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OGPC',
            Size: 100,
        },
        {
            //Fornecedor
            Name: 'B2AG_BPCardCode',
            Description: t["db.udf.bp-card-code"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OGPC',
            Size: 15,
        },
        {
            //Nome - Fornecedor
            Name: 'B2AG_BPCardName',
            Description: t["db.udf.bp-card-name"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OGPC',
            Size: 100,
        },
        {
            //Incoterms
            Name: 'B2AG_Incoterms',
            Description: t["db.udf.incoterms"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OGPC',
            Size: 30,
        },
        {
            //Safra
            Name: 'B2AG_Crop',
            Description: t["db.udf.Crop"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OGPC',
            Size: 30,
        },
        {
            //Tipo de Remessa
            Name: 'B2AG_DeliveryType',
            Description: t["db.udf.delivery-type"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OGPC',
            Size: 30,
        },
        {
            //Sequenciador
            Name: 'B2AG_SequenceCode',
            Description: t["db.udf.sequence-code"],
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: '@B2AG_OGPC'
        },
        {
            //Sequenciador
            Name: 'B2AG_InvoiceIssuance',
            Description: t["db.udf.invoice-issuance"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OGPC',
            Size: 30,
        },
        {
            //Codigo Endereco - Fornecedor
            Name: 'B2AG_SupplierAddressId',
            Description: t["db.udf.supplier-address-id"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OGPC',
            Size: 50,
        },

        //B2AG_GPD1
        {
            //Código do Item
            Name: 'B2AG_ItemCode',
            Description: t["db.udf.ItemCode"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_GPC1',
            Size: 50,
        },
        {
            //Descrição do Item
            Name: 'B2AG_ItemName',
            Description: t["db.udf.ItemName"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_GPC1',
            Size: 50,
        },
        {
            // Quantidade
            Name: "B2AG_Quantity",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.Quantity"],
            SubType: "st_Quantity",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_GPC1",
            FieldID: 1,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            //Depósito
            Name: 'B2AG_Warehouse',
            Description: t["db.udf.warehouse"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_GPC1',
            Size: 8,
        },
        {
            //Utilização
            Name: 'B2AG_Usage',
            Description: t["db.udf.usage"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_GPC1',
            Size: 50,
        },
        {
            //Codigo Imposto
            Name: 'B2AG_TaxCode',
            Description: t["db.udf.tax-code"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_GPC1',
            Size: 8,
        },
        {
            // Pauta
            Name: 'B2AG_Pauta',
            Description: t["db.udf.pauta"],
            Type: 'db_Float',
            SubType: 'st_Price',
            TableName: '@B2AG_GPC1'
        },
        {
            //Info Contribuinte
            Name: 'B2AG_OpeningRemarks',
            Description: t["db.udf.opening-remarks"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_GPC1',
            Size: 250,
        },
        {
            //Info Fisco
            Name: 'B2AG_ClosingRemarks',
            Description: t["db.udf.closing-remarks"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_GPC1',
            Size: 250,
        },

        //B2AG_OBCI

        {
            // Hora Chegada
            Name: "B2AG_ArrivalTime",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.Time"],
            SubType: "st_Time",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OBCI",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            //Data
            Name: 'B2AG_ArrivalDate',
            Description: t["db.udf.Date"],
            Type: 'db_Date',
            SubType: 'st_None',
            TableName: '@B2AG_OBCI',
            Size: null
        },
        {
            // Motorista
            Name: "B2AG_Driver",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.driver"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OBCI",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // CPF Motorista
            Name: "B2AG_TaxId4",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.driver-document"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OBCI",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            Name: "B2AG_CodeShipCompany",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.CodeShipCompany"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OBCI",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            Name: "B2AG_ShipCompany",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.ShipCompany"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OBCI",
            EditSize: 150,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            Name: "B2AG_CNH",
            Type: "db_Alpha",
            Size: 25,
            Description: "CNH",
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OBCI",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Placa
            Name: "B2AG_LicensePlate",
            Type: "db_Alpha",
            Size: 8,
            Description: t["db.udf.LicensePlate"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OBCI",
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // UFPlaca
            Name: "B2AG_PlateFederalUnit",
            Type: "db_Alpha",
            Size: 2,
            Description: t["db.udf.PlateFederalUnit"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OBCI",
            EditSize: 2,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        // B2AG_OBOD
        {
            // Data
            Name: "B2AG_Date",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.Date"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OBOD",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Numero do Checkin
            Name: 'B2AG_CheckinNumber',
            Description: t["db.udf.checkin-number"],
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: '@B2AG_OBOD'
        },
        {
            Name: 'B2AG_Order',
            Description: t["db.udf.order"],
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: '@B2AG_OBOD'
        },
        {
            Name: 'B2AG_ShipToCode',
            Description: t["db.udf.shiptocode"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OBOD',
            Size: 50
        },

        // B2AG_BOD1
        {
            Name: 'B2AG_LineNumOrder',
            Description: t["db.udf.linenum-order"],
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: '@B2AG_BOD1'
        },
        {
            // ItemCode
            Name: "B2AG_ItemCode",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.ItemCode"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_BOD1",
            FieldID: 3,
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: "ulItems",
            ValidValuesMD: []
        },
        {
            Name: 'B2AG_BagQuantity',
            Description: t["db.udf.bag-quantity"],
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: "@B2AG_BOD1"
        },
        {
            Name: 'B2AG_Batch',
            Description: t["db.udf.batch"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: "@B2AG_BOD1",
            Size: 36,
        },
        {
            Name: 'B2AG_BagWeight',
            Description: t["db.udf.bag-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: "@B2AG_BOD1",
            Size: null
        },
        // User
        {
            Name: 'B2AG_Permissions',
            Description: t["db.udf.Permissions"],
            Type: 'db_Memo',
            SubType: 'st_None',
            TableName: 'OUSR',
        },
        //Production Analisys - Agri
        {
            //Data
            Name: 'B2AG_Date',
            Description: t["db.udf.Date"],
            Type: 'db_Date',
            SubType: 'st_None',
            TableName: '@B2AG_OPAN',
            Size: null
        },
        {
            // UnProdCode
            Name: "B2AG_ProductionUnitCode",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.ProductionUnitCode"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPAN",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Talhao
            Name: "B2AG_Field",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.field"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPAN",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            Name: 'B2AG_Crop',
            Description: t["db.udf.Crop"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OPAN',
            Size: 50,
        },
        {
            Name: 'B2AG_CultivationCode',
            Description: t["db.udf.cultivation-code"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OPAN',
            Size: 25,
        },
        {
            Name: 'B2AG_StageOfCulture',
            Description: t["db.udf.StageOfCulture"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OPAN',
            Size: 10,
        },
        {
            // Production Estimative
            Name: "B2AG_ProductionEstimate",
            Type: "db_Numeric",
            Description: t["db.udf.ProductionEstimate"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OPAN",
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        // Registro de Palntio
        {
            Name: "B2AG_ProductionUnitCode",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.ProductionUnitCode"],
            SubType: "st_None",
            TableName: "@B2AG_OPRC",
            EditSize: 20,
            Mandatory: "tNO",
        },
        {
            Name: 'B2AG_Crop',
            Description: t["db.udf.Crop"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OPRC',
            Size: 50,
        },
        {
            Name: 'B2AG_CultivationCode',
            Description: t["db.udf.cultivation-code"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: '@B2AG_OPRC',
            Size: 25,
        },
        {
            Name: "B2AG_PlantingDate",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.PlantingDate"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_PRC1",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            Name: "B2AG_Field",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.field"],
            SubType: "st_None",
            TableName: "@B2AG_PRC1",
            EditSize: 20,
        },
        {
            Name: 'B2AG_Variety',
            Description: t["db.udf.variety"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: "@B2AG_PRC1",
            Size: 50,
        },
        {
            Name: "B2AG_AreaHa",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.AreaHa"],
            SubType: "st_Measurement",
            TableName: "@B2AG_PRC1",
        },
        // B2AG_OGRN - Romaneio Originação
        {
            // Data
            Name: "B2AG_Date",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.Date"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGRN",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Time
            Name: "B2AG_Time",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.Time"],
            SubType: "st_Time",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGRN",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            //Contrato
            Name: "B2AG_Contract",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.Contract"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGRN",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            //B2ObjectType
            Name: "B2AG_B2ObjectType",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.B2ObjectType"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGRN",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Peso Tara
            Name: 'B2AG_TareWeight',
            Description: t["db.udf.tare-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OGRN',
            Size: null
        },
        {
            // Peso Bruto
            Name: 'B2AG_GrossWeight',
            Description: t["db.udf.gross-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OGRN',
            Size: null
        },
        {
            // Peso Neto
            Name: 'B2AG_NetWeight',
            Description: t["db.udf.net-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OGRN',
            Size: null
        },
        {
            // Peso Liquido
            Name: 'B2AG_LiquidWeight',
            Description: t["db.udf.liquid-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OGRN',
            Size: null
        },
        {
            // Peso Embalagem
            Name: 'B2AG_PackingWeight',
            Description: t["db.udf.packing-weight"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OGRN',
            Size: null
        },
        {
            // Desconto Kg
            Name: 'B2AG_DiscountKg',
            Description: t["db.udf.discount-kg"],
            Type: 'db_Float',
            SubType: 'st_Measurement',
            TableName: '@B2AG_OGRN',
            Size: null
        },
        {
            // Motorista
            Name: "B2AG_Driver",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.driver"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGRN",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // CPF Motorista
            Name: "B2AG_DriverDocument",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.driver-document"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGRN",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Placa
            Name: "B2AG_LicensePlate",
            Type: "db_Alpha",
            Size: 8,
            Description: t["db.udf.LicensePlate"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGRN",
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // UFPlaca
            Name: "B2AG_PlateFederalUnit",
            Type: "db_Alpha",
            Size: 10,
            Description: t["db.udf.PlateFederalUnit"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGRN",
            EditSize: 10,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Transportadora
            Name: "B2AG_ShippingCompany",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.ShippingCompany"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGRN",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Observações
            Name: "B2AG_Comments",
            Type: "db_Alpha",
            Size: 254,
            Description: t["db.udf.Comments"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGRN",
            EditSize: 254,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // ItemCode
            Name: "B2AG_Cultivation",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.Cultivation"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGRN",
            FieldID: 3,
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Lote
            Name: "B2AG_Batch",
            Type: "db_Alpha",
            Size: 30,
            Description: t["db.udf.batch"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGRN",
            EditSize: 30,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // CCG
            Name: "B2AG_CCG",
            Type: "db_Alpha",
            Size: 30,
            Description: t["db.udf.ccg"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGRN",
            EditSize: 30,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Numero do Ticket
            Name: 'B2AG_TicketNumber',
            Description: t["db.udf.ticket-number"],
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: '@B2AG_OGRN'
        },
        {
            // Safra
            Name: "B2AG_Crop",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.Crop"],
            SubType: "st_None",
            TableName: "@B2AG_OGRN",
        },
        {
            // Filial
            Name: "B2AG_BPLId",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.BPLId"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGRN",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Deposito Destino
            Name: "B2AG_DestinationWhs",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.B2AG_DestinationWhs"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGRN",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Local de Entrega
            Name: "B2AG_DeliveryPlace",
            Type: "db_Alpha",
            Size: 50,
            Description: t["db.udf.B2AG_DeliveryPlace"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OGRN",
            EditSize: 50,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },


        // B2AG_GRN1
        {
            // Variedade
            Name: "B2AG_Variety",
            Type: "db_Alpha",
            Size: 100,
            Description: t["db.udf.variety"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_GRN1",
            EditSize: 100,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Talhao
            Name: "B2AG_Field",
            Type: "db_Alpha",
            Size: 20,
            Description: t["db.udf.field"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_GRN1",
            EditSize: 20,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Quantidade
            Name: "B2AG_Quantity",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.Quantity"],
            SubType: "st_Quantity",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_GRN1",
            FieldID: 1,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        // B2AG_GRN2
        {
            // Codigo
            Name: "B2AG_Code",
            Type: "db_Alpha",
            Size: 100,
            Description: t["db.udf.Code"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_GRN2",
            EditSize: 100,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Descrição
            Name: "B2AG_Description",
            Type: "db_Alpha",
            Size: 100,
            Description: t["db.udf.Description"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_GRN2",
            EditSize: 100,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Valor
            Name: "B2AG_Value",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.Value"],
            SubType: "st_Percentage",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_GRN2",
            FieldID: 2,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Quantidade
            Name: "B2AG_Quantity",
            Type: "db_Float",
            Size: 16,
            Description: t["db.udf.Quantity"],
            SubType: "st_Quantity",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_GRN2",
            FieldID: 1,
            EditSize: 16,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },

        //B2AG_OTSR" -TestSiteRecording
        {
            Name: "B2AG_PlantingDate",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.PlantingDate"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OTSR",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            Name: 'B2AG_Variety',
            Description: t["db.udf.variety"],
            Type: 'db_Alpha',
            SubType: 'st_None',
            TableName: "@B2AG_OTSR",
            Size: 50,
        },
        {
            Name: 'B2AG_Attachment',
            Description: t["db.udf.attachment"],
            Type: 'db_Memo',
            SubType: 'st_Link',
            TableName: "@B2AG_OTSR",
        },
        {
            // Data
            Name: "B2AG_Date",
            Type: "db_Date",
            Size: 8,
            Description: t["db.udf.Date"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OTSR",
            FieldID: 0,
            EditSize: 8,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Lote
            Name: "B2AG_Batch",
            Type: "db_Alpha",
            Size: 30,
            Description: t["db.udf.batch"],
            SubType: "st_None",
            LinkedTable: null,
            DefaultValue: null,
            TableName: "@B2AG_OTSR",
            EditSize: 30,
            Mandatory: "tNO",
            LinkedUDO: null,
            LinkedSystemObject: null,
            ValidValuesMD: []
        },
        {
            // Numero do Ticket
            Name: 'B2AG_Emerged',
            Description: 'Emergidas',
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: '@B2AG_TSR1'
        },
        {
            // Numero do Ticket
            Name: 'B2AG_Grade',
            Description: 'Nota',
            Type: 'db_Numeric',
            SubType: 'st_None',
            TableName: '@B2AG_TSR1'
        },
    ]
}