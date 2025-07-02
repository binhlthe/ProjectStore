import React, { useState } from 'react';
import Modal from 'react-modal';

const AddSizeModal = ({
  isOpen,
  onRequestClose,
  selectedColor,
  sizeOptions,
  newVariant,
  setNewVariant,
  handleAddSize
}) => {

  const [errors, setErrors] = useState({});
  const validateSize = () => {
    const newErrors = {};
    if (!newVariant.size) {
      newErrors.size = "Vui lòng chọn size.";
    }

    if (!newVariant.price || isNaN(newVariant.price) || newVariant.price <= 0) {
      newErrors.price = "Giá phải là số lớn hơn 0.";
    }

    if (!newVariant.quantity || isNaN(newVariant.quantity) || newVariant.quantity < 0) {
      newErrors.quantity = "Số lượng phải là số không âm.";
    }


    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateSize()) {
      handleAddSize();
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{ content: { maxWidth: '500px', margin: '50px auto' } }}
    >
      <h2 className="text-xl font-bold mb-4">
        Thêm size cho màu: <span className="text-blue-600">{selectedColor}</span>
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Chọn size:</label>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => setNewVariant(prev => ({ ...prev, size }))}
                className={`px-3 py-1 rounded border ${newVariant.size === size ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {size}
              </button>
            ))}
          </div>
          {errors.size && <p className="text-red-600 font-medium mt-1">{errors.size}</p>}

        </div>

        <input
          type="number"
          placeholder="Giá"
          className="w-full border rounded p-2"
          value={newVariant.price}
          onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
        />
        {errors.price && <p className="text-red-600 font-medium mt-1">{errors.price}</p>}
        <input
          type="number"
          placeholder="Số lượng"
          className="w-full border rounded p-2"
          value={newVariant.quantity}
          onChange={(e) => setNewVariant({ ...newVariant, quantity: e.target.value })}
        />
        {errors.quantity && <p className="text-red-600 font-medium mt-1">{errors.quantity}</p>}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onRequestClose}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Lưu size
        </button>
      </div>
    </Modal>
  );
};

export default AddSizeModal;
