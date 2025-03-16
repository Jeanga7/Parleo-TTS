import React, { useState } from 'react';
import { Volume2, Download, Loader2 } from 'lucide-react';

function App() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('fr');
  const [speed, setSpeed] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Données envoyées :", { text, voice, speed });

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ text, voice, speed }),
      });
      
      console.log("Statut de la réponse :", response.status);

      const data = await response.json();
      console.log("Réponse reçue :", data);
      
      if (data.audio_url) {
        setAudioUrl(data.audio_url);
        setDownloadUrl(data.download_url);
      } else {
        alert('Erreur : ' + (data.error || 'Impossible de générer l\'audio'));
      }
    } catch (error) {
      console.error('Erreur :', error);
      alert('Une erreur est survenue lors de la génération audio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Volume2 className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Paléo-TTS</h1>
          <p className="text-gray-600">Convertisseur Texte en Audio Intelligent</p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl"
        >
          <div className="mb-6">
            <label htmlFor="text" className="block text-gray-700 font-medium mb-2">
              Entrez votre texte
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Saisissez le texte à convertir..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="voice" className="block text-gray-700 font-medium mb-2">
                Voix
              </label>
              <select
                id="voice"
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="fr">Féminine</option>
              </select>
            </div>

            <div>
              <label htmlFor="speed" className="block text-gray-700 font-medium mb-2">
                Vitesse
              </label>
              <select
                id="speed"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="1">Normale</option>
                <option value="0.8">Rapide</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !text.trim()}
            className={`w-full py-3 px-6 rounded-lg font-medium text-white 
              ${isLoading || !text.trim() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'} 
              transition-colors duration-200 flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Génération en cours...
              </>
            ) : (
              'Générer l\'Audio'
            )}
          </button>
        </form>

        {audioUrl && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Audio généré</h3>
            <audio 
              controls 
              className="w-full mb-4"
              src={audioUrl}
            />
            {downloadUrl && (
              <a 
                href={downloadUrl}
                download
                className="inline-flex items-center justify-center w-full py-3 px-6 rounded-lg bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium transition-colors duration-200"
              >
                <Download className="mr-2" />
                Télécharger l'audio
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;