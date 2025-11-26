#!/data/data/com.termux/files/usr/bin/bash

C1='\e[38;5;51m'      # Cyan brillante
C2='\e[38;5;117m'     # Azul claro
C3='\e[38;5;250m'     # Gris claro
C4='\e[38;5;200m'     # Rosa fuerte
C5='\e[38;5;214m'     # Naranja
OK='\e[32m'           # Verde
R='\e[31m'            # Rojo
RESET='\e[0m'

clear

echo -e "${C4}"
echo "╔════════════════════════════════════════════════════════════════════════╗"
echo -e "║   ${C5}██╗░░██╗███╗░░██╗███████╗██╗░░██╗██╗██████╗░░█████╗░████████╗${C4}       ║"
echo -e "║   ${C5}██║░██╔╝████╗░██║██╔════╝██║░██╔╝██║██╔══██╗██╔══██╗╚══██╔══╝${C4}       ║"
echo -e "║   ${C5}█████═╝░██╔██╗██║█████╗░░█████═╝░██║██║░░██║███████║░░░██║░░░${C4}       ║"
echo -e "║   ${C5}██╔═██╗░██║╚████║██╔══╝░░██╔═██╗░██║██║░░██║██╔══██║░░░██║░░░${C4}       ║"
echo -e "║   ${C5}██║░╚██╗██║░╚███║███████╗██║░╚██╗██║██████╔╝██║░░██║░░░██║░░░${C4}       ║"
echo -e "║   ${C5}╚═╝░░╚═╝╚═╝░░╚══╝╚══════╝╚═╝░░╚═╝╚═╝╚═════╝░╚═╝░░╚═╝░░░╚═╝░░░${C4}       ║"
echo "║                                                                          ║"
echo -e "║                ✦ ${C1}KANEKIBOT–AI INSTALADOR PREMIUM${C4} ✦                           ║"
echo -e "║                 ${C3}Modo: Shadow.xyz  🍃  |  Termux Ready${C4}                         ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo -e "${RESET}"

sleep 0.6

echo -e "${C3}Inicializando módulo gráfico..."
sleep 0.4
echo -e "Cargando interfaz...\n${RESET}"
sleep 0.4

menu() {
  echo -e "${C2}¿Qué deseas hacer?${RESET}"
  echo -e "${C1}1)${RESET} Instalar KanekiBot-AI"
  echo -e "${C1}2)${RESET} Instalación rápida (git clone + install + start)"
  echo -e "${C1}5)${RESET} Salir\n"
}

progreso() {
  steps=40
  bar=""
  for i in $(seq 1 $steps); do
    bar="${bar}▰"
    echo -ne "${C1}Procesando: ${C5}[$bar]${RESET}\r"
    sleep 0.05
  done
  echo ""
}

instalar() {
  clear
  echo -e "${C2}⏳ Preparando entorno...${RESET}"
  apt update -y && apt upgrade -y
  pkg install -y git nodejs yarn ffmpeg imagemagick

  echo -e "\n${C1}📥 Descargando KanekiBot-AI...${RESET}"
  progreso

  git clone https://github.com/shadox-xyz/KanekiBot-V3 && cd KanekiBot-V3 || exit
  echo -e "${C2}📦 Instalando dependencias...${RESET}"
  yarn install || npm install

  echo -e "${OK}🚀 Iniciando KanekiBot-AI...${RESET}"
  npm start
}

rapida() {
  clear
  echo -e "${C5}⚡ Instalación rápida activada...${RESET}"
  progreso

  git clone https://github.com/shadox-xyz/KanekiBot-V3 quick-kaneki
  cd quick-kaneki || exit

  echo -e "${C3}Instalando dependencias...${RESET}"
  npm install

  echo -e "${OK}🔥 Iniciando bot inmediatamente...${RESET}"
  npm start
}


while true; do
  menu
  read -p "👉 Elige una opción: " op
  case $op in
    1) instalar bot ;;
    2) instalación rapida ;;
    5) 
       echo -e "${R}Saliendo del instalador premium...${RESET}"
       exit 
       ;;
    *) echo -e "${R}❌ Opción no válida${RESET}";;
  esac
done