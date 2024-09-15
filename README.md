# Kinesis and Firehose Stream Processing
## Objective
This application aims to explore the architecture and functionality of AWS Kinesis and Firehose and demonstrate their application in real-time data processing.

## Scope
- Understanding AWS Kinesis and Firehose's components and their interactions.
- Identifying relevant use cases suitable for AWS Kinesis and Firehose.
- Implementing and demonstrating a real-time data streaming and processing using AWS Kinesis and Firehose.

## Keywords
- AWS Kinesis
- AWS Firehose
- Stream processing
- Real-time analytics
- Data streaming
- Architecture

## Description
AWS Kinesis and Firehose offers robust solutions for real-time data streaming and processing, making them suitable for dynamic and data-intensive domains. This project will delve into its architecture, relevant use cases, and practical implementation to provide insights into its capabilities and advantages.

## Architecture Details

<table>
<tr>
<td><img src="https://github.com/user-attachments/assets/c3569816-6e8e-4f9c-b33d-321df0478484" alt="Image 1" style="height: 500px; width: 875px;"/></td>
<td><img src="https://github.com/user-attachments/assets/69f75824-2383-4c74-a264-9b35f0ea15e3" alt="Image 2" style="height: 500px; width: 325px;"//></td>
</tr>
</table>

## Use Cases

### Real-time Analytics:
1. E-commerce platforms use AWS Kinesis to capture and process user clickstream data in real-time. This allows businesses to analyze customer behavior, recommend products, and optimize the user experience instantly.
2. Financial institutions and payment processors utilize Kinesis to analyze transaction data streams for suspicious patterns. By processing this data in real-time, they can detect and prevent fraudulent activities immediately.

### Log and Event Data Collection:
1. Organizations use Kinesis to collect and analyze logs and events from their infrastructure in real-time. This is critical for monitoring, detecting anomalies, and responding to incidents as they happen.

### IoT Data Processing:
1. Companies in the industrial sector use AWS Kinesis to process data from IoT sensors in real-time. This data is analyzed to monitor equipment health, optimize operations, and predict maintenance needs. This enhances operational efficiency, reduces maintenance costs, and minimizes downtime.

### ETL and Data Migration:
1. Businesses use Kinesis to perform real-time ETL on streaming data before loading it into data lakes or warehouses. This is essential for maintaining up-to-date data for analytics and reporting.

## Managing Dashboard Members With Event Logging

In our one-page web application, CRUD operations (Create, Read, Update, Delete) on member data are managed using JavaScript. When these operations are performed, the application logs the events to either AWS Kinesis or AWS Firehose based on the ‘is_firehose’ flag:

### Create Operation:
When a new member is added, the application triggers a logging event. If `is_firehose` is enabled, the event is sent to AWS Firehose, which handles streaming data to destinations like Amazon S3 or Redshift. If `is_firehose` is disabled, the event is sent to AWS Kinesis, which can be used for real-time analytics and processing.

### Update Operation:
Similar to the create operation, updates to member information generate a logging event. This event is routed to either Firehose or Kinesis based on the `is_firehose` flag, ensuring that the updates are captured and processed accordingly.

### Delete Operation:
When a member is deleted, the application logs this deletion event. The event is directed to Firehose if `is_firehose` is enabled; otherwise, it goes to Kinesis. This allows for tracking deletions and maintaining an audit trail.

AWS Kinesis is used for real-time data streaming and analytics, suitable for applications requiring immediate processing and insights. AWS Firehose, on the other hand, is designed for easier and more scalable data delivery to data lakes and warehouses.

This setup provides flexibility in choosing the appropriate service based on the application's requirements for real-time analytics versus batch data processing, while ensuring all modifications to member records are logged effectively.

## Application Screenshots

