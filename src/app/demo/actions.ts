'use server';

import { createAI, getMutableAIState, streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { ReactNode } from 'react';
import { z } from 'zod';
import { generateId } from 'ai';
import { openaiModel } from '@/server/ai';
import { SystemMessage } from '../../components/chat/SystemMessage';


export interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
}

export async function continueConversation(
  input: string,
): Promise<ClientMessage> {
  'use server';

  const history = getMutableAIState();

  const result = await streamUI({
    model: openaiModel,
    messages: [...history.get(), { role: 'user', content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: 'assistant', content },
        ]);
      }

      return <SystemMessage message={content} />;
    },
    tools: {
      
    },
  });

  return {
    id: generateId(),
    role: 'assistant',
    display: result.value,
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[],
    continueConversation: typeof continueConversation; 
    
}>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});