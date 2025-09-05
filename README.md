# MTech Drift Detection Framework

This repository contains the implementation of my **M.Tech Dissertation Project**: a **Schema Drift Detection Framework** for data pipelines.  
The project simulates an **enterprise-grade solution** that proactively detects schema drift in scheduled datasets, logs drift events, and visualizes results through a React dashboard.

---

## 📌 Problem Statement
Modern enterprises rely heavily on scheduled data pipelines. Unexpected **schema drift** (added, removed, renamed columns) can:
- Break pipelines at runtime
- Cause delayed reporting
- Propagate incorrect data to downstream analytics

This project provides a **proactive framework** to detect schema drift before pipeline execution.

---

## 🎯 Features
- Register datasets with metadata (schema, frequency, thresholds)
- Scheduled monitoring using a .NET Worker Service
- Drift detection types:
  - Schema Drift (added, removed, renamed columns)
  - (Extendable for Data Drift: null %, range, uniqueness)
- Drift scoring with severity levels
- React dashboard for drift history, summary, and drill-down reports
- File simulator to generate synthetic CSV files with schema changes
- SQL Server backend for storing dataset configurations and drift logs

---

## 🛠 Tech Stack
**Backend:**
- C# .NET 8 (Web API + Worker Service)
- Entity Framework Core
- SQL Server (metadata + drift logs)

**Frontend:**
- React + TailwindCSS
- Recharts for data visualization

**Simulation:**
- File Simulator (Console app to generate test CSV files)

**Enterprise Extension (Future Vision):**
- Azure Blob/Data Lake for file storage
- Azure Functions / Durable Functions for scheduling
- Azure Monitor + Logic Apps for alerts
- Power BI for enterprise reporting

---

## 📂 Repository Structure
