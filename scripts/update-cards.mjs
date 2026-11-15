import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, '../assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// -------------------------------------------------------------
// 1. TYPING SVG GENERATION (Dark & Light)
// -------------------------------------------------------------
const quotes = [
  {
    en: "You are braver than you believe. – Christopher Robin",
    zh: "你比你想象的更勇敢。——克里斯托弗·罗宾"
  },
  {
    en: "Life is like a box of chocolates, you never know what you're gonna get.",
    zh: "生活就像一盒巧克力，你永远不知道下一颗是什么味道。——《阿甘正传》"
  },
  {
    en: "It is not our abilities that show what we truly are, it is our choices.",
    zh: "决定我们成为什么样的人，不是我们的能力，而是我们的选择。——《哈利·波特》"
  }
];

function generateTypingSvg(theme = 'dark') {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#ffffff' : '#0a0a0a';
  const subColor = isDark ? '#a1a1aa' : '#52525b';
  const width = 680;
  const height = 50;
  const dur = 7; // 7 seconds per quote

  let clipDefs = '';
  let contentGroups = '';

  quotes.forEach((q, i) => {
    const beginTrigger = i === 0 
      ? `0s; anim${quotes.length - 1}.end` 
      : `anim${i - 1}.end`;

    clipDefs += `
    <clipPath id="clip${i}">
      <rect x="0" y="0" width="0" height="${height}">
        <animate id="anim${i}" attributeName="width"
          begin="${beginTrigger}"
          dur="${dur}s"
          values="0; 680; 680; 0"
          keyTimes="0; 0.42; 0.88; 1"
          fill="remove" />
      </rect>
    </clipPath>`;

    contentGroups += `
    <g clip-path="url(#clip${i})">
      <text x="4" y="21" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="13" font-weight="700" fill="${textColor}">
        ${escapeXml(q.en)}
      </text>
      <text x="4" y="41" font-family="-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif" font-size="12" font-weight="500" fill="${subColor}">
        ${escapeXml(q.zh)}
      </text>
    </g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    ${clipDefs}
  </defs>
  <style>
    text { user-select: none; }
  </style>
  ${contentGroups}
</svg>`;
}

// -------------------------------------------------------------
// 2. JOKE CARDS GENERATION (Dark & Light)
// -------------------------------------------------------------
const jokeList = [
  {
    q: "Relationship status?",
    q_zh: "恋爱状态？",
    a: "I'll leave the relations to the database.",
    a_zh: "我会把关系（relations）留给数据库。"
  },
  {
    q: "How do you get the code for the bank vault?",
    q_zh: "怎么获取银行金库的密码？",
    a: "You checkout their branch.",
    a_zh: "你去检出（checkout）他们的分支（branch）。"
  },
  {
    q: "Why did the security conscious engineer refuse to pay their dinner bill?",
    q_zh: "为什么注重安全的工程师拒绝付晚餐账单？",
    a: "Because they could not verify the checksum.",
    a_zh: "因为他们无法验证校验和（checksum）。"
  }
];

function generateJokeSvg(joke, theme = 'dark') {
  const isDark = theme === 'dark';
  const width = 500;
  const height = 140;

  const borderColor = isDark ? '#27272a' : '#e4e4e7';
  const cardBg = isDark ? '#09090b' : '#ffffff';
  const qColor = isDark ? '#f4f4f5' : '#18181b';
  const aColor = isDark ? '#f4f4f5' : '#18181b';
  const zhColor = isDark ? '#a1a1aa' : '#71717a';
  const codeColor = isDark ? '#38bdf8' : '#0284c7';

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="12" fill="${cardBg}" stroke="${borderColor}" stroke-width="1.5"/>
  
  <g transform="translate(24, 28)">
    <!-- Question -->
    <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14" font-weight="700" fill="${qColor}">
      <tspan fill="${codeColor}">Q. </tspan>${escapeXml(joke.q)}
    </text>
    <text x="0" y="22" font-family="-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif" font-size="12" fill="${zhColor}">
      问：${escapeXml(joke.q_zh)}
    </text>

    <!-- Answer -->
    <text x="0" y="56" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14" font-weight="700" fill="${aColor}">
      <tspan fill="${codeColor}">A. </tspan>${escapeXml(joke.a)}
    </text>
    <text x="0" y="78" font-family="-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif" font-size="12" fill="${zhColor}">
      答：${escapeXml(joke.a_zh)}
    </text>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// 3. CRYPTO CARD GENERATION (Dark & Light)
// -------------------------------------------------------------
const COIN_CONFIG = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', color: '#14F195' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', color: '#F3BA2F' }
];

async function fetchCryptoPrices() {
  const defaultData = {
    bitcoin: { usd: 63857, usd_24h_change: -4.90 },
    ethereum: { usd: 1780.82, usd_24h_change: -6.14 },
    solana: { usd: 69.87, usd_24h_change: -7.14 },
    binancecoin: { usd: 586.12, usd_24h_change: -4.80 }
  };

  try {
    const ids = COIN_CONFIG.map(c => c.id).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' }, signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const json = await res.json();
      return json;
    }
  } catch (err) {
    console.warn('Using fallback crypto prices due to API limit/network:', err.message);
  }
  return defaultData;
}

function generateCryptoSvg(priceData, theme = 'dark') {
  const isDark = theme === 'dark';
  const cardWidth = 140;
  const cardHeight = 90;
  const gap = 12;
  const count = COIN_CONFIG.length;
  const totalWidth = count * cardWidth + (count - 1) * gap;
  const totalHeight = cardHeight;

  const cardBg = isDark ? '#09090b' : '#ffffff';
  const borderColor = isDark ? '#27272a' : '#e4e4e7';
  const textColor = isDark ? '#fafafa' : '#18181b';
  const nameColor = isDark ? '#71717a' : '#a1a1aa';
  const positiveColor = isDark ? '#22c55e' : '#16a34a';
  const negativeColor = isDark ? '#ef4444' : '#dc2626';

  const cardsSvg = COIN_CONFIG.map((coin, index) => {
    const x = index * (cardWidth + gap);
    const data = priceData[coin.id] || { usd: 0, usd_24h_change: 0 };
    const price = data.usd;
    const change = data.usd_24h_change;

    const formattedPrice = price >= 1
      ? `$${price.toLocaleString('en-US', { minimumFractionDigits: price > 10 ? 0 : 2, maximumFractionDigits: 2 })}`
      : `$${price.toFixed(4)}`;

    const isPositive = change >= 0;
    const changeColor = isPositive ? positiveColor : negativeColor;
    const arrowSymbol = isPositive ? '&#x2197; +' : '&#x2198; ';
    const changeText = change != null
      ? `${arrowSymbol}${Math.abs(change).toFixed(2)}%`
      : '-';

    return `
    <g transform="translate(${x}, 0)">
      <rect width="${cardWidth}" height="${cardHeight}" rx="12" fill="${cardBg}" stroke="${borderColor}" stroke-width="1.5"/>
      <!-- Header: Symbol & Name -->
      <text x="14" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="${coin.color}">
        ${coin.symbol}
      </text>
      <text x="126" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="${nameColor}" text-anchor="end">
        ${coin.name}
      </text>

      <!-- Price -->
      <text x="14" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700" fill="${textColor}">
        ${formattedPrice}
      </text>

      <!-- 24h Change badge -->
      <rect x="14" y="62" width="70" height="18" rx="9" fill="${changeColor}18"/>
      <text x="49" y="75" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="${changeColor}" text-anchor="middle">
        ${changeText}
      </text>
    </g>`;
  }).join('\n');

  return `<svg width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" xmlns="http://www.w3.org/2000/svg">
  ${cardsSvg}
</svg>`;
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// -------------------------------------------------------------
// MAIN EXECUTION
// -------------------------------------------------------------
async function main() {
  console.log('Generating local SVG cards for GitHub Profile...');

  // 1. Typing SVG
  fs.writeFileSync(path.join(assetsDir, 'typing-dark.svg'), generateTypingSvg('dark'), 'utf-8');
  fs.writeFileSync(path.join(assetsDir, 'typing-light.svg'), generateTypingSvg('light'), 'utf-8');
  fs.writeFileSync(path.join(assetsDir, 'typing.svg'), generateTypingSvg('dark'), 'utf-8');
  console.log('✅ Generated typing-dark.svg & typing-light.svg');

  // 2. Joke Cards
  const selectedJoke = jokeList[0];
  fs.writeFileSync(path.join(assetsDir, 'joke-dark.svg'), generateJokeSvg(selectedJoke, 'dark'), 'utf-8');
  fs.writeFileSync(path.join(assetsDir, 'joke-light.svg'), generateJokeSvg(selectedJoke, 'light'), 'utf-8');
  console.log('✅ Generated joke-dark.svg & joke-light.svg');

  // 3. Crypto Cards
  const priceData = await fetchCryptoPrices();
  fs.writeFileSync(path.join(assetsDir, 'crypto-dark.svg'), generateCryptoSvg(priceData, 'dark'), 'utf-8');
  fs.writeFileSync(path.join(assetsDir, 'crypto-light.svg'), generateCryptoSvg(priceData, 'light'), 'utf-8');
  console.log('✅ Generated crypto-dark.svg & crypto-light.svg');

  console.log('All profile SVG assets successfully updated in ./assets/');
}

main().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
