import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCRC32Table();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const combined = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(combined), 0);

  return Buffer.concat([lenBuf, combined, crcBuf]);
}

function generateIcon(size) {
  // RGBA buffer: each scanline starts with filter byte 0x00
  const rowSize = 1 + size * 4;
  const rawData = Buffer.alloc(rowSize * size);

  const center = size / 2;
  const radius = size * 0.44;

  for (let y = 0; y < size; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < size; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Distance from center
      const dx = x - center + 0.5;
      const dy = y - center + 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Cute warm pastel card background with rounded corners
      // Bounding box with rounded corners
      const cornerR = size * 0.22;
      const qx = Math.max(Math.abs(dx) - (center - cornerR - 1), 0);
      const qy = Math.max(Math.abs(dy) - (center - cornerR - 1), 0);
      const cornerDist = Math.sqrt(qx * qx + qy * qy);

      if (cornerDist <= cornerR) {
        // Inside rounded rectangle card
        // Pastel blush pink base (#FCE7F3: 252, 231, 243)
        let r = 252, g = 231, b = 243, a = 255;

        // Top washi-tape accent (y < size * 0.28, pastel mint #A7F3D0: 167, 243, 208)
        if (y >= size * 0.08 && y <= size * 0.26 && x >= size * 0.25 && x <= size * 0.75) {
          r = 167; g = 243; b = 208; a = 240;
        }

        // Little cute cat face / paw in center
        // Center pad circle
        const pawY = center + size * 0.08;
        const pawDist = Math.sqrt(dx * dx + (y - pawY) * (y - pawY));
        if (pawDist <= size * 0.18) {
          // Warm terracotta / berry pink (#F472B6)
          r = 244; g = 114; b = 182;
        }

        // Paw toe 1 (left)
        const toe1Dist = Math.sqrt((x - (center - size * 0.16)) ** 2 + (y - (center - size * 0.14)) ** 2);
        if (toe1Dist <= size * 0.07) {
          r = 244; g = 114; b = 182;
        }
        // Paw toe 2 (middle left)
        const toe2Dist = Math.sqrt((x - (center - size * 0.06)) ** 2 + (y - (center - size * 0.22)) ** 2);
        if (toe2Dist <= size * 0.075) {
          r = 244; g = 114; b = 182;
        }
        // Paw toe 3 (middle right)
        const toe3Dist = Math.sqrt((x - (center + size * 0.06)) ** 2 + (y - (center - size * 0.22)) ** 2);
        if (toe3Dist <= size * 0.075) {
          r = 244; g = 114; b = 182;
        }
        // Paw toe 4 (right)
        const toe4Dist = Math.sqrt((x - (center + size * 0.16)) ** 2 + (y - (center - size * 0.14)) ** 2);
        if (toe4Dist <= size * 0.07) {
          r = 244; g = 114; b = 182;
        }

        rawData[pxOffset] = r;
        rawData[pxOffset + 1] = g;
        rawData[pxOffset + 2] = b;
        rawData[pxOffset + 3] = a;
      } else {
        // Transparent outside card
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.resolve('public/icons');
fs.mkdirSync(iconsDir, { recursive: true });

for (const size of [16, 32, 48, 128]) {
  const png = generateIcon(size);
  const filePath = path.join(iconsDir, `icon-${size}.png`);
  fs.writeFileSync(filePath, png);
  console.log(`Generated ${filePath} (${png.length} bytes)`);
}
