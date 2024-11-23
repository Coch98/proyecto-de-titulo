import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

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
        return this.firestore.collection('users').doc(userCredential.user?.uid).set({
          uid: userCredential.user?.uid, // Guardar el UID del usuario
          name: user.name,
          email: user.email,
          password: user.password
        });
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

  // Método para iniciar sesión
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

  // Método para cerrar sesión
  logoutUser() {
    return this.afAuth.signOut();
  }

  // Método para obtener el usuario actual
  getCurrentUser() {
    return this.afAuth.authState;
  }
}