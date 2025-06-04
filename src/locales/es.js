export default {
    use_instructions: 'Usa la aplicación móvil Phone2Pad para escanear el código QR o ingresa manualmente la IP y el puerto.<br> Asegúrate de que ambos dispositivos estén conectados a la misma red.',
    no_internet_instructions: 'Para conectar tu teléfono y computadora, necesitas una conexión a internet estable.',
    no_vigem_installed_instructions: 'No se detectó el controlador ViGEm. Por favor, descárgalo e instálalo desde este enlace:<br> https://github.com/nefarius/ViGEmBus/releases/download/v1.22.0/ViGEmBus_1.22.0_x64_x86_arm64.exe',
    unknown_error_instructions: 'Se ha producido un error desconocido. Por favor, intenta reiniciar la aplicación. Si el problema persiste, por favor reinstala la aplicación.',
  
    no_internet_connection: 'Sin conexión a internet.',
    internet_connected: 'Conectado en internet.',
  
    ip: 'IP',
    port: 'Puerto',
  
    device: 'Dispositivo',
  
    button_help: 'Ayuda',
    button_language: 'Idioma',
    button_download: 'Descargar',
    button_sponsor: 'Patrocinar',

    language_modal_title: 'Seleccionar idioma',
    language_modal_en: 'Inglés',
    language_modal_zh: 'Chino',
    language_modal_es: 'Español',

    download_title: 'Descargar',
    download_mobile_title: 'Phone2Pad Mobile App.',
    download_mobile_description: 'Escanea el código QR o ingresa manualmente la IP y el puerto para simular un gamepad en tu teléfono.',
    download_vigem_title: 'ViGEmBus Driver.',
    download_vigem_description: 'Vigem driver, necesario para crear un gamepad virtual.',

    download_on_itch_io: 'Descargar en itch.io',
    download_on_github: 'Descargar en GitHub',
    download_on_baidu_pan: 'Descargar en Baidu Pan',

    sponsor_title: 'Apoyar el Proyecto',
    sponsor_support_title: 'Métodos de Apoyo',
    sponsor_contact_title: 'Contáctame',
    sponsor_main_content: `
      <p>¡Gracias por usar Phone2Pad!</p>
      <p>La app es totalmente gratuita, pero su desarrollo y mantenimiento requieren tiempo y esfuerzo. Si te ha sido útil, considera usar los <strong>métodos de apoyo a la derecha</strong> para ayudarme a seguir mejorándola.</p>
      
      <p>Planes Futuros (dentro lo posible):</p>
      <ul>
        <li>Añadir giroscopio y vibración</li>
        <li>Soporte para botones personalizados y touchbar</li>
        <li>Desarrollar conexión automática y Bluetooth</li>
        <li>Soporte para iOS, consolas Linux y PSVita (con tu apoyo, ya que actualmente no puedo costear estos dispositivos 😵)</li>
      </ul>

      <p>No dudes en usar los métodos de contacto a la derecha para contarme que estás usando la app, compartir lo que te gusta o no, ¡y ayudarme a saber que estoy haciendo algo significativo!</p>
    `,
    sponsor_contact_content: `
      <div class="contact-email">aileck.developer@gmail.com</div>
      <a href="mailto:aileck.developer@gmail.com">
        <span>Enviar Correo</span>
      </a>
    `,
    sponsor_kofi: 'Apoyar en Ko-fi',
    sponsor_wechat: 'Apoyar por WeChat',
    help_title: 'Ayuda',
    help_warning: '⚠️ Esta es una versión preliminar. Puede haber riesgos de fallos y pérdida de datos en futuras actualizaciones.',
    help_video_placeholder: 'Video tutorial próximamente',
    help_section_1_title: 'Primeros Pasos',
    help_section_1_content: `
      <ul>
        <li>Instala la aplicación móvil Phone2Pad en tu teléfono</li>
        <li>Instala el controlador ViGEm en tu PC</li>
        <li>Asegúrate de que ambos dispositivos estén en la misma red</li>
        <li>Escanea el código QR o ingresa manualmente la IP y el puerto</li>
      </ul>
    `,
    help_section_2_title: 'Solución de Problemas',
    help_section_2_content: `
      <ul>
        <li>Verifica que los dispositivos estén en la misma red</li>
        <li>Comprueba que el controlador ViGEm esté instalado correctamente</li>
        <li>Intenta reiniciar ambas aplicaciones</li>
        <li>Asegúrate de que el firewall no esté bloqueando la conexión</li>
      </ul>
    `,
    help_section_3_title: 'Características Principales',
    help_section_3_content: `
    <ul>
        <li>Utiliza el teléfono como un mando para PC, compatible con botones virtuales y mandos físicos</li>
        <li>Detecta automáticamente los botones de mandos físicos conectados y transmite las acciones al ordenador</li>
        <li>Compatible con las distribuciones de mando de Xbox 360 y DualShock 4, con soporte para personalización de diseño y estilo de botones</li>
        <li>Permite la conexión simultánea de varios dispositivos móviles para juegos multijugador locales</li>
    </ul>
    `,
    help_section_4_title: 'Personalización de Botones',
    help_video_url: 'https://youtu.be/xxx',
    help_video_text: 'Ver Tutorial',

    window_minimize: 'Minimizar',
    window_maximize: 'Maximizar',
    window_restore: 'Restaurar',
    window_close: 'Cerrar',

    // Añadir traducciones para el diálogo de confirmación de cierre
    window_close_confirm_title: 'Confirmar Acción',
    window_close_confirm_message: 'Después de cerrar la aplicación de escritorio, la aplicación móvil dejará de funcionar. ¿Desea minimizar a la bandeja del sistema?',
    window_close_confirm_minimize: 'Minimizar',
    window_close_confirm_exit: 'Salir',
    window_close_confirm_cancel: 'Cancelar'
}
  