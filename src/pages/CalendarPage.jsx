import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Typography, Button, message, List, Space, Row, Col } from 'antd';
import dayjs from 'dayjs';
import API from '../api';

const { Title } = Typography;

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [markedDates, setMarkedDates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchMarkedDates = async () => {
      try {
        const res = await API.get('/expenses-calendar/get-all-dates');
        const dates = Array.isArray(res.data.dates) ? res.data.dates : [];
        console.log(res);
        setMarkedDates(dates);
      } catch (err) {
        message.error('Không thể tải danh sách ngày có chi tiêu');
      }
    };

    fetchMarkedDates();
  }, [navigate]);

  const handleViewExpenses = () => {
    if (!selectedDate) return message.warning('Vui lòng chọn ngày');
    const dateString = selectedDate.format('YYYY-MM-DD');
    navigate(`/expenses/${dateString}`);
  };

  const handleBackToToday = () => {
    setSelectedDate(dayjs());
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    message.success('Đã đăng xuất');
    navigate('/login');
  };

  const dateCellRender = (date) => {
    const match = markedDates.some((d) => dayjs(d).isSame(date, 'day'));
    if (match) {
      return (
        <div style={{ textAlign: 'center' }}></div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: 'auto' }}>
      <Title level={3}>📅 Chọn ngày để xem chi tiêu</Title>

      <Calendar
        fullscreen={false}
        value={selectedDate}
        onSelect={(date) => setSelectedDate(date)}
        dateCellRender={dateCellRender}
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[8, 8]} justify="start" style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8} md={6} lg={5}>
          <Button type="primary" block onClick={handleViewExpenses}>
            Xem chi tiêu {selectedDate.format('DD/MM')}
          </Button>
        </Col>
        <Col xs={24} sm={8} md={6} lg={5}>
          <Button block onClick={handleBackToToday}>
            Quay về hôm nay
          </Button>
        </Col>
        <Col xs={24} sm={8} md={6} lg={5}>
          <Button danger block onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Col>
      </Row>

      <div style={{ marginTop: 40 }}>
        <Title level={4}>📌 Ngày đã ghi chi tiêu</Title>
        <List
          bordered
          dataSource={markedDates.sort((a, b) => dayjs(b).unix() - dayjs(a).unix())}
          renderItem={(item) => (
            <List.Item
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/expenses/${item}`)}
            >
              {dayjs(item).format('DD/MM/YYYY')}
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
