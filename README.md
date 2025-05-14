# Scalable Like System

A complete application designed to experiment with building a **scalable like counting system** capable of handling **up to 1 million users concurrently**. This project includes a **backend API** and a **mobile app** to test and visualize real-time performance with **image-based posts**.

---

## 🧠 Purpose

The goal is to learn and implement the architecture of a high-performance like system as described in [this tutorial](https://blog.algomaster.io/p/designing-a-scalable-likes-counting-system), focusing on efficiency, deduplication, and scalability—specifically applied to a platform where **users can like images**.

---

## 📦 Project Structure

```
/scalable-likes-app
├── backend/           # RESTful API 
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

## 📚 Reference

* Original Tutorial: [Designing a Scalable Likes Counting System](https://blog.algomaster.io/p/designing-a-scalable-likes-counting-system)