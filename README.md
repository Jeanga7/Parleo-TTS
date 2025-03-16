# 🗣️ Paléo-TTS - Convertisseur de texte en parole

Paléo-TTS est une application web qui transforme du texte en audio en utilisant **Google Text-to-Speech (gTTS)**. Cette application simple et efficace permet de générer des fichiers audio en plusieurs langues et de les écouter ou télécharger directement depuis l'interface web.

## 🚀 Fonctionnalités

- ✅ Conversion de texte en parole avec gTTS
- ✅ Prise en charge de plusieurs langues (Français, Anglais, Espagnol, etc.)
- ✅ Génération et téléchargement de fichiers audio `.mp3`
- ✅ Historique des fichiers générés
- ✅ Interface web responsive avec **React & TypeScript**
- ✅ API REST pour interagir avec le backend
- ✅ Nettoyage automatique des anciens fichiers audio

## 📂 Structure du projet

```
Paléo-TTS/
│── backend/               # Serveur Flask (Python)
│   ├── app.py            # API principale
│   ├── static/audio/     # Dossier des fichiers audio générés
│   ├── requirements.txt  # Dépendances Python
│
│── frontend/              # Interface utilisateur (React + TypeScript)
│   ├── src/
│   ├── public/
│   ├── package.json      # Dépendances npm
│
│── README.md              # Documentation
```

## 🛠️ Installation & Lancement

### 1️⃣ Prérequis
- **Python 3.x**
- **Node.js & npm**

### 2️⃣ Installation du Backend (Flask)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate
pip install -r requirements.txt
python app.py  # Lancer le serveur Flask
```

### 3️⃣ Installation du Frontend (React + TypeScript)
```bash
cd frontend
npm install  # Installer les dépendances
npm run dev  # Lancer l'application
```

## 🔗 API Endpoints

| Méthode | Endpoint         | Description |
|---------|----------------|-------------|
| `POST`  | `/`            | Générer un fichier audio |
| `GET`   | `/history`     | Récupérer l'historique |
| `GET`   | `/audio/<filename>` | Écouter un fichier généré |
| `GET`   | `/download/<filename>` | Télécharger un fichier |

Exemple de requête **POST** avec `curl` :
```bash
curl -X POST -F "text=Bonjour tout le monde" -F "voice=fr" -F "speed=1" http://127.0.0.1:5000/
```

## 📌 Améliorations Futures

- 🔹 Ajout d'un mode **Lecture instantanée**
- 🔹 Ajout d'une **PWA** pour une utilisation hors-ligne
- 🔹 Intégration avec **Telegram Bot** pour générer du TTS
- 🔹 Gestion avancée des voix (masculin, féminin)
- 🔹 Extension navigateur pour lire un texte sélectionné

---

💡 **Paléo-TTS** est un projet évolutif ! Contribuez ou suggérez des améliorations sur GitHub. 🚀

