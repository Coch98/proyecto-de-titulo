import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  // Método para registrar un nuevo usuario
  registerUser(user: any) {
    return this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
      .then(userCredential => {
        // Guardar datos adicionales del usuario en Firestore
        this.firestore.collection('RDU').doc(userCredential.user?.uid).set({
          uid: userCredential.user?.uid, // Guardar el UID del usuario
          name: user.name,
          email: user.email,
          password: user.password,
          emailVerified: false // Puedes usar esto para verificar el correo
        });
        
        // Enviar el correo de verificación
        this.sendEmailVerification();
      });
  }
  async sendEmailVerification() {
    const user = await this.afAuth.currentUser;
    return user?.sendEmailVerification();
  }
}
