# PatientCare API

![PatientCare Logo](./public/icon.png)

**PatientCare API** es una API RESTful construida con Node.js y Express que permite a los médicos gestionar sus pacientes, citas y consultas de manera eficiente. Esta API proporciona endpoints para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en los registros de pacientes, citas y consultas.

## Características

### 1. **Gestión de Pacientes**

- Crear, leer, actualizar y eliminar registros de pacientes.
- Almacenar información importante sobre los pacientes, como datos de contacto y antecedentes médicos.

### 2. **Gestión de Citas**

- Programar y gestionar citas entre médicos y pacientes.
- Enviar recordatorios de citas a los pacientes.

### 3. **Registro de Consultas**

- Registrar consultas realizadas durante las citas.
- Mantener un historial de salud de los pacientes.

### 4. **Autenticación y Autorización**

- Implementación de autenticación mediante JWT (JSON Web Tokens) para asegurar que solo los médicos autorizados puedan acceder a la información.

## Tecnologías Usadas

- **Backend**: Node.js con Express
- **Base de Datos**: MongoDB (usando Mongoose)
- **Autenticación**: JSON Web Tokens (JWT)

## Cómo Funciona

1. **Autenticación**: Los médicos deben autenticarse para obtener un token de acceso.
2. **Operaciones CRUD**: Utilizar los endpoints para realizar operaciones en pacientes, citas y consultas.
3. **Respuestas**: La API devuelve respuestas en formato JSON, proporcionando detalles sobre el éxito o el error de cada operación.

## Cómo Comenzar

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tuusuario/patientcare-api.git
   cd patientcare-api
   ```

## Contact

Para cualquier consulta, no dude en ponerse en contacto conmigo en [alanbusinessnin@gmail.com](alanbusinessnin@gmail.com).
