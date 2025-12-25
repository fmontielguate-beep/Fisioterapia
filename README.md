
# FisioSevilla Digital v2.5.2-EBP

Plataforma avanzada de e-rehabilitación clínica para fisioterapia, integrando **Gemini AI** para feedback biomecánico y gestión de Historias Clínicas Electrónicas (HCE).

## 🚀 Instalación Local

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/fisio-sevilla-digital.git
   cd fisio-sevilla-digital
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar API KEY**:
   Crea un archivo `.env` en la raíz y añade tu clave de [Google AI Studio](https://aistudio.google.com/):
   ```env
   VITE_GEMINI_API_KEY=tu_clave_aqui
   ```

4. **Ejecutar**:
   ```bash
   npm run dev
   ```

## 📤 Cómo subir cambios a GitHub

Si el sistema te pregunta qué cambios has hecho, sigue estos pasos en tu terminal:

1. **Preparar archivos**: 
   `git add .`
2. **Crear el punto de guardado (Commit)**: 
   `git commit -m "feat: resúmenes de evolución y versión v2.5.2"`
3. **Subir a la nube**: 
   `git push origin main`

> **Mensaje de Commit sugerido**: `feat: resúmenes de evolución y versión v2.5.2`

## 🛠️ Tecnologías
- **React 19** + TypeScript.
- **Tailwind CSS** para el diseño clínico.
- **Gemini API** (gemini-3-flash-preview) para el motor de razonamiento.
- **Lucide React** para iconografía médica.

## 🔒 Seguridad y Privacidad
- **RGPD Ready**: Consentimiento informado integrado.
- **Almacenamiento Local**: Los datos de los pacientes residen en el `localStorage` del navegador del profesional, no se envían a servidores externos (excepto los datos biométricos anónimos procesados por la IA en tiempo real).
- **Entorno Certificado**: Diseñado para cumplir con los estándares de seguridad de datos de salud en España.

---
*Desarrollado para la modernización de la fisioterapia en Sevilla.*
