import axios from 'axios'
import multiparty from 'multiparty'
import FormData from 'form-data'
import fs from 'fs'
import { parseCookies } from 'nookies'
import { decodeSessionData } from '../../lib/serviceLayerProxy'
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
const URL = process.env.B1_SERVICE_LAYER_URL

export default async function handler(req, res) {

    const cookies = parseCookies({ req })
    const decoded = decodeSessionData(cookies.session)
    const token = decoded.cookieToken

    const form = new multiparty.Form();
    const formData = new FormData();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.status(500).json({ error: 'Error parsing form data.' });
            return;
        }

        let data = []

        Object.keys(files).forEach((key) => {
            data = files[key]
        });

        for (const key in data) {
            const file = data[key]
            const fileStream = fs.createReadStream(file.path)
            fileStream.name = 'teste23232.pdf'//`${Math.random().toString(36).substring(3)}_${file.name}`
            formData.append(`file_${key}`, fileStream)
        }
    })

    const options = {
        method: 'POST',
        url: `${URL}/Attachments2`,
        headers: {
            'Cookie': token,
            'Content-Type': 'multipart/form-data'
        },
        data: formData
    };

    try {
        let response = await axios(options)
        res.send(response.data)
    } catch (error) {
        res.send(error)
    }

}

export const config = {
    api: {
        bodyParser: false,
    }
}