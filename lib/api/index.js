export default class Api {

    constructor() {
        this.options = {
            method: 'POST',
            url: '/api',
            params: null,
            responseType: null,
            headers: {
                'content-type': 'application/json',
                'Prefer': 'odata.maxpagesize=0',
                'B1S-CaseInsensitive': true,
                'B1S-ReplaceCollectionsOnPatch': true,
            },
            data: {
                method: null,
                url: null
            }
        }
    }

    setMethod(method) {

        let tempOptions = this.options
        tempOptions.data.method = method
        this.options = tempOptions
        return this
    }

    setUrl(url) {

        let tempOptions = this.options
        tempOptions.data.url = url
        this.options = tempOptions
        return this
    }

    setParams(params) {

        let tempOptions = this.options
        tempOptions.data.params = params
        this.options = tempOptions
        return this
    }

    setHeaders(headers) {

        let tempOptions = this.options
        tempOptions.data.headers = headers
        this.options = tempOptions
        return this
    }

    setResponseType(responseType) {

        let tempOptions = this.options
        tempOptions.data.responseType = responseType
        this.options = tempOptions
        return this
    }

    setData(data) {

        let tempOptions = this.options
        const userData = data
        tempOptions.data = { ...tempOptions.data, userData }
        this.options = tempOptions
        return this
    }

    get() {
        return this.options
    }
}