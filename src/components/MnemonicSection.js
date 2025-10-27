import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MnemonicSection = ({ mnemonic }) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  const words = mnemonic?.trim()?.split(/\s+/) || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recovery Phrase</Text>
        <TouchableOpacity onPress={toggle}>
          <Text style={styles.toggle}>{expanded ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      {expanded && (
        <View style={styles.wordsContainer}>
          {words.length ? (
            <View style={styles.wordsGrid}>
              {words.map((word, index) => (
                <View key={`${word}-${index}`} style={styles.wordChip}>
                  <Text style={styles.wordIndex}>{index + 1}</Text>
                  <Text style={styles.wordText}>{word}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>Mnemonic not available.</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: '600',
  },
  toggle: {
    color: '#f8fafc',
    fontWeight: '500',
  },
  wordsContainer: {
    marginTop: 16,
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  wordIndex: {
    color: '#64748b',
    fontWeight: '600',
    marginRight: 6,
  },
  wordText: {
    color: '#e2e8f0',
    fontWeight: '500',
  },
  emptyText: {
    color: '#94a3b8',
  },
});

export default MnemonicSection;
