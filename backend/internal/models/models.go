package models

// PortfolioSection represents a single dynamic section of the portfolio
type PortfolioSection struct {
	SectionID string      `dynamodbav:"SectionID" json:"sectionId"`
	Data      interface{} `dynamodbav:"Data" json:"data"`
}

// ContactMessage represents a submission from the contact form
type ContactMessage struct {
	MessageID string `dynamodbav:"MessageID" json:"messageId"`
	Name      string `dynamodbav:"Name" json:"name"`
	Email     string `dynamodbav:"Email" json:"email"`
	Subject   string `dynamodbav:"Subject" json:"subject"`
	Message   string `dynamodbav:"Message" json:"message"`
	CreatedAt string `dynamodbav:"CreatedAt" json:"createdAt"`
}
