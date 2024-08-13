import { openaiModel } from '@/server/ai';
import { generateText } from 'ai';
import { z } from 'zod';
import { to } from '../../../.next/static/chunks/main-app';

export default async function Page() {
    const res = await generateText({
        model: openaiModel,
        prompt: "Hello, what day is it?",
        tools: {
            "get_day":{
                description: "Get the day of the week",
                parameters: z.object({}),
                execute: async () => {
                    const today = new Date();
                    const day = today.getDay().toLocaleString();
                    return day;
                }
            }
        }
    })

    console.log(res)

    return (
        <div>
            Hello AI SDK!
        </div>
    );
    
}