//const readline = require("readline"); --Testing purpose only
const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// Create a reverse lookup map for decoding
const base64Map = {};
for (let i = 0; i < base64Chars.length; i++) {
    base64Map[base64Chars[i]] = i;
}


// Base64 encoding function
function base64Encode(str) {
    //convertin string int ascii values in binary version
    const asciiValues = [];
    for (let i = 0; i < str.length; i++) {
        asciiValues.push(str.charCodeAt(i));
    }
    //converting ascii values to binary
    const binaryValues = asciiValues.map((value) => {
        return value.toString(2).padStart(8, '0');
    });

    //concatenate all the binary values
    const binaryString = binaryValues.join('');

    //split the binary string into 6 bit chunks
    const sixBitChunks = [];
    for (let i = 0; i < binaryString.length; i += 6) {
        //if the 
        sixBitChunks.push(binaryString.slice(i, i + 6).padEnd(6, '0'));
        
    }
     // Convert 6-bit chunks to decimal values
    const decimalValues = sixBitChunks.map((chunk) => {
        return parseInt(chunk, 2);
    });

    // Convert decimal values to base64 characters
    let base64String = decimalValues.map((decimal) => {
        return base64Chars[decimal];
    }).join('');

     // Add padding if necessary
     const paddingLength = str.length % 3;
     if (paddingLength > 0) {
         base64String += '='.repeat(3 - paddingLength);
     }

     return base64String;


}

function base64Decode(base64Str) {
    // Remove padding equals signs and any whitespace
    base64Str = base64Str.replace(/=+$/, '').trim();

    // Convert base64 characters to their 6-bit binary values
    let binaryString = '';
    for (let i = 0; i < base64Str.length; i++) {
        const char = base64Str[i];
        if (base64Map.hasOwnProperty(char)) {
            binaryString += base64Map[char].toString(2).padStart(6, '0');
        } else {
            throw new Error(`Invalid base64 character: ${char}`);
        }
    }

    // Group binary string into 8-bit chunks (bytes)
    const bytes = [];
    for (let i = 0; i < binaryString.length; i += 8) {
        const byte = binaryString.slice(i, i + 8);
        if (byte.length === 8) {  // Only process complete bytes
            bytes.push(parseInt(byte, 2));
        }
    }

    // Convert bytes to characters
    return String.fromCharCode(...bytes);
}


// Make it available globally
if (typeof window !== 'undefined') {
    window.base64Encode = base64Encode;
    window.base64Decode = base64Decode;
}




// // Test the function
// function testBase64Encode() {
//     const testCases = [
//         'light work.',
//         'light work',
//         'light wor',
//         'light wo',
//         'light w'
//     ];

//     testCases.forEach(test => {
//         const encoded = base64Encode(test);
//         const builtInEncoded = Buffer.from(test).toString('base64');
//         console.log(`Input: ${test}`);
//         console.log(`Our encoding: ${encoded}`);
//         console.log(`Built-in encoding: ${builtInEncoded}`);
//         console.log(`Match: ${encoded === builtInEncoded}\n`);
//     });
// }
// testBase64Encode();


// // Test decode function
// function testBase64Decode() {
//     const testCases = [
//         'bGlnaHQgd29yay4=',    // 'light work.'
//         'bGlnaHQgd29yaw==',    // 'light work'
//         'bGlnaHQgd29y',        // 'light wor'
//         'bGlnaHQgd28=',        // 'light wo'
//         'bGlnaHQgdw=='        // 'light w'
//     ];

//     testCases.forEach(test => {
//         const decoded = base64Decode(test);
//         const builtInDecoded = Buffer.from(test, 'base64').toString();
//         console.log(`Input (Base64): ${test}`);
//         console.log(`Our decoding: ${decoded}`);
//         console.log(`Built-in decoding: ${builtInDecoded}`);
//         console.log(`Match: ${decoded === builtInDecoded}\n`);
//     });
// }
// testBase64Decode();




// // Function to handle user input
// async function getUserInput() {
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout
//     });

//     try {
//         const input = await new Promise((resolve) => {
//             rl.question('Enter text to encode: ', resolve);
//         });
        
//         const encoded = base64Encode(input);
//         console.log('ASCII values:', encoded);
        
//     } finally {
//         rl.close();
//     }
// }

// // Run the program
// getUserInput();
