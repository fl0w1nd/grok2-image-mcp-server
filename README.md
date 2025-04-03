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
        "amap-maps": {
            "command": "npx",
            "args": [
                "-y",
                "grok2-image-mcp-server"
            ],
            "env": {
                "XAIAPI_KEY": "xAI Key",
                "XAIAPI_BASE_URL": "可选,例如：https://api.proxy.com/xai/v1"
            }
        }
    }
}
```

## 许可证

MIT
