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
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          throw new Error('Este correo ya está en uso');
        } else {
          throw new Error('Error al registrar el usuario');
        }
      });
  }
  async sendEmailVerification() {
    const user = await this.afAuth.currentUser;
    return user?.sendEmailVerification();
  }

  loginUser(user: any) {
    return this.afAuth.signInWithEmailAndPassword(user.email, user.password)
    .then((userCredential) => {
      // Inicio de sesión exitoso
      const loggedInUser = userCredential.user;
      console.log('Inicio de sesión exitoso', loggedInUser);
      // Redirigir o realizar otras acciones necesarias
    })
    .catch((error) => {
      // Manejo de errores
      throw new Error("La combinación de correo y contraseña no corresponde. Vuelve a intentarlo.");
    });
  }

  logoutUser() {
    return this.afAuth.signOut();
  }
  
}
