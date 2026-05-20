import axios from 'axios'

export const BuscaCEP = async (cep) => {
    const cleanCep = cep.replace(/\D/g, '')
    
    return axios.request(`https://viacep.com.br/ws/${cleanCep}/json`)
        .then((response) => {
            return response.data
        })
        .catch((erro) => {
            return { logradouro: '', erro: true }
        })
}

export const retira_acentos = (str) => {
    if (!str) return ''
    
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/gi, '')
}