const http = require('http');

async function req(path, method, body, token) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api' + path,
      method: method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (token) options.headers['Authorization'] = 'Bearer ' + token;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data || '{}') }));
    });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log("4. Registering a test admin...");
  let adminRes = await req('/users/register', 'POST', { name: "Admin Test", email: "admin2@test.com", password: "password", role: "admin" });
  console.log("Admin registered", adminRes.status);
  
  console.log("Registering a test staff...");
  let staffRes = await req('/users/register', 'POST', { name: "Staff Test", email: "staff2@test.com", password: "password", role: "staff" });
  console.log("Staff registered", staffRes.status);
  
  console.log("5. Login with correct credentials (admin)...");
  let loginRes = await req('/users/login', 'POST', { email: "admin2@test.com", password: "password" });
  console.log("Login Admin", loginRes.status, !!loginRes.body.token);
  let adminToken = loginRes.body.token;

  let staffLogin = await req('/users/login', 'POST', { email: "staff2@test.com", password: "password" });
  let staffToken = staffLogin.body.token;

  console.log("6. Login with wrong password...");
  let badLogin = await req('/users/login', 'POST', { email: "admin2@test.com", password: "wrong" });
  console.log("Bad Login", badLogin.status);

  console.log("7. GET /api/users/me with valid JWT...");
  let meRes = await req('/users/me', 'GET', null, adminToken);
  console.log("Me Valid", meRes.status, meRes.body.data.email);

  console.log("8. GET /api/users/me without JWT...");
  let meNoJwt = await req('/users/me', 'GET', null);
  console.log("Me No JWT", meNoJwt.status);

  console.log("9. Invalid JWT...");
  let invalidJwt = await req('/users/me', 'GET', null, "invalid_token_string");
  console.log("Invalid JWT", invalidJwt.status);

  console.log("10. Admin can access admin-only endpoints...");
  let adminUsers = await req('/users', 'GET', null, adminToken);
  console.log("Admin /users", adminUsers.status);

  console.log("11. Staff receives 403 for admin-only endpoints...");
  let staffUsers = await req('/users', 'GET', null, staffToken);
  console.log("Staff /users", staffUsers.status);

  console.log("12. Existing CRUD APIs still work with auth...");
  let adminMembers = await req('/members', 'GET', null, adminToken);
  console.log("Admin /members", adminMembers.status);
}

run();
