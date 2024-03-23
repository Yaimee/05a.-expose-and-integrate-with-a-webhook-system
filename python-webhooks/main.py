from fastapi import FastAPI, Request, Response
import requests

app = FastAPI()

# URL of the exposee's webhook registration endpoint
registration_url_global = 'http://exposee.serveo.net/register-webhook'
registration_url_local = 'http://localhost:8080/register-webhook'

# Your webhook endpoint where you'll receive events
my_webhook_url_global = 'http://integrator.serveo.net/webhook-response'
my_webhook_url_local = 'http://localhost:8000/webhook-response'

response = requests.post(registration_url_local, json={'url': my_webhook_url_local})

if response.status_code == 200:
    print('Webhook registered successfully.')
else:
    print('Failed to register webhook.')

@app.post('/webhook-response')
async def webhook_response(request: Request):
    data = await request.json()
    print(data)
    return Response(status_code=200)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)