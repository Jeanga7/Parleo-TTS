from flask import Flask, request, jsonify, send_file, send_from_directory
from gtts import gTTS
import os
import uuid
import time
from flask_cors import CORS

app = Flask(__name__, static_folder="frontend/dist", static_url_path="/static")
CORS(app)

AUDIO_FOLDER = "static/audio"
os.makedirs(AUDIO_FOLDER, exist_ok=True)

def cleanup_old_files():
    """Supprime les fichiers audio de plus de 10 minutes."""
    now = time.time()
    for filename in os.listdir(AUDIO_FOLDER):
        filepath = os.path.join(AUDIO_FOLDER, filename)
        if os.path.isfile(filepath) and filename.endswith(".mp3"):
            file_age = now - os.path.getmtime(filepath)
            if file_age > 600:  # 600 secondes = 10 minutes
                os.remove(filepath)

@app.route("/", methods=["GET", "POST"])
def index():
    cleanup_old_files()

    if request.method == "POST":
        try:
            text = request.form.get("text")
            voice = request.form.get("voice", "fr")
            speed = float(request.form.get("speed", 1))

            if not text or not text.strip():
                return jsonify({"error": "Veuillez entrer un texte valide."}), 400

            filename = f"{uuid.uuid4()}.mp3"
            filepath = os.path.join(AUDIO_FOLDER, filename)

            tts = gTTS(text=text, lang=voice, slow=(speed < 1))
            tts.save(filepath)

            return jsonify({
                "audio_url": f"http://127.0.0.1:5000/audio/{filename}",  # URL pour l'écoute en ligne
                "download_url": f"http://127.0.0.1:5000/download/{filename}"  # URL pour le téléchargement
            })

        except Exception as e:
            # Log de l'erreur
            print(f"Erreur lors de la génération audio : {e}")
            return jsonify({"error": "Une erreur est survenue lors de la génération audio"}), 500

    return send_from_directory(app.static_folder, "index.html")

@app.route("/download/<filename>")
def download_file(filename):
    filepath = os.path.join(AUDIO_FOLDER, filename)
    if os.path.exists(filepath):
        return send_file(filepath, as_attachment=True)
    return "Fichier introuvable", 404

@app.route("/audio/<filename>")
def serve_audio(filename):
    filepath = os.path.join(AUDIO_FOLDER, filename)
    if os.path.exists(filepath):
        return send_file(filepath, mimetype="audio/mpeg")
    return "Fichier introuvable", 404


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(app.static_folder, path)

if __name__ == "__main__":
    app.run(debug=True)