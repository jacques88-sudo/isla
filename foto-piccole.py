# Le copie piccole delle foto, in assets/piccole/.
#
# Le schede dell'elenco, le copertine della home, le miniature della galleria
# e le "altre esperienze" mostrano le foto larghe al massimo 350 px: scaricare
# la foto intera (1200 px, a volte 1920) lì è solo peso. Per questo ogni foto
# di assets/ ha una copia larga al massimo 720 px, con lo stesso nome, in
# assets/piccole/. 720 basta anche sui telefoni con lo schermo più fitto.
#
# Si lancia dopo aver messo una foto nuova in assets/ (serve Pillow):
#
#     python3 foto-piccole.py
#
# Rifà solo le copie che mancano o che sono più vecchie della foto. Non tocca
# icone, logo, anteprima per WhatsApp, video e le cartelle mappa/ e schermate/.
# controlla.js dà errore se una foto non ha la sua copia.
# Il sito non carica questo file.

import os
import shutil
from PIL import Image

LARGHEZZA = 720
CARTELLA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")
PICCOLE = os.path.join(CARTELLA, "piccole")
SALTATE = {"anteprima.jpg", "logo-isla.png"}

os.makedirs(PICCOLE, exist_ok=True)
fatte = 0
for nome in sorted(os.listdir(CARTELLA)):
    sorgente = os.path.join(CARTELLA, nome)
    copia = os.path.join(PICCOLE, nome)
    if not os.path.isfile(sorgente) or nome in SALTATE or nome.startswith("icon-"):
        continue
    if not nome.lower().endswith((".webp", ".jpg", ".jpeg")):
        continue
    if os.path.exists(copia) and os.path.getmtime(copia) >= os.path.getmtime(sorgente):
        continue
    foto = Image.open(sorgente)
    if foto.width <= LARGHEZZA:
        # già piccola: si copia com'è, ricomprimerla la peggiorerebbe e basta
        shutil.copy2(sorgente, copia)
        fatte += 1
        continue
    profilo = foto.info.get("icc_profile")
    foto = foto.resize((LARGHEZZA, round(foto.height * LARGHEZZA / foto.width)), Image.LANCZOS)
    extra = {"icc_profile": profilo} if profilo else {}
    if nome.lower().endswith(".webp"):
        foto.save(copia, "WEBP", quality=78, method=6, **extra)
    else:
        foto.convert("RGB").save(copia, "JPEG", quality=82, optimize=True, progressive=True, **extra)
    fatte += 1
    print(f"  {nome}: {os.path.getsize(sorgente) // 1024} -> {os.path.getsize(copia) // 1024} KB")

print(f"{fatte} copie fatte")
