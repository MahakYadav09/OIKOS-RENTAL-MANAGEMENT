import { View, StyleSheet } from 'react-native';

type Props = {
  step: number;
  totalSteps: number;
};

export default function ProgressBar({ step, totalSteps }: Props) {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.progress, { width: `${progress}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 4,
    backgroundColor: '#E5E5E5',
  },
  progress: {
    height: 4,
    backgroundColor: '#000',
  },
});
