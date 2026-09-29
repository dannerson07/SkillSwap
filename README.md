# SkillSwap - Community Skill Exchange

SkillSwap is a community-based skill exchange platform where people can **teach and learn skills using time credits instead of money**.

Members can offer skills, request learning sessions from other members, complete sessions, and transfer time credits based on the actual time spent.

---

## Overview

The basic idea behind SkillSwap is simple:

> **Your time is your currency.**

Every new member starts with a small amount of time credits.

For example:

* Alice offers Java Programming.
* Bob wants to learn Java.
* Bob requests 2 hours from Alice.
* Alice confirms the session.
* They complete 1.5 hours.
* Bob loses 1.5 time credits.
* Alice gains 1.5 time credits.
* The transaction is recorded in the credit ledger.

This creates a simple community-driven skill exchange system.

---

## Features

### Member Management

* Create new members
* View all members
* View an individual member
* View a member's credit balance
* Prevent duplicate email addresses

### Skill Management

* Create skill offers
* View all available skills
* View a specific skill
* View skills offered by a member
* Search skills by name
* Delete skill offers
* Track available hours for each skill

### Session Management

* Request a skill session
* Confirm a session
* Reject a session
* Complete a session
* Record actual hours completed
* Prevent members from requesting their own skills
* Prevent requests exceeding available skill hours
* Prevent requests when the requester has insufficient credits

### Credit System

* New members receive initial time credits
* Credits are transferred when a session is completed
* Requester's credits are debited
* Provider's credits are credited
* Available skill hours are reduced
* Every transaction is recorded in the credit ledger

### Frontend

The project includes a browser-based dashboard with:

* Dashboard
* Members section
* Skills section
* Sessions section
* Credit Ledger
* Forms for creating members and skills
* Session management actions
* Credit balance display
* Notifications for successful and failed operations

---

## Technology Stack

### Backend

* Java
* Spring Boot
* Spring Web
* Spring Data JPA
* Hibernate
* Jakarta Validation
* Lombok

### Database

* MySQL
* MySQL Workbench

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript

### API Testing

* Postman

### Development Environment

* Visual Studio Code
* Maven

---

## Project Architecture

SkillSwap follows a layered backend architecture.

```text
                    ┌──────────────────────┐
                    │      Frontend        │
                    │  HTML / CSS / JS     │
                    └──────────┬───────────┘
                               │
                               │ HTTP Requests
                               ▼
                    ┌──────────────────────┐
                    │     Controllers      │
                    │   REST API Layer     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Services        │
                    │  Business Logic      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Repositories      │
                    │   Data Access Layer  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │        MySQL         │
                    │      Database        │
                    └──────────────────────┘
```

---

## Project Structure

```text
skillswap/
│
├── pom.xml
│
└── src/
    │
    └── main/
        │
        ├── java/
        │   └── com/
        │       └── example/
        │           └── skillswap/
        │
        │               ├── SkillswapApplication.java
        │               │
        │               ├── controller/
        │               │   ├── MemberController.java
        │               │   ├── SkillOfferController.java
        │               │   ├── SessionRequestController.java
        │               │   └── CreditLedgerController.java
        │               │
        │               ├── service/
        │               │   ├── MemberService.java
        │               │   ├── SkillOfferService.java
        │               │   ├── SessionRequestService.java
        │               │   └── CreditLedgerService.java
        │               │
        │               ├── repository/
        │               │   ├── MemberRepository.java
        │               │   ├── SkillOfferRepository.java
        │               │   ├── SessionRequestRepository.java
        │               │   └── CreditLedgerRepository.java
        │               │
        │               ├── model/
        │               │   ├── Member.java
        │               │   ├── SkillOffer.java
        │               │   ├── SessionRequest.java
        │               │   └── CreditLedger.java
        │               │
        │               ├── dto/
        │               │   ├── MemberRequest.java
        │               │   ├── SkillOfferRequest.java
        │               │   ├── SessionRequestDto.java
        │               │   └── CompleteSessionRequest.java
        │               │
        │               ├── enums/
        │               │   ├── SessionStatus.java
        │               │   └── TransactionType.java
        │               │
        │               └── exception/
        │                   ├── ResourceNotFoundException.java
        │                   ├── InsufficientCreditsException.java
        │                   ├── InvalidSessionException.java
        │                   └── GlobalExceptionHandler.java
        │
        └── resources/
            │
            ├── application.properties
            │
            └── static/
                ├── index.html
                ├── style.css
                └── script.js
```

