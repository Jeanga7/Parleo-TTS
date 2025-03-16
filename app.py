from flask import Flask, render_template, request, jsonify, send_file
from gtts import gTTS
import os
import uuid
import time

app = Flask(__name__)

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
        text = request.form.get("text")
        voice = request.form.get("voice", "fr")
        speed = float(request.form.get("speed", 1))

        if not text.strip():
            return jsonify({"error": "Veuillez entrer un texte valide."}), 400
        
        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join(AUDIO_FOLDER, filename)

        tts = gTTS(text=text, lang=voice, slow=(speed < 1))
        tts.save(filepath)

        return jsonify({
            "audio_url": f"/{filepath}",
            "download_url": f"/download/{filename}"
        })

    return render_template("index.html")

@app.route("/download/<filename>")
def download_file(filename):
    filepath = os.path.join(AUDIO_FOLDER, filename)
    if os.path.exists(filepath):
        return send_file(filepath, as_attachment=True)
    return "Fichier introuvable", 404

if __name__ == "__main__":
    app.run(debug=True)