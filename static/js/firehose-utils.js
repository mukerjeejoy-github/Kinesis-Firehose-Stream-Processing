// Configure AWS SDK
AWS.config.update({
    region: window.AWS_REGION,
    accessKeyId: window.AWS_ACCESS_KEY_ID,
    secretAccessKey: window.AWS_SECRET_ACCESS_KEY
});

const firehose = new AWS.Firehose();
const firehoseStreamName = window.FIREHOSE_STREAM_NAME;

async function sendEventToFirehose(eventType, details) {
    const record = {
        DeliveryStreamName: firehoseStreamName,
        Record: {
            Data: JSON.stringify({
                eventType,
                details,
                timestamp: new Date().toISOString()
            }) + '\n'
        }
    };

    try {
        await firehose.putRecord(record).promise();
        console.log('Event sent to Firehose:', record);
    } catch (error) {
        console.error('Error sending event to Firehose:', error);
        throw error;
    }
}

async function sendEventWithRetry(eventType, details, retries = 3) {
    const baseDelay = 1000;

    while (retries > 0) {
        try {
            await sendEventToFirehose(eventType, details);
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
