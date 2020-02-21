import { createAppServer } from './server'
import { logger, loggerShutdown } from './logger'
import { Server, IncomingMessage, ServerResponse } from 'http'

let server: Server

function sendJson(jsonObject: object, res: ServerResponse): void {
    const buffer = Buffer.from(JSON.stringify(jsonObject))
    res.setHeader('Content-Length', buffer.length)
    res.setHeader('Content-Type', 'application/json')
    res.writeHead(200)
    res.end(buffer)
}

function handleRequest(req: IncomingMessage, res: ServerResponse): void {
    sendJson(
        {
            message: 'Hello World'
        },
        res
    )
}

export function start(): Server {
    server = createAppServer(handleRequest)
    server.listen(process.env.PORT)
    return server
}

export async function shutdown(): Promise<void> {
    logger.debug({ msg: 'closing server' })
    await new Promise(resolve => server.close(resolve))

    // Shutdown any other dependencies here
    // i.e. database connections, etc...

    loggerShutdown()
}
