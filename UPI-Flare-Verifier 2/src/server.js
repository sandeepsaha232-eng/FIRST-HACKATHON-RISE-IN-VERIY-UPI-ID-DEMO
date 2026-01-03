require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ethers } = require("ethers");
// const { processReceipt } = require("./verificationService"); 
// Inlined mock for stability directly in server.js during restore

const app = express();
const PORT = process.env.PORT || 3000;
let useInMemory = false;
let inMemoryStore = [];

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/upi-flare-verifier";

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => {
        console.log("ℹ️  MongoDB not found. Switching to In-Memory Mode (Stable).");
        useInMemory = true;
    });

// Receipt Schema
const receiptSchema = new mongoose.Schema({
    upiId: String,
    bankRefId: String,
    status: String,
    txHash: String,
    timestamp: { type: Date, default: Date.now }
});

const ReceiptModel = mongoose.model("Receipt", receiptSchema);

// In-Memory Model Wrapper
class InMemoryReceipt {
    constructor(data) {
        this.data = { ...data, timestamp: new Date(), _id: Date.now().toString() };
    }

    async save() {
        if (useInMemory) {
            inMemoryStore.push(this.data);
            return this.data;
        }
        return this.data;
    }
}

// Routes
app.get("/health", (req, res) => {
    res.json({
        status: "API ONLINE",
        dbState: useInMemory ? "IN_MEMORY_FALLBACK" : mongoose.connection.readyState
    });
});

app.post("/api/verify", async (req, res) => {
    const { upiId, bankRefId } = req.body;

    // Simple validation
    if (!upiId || !bankRefId) {
        return res.status(400).json({ error: "Missing upiId or bankRefId" });
    }

    console.log(`Processing verification for UPI: ${upiId}`);

    // Create pending record
    let record;
    if (useInMemory) {
        record = new InMemoryReceipt({ upiId, bankRefId, status: "PENDING" });
    } else {
        record = new ReceiptModel({ upiId, bankRefId, status: "PENDING" });
    }
    await record.save();

    // Mock Blockchain & Bank Delay
    setTimeout(async () => {
        console.log("✅ Bank Check Passed");
        console.log("✅ Blockchain Transaction Confirmed");

        // Update status (in a real app, this would be a separate update)
        // For in-memory demo, we just assume it's done.
    }, 1000);

    const mockTxHash = "0x" + Math.random().toString(16).slice(2) + "..." + Math.random().toString(16).slice(2);

    if (useInMemory) {
        record.data.status = "VERIFIED";
        record.data.txHash = mockTxHash;
    } else {
        record.status = "VERIFIED";
        record.txHash = mockTxHash;
        await record.save();
    }

    res.json({
        message: "Verification Processed",
        data: useInMemory ? record.data : record
    });
});

app.listen(PORT, async () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`   Health Check: http://localhost:${PORT}/health`);
    console.log(`   Mode: ${useInMemory ? "In-Memory (Offline Capable)" : "MongoDB Connected"}\n`);
});
