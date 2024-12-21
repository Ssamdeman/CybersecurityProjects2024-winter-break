const readline = require("readline");

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
        sixBitChunks.push(binaryString.slice(i, i + 6).padEnd(6, '00'));
        
    }


    
    

    return sixBitChunks;
}

// Function to handle user input
async function getUserInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        const input = await new Promise((resolve) => {
            rl.question('Enter text to encode: ', resolve);
        });
        
        const encoded = base64Encode(input);
        console.log('ASCII values:', encoded);
        
    } finally {
        rl.close();
    }
}

// Run the program
getUserInput();