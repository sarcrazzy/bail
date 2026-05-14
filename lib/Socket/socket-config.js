"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptimalSocketConfig = void 0;

/**
 * Get optimal socket configuration for better connection stability
 * Handles both QR code and phone number pairing
 */
const getOptimalSocketConfig = (customConfig = {}) => {
    return {
        // Timeouts configuration
        connectTimeoutMs: customConfig.connectTimeoutMs || 60000, // Increased from 30s to 60s
        defaultQueryTimeoutMs: customConfig.defaultQueryTimeoutMs || 35000, // Increased from 20s to 35s
        keepAliveIntervalMs: customConfig.keepAliveIntervalMs || 30000, // Increased from 25s to 30s
        
        // QR Timeout - untuk QR code pairing
        qrTimeout: customConfig.qrTimeout || 30000,
        
        // Handshake retry configuration
        maxHandshakeRetries: customConfig.maxHandshakeRetries || 5,
        handshakeRetryDelayMs: customConfig.handshakeRetryDelayMs || 2000,
        
        // Backoff configuration
        backoffDelayMs: customConfig.backoffDelayMs || 8000,
        
        // Connection check
        connectionCheckIntervalMs: customConfig.connectionCheckIntervalMs || 5000,
        
        // Message queue
        messageQueueTimeoutMs: customConfig.messageQueueTimeoutMs || 10000,
        
        ...customConfig
    };
};

exports.getOptimalSocketConfig = getOptimalSocketConfig;
