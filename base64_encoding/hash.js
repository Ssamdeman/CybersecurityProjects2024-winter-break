// MD5 Constants
const r = [
    7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,
    5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,
    4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,
    6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21
];

const k = new Array(64);
for (let i = 0; i < 64; i++) {
    k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * Math.pow(2, 32));
}

function leftRotate(x, c) {
    return (x << c) | (x >>> (32 - c));
}

function bytesToWords(bytes) {
    const words = new Array(bytes.length >> 2);
    for (let i = 0; i < words.length; i++) {
        words[i] = 0;
    }
    for (let i = 0; i < bytes.length * 8; i += 8) {
        words[i >> 5] |= (bytes[i / 8] & 0xFF) << (i % 32);
    }
    return words;
}

function stringToBytes(str) {
    const bytes = new Array(str.length);
    for (let i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i) & 0xFF;
    }
    return bytes;
}

function wordsToHex(words) {
    let hex = '';
    for (let i = 0; i < words.length * 32; i += 8) {
        const byte = (words[i >> 5] >>> (i % 32)) & 0xFF;
        hex += (byte < 16 ? '0' : '') + byte.toString(16);
    }
    return hex;
}

//this is helper functions for sha-256

//binary rotation
const rightRotateSha = (value, amount) => {
    return (value >>> amount) | (value << (32 - amount));
};

const leftRotateSha = (value, amount) => {
    return (value << amount) | (value >>> (32 - amount));
};

//conversion of string to bytes
const strTobin = (str) => {
    const bin = [];
    for (let i = 0; i < str.length; i++) {
        const binary = str.charCodeAt(i).toString(2).padStart(8, '0');
        bin.push(...binary.split('').map(Number));
    }
    return bin;
};

//conversion of binary to hex
const binTohexSha = (binary) => {
    let hex = '';
    for (let i = 0; i < binary.length; i += 4) {
        const chunk = binary.slice(i, i + 4);
        hex += parseInt(chunk.join(''), 2).toString(16);
    }
    return hex;
};
// Constant 
const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

// Initial hash values (first 32 bits of the fractional parts of the square roots of the first 8 primes)
const H = [
    0x6a09e667,
    0xbb67ae85,
    0x3c6ef372,
    0xa54ff53a,
    0x510e527f,
    0x9b05688c,
    0x1f83d9ab,
    0x5be0cd19
];

// Add padding to the binary message
const addPaddingSha = (bin) => {
    const len = bin.length;
    const k = (512 - ((len + 1 + 64) % 512)) % 512;
    const paddedBin = [...bin, 1, ...Array(k).fill(0)];
    
    // Append original length as 64-bit big-endian integer
    const lenBits = BigInt(len).toString(2).padStart(64, '0');
    paddedBin.push(...lenBits.split('').map(Number));
    
    return paddedBin;
};

// Split message into 512-bit chunks
const splitIntoChunksSha = (paddedBin) => {
    const chunks = [];
    for (let i = 0; i < paddedBin.length; i += 512) {
        chunks.push(paddedBin.slice(i, i + 512));
    }
    return chunks;
};

// Add right shift function
const rightShift = (value, amount) => {
    return value >>> amount;
};





























function md5(message) {
    // Convert string to bytes
    let bytes = stringToBytes(message);
    const originalLength = bytes.length * 8;

    // Padding
    bytes = bytes.concat([0x80]);
    while ((bytes.length * 8 + 64) % 512 !== 0) {
        bytes.push(0);
    }

    // Append original length
    const lengthWords = [originalLength >>> 0, (originalLength / Math.pow(2, 32)) >>> 0];
    for (let i = 0; i < 8; i++) {
        bytes.push((lengthWords[i >>> 2] >>> ((i % 4) * 8)) & 0xFF);
    }

    // Convert to words
    const words = bytesToWords(bytes);

    // Initialize variables
    let a = 0x67452301;
    let b = 0xEFCDAB89;
    let c = 0x98BADCFE;
    let d = 0x10325476;

    // Main loop
    for (let i = 0; i < words.length; i += 16) {
        const oldA = a;
        const oldB = b;
        const oldC = c;
        const oldD = d;

        for (let j = 0; j < 64; j++) {
            let f, g;
            
            if (j < 16) {
                f = (b & c) | ((~b) & d);
                g = j;
            } else if (j < 32) {
                f = (d & b) | ((~d) & c);
                g = (5 * j + 1) % 16;
            } else if (j < 48) {
                f = b ^ c ^ d;
                g = (3 * j + 5) % 16;
            } else {
                f = c ^ (b | (~d));
                g = (7 * j) % 16;
            }

            const temp = d;
            d = c;
            c = b;
            b = b + leftRotate((a + f + k[j] + words[i + g]) >>> 0, r[j]);
            a = temp;
        }

        a = (a + oldA) >>> 0;
        b = (b + oldB) >>> 0;
        c = (c + oldC) >>> 0;
        d = (d + oldD) >>> 0;
    }

    return wordsToHex([a, b, c, d]);
}

