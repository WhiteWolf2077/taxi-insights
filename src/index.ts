import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

import Redis from 'ioredis';
dotenv.config();

import { callLLM } from './utils/llmClient';
const app = express();
const port = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

app.use(express.json());

// Placeholder tool execution functions
const executeTool = async (toolCall: any) => {
    console.log("Executing tool:", toolCall);
    // In a real implementation, you would route this to the correct tool function
    // and return its result.
    return `Tool ${toolCall.function.name} executed successfully with parameters ${JSON.stringify(toolCall.function.arguments)}. Placeholder result.`;
};

// Placeholder function for sending messages to Claude
const sendToClaude = async (message: any) => {
  console.log('Preparing message for Claude:', message);

  // **Add Redis-based memory injection**
  // Use a placeholder driver ID for now. In a real app, you'd get this from the message or session.
  const driverId = 'placeholder_driver_id';
  const lastLocation = await redisClient.get(`driver:${driverId}:location`) || 'unknown location';
  const fineHistory = await redisClient.get(`driver:${driverId}:fineHistory`) || 'no recorded fines';

  // Placeholder tool definitions (matching the architecture.md)
  const tools = [
      {
          type: "function",
          function: {
              name: "get_hotspots",
              description: "Get real-time information on busy areas for taxi drivers based on location.",
              parameters: {
                  type: "object",
                  properties: {
                      lat: { type: "number" },
                      lon: { type: "number" },
                  },
                  required: ["lat", "lon"],
              },
          },
      },
      // Add other tools as needed based on architecture.md
      // { type: "function", function: { name: "get_uber_surge_predictions", description: "..." } },
      // { type: "function", function: { name: "get_live_events", description: "..." } },
      // ...
  ];

  // Basic prompt structure for Claude
  const messages = [
    {
      role: 'system',
      content: `You are Oi.ai, an AI assistant for licensed London cab drivers. Your purpose is to provide real-time intelligence and tools to help them maximize their earnings and navigate the city. You have access to external tools to get up-to-date information and perform actions.

Driver Context:
Last Known Location: ${lastLocation}
Fine History: ${fineHistory}
Analyze the user's request and determine if any of the available tools are needed. If a tool is needed, respond with a tool_use block. If no tool is needed, or after using a tool, provide a helpful response to the driver. Be concise and directly address the driver's query.
`,
    },
    {
      content: message.text.body, // Assuming the message is text for now
    },
  ];

  try {
    console.log('Sending message to Claude with prompt:', messages);
    const responseContent = await callLLM(messages as any); // Use callLLM

    if (responseContent) {
        console.log('Claude provided a response:', responseContent);
        // Send Claude's response back to the user via WhatsApp
        await sendWhatsAppMessage(message.from, responseContent);
    } else {
        // Fallback if no tool calls and no content in the response
        // This could indicate Claude didn't understand or couldn't form a response
        console.warn('Claude did not provide a response or tool call, and finish_reason was not tool_use.');
        await sendWhatsAppMessage(message.from, "Sorry, I couldn't process that request.");
    }

  } catch (error) {
    console.error('Error sending message to Claude:', error);
    await sendWhatsAppMessage(message.from, "Sorry, there was an error processing your request with the AI.");
  }
};

// Placeholder function to send messages back to WhatsApp
const sendWhatsAppMessage = async (to: string, text: string) => {
    console.log(`Sending WhatsApp message to ${to}: ${text}`);
    // TODO: Implement actual WhatsApp Business API call here
    // Use WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID
};

app.get('/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

app.post('/webhook', (req: Request, res: Response) => {
  const body = req.body;

  console.log('Incoming webhook message:', JSON.stringify(body, null, 2));

  // Process the incoming message
  if (body.object === 'whatsapp_business_account') {
    body.entry.forEach((entry: any) => {
      entry.changes.forEach((change: any) => {
        if (change.field === 'messages') {
          change.value.messages.forEach((message: any) => {
            console.log('Received message:', message);
            // Relay the message to Claude (placeholder)
            if (message.type === 'text') { // Only process text messages for now
                sendToClaude(message);
            }
          });
        }
      });
    });
  }

  res.status(200).send('EVENT_RECEIVED');
});

app.get('/', (req: Request, res: Response) => {
  res.send('Oi.ai WhatsApp Bot is running!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});