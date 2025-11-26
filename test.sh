#!/data/data/com.termux/files/usr/bin/bash

clear

echo -e "
\033[38;5;51m██╗  ██╗ \033[38;5;82m█████╗ \033[38;5;200m███╗  ██╗\033[1;97m███████╗██╗  ██╗██╗
\033[38;5;51m██║ ██╔╝\033[38;5;82m██╔══██╗\033[38;5;200m████╗ ██║\033[1;97m██╔════╝██║ ██╔╝██║
\033[38;5;51m█████╔╝ \033[38;5;82m███████║\033[38;5;200m██╔██╗██║\033[1;97m█████╗  █████╔╝ ██║
\033[38;5;51m██╔═██╗ \033[38;5;82m██╔══██║\033[38;5;200m██║╚████║\033[1;97m██╔══╝  ██╔═██╗ ██║
\033[38;5;51m██║  ██╗\033[38;5;82m██║  ██║\033[38;5;200m██║ ╚███║\033[1;97m███████╗██║  ██╗██║
\033[0m

\033[38;5;201m             ★★  KANEKI BOT MD  X  SHADOW.XYZ  ★★\033[0m
"

echo ""
echo -e "\e[38;5;117mIniciando módulo gráfico...\e[0m"
sleep 0.4
echo -e "Cargando interfaz...\n"
sleep 0.4

menu() {
  echo -e "\e[38;5;117m¿Qué deseas hacer?\e[0m"
  echo -e "\e[38;5;51m1)\e[0m Instalar KanekiBot-AI"
  echo -e "\e[38;5;51m2)\e[0m Instalación rápida"
  echo -e "\e[38;5;51m5)\e[0m Salir\n"
}

progreso() {
  steps=40
  bar=""
  for i in $(seq 1 $steps); do
    bar="${bar}▰"
    echo -ne "\e[38;5;51mProcesando: \e[38;5;200m[$bar]\e[0m\r"
    sleep 0.05
  done
  echo ""
}

instalar() {
  clear
  echo -e "\e[38;5;117m⏳ Preparando entorno...\e[0m"
  apt update -y && apt upgrade -y
  pkg install -y git nodejs yarn ffmpeg imagemagick

  echo -e "\n\e[38;5;51m📥 Descargando KanekiBot-AI...\e[0m"
  progreso

  git clone https://github.com/shadox-xyz/KanekiBot-V3 && cd KanekiBot-V3 || exit

  echo -e "\e[38;5;117m📦 Instalando dependencias...\e[0m"
  yarn install || npm install

  echo -e "\e[32m🚀 Iniciando KanekiBot-AI...\e[0m"
  npm start
}

rapida() {
  clear
  echo -e "\e[38;5;200m⚡ Instalación rápida activada...\e[0m"
  progreso

  git clone https://github.com/shadox-xyz/KanekiBot-V3 quick-kaneki
  cd quick-kaneki || exit

  echo -e "\e[38;5;250mInstalando dependencias...\e[0m"
  npm install

  echo -e "\e[32m🔥 Iniciando bot inmediatamente...\e[0m"
  npm start
}

while true; do
  menu
  read -p "🌴 Elige una opción: " op
  case $op in
    1) instalar ;;
    2) rapida ;;
    5)
       echo -e "\e[31mSaliendo del instalador premium...\e[0m"
       exit
       ;;
    *) echo -e "\e[31mOpción no válida\e[0m";;
  esac
done