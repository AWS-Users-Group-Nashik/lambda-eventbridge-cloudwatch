import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

const client = new EventBridgeClient();

export const hello = async (event) => {
  console.log("Incoming request:", JSON.stringify(event, null, 2));

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello World from AWS Lambda with CloudWatch!",
      timestamp: new Date().toISOString(),
    }),
  };

  console.log("Response:", response);
  return response;
};

export const register = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { name, email } = body;

    if (!name || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Name and email are required." }),
      };
    }

    // Publish event to EventBridge
    const params = {
      Entries: [
        {
          Source: "user.registration",
          DetailType: "UserRegistered",
          Detail: JSON.stringify({
            name,
            email,
            registeredAt: new Date().toISOString(),
          }),
          EventBusName: process.env.EVENT_BUS_NAME,
        },
      ],
    };

    await client.send(new PutEventsCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User registered successfully and event sent to EventBridge.",
        user: { name, email },
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

export const sendWelcomeEmail = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const { detail } = event;
  console.log(`📩 Sending welcome email to ${detail.email}`);

  // Simulate email sending
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Welcome email sent to ${detail.email}`,
    }),
  };
};
