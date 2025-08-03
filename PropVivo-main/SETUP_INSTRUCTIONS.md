# PropVivo Call Center Setup

This guide helps you set up the call center app with Twilio voice integration and ElevenLabs text-to-speech.

## What You Need

- .NET 8.0 SDK
- Node.js 
- ngrok
- Twilio Account
- ElevenLabs Account

## Get Your API Keys

### Twilio Setup

1. Sign up at [twilio.com](https://www.twilio.com/)
2. Get your credentials from the console:
   - Account SID
   - Auth Token  
   - API Key SID
   - API Key Secret
3. Get a phone number from Twilio

### ElevenLabs Setup

1. Sign up at [elevenlabs.io](https://elevenlabs.io/)
2. Copy your API key from your profile

## Configure the App

Update `PropVivo.API/appsettings.Development.json` with your real API keys:

```json
{
  "Twilio": {
    "AccountSid": "YOUR_TWILIO_ACCOUNT_SID",
    "AuthToken": "YOUR_TWILIO_AUTH_TOKEN", 
    "ApiKey": "YOUR_TWILIO_API_KEY_SID",
    "ApiSecret": "YOUR_TWILIO_API_KEY_SECRET",
    "AppSid": "YOUR_TWIML_APP_SID"
  },
  "ElevenLabs": {
    "ApiKey": "YOUR_ELEVENLABS_API_KEY"
  }
}
```

## Expose Your Server

1. Download ngrok from [ngrok.com](https://ngrok.com/)
2. Run: `ngrok http https://localhost:7266`
3. Copy the public URL (changes each time you restart ngrok)

## Setup Twilio

### Create TwiML App

1. Go to Twilio Console → Voice → TwiML → TwiML Apps
2. Create new TwiML App
3. Set Voice Request URL to: `https://your-ngrok-url.ngrok.io/api/webhooks/incoming-call`
4. Save and copy the SID (starts with AP...)
5. Update `appsettings.Development.json` with this SID

### Configure Phone Number

1. Go to Phone Numbers → Manage → Active numbers
2. Click your Twilio number
3. Set Voice Configuration to TwiML App
4. Select the TwiML App you created
5. Save changes

## Run the App

### Start Backend

```bash
cd PropVivo.API
dotnet run
```

The API will run at `https://localhost:7266`

### Start Frontend

```bash
cd frontend
npm install
npm start
```

The app will run at `http://localhost:3000`

## Test the App

### Initialize Call System

1. Open `http://localhost:3000`
2. Allow microphone access
3. Click "Start Call System"
4. Wait for "Waiting for incoming calls..." message

### Test Voice Modulation

1. While on call screen, type a message
2. Click "Say" to hear it in American accent

### Test Incoming Calls

1. Call your Twilio number from another phone
2. The call should ring in your browser
3. Show customer info if number exists in database
4. Allow you to answer and speak

## Troubleshooting

### Common Issues

- **"Could not initialize"**: Check microphone permissions and Twilio credentials
- **"ElevenLabs API key not configured"**: Add your API key to appsettings
- **Calls not connecting**: Make sure ngrok is running and TwiML App URL is correct
- **"Customer not found"**: Expected for numbers not in database

### Debug Info

- Backend logs show webhook requests
- Frontend console shows Twilio connection status  
- Twilio Console shows call logs

## How It Works

### Backend
- WebhookController: Handles incoming calls
- VoiceController: Generates Twilio tokens
- ModulationController: Text-to-speech conversion
- SignalR: Real-time notifications

### Frontend  
- Twilio Voice SDK: Voice communication
- SignalR Client: Real-time updates
- Voice Modulation: Text-to-speech UI

### Data Flow
1. Phone call → Twilio → Webhook → SignalR → Frontend
2. Frontend → Twilio Voice SDK → Real-time audio
3. Text input → ElevenLabs API → Audio playback

## Production Notes

- Use environment variables for API keys
- Validate webhook signatures
- Add proper authentication
- Set up monitoring and logging 