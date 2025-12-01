import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { Modal, Form, Input, InputNumber, Upload } from 'antd';
import { API_CONFIG, getAuthToken, getAuthHeaders } from '../config/api';
import { PlusOutlined } from '@ant-design/icons';

const AdminProductManagement = () => {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast.error('Bạn chưa đăng nhập!');
        return;
      }

      const headers = getAuthHeaders(false);
      const response = await axios.get(API_CONFIG.PRODUCTS_API, { headers });

      let productsList = [];
      if (Array.isArray(response.data)) {
        productsList = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        productsList = response.data.data;
      } else if (response.data?.products && Array.isArray(response.data.products)) {
        productsList = response.data.products;
      }

      setProducts(productsList);
      console.log('✅ Products loaded:', productsList.length);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      toast.error('Không thể tải danh sách sản phẩm!');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setIsEditMode(true);
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name || product.title,
      description: product.description,
      author: product.author,
      brand: product.brand,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image || product.images?.[0],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      const token = getAuthToken();
      const headers = getAuthHeaders(false);
      await axios.delete(`${API_CONFIG.PRODUCTS_API}/${productId}`, { headers });
      toast.success('Xóa sản phẩm thành công!');
      fetchProducts();
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      toast.error(error?.response?.data?.message || 'Không thể xóa sản phẩm!');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const token = getAuthToken();
      const headers = getAuthHeaders();

      const productData = {
        name: values.name.trim(),
        description: values.description?.trim() || '',
        author: values.author?.trim() || '',
        brand: values.brand?.trim() || '',
        price: values.price,
        category: values.category?.trim() || '',
        stock: values.stock || 0,
        image: values.image || '',
      };

      if (isEditMode && editingProduct) {
        // Update product
        await axios.put(
          `${API_CONFIG.PRODUCTS_API}/${editingProduct._id || editingProduct.id}`,
          productData,
          { headers }
        );
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        // Create product
        await axios.post(API_CONFIG.PRODUCTS_API, productData, { headers });
        toast.success('Thêm sản phẩm thành công!');
      }

      setIsModalOpen(false);
      form.resetFields();
      fetchProducts();
    } catch (error) {
      console.error('❌ Error saving product:', error);
      toast.error(error?.response?.data?.message || 'Không thể lưu sản phẩm!');
    }
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toLocaleString('vi-VN') + ' đ';
    }
    return price || '0 đ';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Thêm sản phẩm
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tác giả</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tồn kho</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id || product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image || product.images?.[0] ? (
                          <img
                            src={product.image || product.images[0]}
                            alt={product.name}
                            className="w-16 h-20 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = '/placeholder.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-image text-gray-400"></i>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{product.name || product.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {product.description || 'Không có mô tả'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.author || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.brand || '—'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.stock || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Chỉnh sửa"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(product._id || product.id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Xóa"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="p-8 text-center text-gray-500">Không có sản phẩm nào</div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Tác giả" name="author">
              <Input placeholder="Nhập tên tác giả" />
            </Form.Item>

            <Form.Item label="Brand" name="brand">
              <Input placeholder="Nhập brand" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Giá"
              name="price"
              rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
            >
              <InputNumber
                className="w-full"
                placeholder="Nhập giá"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
              />
            </Form.Item>

            <Form.Item label="Tồn kho" name="stock">
              <InputNumber className="w-full" placeholder="Nhập số lượng" min={0} />
            </Form.Item>
          </div>

          <Form.Item label="Danh mục" name="category">
            <Input placeholder="Nhập danh mục" />
          </Form.Item>

          <Form.Item label="URL ảnh" name="image">
            <Input placeholder="Nhập URL ảnh sản phẩm" />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  form.resetFields();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {isEditMode ? 'Cập nhật' : 'Thêm'}
              </button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProductManagement;

