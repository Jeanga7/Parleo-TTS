import React, { useEffect, useState } from "react";
import { Volume2, Download, Loader2 } from "lucide-react";

function App() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("fr");
  const [speed, setSpeed] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Fonction pour récupérer l'historique
  const fetchHistory = async (page = 1, limit = 5) => {
    try {
      const response = await fetch(`/history?page=${page}&limit=${limit}`);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      if (Array.isArray(data.history)) {
        setHistory(data.history);
        setTotalItems(data.total);
        setCurrentPage(data.page);
        setLimit(data.limit);
      } else {
        console.error("Réponse inattendue :", data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique :", error);
    }
  };

  useEffect(() => {
    fetchHistory(currentPage, limit);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("text", text);
      formData.append("voice", voice);
      formData.append("speed", speed);

      const response = await fetch("/api", {
        // Utilisez "/api" pour éviter les conflits avec les fichiers statiques
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      const data = await response.json();

      if (data.audio_url) {
        setAudioUrl(data.audio_url);
        setDownloadUrl(data.download_url);
        fetchHistory(); // Recharger l'historique après génération
      } else {
        alert("Erreur : " + (data.error || "Impossible de générer l'audio"));
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue lors de la génération audio");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Volume2 className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Parléo-TTS</h1>
          <p className="text-gray-600">
            Convertisseur Texte en Audio Intelligent
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl"
        >
          <div className="mb-6">
            <label
              htmlFor="text"
              className="block text-gray-700 font-medium mb-2"
            >
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
              <label
                htmlFor="voice"
                className="block text-gray-700 font-medium mb-2"
              >
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
              <label
                htmlFor="speed"
                className="block text-gray-700 font-medium mb-2"
              >
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
              ${
                isLoading || !text.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
              } 
              transition-colors duration-200 flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Génération en cours...
              </>
            ) : (
              "Générer l'Audio"
            )}
          </button>
        </form>

        {audioUrl && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Audio généré
            </h3>
            <audio controls className="w-full mb-4" src={audioUrl} />
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

        {/* Section pour afficher l'historique */}
        {history.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Historique des audios générés
            </h3>
            <ul className="space-y-4">
              {history.map((item, index) => (
                <li key={index} className="border-b pb-4">
                  <p className="text-gray-700">
                    <strong>Texte :</strong> {item.text}
                  </p>
                  <p className="text-gray-500 text-sm">
                    <strong>Date :</strong>{" "}
                    {new Date(item.time).toLocaleString()}
                  </p>
                  <audio
                    controls
                    className="w-full mt-2"
                    src={item.audio_url}
                  ></audio>
                  <a
                    href={item.download_url}
                    download
                    className="inline-block mt-2 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    Télécharger
                  </a>
                </li>
              ))}
            </ul>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => fetchHistory(currentPage - 1, limit)}
                disabled={currentPage === 1}
                className={`py-2 px-4 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white"
                }`}
              >
                Précédent
              </button>
              <span className="text-gray-700">
                Page {currentPage} sur {Math.ceil(totalItems / limit)}
              </span>
              <button
                onClick={() => fetchHistory(currentPage + 1, limit)}
                disabled={currentPage >= Math.ceil(totalItems / limit)}
                className={`py-2 px-4 rounded-lg ${
                  currentPage >= Math.ceil(totalItems / limit)
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white"
                }`}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
