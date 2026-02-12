export function createProductionAnalisysModel(data) {

    return {
        U_B2AG_Date: data.U_B2AG_Date,
        U_B2AG_Crop: data.U_B2AG_Crop,
        U_B2AG_CultivationCode: data.U_B2AG_CultivationCode,
        U_B2AG_ProductionUnitCode: data.U_B2AG_ProductionUnitCode,
        U_B2AG_Field: data.U_B2AG_Field,
        U_B2AG_StageOfCulture: data.U_B2AG_StageOfCulture,
        U_B2AG_ProductionEstimate: data.U_B2AG_ProductionEstimate,
        Remark: data.Remark
    }
}
