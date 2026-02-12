export function createWeatherNoteModel(data) {

    const lines = data.B2AG_WSN1Collection.map(item => {
        return {
            U_B2AG_Element: item.U_B2AG_Element,
            U_B2AG_Value: item.U_B2AG_Value
        }
    })

    return {
        U_B2AG_RegisterDate: data.U_B2AG_RegisterDate,
        U_B2AG_PostId: data.U_B2AG_PostId,
        B2AG_WSN1Collection:lines,              
        U_B2AG_Comments: data.U_B2AG_Comments
    }
}