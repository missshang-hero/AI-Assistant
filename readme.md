此模板搭建了一个 LangChain.js + Next.js 入门应用的脚手架。它展示了如何在多个用例中使用和组合 LangChain 模块。具体来说：

简单聊天
从 LLM 调用返回结构化输出
与代理一起回答复杂、多步骤的问题
具有链和向量存储的检索增强生成 (RAG)
带有代理和向量存储的检索增强生成 (RAG)
他们中的大多数使用 Vercel 的AI SDK将令牌流式传输到客户端并显示传入的消息。

代理使用LangGraph.js，这是 LangChain 用于构建代理工作流的框架。它们使用预配置的辅助函数来最大限度地减少样板代码，但您可以根据需要将其替换为自定义图表。

演示 GIF

它也是免费套餐！查看下面的捆绑包大小统计信息。

您可以在此处查看此 repo 的托管版本：https://langchain-nextjs-template.vercel.app/

🚀 入门
首先，克隆此 repo 并将其下载到本地。

接下来，你需要在你的 repo 文件中设置环境变量.env.local。将.env.example文件复制到.env.local。要开始使用基本示例，你只需添加你的 OpenAI API 密钥。

由于此应用程序是在无服务器 Edge 函数中运行的，因此如果您使用LangSmith 跟踪LANGCHAIN_CALLBACKS_BACKGROUND，请确保已将环境变量设置为确保跟踪完成。false

yarn接下来，使用您喜欢的包管理器（例如）安装所需的包。

现在您已准备好运行开发服务器：

yarn dev
使用浏览器打开http://localhost:3000查看结果！向机器人询问一些问题，你会看到流式响应：

用户与人工智能之间的流媒体对话

您可以通过修改 来开始编辑页面app/page.tsx。当您编辑文件时，页面会自动更新。

后端逻辑位于app/api/chat/route.ts。在这里，您可以更改提示和模型，或添加其他模块和逻辑。

🧱 结构化输出
第二个示例展示了如何使用 OpenAI Functions 让模型根据特定模式返回输出。点击Structured Output导航栏中的链接即可尝试：

![A streaming conversation between the user and the AI](/public/images/chat-conversation.png)

Backend logic lives in `app/api/chat/route.ts`. From here, you can change the prompt and model, or add other modules and logic.
## 🧱 Structured Output
![A streaming conversation between the user and an AI agent](/public/images/structured-output-conversation.png)
用户与 AI 代理之间的流式对话

本例中的链使用一个名为 Zod 的流行库来构建一个模式，然后按照 OpenAI 期望的方式对其进行格式化。之后，它将该模式作为函数传递给 OpenAI，并传递一个function_call参数以强制 OpenAI 以指定的格式返回参数。

有关更多详细信息，请查看此文档页面。

🦜 代理
要尝试代理示例，您需要通过填充 来授予代理访问互联网的权限SERPAPI_API_KEY。如果您还没有 API 密钥，.env.local请前往SERP API 网站并获取一个。

然后，您可以单击Agent示例并尝试询问更复杂的问题：

用户与 AI 代理之间的流式对话

此示例使用预先构建的 LangGraph 代理，但您也可以自定义自己的代理。

🐶 检索
检索示例均使用 Supabase 作为向量存储。但是，如果您愿意，可以 通过更改、和下的代码来切换到其他受支持的向量存储。app/api/retrieval/ingest/route.tsapp/api/chat/retrieval/route.tsapp/api/chat/retrieval_agents/route.ts

对于 Supabase，请按照这些说明设置您的数据库，然后获取您的数据库 URL 和私钥并将其粘贴到.env.local。

然后，您可以切换到Retrieval和Retrieval Agent示例。默认文档文本取自 LangChain.js 检索用例文档，但您可以将其更改为任何您想要的文本。

对于给定的文本，您只需按Upload一次。再次按此按钮将重新提取文档，从而导致重复。您可以通过导航到控制台并运行 来清除 Supabase 向量存储DELETE FROM documents;。

拆分、嵌入和上传一些文本后，您就可以提出问题了！

用户与 AI 检索链之间的流式对话

用户与 AI 检索代理之间的流式对话

有关检索链的更多信息，请参阅此页面。此处使用的对话检索链的具体变体是使用 LangChain 表达式语言编写的，您可以 在此处了解更多信息。除了流式响应之外，此链示例还将通过标头返回引用来源。

有关检索代理的更多信息，请参阅此页面。

📦 捆绑包大小
LangChain 本身的 bundle 大小非常小。经过压缩和块拆分后，对于 RAG 用例，LangChain 占用了 37.32 KB 的代码空间（截至@langchain/core 0.1.15 版本），不到 Vercel 免费层边缘函数总分配量 1 MB 的 4%：



此软件包默认设置了@next/bundle-analyzer - 您可以通过运行以下命令以交互方式探索软件包大小：

$ ANALYZE=true yarn build
📚 了解更多
app/api/chat/route.ts和文件中的示例链app/api/chat/retrieval/route.ts使用 LangChain 表达式语言将不同的 LangChain.js 模块组合在一起。您也可以集成其他检索器、代理、预配置链等，但请记住， HttpResponseOutputParser它只能直接用于模型输出。

要了解有关使用 LangChain.js 的更多信息，请查看此处的文档：

https://js.langchain.com/docs/
▲ 在 Vercel 上部署
准备就绪后，您可以在Vercel 平台上部署您的应用程序。

查看Next.js 部署文档以了解更多详细信息。

谢谢你！