import { generateTaskSummary } from '../lib/gemini';
import { vi } from 'vitest';

// Mock the Gemini SDK
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockReturnValue({
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: () => "Mocked AI Summary."
          }
        })
      })
    }))
  };
});

describe('Gemini API Integration', () => {
  it('generates a summary successfully', async () => {
    const summary = await generateTaskSummary('Test Title', 'Test Description');
    expect(summary).toBe('Mocked AI Summary.');
  });
});
