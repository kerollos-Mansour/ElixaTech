import VoiceRecorder from '@/components/VoiceRecorder';

export default function VoiceToTextPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
            Voice to Text
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Convert your voice into text using advanced speech recognition technology.
          </p>
        </div>
        
        <VoiceRecorder />
      </div>
    </div>
  );
}