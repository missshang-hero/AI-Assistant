"use client";

import React, { useEffect } from 'react';
import { Button, type GetProp } from 'antd';
import {
  PlusOutlined
} from '@ant-design/icons';
import {
  Conversations
} from '@ant-design/x';
import { ChatWindow } from "@/components/ChatWindow";
import styles from '../app/css/page.module.css'

export default function Home() {
  const defaultConversationsItems = [
    {
      key: '0',
      label: 'LLM ability compare',
    },
    {
      key: '1',
      label: 'hero\'s personal assistant',
    }
  ];
  const logoNode = (
    <div className={styles.logo}>
      <span>xiaopin X</span>
    </div>
  );

  const [conversationsItems, setConversationsItems] = React.useState(defaultConversationsItems);
  const [activeKey, setActiveKey] = React.useState(defaultConversationsItems[0].key);

  useEffect(() => {
    if (activeKey !== undefined) {
      // TODO 选择会话更新窗口内容
      // setMessages([])
      // setMessages__chat([]);
    }
  }, [activeKey]);

  const onConversationClick: GetProp<typeof Conversations, 'onActiveChange'> = (key) => {
    setActiveKey(key);
  };

  const onAddConversation = () => {
    setConversationsItems([
      ...conversationsItems,
      {
        key: `${conversationsItems.length}`,
        label: `New Conversation ${conversationsItems.length}`,
      },
    ]);
    setActiveKey(`${conversationsItems.length}`);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.menu}>
        {/* 🌟 Logo */}
        {logoNode}
        {/* 🌟 添加会话 */}
        <Button
          onClick={onAddConversation}
          type="link"
          className={styles.addBtn}
          icon={<PlusOutlined />}
        >
          New Conversation
        </Button>
        {/* 🌟 会话管理 */}
        <Conversations
          items={conversationsItems}
          className={styles.conversations}
          activeKey={activeKey}
          onActiveChange={onConversationClick}
        />
      </div>
      <ChatWindow
        endpoint="api/chat"
        placeholder="Hello? this is default hero!"
        activeKey={activeKey}
      ></ChatWindow>
    </div>
  );
}