// // Test function
// function testMD5() {
//     const testCases = [
//         { input: "abc", expected: "900150983cd24fb0d6963f7d28e17f72" },
//         { input: "test", expected: "098f6bcd4621d373cade4e832627b4f6" },
//         { input: "", expected: "d41d8cd98f00b204e9800998ecf8427e" }
//     ];

//     console.log("Starting MD5 Tests...\n");

//     testCases.forEach((test, index) => {
//         const result = md5(test.input);
//         const passed = result === test.expected;
        
//         console.log(`Test ${index + 1}:`);
//         console.log(`Input: "${test.input}"`);
//         console.log(`Expected: ${test.expected}`);
//         console.log(`Got: ${result}`);
//         console.log(`Status: ${passed ? 'PASSED' : 'FAILED'}\n`);
//     });
// }

// testMD5();

//
//Building SHA-256

// //THis is my test code for sha-256
// const crypto = require('crypto');
// // Create a hash of "hello world"
// const hash = crypto.createHash('sha256')
//     .update('hello world')
//     .digest('hex');

//console.log("SHA-256 hash of 'hello world':", hash);

// SHA-256 main loop
function sha256(message) {
    // Convert message to binary
    let bin = strTobin(message);
    
    // Add padding
    bin = addPaddingSha(bin);
    
    // Split into 512-bit chunks
    const chunks = splitIntoChunksSha(bin);
    
    // Initialize hash values (working variables)
    let [a, b, c, d, e, f, g, h] = H;
    
    // Process each chunk
    for (const chunk of chunks) {
        // Create message schedule array
        const W = new Array(64);
        
        // First 16 words are the 32-bit chunks
        for (let t = 0; t < 16; t++) {
            W[t] = parseInt(chunk.slice(t * 32, (t + 1) * 32).join(''), 2);
        }
        
        // Extend the first 16 words into remaining 48 words
        for (let t = 16; t < 64; t++) {
            const s0 = rightRotateSha(W[t-15], 7) ^ rightRotateSha(W[t-15], 18) ^ rightShift(W[t-15], 3);
            const s1 = rightRotateSha(W[t-2], 17) ^ rightRotateSha(W[t-2], 19) ^ rightShift(W[t-2], 10);
            W[t] = (W[t-16] + s0 + W[t-7] + s1) >>> 0;
        }
        
        // Initialize working variables
        let [ah, bh, ch, dh, eh, fh, gh, hh] = [a, b, c, d, e, f, g, h];
        
        // Main loop
        for (let t = 0; t < 64; t++) {
            const S1 = rightRotateSha(eh, 6) ^ rightRotateSha(eh, 11) ^ rightRotateSha(eh, 25);
            const ch_result = (eh & fh) ^ (~eh & gh);
            const temp1 = (hh + S1 + ch_result + K[t] + W[t]) >>> 0;
            const S0 = rightRotateSha(ah, 2) ^ rightRotateSha(ah, 13) ^ rightRotateSha(ah, 22);
            const maj = (ah & bh) ^ (ah & ch) ^ (bh & ch);
            const temp2 = (S0 + maj) >>> 0;
            
            hh = gh;
            gh = fh;
            fh = eh;
            eh = (dh + temp1) >>> 0;
            dh = ch;
            ch = bh;
            bh = ah;
            ah = (temp1 + temp2) >>> 0;
        }
        
        // Add compressed chunk to current hash value
        a = (a + ah) >>> 0;
        b = (b + bh) >>> 0;
        c = (c + ch) >>> 0;
        d = (d + dh) >>> 0;
        e = (e + eh) >>> 0;
        f = (f + fh) >>> 0;
        g = (g + gh) >>> 0;
        h = (h + hh) >>> 0;
    }
    
    // Produce final hash value (big-endian)
    const hash = [a, b, c, d, e, f, g, h].map(num => 
        num.toString(16).padStart(8, '0')
    ).join('');
    
    return hash;
}

// const hash2 = sha256("hello world");
// console.log(hash2);

// // Test function
// function testSHA256() {
//     const testCases = [
//         "hello world",
//         "",
//         "abc",
//         "The quick brown fox jumps over the lazy dog"
//     ];

//     let allTestsPassed = true;

//     for (const test of testCases) {
//         // Our implementation
//         const ourHash = sha256(test);
        
//         // Node's crypto implementation
//         const nodeHash = crypto.createHash('sha256')
//             .update(test)
//             .digest('hex');
        
//         // Compare
//         if (ourHash !== nodeHash) {
//             console.log(`Failed for input: "${test}"`);
//             console.log(`Our hash:   ${ourHash}`);
//             console.log(`Node hash:  ${nodeHash}`);
//             allTestsPassed = false;
//         }
//     }

//     if (allTestsPassed) {
//         console.log(" All tests passed! Our SHA-256 implementation matches Node's crypto!");
//     } else {
//         console.log(" Some tests failed.");
//     }
// }

// // Run the test
// testSHA256();