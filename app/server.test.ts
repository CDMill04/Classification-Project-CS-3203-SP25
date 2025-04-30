// __tests__/server.test.ts
import axios from 'axios';

describe('Local website availability test', () => {
  it('should respond with status 200', async () => {
    const response = await axios.get('http://localhost:3000');
    expect(response.status).toBe(200);
  },15000);
});
