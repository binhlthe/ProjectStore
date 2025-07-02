import React, { useState } from 'react';
import Modal from 'react-modal';

const EditVariantModal = ({
  isOpen,
  onRequestClose,
  variant,
  setVariant,
  handleUpdateVariant
}) => {

  const [errors, setErrors] = useState({});

  const validateVariant = () => {
    const newErrors = {};



    if (!variant.price || isNaN(variant.price) || variant.price <= 0) {
      newErrors.price = "Giá phải là số lớn hơn 0.";
    }

    if (!variant.quantity || isNaN(variant.quantity) || variant.quantity < 0) {
      newErrors.quantity = "Số lượng phải là số không âm.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateVariant()) {
      handleUpdateVariant(); // gọi hàm gốc nếu hợp lệ
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{ content: { maxWidth: '500px', margin: '50px auto' } }}
    >
      <h2 className="text-xl font-bold mb-4">Chỉnh sửa mẫu</h2>

      <div className="space-y-4">
        <p><strong>Màu:</strong> {variant?.color}</p>
        <p><strong>Size:</strong> {variant?.size}</p>

        <input
          type="number"
          placeholder="Giá"
          className="w-full border rounded p-2"
          value={variant?.price}
          onChange={(e) =>
            setVariant(prev => ({ ...prev, price: e.target.value }))
          }
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        <input
          type="number"
          placeholder="Số lượng"
          className="w-full border rounded p-2"
          value={variant?.quantity}
          onChange={(e) =>
            setVariant(prev => ({ ...prev, quantity: e.target.value }))
          }
        />
        {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
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
          Lưu
        </button>
      </div>
    </Modal>
  );
};

export default EditVariantModal;