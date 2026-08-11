import { Provide, Config, Inject } from "@midwayjs/core";
import { createDeepAgent, FilesystemBackend } from "deepagents";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage, AIMessageChunk, ToolMessage } from "@langchain/core/messages";
import path from "path";
import { User as UserService} from "@/app/api/service/User"

//pnpm add -w deepagents langchain @langchain/core @langchain/tavily @langchain/langgraph @langchain/openai

@Provide()
export class Chat {

    @Config('bailian')
    config;

    @Inject()
    userService: UserService;

    async index(socket: any, body: any) {
        const user = await this.userService.getUserInfo();
        const config = {
            configurable: {
                thread_id: user.id,
            }
        };
        const agent = await this.getAgent();
        const text = String(body.content);
        const stream = await agent.stream(
            { messages: [new HumanMessage(text)] } as any,
            { ...config, streamMode: "messages", subgraphs: true }
        );

        try {
            for await (const [namespace, chunk] of stream) {
                const messages = chunk[0];
                // @ts-ignore
                const isSubagent = namespace.some( s => s.startsWith("tools:"));
                if(isSubagent){
                }else{
                   const data = {type:'text',content:messages.content}
                   socket.send(JSON.stringify(data));
                }
            }
            socket.end();
        } catch (e) {
            socket.end();
        }
    }

    async getAgent() {
        const model = new ChatOpenAI({
            model: "qwen3-max",
            configuration: {
                baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
                apiKey: this.config.apiKey,
            },
        });
        const checkpointer = new MemorySaver();
        const rootDir = path.join(process.cwd(), 'public');
        console.log('rootDir', rootDir);
        return createDeepAgent({
            systemPrompt:"回答用户信息都使用中文",
            model,
            checkpointer,
            skills: [rootDir + "/skills/"],
            backend: new FilesystemBackend({
                rootDir,
                virtualMode: true,
            }),
            interruptOn: {
                read_file: false,
                write_file: true,
                delete_file: true,
            },
        });
    }
}