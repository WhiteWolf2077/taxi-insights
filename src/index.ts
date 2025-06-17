import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

app.use(express.json());

// Placeholder function for sending messages to Claude
const sendToClaude = async (message: any) => {
  console.log('Preparing message for Claude:', message);

  // Basic prompt structure for Claude
  const messages = [
    {
      role: 'system',
      content: 'You are Oi.ai, an AI assistant for licensed London cab drivers. Your purpose is to provide real-time intelligence and tools to help them maximize their earnings and navigate the city. You can use external tools to get up-to-date information.',
    },
    {
      role: 'user',
      content: message.text.body, // Assuming the message is text for now
    },
  ];

  // TODO: Implement actual logic to send messages to Claude API
  // TODO: Add tool definitions here for Claude to use
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
            sendToClaude(message);
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