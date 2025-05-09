import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  Typography,
  Card,
  Row,
  Col,
  notification,
} from 'antd';
import { SmileOutlined, FrownOutlined } from '@ant-design/icons';
import API from '../api';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();


  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await API.post('/login', values);
      localStorage.setItem('token', res.data.token);
      api.success({
        message: 'Đăng nhập thành công!',
        description: `Chào mừng, ${values.username}!`,
        icon: <SmileOutlined style={{ color: '#52c41a' }} />,
        placement: 'topRight',
      });
      setTimeout(() => {
        navigate('/calendar');
    }, 2000);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      api.error({
        message: 'Đăng nhập thất bại',
        description: 'Sai tài khoản hoặc mật khẩu. Vui lòng thử lại.',
        icon: <FrownOutlined style={{ color: '#ff4d4f' }} />,
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Row
        justify="center"
        align="middle"
        style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: 16 }}
      >
        <Col xs={24} sm={18} md={12} lg={8} xl={6}>
          <Card
            style={{
              padding: '32px 24px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              backgroundColor: '#fff',
            }}
          >
            <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
              Đăng nhập
            </Title>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Tên đăng nhập"
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
              >
                <Input size="large" placeholder="Nhập tên đăng nhập" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password size="large" placeholder="Nhập mật khẩu" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                  style={{ marginTop: '8px' }}
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </Card>
          <p style={{ textAlign: 'center', marginTop: 16 }}>
            Chưa có tài khoản?{' '}
            <a onClick={() => navigate('/register')} style={{ color: '#1677ff' }}>
              Đăng ký ngay
            </a>
          </p>
        </Col>
      </Row>
    </>
  );
};

export default Login;
