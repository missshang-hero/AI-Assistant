"use client";
import React, { useState } from "react";
import {
  Bubble,
  Sender,
  useXAgent,
  useXChat,
} from "@ant-design/x";
import {
  Card,
  Steps,
  Button,
  Select,
  Alert,
  Space,
  Typography,
  Row,
  Col,
  message,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const employeeInfo = {
  company: "沪禄纪零号品牌管理有限公司",
  store: "娜信(万达店)",
  name: "周三三",
  phone: "15879999999",
  idNumber: "362322999999999999",
  position: "服务员",
  hireDate: "2025.2.15",
  salary: 4800,
  insuranceMonths: 2,
  bankCard: "6222 9999 0202 9999 156",
  bankName: "中国工商银行昆山镜溪支行",
};

export default function ChartXiaoPin() {
  // 1. 用 useXAgent/useXChat 管理对话
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess }) => {
      // 这里可以接入后端，或模拟AI回复
      if (message && message.includes("上传")) {
        onSuccess([{ content: "正在处理，请稍候..." }]);
        setTimeout(() => {
          onSuccess([{ content: "员工信息已处理完成！" }]);
        }, 1500);
      } else {
        onSuccess([{ content: "收到：" + message }]);
      }
    },
  });
  const { messages, onRequest } = useXChat({ agent });

  // 2. 步骤进度与处理状态
  const [currentStep] = useState(2);
  const [processingTime] = useState(48);
  const [selectedProject, setSelectedProject] = useState("扣子--一次性RPO-测试");
  const [input, setInput] = useState("");

  // 3. 处理结果与操作
  const handleDownload = (type: "complete" | "incomplete") => {
    message.success(type === "complete" ? "下载完整信息表格..." : "下载不完整信息表格...");
  };
  const handleAddToRoster = () => {
    message.success("已成功添加20个员工信息至花名册");
  };

  // 4. 步骤条
  const steps = [
    { title: "判断是否是员工信息", description: "判断通过" },
    { title: "提取员工信息", description: "提取完成，共提取到21个员工信息" },
    { title: "处理成标准数据", description: "处理中..." },
  ];

  // 5. 发送消息
  const handleSenderSubmit = (v: string) => {
    if (!v) return;
    onRequest({ message: v });
    setInput("");
  };

  return (
    <Card style={{ maxWidth: 1100, margin: "0 auto", borderRadius: 12 }}>
      <Row gutter={24}>
        {/* 左侧：对话与流程 */}
        <Col span={24}>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <TeamOutlined style={{ color: "#722ed1", fontSize: 24 }} />
              <Title level={5} style={{ margin: 0, color: "#722ed1" }}>
                小班助手-智能导入花名册
              </Title>
            </Space>
          </div>
          {/* 员工信息卡片 */}
          <Card
            style={{
              background: "#f6f0ff",
              marginBottom: 16,
              borderRadius: 8,
              border: "none",
            }}
            bodyStyle={{ padding: 16 }}
          >
            <div>
              <Text strong>入职:</Text> {employeeInfo.company}
              <br />
              <Text strong>门店:</Text> {employeeInfo.store}
            </div>
          </Card>
          <Card
            style={{
              background: "#f8f0ff",
              border: "1px solid #d3adf7",
              borderRadius: 8,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ marginBottom: 12 }}>
              <Text strong>银行卡号：</Text>
              {employeeInfo.bankCard}
              <br />
              <Text strong>开户行：</Text>
              {employeeInfo.bankName}
            </div>
            <div style={{ marginBottom: 12 }}>
              <Space>
                <UserOutlined style={{ color: "#722ed1" }} />
                <Text strong style={{ color: "#722ed1" }}>
                  处理完成（用时{processingTime}秒）
                </Text>
              </Space>
            </div>
            <Paragraph>
              小班已经处理完成了，共整理出21个员工信息；其中20个员工信息完整，可以直接添加至员工花名册；其中1个员工信息不完整，可以点击下载表格查看；是否需要将信息完整的员工添加至花名册？
            </Paragraph>
            <div style={{ marginBottom: 12 }}>
              <Text strong>项目名称：</Text>
              <Select
                value={selectedProject}
                onChange={setSelectedProject}
                style={{ width: "100%" }}
              >
                <Option value="扣子--一次性RPO-测试">扣子--一次性RPO-测试</Option>
                <Option value="其他项目">其他项目</Option>
              </Select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                block
                style={{ background: "#722ed1", borderColor: "#722ed1" }}
                onClick={handleAddToRoster}
              >
                确定添加至花名册
              </Button>
            </div>
            <Alert
              message={
                <span>
                  信息不完整，<a onClick={() => handleDownload("incomplete")}>点击下载表格</a>
                </span>
              }
              type="warning"
              icon={<ExclamationCircleOutlined />}
              showIcon
              style={{ marginBottom: 8 }}
            />
            <Alert
              message={
                <span>
                  信息完整，<a onClick={() => handleDownload("complete")}>点击下载表格</a>
                </span>
              }
              type="success"
              icon={<CheckOutlined />}
              showIcon
            />
          </Card>
          {/* 步骤进度 */}
          <Steps
            direction="vertical"
            current={currentStep}
            items={steps}
            style={{ marginBottom: 16 }}
          />
          {/* 对话流 */}
          <Bubble.List
            items={messages.map((msg, idx) => ({
              key: idx,
              role: msg.role === "user" ? "local" : "ai",
              content: msg.content,
            }))}
            roles={{
              ai: { avatar: <UserOutlined />, placement: "start" },
              local: { placement: "end" },
            }}
            style={{ marginBottom: 16 }}
          />
          {/* 输入框 */}
          <Sender
            value={input}
            onChange={setInput}
            onSubmit={handleSenderSubmit}
            placeholder="请输入内容"
          />
        </Col>
        {/* 右侧：处理结果与操作 */}
      </Row>
    </Card>
  );
}