---

# Database Design

The application currently uses four main tables.

```text
members
   │
   ├─────────────── skill_offers
   │
   ├─────────────── session_requests
   │
   └─────────────── credit_ledger
```

### Members

Stores information about people using SkillSwap.

Important fields:

* `id`
* `name`
* `email`
* `credit_balance`
* `created_at`

### Skill Offers

Stores skills that members are willing to teach.

Important fields:

* `id`
* `skill_name`
* `description`
* `available_hours`
* `provider_id`
* `created_at`

### Session Requests

Stores requests between members.

Important fields:

* `id`
* `skill_offer_id`
* `requester_id`
* `requested_hours`
* `actual_hours`
* `status`
* `requested_at`
* `completed_at`

Possible session statuses:

```text
REQUESTED
CONFIRMED
REJECTED
COMPLETED
```

### Credit Ledger

Stores credit transactions generated by completed sessions.

Important fields:

* `id`
* `member_id`
* `session_request_id`
* `amount`
* `transaction_type`
* `created_at`

Possible transaction types:

```text
CREDIT
DEBIT
```

---

# Requirements

Before running the project, make sure the following are installed:

* Java 25 or compatible configured Java version
* Maven
* MySQL
* MySQL Workbench
* Visual Studio Code
* Git
* Postman (optional, for API testing)

---

# Database Setup

Open MySQL Workbench and create the database:

```sql
CREATE DATABASE skillswap;
```

The application is configured to connect to:

```text
Database: skillswap
Username: root
Password: root
Host: localhost
Port: 3306
```

Update `application.properties` if your MySQL credentials are different.

Example:

```properties
spring.application.name=skillswap

spring.datasource.url=jdbc:mysql://localhost:3306/skillswap
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

# Running the Application

## 1. Clone the repository

```bash
git clone <your-repository-url>
```

Move into the project:

```bash
cd skillswap
```

## 2. Start the application

Using Maven:

```bash
mvn spring-boot:run
```

Or run the main class from Visual Studio Code:

```text
SkillswapApplication.java
```

The application should start on:

```text
http://localhost:8080
```

---

# Frontend

Once the Spring Boot application is running, open:

```text
http://localhost:8080/
```

The frontend is served directly by Spring Boot from:

```text
src/main/resources/static/
```

The main frontend files are:

```text
index.html
style.css
script.js
```

---

# REST API

The backend exposes REST APIs under:

```text
/api
```

## Members

### Create Member

```http
POST /api/members
```

Example:

```json
{
    "name": "Alice",
    "email": "alice@example.com"
}
```

### Get All Members

```http
GET /api/members
```

### Get Member

```http
GET /api/members/{id}
```

### Get Credit Balance

```http
GET /api/members/{id}/credits
```

---

## Skill Offers

### Create Skill Offer

```http
POST /api/skill-offers
```

Example:

```json
{
    "skillName": "Java Programming",
    "description": "I can teach Java basics to beginners",
    "availableHours": 5,
    "providerId": 1
}
```

### Get All Skills

```http
GET /api/skill-offers
```

### Get Skill

```http
GET /api/skill-offers/{id}
```

### Get Provider Skills

```http
GET /api/skill-offers/provider/{providerId}
```

### Search Skills

```http
GET /api/skill-offers/search?skillName=Java
```

### Delete Skill

```http
DELETE /api/skill-offers/{id}
```

---

# Session APIs

### Create Session Request

```http
POST /api/sessions
```

Example:

```json
{
    "skillOfferId": 1,
    "requesterId": 2,
    "requestedHours": 2
}
```

### Get All Sessions

```http
GET /api/sessions
```

### Get Session

```http
GET /api/sessions/{id}
```

### Get Sessions by Requester

```http
GET /api/sessions/requester/{requesterId}
```

### Get Sessions by Provider

```http
GET /api/sessions/provider/{providerId}
```

### Confirm Session

```http
PUT /api/sessions/{id}/confirm/{providerId}
```

### Reject Session

```http
PUT /api/sessions/{id}/reject/{providerId}
```

### Complete Session

```http
PUT /api/sessions/{id}/complete
```

Example:

```json
{
    "actualHours": 1.5
}
```

---

# Credit Ledger APIs

### Get Member Ledger

```http
GET /api/ledger/member/{memberId}
```

### Get Session Ledger

```http
GET /api/ledger/session/{sessionId}
```

---

# Example Workflow

A typical SkillSwap transaction works like this:

### Step 1 - Create Members

```text
Alice → 5 credits
Bob   → 5 credits
```

### Step 2 - Alice Offers a Skill

```text
Java Programming
Available Hours: 5
Provider: Alice
```

### Step 3 - Bob Requests the Skill

```text
Requested Hours: 2
Status: REQUESTED
```

### Step 4 - Alice Confirms

```text
Status: CONFIRMED
```

### Step 5 - Session Happens

Suppose the actual session lasts:

```text
1.5 hours
```

### Step 6 - Credits Are Transferred

```text
Bob:
5.0 → 3.5 credits

