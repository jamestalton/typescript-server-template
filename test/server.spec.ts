import * as axios from 'axios'
import { AddressInfo } from 'net'
import * as nock from 'nock'
import { start, shutdown } from '../src/start'
import { STATUS_CODES, Server } from 'http'

let server: Server
let request: axios.AxiosInstance

beforeAll(function() {
    nock.disableNetConnect()
    nock.enableNetConnect('127.0.0.1')
    nock.enableNetConnect('localhost')

    server = start()

    const port = (server.address() as AddressInfo).port
    request = axios.default.create({
        baseURL: `http://localhost:${port}`,
        validateStatus: () => true
    })
})

afterAll(async function() {
    await shutdown()
    nock.enableNetConnect()
    nock.restore()
})

describe(`Server Route Tests`, function() {
    it(`GET / return status 200 "${STATUS_CODES[200]}"`, async function() {
        const response = await request.get(`/`)
        expect(response.status).toEqual(200)
        expect(response.headers['content-type']).toEqual('application/json')
        expect(response.headers['content-encoding']).toBeUndefined()
        expect(response.headers).toHaveProperty('content-length')
        expect(response.data).toHaveProperty('method')
        expect(response.data.method).toEqual('GET')
        expect(response.data).toHaveProperty('url')
        expect(response.data.url).toEqual('/')
    })
})
