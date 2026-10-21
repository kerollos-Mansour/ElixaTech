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
 * Only works on the client side.
 */
export async function transcribeAudio(
  audioBlob: Blob,
  filename: string = 'recording.wav'
): Promise<TranscriptionResponse> {
  // Safety check for client-side only
  if (typeof window === 'undefined') {
    return {
      success: false,
      error: 'Transcription is only available in the browser',
    };
  }

  const formData = new FormData();
  formData.append('audio', audioBlob, filename);

  try {
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
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
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during transcription',
    };
  }
}