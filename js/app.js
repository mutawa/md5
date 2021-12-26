
const message = '123456';

const s = [ 7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22, 
            5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,
            4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,
            6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21 ];

const K = [ 0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee , 
            0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501 ,
            0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be ,
            0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821 ,
            0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa ,
            0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8 ,
            0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed ,
            0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a ,
            0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c ,
            0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70 ,
            0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05 ,
            0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665 ,
            0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039 ,
            0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1 ,
            0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1 ,
            0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391 ];

let a0 = 0x67452301;   // A
let b0 = 0xefcdab89;   // B
let c0 = 0x98badcfe;   // C
let d0 = 0x10325476;   // D

let messageInBits = [];

function characterToBinary(character) {
    return ("00000000" + character.charCodeAt(0).toString(2)).slice(-8).split('');
}

for(let i=0; i<message.length; i++) {
    let l = message[i];
    messageInBits.push( ...characterToBinary(l) );
}

messageInBits.push("1");

while(messageInBits.length % 512 !== 448) {
    messageInBits.push("0");
}

messageInBits.push (...("00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" + message.length.toString(2)).slice(-64).split(''));

function leftRotate(value, amount) {
    return (value << amount) | (value >>> (32 - amount));
}

console.log(messageInBits.join(""));


for(let i=0; i<messageInBits.length; i+=512) {
    let chunk = messageInBits.slice(i, i+512);
   
    let words = [];
    for(let j=0; j<chunk.length; j+=32) {
        words.push( chunk.slice(j, j+32).join("") );
    }   
    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;
    for(let j=0; j<64; j++) {
        let F, g;
        if(j<16) {
            F = (B & C) | ((!B) & D);
            g = j;
        }
        else if(j<32) {
            F = (D & B) | ((!D) & C);
            g = (5*j  + 1) % 16;
        } 
        else if (j<48) {
            F = B ^ C ^ D;
            g = (3*j + 5) % 16;
        }
        else if (j<64) {
            F = C ^ ( B | !D);
            g = (7*j) % 16;
        }
        debugger;
        F = F + A + K[j] + parseInt(words[g], 2);
        //let temp = D;
        A = D;
        D = C;
        C = B;
        B = B + leftRotate(F, s[j]);

        
    }
    a0 = a0 + A;
    b0 = b0 + B;
    c0 = c0 + C;
    d0 = d0 + D;
}
const final = (`${a0.toString(16)} ${b0.toString(16)} ${c0.toString(16)} ${d0.toString(16)}`);

document.write(final);

// e10adc3949   ba59abbe56   e057f20f88   3e