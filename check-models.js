const { GoogleGenerativeAI } = require('@google/genai'); // Oh wait, it's not the right SDK maybe
// let's just fetch directly

async function run() {
  const apiKey = 'AIzaSyBo7F_r0QgPJN22Hb4tnvoy3qCyseMhB6s';
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data.models.map(m => m.name));
}
run();
