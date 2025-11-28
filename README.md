# 🚀 OpenKanban

> **Gestión ágil de proyectos personales mediante tableros visuales.**

OpenKanban es una herramienta de productividad moderna y de código abierto diseñada para simplificar la **gestión de tareas**. Inspirada en soluciones como Trello y Wekan, esta aplicación ofrece una experiencia fluida para organizar flujos de trabajo mediante la **metodología Kanban**. El proyecto está estructurado como un **Monorepo**, combinando la robustez de PHP con la interactividad del frontend moderno.

## 🛡️ Licencia

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 👥 Integrantes del Equipo

Este proyecto fue desarrollado por:

* **Manuel Casique**
* **Geyser Velasquez**
* **Guillermo García**
* **Leonal Cazorla**

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, TypeScript.
- **Backend:** Laravel 12 (API Only), MySQL.
- **Arquitectura:** Monorepo (Frontend + Backend desacoplados).

---

## 🚀 Instalación y Despliegue

Para poner en marcha OpenKanban en tu entorno local, sigue estos pasos para la instalación manual:

### 1. Dependencias del Monorepo (Frontend y Backend)

El proyecto es un Monorepo. El siguiente comando debe ejecutarse **en la raíz del proyecto**. Este paso es crucial porque:

* **Frontend (Next.js):** Instala todas las dependencias de Node.js necesarias (React, Next.js, etc.).
* **Backend (Laravel):** Configura los *scripts* de compilación necesarios en el monorepo.

```bash
npm install
