import fetch from 'node-fetch';
import * as readline from 'readline';

async function shortenUrl(url: string) {
  try {
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    if (response.ok) {
      const shortUrl = await response.text();
      console.log('Shortened URL:', shortUrl);
    } else {
      console.error('Error shortening URL:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

const url = process.argv[2];
if (url) {
  shortenUrl(url);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the URL to shorten: ', async (url: string) => {
    await shortenUrl(url);
    rl.close();
  });
}