### Creating an IAM User
![image](https://github.com/user-attachments/assets/f60bf469-5242-4952-8687-de44efa2783f)

### Creating a Kinesis Stream
![image](https://github.com/user-attachments/assets/7299ea45-bc8b-4bfd-a5b8-396fdf2272e5)

### Attaching Kinesis Policy to the IAM User
![image](https://github.com/user-attachments/assets/6709cbe8-7109-4162-adf4-4a253b473461)

### Inserting Data in Kinesis Stream
![image](https://github.com/user-attachments/assets/e572958c-2930-4fa1-ab5a-889038b23adc)

### Data Inserted in Kinesis Stream
![image](https://github.com/user-attachments/assets/e63f9432-8f3d-43c0-bab5-20387b9063ae)

![image](https://github.com/user-attachments/assets/43699067-4700-4c8d-9fc9-fefa5c698dbd)

### Creating a Firehose Stream
![image](https://github.com/user-attachments/assets/974305c6-50a6-46a3-baaf-19515f368b29)

### Attaching Firehose Policy to the IAM User
![image](https://github.com/user-attachments/assets/6b4f75b3-04cc-4adf-9cb8-ae48d89597a2)

### Inserting Data in the Firehose Stream
![image](https://github.com/user-attachments/assets/a7afa782-9dcc-4183-b1c6-3ccf45efd2fa)

### Data Inserted in the Firehose Stream
![image](https://github.com/user-attachments/assets/78f2b603-239a-4016-a5a6-6487fc53c286)

![image](https://github.com/user-attachments/assets/133f5560-b84e-42d6-a26d-70eb97b6f9c9)

### Data Inserted in the S3 Bucket
![image](https://github.com/user-attachments/assets/0f1a6c2e-5f42-49d9-a1bc-9970b8729d87)
![image](https://github.com/user-attachments/assets/02a6044b-6662-444a-9054-b1193536b81b)

## Scripts and Commands Used
### Environment Setup
- Environment Configuration File:<br/>
  ![Screenshot 2024-09-15 193947](https://github.com/user-attachments/assets/99e8495d-07d3-4b44-9f88-0c79c89ffd1b)
- Environment Variables:<br/>
  ![Screenshot 2024-09-15 194118](https://github.com/user-attachments/assets/b6707040-876f-475d-a516-6e7d8ac6dc5b)
- Environment Load:<br/>
  ![Screenshot 2024-09-15 194045](https://github.com/user-attachments/assets/1b7e3310-2eb8-4d90-ac02-e580e9fea902)

### Client Setup
![Screenshot 2024-09-15 194429](https://github.com/user-attachments/assets/761230dd-4282-4681-afd4-84534cdd5c48)

### AWS SDK Reference on the Web Page
![Screenshot 2024-09-15 194536](https://github.com/user-attachments/assets/146eb875-57d5-4783-9f1f-01414e351381)

### DOM Content toggle between Firehose and Kinesis
![Screenshot 2024-09-15 194618](https://github.com/user-attachments/assets/c6cc8c11-856d-44fc-bef5-544774785da1)

### Kinesis Stream
- Initializing Kinesis Client<br/>
![Screenshot 2024-09-15 194801](https://github.com/user-attachments/assets/0da700a5-35f9-49bf-9fea-27ad7e01a064)

- Retry Mechanism
Attempts to send an event to Kinesis with retries in case of failure<br/>
![Screenshot 2024-09-15 194922](https://github.com/user-attachments/assets/3b329e95-c42e-4d7d-9a7e-d682f8e9c95c)

- Send Event
Sends a record to Kinesis stream, creating a unique partition key using event type and current timestamp. Defines data structure to be sent and uses Put record method to send the data.<br/>
![Screenshot 2024-09-15 195107](https://github.com/user-attachments/assets/b872b0f3-80db-458e-9737-6f1afb958f77)

### Firehose Stream
- Initializing Firehose Client<br/>
![Screenshot 2024-09-15 195212](https://github.com/user-attachments/assets/833d5473-9ce3-4c93-a8e2-6c4be831b6db)

- Retry Mechanism
Attempts to send an event to Firehose with retries in case of failure<br/>
![Screenshot 2024-09-15 195317](https://github.com/user-attachments/assets/c2aa7d8e-fdc4-47e7-8c31-5fd80854bbe6)

- Send Event
Sends a record to Firehose stream. Defines data structure to be sent including event type details and timestamp and uses Put record method to send the data.<br/>
![Screenshot 2024-09-15 195424](https://github.com/user-attachments/assets/d205afaf-c267-48e5-a5c5-90b00b409d29)

## Running the Driver File
```bash
# Creating virtual environment
python -m venv venv

# Activating the virtual environment
.\venv\Scripts\activate

# Installing all the necessary libraries (fastapi, pydantic, boto3, uvicorn, python-dotenv)
pip install -r requirements.txt

# Running the FastAPI application
uvicorn main:app --reload

```

## Conclusions and Inferences
### Conclusions:

- Event Logging Flexibility:
The system is designed to handle logging of CRUD operations in a flexible manner, with events being routed to either AWS Kinesis or AWS Firehose based on configuration. This allows for adaptability depending on the requirements for real-time data processing or batch data delivery.

- Real-Time vs. Batch Processing:
  - **AWS Kinesis** is used for real-time event streaming and analytics. This suggests that there may be a need for immediate data processing, such as real-time monitoring or alerting.
  - **AWS Firehose** is used for scalable and managed data delivery to destinations like S3 or Redshift. This indicates that there may be a need for efficient batch processing and long-term storage or data warehousing.

- Customizable Logging Strategy:
The `is_firehose` flag provides a mechanism to toggle between using Firehose and Kinesis, allowing the application to meet different operational needs or preferences without requiring major changes to the logging implementation.

### Inferences:

- Operational Requirements:
The use of **Kinesis** implies that the application may require real-time data processing capabilities, such as live data analytics or instant feedback mechanisms. The use of **Firehose** suggests a need for efficient handling of large volumes of data with automated delivery to storage or analytical services, supporting use cases such as historical data analysis or reporting.

- Scalability and Performance:
By leveraging **Firehose**, the application can handle large-scale data ingestion and delivery efficiently, which is beneficial for applications that generate high volumes of logs or data. **Kinesis** provides real-time processing capabilities, which is useful for scenarios where timely insights and actions are critical.

- Data Management Strategy:
The approach indicates a well-thought-out data management strategy, where the choice of logging service can be adapted based on the specific needs for processing, storage, and analysis. This flexibility helps optimize resource utilization and operational efficiency.

<hr><br/>
Overall, use of both Kinesis and Firehose highlights a balanced approach to managing different data processing needs, ensuring that the application can effectively handle both real-time and batch data requirements.
