import numpy as np
import tensorflow as tf
import keras
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Inicializa Firebase con la clave privada descargada
cred = credentials.Certificate({
  "type": "service_account",
  "project_id": "air-check-ad25b",
  "private_key_id": "cb58c15a6ca53e59bf6c44c0123673ab46c5759b",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDQknfZv5FgrIgb\nnF1i/Iws8oMc3EGWrdyc0GGCwqmPMV+/WSC9UBt3VaPvANL7uMT/zlGeQxUp6Mln\nMLoyt2I0ZohewWMn4ExzmJub29SOGqPV02WXQwdHdksT0IN4CipkScxuTJDH92fn\nfiTqPO7pl+5k9kYc/NVWXqP+WNVyqN00LrjEhn45hj7PST84uEVdI9wYmPAMVxyy\nQTzTAxbsWJlYs2NRoBfMqGLhagmzZckqGaDiY19vH3CKYbASVR5uHuf5rRi/2AGx\ntWlny4Wrw2GcVfsGSvN05y+xt/fsJyJdcVDrTFyVSQCEamWoOrxogR6LbJZPnb41\nSGhd24hDAgMBAAECggEAAYlt8z9+nKKlnbJ3juQQGMEWtAhv169JrPW6HWkKyWcF\nohbP73H4kD09m0q7XNoRLyNZjAJJh+85RxasU8Hww5sUmsIiojR8ZVOoCqxCTJb0\nqX3IkozbYyyDd06cUWIEMVkvD1cAFoEdSMh8qov7yxVwzvMKAQR56L+DLNVOiVNv\nmf5//3BS+j4AvrsOw5pS6rp6UG2MS/p9KX7NoJZUlLZA28Fuv9zbZIvRR/wB4InI\nfwPVE1jc7arkC4n8UAj6TwWLVPKtrHKXMSpOw5SBRvh17BWfRgQ8QRZbTvGkfPeC\nEqV7TKDLTKp4K5tmGWzGN4CGCWximniTiqjD10efvQKBgQDqJUf04PcY9hXa1/Zc\nOJbEWGwkWS2qb5hfUH0WHq7k3U6fMrssDvQLP9iDBJSdvY9OfB8ywjr8N+Pslmgy\nEcoUvOjGn50kd4AgmhCmakzNwQB7IL9lJDOBrGYA3EyXgA7141B6FC4m0xkt+kc1\nUGBxdh0riWp1nIPw2+Ddy8U79wKBgQDkCiEjBtruNsd/aLedQZu92YPLn+V0MlsA\nL8sVevAtQ9/0GZ9Pb9Xz80fhqgAQiqqehHQ0xsHfkXNU3JRecsqTyqEwMxehMoVX\n6wG7Jpi3qjlw+2EQiOs/P+/t8gT90CHNE+PnKcTQvKMNtvMn2Tfx2C4596i7yTfN\nAyYR8TYLFQKBgD7zjwkTgtu/LdkMvzvEKyTW8RxErbZpEnpt1XOhBDycE4tRxGjw\nDEUKAVgYXyyZznG3hVvMRLeS/0CYn6L2jXJN5/ee6kznpBcf1OIpKkUXYt23zD2R\nIhf3FeWdVSpWT69kUjrAOjhOATMPWx3GYmee7fDKnUjJr9+N/kMjif+5AoGBAMlF\nd4Hm5w0iJGr8DjQqWD/04DK1alxopZFAncrTu3D4W46jns0KNJkgvO0ckvoGqhlH\nZxm95Bhj1JuuJPZH8y0Gx8Y3EkAgyziSH/EDW/+fqxthhIaHkrs8v5QQ7P7o2Syc\nxaaeYyypknDkbTFas9otqH9ZbABy1WGJyexELiMRAoGAVa5clHi17/WMuL/kVsX+\narzPxr8+iaJ+tHAvJSgLn931ldTbZaPodmv+Lje1PPPn/4MXVmqZaaiKPpwdKcQ1\nvsF4UZLAVjAFzaM/XDa6RKB2CP9nLEaKNSM6i0xRa2sJpQubmft8boWQsHf/govj\nULMTIS7IyMJ39yTNzTrVbuI=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-uxbo0@air-check-ad25b.iam.gserviceaccount.com",
  "client_id": "100532152727790030687",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-uxbo0%40air-check-ad25b.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
})
firebase_admin.initialize_app(cred)
# Conecta a la base de datos Firestore
db = firestore.client()

# Realiza consultas a Firestore
docs = db.collection("historial").get()

for doc in docs:
    print(f"ID del documento: {doc.id}")
    print(f"Datos del documento: {doc.to_dict()}")

    # Supongamos que has almacenado los datos en una lista llamada "data_list"
data_list = []

for doc in docs:
    data = doc.to_dict()
    data_list.append([
        data["CO2"],
        data["VOC"],
        data["hum"],
        data["iaq"],
        data["press"],
        data["temp"]
    ])

    # Convierte la lista de datos en un arreglo numpy
data_array = np.array(data_list)
data_array = data_array.astype(float)

data_final = []

for i in range(len(data_array[0])):
  X = data_array[:, :-1]  # Todas las columnas excepto la última
  y = data_array[:, i]   # La última columna (temp) es la variable que queremos predecir

  # Define un modelo de red neuronal simple en TensorFlow
  model = tf.keras.Sequential([
      tf.keras.layers.Dense(64, activation='relu', input_shape=(X.shape[1],)),
      tf.keras.layers.Dense(32, activation='relu'),
      tf.keras.layers.Dense(1)  # Una sola salida para predecir 'temp'
  ])

  # Compila el modelo
  model.compile(optimizer='adam', loss='mean_squared_error')

  # Entrena el modelo con los datos de hoy
  model.fit(X, y, epochs=100, batch_size=32)

  # Realiza predicciones para cada conjunto de valores en data_array
  predictions = model.predict(X)

  # Calcula el promedio de las predicciones
  average_prediction = np.mean(predictions)
  data_final.append(average_prediction)

print("Predicción promediada para todos los valores en data_array:", data_final)

data_final = [str(value) for value in data_final]

data = {
    "CO2": data_final[0],
    "VOC": data_final[1],
    "hum": data_final[2],
    "iaq": data_final[3],
    "press": data_final[4],
    "temp": data_final[5],
}

db.collection('chart').document('prediction_day').set(data)
db.collection('average_prediction').add(data)