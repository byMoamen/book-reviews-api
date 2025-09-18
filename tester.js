const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:5001';
const cookieJarPath = path.join('/tmp', 'express_test_cookies.json');

// helper to persist cookies between requests (simple)
let cookie = '';
function saveCookieFromResp(resp) {
  const setCookie = resp.headers && resp.headers['set-cookie'];
  if (setCookie && setCookie.length) cookie = setCookie.join(';');
}
function authHeaders() {
  return cookie ? { Cookie: cookie } : {};
}

async function task10_getAllBooks() {
  console.log('\n=== Task10: Get all books (async/await with axios) ===');
  const resp = await axios.get(`${BASE}/`);
  console.log(resp.data);
}

function task11_getByIsbn(isbn) {
  console.log('\n=== Task11: Get book by ISBN (Promises with axios) ===');
  return axios.get(`${BASE}/isbn/${isbn}`)
    .then(r => console.log(r.data))
    .catch(e => console.error('ISBN error', e.response && e.response.data));
}

async function task12_getByAuthor(author) {
  console.log('\n=== Task12: Get by author (async/await) ===');
  const resp = await axios.get(`${BASE}/author/${encodeURIComponent(author)}`);
  console.log(resp.data);
}

function task13_getByTitle(title) {
  console.log('\n=== Task13: Get by title (Promises) ===');
  return axios.get(`${BASE}/title/${encodeURIComponent(title)}`)
    .then(r => console.log(r.data))
    .catch(e => console.error('Title error', e.response && e.response.data));
}

async function runRegisteredFlow() {
  console.log('\n=== Registered user flow ===');
  // register
  try {
    const reg = await axios.post(`${BASE}/register`, { username: 'tester', password: 'pass' });
    console.log('register:', reg.data);
  } catch (e) {
    console.log('register error:', e.response && e.response.data);
  }
  // login (capture cookie)
  try {
    const login = await axios.post(`${BASE}/customer/login`, { username: 'tester', password: 'pass' }, { maxRedirects: 0 });
    saveCookieFromResp(login);
    console.log('login:', login.data);
  } catch (e) {
    if (e.response) {
      saveCookieFromResp(e.response);
      console.log('login response:', e.response.data);
    } else console.error(e.message);
  }
  // add review
  try {
    const add = await axios.put(`${BASE}/customer/auth/review/1`, { review: 'tester review' }, { headers: authHeaders() });
    console.log('add review:', add.data);
  } catch (e) {
    console.log('add error:', e.response && e.response.data);
  }
  // modify review
  try {
    const mod = await axios.put(`${BASE}/customer/auth/review/1`, { review: 'modified review' }, { headers: authHeaders() });
    console.log('modify review:', mod.data);
  } catch (e) {
    console.log('modify error:', e.response && e.response.data);
  }
  // delete review
  try {
    const del = await axios.delete(`${BASE}/customer/auth/review/1`, { headers: authHeaders() });
    console.log('delete review:', del.data);
  } catch (e) {
    console.log('delete error:', e.response && e.response.data);
  }
}

async function main() {
  try {
    await task10_getAllBooks();
    await task11_getByIsbn(1);
    await task12_getByAuthor('Chinua Achebe');
    await task13_getByTitle('Things Fall Apart');
    await runRegisteredFlow();
  } catch (err) {
    console.error('Test runner error:', err.message);
  }
}

main();
