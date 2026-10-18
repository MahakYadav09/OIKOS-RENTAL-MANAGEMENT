import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const tabs = ['All', 'Hosting', 'Travelling', 'Support'];

const MessagesScreen = () => {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Empty State */}
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Ionicons name="chatbubble-outline" size={28} color="#000" />
        </View>

        <Text style={styles.emptyTitle}>
          You don’t have any messages
        </Text>

        <Text style={styles.emptySubtitle}>
          When you receive a new message, it will appear here.
        </Text>
      </View>
    </View>
  );
};

export default MessagesScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },

  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
  },

  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },

  iconBtn: {
    backgroundColor: '#F2F2F2',
    padding: 10,
    borderRadius: 20,
  },

  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 10,
  },

  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
  },

  activeTab: {
    backgroundColor: '#000',
  },

  tabText: {
    fontSize: 14,
    color: '#000',
  },

  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  emptyIcon: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 30,
    padding: 14,
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    lineHeight: 20,
  },
});