Alice:
5.0 → 6.5 credits
```

### Step 7 - Skill Hours Are Updated

```text
5.0 → 3.5 hours available
```

### Step 8 - Ledger Is Updated

```text
Bob   → DEBIT  1.5
Alice → CREDIT 1.5
```

The session status becomes:

```text
COMPLETED
```

---

# Validation and Error Handling

The backend includes validation and custom exception handling.

Examples of invalid operations include:

* Creating a member without a name
* Creating a member with an invalid email
* Creating a duplicate member email
* Creating a skill without required information
* Requesting a non-existent skill
* Requesting a non-existent member
* Requesting your own skill
* Requesting more hours than the skill has available
* Requesting a session without enough credits
* Confirming an already confirmed session
* Rejecting an already rejected session
* Completing a session that has not been confirmed
* Completing more hours than requested
* Completing more hours than the skill has available

The backend returns appropriate HTTP error responses for these situations.

---

# Testing

The backend was tested using Postman.

The main workflow tested includes:

```text
Create Member
      ↓
Create Member
      ↓
Create Skill Offer
      ↓
Create Session Request
      ↓
Confirm Session
      ↓
Complete Session
      ↓
Check Credit Balance
      ↓
Check Credit Ledger
```

Failure scenarios were also tested, including requesting more hours than the skill currently has available.

---

# Frontend Architecture

The frontend uses plain JavaScript and communicates directly with the Spring Boot REST API.

```text
index.html
    │
    ├── Dashboard
    ├── Members
    ├── Skills
    ├── Sessions
    └── Credit Ledger
          │
          ▼
      script.js
          │
          ▼
      REST API
          │
          ▼
     Spring Boot
```

No frontend framework is currently used.

The project intentionally uses:

* HTML
* CSS
* Vanilla JavaScript

This keeps the frontend lightweight and easy to understand.

---

# Future Improvements

Possible future enhancements include:

* User authentication and login
* Role-based access
* Member profiles
* Skill categories
* Skill search improvements
* Member selection dropdowns instead of manually entering IDs
* Better session scheduling
* Notifications
* Ratings and reviews
* Session history
* Improved dashboard analytics
* Responsive mobile UI improvements
* Better credit transaction history
* Pagination
* Search and filtering
* Production-ready security
* Deployment to a cloud platform

---

# Learning Goals

This project demonstrates several important full-stack development concepts:

* REST API development
* Spring Boot
* Spring Data JPA
* Hibernate
* MySQL database integration
* Entity relationships
* DTOs
* Validation
* Exception handling
* Service-layer business logic
* Transactions
* CRUD operations
* HTTP methods
* Frontend-to-backend communication
* JavaScript `fetch()`
* Database persistence
* Credit/ledger-based business logic

---

# Project Status

Current implementation includes:

* [x] Spring Boot backend
* [x] MySQL database
* [x] Member management
* [x] Skill offers
* [x] Session requests
* [x] Session confirmation
* [x] Session rejection
* [x] Session completion
* [x] Time credit transfers
* [x] Credit ledger
* [x] Validation
* [x] Exception handling
* [x] REST API testing
* [x] HTML frontend
* [x] CSS dashboard
* [x] JavaScript API integration

---

## Author

**Jerush**

Built as a full-stack learning project using Spring Boot, MySQL, HTML, CSS and JavaScript.
