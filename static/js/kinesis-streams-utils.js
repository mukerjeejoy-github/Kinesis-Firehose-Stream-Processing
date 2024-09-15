// Configure AWS SDK
AWS.config.update({
    region: window.AWS_REGION,
    accessKeyId: window.AWS_ACCESS_KEY_ID,
    secretAccessKey: window.AWS_SECRET_ACCESS_KEY
});

const kinesis = new AWS.Kinesis();
const kinesisStreamName = window.KINESIS_STREAM_NAME;

// Function to send data to Kinesis
async function sendEventToKinesis(eventType, details) {
    const partitionKey = `${eventType}-${Date.now()}`;
    const record = {
        Data: JSON.stringify({
            eventType,
            details,
            timestamp: new Date().toISOString()
        }),
        PartitionKey: partitionKey,
        StreamName: kinesisStreamName
    };

    try {
        await kinesis.putRecord(record).promise();
        console.log('Event sent to Kinesis:', record);
    } catch (error) {
        console.error('Error sending event to Kinesis:', error);
        throw error;
    }
}

async function sendEventWithRetry(eventType, details, retries = 3) {
    const baseDelay = 1000;

    while (retries > 0) {
        try {
            await sendEventToKinesis(eventType, details);
            return;
        } catch (error) {
            retries--;
            const delay = baseDelay * (4 - retries);
            console.error(`Retrying in ${delay}ms... Remaining attempts: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, delay));
            if (retries <= 0) {
                console.error('Failed to send event after multiple retries:', error);
            }
        }
    }
}

export { sendEventWithRetry };
