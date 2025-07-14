"use client";

import {
  Attachments,
  Bubble,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
} from '@ant-design/x';
import React from 'react';
import {
  CloudUploadOutlined,
  CommentOutlined,
  EllipsisOutlined,
  FireOutlined,
  HeartOutlined,
  PaperClipOutlined,
  ReadOutlined,
  ShareAltOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Badge, Button, type GetProp, Space } from 'antd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useChat } from "ai/react";
import { useState } from "react";
import type { FormEvent } from "react";
import styles from '../app/css/page.module.css'

export function ChatWindow(props: {
  endpoint: string,
  placeholder?: string,
  activeKey: string,
}) {
  const renderTitle = (icon: React.ReactElement, title: string) => (
    <Space align="start">
      {icon}
      <span>{title}</span>
    </Space>
  );

  const placeholderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    {
      key: '1',
      label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, 'Hot Topics'),
      description: 'What are you interested in?',
      children: [
        {
          key: '1-1',
          description: `What's new in X?`,
        },
        {
          key: '1-2',
          description: `What's AGI?`,
        },
        {
          key: '1-3',
          description: `Where is the doc?`,
        },
      ],
    },
    {
      key: '2',
      label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, 'Design Guide'),
      description: 'How to design a good product?',
      children: [
        {
          key: '2-1',
          icon: <HeartOutlined />,
          description: `Know the well`,
        },
        {
          key: '2-2',
          icon: <SmileOutlined />,
          description: `Set the AI role`,
        },
        {
          key: '2-3',
          icon: <CommentOutlined />,
          description: `Express the feeling`,
        },
      ],
    },
  ];

  const senderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    {
      key: '1',
      description: 'Hot Topics',
      icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
    },
    {
      key: '2',
      description: 'Design Guide',
      icon: <ReadOutlined style={{ color: '#1890FF' }} />,
    },
  ];

  const roles: GetProp<typeof Bubble.List, 'roles'> = {
    ai: {
      placement: 'start',
      typing: { step: 5, interval: 20 },
      styles: {
        content: {
          borderRadius: 16,
        },
      },
    },
    local: {
      placement: 'end',
      variant: 'shadow',
    },
  };

  // ==================== Props ====================
  const { endpoint, placeholder, activeKey } = props;

  // ==================== State ====================
  const [headerOpen, setHeaderOpen] = React.useState(false);

  const [content, setContent] = React.useState('');

  const [attachedFiles, setAttachedFiles] = React.useState<GetProp<typeof Attachments, 'items'>>(
    [],
  );
  const [sourcesForMessages, setSourcesForMessages] = useState<Record<string, any>>({});

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess }) => {
      onSuccess(`Mock success return. You said: ${message}`);
    },
  });

  const { onRequest, messages: messages_chat, setMessages: setMessages__chat } = useXChat({
    agent,
  });


  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading: chatEndpointIsLoading, setMessages } =
    useChat({
      api: endpoint,
      onResponse(response: Response) {
        // TODO 响应后处理
        const sourcesHeader = response.headers.get("x-sources");
        const sources = sourcesHeader ? JSON.parse((Buffer.from(sourcesHeader, 'base64')).toString('utf8')) : [];
        const messageIndexHeader = response.headers.get("x-message-index");
        if (sources.length && messageIndexHeader !== null) {
          setSourcesForMessages({ ...sourcesForMessages, [messageIndexHeader]: sources });
        }
      },
      streamMode: "text",
      onError: (e: Error) => {
        toast(e.message, {
          theme: "dark"
        });
      }
    });

  // ==================== Adapter ====================
  // 创建提交事件适配器
  function createSubmitEvent(value?: string): FormEvent<HTMLFormElement> {
    return {
      preventDefault: () => { },
      stopPropagation: () => { },
      target: {
        value: value || ''
      }
    } as unknown as FormEvent<HTMLFormElement>;
  }
  // 创建输出变更适配器
  function createChangeEvent(value: string): React.ChangeEvent<HTMLInputElement> {
    return {
      target: { value },
      currentTarget: { value },
      persist: () => { },
      type: 'change',
      preventDefault: () => { },
      stopPropagation: () => { }
    } as React.ChangeEvent<HTMLInputElement>;
  }
  // ==================== Event ====================
  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!messages.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    if (chatEndpointIsLoading) {
      return;
    }
    handleSubmit();
  }

  const handleSenderSubmit = (value?: string) => {
    if (!value) return;
    setContent('');
    // Sender onSubmit 无法访问完整事件对象
    const event = createSubmitEvent(value);
    // handleSubmit(event);
    // onRequest(value);
    sendMessage(event);
  };

  const handleSenderChange = (value: string) => {
    // Sender onChange 无法访问完整事件对象
    handleInputChange(createChangeEvent(value));
    // 设置 Sender 内容
    setContent(value);
  };

  const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
    onRequest(info.data.description as string);
  };

  const handleFileChange: GetProp<typeof Attachments, 'onChange'> = (info) =>
    setAttachedFiles(info.fileList);

  // ==================== Nodes ====================
  const placeholderNode = (
    <Space direction="vertical" size={16} className={styles.placeholder}>
      <Welcome
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="Hello, I'm  X"
        description="Base on , AGI product interface solution, create a better intelligent vision~"
        extra={
          <Space>
            <Button icon={<ShareAltOutlined />} />
            <Button icon={<EllipsisOutlined />} />
          </Space>
        }
      />
      <Prompts
        title="Do you want?"
        items={placeholderPromptsItems}
        styles={{
          list: {
            width: '100%',
          },
          item: {
            flex: 1,
          },
        }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  );

  console.log("mock", messages_chat)
  console.log("langchain", messages)

  const items: GetProp<typeof Bubble.List, 'items'> = messages_chat.map(({ id, message, status }) => ({
    key: id,
    loading: status === 'loading',
    role: status === 'local' ? 'local' : 'ai',
    content: message,
  }));

  const items_langchain: GetProp<typeof Bubble.List, 'items'> = messages.map(({ id, content, role, createdAt }: any) => ({
    key: id,
    role: role === 'user' ? 'local' : 'ai',
    content,
    createdAt
  }));


  const attachmentsNode = (
    <Badge dot={attachedFiles.length > 0 && !headerOpen}>
      <Button type="text" icon={<PaperClipOutlined />} onClick={() => setHeaderOpen(!headerOpen)} />
    </Badge>
  );

  const senderHeader = (
    <Sender.Header
      title="Attachments"
      open={headerOpen}
      onOpenChange={setHeaderOpen}
      styles={{
        content: {
          padding: 0,
        },
      }}
    >
      <Attachments
        beforeUpload={() => false}
        items={attachedFiles}
        onChange={handleFileChange}
        placeholder={(type) =>
          type === 'drop'
            ? { title: 'Drop file here' }
            : {
              icon: <CloudUploadOutlined />,
              title: 'Upload files',
              description: 'Click or drag files to this area to upload',
            }
        }
      />
    </Sender.Header>
  );

  // ==================== Render =================
  return (
    <div className={styles.chat}>
      {/* 🌟 消息列表 */}
      {
        Number(activeKey) === 1 ? <div
          className={styles.messageList}
        >
          <Bubble.List
            items={items.length > 0 ? items : []}
            roles={roles}
            className={styles.messages}
          />
          <Bubble.List
            items={items.length > 0 ? items : []}
            roles={roles}
            className={styles.messages}
          />
        </div> :
          <Bubble.List
            items={items_langchain.length > 0 ? items_langchain : [{ content: placeholderNode, variant: 'borderless' }]}
            roles={roles}
            className={styles.messages}
          />
      }

      {/* 🌟 提示词 */}
      <Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} />
      {/* 🌟 输入框 */}
      <Sender
        value={content}
        header={senderHeader}
        placeholder={placeholder}
        onSubmit={(v) => {
          handleSenderSubmit(v)
        }}
        onChange={(v) => {
          handleSenderChange(v)
        }}
        prefix={attachmentsNode}
        loading={agent.isRequesting()}
        className={styles.sender}
      />
    </div>
  );
}
