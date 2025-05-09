import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Typography, message, Card, Row, Col } from 'antd';
import API from '../api';

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await API.post('/register', values);
      message.success('Đăng ký thành công, vui lòng đăng nhập!');
      navigate('https://chi-tieu-web-client.vercel.app/login');
    } catch (err) {
      if (err?.response?.data?.error === 'Username already exists') {
        message.error('Tên đăng nhập đã tồn tại');
      } else {
        message.error('Đăng ký thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
            Đăng ký
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
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <p style={{ textAlign: 'center', marginTop: 16 }}>
  Đã có tài khoản?{' '}
  <a onClick={() => navigate('https://chi-tieu-web-client.vercel.app/login')} style={{ color: '#1677ff' }}>
    Đăng nhập
  </a>
</p>

      </Col>
    </Row>
  );
};

export default Register;
