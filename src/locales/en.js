export default {
  preview_version: 'Preview Version',
  loading_instructions: 'Initializing system, please wait...',
  use_instructions: 'Use the Phone2Pad mobile app to scan the QR code or manually enter the IP and port.<br> Make sure both devices are connected to the same network.',
  no_internet_instructions: 'To connect your phone and computer, you need a stable internet connection.',
  no_vigem_installed_instructions: 'ViGEm driver is missing. Please download and install it from the left bar, then restart the application.',
  unknown_error_instructions: 'An unknown error occurred. Please try restarting the application. If the problem persists, please reinstall the application.',

  no_internet_connection: 'No internet connection.',
  internet_connected: 'Internet connection successful.',

  ip: 'IP',
  port: 'Port',

  device: 'Device',

  button_help: 'Help',
  button_language: 'Language',
  button_download: 'Download',
  button_sponsor: 'Sponsor',

  language_modal_title: 'Select Language',
  language_modal_en: 'English',
  language_modal_zh: 'Chinese',
  language_modal_es: 'Spanish',

  download_title: 'Downloads',
  download_mobile_title: 'Phone2Pad Mobile App',
  download_mobile_description: 'Scan QR code or manually enter IP and port to use your phone as a gamepad',
  download_vigem_title: 'Phone2Pad Windows Driver',
  download_vigem_description: 'Install ViGEm driver to enable gamepad emulation',
  download_on_itch_io: 'Download on itch.io',
  download_on_github: 'Download on GitHub',
  download_on_baidu: 'Download on Baidu',
  download_contact_info: 'If any download links are not working, please contact Aileck on ',

  help_title: 'Help',
  help_warning: '⚠️ This is a preview version. There might be risks of crashes and data loss in future updates.',
  help_video_placeholder: 'Tutorial video coming soon',
  help_section_1_title: 'Getting Started',
  help_section_1_content: `
    <ul>
      <li>Install Phone2Pad mobile app on your phone</li>
      <li>Install ViGEm driver on your PC</li>
      <li>Make sure both devices are on the same network</li>
      <li>Scan QR code or manually enter the IP and port shown on desktop app</li>
    </ul>
  `,
  help_section_2_title: 'Troubleshooting',
  help_section_2_content: `
    <ul>
      <li>Ensure devices are on the same network</li>
      <li>Check if ViGEm driver is properly installed</li>
      <li>Try restarting both mobile and desktop apps</li>
      <li>Make sure firewall is not blocking the connection</li>
    </ul>
  `,
  help_section_3_title: 'Main Features',
  help_section_3_content: `
  <ul>
    <li>Use your phone as a PC game controller, supporting both virtual buttons and physical gamepads</li>
    <li>Automatically detects connected physical controllers and transmits input to the computer</li>
    <li>Compatible with Xbox 360 and DualShock 4 layouts, with support for custom button styles and layouts</li>
    <li>Supports simultaneous connection of multiple mobile devices for local multiplayer gaming</li>
  </ul>
  `,
  help_section_4_title: 'Controller Customization',
  help_video_url: 'https://youtu.be/xxx',
  help_video_text: 'Watch Tutorial',

  sponsor_title: 'Support the Project',
  sponsor_support_title: 'Support Methods',
  sponsor_contact_title: 'Contact Me',
  sponsor_main_content: `
    <p>Thank you for using Phone2Pad!</p>
    <p>This app is completely free, but development and maintenance take time and effort. If it has helped you, please consider using the <strong>support methods on the right</strong> to help me keep improving it!</p>
    
    <p>Future Plans (within my capabilities):</p>
    <ul>
      <li>Add gyroscope and vibration feedback</li>
      <li>Support custom buttons and touchbar</li>
      <li>Develop auto-connect and Bluetooth support</li>
      <li>Support iOS, Linux handhelds, and PSVita (with your support, as I currently can't afford these devices 😵)</li>
    </ul>

    <p>Feel free to use the contact methods on the right to let me know you're using the app, share what you like or dislike, and help me know I'm making something meaningful!</p>
  `,
  sponsor_bilibili_link: 'https://space.bilibili.com/2459782',
  send_email: 'Send Email',
  sponsor_kofi: 'Support on Ko-fi',
  sponsor_wechat: 'Support via WeChat',
  controller_customization: "Controller Customization",
  xbox_layout: "Xbox Layout",
  dualshock_layout: "DualShock Layout",
  button_pressed: "Pressed",
  mode_default: "Default Mode",
  mode_swipe: "Swipe Mode",
  mode_toggle: "Toggle Mode",
  controller_customization_desc: "This is a button customization demo. You can try different button behaviors here and then apply the same settings on your mobile app.",

  window_minimize: 'Minimize',
  window_maximize: 'Maximize',
  window_restore: 'Restore',
  window_close: 'Close',

  // Add close confirmation dialog translations
  window_close_confirm_title: 'Confirm Action',
  window_close_confirm_message: 'After closing the desktop app, the mobile app will stop working. Do you want to minimize to system tray?',
  window_close_confirm_minimize: 'Minimize',
  window_close_confirm_exit: 'Exit',
  window_close_confirm_cancel: 'Cancel',

  connected_devices: 'Connected devices'
}
