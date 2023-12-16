const chai = require('chai');


const User = require('../../models/user');
const { createRequest } = require('node-mocks-http');
const { createResponse } = require('node-mocks-http');
const { getCurrentUser } = require('../../auth/auth');

const encodeCredentials = (username, password) =>
  Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');

const getRequest = headers => createRequest({ headers });

const {
  acceptsJson,
  getCredentials,
  isJson
} = require('../../utils/requestUtils');
const responseUtils = require('../../utils/responseUtils');

const getHeaders = () => {
  return {
    authorization: `Basic ${adminCredentials}`,
    accept:
      'text/html,application/xhtml+xml,application/json,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'content-type': 'application/json'
  };
};

const payload = { a: 1, b: 2, c: 3 };

const expect = chai.expect;

// Get users (create copies for test isolation)
const users = require('../../setup/users.json').map(user => ({ ...user }));
const adminUser = { ...users.find(u => u.role === 'admin') };
const adminCredentials = encodeCredentials(adminUser.email, adminUser.password);

const admin = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  password: 'adminPassword',
};

// helper function for creating randomized test data
const generateRandomString = (len = 9) => {
  let str = '';

  do {
    str += Math.random()
      .toString(36)
      .substr(2, 9)
      .trim();
  } while (str.length < len);

  return str.substr(0, len);
};

const createTestString = (strLength = 9, character = 'a') => {
  return new Array(strLength + 1).join(character);
};

// get randomized test data
const getTestData = () => {
  return {
    name: generateRandomString(),
    email: `${generateRandomString()}@email.com`,
    password: generateRandomString(10),
    role: 'admin'
  };
};

describe('Schema validation', () => {
  
    it('must define "name"', () => {
      const data = getTestData();
      delete data.name;
    });
  });
  
   
   describe('User name Validation', ()=> {
    it('must require "name" to be at least one character long', () => {
      const data = getTestData();
      data.name = '';

      const user = new User(data);
      const error = user.validateSync();
      expect(error).to.exist;
    });

  });

   

  describe('User role Validation', () => {
    it('must set default value of "role" to customer', () => {
      const data = getTestData();
      delete data.role;

      const user = new User(data);
      expect(user.role).to.equal('customer');
    });

  });

describe('Validation of data', () => {
  it('should fail validation with invalid data', async () => {
    const userData = {
      name: '',
      email: 'invalid-email',
      password: 'short',
      role: 'invalid_role',
    };

    const user = new User(userData);
    let error;

    try {
      await user.save();
    } catch (err) {
      error = err;
    }

    expect(error).to.exist;
    expect(error.errors).to.have.property('name');
    expect(error.errors).to.have.property('email');
    expect(error.errors).to.have.property('password');
    expect(error.errors).to.have.property('role');
  });
});

describe('Detection of password', () => {
  it('must detect correct "password"', async () => {
    const data = getTestData();
    const user = new User(data);
    const isPasswordCorrect = await user.checkPassword(data.password);
    expect(isPasswordCorrect).to.be.true;
  });

});

describe('Detection of false password', () => {
  it('must detect a false "password"', async () => {
    const data = getTestData();
    const user = new User(data);
    const isPasswordCorrect = await user.checkPassword(generateRandomString());
    expect(isPasswordCorrect).to.be.false;
  });
});



describe('Header Checking', () => {
  it('should return false when "Content-Type" header is missing', () => {
    const headers = getHeaders();
    delete headers['content-type'];
    expect(isJson(getRequest(headers))).to.be.false;
  });

});

describe('Checking header includings', () => {
it('should return false when "Accept" header does not include "application/json" or "*/*"', () => {
  const headers = getHeaders();
  headers.accept = headers.accept
    .split(',')
    .filter(
      header =>
        !header.includes('application/json') && !header.includes('*/*')
    )
    .join(',');

  expect(acceptsJson(getRequest(headers))).to.be.false;
});
});

describe('Checking response Status', () => {
it('should set response status to 200 by default', () => {
  const response = createResponse();
  responseUtils.sendJson(response, payload);
  expect(response.statusCode).to.equal(200);
});
});

describe('Server Error checking', () => {
  it('should set response status to 500', () => {
    const response = createResponse();
    responseUtils.internalServerError(response);
    expect(response.statusCode).to.equal(500);
  });
});