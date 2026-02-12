import axios from 'axios'
import Api from '../../../../lib/api'

export async function getEmployeesListByDescription(description) {

    const uppercaseDescription = description.toUpperCase()

    const query = new Api()
        .setMethod('GET')
        .setUrl('/EmployeesInfo')
        .setParams({
            $select: 'EmployeeID,FirstName,LastName',
            $filter: `contains(EmployeeID, '${uppercaseDescription}') or contains(FirstName, '${uppercaseDescription}') or contains(LastName, '${uppercaseDescription}')`
        })
        .get()

        return axios.request(query)
        .then((response) => {
            return mapEmployeesListToAutocompleteOptions(response.data.value)
        }).catch((error) => {
            throw new Error(error)
        })
}

function mapEmployeesListToAutocompleteOptions(employeesList) {

    return employeesList.map(employee => {
        return {
            id: employee.EmployeeID,
            label: ( employee.FirstName + ' ' + employee.LastName )
        }
    })   

}