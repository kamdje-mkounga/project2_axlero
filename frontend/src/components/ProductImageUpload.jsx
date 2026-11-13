
import { useEffect, useState } from 'react'

function ProductImageUpload({ onImageSelect }) {
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5 MB.')
      event.target.value = ''
      return
    }

    setError('')
    setPreview(URL.createObjectURL(file))
    onImageSelect?.(file)
  }

  function removeImage() {
    setPreview(null)
    setError('')
    onImageSelect?.(null)
  }

  return (
    <div className="form-group">
      <label htmlFor="productImage">Product Image</label>

      <label className="image-upload" htmlFor="productImage">
        {preview ? (
          <img
            className="image-preview"
            src={preview}
            alt="Product preview"
          />
        ) : (
          <>
            <span>📷</span>
            <p>Click here to upload product image</p>
            <small>PNG, JPG or other image formats (Max 5 MB)</small>
          </>
        )}
      </label>

      <input
        id="productImage"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {error && <p className="error-message">{error}</p>}

      {preview && (
        <button type="button" className="secondary-btn" onClick={removeImage}>
          Remove Image
        </button>
      )}
    </div>
  )
}

export default ProductImageUpload
