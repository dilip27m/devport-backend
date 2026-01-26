/**
 * Migration script to drop the legacy unique index on userId
 * Run this once: node src/migrations/dropUserIdIndex.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

async function dropIndex() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('portfolios');

        // List all indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes);

        // Find and drop the userId unique index
        const userIdIndex = indexes.find(
            (idx) => idx.key && idx.key.userId && idx.unique
        );

        if (userIdIndex) {
            console.log('Found unique userId index:', userIdIndex.name);
            await collection.dropIndex(userIdIndex.name);
            console.log('Successfully dropped userId unique index!');
        } else {
            console.log('No unique userId index found. Checking for userId_1...');

            // Try dropping by common name
            try {
                await collection.dropIndex('userId_1');
                console.log('Successfully dropped userId_1 index!');
            } catch (e) {
                console.log('userId_1 index not found or already dropped.');
            }
        }

        // Show remaining indexes
        const remainingIndexes = await collection.indexes();
        console.log('Remaining indexes:', remainingIndexes);

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

dropIndex();
