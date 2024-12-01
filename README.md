# FAIREFAC API V1: Gestión de Cotizaciones de Refacciones Automotrices

**FAIREFAC API V1** es una aplicación diseñada para gestionar cotizaciones de refacciones automotrices, facilitando la interacción entre clientes y refaccionarias.

## **Descripción**

La API permite a los usuarios (clientes y refaccionarias) realizar diversas funciones relacionadas con la gestión de cotizaciones y pedidos.

- [Desarrolladores](#desarrolladores)

---

## **Funciones principales**

### 1. **Clientes**

- Agregar autos y vincularlos a cotizaciones.
- Subir fotos de sus autos al bucket de **AWS S3** para mayor personalización.
- Solicitar cotizaciones para refacciones.
- Generar un enlace único que puede compartirse con el mecánico de confianza, quien puede gestionar las solicitudes de cotización.
- Las cotizaciones incluyen la dirección del mecánico seleccionado y están vinculadas al auto del cliente.
- Utiliza la API de **GeoNames** para identificar refaccionarias autorizadas cercanas al código postal del mecánico.
- **Procesos de pago**:
  - Los clientes utilizan una sesión de pago de **Stripe** para realizar sus pagos de manera segura.
  - Un cliente puede combinar múltiples cotizaciones de diferentes refaccionarias en una sola transacción.

---

### 2. **Refaccionarias**

- **Recepción de cotizaciones**:

  - Recibir cotizaciones asignadas automáticamente en función de la ubicación del mecánico.

- **Cotización de refacciones**:

  - Cotizar refacciones solicitadas especificando precios y marcas.

- **Gestión de información clave**:

  - Utilizar un panel para visualizar detalles de las cotizaciones, incluyendo:
    - Dirección del mecánico.
    - Teléfono de contacto en caso de dudas sobre las piezas solicitadas.

- **Gestión del flujo de cotizaciones**:

  - Cambiar el estado a **"Enviada"** cuando las refacciones estén listas para su envío.
  - Cambiar el estado a **"Entregada"** al confirmar la recepción en el taller mecánico.
  - Cada refaccionaria debe contar con repartidores propios para realizar las entregas.

- **Integración con Stripe para pagos**:
  - Las refaccionarias se registran en Stripe para poder recibir pagos directamente.
  - Cuando un cliente realiza el pago de una o varias cotizaciones, el sistema:
    1. Procesa el pago total de la cotización.
    2. Realiza transferencias automáticas a cada refaccionaria involucrada, basándose en el monto correspondiente de cada **RepairShopQuote**.

---

### 3. **Subida de fotos al bucket de AWS**

- Ambos usuarios (clientes y refaccionarias) tienen la capacidad de subir imágenes:
  - Los **clientes** pueden subir fotos de perfil y de sus autos.
  - Las **refaccionarias** pueden subir fotos de perfil para mejorar su identificación en la plataforma.
- Las imágenes se almacenan de manera segura en **AWS S3**, optimizando el acceso y la administración de archivos.

---

# Dependencias

Estas son las dependencias utilizadas en el proyecto:

| Paquete          | Versión      | Descripción                                                                                    |
| ---------------- | ------------ | ---------------------------------------------------------------------------------------------- |
| **aws-sdk**      | ^2.1691.0    | Biblioteca oficial para interactuar con los servicios de AWS, como S3, DynamoDB, y más.        |
| **axios**        | ^1.7.7       | Cliente HTTP para realizar solicitudes a APIs externas.                                        |
| **bcryptjs**     | ^2.4.3       | Biblioteca para la encriptación de contraseñas.                                                |
| **cors**         | ^2.8.5       | Middleware para manejar solicitudes entre diferentes dominios (Cross-Origin Resource Sharing). |
| **dotenv**       | ^16.4.5      | Manejo de variables de entorno desde un archivo `.env`.                                        |
| **express**      | ^4.19.2      | Framework para construir aplicaciones web y APIs.                                              |
| **http-errors**  | ^2.0.0       | Utilidad para manejar errores HTTP de manera consistente.                                      |
| **jsonwebtoken** | ^9.0.2       | Implementación de JSON Web Tokens (JWT) para autenticación y seguridad.                        |
| **mongoose**     | ^8.6.0       | ODM para modelar datos en MongoDB.                                                             |
| **multer**       | ^1.4.5-lts.1 | Middleware para la carga de archivos en aplicaciones Node.js.                                  |
| **nodemailer**   | ^6.9.15      | Biblioteca para enviar correos electrónicos desde aplicaciones Node.js.                        |
| **stripe**       | ^17.2.0      | SDK para integrar la API de Stripe y gestionar pagos.                                          |

---

# Repositorio

- **URL del repositorio GitHub**:  
  [Fairefac Backend](https://github.com/aleTorres05/FaiRefacBack)

---

# Requisitos para el entorno

### Instalación de dependencias

Asegúrate de tener instalado **Node.js**. Luego, ejecuta el siguiente comando para instalar todas las dependencias del proyecto:

```bash
npm install
```

# Variables de entorno

Configura un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno necesarias:

---

### Variables de entorno Mongo DB:

- `DB_USER`: Usuario para la base de datos.
- `DB_PASSWORD`: Contraseña de la base de datos.
- `DB_HOST`: Dirección del host de la base de datos.
- `DB_NAME`: Nombre de la base de datos.

---

### Variables de entorno JWT:

- `JWT_SECRET`: Clave secreta para generar y verificar tokens JWT.

---

### Variables de entorno AWS S3-FaiRefac:

- `AWS_ACCESS_KEY_ID`: Clave de acceso para AWS.
- `AWS_SECRET_ACCESS_KEY`: Clave secreta para AWS.
- `AWS_REGION`: Región de AWS donde se encuentra el bucket.
- `AWS_BUCKET_NAME`: Nombre del bucket de S3.

---

### Variables de entorno Gmail:

- `EMAIL_USER`: Dirección de correo utilizada para enviar correos.
- `EMAIL_PASS`: Contraseña o token del correo electrónico.

---

### Variables de entorno Stripe:

- `STRIPE_PRIVATE_KEY`: Clave privada para interactuar con la API de Stripe.
- `STRIPE_ENDPOINT_SECRET`: Secreto del endpoint de Stripe.

---

### Variables de entorno DNS para sesión Stripe:

- `BASE_URL`: URL base para sesiones de Stripe.

---

### Nombre de usuario GeoNames:

- `GEONAMES_USER_NAME`: Nombre de usuario para la API de GeoNames.

---

## Inicialización del servidor

### Puedes iniciar el servidor en la siguiente URL;

```
https://api.onrender.com/
```

Esta URL te permitirá interactuar con la API.

---

# Endpoints Disponibles

A continuación, se describen los endpoints disponibles en la API de FAIREFAC.
- [Autenticación](#autenticación)
- [Usuario](#usuario)
- [Cliente](#cliente)
- [Coche](#coche)
- [Refaccionaria](#refaccionaria)
- [Mecánico](#mecánico)
- [Cotización](#cotización)
- [Stripe Webhook](#stripe-webhook)
- [Cotización de Refaccionaria](#cotización-de-refaccionaria)

## Autenticación

### `POST /auth/login`

Inicia sesión con las credenciales del usuario.

#### Cuerpo de la solicitud:

```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
```

#### Respuesta:

```json
{
  "succes": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDUzMDk3MjI5MTc1OWRkYjBiOTFmMCIsImlhdCI6MTczMzA0OTM1MiwiZXhwIjoxNzMzMTM1NzUyfQ.z2dzUuDBizD3VCcCJXByVUCPGtJxElX97HByA-xqUT8"
  }
}
```

## Usuario

### `POST /user`

Crea un nuevo usuario.

#### Cuerpo de la solicitud:

```json
{
  "email": "cliente@example.com",
  "password": "passwordSeguro",
  "isClient": false,
  "isRepairShop": true
}
```

#### Respuesta:

```json
{
  "success": true,
  "data": {
    "User": {
      "email": "cliente@example.com",
      "password": "$2a$10$VpinOBwfoQWHYLBnFQTVoOp1c.F2ApPwfZeMOuzUMQ7o.GYew4xea",
      "isClient": false,
      "isRepairShop": true,
      "verifiedEmail": false,
      "_id": "674c3d5331003ab0b838f98f",
      "created_at": "2024-12-01T10:41:23.338Z",
      "__v": 0
    }
  }
}
```

### `POST /user/send-otp`

Envía un OTP (One Time Password) al correo electrónico proporcionado.

#### Cuerpo de la solicitud Json

```json
{
  "email": "cliente@example.com"
}
```

#### Respuesta:

```json
{
  "success": true,
  "data": {
    "message": "OTP was sended successfuly."
  }
}
```

### `POST /user/verify-otp`

Verifica el OTP enviado al correo electrónico.

#### Cuerpo de la solicitud Json

```json
{
  "email": "cliente@example.com",
  "otp": "791853"
}
```

#### Respuesta:

```json
{
  "success": true,
  "data": {
    "message": "User was successfyly verified."
  }
}
```

### `PATCH /user:id/repairShop`

Actualiza la información de un usuario, en caso de seleccionar un file se sube imagen a AWS S3 o agrega una imagen por default, si es una refaccionaria.

- A través de un archivo que contiene la lista de códigos postales obtenidos de SEPOMEX, se valida que el código postal pertenezca al estado seleccionado. En caso de que no corresponda, la petición no será exitosa.
- Requiere autenticación.

#### Parámetros

- `id` (string): ID del usuario a actualizar.

#### Cuerpo de la solicitud Json

```json
{
  "companyName": "Refaciones de Calidad",
  "phoneNumber": "5555555501",
  "address": {
    "street": "Calle",
    "extNum": "45",
    "intNum": "A2",
    "neighborhood": "Colonia",
    "zipCode": "57420",
    "city": "Delegación o Municipio",
    "state": "Estado de México"
  }
}
```

#### Cuerpo de la solicitud `formData` con imagen de perfil

```text
Content-Disposition: form-data; name="companyName"
Refaccionaria Ejemplo
Content-Disposition: form-data; name="phoneNumber"
5555555555
Content-Disposition: form-data; name="address[street]"
calle
Content-Disposition: form-data; name="address[extNum]"
45
Content-Disposition: form-data; name="address[intNum]"
A2
Content-Disposition: form-data; name="address[neighborhood]"
Colonia
Content-Disposition: form-data; name="address[zipCode]"
57420
Content-Disposition: form-data; name="address[city]"
Delegación o Municipio
Content-Disposition: form-data; name="address[state]"
Estado de México
Content-Disposition: form-data; name="profilePicture"; filename="Car driving-amico (1).svg"
Content-Type: image/svg+xml
```

#### Respuesta:

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "674c42333100ab0b838f9cd",
      "email": "cliente@example.com",
      "password": "$2a$10$fUrM9EZhOsgu7hqT0.hL2uoVtLgIxUqnPyywbh0DXU/AwAr4Xg7I6",
      "isClient": false,
      "isRepairShop": true,
      "verifiedEmail": true,
      "created_at": "2024-12-01T11:02:11.240Z",
      "__v": 0,
      "otp": "119341",
      "otpExpiresAt": "2024-12-01T11:27:35.099Z",
      "repairShop": {
        "_id": "674c4769ea258503ba2cd84a",
        "companyName": "Refaccionaria Ejemplo",
        "phoneNumber": 5555555555,
        "address": {
          "street": "calle",
          "extNum": "45",
          "intNum": "A2",
          "neighborhood": "Colonia",
          "zipCode": "57420",
          "city": "Delegación o Municipio",
          "state": "Estado de México",
          "_id": "674c4769ea258503ba2cd84b"
        },
        "nearbyZipCodes": ["57740", "57420", "57425", "57718", "57710"],
        "quotes": [],
        "stripeAccountActive": false,
        "profilePicture": "https://users-pictures.amazonaws.com/1733052265470-Car%20driving-amico%20%281%29.svg",
        "__v": 0,
        "stripeAccountId": "ac_7QRBkjdfbqfmlhs5"
      }
    }
  }
}
```

### `PATCH /user:id/client`

Actualiza la información de un usuario, en caso de seleccionar un file se sube imagen a AWS S3 o agrega una imagen por default, si es un cliente.

- Requiere autenticación.

#### Parámetros

- `id` (string): ID del usuario a actualizar.

#### Cuerpo de la solicitud Json

```json
{
  "firstName": "Julio",
  "lastName": "Jimenez",
  "phoneNumber": "5555555555"
}
```

#### Cuerpo de la solicitud `formData` con imagen de perfil

```text
Content-Disposition: form-data; name="firstName"
Julio
Content-Disposition: form-data; name="lastName"
Jimenez
Content-Disposition: form-data; name="phoneNumber"
5555555555
Content-Disposition: form-data; name="profilePicture"; filename="notionists-1720574319852.png"
Content-Type: image/png
```

#### Respuesta:

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "674c3f8331003ab0b838f992",
      "email": "cliente@example.com",
      "password": "$2a$10$cOnW9EZfpBZkjPp0pD1bmevrVZwNFSQf6Z76pZgWfsQGpyd4I3x/.",
      "isClient": true,
      "isRepairShop": false,
      "verifiedEmail": true,
      "created_at": "2024-12-01T10:50:43.243Z",
      "__v": 0,
      "client": {
        "_id": "674c3fd931003ab0b838f9b0",
        "firstName": "Julio",
        "lastName": "Jimenez",
        "phoneNumber": "5555555555",
        "cars": [],
        "profilePicture": "https://users-pictures.amazonaws.com/1733050329560-notionists-1720574319852.png",
        "__v": 0
      }
    }
  }
}
```

### `GET /user/find-email/:email`

Obtiene los detalles de un usuario por su correo electrónico.

- Requiere autenticación.

#### Parámetros

- `email` (string): Correo electrónico del usuario a buscar.

#### Respuesta si es `repairShop`:

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "674c423331003ab0b838f9cd",
      "email": "cliente@example.com",
      "password": "$2a$10$fUrM9EZhOsgu7hqT0.hL2uoVtLgIxUqnPyywbh0DXU/AwAr4Xg7I6",
      "isClient": false,
      "isRepairShop": true,
      "verifiedEmail": true,
      "created_at": "2024-12-01T11:02:11.240Z",
      "__v": 0,
      "otp": "119341",
      "otpExpiresAt": "2024-12-01T11:27:35.099Z",
      "repairShop": {
        "_id": "674c4769ea258503ba2cd84a",
        "companyName": "Refaccionaria Ejemplo",
        "phoneNumber": 5555555555,
        "address": {
          "street": "calle",
          "extNum": "45",
          "intNum": "A2",
          "neighborhood": "Colonia",
          "zipCode": "57420",
          "city": "Delegación o Municipio",
          "state": "Estado de México",
          "_id": "674c4769ea258503ba2cd84b"
        },
        "nearbyZipCodes": ["57740", "57420", "57425", "57718", "57710"],
        "quotes": [],
        "stripeAccountActive": true,
        "profilePicture": "https://users-pictures.amazonaws.com/1733052265470-Car%20driving-amico%20%281%29.svg",
        "__v": 0,
        "stripeAccountId": "ac_1QRBkjdfbqfmlhs2"
      }
    }
  }
}
```

#### Respuesta si es `client`:

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "674c3f8331003ab0b838f992",
      "email": "cliente30@example.com",
      "password": "$2a$10$cOnW9EZfpBZkjPp0pD1bmevrVZwNFSQf6Z76pZgWfsQGpyd4I3x/.",
      "isClient": true,
      "isRepairShop": false,
      "verifiedEmail": true,
      "created_at": "2024-12-01T10:50:43.243Z",
      "__v": 0,
      "client": {
        "_id": "674c3fd931003ab0b838f9b0",
        "firstName": "Julio",
        "lastName": "Jimenez",
        "phoneNumber": "5555555555",
        "cars": [],
        "profilePicture": "https://users-pictures.amazonaws.com/1733050329560-notionists-1720574319852.png",
        "__v": 0
      }
    }
  }
}
```

### `GET /user:id`

Obtiene la información de un usuario por su ID.

- Requiere autenticación.

#### Parámetros

- `id` (string): ID del usuario.

#### Respuesta si es `repairShop`:

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "674c423331003ab0b838f9cd",
      "email": "cliente@example.com",
      "password": "$2a$10$fUrM9EZhOsgu7hqT0.hL2uoVtLgIxUqnPyywbh0DXU/AwAr4Xg7I6",
      "isClient": false,
      "isRepairShop": true,
      "verifiedEmail": true,
      "created_at": "2024-12-01T11:02:11.240Z",
      "__v": 0,
      "otp": "119341",
      "otpExpiresAt": "2024-12-01T11:27:35.099Z",
      "repairShop": {
        "_id": "674c4769ea258503ba2cd84a",
        "companyName": "Refaccionaria Ejemplo",
        "phoneNumber": 5555555555,
        "address": {
          "street": "calle",
          "extNum": "45",
          "intNum": "A2",
          "neighborhood": "Colonia",
          "zipCode": "57420",
          "city": "Delegación o Municipio",
          "state": "Estado de México",
          "_id": "674c4769ea258503ba2cd84b"
        },
        "nearbyZipCodes": ["57740", "57420", "57425", "57718", "57710"],
        "quotes": [],
        "stripeAccountActive": true,
        "profilePicture": "https://users-pictures.amazonaws.com/1733052265470-Car%20driving-amico%20%281%29.svg",
        "__v": 0,
        "stripeAccountId": "ac_1QRBkjdfbqfmlhs2"
      }
    }
  }
}
```

#### Respuesta si es `client`:

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "674c3f8331003ab0b838f992",
      "email": "cliente30@example.com",
      "password": "$2a$10$cOnW9EZfpBZkjPp0pD1bmevrVZwNFSQf6Z76pZgWfsQGpyd4I3x/.",
      "isClient": true,
      "isRepairShop": false,
      "verifiedEmail": true,
      "created_at": "2024-12-01T10:50:43.243Z",
      "__v": 0,
      "client": {
        "_id": "674c3fd931003ab0b838f9b0",
        "firstName": "Julio",
        "lastName": "Jimenez",
        "phoneNumber": "5555555555",
        "cars": [],
        "profilePicture": "https://users-pictures.amazonaws.com/1733050329560-notionists-1720574319852.png",
        "__v": 0
      }
    }
  }
}
```

### `DELETE /user:id`

Elimina un usuario por su ID.

- Requiere autenticación.

#### Parámetros

- `id` (string): ID del usuario a eliminar.

#### Respuesta:

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "674c423331003ab0b838f9cd",
      "email": "cliente@example.com",
      "password": "$2a$10$fUrM9EZhOsgu7hqT0.hL2uoVtLgIxUqnPyywbh0DXU/AwAr4Xg7I6",
      "isClient": false,
      "isRepairShop": true,
      "verifiedEmail": true,
      "created_at": "2024-12-01T11:02:11.240Z",
      "__v": 0,
      "otp": "119341",
      "otpExpiresAt": "2024-12-01T11:27:35.099Z",
      "repairShop": "000c0000ea000003ba2cd00a"
    }
  }
}
```

## Cliente

### `POST /client:id/car`

Asocia un coche a un cliente, también permite la carga de una imagen del coche.

- Requiere autenticación.
- Requiere que el usuario sea un cliente.
- `nickname` es opcional en caso de que el cliente quiera personalizar datos de su coche.

#### Parámetros

- `id` (string): ID del cliente al que se le asociará el coche.

#### Cuerpo de la solicitud Json:

```json
{
  "model": "civic",
  "brand": "Honda",
  "year": "2000",
  "version": "LX Automatico",
  "nickmane": "Zopilote"
}
```

#### Cuerpo de la solicitud `formData` con imagen del coche:

```text
Content-Disposition: form-data; name="model"
civic
Content-Disposition: form-data; name="brand"
Honda
Content-Disposition: form-data; name="year"
2000
Content-Disposition: form-data; name="version"
LX Automatico
Content-Disposition: form-data; name="profilePicture"; filename="notionists-1720574319852.png"
Content-Type: image/png


