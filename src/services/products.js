import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { db, storage } from '../firebase/config'

const uploadImage = async (file, productId) => {
  const ext = file.name.split('.').pop()
  const storageRef = ref(storage, `products/${productId}.${ext}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

const deleteImage = async (imageUrl) => {
  if (!imageUrl) return
  try {
    const storageRef = ref(storage, imageUrl)
    await deleteObject(storageRef)
  } catch {
    // ignore — file may already be gone
  }
}

export const addProduct = async (data, imageFile) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...data,
      imageUrl: null,
      createdAt: serverTimestamp(),
    })

    if (imageFile) {
      try {
        const imageUrl = await uploadImage(imageFile, docRef.id)
        await updateDoc(docRef, { imageUrl })
      } catch (imgErr) {
        console.error('Image upload failed (product saved without image):', imgErr)
      }
    }

    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error adding product:', error)
    return { success: false, error: error.message }
  }
}

export const updateProduct = async (id, data, imageFile, oldImageUrl) => {
  try {
    const payload = { ...data, updatedAt: serverTimestamp() }

    if (imageFile) {
      try {
        if (oldImageUrl) await deleteImage(oldImageUrl)
        payload.imageUrl = await uploadImage(imageFile, id)
      } catch (imgErr) {
        console.error('Image upload failed (product saved without new image):', imgErr)
      }
    }

    await updateDoc(doc(db, 'products', id), payload)
    return { success: true }
  } catch (error) {
    console.error('Error updating product:', error)
    return { success: false, error: error.message }
  }
}

export const deleteProduct = async (id, imageUrl) => {
  try {
    if (imageUrl) await deleteImage(imageUrl)
    await deleteDoc(doc(db, 'products', id))
    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: error.message }
  }
}
