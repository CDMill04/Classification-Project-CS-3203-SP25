import { POST } from '@/app/api/send-email/route';

describe('Basic Email Route Test', () => {
  it('calls POST and logs success response', async () => {
    const mockRequest = {
      json: async () => ({
        userEmail: 'test@example.com',
        subject: 'Test Subject',
        text: 'This is a test email',
      }),
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    console.log('✅ POST success response:', data);
  });

  it('handles missing userEmail gracefully', async () => {
    const mockRequest = {
      json: async () => ({
        subject: 'Missing email test',
        text: 'This should fail',
      }),
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    console.log('🚨 Missing userEmail test result:', data);
  });
});
