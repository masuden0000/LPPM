const fs = require('fs');
const https = require('https');
https.get('https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzA2MTQ3NmZhOTY3MjQzYmZiMjVmNGJiNzI2N2Q3YzE4EgsSBxD8vYyepRIYAZIBIwoKcHJvamVjdF9pZBIVQhM5NDE3MzU3MzAwMjA2OTg2MTE1&filename=&opi=89354086', res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => fs.writeFileSync('C:\\Users\\hudar\\Documents\\[1] Huda Rasyad Wicaksono\\[3] Project\\[1] Project Website\\LPPM\\stitch-checkout.html', body));
});
