// Shared verification codes store
// In production, this should be replaced with Redis or a database

class VerificationStore {
    constructor() {
        this.codes = new Map();
    }


    set(email, data) {
        this.codes.set(email, data);
    }

    get(email) {
        return this.codes.get(email);
    }

    delete(email) {
        return this.codes.delete(email);
    }

    has(email) {
        return this.codes.has(email);
    }

    cleanup() {
        const now = Date.now();
        for (const [email, data] of this.codes.entries()) {
            // Clean up entries older than 20 minutes (OTP expires in 15 minutes)
            if (now - data.timestamp > 20 * 60 * 1000) {
                this.codes.delete(email);
            }
        }
    }

    size() {
        return this.codes.size;
    }

    entries() {
        return this.codes.entries();
    }
}

// Create a singleton instance
const verificationStore = new VerificationStore();

export default verificationStore;