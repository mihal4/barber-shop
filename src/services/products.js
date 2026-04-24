import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'

export const addProduct = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...data,
      createdAt: serverTimestamp(),
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error adding product:', error)
    return { success: false, error: error.message }
  }
}

export const updateProduct = async (id, data) => {
  try {
    await updateDoc(doc(db, 'products', id), {
      ...data,
      updatedAt: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating product:', error)
    return { success: false, error: error.message }
  }
}

export const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, 'products', id))
    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: error.message }
  }
}
