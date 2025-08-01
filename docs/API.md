# Psyloom API v1 Documentation

Welcome to the Psyloom API, a tool for interacting with digital personalities. Our API allows you to create unique digital audiences from textual descriptions, monitor their creation process, and engage with them through dialogue, behavioral analysis, and personalized content generation.

## Table of Contents
- [API Purpose](#api-purpose)
- [General Principles](#general-principles)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Create Personality](#create-personality)
  - [Check Creation Status](#check-creation-status)
  - [Interact with Personality](#interact-with-personality)

---

## API Purpose

The API provides programmatic access to the Psyloom intelligent system, enabling you to:

- **Create digital personalities**: Generate complex personas from simple text descriptions.
- **Track creation status**: Monitor the asynchronous process of personality generation.
- **Interact with personalities**: Simulate dialogues, explore emotional reactions, and generate content tailored to a specific persona.

---

## General Principles

- **Request and Response Format**: All data is sent and received in JSON format.
- **Character Encoding**: UTF-8.
- **Headers**: All requests must include the following headers:
    - `Content-Type: application/json`
    - `Authorization: Bearer {YOUR_API_KEY}`

---

## Base URL

All API endpoints are relative to the following base URL:

`https://api.psyloom.com/api/v1/`

---

## Authentication

Authentication is required for all API requests. An API Key must be included in the `Authorization` header as a Bearer token.

You can generate and manage your API Keys in your account on the **API Keys** page.

**Example Header:**
```
Authorization: Bearer your_secret_api_key_here
```

---

## Endpoints

### Create Personality

Creates a new digital personality (referred to as an "audience") based on a textual description. This is an asynchronous operation that initiates a creation process.

`POST /audience`

#### Parameters

| Name          | Type   | In   | Description                                       |
|---------------|--------|------|---------------------------------------------------|
| `description` | string | body | A detailed textual description of the personality. |

#### Example Request

```bash
curl -X POST https://api.psyloom.com/api/v1/audience \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
      "description": "A young woman, 27 years old. Designer, fast-paced and sharp, perceives the world through physical sensations..."
  }'
```

#### Example Response

The response includes a `process_id` which you can use to check the status of the creation process.

```json
{
  "status": "done",
  "process_id": 4
}
```

---

### Check Creation Status

Retrieves the status of a personality creation process. Once the process is complete, the response will include the `audience_id` required for interaction.

`GET /audience/{process_id}`

#### Path Parameters

| Name         | Type    | Description                                |
|--------------|---------|--------------------------------------------|
| `process_id` | integer | The ID of the creation process from the POST `/audience` response. |

#### Example Request

```bash
curl https://api.psyloom.com/api/v1/audience/4 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY"
```

#### Example Response

When the `status` is `done`, the `audience_id` is returned.

```json
{
  "status": "done",
  "audience_id": "XXXXX"
}
```

---

### Interact with Personality

Submits a query to a fully generated digital personality. This is the primary endpoint for all interactions.

`POST /query`

#### Features:
- Ask questions.
- Gauge emotional responses or inner states.
- Generate text that aligns with the personality's perception.

#### Parameters

| Name          | Type   | In   | Description                                                                 |
|---------------|--------|------|-----------------------------------------------------------------------------|
| `audience_id`   | string | body | The ID of the personality you want to interact with.                        |
| `context`     | string | body | Sets the scene or context for the interaction.                              |
| `prompt`      | string | body | The input or question for the personality.                                  |
| `mode`        | string | body | Defines the type of interaction (e.g., `dialogue`).                         |
| `perspective` | string | body | The point of view for the response (e.g., `first_person`, `third_person`). |

#### Example Request

```bash
curl -X POST https://api.psyloom.com/api/v1/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
      "audience_id": "XXXXX",
      "context": "In-person meeting. Romantic dinner.",
      "prompt": "I’m running 20 minutes late.",
      "mode": "dialogue",
      "perspective": "first_person"
  }'
```

#### Example Response

```json
{
  "status": "done",
  "answer": "Good evening. I was starting to wonder if something happened. Is everything okay?"
}
```
