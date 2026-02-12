import axios from "axios"
import Api from "../../lib/api"
import { getYearMonthDateFormat } from "../../utils/formatDate"

async function doApiCall(query) {

    return axios.request(query)
        .then((response) => {
            if (response.data) {
                return response.data
            } else {
                return {}
            }
        }).catch((error) => {
            return (error.response)
        })
}

export async function getApprovalRequests(filters, userId) {
    const statusFilter = filters.status === 'T' ? '' : `Status eq '${filters.status}' and `;

    const query = new Api()
        .setMethod('GET')
        .setUrl('/ApprovalRequests')
        .setParams({
            $filter: `${statusFilter}CreationDate ge '${filters.initalDate}' and CreationDate le '${filters.finalDate}'`,
            $orderby: 'CreationDate desc'
        })
        .get();

    const [approvalResult, users] = await Promise.all([
        doApiCall(query),
        getAllUsers()
    ]);

    // Filtra os approval requests para manter apenas os que possuem ApprovalRequestLines com UserID igual ao userId
    const filteredApprovals = (approvalResult.value || []).filter(item =>
        Array.isArray(item.ApprovalRequestLines) &&
        item.ApprovalRequestLines.some(line => line.UserID === userId)
    );

    // Cria um mapa de usuários por InternalKey usando apenas UserName
    const userMap = {};
    users.forEach(user => {
        userMap[user.InternalKey] = user.UserName;
    });

    // Adiciona OriginatorName em cada objeto
    const approvalsRequests = filteredApprovals.map(item => ({
        ...item,
        OriginatorName: userMap[item.OriginatorID] || null
    }));

    return approvalsRequests;
}

async function getAllUsers() {
    const query = new Api()
        .setMethod('GET')
        .setUrl('/Users')
        .setParams({
            $select: 'InternalKey,UserName'
        })
        .get()

    const result = await doApiCall(query)

    return result.value || []
}

export async function getDraftById(id) {
    const query = new Api()
        .setMethod('GET')
        .setUrl(`/Drafts(${id})`)
        .setParams({
            $select: 'DocDate,CardCode,CardName,Address,NumAtCard,DocTotal,DocCurrency,DocRate,JournalMemo,PaymentGroupCode,FederalTaxID,PaymentMethod,PayToCode,BPL_IDAssignedToInvoice,BPLName,VATRegNum,DocumentLines,TaxExtension,Comments,U_B2AG_Equipment',
        })
        .get()

    const result = await doApiCall(query)

    return result
}

export async function updateApprovalRequest(data, id) {
    const query = new Api()
        .setMethod('PATCH')
        .setUrl(`/ApprovalRequests(${id})`)
        .setData(data)
        .get()

    const result = await doApiCall(query)
    if (result.status === 400) {
        const errorMessage = result ? result.data.message.value : 'Unknown error'
        throw new Error(errorMessage)
    }
    return result
}