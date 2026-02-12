import axios from 'axios'
import Api from '../api'

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

export async function createAttachment(formData) {

    const url = process.env.NEXT_PUBLIC_ATTACHMENTS

    const options = {
        method: 'POST',
        url: url,
        headers: {'Content-Type':`multipart/form-data; boundary=${formData._boundary}`},
        data: formData
      }
      
      return axios.request(options).then(function (response) {
  
        return response.data
      }).catch(function (error) {
        
        return error      
      })
}

export async function findAttachments(attachmentEntry) {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/Attachments2(${attachmentEntry})`)
        .setHeaders({ 'Content-Type': 'application/json' })
        .get()

    const data = await doApiCall(query)
    return data
}

// export async function updateAttachment(formData, attachmentEntry) {

//     const query = new Api()
//         .setMethod('PATCH')
//         .setUrl(`/Attachments2(${attachmentEntry})`)
//         .setHeaders({ 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` })
//         .setData(formData)
//         .get()

//     const data = await doApiCall(query)
//     return data
// }

export async function updateAttachment(formData, docEntry) {

    const url = process.env.NEXT_PUBLIC_ATTACHMENTS

    const options = {
        method: 'POST',
        url: `${url}${docEntry}`,
        headers: {'Content-Type':`multipart/form-data; boundary=${formData._boundary}`},
        data: formData
      }
      
      return axios.request(options).then(function (response) {
  
        return response.data
      }).catch(function (error) {
        
        return error      
      })
}

export async function getAttachmentByFilename(attachmentEntry, filename) {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/Attachments2(${attachmentEntry})/$value?filename='${filename}`)
        .setHeaders({ 'Content-Type': 'application/json' })
        .setResponseType('arraybuffer')
        .get()

    const data = await doApiCall(query)
    return data

}