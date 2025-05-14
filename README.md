# Scalable Like System

A complete application designed to experiment with building a **scalable like counting system** capable of handling **up to 1 million users concurrently**. This project includes a **backend API** and a **mobile app** to test and visualize real-time performance with **image-based posts**.

---

## 🧠 Purpose

The goal is to learn and implement the architecture of a high-performance like system as described in [this tutorial](https://blog.algomaster.io/p/designing-a-scalable-likes-counting-system), focusing on efficiency, deduplication, and scalability—specifically applied to a platform where **users can like images**.

---

## 📦 Project Structure

```
/scalable-likes-app
├── api/           # RESTful API 
│   └── ...
├── mobile-app/        # Mobile app 
│   └── ...
├── README.md
└── ...
```

---

## ⚙️ Tech Stack

* **Backend:** Node.js
* **Database:** Redis (fast in-memory counter) + PostgreSQL (persistence)
* **Mobile App:** React Native
* **API:** RESTful, designed for high throughput and low latency

---

## 🚀 Features

* Upload and display image posts
* Like functionality with per-user deduplication
* Scalable like counter using Redis, with asynchronous sync to PostgreSQL
* Real-time like count updates
* Load testing via the mobile app to simulate high user traffic

---

## 📲 Mobile App Capabilities

The companion mobile app allows you to:

* Upload and browse image posts
* Like images in real time
* View live updates to the like counters
* Simulate heavy traffic to test the scalability of the backend system

---

## 🧪 Scalability Testing

We use load testing tools to simulate:

* 10K concurrent users
* 100K users
* Up to 1 million users

Metrics observed:

* API response time
* Data consistency and Redis-to-PostgreSQL syncing
* System stability under stress

---

## 🔀 Branching Strategy

To ensure a clean and maintainable development workflow, this repository follows a **multi-branch structure**:

* **`main`** – Production-ready, stable release
* **`prod`** – Contains the live deployment state (mirrors `main` with production configs)
* **`staging`** – Pre-production environment for final integration testing
* **`dev-api`** – Active development for the backend API
* **`dev-app`** – Active development for the mobile application

Each feature or fix will be developed in feature branches and merged into the respective `dev-*` branch. Pull requests will be reviewed before merging into `staging` or `main`.

---

## 🔄 Redis Pub/Sub and Socket.io Usage

To enable real-time updates and efficient event handling, this system utilizes both **Redis Pub/Sub** and **Socket.io** in the following way:

### Redis Pub/Sub (Publish/Subscribe):

1. **Backend Event Handling:** Redis Pub/Sub is used in the backend API to manage and propagate "like" events across distributed components of the system.

   * **Publish:** When a user likes an image, the backend publishes an event to a Redis channel (e.g., `like_event`).
   * **Subscribe:** Other components of the system (such as the real-time counter system or other services) subscribe to this channel to be notified when a new like occurs.

2. **Scalable Architecture:** By using Redis Pub/Sub, we can ensure that all components of the backend (including multiple microservices if applicable) receive like events in near real-time, even if they are running on different servers or containers.

### Socket.io (Real-Time Communication):

1. **Mobile App Interaction:** The mobile app uses **Socket.io** to listen for real-time updates to the like counts of image posts.

   * When a "like" event is triggered on the backend (via Redis Pub/Sub), the backend emits an event using Socket.io to notify all connected mobile clients about the updated like count.
   * This enables the mobile app to update the like counters in real-time without requiring users to refresh their view.

2. **WebSocket for Instant Updates:** Socket.io creates a WebSocket connection between the mobile app and the backend, ensuring that like events are pushed instantly to the app, maintaining a seamless user experience.

3. **Scalability Considerations:** Both Redis Pub/Sub and Socket.io are used in combination to efficiently handle high volumes of events. Redis ensures that events are distributed reliably across backend services, and Socket.io facilitates real-time communication with the mobile app, even when handling millions of users.

---

## 📚 Reference

* Original Tutorial: [Designing a Scalable Likes Counting System](https://blog.algomaster.io/p/designing-a-scalable-likes-counting-system)