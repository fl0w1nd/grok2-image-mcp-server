# Grok2 Image MCP Server

一个基于 Model Context Protocol (MCP) 的 Grok-2 图像生成服务。此服务允许聊天助手通过 MCP 协议使用 Grok-2 模型生成图像。

## 安装


### 使用 npx（推荐）

```bash
npx -y grok2-image-mcp-server
```

```json
{
    "mcpServers": {
        "grok2_image": {
            "command": "npx",
            "args": [
                "grok2-image-mcp-server"
            ],
            "env": {
                "XAIAPI_KEY": "xAI Key"
            }
        }
    }
}
```
#### 环境变量

`XAIAPI_KEY` -> xAI Key

`XAIAPI_BASE_URL`（可选） -> 请求接口代理，若不填则默认使用 `https://api.x.ai/v1`，遇到无法访问的情况可使用第三方代理,末尾以`v1`结束

示例：

```bash
XAIAPI_BASE_URL=https://api-proxy.me/xai/v1  //某个公开代理，不保证可用性
```

`IMAGE_PROXY_DOMAIN`（可选） -> 图片代理域名，若不填则返回默认的图片接口域名 `imgen.x.ai`，遇到无法访问的情况可使用第三方代理

示例：

```bash
IMAGE_PROXY_DOMAIN=https://image.proxy.workers.dev
```

### 使用 cloudflare workers 代理图片 URL

遇到图片无法访问的情况，可以考虑使用 cloudflare workers 代理图片 URL，复制以下代码到 cloudflare workers 中，并部署，随后绑定自定义域名，并在环境变量中配置 `IMAGE_PROXY_DOMAIN` 为自定义域名，例如 `https://image.proxy.workers.dev`

```js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const TARGET_DOMAIN = 'imgen.x.ai'

async function handleRequest(request) {

  const url = new URL(request.url)
  const targetUrl = `https://${TARGET_DOMAIN}${url.pathname}${url.search}`


  const init = {
    method: request.method,
    headers: request.headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
    redirect: 'follow'
  }


  const response = await fetch(targetUrl, init)


  const newHeaders = new Headers(response.headers)
  newHeaders.set('Access-Control-Allow-Origin', '*')

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  })
}
```

## 许可证

MIT
