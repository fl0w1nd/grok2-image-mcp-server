import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "Grok2 Image MCP Server",
    version: "0.1.1",
  });

  server.tool(
    "generate_image",
    "Generate an image based on a text prompt using the Grok-2 image model, and return the image URL to the user with markdown image format.",
    {
      prompt: z.string().describe("描述要生成的图像内容"),
    },
    async ({ prompt }) => {
      if (!prompt) {
        throw new Error("图像描述提示词不能为空");
      }

      // 从环境变量获取 API KEY
      const apiKey = process.env.XAIAPI_KEY;
      if (!apiKey) {
        throw new Error("缺少 API 密钥，请设置 XAIAPI_KEY 环境变量");
      }

      // 从环境变量获取基础 URL，如果未设置则使用默认值
      const baseURL = process.env.XAIAPI_BASE_URL || "https://api.x.ai/v1";
      const endpoint = `${baseURL}/images/generations`;

      try {
        // 创建一个可控制超时的 fetch 请求
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时
        
        // 使用 fetch API 替代 axios 发送请求
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "grok-2-image",
            prompt: prompt,
          }),
          signal: controller.signal, // 添加信号控制器
        });
        
        // 清除超时计时器
        clearTimeout(timeoutId);

        // 解析 JSON 响应
        const data = await response.json();

        // 检查是否请求成功
        if (!response.ok) {
          console.error("API请求失败详情:", data);
          
          // 直接返回完整的错误JSON
          return {
            content: [
              {
                type: "text",
                text: `图像生成失败: ${JSON.stringify(data, null, 2)}`
              }
            ],
          };
        }

        // 检查响应并提取图像 URL
        if (data && data.data && data.data.length > 0 && data.data[0].url) {
          const imageUrl = data.data[0].url;
          
          return {
            content: [
              {
                type: "text",
                text: `图像已成功生成！图像URL: ${imageUrl}`
              }
            ],
          };
        } else {
          return {
            content: [
              {
                type: "text",
                text: `图像生成失败: 服务器返回了无效的数据结构`
              }
            ],
          };
        }
      } catch (error: unknown) {
        console.error("图像生成过程中发生错误:", error);
        
        // 检查是否为超时错误
        const errorMessage = error instanceof Error 
          ? (error.name === 'AbortError' ? '请求超时(30秒)，图像生成未完成' : error.message) 
          : '未知错误';
        
        // 返回详细的错误信息
        return {
          content: [
            {
              type: "text",
              text: `图像生成失败: ${errorMessage}`
            }
          ],
        };
      }
    },
  );

  return server;
}
