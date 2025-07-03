# NestBackEnd

🚀 Tecnologías Utilizadas
🧠 Backend Framework
NestJS v11.0.1
Framework progresivo de Node.js para construir aplicaciones del lado del servidor escalables y eficientes. Utiliza TypeScript y está inspirado en Angular, proporcionando una arquitectura modular y decoradores para una mejor organización del código.

🧾 Lenguaje de Programación
TypeScript v5.7.3
Superset de JavaScript que añade tipado estático opcional, clases, interfaces y otras características de programación orientada a objetos. Configurado para ES2023 con decoradores experimentales habilitados.

🗃️ Base de Datos
PostgreSQL
Sistema de gestión de bases de datos relacional orientado a objetos y de código abierto.

TypeORM v0.3.25
ORM para TypeScript/JavaScript que facilita la interacción con la base de datos mediante entidades y decoradores.

🔐 Autenticación y Seguridad
JWT (JSON Web Tokens) v9.0.2
Estándar para crear tokens de acceso que permiten la autenticación segura entre aplicaciones.

Argon2 v0.43.0
Algoritmo de hash de contraseñas moderno y seguro.

cookie-parser v1.4.7
Middleware para parsear cookies HTTP en el servidor.

🔄 Validación y Transformación de Datos
class-validator v0.14.2
Biblioteca para validación de objetos basada en decoradores.

class-transformer v0.5.1
Biblioteca para transformar objetos planos a instancias de clase y viceversa.

📚 Documentación de API
Swagger/OpenAPI v11.2.0
Herramienta para documentar APIs RESTful de manera interactiva.

swagger-ui-express v5.0.1
Interfaz web para visualizar y probar la documentación de Swagger.

⚙️ Configuración y Variables de Entorno
@nestjs/config v4.0.2
Módulo de configuración de NestJS para manejar variables de entorno y archivos .env.

🛠️ Herramientas de Desarrollo
ESLint v9.18.0
Linter para identificar y corregir problemas en el código JavaScript/TypeScript.

Prettier v3.4.2
Formateador de código para mantener un estilo consistente.

Jest v29.7.0
Framework de testing para JavaScript con soporte para TypeScript.

SWC
Compilador rápido de TypeScript/JavaScript escrito en Rust.

🧱 Arquitectura del Proyecto
El proyecto sigue una arquitectura modular de NestJS con los siguientes módulos:

AuthModule – Manejo de autenticación y autorización

UserModule – Gestión de usuarios

RoleModule – Sistema de roles y permisos

BusinessModule – Lógica de negocio específica

⚙️ Características Técnicas
✅ Decoradores y Metadata – Uso extensivo de decoradores para definir rutas, validaciones y metadatos.

✅ Inyección de Dependencias – Sistema nativo de NestJS para gestión de dependencias.

✅ Pipes de Validación – Validación automática de datos de entrada.

✅ Guards – Protección de rutas basada en roles y permisos.

✅ DTOs (Data Transfer Objects) – Objetos para transferencia de datos con validación.

🧪 Scripts Disponibles
npm run start:dev     # Desarrollo con hot reload.
npm run build         # Compilación para producción.
npm run test          # Ejecución de tests unitarios.
npm run test:e2e      # Tests end-to-end.
npm run lint          # Análisis de código con ESLint.
npm run format        # Formateo de código con Prettier.
Esta stack tecnológica proporciona una base sólida para construir APIs RESTful escalables, seguras y bien documentadas, con un enfoque en la calidad del código y las mejores prácticas de desarrollo.
