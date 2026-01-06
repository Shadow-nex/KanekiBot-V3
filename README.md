<p align="center">
  <img src="https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1767704977299_946356.jpeg" width="600"/>
</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&size=32&duration=3000&pause=800&color=FF69B4&center=true&vCenter=true&width=900&lines=ꕥ+Bienvenido/a!+,+soy+Yuzuki+Bot+-+AI" alt="YuzukiBot-AI"/>
</p>

<p align="center">
  <a href="https://whatsapp.com/channel/0029VbC34Nt42DchIWA0q11f" target="_blank">
    <img
      src="https://img.shields.io/badge/Canal%20WhatsApp-0FA958?style=for-the-badge&logo=whatsapp&logoColor=white"
      alt="Canal WhatsApp"
    />
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/shadox-xyz" target="_blank">
    <img
      src="https://img.shields.io/badge/GitHub-111111?style=for-the-badge&logo=github&logoColor=white"
      alt="GitHub"
    />
  </a>
</p>

### *`❕️ Información importante`*
Este proyecto **no está afiliado de ninguna manera** con `WhatsApp`, `Inc. WhatsApp` es una marca registrada de `WhatsApp LLC`, y este bot es un **desarrollo independiente** que **no tiene ninguna relación oficial con la compañía**.

<details>
<summary><b> 🌱 Descripción</b></summary>

> Yuzuki Bot es un bot de WhatsApp multifuncional basado en `baileys`. Este bot ofrece una variedad de características para mejorar tu experiencia en WhatsApp.

### (๑•ᴗ•๑)♡ Características
◌ Configuración avanzada de grupos 
◌ Bienvenidas personalizadas  
◌ Herramientas útiles  
◌ Juegos RPG (Gacha y Economía)  
◌ Funciones de Inteligencia Artificial  
◌ Descargas y búsquedas multi-plataforma  
◌ Sub-Bots (JadiBot)  
◌ Extensiones adicionales
</details>

---
<summary><b>

### **`✧ Click en la imagen para descargar termux ✧`**
<a
href="https://www.mediafire.com/file/wkinzgpb0tdx5qh/com.termux_1022.apk/file"><img src="https://qu.ax/finc.jpg" height="125px"></a> 

### **`🦊 Instalación por termux`**
<details>
<summary><b>✰ Instalación Manual</b></summary>

> *Comandos para instalar de forma manual*
```bash
termux-setup-storage
```
```bash
apt update && apt upgrade && pkg install -y git nodejs ffmpeg imagemagick yarn
```
```bash
git clone https://github.com/shadox-xyz/YuzukiBot-MD && cd YuzukiBot-MD
```
```bash
yarn install
```
```bash
npm install
```
```bash
npm start
```
> *Si aparece **(Y/I/N/O/D/Z) [default=N] ?** use la letra **"y"** y luego **"ENTER"** para continuar con la instalación.*
</details>

<details>
  <summary><b> Comandos para mantener más tiempo activo el Bot</b></summary>

> *Ejecutar estos comandos dentro de la carpeta YuzukiBot-MD*
```bash
termux-wake-lock && npm i -g pm2 && pm2 start index.js && pm2 save && pm2 logs 
``` 
#### Opciones Disponibles
> *Esto eliminará todo el historial que hayas establecido con PM2:*
```bash 
pm2 delete index
``` 
> *Si tienes cerrado Termux y quiere ver de nuevo la ejecución use:*
```bash 
pm2 logs 
``` 
> *Si desea detener la ejecución de Termux use:*
```bash 
pm2 stop index
``` 
> *Si desea iniciar de nuevo la ejecución de Termux use:*
```bash 
pm2 start index
```
---- 
### En caso de detenerse
> _Si despues que ya instalastes el bot y termux te salta en blanco, se fue tu internet o reiniciaste tu celular, solo realizaras estos pasos:_
```bash
cd && cd YuzukiBot-MD && npm start
```

---

### Obtener nuevo código QR 
> *Detén el bot, haz click en el símbolo (ctrl) [default=z] usar la letra "z" + "ENTER" hasta que salga algo verdes similar a: `YuzukiBot-MD $`*
> **Escribe los siguientes comandos uno x uno :**
```bash 
cd && cd YuzukiBot-MD && rm -rf sessions/Principal && npm run qr
```
----
### Obtener nuevo código de teléfono 
```bash 
cd && cd YuzukiBot-MD && rm -rf sessions/Principal && npm run code
```
</details>

<details>
<summary><b> Actualizar YuzukiBot-MD</b></summary>

**Comandos para actualizar YuzukiBot-MD de forma automática**

```bash
grep -q 'bash\|wget' <(dpkg -l) || apt install -y bash wget && wget -O - https://raw.githubusercontent.com/shadox-xyz/YuzukiBot-MD/main/termux.sh | bash 
```
** Volverte owner del Bot**

*Si después de instalar el bot e iniciar la sesión (deseas poner tu número es la lista de owner pon este comando:*

```bash
cd && cd YuzukiBot-MD && nano settings.js
```
#### Para que no pierda su progreso en Yuzuki-Bot, estos comandos realizarán un respaldo de su `database.json` y se agregará a la versión más reciente.
> *Estos comandos solo funcionan para TERMUX, REPLIT, LINUX*
</details>
</b></summary>