```

#### Respuesta:

```json
{
  "success": true,
  "message": "Car was successfully created"
}
```

### `GET /client:id`

Obtiene la información de un cliente específico.

- Requiere autenticación.
- Requiere que el usuario sea un cliente.

#### Parámetros

- `id` (string): ID del cliente cuyo perfil se desea obtener.


#### Respuesta:

```json
{
  "success": true,
  "data": {
    "client": {
      "_id": "674c3fd931003ab0b838f9b0",
      "firstName": "Julio",
      "lastName": "Jimenez",
      "phoneNumber": "5555555555",
      "cars": [
        {
          "_id": "674c525010102003b2ba14b5",
          "brand": "Honda",
          "model": "civic",
          "year": "2000",
          "version": "LX Automatico",
          "nickname": "Zopilote",
          "quotes": [],
          "carPicture": "https://assets.amazonaws.com/FaiRefac-default-car-picture.png",
          "__v": 0
        },
      ],
      "profilePicture": "https://users-pictures.amazonaws.com/1733050329560-notionists-1720574319852.png",
      "__v": 4
    }
  }
}
```

## Coche

### `GET /car:id`

Obtiene la información de un automóvil específico asociado a un cliente.

- Requiere autenticación.
- Requiere que el usuario sea un cliente.

#### Parámetros

- `id` (string): ID del automóvil a obtener.

#### Respuesta:

```json
{
  "success": true,
  "data": {
    "car": {
      "_id": "674c511b657b2ca556e9db26",
      "brand": "Honda",
      "model": "civic",
      "year": "2000",
      "version": "LX Automatico",
      "quotes": [],
      "carPicture": "https://amazonaws.com/FaiRefac-default-car-picture.png",
      "__v": 0
    }
  }
}
```

## Refaccionaria

### `GET /repairshop:id`

Obtiene la información de un taller de reparación específico.

- Requiere autenticación.
- Requiere que el usuario sea una refaccionaria.

#### Parámetros

- `id` (string): ID de la refaccionaria a obtener.


#### Respuesta:

```json
{
  "success": true,
  "data": {
    "repairShop": {
      "_id": "674c573b10102003b2ba1577",
      "companyName": "Refaccionaria Ejemplo",
      "phoneNumber": 5555555555,
      "address": {
        "street": "calle",
        "extNum": "25",
        "intNum": "a2",
        "neighborhood": "Colonia",
        "zipCode": "57420",
        "city": "Delegación o Municipio",
        "state": "Estado de México",
        "_id": "674c573b10102003b2ba1578"
      },
      "nearbyZipCodes": [
        "57740",
        "57420",
        "57425",
        "57719",
        "57710"
      ],
      "quotes": [],
      "stripeAccountActive": true,
      "profilePicture": "https://api.dicebear.com/9.x/identicon/svg?seed=Refaccionaria%20Ejemplo",
      "__v": 0,
      "stripeAccountId": "ac_1QRCkjdfb07NysPo"
    }
  }
}
```

### `GET /repairshop/account-link:id`

Genera un enlace para que la refaccionaria pueda completar su cuenta en Stripe.

- Requiere autenticación.
- Requiere que el usuario sea una refaccionaria.

#### Parámetros

- `id` (string): ID de la refaccionaria para generar el enlace de la cuenta.


#### Respuesta:

```json
{
  "success": true,
  "data": {
    "accountLink": "https://connect.stripe.com/setup/e/a_1QRsdfrNysPo/yWDsd<sdbT6O7"
  }
}
```

### `GET /repairshop/account:id`

Hace una petición a Stripe para validar que la cuenta este habilitada para recibir transferencias una vez habilitada actualizara la refaccionaria

- Requiere autenticación.
- Requiere que el usuario sea una refaccionaria.

#### Parámetros

- `id` (string): ID de la refaccionaria cuya información se actualizara.


#### Respuesta:

```json
{
  "success": true,
  "message": "Repair shop payment info successfully updated"
}
```

## Mecánico

### `GET /mechanic`

Obtiene la lista completa de mecánicos registrados.

#### Respuesta:

```json
{
  "success": true,
  "data": {
    "Mechanics": [
      {
        "_id": "674522922291759ddb0b7782",
        "firstName": "Pablo",
        "lastName": "Ramirez",
        "workshopName": "Super Mantenimiento",
        "phoneNumber": 5555555555,
        "address": {
          "street": "Calle San Benito",
          "extNum": "200",
          "intNum": null,
          "neighborhood": "Juarez",
          "zipCode": "03000",
          "city": "Benito Juarez",
          "state": "CDMX",
          "_id": "674522922291759ddb0b7783"
        },
        "__v": 0
      },
      {
        "_id": "67452b6b2291759ddb0b90c0",
        "firstName": "Gerardo",
        "lastName": "Uri",
        "workshopName": "Mecanico cool",
        "phoneNumber": 9213068484,
        "address": {
          "street": "Altares",
          "extNum": "221",
          "intNum": null,
          "neighborhood": "Doctores",
          "zipCode": "03000",
          "city": "Ciudad de Mexico",
          "state": "Ciudad de Mexico",
          "_id": "67452b6b2291759ddb0b90c1"
        },
        "__v": 0
      }
    ]
  }
}
```
### `POST /mechanic`

Crea un nuevo mecánico en el sistema.

#### Cuerpo de la solicitud:

```json
{
    "firstName": "Gabriel",
    "lastName": "Sanchez",
    "workshopName": "Service Pro",
    "phoneNumber": 554104140,
    "address": {
        "street": "Av. Siempre Viva",
        "extNum": "123",
        "intNum": "A",
        "neighborhood": "Centro",
        "zipCode": "57420",
        "city": "Delegación o Municipio",
        "state": "Estado de México"
    }
}
```

#### Respuesta:

```json
{
  "success": true,
  "message": "Mechanic was successfully created"
}
```

### `GET /mechanic:id`

Obtiene la información de un mecánico específico por su ID.

#### Parámetros

- `id` (string): ID del mecánico a obtener.

#### Respuesta:

```json
{
  "success": true,
  "data": {
    "data": {
      "_id": "674522922291759ddb0b7782",
      "firstName": "Pablo",
      "lastName": "Ramirez",
      "workshopName": "Super Mantenimiento",
      "phoneNumber": 5555555555,
      "address": {
        "street": "Calle San Benito",
        "extNum": "200",
        "intNum": null,
        "neighborhood": "Juarez",
        "zipCode": "03000",
        "city": "Benito Juarez",
        "state": "CDMX",
        "_id": "674522922291759ddb0b7783"
      },
      "__v": 0
    }
  }
}
```

## Cotización

### `POST /quote/create/car/:carId/mechanic/:mechanicId`

Crea una nueva cotización asociada a un auto y un mecánico.

#### Parámetros

- `carId` (string): ID del auto.
- `mechanicId` (string): ID del mecánico.

#### Cuerpo de la solicitud:

```json
{
    "items": [
        {
            "concept": "Balatas delanteras",
            "quantity": 1
        },
        {
            "concept": "Discos delanteros",
            "quantity": 2
        }
    ]
}
```

#### Respuesta:

```json
{
    "success": true,
    "data": {
        "quote": {
            "items": [
                {
                    "concept": "Balatas delanteras",
                    "quantity": 1,
                    "_id": "674cb0573f8b99de2ba9a8be"
                },
                {
                    "concept": "Discos delanteros",
                    "quantity": 2,
                    "_id": "674cb0573f8b99de2ba9a8bf"
                }
            ],
            "repairShopQuotes": [
                "674cb0573f8b99de2ba9a8c2",
                "674cb0573f8b99de2ba9a8c5"
            ],
            "total": 0,
            "status": "initial",
            "_id": "674cb0573f8b99de2ba9a8bd",
            "createdAt": "2024-12-01T18:52:07.684Z",
            "__v": 1
        }
    }
}
```

### `GET /quote:id`

Obtiene los detalles de una cotización específica.

- Requiere autenticación.
- Requiere que el usuario sea un cliente.

#### Parámetros

- `id` (string): ID de la cotización.

#### Respuesta:

```json
{
  "success": true,
  "data": {
    "quote": {
      "_id": "674cb0573f8b99de2ba9a8bd",
      "items": [
        {
          "concept": "Balatas delanteras",
          "quantity": 1,
          "_id": "674cb0573f8b99de2ba9a8be"
        },
        {
          "concept": "Discos delanteros",
          "quantity": 2,
          "_id": "674cb0573f8b99de2ba9a8bf"
        }
      ],
      "repairShopQuotes": [
        {
          "_id": "674cb0573f8b99de2ba9a8c2",
          "car": "674c53b510102003b2ba1528",
          "mechanic": "674c5dcf657b2ca556e9db42",
          "repairShop": {
            "_id": "674c4769ea258503ba2cd84a",
            "companyName": "Refaccionaria Ejemplo",
            "phoneNumber": 5555555555,
            "address": {
              "street": "calle",
              "extNum": "45",
              "intNum": "A2",
              "neighborhood": "Colonia",
              "zipCode": "57420",
              "city": "Delegación o Municipio",
              "state": "Estado de México",
              "_id": "674c4769ea258503ba2cd84b"
            }
          },
          "items": [
            {
              "concept": "Balatas delanteras",
              "quantity": 1,
              "_id": "674cb0573f8b99de2ba9a8c3"
            },
            {
              "concept": "Discos delanteros",
              "quantity": 2,
              "_id": "674cb0573f8b99de2ba9a8c4"
            }
          ],
          "totalPrice": 0,
          "status": "initial",
          "createdAt": "2024-12-01T18:52:07.904Z",
          "__v": 0
        },
        {
          "_id": "674cb0573f8b99de2ba9a8c5",
          "car": "674c53b510102003b2ba1528",
          "mechanic": "674c5dcf657b2ca556e9db42",
          "repairShop": {
            "_id": "674c573b10102003b2ba1577",
            "companyName": "Refaccionaria Ejemplo",
            "phoneNumber": 5555555555,
            "address": {
              "street": "calle",
              "extNum": "25",
              "intNum": "a2",
              "neighborhood": "Colonia",
              "zipCode": "57420",
              "city": "Delegación o Municipio",
              "state": "Estado de México",
              "_id": "674c573b10102003b2ba1578"
            }
          },
          "items": [
            {
              "concept": "Balatas delanteras",
              "quantity": 1,
              "_id": "674cb0573f8b99de2ba9a8c6"
            },
            {
              "concept": "Discos delanteros",
              "quantity": 2,
              "_id": "674cb0573f8b99de2ba9a8c7"
            }
          ],
          "totalPrice": 0,
          "status": "initial",
          "createdAt": "2024-12-01T18:52:07.906Z",
          "__v": 0
        }
      ],
      "total": 0,
      "status": "initial",
      "createdAt": "2024-12-01T18:52:07.684Z",
      "__v": 1
    }
  }
}
```

### `PATCH /quote/calculate:id`

Calcula el precio total de una cotización.

- Requiere autenticación.

#### Parámetros

- `id` (string): ID de la cotización.

#### Respuesta:

```json
{
  "success": true,
  "data": {
    "quote": {
      "_id": "674cb0573f8b99de2ba9a8bd",
      "items": [
        {
          "concept": "Balatas delanteras",
          "quantity": 1,
          "_id": "674cb0573f8b99de2ba9a8be"
        },
        {
          "concept": "Discos delanteros",
          "quantity": 2,
          "_id": "674cb0573f8b99de2ba9a8bf"
        }
      ],
      "repairShopQuotes": [
        {
          "_id": "674cb0573f8b99de2ba9a8c2",
          "car": "674c53b510102003b2ba1528",
          "mechanic": "674c5dcf657b2ca556e9db42",
          "repairShop": "674c4769ea258503ba2cd84a",
          "items": [
            {
              "concept": "Balatas delanteras",
              "quantity": 1,
              "_id": "674cb0573f8b99de2ba9a8c3"
            },
            {
              "concept": "Discos delanteros",
              "quantity": 2,
              "_id": "674cb0573f8b99de2ba9a8c4"
            }
          ],
          "totalPrice": 0,
          "status": "initial",
          "createdAt": "2024-12-01T18:52:07.904Z",
          "__v": 0
        },
        {
          "_id": "674cb0573f8b99de2ba9a8c5",
          "car": "674c53b510102003b2ba1528",
          "mechanic": "674c5dcf657b2ca556e9db42",
          "repairShop": "674c573b10102003b2ba1577",
          "items": [
            {
              "concept": "Balatas delanteras",
              "quantity": 1,
              "_id": "674cb0573f8b99de2ba9a8c6",
              "brand": "Brembo",
              "itemTotalPrice": 1300,
              "unitPrice": 1300
            },
            {
              "concept": "Discos delanteros",
              "quantity": 2,
              "_id": "674cb0573f8b99de2ba9a8c7",
              "brand": "Originales",
              "itemTotalPrice": 2500,
              "unitPrice": 1250
            }
          ],
          "totalPrice": 3800,
          "status": "review",
          "createdAt": "2024-12-01T18:52:07.906Z",
          "__v": 0
        }
      ],
      "total": 3800,
      "status": "initial",
      "createdAt": "2024-12-01T18:52:07.684Z",
      "__v": 1,
      "fee": 190,
      "totalFaiRefacFee": 3990
    }
  }
}
```

#### `PATCH /quote/:id/reject/:repairShopQuoteId`

Rechaza una cotización de un taller de reparación.

- Requiere autenticación.
- Requiere que el usuario sea un cliente.

#### Parámetros

- `id` (string): ID de la cotización.
- `repairShopQuoteId` (string): ID de la cotización del taller.

#### Respuesta

```json
{
  "success": true,
  "data": {
    "quote": {
      "_id": "674cb0573f8b99de2ba9a8bd",
      "items": [
        {
          "concept": "Balatas delanteras",
          "quantity": 1,
          "_id": "674cb0573f8b99de2ba9a8be"
        },
        {
          "concept": "Discos delanteros",
          "quantity": 2,
          "_id": "674cb0573f8b99de2ba9a8bf"
        }
      ],
      "repairShopQuotes": [],
      "total": 0,
      "status": "rejected",
      "createdAt": "2024-12-01T18:52:07.684Z",
      "__v": 3,
      "fee": 0,
      "totalFaiRefacFee": 0
    }
  }
}
```

### `POST /quote/:id/create-checkout-session`

Crea una sesión de pago en **Stripe** para la cotización.

- Requiere autenticación.
- Requiere que el usuario sea un cliente.

### Parámetros

- `id` (string): ID de la cotización.

#### Respuesta

```json
{
  "success": true,
  "data": {
    "session": "https://checkout.stripe.com/c/pay/cs_test_a152mdfjdfO6JdwedOn0W6kcRV1z8SIhS1zWrYxhmWv9mtzr0BYgqUnt1zyef#fid1d2BpamRhQ2prcSc%2FJ0ZtZG53ZCVVYHFmbScpJ2R1bE5gfCc%2FJ3VuWnFgdnFaMDRURGJSdFdxbENSbV1INXcxXGw8X0dfdjBrdnVcMmBydmA9Y0erfwerfNoYmxLfzJXNG9MbEFiS2l8a0dOblRJclBPcFIzalxmakhLR2JEfV9hM3VOcmk1NUg9NTJCQ1ZHJyknY3dqaFZgd3Ngdyc%2FcXdwYCknfwerfwerfx1YCc%2FJ3Zsa2JpYFpscWBoJyknYGtkZ2lgVWlkZmBtamlhYHd2Jz9xd3BgeCUl"
  }
}
```

### `GET /quote/payment-info/:sessionId`

Obtiene `ticketUrl` y `paymentId` del pago asociado a una sesión de **Stripe**.

### Parámetros

- `sessionId` (string): ID de la sesión de pago.

#### Respuesta

```json
{
    "succes": true,
    "data": {
        "ticketUrl": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xUUFnV3FSdGlGV2hYTTByKOOIs7oGMga2sye7x206LBZ2Nl5aPS-MBWItApoAerfwre8AGLpvU9bHqpvsjMIxNNaF_1tPP3BfxReWf1Qw",
        "paymentId": "pi_3QRJaFRtiFwdefwf0r1CaTuxhF"
    }
}
```

### `POST /quote/quote-link-token/:clientId/:carId`

Genera un token que encapsula el `clientId` y el `carId`. Este token permite enviar un enlace al mecánico para que pueda crear una cotización asociada a un cliente y un coche específico.


### Parámetros

- `clientId` (string): ID del cliente.
- `carId` (string): ID del auto.

#### Respuesta

```json
{
    "succes": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6IjY3NGMzZmQ5MzEwMDNhYjBiODM4ZjliMCIsImNhcklkIjoiNjc0YzUzYjUxMDEwMjAwM2IyYmExNTI4IiwiaWF0IjoxNzMzMDgxNTgwLCJleHAiOjE3MzMwODMzODB9.YeAM6piBml9cmT8RGdcaIcTsDgfM3RGcdGd0A5xS4W0"
    }
}
```

### `POST /quote/validate-token`

Valida un token para cotizaciones.

#### Encabezados:

- Authorization: token generado en la ruta `POST /quote/quote-link-token/:clientId/:carId`

#### Respuesta

```json
{
  "success": true,
  "data": {
    "clientId": "674c3fd931003ab0b838f9b0",
    "carId": "674c53b510102003b2ba1528"
  }
}
```

### `POST /quote/validate-cancel-Link`

Valida si un token de enlace ha sido revocado.

#### Encabezados:

- Authorization: token generado en la ruta `POST /quote/quote-link-token/:clientId/:carId`

#### Respuesta

```json
{
  "success": true
}
```

### `POST /quote/revoke-token`

Revoca un token de enlace para cotizaciones.

#### Encabezados:

- Authorization: token generado en la ruta `POST /quote/quote-link-token/:clientId/:carId`

#### Respuesta

```json
{
  "message": "Token revoked successfully"
}
```

## Stripe webhook

### `POST /quote/webhook`

Procesa eventos de **Stripe** recibido por webhook y agrega información.

### Eventos Gestionados por el Webhook

#### `checkout.session.completed`
- Actualiza el estado de la cotización a `paid` cuando se completa una sesión de checkout.
- Asocia el `paymentId` correspondiente a la cotización.
- Modifica el estado de todas las cotizaciones de refaccionarias asociadas (`repairShopQuotes`) a `paid`.

#### `charge.updated`
- Procesa transferencias hacia las cuentas de Stripe de las refaccionarias asociadas a una cotización principal.
- Las transferencias solo se realizan para cotizaciones de refaccionarias con un `totalPrice` mayor a cero.
- Actualiza la URL del ticket de pago (`ticketUrl`) de la cotización principal.

#### `account.updated`
- Verifica si la cuenta de Stripe asociada a una refaccionaria tiene los cobros habilitados (`charges_enabled`).
- Si está habilitada, actualiza el estado de la cuenta en la base de datos marcándola como activa (`stripeAccountActive`).

Esta implementación garantiza que los eventos de Stripe se procesen de manera eficiente, actualizando la información necesaria en la base de datos y gestionando pagos y transferencias de manera automática.


#### Respuesta:

```json
{
  "success": true,
  "message": "Event handled"
}
```

## Cotización de refaccionaria

### `PATCH /repairshop-quote/:id/update`

Actualiza los datos `item` de una cotización específica asociada a una refaccionaria.

- Requiere autenticación.
- Requiere que el usuario sea una refaccionaria.

#### Parámetros

- `id`: ID de la cotización a actualizar.

#### Cuerpo de la solicitud:

```json
[
    {
        "_id": "674ccca1402e911f2a31322e",
        "unitPrice": 1300,
        "brand": "Brembo"
    },
    {
        "_id": "674ccca1402e911f2a31322f",
        "unitPrice": 1250,
        "brand": "Originales"
    }
]
```

#### Respuesta:

```json
{
  "success": true,
  "data": {
    "updatedQuote": {
      "_id": "674ccca1402e911f2a31322d",
      "car": "674c53b510102003b2ba1528",
      "mechanic": "674c5dcf657b2ca556e9db42",
      "repairShop": "674c573b10102003b2ba1577",
      "items": [
        {
          "concept": "Balatas delanteras",
          "quantity": 1,
          "_id": "674ccca1402e911f2a31322e",
          "unitPrice": 1300,
          "brand": "Brembo",
          "itemTotalPrice": 1300
        },
        {
          "concept": "Discos delanteros",
          "quantity": 2,
          "_id": "674ccca1402e911f2a31322f",
          "unitPrice": 1250,
          "brand": "Originales",
          "itemTotalPrice": 2500
        }
      ],
      "totalPrice": 3800,
      "status": "review",
      "createdAt": "2024-12-01T20:52:49.479Z",
      "__v": 0
    }
  }
}
```

### `GET /repairshop-quote/:id`

Obtiene los detalles de una cotización de refaccionaria específica.

- Requiere autenticación.

#### Parámetros

- `id`: ID de la cotización de refaccionaria.


#### Respuesta:

```json
{
  "success": true,
  "data": {
    "quote": {
      "_id": "674ccca1402e911f2a31322d",
      "car": {
        "_id": "674c53b510102003b2ba1528",
        "brand": "KIA",
        "model": "Forte",
        "year": "2022",
        "version": "lx",
        "nickname": "null",
        "quotes": [
          "674cb0573f8b99de2ba9a8bd",
          "674cb86d3f8b99de2ba9aa34",
          "674ccbb1402e911f2a313115",
          "674ccca1402e911f2a313225"
        ],
        "carPicture": "https://fairefac-assets.s3.us-east-2.amazonaws.com/FaiRefac-default-car-picture.png",
        "__v": 4
      },
      "mechanic": {
        "_id": "674c5dcf657b2ca556e9db42",
        "firstName": "Gabriel",
        "lastName": "Sanchez",
        "workshopName": "Service Pro",
        "phoneNumber": 554104140,
        "address": {
          "street": "Av. Siempre Viva",
          "extNum": "123",
          "intNum": "A",
          "neighborhood": "Centro",
          "zipCode": "57420",
          "city": "mexico",
          "state": "estado de mexico",
          "_id": "674c5dcf657b2ca556e9db43"
        },
        "__v": 0
      },
      "repairShop": {
        "_id": "674c573b10102003b2ba1577",
        "companyName": "Refaccionaria Ejemplo",
        "phoneNumber": 5555555555,
        "address": {
          "street": "calle",
          "extNum": "25",
          "intNum": "a2",
          "neighborhood": "Colonia",
          "zipCode": "57420",
          "city": "Delegación o Municipio",
          "state": "Estado de México",
          "_id": "674c573b10102003b2ba1578"
        },
        "nearbyZipCodes": [
          "57740",
          "57420",
          "57425",
          "57719",
          "57710"
        ],
        "quotes": [
          "674cb0573f8b99de2ba9a8c5",
          "674cb86d3f8b99de2ba9aa3c",
          "674ccbb1402e911f2a31311d",
          "674ccca1402e911f2a31322d"
        ],
        "stripeAccountActive": true,
        "profilePicture": "https://api.dicebear.com/9.x/identicon/svg?seed=Refaccionaria%20Ejemplo",
        "__v": 4,
        "stripeAccountId": "acct_1QRCJbRqz07NysPo"
      },
      "items": [
        {
          "concept": "Balatas delanteras",
          "quantity": 1,
          "_id": "674ccca1402e911f2a31322e",
          "brand": "Brembo",
          "itemTotalPrice": 1300,
          "unitPrice": 1300
        },
        {
          "concept": "Discos delanteros",
          "quantity": 2,
          "_id": "674ccca1402e911f2a31322f",
          "brand": "Originales",
          "itemTotalPrice": 2500,
          "unitPrice": 1250
        }
      ],
      "totalPrice": 3800,
      "status": "review",
      "createdAt": "2024-12-01T20:52:49.479Z",
      "__v": 0
    }
  }
}
```

### `DELETE /repairshop-quote/:id/delete-item/:itemId`

Elimina un ítem específico de una cotización de refaccionaria asociada a un cliente.

- Requiere autenticación.
- Requiere que el usuario sea un cliente.

#### Parámetros

- `id`: ID de la cotización a actualizar.
- `itemId:` ID del ítem a eliminar.


#### Respuesta:

```json
{
  "success": true,
  "message": "Item was successfully deleted"
}
```

### `PATCH /repairshop-quote/:id/change-status`

Cambia el estado de una cotización de refaccionaria.
`paid` a `sent` y `sent` a `delivered`

- Requiere autenticación.
- Requiere que el usuario sea una refaccionaria.

#### Parámetros

- `id`: ID de la cotización a actualizar.

#### Respuesta:

```json
{
  "succes": true,
  "data": {
    "updateRepairShopQuote": {
      "_id": "674cb86d3f8b99de2ba9aa3c",
      "car": "674c53b510102003b2ba1528",
      "mechanic": "674c5dcf657b2ca556e9db42",
      "repairShop": "674c573b10102003b2ba1577",
      "items": [
        {
          "concept": "balatas delanteras",
          "quantity": 1,
          "_id": "674cb86d3f8b99de2ba9aa3d",
          "brand": "Brembo",
          "itemTotalPrice": 1300,
          "unitPrice": 1300
        },
        {
          "concept": "Discos delanteros",
          "quantity": 2,
          "_id": "674cb86d3f8b99de2ba9aa3e",
          "brand": "Originales",
          "itemTotalPrice": 2500,
          "unitPrice": 1250
        }
      ],
      "totalPrice": 3800,
      "status": "sent",
      "createdAt": "2024-12-01T19:26:37.560Z",
      "__v": 0
    }
  }
}
```
---

## Desarrolladores

Este proyecto fue desarrollado por [Yair Guadarrama](https://github.com/Yairgg95),  
con contribuciones de [Alejandro Torres](https://github.com/aleTorres05).

Puedes ver la lista completa de contribuyentes en [Contributors](https://github.com/aleTorres05/FaiRefacBack/graphs/contributors).
