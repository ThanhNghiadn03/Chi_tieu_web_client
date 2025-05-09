import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Table,
  Typography,
  message,
  Button,
  Card,
  Modal,
  Form,
  Input,
  InputNumber,
  Row,
  Col
} from 'antd';
import dayjs from 'dayjs';
import * as jwtDecode from 'jwt-decode';
import API from '../api';

const { Title } = Typography;

const ExpensesPage = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [form] = Form.useForm();
  const [editingExpense, setEditingExpense] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode.default(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          message.warning('Phiên đăng nhập đã hết hạn');
          navigate('/login');
          return;
        }
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
    } else {
      navigate('/login');
      return;
    }

    fetchExpenses();
  }, [date, navigate]);

  const fetchExpenses = async () => {
    try {
      const res = await API.get(`/expenses/${date}`);
      setExpenses(res.data.expenses || []);
    } catch (err) {
      message.error('Không thể tải dữ liệu chi tiêu');
    }
  };

  const totalAmount = expenses.reduce((sum, item) => sum + item.total_price, 0);

  const openAddModal = () => {
    setEditingExpense(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (record) => {
    setEditingExpense(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleSave = async (values) => {
    const payload = {
      ...values,
      date
    };

    try {
      if (editingExpense) {
        await API.put(`/expenses/${editingExpense._id}`, payload);
        message.success('Cập nhật thành công');
      } else {
        await API.post('/expenses', payload);
        message.success('Thêm mới thành công');
      }

      setIsModalVisible(false);
      fetchExpenses();
    } catch (err) {
      message.error('Lưu thất bại');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await API.delete(`/expenses/${deleteTarget._id}`);
      message.success('Đã xoá thành công');
      fetchExpenses();
    } catch (err) {
      message.error('Xoá thất bại');
    } finally {
      setDeleteModalVisible(false);
    }
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: 'Tên hàng',
      dataIndex: 'item_name',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unit_price',
      render: (price) => `${price.toLocaleString()} đ`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total_price',
      render: (price) => `${price.toLocaleString()} đ`,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <>
          <Button size="small" type="link" onClick={() => openEditModal(record)}>
            Sửa
          </Button>
          <Button
            size="small"
            type="link"
            danger
            onClick={() => {
              setDeleteTarget(record);
              setDeleteModalVisible(true);
            }}
          >
            Xoá
          </Button>
        </>
      ),
    },
  ];

  return (
    <Row justify="center" style={{ padding: 24 }}>
      <Col xs={24} md={22} lg={20} xl={18}>
        <Title level={3}>🧾 Chi tiêu ngày {dayjs(date).format('DD/MM/YYYY')}</Title>

        <Card style={{ overflowX: 'auto' }}>
          <Button type="primary" onClick={openAddModal} style={{ marginBottom: 16 }}>
            Thêm chi tiêu
          </Button>

          <div style={{ minWidth: 600 }}>
            <Table
              dataSource={expenses}
              columns={columns}
              rowKey="_id"
              pagination={false}
              locale={{ emptyText: 'Không có dữ liệu' }}
            />

            <div style={{ textAlign: 'right', marginTop: 16, fontWeight: 'bold' }}>
              Tổng: {totalAmount.toLocaleString()} đ
            </div>
          </div>
        </Card>

        <Button type="link" href="/calendar" style={{ marginTop: 16 }}>
          ← Quay lại lịch
        </Button>
      </Col>

      <Modal
        title={editingExpense ? 'Chỉnh sửa chi tiêu' : 'Thêm chi tiêu'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="item_name"
                label="Tên hàng"
                rules={[{ required: true, message: 'Vui lòng nhập tên hàng' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="unit_price"
                label="Đơn giá"
                rules={[{ required: true, message: 'Vui lòng nhập đơn giá' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="quantity"
                label="Số lượng"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onOk={handleConfirmDelete}
        okText="Xoá"
        okType="danger"
        cancelText="Huỷ"
        title="Xác nhận xoá"
      >
        Bạn có chắc muốn xoá chi tiêu "<b>{deleteTarget?.item_name}</b>"?
      </Modal>
    </Row>
  );
};

export default ExpensesPage;
