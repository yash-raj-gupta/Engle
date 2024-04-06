import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signOut, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from '../firebase';

export const signup = async (email, password, username) => {
  let error = "";

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user).then(async () => {
      await updateProfile(user, {
        displayName: username,
      });
      const docRef = doc(db, "Register User Data", user.uid);
      const user_Data = {
        userId: user.uid,
        userName: username,
        createdAt: new Date(),
        email: user.email,
      };
      const docSnap = await getDoc(docRef);

      if (docSnap.exists())
        await updateDoc(docRef, { user_Data });
      else
        await setDoc(docRef, { user_Data });


      // await setDoc(collection(db, "users", user.uid, "user_info"), {
      //   userId: user.uid,
      //   userName: username,
      // });
    }).catch((err) => {
      console.log("There is some error to send the verification link -", err);
    });
  } catch (err) {
    let errorCode = err.code;
    if (errorCode === "auth/email-already-in-use") {
      error = "This email is already in use!";
    } else {
      error = err.message;
    }
  }

  return { error };
};

export const signin = async (email, password) => {
  let error = "";

  try {
    await signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
      const user = userCredential.user;

      if (!user.emailVerified) {
        error = "User not exist!";
      } else {
        localStorage.setItem('authUserId', user.uid);
      }
    }).catch((err) => {
      let errorCode = err.code;
      if (errorCode === "auth/invalid-credential") {
        error = "Email or Password do not match!";
      } else {
        error = err.message;
      }
    });
  } catch (err) {
    error = err.message;
  }

  return { error };
};

export const logout = () => {
  sessionStorage.clear();
  localStorage.clear();
  localStorage.setItem('authUserId', null);
  signOut(auth);
};

export const forgotPassword = async ({ useremail, navigate }) => {
  try {
    await sendPasswordResetEmail(auth, useremail).then(() => {
      navigate("/");
      toast.success("Email verification link sent successfully to your email");
    }).catch((err) => {
      toast.error(err);
    });
  } catch (error) {
    console.log(error);
  }
};