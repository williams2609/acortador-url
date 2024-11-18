import React from 'react'

function ApiUse() {
    return (
        <div className="container my-5">
          <header className="text-center mb-5"style={{marginTop:'150px',marginBottom:'50px'}}>
            <h1>Documentación de la API de Acortador de URLs</h1>
            <p className="lead">Todo lo que necesitas saber para integrar y utilizar la API.</p>
          </header>
    
          <section className="mb-5">
            <h2>Introducción</h2>
            <p>
              La API de acortador de URLs permite a los usuarios acortar URLs, crear URLs personalizadas, modificar URLs existentes, generar códigos QR y obtener estadísticas de clics en las URLs acortadas. Soporta autenticación mediante:
            </p>
            <ul>
              <li><strong>API Key</strong> (desarrolladores)</li>
            </ul>
            <h5>¿Cómo generar mi API Key?</h5>
<p>
  La API Key es un identificador único que te permite autenticarte como desarrollador en nuestras rutas. 
  Este identificador es necesario para acceder a funcionalidades avanzadas de la API. Sigue los pasos a continuación para generar tu API Key:
</p>
<ul>
  <li>Inicia sesión en tu cuenta de usuario.</li>
  <li>Navega a la sección <strong>Recursos</strong> y selecciona la opción <strong>Generar API Key</strong>.</li>
  <li>Confirma la generación de tu API Key. Si ya tienes una, el sistema te lo notificará.</li>
</ul>
<p>
  Recuerda mantener tu API Key segura y no compartirla con terceros. Si sospechas que ha sido comprometida, 
  solicita una nueva desde el mismo panel.
</p>
          </section>
    
          <section className="mb-5">
          <h2>Autenticación</h2>
            <h3>Uso de API Key (Desarrolladores)</h3>
            <p>Incluye la API Key en los headers de la solicitud:</p>
             <code>x-api-key: &lt;api_key&gt;</code>
          </section>
    
          <section className="mb-5">
            <h2>Gestión de URLs</h2>
    
            <h3>1. Acortar una URL</h3>
            <p><strong>Método:</strong> POST</p>
            <p><strong>Ruta:</strong> <code>/acortar</code></p>
            <p><strong>Descripción:</strong> Crea una URL corta asociada al usuario autenticado.</p>
            <pre>
              <code>
    {`{
      "original_url": "https://example.com",
      "short_url": "my-custom-url"  // Opcional: Para crear una URL personalizada
    }`}
              </code>
            </pre>
            <p><strong>Headers:</strong></p>
            <ul>
              <li><code>x-api-key: &lt;api_key&gt;</code></li>
            </ul>
            <p><strong>Respuesta:</strong></p>
            <ul>
              <li><code>201:</code> {"{ original_url: '...', short_url: '...', expiration_date: null }"}</li>
              <li><code>400:</code> {"{ error: 'Por favor ingrese una URL válida' }"}</li>
              <li><code>403:</code> {"{ error: 'Haz alcanzado el Limite de URLs Permitido por tu tipo de Subscripción' }"}</li>
            </ul>
    
            <h3>2. Modificar una URL existente</h3>
            <p><strong>Método:</strong> PUT</p>
            <p><strong>Ruta:</strong> <code>/modificar/:short_url</code></p>
            <p><strong>Descripción:</strong> Permite modificar una URL corta existente por una nueva personalizada.</p>
            <pre>
              <code>
    {`{
      "new_short_url": "new-custom-url"
    }`}
              </code>
            </pre>
            <p><strong>Headers:</strong></p>
            <ul>
              <li><code>x-api-key: &lt;api_key&gt;</code></li>
            </ul>
            <p><strong>Respuesta:</strong></p>
            <ul>
              <li><code>200:</code> {"{ message: 'La URL corta fue modificada correctamente', short_url: '...', qr_code: '...' }"}</li>
              <li><code>400:</code> {"{ error: 'La nueva URL corta ya existe' }"}</li>
              <li><code>404:</code> {"{ error: 'La URL corta no existe' }"}</li>
            </ul>
    
            <h3>3. Eliminar una URL</h3>
            <p><strong>Método:</strong> DELETE</p>
            <p><strong>Ruta:</strong> <code>/eliminar/:short_url</code></p>
            <p><strong>Headers:</strong></p>
            <ul>
              <li><code>x-api-key: &lt;api_key&gt;</code></li>
            </ul>
            <p><strong>Respuesta:</strong></p>
            <ul>
              <li><code>200:</code> {"{ message: 'URL eliminada correctamente' }"}</li>
              <li><code>404:</code> {"{ error: 'URL no encontrada o no autorizada' }"}</li>
            </ul>
          </section>
    
          <section className="mb-5">
            <h2>Estadísticas de clics</h2>
            <h3>1. Clics por dia</h3>
            <p><strong>Método:</strong> GET</p>
            <p><strong>Ruta:</strong> <code>/clicks/daily</code></p>
            <p><strong>Headers:</strong></p>
            <ul>
              <li><code>x-api-key: &lt;api_key&gt;</code></li>
            </ul>
            <p><strong>Query Parameters:</strong></p>
            <pre>
              <code>
    url_id=&lt;id de la URL&gt;
              </code>
            </pre>

            <h3>1. Clics por hora</h3>
            <p><strong>Método:</strong> GET</p>
            <p><strong>Ruta:</strong> <code>/clicks/hourly</code></p>
            <p><strong>Headers:</strong></p>
            <ul>
              <li><code>x-api-key: &lt;api_key&gt;</code></li>
            </ul>
            <p><strong>Query Parameters:</strong></p>
            <pre>
              <code>
    url_id=&lt;id de la URL&gt;
              </code>
            </pre>
            <p><strong>Respuesta:</strong></p>
            <ul>
              <li><code>200:</code> Lista de horas con conteos de clics.</li>
              <li><code>500:</code> {"{ error: 'Error interno en el servidor' }"}</li>
            </ul>
           
            <p><strong>Respuesta:</strong></p>
            <ul>
              <li><code>200:</code> Lista de horas con conteos de clics.</li>
              <li><code>500:</code> {"{ error: 'Error interno en el servidor' }"}</li>
            </ul>
    
            <h3>2. Total de clics</h3>
            <p><strong>Método:</strong> GET</p>
            <p><strong>Ruta:</strong> <code>/clicks/total</code></p>
            <p><strong>Descripción:</strong> Devuelve el total de clics de una URL específica, agrupados por tiempo.</p>
            <p><strong>Headers:</strong></p>
            <ul>
              <li><code>x-api-key: &lt;api_key&gt;</code></li>
            </ul>
            <p><strong>Query Parameters:</strong></p>
            <pre>
              <code>
    url_id=&lt;id de la URL&gt;
              </code>
            </pre>
            <p><strong>Respuesta:</strong></p>
            <ul>
              <li><code>200:</code> Lista de fechas y conteos de clics.</li>
              <li><code>500:</code> {"{ error: 'Error interno en el servidor' }"}</li>
            </ul>

            <h2>Gestion de Qr</h2>
            <h3>1. Crear Qr</h3>
            <p><strong>Metodo: PUT</strong></p>
            <p><strong>Ruta: </strong><code>/generateQr/:short_url</code></p>
            <p><strong>Descripción: </strong> Crea Un Qr Para El Usuario y lo guarda en la base de datos</p>
            <p><strong>Headers:</strong></p>
            <ul>
              <li><code>x-api-key: &lt;api_key&gt;</code></li>
            </ul>
            <p><strong>Query Parameters:</strong></p>
            <pre>
              <code>
                short_url= &lt;la url corta&gt;
              </code>
            </pre>
            <p><strong>Respuesta</strong></p>
            <ul>
              <li><code>200:</code> Código QR generado correctamente</li>
              <li><code>500:</code> Error interno del servidor</li>
            </ul>
          </section>
    
          <footer className="text-center mt-5">
            <p>&copy; {new Date().getFullYear()} API Acortador de URLs</p>
          </footer>
        </div>
      );
    };
export default ApiUse