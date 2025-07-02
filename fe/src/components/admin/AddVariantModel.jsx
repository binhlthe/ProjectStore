import React, { useState } from 'react';
import Modal from 'react-modal';

const AddVariantModal = ({
  isOpen,
  onRequestClose,
  colorOptions,
  sizeOptions,
  usedColors,
  newVariant,
  setNewVariant,
  handleImageChange,
  handleAddVariant
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const [errors, setErrors] = useState({});


  const handleRemoveImage = (index) => {
    setNewVariant(prev => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index)
    }));
  };

  const handleDrop = (targetIndex) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    setNewVariant(prev => {
      const updated = [...prev.imageFiles];
      const [moved] = updated.splice(draggedIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return { ...prev, imageFiles: updated };
    });
    setDraggedIndex(null);
  };

  const validateVariant = () => {
    const newErrors = {};

    if (!newVariant.color) {
      newErrors.color = "Vui lòng chọn màu.";
    }

    if (!newVariant.size) {
      newErrors.size = "Vui lòng chọn size.";
    }

    if (!newVariant.price || isNaN(newVariant.price) || newVariant.price <= 0) {
      newErrors.price = "Giá phải là số lớn hơn 0.";
    }

    if (!newVariant.quantity || isNaN(newVariant.quantity) || newVariant.quantity < 0) {
      newErrors.quantity = "Số lượng phải là số không âm.";
    }

    if (!newVariant.imageFiles || newVariant.imageFiles.length === 0) {
      newErrors.imageFiles = "Vui lòng chọn ít nhất 1 ảnh.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateVariant()) {
      handleAddVariant(); 
    }
  };



  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={{ content: { maxWidth: '500px', margin: '50px auto', borderRadius: '10px' } }}>
      <h2 className="text-xl font-bold mb-4">Thêm mẫu mới</h2>
      <div className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Chọn màu:</label>
          <div className="flex flex-wrap gap-2">
            {colorOptions
              .filter(color => !usedColors.includes(color))
              .map(color => (
                <button
                  key={color}
                  onClick={() => setNewVariant(prev => ({ ...prev, color }))}
                  className={`px-3 py-1 rounded border ${newVariant.color === color ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {color}
                </button>

              ))}
            {errors.color && <p className="text-red-600 font-medium mt-1">{errors.color}</p>}

          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Chọn size:</label>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map(size => (
              <button
                key={size}
                onClick={() => setNewVariant(prev => ({ ...prev, size }))}
                className={`px-3 py-1 rounded border ${newVariant.size === size ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {size}
              </button>
            ))}


          </div>
          {errors.size && <p className="text-red-600 font-medium mt-1">{errors.size}</p>}
        </div>

        <input type="number" placeholder="Giá" className="w-full border rounded p-2" value={newVariant.price} onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })} />
        {errors.price && <p className="text-red-600 font-medium mt-1">{errors.price}</p>}
        <input type="number" placeholder="Số lượng" className="w-full border rounded p-2" value={newVariant.quantity} onChange={(e) => setNewVariant({ ...newVariant, quantity: e.target.value })} />
        {errors.quantity && <p className="text-red-600 font-medium mt-1">{errors.quantity}</p>}

        <input type="file" name='files' multiple accept="image/*" className="w-full" onChange={handleImageChange} />
        {errors.imageFiles && <p className="text-red-600 font-medium mt-1">{errors.imageFiles}</p>}


        <div className="flex gap-2 flex-wrap">
          {newVariant.imageFiles.map((file, i) => (
            <div
              key={i}
              className="relative"
              draggable
              onDragStart={() => setDraggedIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
            >
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-16 h-16 object-cover rounded border"
              />
              <button
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs"
                onClick={() => handleRemoveImage(i)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button onClick={onRequestClose} className="px-4 py-2 border rounded hover:bg-gray-100">Hủy</button>
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Lưu mẫu</button>
      </div>
    </Modal>
  );
};

export default AddVariantModal;
