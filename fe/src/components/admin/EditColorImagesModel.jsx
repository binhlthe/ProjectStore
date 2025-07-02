import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const EditColorImagesModel = ({
  isOpen,
  onRequestClose,
  initialImages = [],
  onSave
}) => {
  const [images, setImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedNewFileIndex, setDraggedNewFileIndex] = useState(null);



  useEffect(() => {
    if (isOpen) {
      setImages(initialImages);
      setNewFiles([]);
    }
  }, [initialImages, isOpen]);

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(prev => [...prev, ...files]);
  };

  const handleSave = async () => {
    let uploaded = [];
    if (newFiles.length > 0) {
      const formData = new FormData();
      newFiles.forEach(file => formData.append("files", file));

      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData
      });

      uploaded = await response.json();
    }

    const updated = [...images, ...uploaded];
    onSave(updated);
    setNewFiles([]);
  };

  const handleDrop = (targetIndex) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    setImages(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(draggedIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
    setDraggedIndex(null);
  };

  const handleDropNewFile = (targetIndex) => {
    if (draggedNewFileIndex === null || draggedNewFileIndex === targetIndex) return;
    setNewFiles(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(draggedNewFileIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
    setDraggedNewFileIndex(null);
  };

  const handleRemoveNewFile = (index) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{ content: { maxWidth: '600px', margin: '50px auto' } }}
    >
      <h2 className="text-xl font-bold mb-4">Chỉnh sửa ảnh cho màu</h2>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative"
              draggable
              onDragStart={() => setDraggedIndex(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(idx)}
            >
              <img
                src={img}
                alt="preview"
                className="w-20 h-20 object-cover border rounded"
              />
              <button
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs"
                onClick={() => handleRemoveImage(idx)}
              >
                ×
              </button>
            </div>
          ))}

        </div>

        <input type="file" multiple accept="image/*" onChange={handleFileChange} />

        {newFiles.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            {newFiles.map((file, i) => (
              <div
                key={i}
                className="relative"
                draggable
                onDragStart={() => setDraggedNewFileIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDropNewFile(i)}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="new"
                  className="w-20 h-20 object-cover rounded border"
                />
                <button
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs"
                  onClick={() => handleRemoveNewFile(i)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}


        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onRequestClose} className="px-4 py-2 border rounded hover:bg-gray-100">
            Hủy
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Lưu ảnh
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditColorImagesModel;
