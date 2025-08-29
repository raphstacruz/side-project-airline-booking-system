# Technical Specifications Document

## 1. Title Page
- **Project Name**: Airline Booking System  
- **Version**: 0.1.0 (Draft)  
- **Date**: 2025-08-29  
- **Author(s)**:  
  - Raphael Paul Sta. Cruz  
  - Fil Sammy Mejica Abawag  
  - Jonn Ronan Lucas  
  - Carl Joe Dolino Inocentes  
  - Xyzhee Go Montero  

---

## 2. Table of Contents
1. [Title Page](#1-title-page)  
2. [Table of Contents](#2-table-of-contents)  
3. [Introduction](#3-introduction)  
4. [Overall Description](#4-overall-description)  
5. [Visual Mockup Reference](#5-visual-mockup-reference)  
6. [Features](#6-features)  
7. [Functional Requirements](#7-functional-requirements)  
8. [Non-Functional Requirements](#8-non-functional-requirements)  
9. [Data Requirements](#9-data-requirements)  
10. [External Interface Requirements](#10-external-interface-requirements)  
11. [Glossary](#11-glossary)  
12. [Appendices](#12-appendices)  

---

## 3. Introduction
- **Purpose**  
  The Airline Booking System is designed to provide a seamless, efficient, and secure platform for passengers to search, book, and manage flights. It will also empower airline administrators to manage schedules, bookings, and customer interactions through a centralized dashboard.  

- **Scope**  
  The system will support passenger booking, payment processing, and notifications. It will not handle baggage management, in-flight services, or loyalty program integrations in the initial version.  

- **Definitions, Acronyms, and Abbreviations**  
  - **API**: Application Programming Interface  
  - **GDPR**: General Data Protection Regulation  
  - **ERD**: Entity-Relationship Diagram  

- **References**  
  - Airline booking standards (IATA guidelines)  
  - Figma UI mockups  
  - Payment gateway API documentation  

---

## 4. Overall Description
- **Product Perspective**  
  The system functions as a standalone booking platform but can integrate with external airline APIs for real-time flight data and third-party payment gateways for secure transactions.  

- **Product Functions**  
  - Search and filter flights  
  - Book flights and generate unique booking IDs  
  - Process online payments  
  - Provide booking confirmation via email/SMS  
  - Admin flight and user management  

- **User Classes and Characteristics**  
  - **Passenger**: Regular users booking flights, minimal technical expertise required  
  - **Admin**: Airline staff managing schedules, bookings, and accounts  

- **Operating Environment**  
  - **Frontend**: Web (React/Vue), Mobile (optional Phase 2)  
  - **Backend**: Node.js with Express  
  - **Database**: MongoDB/MySQL  
  - **Hosting**: AWS or Azure cloud deployment  

- **Assumptions and Dependencies**  
  - Assumes internet access for all transactions  
  - Depends on third-party APIs for payments and notifications  
  - Assumes airline staff will manage schedules accurately  

---

## 5. Visual Mockup Reference
A visual design mockup has been created in Figma to illustrate the UI and user flow.  
**Figma Link:** [View Figma Mockups](https://www.figma.com/design/SzaMYCbWyyuLVhagLi4e59/Side-Project--Airline-Booking-Application?node-id=0-1&t=NFgnY95TOPvD2MJ0-1)  

---

## 6. Features
The Airline Booking System simplifies and automates flight reservations.  

- **Flight Search**  
- **Booking Management**  
- **User Authentication**  
- **Payment Processing**  
- **Notifications**  
- **Admin Panel**  

---

## 7. Functional Requirements

### Core Requirements
1. Users can search for flights using filters like origin, destination, date, and seat class.  
2. Users can create accounts and log in securely.  
3. Users can book flights and receive a booking confirmation.  
4. Users can view, modify, or cancel their bookings.  
5. Admins can add, update, or remove flights and manage schedules.  
6. Secure payment integration for bookings.  
7. Notifications (email/SMS) are sent after booking confirmation or cancellation.  

### System Features Example
- **Feature 1: Flight Search**  
  - **Description**: Passengers can search flights by filters (origin, destination, date).  
  - **Priority**: High  
  - **Inputs**: User search query (origin, destination, date)  
  - **Processing**: Query flights database or external API  
  - **Outputs**: List of available flights  
  - **Error Handling**: Show “No flights found” message if none match criteria  

---

## 8. Non-Functional Requirements
- **Performance:** Support 1,000 concurrent users.  
- **Availability:** 99.9% uptime.  
- **Security:** Data encryption, secure authentication, GDPR compliance.  
- **Usability:** Mobile-first responsive UI.  
- **Scalability:** Modular backend to support more airlines.  
- **Reliability:** High accuracy in booking and payment status updates.  

---

## 9. Data Requirements
- **User Data**: Name, email, phone, payment info  
- **Flight Data**: Flight number, airline, origin, destination, date/time, seat availability  
- **Booking Data**: Booking ID, user ID, flight ID, status, timestamp  
- **Payment Data**: Transaction ID, amount, method, status  

---

## 10. External Interface Requirements
- **Payment Gateway API**: e.g., Stripe, PayPal  
- **Email/SMS API**: e.g., Twilio, SendGrid  
- **Optional Flight Data API**: For real-time airline schedules  

---

## 11. Glossary
- **Booking**: A confirmed reservation.  
- **Passenger**: End-user booking a flight.  
- **Admin**: Airline staff managing the system.  
- **Transaction**: Payment process linked to booking.  

---

## 12. Appendices
- **References**  
  - IATA airline data documentation  
  - API references for Stripe/PayPal, Twilio/SendGrid  

- **Diagrams**  
  - ERD: showing User, Flight, Booking, Payment relationships  
  - System architecture diagram  

- **Version History**  
  - 0.1.0 – Initial draft  
