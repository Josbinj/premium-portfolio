package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"portfolio-api/internal/db"
	"portfolio-api/internal/models"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

func init() {
	if err := db.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
}

func handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	headers := map[string]string{
		"Access-Control-Allow-Origin":  "*",
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
	}

	switch req.HTTPMethod {
	case "OPTIONS":
		return events.APIGatewayProxyResponse{StatusCode: 200, Headers: headers}, nil

	case "POST":
		return saveContactMessage(ctx, req.Body, headers)

	case "GET":
		return getContactMessages(ctx, headers)

	default:
		return events.APIGatewayProxyResponse{StatusCode: 405, Body: "Method Not Allowed", Headers: headers}, nil
	}
}

func saveContactMessage(ctx context.Context, body string, headers map[string]string) (events.APIGatewayProxyResponse, error) {
	var payload struct {
		Name    string `json:"name"`
		Email   string `json:"email"`
		Subject string `json:"subject"`
		Message string `json:"message"`
	}

	if err := json.Unmarshal([]byte(body), &payload); err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Invalid JSON payload", Headers: headers}, nil
	}

	if payload.Name == "" || payload.Email == "" || payload.Message == "" {
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Missing required fields", Headers: headers}, nil
	}

	messageID := fmt.Sprintf("%d", time.Now().UnixNano())
	createdAt := time.Now().Format(time.RFC3339)

	msg := models.ContactMessage{
		MessageID: messageID,
		Name:      payload.Name,
		Email:     payload.Email,
		Subject:   payload.Subject,
		Message:   payload.Message,
		CreatedAt: createdAt,
	}

	item, err := attributevalue.MarshalMap(msg)
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Internal Server Error", Headers: headers}, nil
	}

	_, err = db.Client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(db.ContactTableName),
		Item:      item,
	})
	if err != nil {
		log.Printf("Error putting contact message: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error saving message", Headers: headers}, nil
	}

	return events.APIGatewayProxyResponse{StatusCode: 200, Body: "{\"message\": \"Message sent successfully\"}", Headers: headers}, nil
}

func getContactMessages(ctx context.Context, headers map[string]string) (events.APIGatewayProxyResponse, error) {
	// A simple Scan to get all messages for the admin dashboard
	result, err := db.Client.Scan(ctx, &dynamodb.ScanInput{
		TableName: aws.String(db.ContactTableName),
	})
	if err != nil {
		log.Printf("Error scanning contact messages: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error retrieving messages", Headers: headers}, nil
	}

	var messages []models.ContactMessage
	if err := attributevalue.UnmarshalListOfMaps(result.Items, &messages); err != nil {
		log.Printf("Error unmarshaling contact messages: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error decoding messages", Headers: headers}, nil
	}

	bodyBytes, err := json.Marshal(messages)
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error serializing response", Headers: headers}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers:    headers,
		Body:       string(bodyBytes),
	}, nil
}

func main() {
	lambda.Start(handler)
}
