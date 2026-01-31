# Deni API Overview

This document defines the initial API surface for the Deni application.
Endpoints may evolve as implementation progresses.

---

## Authentication

POST /auth/signup  
Creates a new user account.

POST /auth/login  
Authenticates a user and returns an auth token.

---

## Events

POST /events  
Creates a new event in draft state.

GET /events  
Returns a list of published events based on filters.

GET /events/{id}  
Returns details for a specific event.

PUT /events/{id}  
Updates an existing draft event.

POST /events/{id}/publish  
Attempts to publish an event if trust requirements are met.

---

## Verification

POST /verification/submit  
Submits verification data for an event or organizer.

GET /verification/status/{eventId}  
Returns current verification status.

---

## Trust and Reputation

GET /trust/event/{eventId}  
Returns trust score and confidence level for an event.

GET /trust/user/{userId}  
Returns trust score for a user.

---

## Moderation (optional)

POST /moderation/review  
Queues an event for manual review.

POST /moderation/override  
Applies an admin override with audit tracking.
