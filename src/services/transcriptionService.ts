/**
 * Interface for transcription response
 */
export interface TranscriptionResponse {
  success: boolean;
  text?: string;
  error?: string;
}

/**
 * Sends a recorded audio Blob to the backend transcription API.
 *
 * The browser calls /api/transcribe (same origin).
 * Next.js rewrites/proxies that to http://localhost:3000/api/transcribe (Fastify).
 *
 * IMPORTANT: Do NOT set Content-Type manually — the browser sets the correct
 * multipart boundary automatically when using FormData.
 */
export async function transcribeAudio(
  audioBlob: Blob,
  filename: string = 'recording.wav'
): Promise<TranscriptionResponse> {
  const formData = new FormData();
  formData.append('audio', audioBlob, filename);

  try {
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
      // DO NOT set Content-Type header — browser handles multipart boundary
    });

    if (!response.ok) {
      let errorMessage = `Server error: HTTP ${response.status}`;
      try {
        const body: TranscriptionResponse = await response.json();
        if (body.error) errorMessage = body.error;
      } catch {
        // Ignore parse errors
      }
      throw new Error(errorMessage);
    }

    const data: TranscriptionResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}