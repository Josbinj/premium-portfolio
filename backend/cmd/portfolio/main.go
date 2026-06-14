package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

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
	sectionID := req.PathParameters["section"]
	if sectionID == "" {
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Missing section parameter"}, nil
	}

	headers := map[string]string{
		"Access-Control-Allow-Origin":  "*",
		"Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
	}

	switch req.HTTPMethod {
	case "OPTIONS":
		return events.APIGatewayProxyResponse{StatusCode: 200, Headers: headers}, nil

	case "GET":
		return getSection(ctx, sectionID, headers)

	case "PUT":
		return updateSection(ctx, sectionID, req.Body, headers)

	default:
		return events.APIGatewayProxyResponse{StatusCode: 405, Body: "Method Not Allowed", Headers: headers}, nil
	}
}

func getSection(ctx context.Context, sectionID string, headers map[string]string) (events.APIGatewayProxyResponse, error) {
	key, err := attributevalue.MarshalMap(map[string]string{"SectionID": sectionID})
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Internal Server Error"}, nil
	}

	result, err := db.Client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(db.PortfolioTableName),
		Key:       key,
	})
	if err != nil {
		log.Printf("Error getting item: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error retrieving data"}, nil
	}

	if result.Item == nil {
		return events.APIGatewayProxyResponse{StatusCode: 404, Body: "Section not found", Headers: headers}, nil
	}

	var section models.PortfolioSection
	if err := attributevalue.UnmarshalMap(result.Item, &section); err != nil {
		log.Printf("Error unmarshaling item: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error decoding data"}, nil
	}

	bodyBytes, err := json.Marshal(section.Data)
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error serializing response"}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers:    headers,
		Body:       string(bodyBytes),
	}, nil
}

func updateSection(ctx context.Context, sectionID string, body string, headers map[string]string) (events.APIGatewayProxyResponse, error) {
	var payload interface{}
	if err := json.Unmarshal([]byte(body), &payload); err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Invalid JSON payload", Headers: headers}, nil
	}

	section := models.PortfolioSection{
		SectionID: sectionID,
		Data:      payload,
	}

	item, err := attributevalue.MarshalMap(section)
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Internal Server Error", Headers: headers}, nil
	}

	_, err = db.Client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(db.PortfolioTableName),
		Item:      item,
	})
	if err != nil {
		log.Printf("Error putting item: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: fmt.Sprintf("Error saving data: %v", err), Headers: headers}, nil
	}

	return events.APIGatewayProxyResponse{StatusCode: 200, Body: "{\"message\": \"Section updated successfully\"}", Headers: headers}, nil
}

func main() {
	lambda.Start(handler)
}
