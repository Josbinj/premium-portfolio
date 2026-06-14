package db

import (
	"context"
	"os"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

var (
	Client              *dynamodb.Client
	PortfolioTableName  string
	ContactTableName    string
)

func InitDB() error {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		return err
	}

	Client = dynamodb.NewFromConfig(cfg)
	PortfolioTableName = os.Getenv("PORTFOLIO_TABLE_NAME")
	ContactTableName = os.Getenv("CONTACT_TABLE_NAME")

	if PortfolioTableName == "" {
		PortfolioTableName = "portfolio-data"
	}
	if ContactTableName == "" {
		ContactTableName = "portfolio-contact-messages"
	}

	return nil
}
