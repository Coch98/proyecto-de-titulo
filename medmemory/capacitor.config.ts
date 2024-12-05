import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'medmemory',
  webDir: 'www',
  plugins: {
    LocalNotifications: {
      smallIcon: "splash", // Nombre del ícono para la notificación
      iconColor: "#488AFF"         // Color del ícono (en formato hexadecimal)       
    }
  }
};

export default config;
