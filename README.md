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



## 许可证

MIT
