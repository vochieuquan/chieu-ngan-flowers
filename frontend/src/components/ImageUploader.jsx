import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ImageUploader = ({ onUploadSuccess, initialImage }) => {
  const [preview, setPreview] = useState(initialImage || '');
  const [uploading, setUploading] = useState(false);
  const { getAuthHeader } = useAuth();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client side size limit validation (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh quá lớn, vui lòng chọn ảnh nhỏ hơn 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPreview(data.url);
        onUploadSuccess(data.url);
      } else {
        alert(data.message || 'Lỗi tải ảnh lên');
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi kết nối server');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onUploadSuccess('');
  };

  return (
    <div className="image-uploader-container">
      {preview ? (
        <div className="image-preview-box">
          <img src={preview} alt="Upload Preview" className="img-preview" />
          <button 
            type="button" 
            onClick={handleRemove} 
            className="remove-preview-btn"
            title="Xoá hình ảnh"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="upload-dropzone">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          {uploading ? (
            <div className="upload-loading-state">
              <Loader2 className="animate-spin text-gold" size={32} />
              <p>Đang tải ảnh lên...</p>
            </div>
          ) : (
            <div className="upload-prompt">
              <Upload size={32} className="text-muted" />
              <p className="upload-prompt-text">Click để tải hình hoa lên</p>
              <span className="upload-limits">Định dạng JPG, PNG (tối đa 5MB)</span>
            </div>
          )}
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
